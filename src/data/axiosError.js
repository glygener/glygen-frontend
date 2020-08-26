
import stringConstants from './json/stringConstants';
import {logActivity} from './logging';

export const axiosError = (error, id, msg, setPageLoading, setAlertDialogInput) => {
    console.log(error);
    let message = msg || "";
    let pageId = id || "";
    if (!error.response) {
        logActivity("error", pageId, "Network error. " + message);
        (setPageLoading && setPageLoading(false));
        (setAlertDialogInput && setAlertDialogInput({"show": true, "id": stringConstants.errors.networkError.id}));
    } else if (error.response && !error.response.data) {
        logActivity("error", pageId, error.response.status + " error status. " + message);
        (setPageLoading && setPageLoading(false));
        (setAlertDialogInput && setAlertDialogInput({"show": true, "id": error.response.status}));
    } else if (error.response.data && error.response.data["error_list"]) {
        logActivity("error", pageId, error.response.data["error_list"][0].error_code + " error code. " + message);
        (setPageLoading && setPageLoading(false));
        (setAlertDialogInput && setAlertDialogInput({"show": true, "id": error.response.data["error_list"][0].error_code}));
    }
}