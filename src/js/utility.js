// @author: Rupali Mahadik
// @update: Aug 6, 2018 - Gaurav Agarwal - added ajax error cases.
// @update: Aug 27, 2018 - Gaurav Agarwal - function to return ajax timeout values and ajax error-failure handling functions.
// @added: Oct 19, 2018 - Gaurav Agarwal - data download function.

/** page ID, mainly used to be passed to the ajaxFailure function */
var id = null;

/**
 * function addCommas is a regular expression is used on nStr to add the commas
 * @param {integer} nstr gets divide
 * @returns {number} Number with commas
 */
function addCommas(nStr) {
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;

    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }

    return x1 + x2;
}


function databasecolor(name) {
    switch (name) {
        case 'GlycomeDB': return '#a06868';
        case 'UniCarbKB': return '#6b7f71';
        case 'UniProtKB': return '#4b8aa0';
        case 'PubMed': return '#7c985d';
        case 'RefSeq': return '#3ea2ad';
        case 'Ensembl Peptide': return '#936caf';
        case 'Ensembl Transcript': return '#b971a6';
        case 'OMIM': return '#8d85fa';
        case 'BioMuta': return '#7975af';
        case 'Bgee': return '#798bae';
        case 'BioXpress': return '#7f989a';
        case 'mgi': return '#ff8080';
        case 'hgnc': return '#518a8a';
        case 'homologene': return '#9a039a';
        case 'oma': return '#bbea5e';

    }
}


function getErrorMessage(errorCode) {
    // This can appended to the end of the error message displayed for the user to be able to quickly contact us.
    var contactUsMsg = " If the problem persists then you may <a href='contact.html' >contact us</a>";

    switch (errorCode) {
        case 'invalid-query-json':
            return {
                message: "This is not a valid input. Please try again.",
                title: "Invalid Input Error"
            };
        case 'open-connection-failed':
            return {
                message: "Sorry, we couldn't connect to database.",
                title: "Unexpected Error"
            };
        case 'unexpected-field-in-query':
            return {
                message: "This is an unexpected field input. Please try again",
                title: "Unexpected Field Input Error"
            };
        case 'invalid-parameter-value-length':
            return {
                message: "Please input a value and try again.",
                title: "Missing Input Value"
            };
        case 'no-search-criteria-submitted':
            return {
                message: "Input error occurred. Please provide input a term to search for.",
                title: "Unexpected Error"
            };
        case 'non-existent-record':
            return {
                message: "No record exist for the submitted ID",
                title: "Selection Error"
            };
        case 'invalid-parameter-value':
            return {
                message: "Please input correct field values",
                title: "Selection Error"
            };
        case 'non-existent-search-results':
            return {
                message: "No results found for your search query",
                title: "Selection Error"
            };
        case 'missing parameter':
            return {
                message: "Please choose a different number of records per page.",
                title: "Selection Error"
            };
        case 'no-results-found':
            return {
                message: "Sorry, we couldn't find any data matching your input. Please change your search term and try again.",
                title: "No Results Found"
            };

        case 'missing-parameter':
            return {
                message: "Missing search term",
                title: "Selection Error"
            };
        case 'missing-query-key-in-query-json':
            return {
                message: "Incorrectly formatted request.",
                title: "Format error"
            };
        case 'download-type-format-combination-not-supported':
            return {
                message: "Selected Download format is not supported for this page",
                title: "Selection Error"
            };
        case 'download-type-not-supported':
            return {
                message: "Downloading this page is not supported.",
                title: "Selection Error"
            };
        case 'non-existent-mime-type-for-submitted-format':
            return {
                message: "Sorry. We do not support the requested file format.",
                title: "Selection Error"
            };

        case 'timeout':
            return {
                message: "Sorry, the server didn't respond. Please try again later." + contactUsMsg,
                title: "TimeOut Error"
            };

        case 'parsererror':
            return {
                message: "There was an error in the data received. We are looking into it." + contactUsMsg,
                title: "Parsing Error"
            };

        case 'abort':
            return {
                message: "Sorry, your requested was aborted. Please try again." + contactUsMsg,
                title: "Request Aborted"
            };

        case 'js_error':
            return {
                message: "Oops, there seems to be some issue on this page. "
                    + "Sorry, for the inconvenience. "
                    + "We've recorded this issue and are looking into it." + contactUsMsg,
                title: "Website Error"
            };

        case 0:
            return {
                message: "Could not connect to the server." + contactUsMsg,
                title: "Not Connected"
            };

        case 404:
            return {
                message: "Could not connect to the server." + contactUsMsg,
                title: "Server not found"
            };

        case 500:
            return {
                message: "An Internal server error occured. We are doing our best to resolve it." + contactUsMsg,
                title: "Server error"
            };

        default:
            return {
                message: "Oops, something went wrong. Please try again later." + contactUsMsg,
                title: "Unexpected Error"
            };
    }
}

/**
 * Display Error message using alertify
 */
function displayError(message, title) {
    var pagePath = window.location.pathname;
    if (title == "No Results Found") {
        $(".alert").show();
        $('html, body').animate({ scrollTop: 0 }, 'slow');
    }
    else {
        if (pagePath.substring(pagePath.lastIndexOf('/') + 1).toLocaleLowerCase().includes("list")) {
            // for all list pages, if any error occurs, it will go back to the previous page.
            alertify.alert(title, message, function () { window.history.back(); }).set('modal', false);
        } else {
            alertify.alert(title, message).set('modal', false);
        }
    }
}

function displayErrorByCode(errorCode) {
    var error = getErrorMessage(errorCode);
    displayError(error.message, error.title);
}

/**
 * Gives the timeout value for ajax calls to repective web services.
 * @param {string} ajaxWebService - The name of web service being called.
 * @return timeout value in milliseconds.
 */
function getTimeout(ajaxWebService) {
    // useCase question
    var usecaseQ1 = 10000,
        usecaseQ2 = 10000,
        usecaseQ3 = 10000,
        usecaseQ4 = 10000,
        usecaseQ5 = 10000,
        usecaseQ6 = 10000,
        usecaseQ7 = 10000,
        usecaseQ8 = 10000,
        usecaseQ9 = 10000;

    // search Init
    var searchInitGlycan = 10000,
        searchInitProtein = 10000,
        searchInitGlycoP = 10000,
        homeInit = 10000;

    // search
    var searchGlycan = 60000,   //10000,
        searchProtein = 60000,  //10000;
        searchSimpleGlycan = 60000,
        searchSimpleProtein = 60000;

    // list
    var listGlycan = 10000,
        listProtein = 10000,
        listLocus = 10000;

    // detail
    var detailGlycan = 5000,
        detailProtein = 5000,
        detailMotif = 5000;

    // contact us
    var contact = 5000;

    switch (ajaxWebService.toLowerCase()) {
        // glycan
        case "search_init_glycan":
            return searchInitGlycan;
        case "search_glycan":
            return searchGlycan;
        case "list_glycan":
            return listGlycan;
        case "detail_glycan":
            return detailGlycan;
        case "detail_motif":
            return detailMotif;
        case "home_init":
            return homeInit;
        case "glycan_search_simple":
            return searchSimpleGlycan;

        // protein
        case "search_init_protein":
            return searchInitProtein;
        case "search_protein":
            return searchProtein;
        case "list_protein":
            return listProtein;
        case "detail_protein":
            return detailProtein;
        case "protein_search_simple":
            return searchSimpleProtein;

        // Glycoprotein
        case "search_init_glycoprotein":
            return searchInitGlycoP;

        // useCase
        case "usecase_q1":
            return usecaseQ1;
        case "usecase_q1":
            return usecaseQ2;
        case "usecase_q1":
            return usecaseQ3;
        case "usecase_q1":
            return usecaseQ4;
        case "usecase_q1":
            return usecaseQ5;
        case "usecase_q1":
            return usecaseQ6;
        case "usecase_q1":
            return usecaseQ7;
        case "usecase_q1":
            return usecaseQ8;
        case "usecase_q1":
            return usecaseQ9;

        // locus list
        case "loci_list":
            return listLocus;

        // contact us
        case "contact":
            return contact;

        default:
            return 5000;
    }
}

/**
 * logs appropriate search_init WS error message.
 * @param {*} jqXHR
 * @param {*} textStatus
 * @param {*} errorThrown
 */
function searchInitFailure(jqXHR, textStatus, errorThrown) {
    var err = decideAjaxError(jqXHR.status, textStatus);
    var errorCode = jqXHR.responseText ? JSON.parse(jqXHR.responseText).error_list[0].error_code : null;
    var errorMessage = errorCode || errorThrown;
    activityTracker("error", "", err + ": " + errorMessage + ": search_init WS error");
    $('#loading_image').fadeOut();
}

/**
 * Displays and logs appropriate WS error message.
 * Common error handling method.
 * @param {*} jqXHR
 * @param {*} textStatus
 * @param {*} errorThrown
 */
function ajaxFailure(jqXHR, textStatus, errorThrown) {
    showJsError = true;
    // getting the appropriate error message from this function in utility.js file
    var err = decideAjaxError(jqXHR.status, textStatus);
    var errorCode = jqXHR.responseText ? JSON.parse(jqXHR.responseText).error_list[0].error_code : null;
    var errorMessage = errorCode || err;
    displayErrorByCode(errorMessage);
    activityTracker("error", id, err + ": " + errorMessage);
    $('#loading_image').fadeOut();

    // if the window.onerror is not triggered then explicitly flip the boolean variable.
    showJsError = false;
}

/**
 * Displays and logs appropriate WS error message.
 * Common error handling method for LIST pages.
 * @param {*} jqXHR
 * @param {*} textStatus
 * @param {*} errorThrown
 */
function ajaxListFailure(jqXHR, textStatus, errorThrown) {
    showJsError = true;
    // getting the appropriate error message from this function in utility.js file
    var err = decideAjaxError(jqXHR.status, textStatus);
    var errorCode = jqXHR.responseText ? JSON.parse(jqXHR.responseText).error_list[0].error_code : null;
    var errorMessage = errorCode || err;
    displayErrorByCode(errorMessage);
    activityTracker("error", id, err + ": " + errorMessage + " (page: " + page + ", sort: " + sort + ", dir: " + dir + ", limit: " + limit + ")");
    showJsError = false;
}

/**
 * gives general error message for the ajax call.
 * @param {*} jqStatus
 * @param {*} textStatus
 * @return error message.
 */
function decideAjaxError(jqStatus, textStatus) {
    var err = textStatus;
    // if (textStatus === 'timeout' || textStatus === 'abort' || textStatus === 'parsererror') {
    //     err = textStatus;
    // }
    // else 
    if (jqStatus === 0 || jqStatus === 404 || jqStatus === 500) {
        err = jqStatus;
    }
    // else {
    //     err = textStatus;
    // }
    return err;
}

/**
 * This will download the data of the respective page in the user selected format.
 * @author Gaurav Agarwal
 * @since 19th Oct 2018.
 * 
 * @param {string} id the ID of the glycan or protein page. (ex.: uniprot_canonical_ac)
 * @param {string} format the file format or mimeType of the data to be received.
 * @param {boolean} compressed "true" to receive compressed data otherwise it is "false".
 * @param {string} type the page whose data needs to be downloaded.
 */
function downloadFromServer(id, format, compressed, type) {
    var download_query = {
        "id": id,
        "type": type,
        "format": format,
        "compressed": compressed
    };
    $('#loading_image').fadeIn();

    var mimeType = "text";
    var ext = "";
    if (format === "csv") {
        mimeType = "text/csv";
        ext = ".csv";
    } else if (format === "fasta") {
        mimeType = "text/plain";
        type = "protein_sequence";
        ext = ".fasta";
    } else if (format === "json") {
        mimeType = "application/json";
        ext = ".json";
    } else if (format === "image") {
        mimeType = "image/png";
        ext = ".png";
    } else if (format === "tsv") {
        mimeType = "text/tsv";
        ext = ".tsv";
    }

    $.ajax({
        method: 'POST',
        dataType: "text",
        url: getWsUrl('data_download') + "?query=" + JSON.stringify(download_query),
        success: function (result) {
            //uses the download.js library.
            download(result, type + "_" + id + ext, mimeType);        // + "." + format
            activityTracker("user", id, "successful download");
            $('#loading_image').fadeOut();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            showJsError = true;
            // getting the appropriate error message from this function in utility.js file
            var err = decideAjaxError(jqXHR.status, textStatus);
            var errorCode = jqXHR.responseText ? JSON.parse(jqXHR.responseText).error_list[0].error_code : null;
            var errorMessage = errorCode || err;
            displayErrorByCode(errorMessage);
            activityTracker("error", id, "Download error: " + errorMessage);
            $('#loading_image').fadeOut();
            showJsError = false;
        }
    });
}

// for stopping the download dropdown to close on click.
$(document).on('click', '.gg-download', function (e) {
    e.stopPropagation();
});

/**
 * 
 * @param {String} date Date string returned by backend (format: YYYY-MM-DD hh:mm:ss Z offset)
 * returns date string in MM/DD/YYYY format
 */
function getDateMMDDYYYY(date) {
    var monthNames = [
        "Jan", "Feb", "Mar",
        "Apr", "May", "Jun", "Jul",
        "Aug", "Sep", "Oct",
        "Nov", "Dec"
    ];

    var day = date.slice(8, 10);
    var monthIndex = parseInt(date.slice(5, 7)) - 1;
    var year = date.slice(0, 4);

    return day + '/' + monthNames[monthIndex] + '/' + year;
}


/**
 * getParameterByName function to Extract query parameters from url
 * @param {string} name - The name of the variable to extract from query string
 * @param {string} url- The complete url with query string values
 * @return- A new string representing the decoded version of the given encoded Uniform Resource Identifier (URI) component.
 */
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

/**
 * 
 * @param {} labelId 
 * @param {} key 
 */
/**
 * Populates a label using the key-value json file
 * @param {String} controlId The id of the control to populate
 * @param {String} key Key of the value to populuate
 * @param {String} prefix Prefix to the value
 * @param {String} suffix Suffix to the value
 * @param {integer} contentsIndex The index in the contents() array of the control where the text is to be put
 */

function populateFromKeyValueStore(controlId, key, prefix, suffix, contentsIndex) {
    contentsIndex = contentsIndex || 0;
    $.getJSON("content/key-value.json", function (jsonData) {
        $("#" + controlId).contents()[contentsIndex].data = prefix + jsonData[key].display_name + suffix;
    });
}
// for Data and SPARQL link in header page
$(function () {
    $("#a_data").attr('href', ws_base_data);
    //$("#a_sparql").attr('href', ws_base_sparql);
});


// Details pages scrolling to top :
// function scrollToPanel(hash) {
//     //to scroll to the particular sub section.
//     $(hash).next('.cd-faq-content').slideToggle(200).end().parent('li').toggleClass('content-visible');
//     if ($(window).width() < 768) { //mobile view
//         $('.cd-faq-items').scrollTop(0).addClass('slide-in').children('ul').removeClass('selected').end().children(hash).addClass('selected');
//         $('.cd-close-panel').addClass('move-left');
//         $('body').addClass('cd-overlay');
//     } else {
//         $('body,html').animate({
//             'scrollTop': $(hash).offset().top - 19
//         }, 200);
//     }
// }

// if (window.location.hash) {
//     scrollToPanel(window.location.hash);
// }
