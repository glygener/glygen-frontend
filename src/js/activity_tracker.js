/**
 * @author: Gaurav Agarwal
 * @description: assigns ID and tracks user activity.
 */
// @modified: Pradeep Kumar on 10 May 2018
// @update: July 5, 2018 - Gaurav Agarwal - Anonymous user logging for those users who opt out.
// @update: July 16, 2018 - Gaurav Agarwal - javascript errors and exception logging

/**
 * This variable is used to make sure that 
 * the pop up error due to Javascript code error 
 * is shown only when it's value is set true.
 */
var showJsError = false;

/**
 * This basically checks the browser support for Web storage (i.e. localStorage)
 * and also logs the page visit activity.
 */
function tracking() {
    var txt = '';
    var track_banner = document.getElementById("tracking_banner");
    // track_banner.style.display = "none";
    /* Check browser support */
    if (typeof (Storage) !== "undefined") {
        if (!localStorage.getItem("ID")) {
            /* If nothing in the local storage then give the user a choice. */
            track_banner.style.display = "block";
        }
        activityTracker("user");
    } else {
        txt = "Please update your browser to the latest version in order to access all our website features.";
        displayBannerMsg(txt);
    }
}

/**
 * This is called when the user selects to be logged.
 * Gets the ID from Web Service and stores in the localStorage of the browser.
 */
function logID() {
    var txt = "We will log your actions to improve the user experience. You can always change this setting in <strong>My GlyGen</strong>.";
    var user_id = "No ID assigned";
    $.ajax({
        type: 'post',
        url: getWsUrl("generate_ID"),
        data: 'json',
        success: function (results) {
            if (results.error_code) {
                console.log(results.error_code);
            } else {
                user_id = results.user;
                localStorage.setItem("ID", user_id);     //Store the ID from the webservice
                displayBannerMsg(txt);
                activityTracker("user", null, "Enabled Logging");
            }
        },
        failure: function (response) {
            console.log("Log user ID generation failure: " + response);
        }
    });

}

/**
 * This is called when the user chooses not to be logged.
 * Stores the ID as "Anonymous" in the localStorage of the browser.
 */
function doNotLog() {
    localStorage.setItem("ID", "Anonymous");
    var txt = "We will not log your actions. You can always change this setting in <strong>My GlyGen</strong>.";
    displayBannerMsg(txt);
    activityTracker("user", null, "Disabled Logging");
}

/**
 * clears the localStorage i.e. it removes the stored ID.
 */
function clearLocalStore() {
    localStorage.removeItem("ID");
}

/**
 * Just displays the appropriate message in the banner 
 * and automatically makes it dissapear after the set time.
 * @param {string} txt The message to be displayed in the tracking prompt banner.
 */
function displayBannerMsg(txt) {
    var track_banner = document.getElementById("tracking_banner");
    track_banner.style.display = "block";
    track_banner.innerHTML = "<span>" + txt + "</span><span id='close_banner' style='float: right'>&times;</span>";
    var close = function () {
        track_banner.style.display = "none";
    };
    setTimeout(close, 10000);
    document.getElementById("close_banner").onclick = close;
}

/**
 * This is the main function which logs the events.
 * It sends logs to the web service in the defined format.
 * 
 * @param {string} type the log type - whether an error or normal access.
 * @param {string} id the ID of the glycan/protein/glycoprotein - list/detail page.
 * @param {string} message descriptive message of the log.
 */
function activityTracker(type, id, message) {
    type = type || "user";
    id = id || "";
    message = message || "page access";
    var user = localStorage.getItem("ID");
    var pagePath = window.location.pathname;

    if (user == null) {
        /* defining the users who have not yet decided an option of activity logging. */
        user = "Undecided";
    }

    var data = {
        "id": id,                         //  "glycan/search ID"
        "user": user,
        "type": type,                     //    "user" or "error"
        "page": pagePath.substring(pagePath.lastIndexOf('/') + 1),
        "message": message
    };
    console.log(data);

    $.post(getWsUrl("log_activity"), { query: JSON.stringify(data) })
        .done(function (resp) {
            if (resp.error_list) {
                console.log(resp);
            }
        })
        .fail(function (resp) {
            console.log(resp);
        });
}

/**
 * to get the attribute value from the url, modified to give only one attribute value.
 * @return {string} the ID of the list or detail page.
 */
function getUrlVars() {
    var vars = {};
    var attr = "";
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
        attr = value;
    });
    return attr;
    // return vars;
}

/**
 * logging javascript errors and exceptions
 * @param {*} msg the error.
 * @param {*} url the complete path to the file in which the error occured.
 * @param {*} line the line in the file at which the error occured.
 * @param {*} col the column position of the error (new to the HTML 5 spec and may not be supported in every browser).
 * @param {*} error more detail about the error (new to the HTML 5 spec and may not be supported in every browser).
 */
window.onerror = function (msg, url, line, col, error) {
    // hide the loading gif
    $('#loading_image').fadeOut();
    activityTracker("error", getUrlVars(), "JS Error: " + msg + "\nurl: " + url + "\nline: " + line);
    if(showJsError){
        displayErrorByCode("js_error");
        showJsError = false;
    }
    var suppressErrorAlert = false;
    // If you return true, then error alerts (like in older versions of 
    // Internet Explorer) will be suppressed.
    return suppressErrorAlert;
};