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

/** categorized typeahead auto complete widget
 */
$.widget("custom.categoryautocomplete", $.ui.autocomplete, {
    _create: function() {
        this._super();
        this.widget().menu("option", "items", "> :not(.ui-autocomplete-lable)");
    },
    _renderMenu: function(ul, items) {
        var that = this,
        curCategory = "";
    $.each(items, function(index, item) {
        if (item.category !== curCategory) {
            ul.append("<li class='ui-autocomplete-category'>" + item.category + "</li>");
            curCategory = item.category;
        }
        that._renderItemData(ul, item);
    });
    }
});

/** returns category and label wise sorted typeahead suggestions
 */
function getSortedCategorizedTypeahead(suggestions) {

    var category_sorted =  suggestions.sort(function(a, b){ 
        if (a.category.toUpperCase() === b.category.toUpperCase()) return 0; 
        else if(a.category.toUpperCase() > b.category.toUpperCase()) return 1;
        else if(a.category.toUpperCase() < b.category.toUpperCase()) return -1;
    });
    
    var category_label_sorted =  category_sorted.sort(function(a, b){ 
        if (a.category.toUpperCase() === b.category.toUpperCase()) {
            if (a.label.toUpperCase() === b.label.toUpperCase()) return 0; 
            else if(a.label.toUpperCase() > b.label.toUpperCase()) return 1;
            else if(a.label.toUpperCase() < b.label.toUpperCase()) return -1;
        }
    });

    return category_label_sorted;
}

/** go_term on change detect and suggest auto complete options from retrieved Json
 * @gotermjson - forms the JSON to post
 * @data-returns the categorized go_term
 */
$("#go_term").categoryautocomplete({
    delay: 0,
    source: function (request, response) {
        var queryUrl = getWsUrl("categorized_typeahead") + "?" + getSearchCategorizedTypeheadData("go_term", request.term, 15, 5);
        $.getJSON(queryUrl, function (suggestions) {
            category_label_sorted = getSortedCategorizedTypeahead(suggestions);
            response(category_label_sorted);
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