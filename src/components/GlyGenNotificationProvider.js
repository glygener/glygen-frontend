import React, { useState } from 'react';
import GlyGenNotificationContext from "./GlyGenNotificationContext.js";

const GlyGenNotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);
  const [jobComplete, setJobComplete] = useState(null);
  const [totalJobs, setTotalJobs] = useState(0);
  const [totalCartIds, setTotalCartIds] = useState(0);

  const showNotification = (message) => {
    setNotification(message);
  };

  const hideNotification = () => {
    setNotification(null);
  };

  const showJobCompleteNotification = (jobCompl) => {
    setJobComplete(jobCompl);
  };

  const showTotalJobsNotification = (totJobs) => {
    setTotalJobs(totJobs);
  };

  const showTotalCartIdsNotification = (totIds) => {
    setTotalCartIds(totIds);
  };

  return (
    <GlyGenNotificationContext.Provider value={{ notification, showNotification, hideNotification, jobComplete, showJobCompleteNotification, totalJobs, showTotalJobsNotification, totalCartIds, showTotalCartIdsNotification }}>
      {children}
    </GlyGenNotificationContext.Provider>
  );
};

export default GlyGenNotificationProvider;