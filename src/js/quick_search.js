// @author:Rupali Mahadik.
// @description: UO1 Version-1.1.

    /** 
    * @param {string} Alert message
    * @return {string} Alert message in quick search for every question
    * @author Tatiana Williamson
    */
function showNoResultsFound(li_element_id){
    var element = $('#' + li_element_id);
    var newFirstElement = '<div class="alert alert-danger"><strong>No Results Found</strong><br>Sorry, we couldn\'t find any data matching your input. Please change your search term and try again.</div>';
    element.prepend(newFirstElement);
}

/**
 * Q.1- What are the enzymes involved in the biosynthesis of glycan X in human?
 */
$("#bioenzyme").autocomplete({
    source: function (request, response) {
        var queryUrl = getWsUrl("type-ahead") + "?" + getSearchtypeheadData("glytoucan_ac", request.term);
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

function bioEnzyme() {
    var id = $("#bioenzyme").val();
    if(id.trim() === ""){
        showNoResultsFound("li_q1");
    }
    else{
        $.ajax({
            type: 'POST',
            url: getWsUrl("search_bioenzyme", id),
            error: ajaxFailure,
            success: function (results) {
                if (results.list_id) {
                    window.location = './quick_protein_list.html?id=' + results.list_id + "&question=QUESTION_1";
                }
                else {
                    //displayErrorByCode('no-results-found');
                    showNoResultsFound("li_q1");
                }
            }
        });
    }
}

/**
 * Q.2- Which proteins have been shown to bear glycan X and which site is this glycan attached to?
 */
$("#glycansite").autocomplete({
    source: function (request, response) {
        var queryUrl = getWsUrl("type-ahead") + "?" + getSearchtypeheadData("glytoucan_ac", request.term);
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

function glycanSite() {
    var id = $("#glycansite").val();
    $.ajax({
        type: 'POST',
        url: getWsUrl("search_glycansite", id),
        error: ajaxFailure,
        success: function (results) {
            if (results.list_id) {
                window.location = './quick_protein_list.html?id=' + results.list_id + "&question=QUESTION_2";
            }
            else {
                //displayErrorByCode('no-results-found');
                showNoResultsFound("li_q2");
            }
        }
    })
}

/**
 * Q.3 What are the gene locations of the enzymes involved in the biosynthesis of glycan X in human?
 */
$("#glycangene").autocomplete({
    source: function (request, response) {
        var queryUrl = getWsUrl("type-ahead") + "?" + getSearchtypeheadData("glytoucan_ac", request.term);
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

function glycanGene() {
    var id = $("#glycangene").val();
    $.ajax({
        type: 'POST',
        url: getWsUrl("search_glycangene", id),
        error: ajaxFailure,
        success: function (results) {
            if (results.list_id) {
                window.location = './locus_list.html?id=' + results.list_id + "&question=QUESTION_3";
            }
            else {
                //displayErrorByCode('no-results-found');
                showNoResultsFound("li_q3");
            }
        }
    })
}

/**
 * Q4.What are the orthologues of protein X in different species?
 */
$("#proteinorthologues").autocomplete({
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

function proteinOrthologues() {
    var id = $("#proteinorthologues").val();
    $.ajax({
        type: 'post',
        url: getWsUrl("search_proteinorthologues", id),
        error: ajaxFailure,
        success: function (results) {
            if (results.list_id) {
                window.location = './protein_orthologus.html?id=' + results.list_id + "&question=QUESTION_4";
            }
            else {
                //displayErrorByCode('no-results-found');
                showNoResultsFound("li_q4");
            }
        }
    })
}

/**
 * Q.5- What are the functions of protein X?
 */
$("#proteinfunction").autocomplete({
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

function proteinFunction() {
    var id = $("#proteinfunction").val();
    $.ajax({
        type: 'post',
        url: getWsUrl("protein_detail", id),
        error: ajaxFailure,
        success: function (results) {
            if (results.error_code) {
                 displayErrorByCode("Invalid ID");
                //showNoResultsFound("li_q5");
            }
            else {
                window.location = "protein_detail.html?uniprot_canonical_ac=" + id +'#function';
            }
        }
    })
}

/**
 * Q.6- Which glycans might have been synthesized in mouse using enzyme X?
 */
$("#glycanenzyme").autocomplete({
    source: function (request, response) {
        var queryUrl = getWsUrl("type-ahead") + "?" + getSearchtypeheadData("enzyme_uniprot_canonical_ac", request.term);
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

function glycanEnzyme() {
    var id = $("#glycanenzyme").val();
    $.ajax({
        type: 'post',
        url: getWsUrl("search_glycanenzyme", id),
        error: ajaxFailure,
        // data: json,
        success: function (results) {
            if (results.list_id) {
                window.location = './quick_glycan_list.html?id=' + results.list_id + "&question=QUESTION_6";
            }
            else {
                //displayErrorByCode('no-results-found');
                showNoResultsFound("li_q6");
            }
        }
    })
}

/**
 * Q.7- What are the glycosyltransferases in species X?
 */
var searchInitValues;

$(document).ready(function () {
    $.getJSON(getWsUrl("search_init_glycan"), function (result) {
        searchInitValues = result;
        var orgElement = $("#organism1").get(0);
        createOption(orgElement, result.organism[0].name, result.organism[0].id);
        createOption(orgElement, result.organism[1].name, result.organism[1].id);
    });
     /** 
    * @param {string} No results found 
    * @return {string} Alert message in all searches
    * @author Tatiana Williamson
    */
    $(".alert").hide();
    $(document).on('click', function(e) {
        $(".alert").hide();
    })
});

function createOption(ddl, text, value) {
    var opt = document.createElement('option');
    opt.value = value;
    opt.text = text;
    ddl.options.add(opt);
}

function glycosylTransferases() {
    var id = $("#organism1").val();
    $.ajax({
        type: 'post',
        url: getWsUrl("search_glycosyltransferases", id),
        error: ajaxFailure,
        // data: json,
        success: function (results) {
            if (results.list_id) {
                window.location = './quick_protein_list.html?id=' + results.list_id + "&question=QUESTION_7";
            }
            else {
                //displayErrorByCode('no-results-found');
                showNoResultsFound("li_q7");
            }
        }
    })
}

/**
 * Q.8- What are the glycohydrolases in species X?
 */
var searchInitValues;

$(document).ready(function () {
    $.getJSON(getWsUrl("search_init_glycan"), function (result) {
        searchInitValues = result;
        var orgElement = $("#organism2").get(0);
        createOption(orgElement, result.organism[0].name, result.organism[0].id);
        createOption(orgElement, result.organism[1].name, result.organism[1].id);
    });
});

function createOption(ddl, text, value) {
    var opt = document.createElement('option');
    opt.value = value;
    opt.text = text;
    ddl.options.add(opt);
}

function glycoHydrolases() {
    var id = $("#organism2").val();
    $.ajax({
        type: 'post',
        url: getWsUrl("search_glycohydrolases", id),
        error: ajaxFailure,
        // data: json,
        success: function (results) {
            if (results.list_id) {
                window.location = './quick_protein_list.html?id=' + results.list_id + "&question=QUESTION_8";
            }
            else {
                //displayErrorByCode('no-results-found');
                showNoResultsFound("li_q8");
            }
        }
    })
}

/**
 * Q.9- What are the reported or predicted glycosylated proteins in species X?
 */

var searchInitValues;

$(document).ready(function () {
    $.getJSON(getWsUrl("search_init_glycan"), function (result) {
        searchInitValues = result;
        var orgElement = $("#organism3").get(0);
        createOption(orgElement, result.organism[0].name, result.organism[0].id);
        createOption(orgElement, result.organism[1].name, result.organism[1].id);
        var question = getParameterByName('question');
        var id = getParameterByName('id');
        if(id) {
            populateLastSearch(question, id);
        }
    });
});

function createOption(ddl, text, value) {
    var opt = document.createElement('option');
    opt.value = value;
    opt.text = text;
    ddl.options.add(opt);
}

function glycoProteins() {
    var id = $("#organism3").val();
    var id1 = $("#species").val();
    $.ajax({
        type: 'post',
        url: getWsUrl("search_glycoproteins", id, id1),
        error: ajaxFailure,
        // data: json,
        success: function (results) {
            if (results.list_id) {
                window.location = './quick_protein_list.html?id=' + results.list_id + "&question=QUESTION_9";
            }
            else {
                //displayErrorByCode('no-results-found');
                showNoResultsFound("li_q9");
            }
        }
    })
}

/**
 * Q.10- What are the reported or predicted glycosylated proteins in species X?
 */
$("#glycosyltransferasesdisease").autocomplete({
    source: function (request, response) {
        var queryUrl = getWsUrl("type-ahead") + "?" + getSearchtypeheadData("disease_name", request.term);
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

function glycosyTtransferasesDisease() {
    // displays the loading gif when the ajax call starts
    $('#loading_image').fadeIn();
    var disease = $("#glycosyltransferasesdisease").val();
    var formObject = {
        do_name: disease,
        tax_id: 0
    };
    var json = "query=" + JSON.stringify(formObject);
    $.ajax({
        type: 'POST',
        url: getWsUrl("search_disease"),
        data: json,
        error: ajaxFailure,
        success: function (results) {
            if (results.list_id) {
                window.location = './quick_protein_list.html?id=' + results.list_id + "&question=QUESTION_10";
            }
            else {
                //displayErrorByCode('no-results-found');
                showNoResultsFound("li_q10");
            }
        }
    })
}
//Q.10.

function populateLastGlycanSearch(question, id) {
    $.ajax({
        dataType: "json",
        url: getWsUrl("glycan_list"),
        data: getListPostData(id, 1, 'mass', 'desc', 1),
        method: 'POST',
        timeout: getTimeout("list_glycan"),
        success: function (data) {
            $('#glycanenzyme').val(data.query.uniprot_canonical_ac || "Mgat1");
        }
    });
}

function populateLastLocusSearch(question, id) {
    $.ajax({
        dataType: "json",
        url: getWsUrl("loci_list"),
        data: getListPostData(id, 1, 'uniprot_canonical_ac', 'desc', 1),
        method: 'POST',
        timeout: getTimeout("loci_list"),
        success: function (data) {
            $('#glycangene').val(data.query.glytoucan_ac);
        }
    });
}

function populateLastOrthougusSearch(question, id) {
    $.ajax({
        dataType: "json",
        url: getWsUrl("list_glycangene"),
        data: getListPostData(id, 1, 'uniprot_canonical_ac', 'desc', 1),
        method: 'POST',
        timeout: getTimeout("list_glycangene"),
        success: function (data) {
            $('#proteinorthologues').val(data.query.uniprot_canonical_ac);
        }
    });
}

function populateLastProteinSearch(question, id) {
    // make the server call
    $.ajax({
        dataType: "json",
        url: getWsUrl("protein_list"),
        data: getListPostData(id, 1, 'protein_name_long', 'desc', 1),
        method: 'POST',
        timeout: getTimeout("list_protein"),
        success: function (data) {

            switch (question) {
                case 'QUESTION_1':
                    $('#bioenzyme').val(data.query.glytoucan_ac);
                    break;
                case 'QUESTION_2':
                    $('#glycansite').val(data.query.glytoucan_ac);
                    break;
                case 'QUESTION_5':
                    $('#proteinfunction').val(data.query.glytoucan_ac);
                    break;
                case 'QUESTION_7':
                    $('#organism1').val(data.query.organism.id);
                    break;
                case 'QUESTION_8':
                    $('#organism2').val(data.query.organism.id);
                    break;
                case 'QUESTION_9':
                    $('#organism3').val(data.query.organism.id);
                    $('#species').val(data.query.evidence_type);
                    break;
                case 'QUESTION_10':
                    $('#glycosyltransferasesdisease').val(data.query.do_name);

                    break;
                default:
                    break;
            }
        },
        // error: ajaxListFailure
    });
}

function populateLastSearch(question, id) {
    $('#' + question).trigger('click');

    // make the ajax call to whichever endpoint
    switch (question) {
        case 'QUESTION_6':
            // call API for this type
            populateLastGlycanSearch(question, id);
            break;
        case 'QUESTION_3':
            populateLastLocusSearch(question, id);
            break;
        case 'QUESTION_4':
            populateLastOrthougusSearch(question, id);
            break;
        default:
            // call API for all others
            populateLastProteinSearch(question, id);
            break;
    }
}
