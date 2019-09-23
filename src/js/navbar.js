// @author: Tatiana Williamson
// @description: UO1 Version-1.1.
// @Date: 8th of March 2018.

/**
 * Represents a navbar.
 * @param {string} itemText - Selected text on navigation bar.
 */

function setNavItemAsCurrent(itemText) {
    $('.nav > li > a').each(function () {
        if ($(this).text().indexOf(itemText) >= 0) {
            $(this).parent().addClass('current');
        }
    });
}

$(document).ready(function () {
    var url = window.location.href;
    var fullFilename = url.substring(url.lastIndexOf('/') + 1);
    var filename = fullFilename.substring(0, fullFilename.lastIndexOf('.'));
    var navItemText = filename.replace(/_/g, ' ').toUpperCase();
    //var domain = url.replace("data.", "").replace("-", "")
    var glygen_url = window.location.origin;
    if (glygen_url.indexOf('beta-') >= 0) {
        glygen_url = glygen_url.replace("beta-", "beta.");
    }
    if (glygen_url.indexOf('data.') >= 0) {
       glygen_url = glygen_url.replace("data.", "");
    } else if (glygen_url.indexOf('sparql.') >= 0) {
       glygen_url = glygen_url.replace("sparql.", "");
    }
   
   var domain = glygen_url + "/";
    
    if (navItemText == '') {
        navItemText = 'HOME';
    } else if (navItemText == 'INDEX') {
        navItemText = 'HOME';
    } else if (navItemText == 'GLYCAN SEARCH') {
        navItemText = 'EXPLORE';
    } else if (navItemText == 'PROTEIN SEARCH') {
        navItemText = 'EXPLORE';
    } else if (navItemText == 'GLYCOPROTEIN SEARCH') {
        navItemText = 'EXPLORE';
    } else if (navItemText == 'QUICK SEARCH') {
        navItemText = 'QUICK SEARCH';
    } else if (navItemText == 'FEEDBACK') {
        navItemText = 'HELP';
    } else if (navItemText == 'CONTACT') {
        navItemText = 'HELP';
    } else if (navItemText == 'HOW TO CITE') {
        navItemText = 'HELP';
    } else if (navItemText == 'ABOUT') {
        navItemText = 'HELP';
    } else if (navItemText == 'RESOURCES') {
        navItemText = 'MORE';
    } else if (navItemText == 'MEDIA') {
        navItemText = 'MORE';
    } else if (navItemText == 'FRAMEWORKS') {
        navItemText = 'MORE';
    } else if (navItemText == 'GLYGEN SETTINGS') {
        navItemText = 'MY GLYGEN';
    }

    if (url.indexOf('data.') >= 0) {
        navItemText = 'DATA';
    } else if (url.indexOf('sparql.') >= 0) {
        navItemText = 'SPARQL';
    }

    $('.nav > li').removeClass('current');
    setNavItemAsCurrent(navItemText);
    
    // for Data and SPARQL link in header page
    $("#a_data").attr('href', ws_base_data);
    //$("#a_sparql").attr('href', ws_base_sparql);

    
    $.each($(".a_header"), function(i, v) {
        var nav_url = $(v).attr('href');
        $(v).attr('href', domain + nav_url);
    });
});

/**
 * This function is used to navigate to GlyGen page from external pages. 
 */
//function navigateToGlygenPage(page_name) {
//    var glygen_url = window.location.origin;
//    if (glygen_url.includes('//data.')) {
//        glygen_url = glygen_url.replace("data.", "");
//    } else if (glygen_url.includes('//sparql.')) {
//        glygen_url = glygen_url.replace("sparql.", "");
//    }
//    
//    var url = glygen_url + "/" + page_name;
//    window.open(url);
//}
// End @author: Tatiana Williamson
