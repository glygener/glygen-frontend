/**
* @description calls the global search web service with the search query and displays the result
* @author Gaurav Agarwal
* @since Jan 14, 2019
*/

/**
 * This is a global variable for the searched term. 
 * It's kept global because it is accessed in all the functions.
 */
var term = '';

/**
 * gets the url parameter value from utility.js->getParameterByName() function
 * and calls the ajax function.
 */
$(document).ready(function () {
    term = getParameterByName('search_query');
    id = term;
    $('#display_search_term').text(term);
    loadResult();
});


/**
 * This is the success handling function for the ajax call.
 * @param {JSON} result the json data received from web service
 */
function ajaxSuccess(result) {
    // $('#result').text(JSON.stringify(result));
    var template = $('#result_template').html();
    var content = Mustache.to_html(template, result);
    $('#result').html(content);
    $(".gg-search-term").text("\""+term+"\"");

    // this appends a url query parameter containing the global search term 
    // to every link pointing to the list page.
    $("a.directToListPage").attr("href", function(i, href) {
        return href + '&gs='+term;
    });

    $('#loading_image').fadeOut();
    activityTracker("user", term, "successful search");
}

/**
 * This funciton makes the ajax call to the web service with the search query term.
 */
function loadResult() {
    var search_query = {
        "term": term
    };

    $.ajax({
        dataType: "json",
        url: getWsUrl("global_search") + "?query=" + JSON.stringify(search_query),
        method: 'GET',
        success: ajaxSuccess,
        error: ajaxFailure
    });
}