
const jobStatusQueueKey = "job-status-queue";
const jobCompleteKey = "job-complete-queue";

function getDateTime() {
  var now = new Date();
  var year = now.getFullYear();
  var month = now.getMonth() + 1;
  var day = now.getDate();
  var hour = now.getHours();
  var minute = now.getMinutes();
  var second = now.getSeconds();

  if (month.toString().length === 1) {
    month = "0" + month;
  }
  if (day.toString().length === 1) {
    day = "0" + day;
  }
  if (hour.toString().length === 1) {
    hour = "0" + hour;
  }
  if (minute.toString().length === 1) {
    minute = "0" + minute;
  }
  if (second.toString().length === 1) {
    second = "0" + second;
  }
  var dateTime = year + "/" + month + "/" + day + " " + hour + ":" + minute + ":" + second;
  return dateTime;
}

export const addJobToStore = (jobData) => {
  try {
    const parsedValue1 = localStorage.getItem(jobStatusQueueKey);
    let parsedValue = JSON.parse(parsedValue1);
    let dateTime = getDateTime().trim();
    if (parsedValue) {
      let newJob = {
          serverJobId: jobData.serverJobId,
          clientJobId: parsedValue.nextJobId,
          jobType: jobData.jobType,
          jobTypeInternal: jobData.jobTypeInternal,
          job: jobData.job,
          userfile: jobData.userfile,
          name: jobData.jobType + " " + dateTime,
          startDate: dateTime,
          status: jobData.status,
          result_count: jobData.result_count
        };
        parsedValue.jobDataQueue.push(newJob);
        if (jobData.status === "running") {
          parsedValue.jobPendingQueue.push({"serverJobId": jobData.serverJobId, "clientJobId": parsedValue.nextJobId, "jobType": jobData.jobType, "jobTypeInternal": jobData.jobTypeInternal});
        }
        parsedValue.nextJobId = parsedValue.nextJobId + 1;
    } else {
      parsedValue = {
        "jobDataQueue": [{
          serverJobId: jobData.serverJobId,
          clientJobId: 1,
          jobType: jobData.jobType,
          jobTypeInternal: jobData.jobTypeInternal,
          job: jobData.job,
          userfile: jobData.userfile,
          name: jobData.jobType + " " + dateTime,
          startDate: dateTime,
          status: jobData.status,
          result_count: jobData.result_count
        }],
        "jobPendingQueue": jobData.status === "running" ? [{"serverJobId": jobData.serverJobId, "clientJobId": 1, "jobType": jobData.jobType, "jobTypeInternal": jobData.jobTypeInternal}] : [],
        "nextJobId": 2
      };
    }
    localStorage.setItem(jobStatusQueueKey, JSON.stringify(parsedValue));
  } catch (err) {
  }
};

export const getJobStatusFromStore = () => {
  let jobDataQueue = [];
  try {
    const parsedValue1 =  localStorage.getItem(jobStatusQueueKey);
    let parsedValue = JSON.parse(parsedValue1);
    if (parsedValue && parsedValue.jobDataQueue) {
      jobDataQueue = parsedValue.jobDataQueue;
    }
  } catch (err) {
  }

  return jobDataQueue;

};

export const getPendingJobFromStore = (allJobs) => {
  let jobPendingQueue = [];
  try {
    const parsedValue1 =  localStorage.getItem(jobStatusQueueKey);
    let parsedValue = JSON.parse(parsedValue1);

    if (allJobs && parsedValue && parsedValue.jobDataQueue) {
      jobPendingQueue = parsedValue.jobDataQueue.map(obj => { return {"serverJobId": obj.serverJobId, "clientJobId": obj.clientJobId, "jobType": obj.jobType, "jobTypeInternal": obj.jobTypeInternal}});
    } else if (parsedValue && parsedValue.jobPendingQueue) {
      jobPendingQueue = parsedValue.jobPendingQueue;
    }
  } catch (err) {
  }

  return jobPendingQueue;
};

function getJobExpired (error) {
  let expired = false;
  if (error.error_list) {
    const err = error.error_list.find((code) =>
      code.error_code && code.error_code.includes("job-record-not-found"));
    if (err) {
      expired = true;
    }
  }
  return expired;
}

export const updateJobStatus = (jobDataArray) => {
  let jobDataQueue = [];
  try {
    const parsedValue1 =  localStorage.getItem(jobStatusQueueKey);
    let parsedValue = JSON.parse(parsedValue1);
    let updatedJobQueue = [];
    let updateJobArr= [];
    let pendingJobArr= [];

    if (parsedValue && parsedValue.jobDataQueue) {

      for (let i = 0; i < jobDataArray.length; i++) {
        let jobArrays = parsedValue.jobDataQueue.filter(obj => obj.serverJobId === jobDataArray[i].jobId);
        for (let j = 0; j < jobArrays.length; j++) {
          jobArrays[j].status = jobDataArray[i].status;
          jobArrays[j].result_count = jobDataArray[i].result_count;

          if (jobDataArray[i].error) {
            jobArrays[j].error = jobDataArray[i].error;
            jobArrays[j].expired = getJobExpired(jobDataArray[i].error);
          }

          if (jobDataArray[i].status === "running") {
            pendingJobArr.push({"serverJobId": jobDataArray[i].jobId, "clientJobId": jobArrays[j].clientJobId, "jobType": jobArrays[j].jobType, "jobTypeInternal": jobArrays[j].jobTypeInternal});
          }
        }
        updatedJobQueue.push(...jobArrays);
        updateJobArr.push(jobDataArray[i].jobId);
      }
      let noChangeJobArrays = parsedValue.jobDataQueue.filter(obj => !updateJobArr.includes(obj.serverJobId));

      updatedJobQueue.push(...noChangeJobArrays);

      parsedValue.jobDataQueue = updatedJobQueue;
      parsedValue.jobPendingQueue = pendingJobArr;

      localStorage.setItem(jobStatusQueueKey, JSON.stringify(parsedValue));

    }
  } catch (err) {
  }

  return jobDataQueue;
};


export const updateJobName = (clientJobId, newName) => {
  let jobDataQueue = [];
  try {
    const parsedValue1 =  localStorage.getItem(jobStatusQueueKey);
    let parsedValue = JSON.parse(parsedValue1);
    let updatedJobQueue = [];

    if (parsedValue && parsedValue.jobDataQueue) {
      let jobArrays = parsedValue.jobDataQueue.filter(obj => obj.clientJobId === clientJobId);
      jobArrays[0].name = newName;
      let noChangeJobArrays = parsedValue.jobDataQueue.filter(obj =>  obj.clientJobId !== clientJobId);

      updatedJobQueue.push(...jobArrays);
      updatedJobQueue.push(...noChangeJobArrays);
      parsedValue.jobDataQueue = updatedJobQueue;

      localStorage.setItem(jobStatusQueueKey, JSON.stringify(parsedValue));
    }
  } catch (err) {
  }

  return jobDataQueue;
};

export const deleteJob = (clientJobId) => {
  try {
    const parsedValue1 =  localStorage.getItem(jobStatusQueueKey);
    let parsedValue = JSON.parse(parsedValue1);
    let updateJobArr= [];
    let pendingJobArr= [];

    if (parsedValue && parsedValue.jobDataQueue) {
        updateJobArr = parsedValue.jobDataQueue.filter(obj => obj.clientJobId !== clientJobId);
        pendingJobArr = parsedValue.jobPendingQueue.filter(obj => obj.clientJobId !== clientJobId);
    }

    parsedValue.jobDataQueue = updateJobArr;
    parsedValue.jobPendingQueue = pendingJobArr;

    if (updateJobArr.length > 0) {
      localStorage.setItem(jobStatusQueueKey, JSON.stringify(parsedValue));
    } else {
      localStorage.removeItem(jobStatusQueueKey);
      localStorage.removeItem(jobCompleteKey);
    }

  } catch (err) {
  }
};

export const setJobCompleteValue = (value) => {
  try {
    localStorage.setItem(jobCompleteKey, JSON.stringify(value));
  } catch (err) {
  }
};

export const getJobCompleteValue = (allJobs) => {
  let value = false;
  try {
    const parsedValue1 =  localStorage.getItem(jobCompleteKey);
    let parsedValue = JSON.parse(parsedValue1);

    if (parsedValue !== undefined && parsedValue !== null) {
      value = parsedValue;
    }
  } catch (err) {
  }
  return value;
};

export const getJobValue = (clientJobId) => {
  let jobValue= {};

  try {
    const parsedValue1 =  localStorage.getItem(jobStatusQueueKey);
    let parsedValue = JSON.parse(parsedValue1);

    if (parsedValue && parsedValue.jobDataQueue) {
      jobValue = parsedValue.jobDataQueue.find(obj => obj.clientJobId === clientJobId);
    }
  } catch (err) {
  }

  return jobValue;
};

