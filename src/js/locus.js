//@author: Rupali Mahadik
// @description: UO1 Version-1.1.
//31st july

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
var sort = 'uniprot_canonical_ac';
var dir = 'desc';
var url = getWsUrl('loci_list') + "?action=get_user";
var limit = 20;

/**
 * Format function to create link to the details page
 * @param {object} value - The data binded to that particular cell.
 @return -Details particular Glycan Id
 */
function pageFormat(value, row, index, field) {
    return "<a href='protein_detail.html?uniprot_canonical_ac=" + value + "'>" + value + "</a>";
}

function pageFormat1(value, row, index, field) {
    return "<a href='" + row.gene_link + " ' target='_blank'>" + value + "</a>"
}


/**
 * Summary top table
 * @param {number} queryInfo [[Execution time]]
 * @param {string}} question [[displays questions]
 */
function buildSummary(queryInfo, question) {
    //quick search
    var summaryTemplate = $('#summary-template').html();
    queryInfo.execution_time = moment().format('MMMM Do YYYY, h:mm:ss a');
    queryInfo[question] = true;
    var summaryHtml = Mustache.render(summaryTemplate, queryInfo);
    $('#summary-table').html(summaryHtml);
}

function totalNoSearch(total_length) {
    $('.searchresult').html("\"" + total_length + " Proteins were found\"");
}



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
                var glycan = data.results[i];
                items.push({
                    uniprot_canonical_ac: glycan.uniprot_canonical_ac,
                    gene_link: glycan.gene_link,
                    gene_name: glycan.gene_name,
                    protein_name: glycan.protein_name,
                    organism: glycan.organism,
                    chromosome: glycan.chromosome,
                    start_pos: glycan.start_pos,
                    end_pos: glycan.end_pos,
                    tax_id: glycan.tax_id
                });
            }
        }

        $table.bootstrapTable('removeAll');
        $table.bootstrapTable('append', items);

        buildPages(data.pagination);
        buildSummary(data.query, question);

        // buildSummary(data.query);
        document.title = 'loci-list';

        activityTracker("user", id, "successful response " + question + " (page: " + page + ", sort: " + sort + ", dir: " + dir + ", limit: " + limit + ")");
    }
}

/**
 * LoadDataList function to configure and start the request to GWU  service
 * @param {string} id - The glycan id to load
 * */
function LoadDataList() {
    var ajaxConfig = {
        dataType: "json",
        url: getWsUrl("loci_list"),
        data: getListPostData(id, page, sort, dir, limit),
        method: 'POST',
        timeout: getTimeout("loci_list"),
        success: ajaxListSuccess,
        error: ajaxListFailure
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

var id = getParameterByName('id');
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
