
//@Author: Rupali Mahadik.
// @description: UO1 Version-1.1.
//@Date:19th Feb 2018.- with Rupali Mahadik dummy webservice
//@update:3 April 2018. with Rupali Mahadik real web service
//@update: June 26-2018- with Rupali Mahadik web service changes.
// @update: pagination change Rupali Mahadik.
//@update: July 11, 2018 - Gaurav Agarwal - added user tracking navigation on pagination table.
// @update on July 25 2018 - Gaurav Agarwal - added code for loading gif.
// @update: July 27, 2018 - Gaurav Agarwal - commented out the conditional statements in update search.
// @update: :New organism spec Rupali Mahadik.
/**
 * Adding function to String prototype to shortcut string to a desire length.
 * @param {int} n - The length of the string
 * @returns {int} -Short String
 */

String.prototype.trunc = String.prototype.trunc ||
    function (n) {
        return (this.length > n) ? this.substr(0, n - 1) + '&hellip;' : this;
    };
var page = 1;
var sort = 'protein_name_long';
var dir = 'desc'
var url = getWsUrl('protein_list');
var limit = 20;

/**
 * it creates user interface for summary
 * @param {Object} queryInfo - the dataset of pagination info is retun from server
 * @param {string} queryInfo.execution_time - The queryInfo.execution_time gives execution_time of query in the form of date.
 * @param {integer} paginationInfo.limit - The paginationInfo.limit givesrecords per page from pagination object
 */
function buildSummary(queryInfo, question) {
    var summaryTemplate = $('#summary-template').html();
    queryInfo.execution_time = moment().format('MMMM Do YYYY, h:mm:ss a');
    queryInfo[question] = true;
    var summaryHtml = Mustache.render(summaryTemplate, queryInfo);
    $('#summary-table').html(summaryHtml);
}

/**
 * Returns total number of pages for each list
 * @param {string} total_length the dataset of pagination info is retun from server
 */
function totalNoSearch(total_length) {
    $('.searchresult').html("\"" + total_length + " Proteins were found\"");
}

/**
 * Format function to create link to the details page
 * @param {object} value - The data binded to that particular cell.
 * @return -Details particular Protein Id
 */
function PageFormat(value, row, index, field) {
    return "<a href='protein_detail.html?uniprot_canonical_ac=" + value + "'>" + value + "</a>";
}

/**
 * Format function for column "MASS"
 * @param {object} value - The data binded to that particular cell.
 * @return- Protein Mass if available else NA
 */
function MassFormatter(value) {
    if (value) {
        var mass = value;
        return value;
    } else {
        return "NA";
    }
}

var lastSearch;

/**
 * Handling a succesful call to the server for list page
 * @param {Object} data - the data set returned from the server on success
 * @param {Array} data.results - Array of individual results
 * @param {Object} data.pagination - the dataset for pagination info
 * @param {Object} data.query - the dataset for query
 */
function ajaxListSuccess(data) {
    // console.log(data);
    //console.log(data.code);
    if (data.code) {
        console.log(data.code);
        displayErrorByCode(data.code);
        activityTracker("error", id, "error code: " + data.code + " (page: " + page + ", sort: " + sort + ", dir: " + dir + ", limit: " + limit + ")");
    } else {
        var $table = $('#gen-table');
        var items = [];
        if (data.results) {
            for (var i = 0; i < data.results.length; i++) {
                var protein = data.results[i];
                items.push({
                    uniprot_canonical_ac: protein.uniprot_canonical_ac,
                    mass: protein.mass,
                    gene_name: protein.gene_name,
                    protein_name_long: protein.protein_name_long,
                    organism: protein.organism,
                    refseq_name: protein.refseq_name,
                    refseq_ac: protein.refseq_ac
                });
            }
        }

        $table.bootstrapTable('removeAll');
        $table.bootstrapTable('append', items);
        buildPages(data.pagination);
        buildSummary(data.query, question);
        document.title = 'Quick_Protein-list';
        lastSearch = data;
        activityTracker("user", id, "successful response " + question + " (page: " + page + ", sort: " + sort + ", dir: " + dir + ", limit: " + limit + ")");
    }
}

/**
 * LoadDataList function to configure and start the request to GWU  service
 * @param {string} id - The protein id to load
 * */
function LoadDataList() {
    var ajaxConfig = {
        dataType: "json",
        url: getWsUrl("protein_list"),
        data: getListPostData(id, page, sort, dir, limit),
        method: 'POST',
        timeout: getTimeout("list_protein"),
        success: ajaxListSuccess,
        error: ajaxFailure
    };

    // make the server call
    $.ajax(ajaxConfig);
}

/**
 * getParameterByName function to EXtract query parametes from url
 * @param {string} name - The name of the variable variable to extract from query string
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

id = getParameterByName('id');
var question = getParameterByName('question');
LoadDataList(id);

/**
 * hides the loading gif and displays the page after the results are loaded.
 * @author Gaurav Agarwal
 * @date July 25, 2018
 */
$(document).ajaxStop(function () {
    $('#loading_image').fadeOut();
});

$(document).ready(function () {
    $('#gen-table').on("sort.bs.table", function (event, field, order) {
        // event.preventDefault();
        event.stopPropagation();
        sort = field;
        dir = order;
        LoadDataList();
        // activityTracker("user", id, "sort: " + sort);
        return false;
    });
});
