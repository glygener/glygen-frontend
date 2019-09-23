/**
 * @author: Gaurav Agarwal
 * version 1.1.0
 * @description: This file just holds the base url to the test server
 * and the snippet for pageproofer live commenting tool
 * @date: September 5, 2018 
 */

var ws_base = "https://api.tst.glygen.org/";
var ws_base_data = "https://data.tst.glygen.org/";
var ws_base_sparql ="https://sparql.tst.glygen.org/";

/**
 * for the pageproofer feedback.
 */
(function (d, t) {
   var pp = d.createElement(t), s = d.getElementsByTagName(t)[0];
   pp.src = '//app.pageproofer.com/overlay/js/3487/1801';
   pp.type = 'text/javascript';
   pp.async = true;
   s.parentNode.insertBefore(pp, s);
})(document, 'script');