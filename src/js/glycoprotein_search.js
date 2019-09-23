//@author: Rupali Mahadik
// @description: UO1 Version-1.1.
// @author: Tatiana Williamson
// @description: glycoprotein_search.js
//@update: 6 June 2018
//@update: 26 June 2018-web services changes updated
// @update on July 25 2018 - Gaurav Agarwal - added code for loading gif.
// @update on Aug 12, 2018 - Gaurav Agarwal - added ajax timeout and error handling functions
// @update on Feb 8, 2019 - Tatiana Williamson


/**
 * This helps retain the search tab on pressing the back button from the list page.
 */
$(function () {
    var hash = window.location.hash;
    hash && $('ul.nav a[href="' + hash + '"]').tab('show');

    $('.nav-tabs a').click(function (e) {
        $(this).tab('show');
        var scrollmem = $('body').scrollTop() || $('html').scrollTop();
        window.location.hash = this.hash;
        $('html,body').scrollTop(scrollmem);
    });
});

/**
 * Cleares all fields in advinced search
 * Clear fields button
 */
function resetAdvanced() {
    setGlycoProteinFormValues({
        query: {
            query_type: "search_protein",
            mass: {
                "min": mass_min,
                "max": mass_max
            },
            sequence: "",
            // organism: "",
            organism: {
                id: "0"
            },
            refseq_ac: "",
            protein_name: "",
            gene_name: "",
            pathway_id: "",
            uniprot_canonical_ac: "",
            glycan: {
                relation: "",
                glytoucan_ac: ""
            },
            sequence: {
                glycosylated_aa: "",
                type: ""
            },
            glycosylation_evidence: ""
        }
    })
    $("#glycosylated_aa").val('').trigger("chosen:updated");
}

/**
 * Sorts dropdown list in asc order in advanced search
 * @param {string} a dropdown name
 * @param {string} b dropdown name
 * @return {string} asc order name
 */
function sortDropdown(a, b) {
    if (a.name < b.name) {
        return -1;
    } else if (b.name < a.name) {
        return 1;
    }
    return 0;
}

/** functions for dropdowns organism
 * get organism drop down values for search form
 */
var searchInitValues;
var mass_max;
var mass_min;
$(document).ready(function () {
    $(".glycosylated_aa").chosen({
            // max_selected_options: 10,
            placeholder_text_multiple: "Click to select multiple Amino Acids",
            width: "565px"
        })
        .bind(function () {
            window.alert("You reached your limited number of selections which is 2 selections!");
        });

    $.ajax({
        dataType: "json",
        url: getWsUrl("search_init_protein"),
        timeout: getTimeout("search_init_protein"),
        error: searchInitFailure,
        success: function (result) {
            searchInitValues = result;
            var orgElement = $("#species").get(0);
            result.organism.sort(sortDropdown);
            result.simple_search_category[0].display = "Any category";
            for (var x = 0; x < result.organism.length; x++) {
                createOption(orgElement, result.organism[x].name, result.organism[x].id);
            }
            // Sorting Simple search 
            var categoryType = $("#simplifiedCategory").get(0);
            result.simple_search_category.sort(sortDropdownSimple);
            for (var x = 0; x < result.simple_search_category.length; x++) {
                createOption(categoryType, result.simple_search_category[x].display, result.simple_search_category[x].id);
            }
            mass_max = Math.ceil(result.protein_mass.max);
            mass_min = Math.floor(result.protein_mass.min);
            // mass(mass_min, mass_max);
            // check for ID to see if we need to load search values
            // please do not remove this code as it is required prepopulate search values
            var id = getParameterByName('id') || id;
            if (id) {
                LoadGlycoProteinSearchvalues(id);
            }

            new Sliderbox({
                target: '.sliderbox',
                start: [mass_min, mass_max], // Handle start position
                connect: true, // Display a colored bar between the handles
                behaviour: 'tap-drag', // Move handle on tap, bar is draggable
                range: { // Slider can select '0' to '100'
                    'min': mass_min,
                    '1%': mass_max / 1024,
                    '10%': mass_max / 512,
                    '20%': mass_max / 256,
                    '30%': mass_max / 128,
                    '40%': mass_max / 64,
                    '50%': mass_max / 32,
                    '60%': mass_max / 16,
                    '70%': mass_max / 8,
                    '80%': mass_max / 4,
                    '90%': mass_max / 2,
                    'max': mass_max
                }
            });

            var id = getParameterByName('id');
            if (id) {
                LoadDataList(id);
            }
            populateExample();
        }
    });

    ///New slider
    Sliderbox = function (options) {
        this.options = options;
        this.init();
    };

    Sliderbox.prototype.init = function () {
        var box = document.querySelectorAll(this.options.target),
            len = box.length,
            i = 0;
        for (; i < len; i++) {
            this.handler(box[i]);
        }
    };

    Sliderbox.prototype.handler = function (target) {
        var slider = target.querySelector('.sliderbox-slider'),
            inpMin = target.querySelector('.sliderbox-input-min'),
            inpMax = target.querySelector('.sliderbox-input-max');

        noUiSlider.create(slider, this.options);
        slider.noUiSlider.on('update', function (values, handle) {
            if (handle) {
                inpMax.value = addCommas(parseInt(values[handle]));
            } else {
                inpMin.value = addCommas(parseInt(values[handle]));
            }
        });

        target.addEventListener('change', function (e) {
            if (e.target === inpMin) {
                slider.noUiSlider.set([parseInt(e.target.value.replace(/,/g, ''))]);
            } else {
                slider.noUiSlider.set([null, parseInt(e.target.value.replace(/,/g, ''))]);
            }
        });
    };
    
    /**
     * Submit input value on enter in Simplified search 
     */
    $("#simplifiedSearch").keypress(function (event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            searchProteinSimple();
        }
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
    
    /** 
    * @param {string} popover and tooltip
    * @return {string} popover and tooltip on search pages
    * @author Tatiana Williamson
    */
    $('.link-with-tooltip').each(function() {
        //$(this).on('click', function(e) {e.preventDefault(); return true;});
        $(this).popover({    
            content : $(this).attr("popover-content"),
            title : $(this).attr("popover-title")         
        });    
        $(this).tooltip({    
            placement : 'bottom',  
            content : $(this).attr("tooltip-title")
        });
        $(this).tooltip('option', 'tooltipClass', 'tooltip-custom')
    })
});

function createOption(ddl, text, value) {
    var opt = document.createElement('option');
    opt.value = value;
    opt.text = text;
    ddl.options.add(opt);
}

/** 
* On submit, function forms the JSON and submits to the search web services
*/
function ajaxProteinSearchSuccess() {
    // displays the loading gif when the ajax call starts
    $('#loading_image').fadeIn();

    var prevListId = getParameterByName("id") || "";
    activityTracker("user", prevListId, "Performing Advanced Search");

    var query_type = "search_protein";
    var mass_slider = document.getElementById("sliderbox-slider").noUiSlider.get(0);
    var selected_species = document.getElementById("species");
    var organism = {
        "id": parseInt(selected_species.value),
        "name": selected_species.options[selected_species.selectedIndex].text
    };
    var uniprot_id = $("#protein").val();
    var refseq_id = $("#refseq").val();
    var gene_name = $("#gene_name").val();
    var protein_name = $("#protein_name").val();
    var pathway_id = $("#pathway").val();
    var sequence = $("#sequences").val().replace(/\n/g, "");
    // var sequence = {
    //     "type": $("#type").val(),
    //     "aa_sequence": $("#sequences").val().replace(/\n/g, "")
    // };
    var glycan_id = $("#glycan_id").val();
    var glycan_relation = $("#glycan_relation").val();
    var glycosylated_aa = $(".glycosylated_aa").val();
    var glycosylation_evidence = $("#glycosylation_evidence").val();
    var formObject = searchJson(query_type, mass_slider[0], mass_slider[1], organism, uniprot_id, refseq_id, gene_name,
        protein_name, pathway_id, sequence, glycan_id, glycan_relation, glycosylated_aa, glycosylation_evidence)
    var json = "query=" + JSON.stringify(formObject);
    $.ajax({
        type: 'post',
        url: getWsUrl("search_protein"),
        data: json,
        timeout: getTimeout("search_protein"),
        error: ajaxFailure,

        success: function (results) {
            if (results.error_code) {
                displayErrorByCode(results.error_code);
                activityTracker("error", "", "Advanced Search: " + results.error_code + " for " + json);
                $('#loading_image').fadeOut();
            } else if ((results.list_id !== undefined) && (results.list_id.length === 0)) {
                displayErrorByCode('no-results-found');
                activityTracker("user", "", "Advanced Search: no result found for " + json);
                $('#loading_image').fadeOut();
            } else {
                activityTracker("user", prevListId + ">" + results.list_id, "Advanced Search: Searched with modified parameters");
                window.location = './glycoprotein_list.html?id=' + results.list_id;
                $('#loading_image').fadeOut();
            }
        }
    });
}
/**
 * Forms searchjson from the form values submitted
 * @param {string} input_query_type query search
 * @param {string} mass_min user mass min input
 * @param {string} mass_max user mass max input
 * @param {string} user organism input
 * @param {string} input_protein_id user protein input
 * @param {string} input_refseq_id user input
 * @param {string} input_gene_name user input
 * @param {string} input_protein_name user input
 * @param {string} input_pathway_id user input
 * @param {string} input_sequence user input
 * @return {string} returns text or id
 */
function searchJson(input_query_type, mass_min, mass_max, input_organism, input_protein_id,
    input_refseq_id, input_gene_name, input_protein_name, input_pathway_id, input_sequence,
    input_glycan, input_relation, input_glycosylated_aa, input_glycosylation_evidence) {
    var sequences;
    if (input_sequence) {
        sequences = {
            "type": "exact",
            "aa_sequence": input_sequence
        }
    }
  
    var glycans;
    if (input_glycan) {
        glycans = {
            relation: input_relation,
            glytoucan_ac: input_glycan
        }
    }
    var organism;
    if (input_organism.id != "0") {
        organism = {"id":0,"name":"All"};
        organism.id = input_organism.id;
        organism.name = input_organism.name;
    }
   
    var formjson = $.extend({}, {
        "operation": "AND",
        query_type: input_query_type,
        mass: {
            "min": parseInt(mass_min),
            "max": parseInt(mass_max)
        },
        sequence: sequences ?sequences:undefined,
        organism: {"id":input_organism.id,"name":input_organism.name},
        // organism: organism ?organism:undefined,
        refseq_ac: input_refseq_id? input_refseq_id: undefined,
        protein_name: input_protein_name? input_protein_name: undefined,
        gene_name: input_gene_name?input_gene_name: undefined,
        pathway_id: input_pathway_id ?input_pathway_id: undefined,
        uniprot_canonical_ac: input_protein_id ?input_protein_id: undefined,
        glycan: glycans?glycans: undefined,
        glycosylated_aa: input_glycosylated_aa?input_glycosylated_aa:undefined,
        glycosylation_evidence: input_glycosylation_evidence ?input_glycosylation_evidence: undefined
    });
    return formjson;
}

/**
 * hides the loading gif and displays the page after the search_init results are loaded.
 * @author Gaurav Agarwal
 * @date July 25, 2018
 */
$(document).ajaxStop(function () {
    $('#loading_image').fadeOut();
});

/* ---------------------- 
    Simplified search 
------------------------- */

/**
 * @author Tatiana Williamson
 * @date October 11, 2018
 */

/**
 * Sorts dropdown list in asc order in advanced search
 * @param {string} a dropdown name
 * @param {string} b dropdown name
 * @return {string} asc order name
 */
function sortDropdownSimple(c, d) {
    if (c.display < d.display) {
        return -1;
    } else if (d.display < c.display) {
        return 1;
    }
    return 0;
}

/**
 * updates the example on the simplified search on select option.
 */
$('#simplifiedCategory').on('change', populateExample);

function populateExample() {
    $('#simpleCatSelectedOptionExample').show();
//    var value = $('#simplifiedCategory').val();
    var name = $("#simplifiedCategory option:selected").val();
    var examples = [];
    var exampleText = "Example";
    
    switch (name.toLowerCase()) {
        case "disease":
            examples = ["Deafness"];
            break;
        case "glycan":
            examples = ["G17689DH"];
            break;
        case "organism":
            examples = ["Homo sapiens"];
            break;
        case "pathway":
            examples = ["hsa:3082"];
            break;
        case "protein":
            examples = ["P14210-1"];
            break;
        default:
            examples = ["P14210-1", "G17689DH", "hsa:3082", "Homo sapiens", "Deafness"];
            exampleText += "s";
            break;
    }
    
    //    if (name != "Choose category") {
    $('#simpleCatSelectedOptionExample')[0].innerHTML = exampleText + ": ";
    $.each(examples, function(i, example) {
        $('#simpleCatSelectedOptionExample')[0].innerHTML += "<a href='' class='simpleTextExample' data-tippy='Click to Insert'>" + example + "</a>, ";
    });
    //remove last comma and space
    $('#simpleCatSelectedOptionExample')[0].innerHTML = $('#simpleCatSelectedOptionExample')[0].innerHTML.slice(0, -2);

    $('#simplifiedSearch').attr('placeholder', "Enter the " + getPlaceHolder(name));
    $('[data-toggle="tooltip"]').tooltip(); 
    clickableExample();
    //    } else {
    //        $('#simpleCatSelectedOptionExample').hide();
    //        $('#simpleTextExample').text('');
    //        $('#simplifiedSearch').attr('placeholder', "Enter the search term");
    //    }
}
/**
 * Adds a different placeholder text in simple search 
 * @param {string} type [Changes a different placeholer text]
 */
function getPlaceHolder(type) {
    switch (type.toLowerCase()) {
        case "glycan":
            return "GlyTouCan Accession";
        case "protein":
            return "UniProtKB Accession";
        case "any":
            return "search term";
        default:
            return type;
    }
}

/**
 * make the example clickable and inserts it into the search input field.
 */
function clickableExample() {
    $('.simpleTextExample').click(function () {
        $('#simplifiedSearch').val($(this).text());
        $('#simplifiedSearch').focus();
        return false;
    });
}

/** On submit, function forms the JSON and submits to the search web services
 * @link {link} glycan_search_simple webservices.
 * @param {string} input_query_type - The user's query_type input to load.
 * @class {string} simplifiedCategory for protein.
 * @class {string} simplifiedSearch for protein.
 * @param {function} formObjectSimpleSearch JSON for simplified searc.
 * @param JSON call function formObjectSimple.
 */

function searchProteinSimple() {
    // displays the loading gif when the ajax call starts
    $('#loading_image').fadeIn();

    var prevListId = getParameterByName("id") || "";
    activityTracker("user", prevListId, "Performing Simplified Search");

    // Get values from form fields
    var query_type = "protein_search_simple";
    var term_category = document.getElementById("simplifiedCategory").value;
    if (term_category === "") {
        term_category = "any";
    }
    var term = document.getElementById("simplifiedSearch").value;
    var formObjectSimple = searchjsonSimple(query_type, term_category, term);
    var json = "query=" + JSON.stringify(formObjectSimple);
    // call web services 
    $.ajax({
        type: 'post',
        url: getWsUrl("protein_search_simple"),
        data: json,
        //timeout: getTimeout("search_simple_protein"),
        error: ajaxFailure,
        success: function (results) {
            if (results.error_code) {
                displayErrorByCode(results.error_code);
                // activityTracker("error", "", results.error_code);
                activityTracker("error", "", "Simplified Search: " + results.error_code + " for " + json);
                $('#loading_image').fadeOut();
            } else if ((results.list_id !== undefined) && (results.list_id.length === 0)) {
                displayErrorByCode('no-results-found');
                activityTracker("user", "", "Simplified Search: no result found for " + json);
                $('#loading_image').fadeOut();
            } else {
                activityTracker("user", prevListId + ">" + results.list_id, "Simplified Search: Searched with modified parameters");
                window.location = './glycoprotein_list.html?id=' + results.list_id;
                $('#loading_image').fadeOut();
            }
        }
    });
}
//formjason from form submit 
function searchjsonSimple(input_query_type, input_category, input_term) {
    var formjsonSimple = {
        "operation": "AND",
        query_type: input_query_type,
        term: input_term,
        term_category: input_category
    };
    return formjsonSimple;
}

/* ----------------------
 Start-Prepopulating search results after clicking modify button on glycan list summary section
 * @author Rupali
 * @date October 18, 2018
------------------------- */

/**
 * LoadDataList function to configure and start the request to GWU  service
 * @param {string} id - The protein id to load
 * */
function LoadDataList(id) {
    var ajaxConfig = {
        dataType: "json",
        url: getWsUrl("protein_list"),
        data: getListPostData(id, 1, 'mass', 'asc', 10),
        method: 'POST',
        timeout: getTimeout("list_protein"),
        success: ajaxListSuccess,
        error: ajaxFailure
    };
    // make the server call
    $.ajax(ajaxConfig);
}

/**
 * Handling a succesful call to the server for list page
 * @param {Object} data - the data set returned from the server on success
 * @param {Array} data.results - Array of individual results
 * @param {Object} data.pagination - the dataset for pagination info
 * @param {Object} data.query - the dataset for query
 */
function ajaxListSuccess(data) {
    id = getParameterByName("id")
    if (data.code) {
        console.log(data.code);
        displayErrorByCode(data.code);
        activityTracker("error", id, "error code: " + data.code);
    } else {
        if (data.query) {
            if (data.query.query_type === "protein_search_simple") {
                $('.nav-tabs a[href="#simple_search"]').tab('show');
                $("#simplifiedCategory").val(data.query.term_category);
                $("#simplifiedSearch").val(data.query.term);
                populateExample();
            } else {
                $('.nav-tabs a[href="#advanced_search"]').tab('show');
            }
        }
        activityTracker("user", id, "Search modification initiated");
    }
}

/* ----------------------
 End-Prepopulating search results after clicking modify button on protein list summary section
 * @author Rupali Mahadik
 * @date October 18, 2018
------------------------- */
function fitChosenContainertoParent() {
    setTimeout(function () {
        var $element = $('.chosen-container');
        var width = $element.parent().width();
        $element.width(width);
    }, 500);
}

$(window).on('resize', fitChosenContainertoParent);

$('#tab-advance').on('click', fitChosenContainertoParent);
$('#tab-advance').on('click', fitChosenContainertoParent);
