//@author: Rupali Mahadik
// @description: UO1 Version-1.1.
//@Date:19th Feb 2018.- with Rupali Mahadik dummy webservice
//@update:3 April 2018. with Rupali Mahadik real web service
//@update: June 26-2018- with Rupali Mahadik web service changes.
//@update: July 5, 2018 - Gaurav Agarwal - added user tracking navigation on pagination table.
// @update: July 27, 2018 - Gaurav Agarwal - commented out the conditional statements in update search.
// @update on Aug 28 2018 - Gaurav Agarwal - updated ajaxListFailure function
// @added: Oct 22, 2018 - Gaurav Agarwal - added downloadPrompt() which gives selection box for downloading data.


/**
 * Adding function to String prototype to shortcut string to a desire length.
 * @param {int} n - The length of the string
 * @returns {int} -Short String
 */

String.prototype.trunc = String.prototype.trunc ||
    function (n) {
        return (this.length > n) ? this.substr(0, n - 1) + '&hellip;' : this;
    };
id = 'glytoucan_ac';
var page = 1;
var sort = 'glytoucan_ac';
var dir = 'asc';
var url = getWsUrl('motif_detail') + "?action=get_user";
//var url= "http://tst.api.glygen.org/motif/detail?query={glytoucan_ac:G00055MO,offset:1,limit:20,sort:glytoucan_ac,order:asc}"
var limit = 20;


/**
 * Format function of getting total result for each search   [+]
 * @param {total_length} paginationInfo.total_length -
 */

function totalNoSearch(total_length) {
    $('.searchresult').html("\"" + total_length + " glycans were found\"");
}

/**
 * Format function to create link to the details page
 * @param {object} value - The data binded to that particular cell.
 * @return - Details particular Glycan Id
 */
function pageFormat(value, row, index, field) {
    return "<a href='glycan_detail.html?glytoucan_ac=" + value + "'>" + value + "</a>";
}

/**
 * Format function for column that contains the cartoon
 * @param {object} value - The data binded to that particular cell.
 * @param {object} row - The data binded to that particular row.
 * @return- Glycanimage
 */

// For Image Column
function imageFormat(value, row, index, field) {
    var url = getWsUrl('glycan_image', row.glytoucan_ac);
    return "<div class='img-wrapper'><img class='img-cartoon' src='" + url + "' alt='Cartoon' /></div>";
}

/**
 * Format function for column "MASS"
 * @param {object} value - The data binded to that particular cell.
 * @return- Glycan Mass if available else NA
 */

function massFormatter(value) {
    if (value) {
        var mass = value;
        return value;
    } else {
        return "NA";
    }
}



/**
 * Handling a succesful call to the server for list page
 * @param {Object} data - the data set returned from the server on success
 * @param {Array} data.results - Array of individual results
 * @param {Object} data.pagination - the dataset for pagination info
 * @param {Object} data.query - the dataset for query
 */

function ajaxListSuccess(data) {
    if (data.error_code) {
        console.log(data.error_code);
        displayErrorByCode(data.error_code);
        activityTracker("error", id, "error code: " + data.error_code + " (page: " + page + ", sort: " + sort + ", dir: " + dir + ", limit: " + limit + ")");
    } else {
        data.imagePath = getWsUrl('glycan_image', data.glytoucan.glytoucan_ac);

        // load mustache template 1
        var template1 = $('#item_template_detail').html();
        // render 1 with data
        var template1html = Mustache.render(template1, data);
        // insert 1 back into DOM
        $('#content_detail').html(template1html);

        var $table = $('#gen-table');
        var items = [];
        if (data.results) {
            for (var i = 0; i < data.results.length; i++) {
                var glycan = data.results[i];
                items.push({
                    glytoucan_ac: glycan.glytoucan_ac,
                    mass: glycan.mass,
                    number_proteins: glycan.number_proteins,
                    number_enzymes: glycan.number_enzymes,
                    number_monosaccharides: glycan.number_monosaccharides,
                    iupac: glycan.iupac,
                    glycoct: glycan.glycoct
                });
            }
        }
        if (data.query.organism && (data.query.organism.id === 0)) {
            data.query.organism.name = "All";
        }
        $table.bootstrapTable('removeAll');
        $table.bootstrapTable('append', items);
         buildPages(data.pagination);


        // load mustache template 2
        var template2 = $('#item_template_publ').html();
        // render 1 with data
        var template2html = Mustache.render(template2, data);
        // insert 1 back into DOM
        $('#content_publ').html(template2html);

        activityTracker("user", id, "successful response (page: " + page + ", sort: " + sort + ", dir: " + dir + ", limit: " + limit + ")");
    }
}


/**
 * LoadDataList function to configure and start the request to GWU  service
 * @param {string} id - The glycan id to load
 * */
function LoadDataList() {
    var ajaxConfig = {
        dataType: "json",
        url: getWsUrl("motif_detail", glytoucan_ac),
        data: getListPostMotifData(glytoucan_ac, page, sort, dir, limit),
        method: 'GET',
        timeout: getTimeout("list_glycan"),
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

var glytoucan_ac = getParameterByName('glytoucan_ac');
LoadDataList(glytoucan_ac);

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
    var page_type = "glycan_list";
    var format = $('#download_format').val();
    var IsCompressed = false; //$('#download_compression').is(':checked');
    downloadFromServer(id, format, IsCompressed, page_type);
}
