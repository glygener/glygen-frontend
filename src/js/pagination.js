//@author: Rupali Mahadik
// @description: UO1 Version-1.1.

/**
 * Reads a new limit and reloads the data.
 * @param {domNode} element - The element from which we take the new limit value
 */
function xlimit(element) {
    page = 1;
    limit = $(element).val();
    $('.limit-select').val(limit);
    LoadDataList();
    activityTracker("user", id, "page limit: " + limit);
}

/**
 * Loads the next page of results
 */
function next() {
    page = page + 1;
    $(".page-select").val(page);
    LoadDataList();
    activityTracker("user", id, "page: " + page);
    $('html, body').animate({scrollTop:0}, 'slow');
    return false;
}

/**
 * Loads the Previous page of results
 */
function prev() {
    if (page > 1) {
        page = page - 1;
        $(".page-select").val(page);
        LoadDataList();
        activityTracker("user", id, "page: " + page);
    }
    $('html, body').animate({scrollTop:0}, 'slow');
    return false;
}

/**
 * Reads a new page and reloads the data.
 * @param {domNode} element - The element from which we take the new page value
 */
function xpage(element) {
    page = parseInt($(element).val(), 10);
    $('.page-select').val(page);
    LoadDataList();
    activityTracker("user", id, "page: " + page);
}

/**
 * Reads a new sort and reloads the data.
 * @param {domNode} element - The element from which we take the new sort value
 */

function xsort(element) {
    sort = $(element).val();
    $('.sort-select').val(sort);
    LoadDataList();
    activityTracker("user", id, "sort: " + sort);
}

/**
 * Reads a new asc/dec dirction for data  and reloads the data.
 * @param {domNode} element - The element from which we take the new direction value
 */
function xdir(element) {
    dir = $(element).val();
    $('.dir-select').val(dir);
    LoadDataList();
    activityTracker("user", id, "sort direction: " + dir);
}

/**
 * its calculate no of pages using limit and total_length.
 * @param {integer} total_length - The total_length is total number of records
 * @param {integer} limit - The limit is records per page
 * @returns {number} Number of pages
 */
function noOfPage(total_length, limit) {
    var size = Math.ceil(total_length / limit);
    return size;
}


/**
 * totalNoSearch show user total search result.
 * @param {integer} paginationInfo.total_length - The paginationInfo.total_length gives total number of records from pagination object
 */
// function totalNoSearch(total_length) {
//     $('.searchresult').html( "\""  + total_length + "glycan were found\"");
//     // $('.searchresult').html( "&#34;"  + total_length + " results of glycan&#34;");
//
// }


/**
 * it creates user interface for pagination for dropdown
 * @param {Object} paginationInfo - the dataset of pagination info is retun from server
 * @param {integer} paginationInfo.total_length - The paginationInfo.total_length gives total number of records from pagination object
 * @param {integer} paginationInfo.limit - The paginationInfo.limit givesrecords per page from pagination object
 */
function buildPages(paginationInfo) {
    var total_length = noOfPage(paginationInfo.total_length, paginationInfo.limit);
    var pageSelectors = $(".page-select");
    pageSelectors.empty();
    for (var i = 1; i <= total_length; i++) {
        pageSelectors.append($("<option></option>").attr("value", i).text(i));
    }
    pageSelectors.val(page);
    
    /**
     * this works for Showing user how many results they found .
     */
    totalNoSearch(paginationInfo.total_length);
    
    /**
     * this works for enabling and disable prev and next button.
     */
    $(".prevbutton").attr("disabled", (page == 1));
    $(".nextbutton").attr("disabled", (page == total_length));
    $('html, body').animate({scrollTop:0}, 'slow');
    return false;
}

$(document).ready(function(){
    $('#gen-table').on("sort.bs.table", function(event,field,order){
         event.preventDefault();
         event.stopPropagation();
         sort = field;
         dir = order;
         LoadDataList();
        activityTracker("user", id, "sort: " + sort);
        return false;
    });
});