// @author: Rupali Mahadik
// @description: UO1 Version-1.1.
// @author: Tatiana Williamson
// @description: glycan_search.js
// @refactored  :June-27-2017
// @update on July 25 2018 - Gaurav Agarwal - added code for loading gif.
// @update on Aug 27, 2018 - Gaurav Agarwal - added ajax timeout and error handling functions
// @update on Feb 8, 2019 - Tatiana Williamson

/**
 * Sorts dropdown organism list in asc order in advanced search
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

var searchInitValues;
var mass_type_native;
var native_mass_min;
var native_mass_max;
var perMet_mass_min;
var perMet_mass_max;
var sugar_mass_min;
var sugar_mass_max;
var organism_list;
var residue_list;
var undo_residue_stack = [];
var redo_residue_stack = [];
var undo_residue_val;
$(document).ready(function () {

    $(".organism").chosen({
        placeholder_text_multiple: "Click to select multiple Organisms",
        width: "100%"
    })
        .bind(function () {
            window.alert("You reached your limited number of selections!");
        });
    // setting width of chosen multiselect dropdown to show placeholder text.
    $(".search-field").css({ "width": "100%" });

    //Section for populating label names from key-value.json
    populateFromKeyValueStore("lbl_glytoucan_acc", "GLYTOUCAN_ID", "", ":", 2);
    populateFromKeyValueStore("lbl_monoiso_mass", "MONOISOTOPIC_MASS", "", ":", 2);
    //End section for populating label names from key-value.json

    $.ajax({
        dataType: "json",
        url: getWsUrl("search_init_glycan"),
        timeout: getTimeout("search_init_glycan"),
        error: searchInitFailure,
        success: function (result) {
            searchInitValues = result;
            var orgElement = $("#species").get(0);
            organism_list = result.organism;
            result.organism.sort(sortDropdown);
            for (var x = 0; x < result.organism.length; x++) {
                createOption(orgElement, result.organism[x].name, result.organism[x].id);
            }
            $("#species").val('').trigger("chosen:updated");
            var categoryType = $("#simplifiedCategory").get(0);
            result.simple_search_category.sort(sortDropdownSimple);
            result.simple_search_category[0].display = "Any category";
            for (var x = 0; x < result.simple_search_category.length; x++) {
                createOption(categoryType, result.simple_search_category[x].display, result.simple_search_category[x].id);
            }
            var glycanElement = $(".ddl").get(0);
            result.glycan_type.sort(sortDropdown);
            for (var x = 0; x < result.glycan_type.length; x++) {
                createOption(glycanElement, result.glycan_type[x].name, result.glycan_type[x].name);
            }

            residue_list = result.composition;
            var composition = getJSON(getCompoSearchJSONFile());
            for (var x = 0; x < residue_list.length; x++) {
                residue_list[x].order_id = composition[residue_list[x].residue].order_id;
                residue_list[x].subtext = composition[residue_list[x].residue].subtext;
                residue_list[x].name = composition[residue_list[x].residue].name;
                residue_list[x].short_name = composition[residue_list[x].residue].short_name;
            }
            residue_list = residue_list.sort(function(res1, res2){return parseInt(res1.order_id) - parseInt(res2.order_id)});
            var html = "";
            var other_residue = undefined;
            for (var x = 0; x < residue_list.length; x++) {
                html += getResidueDiv(residue_list[x].name, residue_list[x].subtext, residue_list[x].residue, parseInt(residue_list[x].min), parseInt(residue_list[x].max));
            }
            $("#comp_tab").html(html);

            mass_type_native = result.glycan_mass.native.name;
            native_mass_max = Math.ceil(result.glycan_mass.native.max + 1);
            native_mass_min = Math.floor(result.glycan_mass.native.min - 1);
            perMet_mass_max = Math.ceil(result.glycan_mass.permethylated.max + 1);
            perMet_mass_min = Math.floor(result.glycan_mass.permethylated.min - 1);

            var massType = $("#mass-drop").get(0);

            for (mstype in result.glycan_mass) {
                createOption(massType, result.glycan_mass[mstype].name, result.glycan_mass[mstype].name);
            }
            massType.value = result.glycan_mass.native.name;

            sugar_mass_min = Math.floor(result.number_monosaccharides.min - 1);
            sugar_mass_max = Math.ceil(result.number_monosaccharides.max + 1);

            var id = getParameterByName('id') || id;
            if (id) {
                LoadSearchvalues(id);
            }
            new Sliderbox({
                target: '.sliderbox',
                start: [native_mass_min, native_mass_max], // Handle start position
                connect: true, // Display a colored bar between the handles
                behaviour: 'tap-drag', // Move handle on tap, bar is draggable
                range: { // Slider can select '0' to '100'
                    'min': native_mass_min,
                    'max': native_mass_max
                }
            });
            new Sliderbox1({
                target: '.sliderbox1',
                start: [sugar_mass_min, sugar_mass_max], // Handle start position
                connect: true, // Display a colored bar between the handles
                behaviour: 'tap-drag', // Move handle on tap, bar is draggable
                range: { // Slider can select '0' to '100'
                    'min': sugar_mass_min,
                    'max': sugar_mass_max
                }
            });

            var id = getParameterByName('id');
            if (id) {
                LoadDataList(id);
            }
            populateExample();
        }

    });

    /**
     * Submit input value on enter in Simplified search 
     */
    $("#simplifiedSearch").keypress(function (event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            searchGlycanSimple();
        }
    });

    /** 
    * @param {string} No results found 
    * @return {string} Alert message in all searches
    */
    $(".alert").hide();
    $(document).on('click', function (e) {
        $(".alert").hide();
    })

    /** 
    * @param {string} popover and tooltip
    * @return {string} popover and tooltip on search pages
    */
    $('.link-with-tooltip').each(function () {
        $(this).popover({
            content: $(this).attr("popover-content"),
            title: $(this).attr("popover-title")
        });
        $(this).tooltip({
            placement: 'bottom',
            content: $(this).attr("tooltip-title")
        });
        $(this).tooltip('option', 'tooltipClass', 'tooltip-custom')
    })
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

///New slider
Sliderbox1 = function (options) {
    this.options = options;
    this.init();
};

Sliderbox1.prototype.init = function () {
    var box = document.querySelectorAll(this.options.target),
        len = box.length,
        i = 0;
    for (; i < len; i++) {
        this.handler(box[i]);
    }
};

Sliderbox1.prototype.handler = function (target) {
    var slider1 = target.querySelector('.sliderbox-slider1'),
        inpMin1 = target.querySelector('.sliderbox-input-min1'),
        inpMax1 = target.querySelector('.sliderbox-input-max1');
    noUiSlider.create(slider1, this.options);
    slider1.noUiSlider.on('update', function (values, handle) {
        if (handle) {
            inpMax1.value = addCommas(parseInt(values[handle]));
        } else {
            inpMin1.value = addCommas(parseInt(values[handle]));
        }
    });

    target.addEventListener('change', function (e) {
        if (e.target === inpMin1) {
            slider1.noUiSlider.set([parseInt(e.target.value.replace(/,/g, ''))]);
        } else {
            slider1.noUiSlider.set([null, parseInt(e.target.value.replace(/,/g, ''))]);
        }
    });
};

/** glycan mass type dropdown on change event handler 
 */
$('#mass-drop').on('change', function () {
    var minval_range;
    var maxval_range;
    var glycan_mass_type = $("#mass-drop option:selected").val();
    var slider = $("#sliderbox-slider").get(0);
    var mass_slider = slider.noUiSlider.get();
    var minval = mass_slider[0];
    var maxval = mass_slider[1];

    if (glycan_mass_type == mass_type_native) {
        minval_range = native_mass_min;
        maxval_range = native_mass_max;

        if (minval == perMet_mass_min)
            minval = native_mass_min;

        if (maxval == perMet_mass_max)
            maxval = native_mass_max;
    } else {
        minval_range = perMet_mass_min;
        maxval_range = perMet_mass_max;

        if (minval == native_mass_min)
            minval = perMet_mass_min;

        if (maxval == native_mass_max)
            maxval = perMet_mass_max;
    }

    slider.noUiSlider.updateOptions({
        range: {
            'min': minval_range,
            'max': maxval_range
        }
    });
    slider.noUiSlider.set([minval, maxval]);
});

/** glycan sub type dropdown function based on type field
 * @param {numeric} ddl1 - User selected glycan type
 * @param {numeric} ddl2 - Glycan sub type
 */

function configureDropDownLists(ddl1, ddl2, callback) {
    var glyan_type_name = ddl1.value;
    // Hides Subtype by default and shows glycan type when it's selected
    var subtypeDiv = document.getElementById("showSubtype");
    if (subtypeDiv.style.display = "block") {
        if (ddl1.value == "") {
            subtypeDiv.style.display = "none";
        }
    } else {
        subtypeDiv.style.display = "block";
    }

    // clears existing options
    ddl2.options.length = 0;
    createOption(ddl2, 'Select Glycan Subtype', '');
    for (var x = 0; x < searchInitValues.glycan_type.length; x++) {
        var glycan_type = searchInitValues.glycan_type[x];
        if (glycan_type.name === glyan_type_name) {
            glycan_type.subtype.sort(function (a, b) {
                var Atokens = a.split(' ');
                var Btokens = b.split(' ');
                var Atext = Atokens[0];
                var Btext = Btokens[0];
                var Anumber = parseInt(Atokens[1]);
                var Bnumber = parseInt(Btokens[1]);
                if (isNaN(Anumber) || isNaN(Bnumber)) {
                    return Atext > Btext;
                } else {
                    return Anumber - Bnumber;
                }
            });
            for (i = 0; i < glycan_type.subtype.length; i++) {
                var subtype = glycan_type.subtype[i];
                createOption(ddl2, subtype, subtype);
            }
            break;
        }
    }
    if (callback) {
        callback();
    }
}

/** 
 * Functions for dropdown option
 */
function createOption(ddl, text, value) {
    var opt = document.createElement('option');
    opt.value = value;
    opt.text = text;
    ddl.options.add(opt);
}

/** On submit, function forms the JSON and submits to the search web services
 * Advanced Search
 */
function submitvalues() {
    // displays the loading gif when the ajax call starts
    $('#loading_image').fadeIn();

    var prevListId = getParameterByName("id") || "";
    if ($('.nav-tabs .active').text().trim() == "Composition Search") {
        activityTracker("user", prevListId, "Performing Composition Search");
    } else if ($('.nav-tabs .active').text().trim() == "Advanced Search") {
        activityTracker("user", prevListId, "Performing Advanced Search");
    }
    var query_type = "search_glycan";
    var mass_type = document.getElementById("mass-drop").value;
    var mass_slider = document.getElementById("sliderbox-slider").noUiSlider.get();
    var sugar_slider = document.getElementById("sliderbox-slider1").noUiSlider.get();
    var glycan_id = document.getElementById("glycan_id").value.trim();
    glycan_id = glycan_id.replace(/\u200B/g, "");
    glycan_id = glycan_id.replace(/\u2011/g, "-");
    glycan_id = glycan_id.replace(/\s+/g, ",");
    glycan_id = glycan_id.replace(/,+/g, ",");
    var index = glycan_id.lastIndexOf(",");
    if (index > -1 && (index + 1) == glycan_id.length) {
        glycan_id = glycan_id.substr(0, index);
    }
    var selected_species = $("#species").val();
    var organism_operation = $("#species_operation").val();
    var organism = [];
    if (selected_species) {
        for (i = 0; i < selected_species.length; i++) {
            organism[i] = organism_list.filter(function(org){if(parseInt(org.id) == parseInt(selected_species[i])){ return org}})[0];
        }
    }
    var glycan_type = document.getElementById("ddl").value;
    var glycan_subtype = document.getElementById("ddl2").value;
    var proteinid = document.getElementById("protein").value;
    var enzyme = document.getElementById("enzyme").value;
    var glycan_motif = document.getElementById("motif").value;
    var pmid = document.getElementById("pmid").value;
    var formObject = undefined;
    var searchType = "Advanced Search: ";
    if ($('.nav-tabs .active').text().trim() == "Composition Search") {
        searchType = "Composition Search: ";
        var residue_comp = [];
        for (var x = 0; x < residue_list.length; x++) {
            var residue = { "residue": residue_list[x].residue, "min": parseInt(document.getElementById("comp_" + residue_list[x].residue + "_min").value), "max": parseInt(document.getElementById("comp_" + residue_list[x].residue + "_max").value) }
            residue_comp.push(residue);
        }
        formObject = searchjson(query_type, undefined, mass_type_native, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, residue_comp);
    } else if ($('.nav-tabs .active').text().trim() == "Advanced Search") {
        formObject = searchjson(query_type, glycan_id, mass_type, mass_slider[0], mass_slider[1], sugar_slider[0], sugar_slider[1], organism, organism_operation, glycan_type, glycan_subtype, enzyme, proteinid, glycan_motif, pmid, residue_comp);
    }

    var json = "query=" + JSON.stringify(formObject);
    $.ajax({
        type: 'post',
        url: getWsUrl("glycan_search"),
        data: json,
        timeout: getTimeout("search_glycan"),
        error: ajaxFailure,
        success: function (results) {
            if (results.error_code) {
                displayErrorByCode(results.error_code, results.field);
                // activityTracker("error", "", results.error_code);
                activityTracker("error", "", searchType + results.error_code + " for " + json);
                $('#loading_image').fadeOut();
            } else if ((results.list_id !== undefined) && (results.list_id.length === 0)) {
                displayErrorByCode('no-results-found');
                activityTracker("user", "", searchType + "no result found for " + json);
                $('#loading_image').fadeOut();
            } else {
                activityTracker("user", prevListId + ">" + results.list_id, searchType + "Searched with modified parameters");
                window.location = './glycan_list.html?id=' + results.list_id;
                $('#loading_image').fadeOut();
            }
        }
    });
}

/**
 * Cleares all fields in advinced search
 * Clear fields button
 */
function resetAdvanced() {
    if ($('.nav-tabs .active').text().trim() == "Composition Search") {
        compSearchRedoReset();
        if (compSearchStateChanged(residue_list)) {
            saveCurrentResidueStatesToUndoList(residue_list);
        }
        setFormValues({
            query: {
                composition: residue_list
            }
        });
    } else if ($('.nav-tabs .active').text().trim() == "Advanced Search") {
        setFormValues({
            query: {
                query_type: "search_glycan",
                mass_type: mass_type_native,
                mass: {
                    "min": native_mass_min,
                    "max": native_mass_max
                },
                number_monosaccharides: {
                    "min": sugar_mass_min,
                    "max": sugar_mass_max
                },
                enzyme: {},
                glytoucan_ac: "",
                organism: {
                    organism_list: "",
                    operation: "or"
                },
                glycan_type: "",
                glycan_subtype: "",
                protein_identifier: "",
                glycan_motif: "",
                pmid: "",
            }
        });
    }
}

/** 
 * Forms searchjson from the form values submitted
 * @param {string} input_query_type query search
 * @param {string} input_glycan_id user glycan id input
 * @param {string} input_mass_type user mass type input
 * @param {string} mass_min user mass min input
 * @param {string} mass_max user mass max input
 * @param {string} input_organism user organism input
 * @param {string} input_organism_operation user organism operation input
 * @param {string} input_glycantype user glycan_type input
 * @param {string} input_glycansubtype user glycan_subtype input
 * @param {string} input_enzyme user enzyme input
 * @param {string} input_proteinid user uniprot_id input
 * @param {string} input_motif user motif input
 * @return {string} returns text or id
 * @param {string} input_residue_comp user residue input
 */
function searchjson(input_query_type, input_glycan_id, input_mass_type, input_mass_min, input_mass_max, input_sugar_min, input_sugar_max, input_organism, input_organism_operation, input_glycantype, input_glycansubtype, input_enzyme, input_proteinid, input_motif, input_pmid, input_residue_comp) {
    var enzymes = {}
    if (input_enzyme) {
        enzymes = {
            "id": input_enzyme,
            "type": "gene"
        }
    }
    var monosaccharides = undefined;
    if (input_sugar_min && input_sugar_max) {
        if (input_sugar_min != sugar_mass_min || input_sugar_max != sugar_mass_max) {
            monosaccharides = {
                "min": parseInt(input_sugar_min),
                "max": parseInt(input_sugar_max)
            };
        }
    }

    var input_mass = undefined;
    if (input_mass_min && input_mass_max) {
        if (input_mass_type == mass_type_native) {
            if (input_mass_min != native_mass_min || input_mass_max != native_mass_max) {
                input_mass = {
                    "min": parseInt(input_mass_min),
                    "max": parseInt(input_mass_max)
                };
            }
        } else {
            if (input_mass_min != perMet_mass_min || input_mass_max != perMet_mass_max) {
                input_mass = {
                    "min": parseInt(input_mass_min),
                    "max": parseInt(input_mass_max)
                };
            }
        }
    }

    var organisms = undefined;
    if (input_organism && input_organism.length > 0) {
        organisms = {
            "organism_list": input_organism,
            "operation": input_organism_operation
        }
    }
    var formjson = {
        "operation": "AND",
        query_type: input_query_type,
        mass_type: input_mass_type,
        mass: input_mass,
        number_monosaccharides: monosaccharides,
        enzyme: enzymes,
        glytoucan_ac: input_glycan_id,
        organism: organisms,
        glycan_type: input_glycantype,
        glycan_subtype: input_glycansubtype,
        protein_identifier: input_proteinid,
        glycan_motif: input_motif,
        pmid: input_pmid,
        composition: input_residue_comp
    };
    return formjson;
}

/**
 * Sorts dropdown organism list in asc order in advanced search
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
 * sorting drop down list for category in simplified search page.
 * @author Tatiana Williamson
 * @date October 2, 2018
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
    var name = $("#simplifiedCategory option:selected").val();
    var examples = [];
    var exampleText = "Example";

    switch (name.toLowerCase()) {
        case "enzyme":
            examples = ["B4GALT1"];
            break;
        case "glycan":
            examples = ["G17689DH"];
            break;
        case "organism":
            examples = ["Homo sapiens"];
            break;
        case "protein":
            examples = ["P14210"];
            break;
        default:
            examples = ["G17689DH", "P14210", "B4GALT1", "Homo sapiens"];
            exampleText += "s";
            break;
    }

    //    if (name != "Choose category") {
    $('#simpleCatSelectedOptionExample')[0].innerHTML = exampleText + ": ";
    $.each(examples, function (i, example) {
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
 * Assigns a different text in simple search placeholder
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
 * @class {string} simplifiedCategory for glycan.
 * @class {string} simplifiedSearch for glycan.
 * @param {function} formObjectSimpleSearch JSON for simplified searc.
 * @param JSON call function formObjectSimple.
 */
function searchGlycanSimple() {
    // displays the loading gif when the ajax call starts
    $('#loading_image').fadeIn();

    var prevListId = getParameterByName("id") || "";
    activityTracker("user", prevListId, "Performing Simplified Search");

    // Get values from form fields
    var query_type = "glycan_search_simple";
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
        url: getWsUrl("glycan_search_simple"),
        data: json,
        //timeout: getTimeout("search_simple_glycan"),
        error: ajaxFailure,
        success: function (results) {
            if (results.error_code) {
                displayErrorByCode(results.error_code);
                activityTracker("error", "", "Simplified Search: " + results.error_code + " for " + json);
                $('#loading_image').fadeOut();
            } else if ((results.list_id !== undefined) && (results.list_id.length === 0)) {
                displayErrorByCode('no-results-found');
                activityTracker("user", "", "Simplified Search: no result found for " + json);
                $('#loading_image').fadeOut();
            } else {
                activityTracker("user", prevListId + ">" + results.list_id, "Simplified Search: Searched with modified parameters");
                window.location = './glycan_list.html?id=' + results.list_id;
                $('#loading_image').fadeOut();
            }
        }
    });
}

/**
 * formjason from form submit.
 * @param {string} input_query_type - The user's query_type input to load.
 * @param {string} input_category - The user's term_category input to load.
 * @param {string} input_term - The user's term input to load.
 * */

function searchjsonSimple(input_query_type, input_category, input_term) {
    var formjsonSimple = {
        "operation": "AND",
        query_type: input_query_type,
        term: input_term,
        term_category: input_category.toLowerCase()
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
 * @param {string} id - The glycan id to load
 * */
function LoadDataList(id) {
    var ajaxConfig = {
        dataType: "json",
        url: getWsUrl("glycan_list"),
        data: getListPostData(id, 1, 'mass', 'asc', 10),
        method: 'POST',
        timeout: getTimeout("list_glycan"),
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
    var id = getParameterByName("id")
    if (data.code) {
        console.log(data.code);
        displayErrorByCode(data.code);
        activityTracker("error", id, "error code: " + data.code);
    } else {
        if (data.query) {
            if (data.query.query_type === "glycan_search_simple") {
                $('.nav-tabs a[href="#simple_search"]').tab('show');
                $("#simplifiedCategory").val(data.query.term_category);
                $("#simplifiedSearch").val(data.query.term);
                populateExample();
            } else {
                if (data.query.composition) {
                    $('.nav-tabs a[href="#composition_search"]').tab('show');
                } else {
                    $('.nav-tabs a[href="#advanced_search"]').tab('show');
                }
            }
        }
        activityTracker("user", id, "Search modification initiated");
    }
}
/* ----------------------
 End-Prepopulating search results after clicking modify button on glycan list summary section
 * @author Rupali Mahadik
 * @date October 18, 2018
------------------------- */

/**
 * onSelControlChange sets min, max values based on user selection.
 * @param {object} select_control - Select control.
 * @param {object} min_val - min value control.
 * @param {object} max_val - max value control.
 * @param {string} residue - residue id.
 * */
function onSelControlChange(select_control, min_val, max_val, residue) {
    compSearchRedoReset();
    saveResidueStateToUndoList(residue, parseInt(min_val.value), parseInt(max_val.value));
    var sel_control_value = select_control.value;
    var sel_id = select_control.id;
    var min = undefined;
    var max = undefined;
    var sel_residue = residue_list.filter(function (res) { return residue ==  res.residue })[0];
    if (sel_residue) {
        min = parseInt(sel_residue.min);
        max = parseInt(sel_residue.max);
    }
    if (sel_control_value == "maybe") {
        min_val.value = parseInt(min);
        if (parseInt(max_val.value) == max || parseInt(max_val.value) == min)
            max_val.value = parseInt(max);
    } else if (sel_control_value == "yes") {
        min_val.value = parseInt(min + 1);
        if (parseInt(max_val.value) == max || parseInt(max_val.value) == min)
            max_val.value = parseInt(max);
    } else if (sel_control_value == "no") {
        min_val.value = parseInt(min);
        max_val.value = parseInt(min);
    }
    setResidueMinMaxValue(min_val, max_val, min, max);
}

/**
 * onMinMaxFocus sets residue values to undo_residue_val.
 * @param {object} min_val_cont - min value control.
 * @param {object} max_val_cont - max value control.
 * @param {string} residue - residue id.
 * */
function onMinMaxFocus(min_val_cont, max_val_cont, residue) {
    undo_residue_val = {
        "residue": residue,
        "min": parseInt(min_val_cont.value),
        "max": parseInt(max_val_cont.value)
    };
}

/**
 * onResidueMinMoveOut sets min control value based on select option value.
 * @param {object} inputMin - min value control.
 * @param {object} inputMax - max value control.
 * @param {object} selOption - select control.
 * @param {string} residue - residue id.
 * */
function onResidueMinMoveOut(inputMin, inputMax, selOption, residue) {
    compSearchRedoReset();
    if (undo_residue_val.residue == residue && parseInt(undo_residue_val.min) != parseInt(inputMin.value)) {
        saveResidueStateToUndoList(undo_residue_val.residue, parseInt(undo_residue_val.min), parseInt(undo_residue_val.max));
    }
    if (inputMin.value != "") {
        if (parseInt(inputMin.value) < parseInt(inputMin.min)) {
            inputMin.value = parseInt(inputMin.min);
        }
        if (parseInt(inputMin.value) > parseInt(inputMax.value) && selOption.value != "no") {
            if (parseInt(inputMin.value) < parseInt(inputMax.max)) {
                inputMin.value = parseInt(inputMin.value);
                inputMax.value = parseInt(inputMin.value);
            } else {
                inputMin.value = parseInt(inputMin.max);
                inputMax.value = parseInt(inputMin.max);
            }
        } else if (parseInt(inputMin.value) > parseInt(inputMin.min) && selOption.value == "no") {
            if (parseInt(inputMin.value) > parseInt(inputMax.max)) {
                inputMin.value = parseInt(inputMax.max);
                inputMax.value = parseInt(inputMax.max);
            } else {
                inputMax.value = parseInt(inputMin.value);
            }
        }
    } else if (inputMin.value == "") {
        if (selOption.value == "maybe") {
            inputMin.value = parseInt(inputMin.min);
        } else if (selOption.value == "yes") {
            inputMin.value = parseInt(inputMin.min) + 1;
        } else if (selOption.value == "no") {
            inputMin.value = parseInt(inputMin.min);
        }
    }
    selOption.value = getSelectionValue(parseInt(inputMin.value), parseInt(inputMax.value), parseInt(inputMin.min), parseInt(inputMax.max));
}

/**
 * onResidueMaxMoveOut sets max control value based on select option value.
 * @param {string} inputMax - max value control.
 * @param {string} inputMin - min value control.
 * @param {string} selOption - select control.
 * @param {string} residue - residue id.
 * */
function onResidueMaxMoveOut(inputMax, inputMin, selOption, residue) {
    compSearchRedoReset();
    if (undo_residue_val.residue == residue && parseInt(undo_residue_val.max) != parseInt(inputMax.value)) {
        saveResidueStateToUndoList(undo_residue_val.residue, parseInt(undo_residue_val.min), parseInt(undo_residue_val.max));
    }
    if (inputMax.value != "") {
        if (parseInt(inputMax.value) > parseInt(inputMax.max)) {
            inputMax.value = parseInt(inputMax.max);
        }
        if (parseInt(inputMax.value) < parseInt(inputMin.value)  && selOption.value != "yes") {
            if (parseInt(inputMax.value) > parseInt(inputMin.min)) {
                inputMax.value = parseInt(inputMax.value);
                inputMin.value = parseInt(inputMax.value);
            } else {
                inputMax.value = parseInt(inputMin.min);
                inputMin.value = parseInt(inputMin.min);
            }
        } else if (parseInt(inputMax.value) < parseInt(inputMin.value)  &&  selOption.value == "yes") {
            if (parseInt(inputMax.value) < parseInt(inputMin.min)) {
                inputMin.value = parseInt(inputMin.min);
                inputMax.value = parseInt(inputMin.min);
            } else {
                inputMin.value = parseInt(inputMax.value);
            }
        }
    } else if (inputMax.value == "") {
        if (selOption.value == "maybe") {
            inputMax.value = parseInt(inputMax.max);
        } else if (selOption.value == "yes") {
            inputMax.value = parseInt(inputMax.max);
        } else if (selOption.value == "no") {
            inputMax.value = parseInt(inputMax.min);
        }
    }
    selOption.value = getSelectionValue(parseInt(inputMin.value), parseInt(inputMax.value), parseInt(inputMin.min), parseInt(inputMax.max));
}

/**
 * setResidueMinMaxValue sets min max values for min, max controls.
 * @param {object} min_val_cont - min value control.
 * @param {object} max_val_cont - max value control.
 * @param {object} min - min value.
 * @param {object} max - max value.
 * */
function setResidueMinMaxValue(min_val_cont, max_val_cont, min, max) {
    min_val_cont.min = parseInt(min);
    min_val_cont.max = parseInt(max);
    max_val_cont.min = parseInt(min);
    max_val_cont.max = parseInt(max);
}

/**
 * setCompSearchValues All Yes or All No button handler.
 * @param {string} option specifies "yes" or "no" option.
 */
function setCompSearchValues(option) {
    var residue_list_copy = residue_list.slice();
    residue_list_copy = residue_list_copy.map(function(res) {
        residue = {
            "residue" : res.residue,
            "min" : option == "yes" ? parseInt(res.min) + 1 : parseInt(res.min),
            "max" : option == "yes" ? parseInt(res.max) : parseInt(res.min)
        };
        return residue;
    });
    compSearchRedoReset();
    if (compSearchStateChanged(residue_list_copy)) {
        saveCurrentResidueStatesToUndoList(residue_list_copy);
    }
    setFormValues({
        query: {
            composition: residue_list_copy
        }
    });
}

/**
 * compSearchUndoRedo undo or redo button handler.
 * @param {string} option specifies "undo" or "redo" option.
 */
function compSearchUndoRedo(option) {
    var pre_state = undefined;
    var cur_state = undefined;
    if (option == "undo") {
        pre_state = undo_residue_stack.pop();
        cur_state = getCurrentResidueState(pre_state);
        redo_residue_stack.push(cur_state);
    }
    if (option == "redo") {
        pre_state = redo_residue_stack.pop();
        cur_state = getCurrentResidueState(pre_state);
        undo_residue_stack.push(cur_state);
    }
    setFormValues({
        query: {
            composition: pre_state
        }
    });
    if (undo_residue_stack.length > 0) {
        $('#comp_undo_btn').prop('disabled', false);
    } else {
        $('#comp_undo_btn').prop('disabled', true);
    }
    if (redo_residue_stack.length > 0) {
        $('#comp_redo_btn').prop('disabled', false);
    } else {
        $('#comp_redo_btn').prop('disabled', true);
    }
}

/**
 * compSearchRedoReset resets redo list.
 */
function compSearchRedoReset() {
    redo_residue_stack = [];
    if (redo_residue_stack.length < 1) {
        $('#comp_redo_btn').prop('disabled', true);
    }
}

/**
 * compSearchStateChanged checks if current residue states are changed compared to values in residue list.
 * @param {array} residue_state_list - residue list.
 * */
function compSearchStateChanged(residue_state_list) {
    var stateChanged = false;
    for (var x = 0; x < residue_state_list.length; x++) {
        if (parseInt(document.getElementById("comp_" + residue_state_list[x].residue + "_min").value) != parseInt(residue_state_list[x].min)) {
            stateChanged = true;
            break;
        }
        if (parseInt(document.getElementById("comp_" + residue_state_list[x].residue + "_max").value) != parseInt(residue_state_list[x].max)) {
            stateChanged = true;
            break;
        }
    }
    return stateChanged;
}

/**
 * getCurrentResidueState gets current residue states based on residue list.
 * @param {array} residue_state_list - residue list.
 * */
function getCurrentResidueState(residue_state_list) {
    var cur_residue_list = [];
    for (var x = 0; x < residue_state_list.length; x++) {
        var residue = { "residue": residue_state_list[x].residue, "min": parseInt(document.getElementById("comp_" + residue_state_list[x].residue + "_min").value), "max": parseInt(document.getElementById("comp_" + residue_state_list[x].residue + "_max").value) }
        cur_residue_list.push(residue);
    }
    return cur_residue_list;
}

/**
 * saveResidueStateToUndoList saves residue state to undo list.
 * @param {string} residue - residue id.
 * @param {int} min - min value.
 * @param {int} max - max value.
 * */
function saveResidueStateToUndoList(residue, min, max) {
    var res_list = [];
    var res = {
        "residue": residue,
        "min": parseInt(min),
        "max": parseInt(max)
    };
    res_list.push(res);
    undo_residue_stack.push(res_list);
    if (undo_residue_stack.length > 0) {
        $('#comp_undo_btn').prop('disabled', false);
    }
}

/**
 * saveCurrentResidueStatesToUndoList saves current residue states to undo list.
 *  * @param {array} updated_res_list - residue list.
 */
function saveCurrentResidueStatesToUndoList(updated_res_list) {
    var residue_comp = [];
    for (var x = 0; x < updated_res_list.length; x++) {
        var res_min = parseInt(document.getElementById("comp_" + updated_res_list[x].residue + "_min").value);
        var res_max = parseInt(document.getElementById("comp_" + updated_res_list[x].residue + "_max").value);
        if (res_min != parseInt(updated_res_list[x].min) || res_max != parseInt(updated_res_list[x].max)) {
            var residue = { "residue": updated_res_list[x].residue, "min": res_min, "max": res_max }
            residue_comp.push(residue);
        }
    }
    undo_residue_stack.push(residue_comp);
    if (undo_residue_stack.length > 0) {
        $('#comp_undo_btn').prop('disabled', false);
    }
}

/**
 * getResidueDiv gets html for residue div.
 * @param {string} name - residue name.
 * @param {string} subtext - residue subtext.
 * @param {string} residue - residue id.
 * @param {int} min - max value.
 * @param {int} max - max value.
 * */
function getResidueDiv(name, subtext, residue, min, max) {
    var residueDiv =
        '<div class="col-sm-12"> \
        <label class="control-label col-sm-5 text-left" for="comp_search">' +
        name + ': ' +
        '<br> <span style="font-size:10px; font-style: italic;">' + subtext + '</span>' + 
        '</label> \
        <div class="col-sm-3">' +
        '<select id=' + 'comp_' + residue + '_sel' +
        ' onchange="onSelControlChange(this, comp_' + residue + '_min, comp_' + residue + '_max, \'' + residue + '\')"> \
                <option value="maybe">Maybe</option> \
                <option value="yes">Yes</option> \
                <option value="no">No</option> \
            </select> \
        </div> \
        <div class="col-sm-2"> \
            <input type="number"  \
             min=' + min +
        ' max=' + parseInt(max) +
        ' class="form-control"' +
        ' id=' + 'comp_' + residue + '_min' +
        ' value=' + min +
        ' onblur="onResidueMinMoveOut(this, comp_' + residue + '_max, comp_' + residue + '_sel, \'' + residue + '\')"' +
        ' onfocus="onMinMaxFocus(this, comp_' + residue + '_max, \'' + residue + '\')"> \
        </div> \
        <div class="col-sm-2"> \
            <input type="number" \
            min=' + parseInt(min) +
        ' max=' + max +
        ' class="form-control"' +
        ' id=' + 'comp_' + residue + '_max' +
        ' value=' + max +
        ' onblur="onResidueMaxMoveOut(this, comp_' + residue + '_min, comp_' + residue + '_sel, \'' + residue + '\')"' +
        ' onfocus="onMinMaxFocus(comp_' + residue + '_min, this, \'' + residue + '\')"> \
        </div> \
    </div >';
    return residueDiv;
}
