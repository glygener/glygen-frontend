/**
 * @author: Gaurav Agarwal
 * version 1.1.0
 * @description: This file just holds the base url to the Beta server
 * and the snippet for pageproofer live commenting tool
 * @date: September 5, 2018 
 */

// 
var ws_base_sparql ="https://sparql.beta.glygen.org/";
var ws_base = "https://beta-api.glygen.org/";
var ws_base_data = "https://beta-data.glygen.org/";
/**
 * for the pageproofer feedback.
 */
(function (d, t) {
   var pp = d.createElement(t), s = d.getElementsByTagName(t)[0];
   pp.src = '//app.pageproofer.com/overlay/js/3502/1801';
   pp.type = 'text/javascript';
   pp.async = true;
   s.parentNode.insertBefore(pp, s);
})(document, 'script');