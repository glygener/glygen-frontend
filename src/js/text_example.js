/**
 * Add example text in input onclick.
 * @author Tatiana Williamson
 * @date August 29, 2018
 */

/* --------------------------
    Glycan Search Page 
---------------------------- */
/**
 * Makes the example clickable and inserts it into the search input field.
 * @param {string} tagsInputGlycan
 */
// select already you input element for re-use
var $tagsInputGlycan = $('#glycan_id');
// bind a click event to links within ".textExample" element
$('#textExampleGlycan').click(function() {
    // append link text to the input field value
    $tagsInputGlycan.val($(this).text());
    return false;
});

/**
 * Makes the example clickable and inserts it into the search input field.
 * @param {string} tagsInputProtein
 */
var $tagsInputProtein = $('#protein');
$('#textExampleProtein').click(function() {
    $tagsInputProtein.val($(this).text());
    return false;
});

/**
 * Makes the example clickable and inserts it into the search input field.
 * @param {string} tagsInputMotif
 */
var $tagsInputMotif = $('#motif');
$('#textExampleMotif').click(function() {
    $tagsInputMotif.val($(this).text());
    return false;
});

/**
 * Makes the example clickable and inserts it into the search input field.
 * @param {string} tagsInputEnzyme
 */
var $tagsInputEnzyme = $('#enzyme');
$('#textExampleEnzyme').click(function() {
    $tagsInputEnzyme.val($(this).text());
    return false;
});

/* ------------------------------------------
    Protein and Glycoprotein Search Pages 
---------------------------------------------- */

/**
 * Makes the example clickable and inserts it into the search input field.
 * @param {string} tagsInputRefseq
 */
var $tagsInputRefseq = $('#refseq');
$('#textExampleRefseq').click(function() {
     $tagsInputRefseq.val($(this).text());
    return false;
});

/**
 * Makes the example clickable and inserts it into the search input field.
 * @param {string} tagsInputProteinName
 */
var $tagsInputProteinName = $('#protein_name');
$('#textExampleProteinName').click(function() {
    $tagsInputProteinName.val($(this).text());
    return false;
});

/**
 * Makes the example clickable and inserts it into the search input field.
 * @param {string} tagsInputGeneName
 */
var $tagsInputGeneName = $('#gene_name');
$('#textExampleGeneName').click(function() {
     $tagsInputGeneName.val($(this).text());
    return false;
});

/**
 * Makes the example clickable and inserts it into the search input field.
 * @param {string} tagsInputSequences
 */
var $tagsInputSequences = $('#sequences');
$('#textExampleSequences').click(function() {
    $tagsInputSequences.val($(this).text());
    return false;
});

/**
 * Makes the example clickable and inserts it into the search input field.
 * @param {string} tagsInputPathwayID
 */
var $tagsInputPathwayID = $('#pathway');
$('.textExamplePathway').click(function() {
    $tagsInputPathwayID.val($(this).text());
    return false;
});

/* -----------------------------------------
    Quick Search Page
--------------------------------------------*/
/**
 * Makes the example clickable and inserts it into the search input field.
 * @param {string} tagsInputBioenzyme
 */
var $tagsInputBioenzyme = $('#bioenzyme');
$('#textExampleBioenzyme').click(function() {
    $tagsInputBioenzyme.val($(this).text());
    return false;
});

/**
 * Makes the example clickable and inserts it into the search input field.
 * @param {string} tagsInputGlycansite
 */
var $tagsInputGlycansite = $('#glycansite');
$('#textExampleGlycansite').click(function() {
    $tagsInputGlycansite.val($(this).text());
    return false;
});

/**
 * Makes the example clickable and inserts it into the search input field.
 * @param {string} tagsInputGlycangene
 */
var $tagsInputGlycangene = $('#glycangene');
$('#textExampleGlycangene').click(function() {
    $tagsInputGlycangene.val($(this).text());
    return false;
});

/**
 * Makes the example clickable and inserts it into the search input field.
 * @param {string} tagsInputOrthologues
 */
var $tagsInputOrthologues = $('#proteinorthologues');
$('#textExampleOrthologues').click(function() {
    $tagsInputOrthologues.val($(this).text());
    return false;
});

/**
 * Makes the example clickable and inserts it into the search input field.
 * @param {string} tagsInputFunction
 */
var $tagsInputFunction = $('#proteinfunction');
$('#textExampleFunction').click(function() {
    $tagsInputFunction.val($(this).text());
    return false;
});

/**
 * Makes the example clickable and inserts it into the search input field.
 * @param {string} tagsInputGlycanenzyme
 */
var $tagsInputGlycanenzyme = $('#glycanenzyme');
$('#textExampleGlycanenzyme').click(function() {
    $tagsInputGlycanenzyme.val($(this).text());
    return false;
});

/**
 * Makes the example clickable and inserts it into the search input field.
 * @param {string} tagsInputGlycosyltransferasesd
 */
var $tagsInputGlycosyltransferasesd = $('#glycosyltransferasesdisease');
$('#textExGlycosyltransferasesdisease').click(function() {
    $tagsInputGlycosyltransferasesd.val($(this).text());
    return false;
});
