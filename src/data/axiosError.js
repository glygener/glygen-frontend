
import stringConstants from './json/stringConstants';
import {logActivity} from './logging';

/**
 * Call this function to log error, stop page loading and display error dialog.
 * If page loading needs to be stopped, this function requires parent component to define PageLoader component and pass setPageLoading function.
 * If error dialog needs to be displayed, this function requires parent component to define DialogAlert component and pass setAlertDialogInput function.
 * @param {string} error - error code.
 * @param {string} id - page id.
 * @param {string} msg - error message.
 * @param {function} setPageLoading - function to set PageLoader component state to false.
 * @param {function} setAlertDialogInput - function to set DialogAlert component state and display error dialog.
 */
export const axiosError = (error, id, msg, setPageLoading, setAlertDialogInput) => {
    console.log(error);
    let message = msg || "";
    let pageId = id || "";
    if (error.id === "no_data") {
        logActivity("error", pageId, "No data available. " + message);
        (setPageLoading && setPageLoading(false));
        (setAlertDialogInput && setAlertDialogInput({"show": true, "id": error.error_code}));
    } else if (!error || !(error.data || error.response)) {
        let agent = "";
        if (navigator && navigator.userAgent) {
            agent = navigator.userAgent;
        }
        logActivity("error", pageId, "Network error. " + message + ". " + agent);
        (setPageLoading && setPageLoading(false));
        (setAlertDialogInput && setAlertDialogInput({"show": true, "id": stringConstants.errors.networkError.id}));
    } else if (error.response && !error.data) {
        logActivity("error", pageId, error.response.status + " error status. " + message);
        (setPageLoading && setPageLoading(false));
        (setAlertDialogInput && setAlertDialogInput({"show": true, "id": error.response.status}));
    } else if (error.response && ! error.data["error_list"]) {
        logActivity("error", pageId, error.response.status + " error status. " + message);
        (setPageLoading && setPageLoading(false));
        (setAlertDialogInput && setAlertDialogInput({"show": true, "id": error.response.status}));
    } else if (error.data && error.data["error_list"]) {
        logActivity("error", pageId, error.data["error_list"][0].error_code + " error code. " + message);
        (setPageLoading && setPageLoading(false));
        (setAlertDialogInput && setAlertDialogInput({"show": true, "id": error.data["error_list"][0].error_code}));
    }
}