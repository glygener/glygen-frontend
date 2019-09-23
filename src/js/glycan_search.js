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
var mass_max;
var mass_min;
var sugar_mass_min;
var sugar_mass_max;
$(document).ready(function () {
    //Section for populating label names from key-value.json
    populateFromKeyValueStore("lbl_glytoucan_acc", "GLYTOUCAN_ACCESSION", "", ":", 2);
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
            result.organism.sort(sortDropdown);
            for (var x = 0; x < result.organism.length; x++) {
                createOption(orgElement, result.organism[x].name, result.organism[x].id);
            }
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

            mass_max = Math.ceil(result.glycan_mass.max);
            mass_min = Math.floor(result.glycan_mass.min);
            var sugar_mass_min = Math.floor(result.number_monosaccharides.min);
            var sugar_mass_max = Math.ceil(result.number_monosaccharides.max);

            var id = getParameterByName('id') || id;
            if (id) {
                LoadSearchvalues(id);
            }
            new Sliderbox({
                target: '.sliderbox',
                start: [mass_min, mass_max], // Handle start position
                connect: true, // Display a colored bar between the handles
                behaviour: 'tap-drag', // Move handle on tap, bar is draggable
                range: { // Slider can select '0' to '100'
                    'min': mass_min,
                    'max': mass_max
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
    activityTracker("user", prevListId, "Performing Advanced Search");
    var query_type = "search_glycan";
    var mass_slider = document.getElementById("sliderbox-slider").noUiSlider.get();
    var sugar_slider = document.getElementById("sliderbox-slider1").noUiSlider.get();
    var glycan_id = document.getElementById("glycan_id").value;
    var selected_species = document.getElementById("species");
    var organism = {
        "id": parseInt(selected_species.value),
        "name": selected_species.options[selected_species.selectedIndex].text
    };
    var glycan_type = document.getElementById("ddl").value;
    var glycan_subtype = document.getElementById("ddl2").value;
    var proteinid = document.getElementById("protein").value;
    var enzyme = document.getElementById("enzyme").value;
    var glycan_motif = document.getElementById("motif").value;
    var formObject = searchjson(query_type, glycan_id, mass_slider[0], mass_slider[1], sugar_slider[0], sugar_slider[1], organism, glycan_type, glycan_subtype, enzyme, proteinid, glycan_motif);
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
                activityTracker("error", "", "Advanced Search: " + results.error_code + " for " + json);
                $('#loading_image').fadeOut();
            } else if ((results.list_id !== undefined) && (results.list_id.length === 0)) {
                displayErrorByCode('no-results-found');
                activityTracker("user", "", "Advanced Search: no result found for " + json);
                $('#loading_image').fadeOut();
            } else {
                activityTracker("user", prevListId + ">" + results.list_id, "Advanced Search: Searched with modified parameters");
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
    setFormValues({
        query: {
            query_type: "search_glycan",
            mass: {
                "min": mass_min,
                "max": mass_max
            },
            number_monosaccharides: {
                "min": 1,
                "max": 37
            },
            enzyme: {},
            glytoucan_ac: "",
            organism: {
                id: "0"
            },
            glycan_type: "",
            glycan_subtype: "",
            protein_identifier: "",
            glycan_motif: ""
        }
    });
}

/** 
 * Forms searchjson from the form values submitted
 * @param {string} input_query_type query search
 * @param {string} input_glycan_id user glycan id input
 * @param {string} mass_min user mass min input
 * @param {string} mass_max user mass max input
 * @param {string} input_organism user organism input
 * @param {string} input_glycantype user glycan_type input
 * @param {string} input_glycansubtype user glycan_subtype input
 * @param {string} input_enzyme user enzyme input
 * @param {string} input_proteinid user uniprot_id input
 * @param {string} input_motif user motif input
 * @return {string} returns text or id
 */
function searchjson(input_query_type, input_glycan_id, mass_min, mass_max, sugar_min, sugar_max, input_organism, input_glycantype, input_glycansubtype, input_enzyme, input_proteinid, input_motif) {
    var enzymes = {}
    if (input_enzyme) {
        enzymes = {
            "id": input_enzyme,
            "type": "gene"
        }
    }
    var organisms = {
        "id": 0,
        "name": "All"
    }
    if (input_organism.id !== "0") {
        organisms.id = input_organism.id;
        organisms.name = input_organism.name;
    }
    var formjson = {
        "operation": "AND",
        query_type: input_query_type,
        mass: {
            "min": parseInt(mass_min),
            "max": parseInt(mass_max)
        },
        // mass:masses,
        number_monosaccharides: {
            "min": parseInt(sugar_min),
            "max": parseInt(sugar_max)
        },
        enzyme: enzymes,
        glytoucan_ac: input_glycan_id,
        organism: organisms,
        glycan_type: input_glycantype,
        glycan_subtype: input_glycansubtype,
        protein_identifier: input_proteinid,
        glycan_motif: input_motif,
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
            examples = ["P14210-1"];
            break;
        default:
            examples = ["G17689DH", "P14210-1", "B4GALT1", "Homo sapiens"];
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
                $('.nav-tabs a[href="#advanced_search"]').tab('show');
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
