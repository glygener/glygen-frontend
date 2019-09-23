//@author: Rupali Mahadik
// @description: UO1 Version-1.1.
//@Date:20th June 2018.
//@refactored:June-27-2017

/** protein field on change detect and suggest auto complete options from retrieved Json
 * @proteinjson - forms the JSON to post
 * @data-returns the protein.
 */
$("#protein").autocomplete({
    source: function (request, response) {
        var queryUrl = getWsUrl("type-ahead") + "?" + getSearchtypeheadData("uniprot_canonical_ac", request.term);
        $.getJSON(queryUrl, function (suggestions) {
            suggestions.length = Math.min(suggestions.length, 5);
            response(suggestions);
        });
    },
    minLength: 1,
    select: function (event, ui) {
        console.log("Selected: " + ui.item.value + " aka " + ui.item.id);
    }
});

/** refseqfield on change detect and suggest auto complete options from retrieved Json
 * @refseqjson - forms the JSON to post
 * @data-returns the refseq
 */
$("#refseq").autocomplete({
    source: function (request, response) {
        var queryUrl = getWsUrl("type-ahead") + "?" + getSearchtypeheadData("refseq_ac", request.term);
        $.getJSON(queryUrl, function (suggestions) {
            suggestions.length = Math.min(suggestions.length, 5);
            response(suggestions);
        });
    },
    minLength: 1,
    select: function (event, ui) {
        console.log("Selected: " + ui.item.value + " aka " + ui.item.id);
    }
});

/** protein_name field on change detect and suggest auto complete options from retrieved Json
 * @proteinjson - forms the JSON to post
 * @data-returns the protein_name.
 */
$("#protein_name").autocomplete({
    source: function (request, response) {
        var queryUrl = getWsUrl("type-ahead") + "?" + getSearchtypeheadData("protein_name", request.term);
        $.getJSON(queryUrl, function (suggestions) {
            suggestions.length = Math.min(suggestions.length, 10);
            response(suggestions);
        });
    },
    minLength: 1,
    select: function (event, ui) {
        console.log("Selected: " + ui.item.value + " aka " + ui.item.id);
    }
});

/** gene_name field on change detect and suggest auto complete options from retrieved Json
 * @proteinjson - forms the JSON to post
 * @data-returns the gene_name.
 */
$("#gene_name").autocomplete({
    source: function (request, response) {
        var queryUrl = getWsUrl("type-ahead") + "?" + getSearchtypeheadData("gene_name", request.term);
        $.getJSON(queryUrl, function (suggestions) {
            suggestions.length = Math.min(suggestions.length, 10);
            response(suggestions);
        });
    },
    minLength: 1,
    select: function (event, ui) {
        console.log("Selected: " + ui.item.value + " aka " + ui.item.id);
    }
});

/** pathway field on change detect and suggest auto complete options from retrieved Json
 * @pathwayjson - forms the JSON to post
 * @data-returns the pathway.
 */
$("#pathway").autocomplete({
    source: function (request, response) {
        var queryUrl = getWsUrl("type-ahead") + "?" + getSearchtypeheadData("pathway_id", request.term);
        $.getJSON(queryUrl, function (suggestions) {
            suggestions.length = Math.min(suggestions.length, 10);
            response(suggestions);
        });
    },
    minLength: 1,
    select: function (event, ui) {
        console.log("Selected: " + ui.item.value + " aka " + ui.item.id);
    }
});

/** glycan id field on change detect and suggest auto complete options from retrieved Json
 * @glycan idjson - forms the JSON to post
 * @data-returns the glycan id.
 */
$("#glycan_id").autocomplete({
    source: function (request, response) {
        var queryUrl = getWsUrl("type-ahead") + "?" + getSearchtypeheadData("glytoucan_ac", request.term);
        $.getJSON(queryUrl, function (suggestions) {
            suggestions.length = Math.min(suggestions.length, 5);
            response(suggestions);
        });
    },
    minLength: 1,
    select: function (event, ui) {
        console.log("Selected: " + ui.item.value + " aka " + ui.item.id);
    }
});

/** motif field on change detect and suggest auto complete options from retrieved Json
 * @motif idjson - forms the JSON to post
 * @data-returns the motif.
 */
$("#motif").autocomplete({
    source: function (request, response) {
        var queryUrl = getWsUrl("type-ahead") + "?" + getSearchtypeheadData("motif_name", request.term);
        $.getJSON(queryUrl, function (suggestions) {
            suggestions.length = Math.min(suggestions.length, 5);
            response(suggestions);
        });
    },
    minLength: 1,
    select: function (event, ui) {
        console.log("Selected: " + ui.item.value + " aka " + ui.item.id);
    }
});

/** enzyme field on change detect and suggest auto complete options from retrieved Json
 * @enzymejson - forms the JSON to post
 * @data-returns the enzyme
 */
$("#enzyme").autocomplete({
    source: function (request, response) {
        var queryUrl = getWsUrl("type-ahead") + "?" + getSearchtypeheadData("gene_name", request.term);
        $.getJSON(queryUrl, function (suggestions) {
            suggestions.length = Math.min(suggestions.length, 5);
            response(suggestions);
        });
    },
    minLength: 1,
    select: function (event, ui) {
        console.log("Selected: " + ui.item.value + " aka " + ui.item.id);
    }
});