/**
 * @description ajax calls for the try me questions with static values on the index page.
 * @author Gaurav Agarwal
 * @since Aug 2, 2018
 */

var question = "";

function tryMeAjaxFailure(jqXHR, textStatus, errorThrown) {
    showJsError = true;
    // getting the appropriate error message from this function in utility.js file
    var err = decideAjaxError(jqXHR.status, textStatus);
    var errorCode = jqXHR.responseText ? JSON.parse(jqXHR.responseText).error_list[0].error_code : null;
    var errorMessage = errorCode || err;
    displayErrorByCode(errorMessage);
    activityTracker("error", id, question+": "+err + ": " + errorMessage);
    $('#loading_image').fadeOut();
    showJsError = false;
}

/**
 * @description this prepends the loading image code to the body.
 */
function loadingImg() {
    // style explicitly set to display none so fade In effect can work.
    $('body').prepend("<div id='loading_image' style='display: none;'>" +
        "<img src='images/page_loading.gif' />" +
        "</div>");
    $('#loading_image').fadeIn();
}

/**
 * Q1. - What are the enzymes involved in the biosynthesis of Man5 in human?
 */
function tryBioEnzyme() {
    loadingImg();
    question = "Try me - Q1 - Man5 BioEnzyme";
    var id = "G55220VL";    // Man5 glycan ID
    $.ajax({
        type: 'POST',
        url: getWsUrl("search_bioenzyme", id),
        error: tryMeAjaxFailure,
        success: function (results) {
            if (results.list_id) {
                window.location = './protein_list.html?id=' + results.list_id + "&question=QUESTION_TRY1";
                activityTracker("user", id, question);
                $('#loading_image').fadeOut();
            }
            else {
                displayErrorByCode('no-results-found');
                activityTracker("error", id, question+": no result found");
                $('#loading_image').fadeOut();
            }
        }
    })
}

/**
 * Q2. -  Which proteins have been shown to bear a bi-antennary fully sialated N-Glycan
 *  and which site is this glycan attached to?
 */
function tryGlycanSite() {
    loadingImg();
    question = "Try me - Q2 - bi-antennary fully sialated N-Glycan";
    var id = "G77252PU";
    $.ajax({
        type: 'POST',
        url: getWsUrl("search_glycansite", id),
        error: tryMeAjaxFailure,
        success: function (results) {
            if (results.list_id) {
                window.location = './protein_list.html?id=' + results.list_id + "&question=QUESTION_TRY2";
                activityTracker("user", id, question);
                $('#loading_image').fadeOut();
            }
            else {
                displayErrorByCode('no-results-found');
                activityTracker("error", id, question+": no result found");
                $('#loading_image').fadeOut();
            }
        }
    })
}

/**
 * Q3. - Which glycans might have been synthesized in mouse using Mgat1?
 */
function tryMouseGlycans() {
    loadingImg();
    question = "Try me - Q3 - glycans in mouse using Mgat1";
    var jsonData = {
        "operation": "AND",
        "query_type": "search_glycan",
        "mass": {},
        "number_monosaccharides": {},
        "enzyme": { "type": "gene", "id": "Mgat1" },
        "organism": { "id": 10090, "name": "Mus musculus" }
    };
    var json = "query=" + JSON.stringify(jsonData);

    $.ajax({
        type: 'post',
        url: getWsUrl("glycan_search"),
        data: json,
        error: tryMeAjaxFailure,
        success: function (results) {
            if (results.error_code) {
                showJsError = true;
                displayErrorByCode(results.error_code);
                activityTracker("error", "", question+": " + results.error_code);
                $('#loading_image').fadeOut();
                showJsError = false;
            } else if ((results.list_id !== undefined) && (results.list_id.length === 0)) {
                displayErrorByCode('no-results-found');
                activityTracker("user", "", question+": no result found");
                $('#loading_image').fadeOut();
            } else {
                window.location = './glycan_list.html?id=' + results.list_id + "&question=QUESTION_TRY3";;
                activityTracker("user", "", question);
                $('#loading_image').fadeOut();
            }
        }
    });
}