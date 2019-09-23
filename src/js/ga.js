/**
 * @description Google Analytics global site tag code
 * @author Gaurav Agarwal
 * @since Aug 3, 2018
 */
if (document.location.hostname.search("glygen.org") === 0) {
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());

    gtag('config', 'UA-123338976-1');
}