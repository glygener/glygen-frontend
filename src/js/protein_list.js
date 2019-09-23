//@Author:Rupali Mahadik.
//@update: July 11, 2018 - Gaurav Agarwal - added user tracking navigation on pagination table.
// @update on July 25 2018 - Gaurav Agarwal - added code for loading gif.
// @update: July 27, 2018 - Gaurav Agarwal - commented out the conditional statements in update search.
// @added: Oct 19, 2018 - Gaurav Agarwal - added downloadPrompt() which gives selection box for downloading data.

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

id = getParameterByName('id');
const globalSearchTerm = getParameterByName("gs") || "";

/**
 * it creates user interface for summary
 * @param {Object} queryInfo - the dataset of pagination info is retun from server
 * @param {string} queryInfo.execution_time - The queryInfo.execution_time gives execution_time of query in the form of date.
 * @param {integer} paginationInfo.limit - The paginationInfo.limit givesrecords per page from pagination object
 */
function buildSummary(queryInfo) {
    var summaryTemplate;
    var summaryHtml;

    summaryTemplate = $('#summary-template').html();
    if (queryInfo.mass) {
        queryInfo.mass.min = addCommas(queryInfo.mass.min);
        queryInfo.mass.max = addCommas(queryInfo.mass.max);
    }
    var question = getParameterByName('question');
    if (question) {
        queryInfo = { question: MESSAGES[question] };
    }
    queryInfo.execution_time = moment().format('MMMM Do YYYY, h:mm:ss a');
    summaryHtml = Mustache.render(summaryTemplate, queryInfo);
    $('#summary-table').html(summaryHtml);
}

/**
 * Format function of getting total result for each search   [+]
 * @param {total_length} paginationInfo.total_length
 */
function totalNoSearch(total_length) {
    $('.searchresult').html("\"" + total_length + " Proteins were found\"");
}

/**
 * Redirect to a search page with id after clicking editSearch
 * @function [[editSearch]] returns to search page with prefield fields
 */
function editSearch() {
    {
        var question = getParameterByName('question');
        var newUrl;

        if (question && (question === 'QUESTION_TRY1')) {
            newUrl = 'quick_search.html?id=' + id + '&question=QUESTION_1';
        }
        else if (question && (question === 'QUESTION_TRY2')) {
            newUrl = 'quick_search.html?id=' + id + '&question=QUESTION_2'+ '#' +question;

           // window.location.replace("quick_search.html?id=" + id + '&question=' + question + '#' +question );
   
        } else if (globalSearchTerm) {
            newUrl = "global_search_result.html?search_query=" + globalSearchTerm;
        }
        else {
            newUrl = "protein_search.html?id=" + id;
        }

        window.location.replace(newUrl);
        activityTracker("user", id, "edit search");
    }
}

/**
 * Format function to create link to the details page
 * @param {object} value - The data binded to that particular cell.
 * @return -Details particular Protein Id
 */
function PageFormat(value, row, index, field) {
    return "<a href='protein_detail.html?uniprot_canonical_ac=" + value + "&listID=" + id + "&gs=" + globalSearchTerm + "'>" + value + "</a>";
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

/**
 * updateSearch function of the detail table when opening each row [+]
 * @param {int} index - The row clicked
 * @param {object} row - The data object binded to the row
 * @return- detail view with IUPAC AND GLYCOCT
 */

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
            if (data.query.organism && (data.query.organism.id === 0)) {
                data.query.organism.name = "All";
            }

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
        buildSummary(data.query);
        document.title = 'Protein-list';
        lastSearch = data;
        activityTracker("user", id, "successful response (page: " + page + ", sort: " + sort + ", dir: " + dir + ", limit: " + limit + ")");
    }
    updateBreadcrumbLinks();
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
        error: ajaxListFailure
    };
    // make the server call
    $.ajax(ajaxConfig);
}

/**
 * hides the loading gif and displays the page after the results are loaded.
 * @author Gaurav Agarwal
 * @date July 25, 2018
 */
$(document).ajaxStop(function () {
    $('#loading_image').fadeOut();
});

/**
 * Gets the values selected in the download dropdown 
 * and sends to the downloadFromServer() function in utility.js
 * @author Gaurav Agarwal
 * @since Oct 22, 2018.
 */
function downloadPrompt() {
    var page_type = "protein_list";
    var format = $('#download_format').val();
    var IsCompressed = false; //$('#download_compression').is(':checked');
    downloadFromServer(id, format, IsCompressed, page_type);
}

/**
 * this function gets the URL query values
 * and updates the respective links on the breadcrumb fields.
 */
function updateBreadcrumbLinks() {
    if (globalSearchTerm) {
        $('#breadcrumb-search').text("General Search");
        $('#breadcrumb-search').attr("href", "global_search_result.html?search_query=" + globalSearchTerm);
    } else {
        $('#breadcrumb-search').attr("href", "protein_search.html?id=" + id);
    }
}


$(document).ready(function () {
    // limit = $(element).val();
    LoadDataList();
    updateBreadcrumbLinks();
});
