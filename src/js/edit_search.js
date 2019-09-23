// @author: Rupali Mahadik
// @description: UO1 Version-1.1.
// @Date:20th June 2018.
// @refactored:June-27-2017


/**
 * setting the Form Values based on object data
 * @param {object} data - The data is object with query value
 * @param {object} data.query -
 */
function setFormValues(data) {
    if (data.query) {
        $("#glycan_id").val(data.query.glytoucan_ac);
        if (data.query.mass) {
            var massSlider = document.getElementById('sliderbox-slider');
            massSlider.noUiSlider.set([data.query.mass.min, data.query.mass.max]);
        }
        if (data.query.number_monosaccharides) {
            var massSlider1 = document.getElementById('sliderbox-slider1');
            massSlider1.noUiSlider.set([data.query.number_monosaccharides.min, data.query.number_monosaccharides.max]);
        }

        $("#species").val(data.query.organism? data.query.organism.id : 0);
        $("#ddl").val(data.query.glycan_type || "");
        var types = document.getElementById('ddl');
        var subtypes = document.getElementById('ddl2');
        // create subtypes
        configureDropDownLists(types, subtypes, function () {
            $("#ddl2").val(data.query.glycan_subtype);
        });
        $("#enzyme").val(data.query.enzyme? data.query.enzyme.id : "");
        $("#protein").val(data.query.protein_identifier || "");
        $("#motif").val(data.query.glycan_motif || "");
    }
}

/**
 * setting the Form Values based on object data
 * @param {object} data - The data is object with query value
 * @param {object} data.query -
 */
function setProteinFormValues(data) {
    if (data.query) {
        $("#protein").val(data.query.uniprot_canonical_ac);
        if (data.query.mass) {
            var massSlider = document.getElementById('sliderbox-slider');
            massSlider.noUiSlider.set([data.query.mass.min, data.query.mass.max]);
        }
        $("#species").val(data.query.organism? data.query.organism.id : "0");
        $("#gene_name").val(data.query.gene_name || "");
        $("#protein_name").val(data.query.protein_name || "");
        $("#pathway").val(data.query.pathway_id || "");
        $("#sequences").val(data.query.sequence? data.query.sequence.aa_sequence : "");
        $("#type").val(data.query.sequence? data.query.sequence.type : "");
        $("#refseq").val(data.query.refseq_ac || "");
    }
}
/**
 * setting the Form Values based on object data
 * @param {object} data - The data is object with query value
 * @param {object} data.query -
 */
function setGlycoProteinFormValues(data) {
    if (data.query) {
        $("#protein").val(data.query.uniprot_canonical_ac);
        if (data.query.mass) {
            var massSlider = document.getElementById('sliderbox-slider');
            massSlider.noUiSlider.set([data.query.mass.min, data.query.mass.max]);
        }
        $("#species").val(data.query.organism.id? data.query.organism.id : 0);
        $("#gene_name").val(data.query.gene_name || "");
        $("#glycan_id").val(data.query.glycan? data.query.glycan.glytoucan_ac : "");
        $("#relation").val(data.query.glycan? data.query.glycan.relation : "");
        $("#protein_name").val(data.query.protein_name || "");
        $("#pathway").val(data.query.pathway_id || "");
        $("#sequences").val(data.query.sequence? data.query.sequence.aa_sequence : "");
        $("#type").val(data.query.sequence? data.query.sequence.type : "");
        $("#glycosylated_aa").val(data.query.glycosylated_aa || "").trigger("chosen:updated");
        // $("#glycosylated_aa").val('').trigger("chosen:updated");
        $("#glycosylation_evidence").val(data.query.glycosylation_evidence || "");
        $("#refseq").val(data.query.refseq_ac || "");
    }
}

/**
 * fail to to get search data
 * @param {object} data - The Retreive data
 */
function failToRetreiveSearch(data) {
    showJsError = true;
    displayErrorByCode('server_down');
    showJsError = false;
}

/**
 * Loading data from protein list service
 * @param {string} id - The serach id
 */
function LoadProteinSearchvalues(id) {
    var ajaxConfig = {
        dataType: "json",
        url: getWsUrl("protein_list"),
        data: getListPostData(id, 1, 'uniprot_canonical_ac', 'asc', 1),
        method: 'POST',
        success: setProteinFormValues,
        error: failToRetreiveSearch
    };
    // make the server call
    $.ajax(ajaxConfig);
}

/**
 * Loading data from protein list service
 * @param {string} id - The serach id
 */
function LoadGlycoProteinSearchvalues(id) {
    var ajaxConfig = {
        dataType: "json",
        url: getWsUrl("protein_list"),
        data: getListPostData(id, 1, 'uniprot_canonical_ac', 'asc', 1),
        method: 'POST',
        success: setGlycoProteinFormValues,
        error: failToRetreiveSearch
    };
    // make the server call
    $.ajax(ajaxConfig);
}

/**
 * Loading data from glycan list service
 * @param {string} id - The serach id
 */
//Here I am defining ajax call here.
function LoadSearchvalues(id) {
    var ajaxConfig = {
        dataType: "json",
        url: getWsUrl("glycan_list"),
        data: getListPostData(id, 1, 'glytoucan_ac', 'asc', 1),
        method: 'POST',
        success: setFormValues,
        error: failToRetreiveSearch
    };
    // make the server call
    $.ajax(ajaxConfig);
}


function editSearch_quick() {
    var question =  getParameterByName('question');
        //window.location.replace("quick_search.html?id=" + id + '&question=' + question);
        window.location.replace("quick_search.html?id=" + id + '&question=' + question + '#' +question );
   
        activityTracker("user", id, "edit search");
}
//Do not remove this code
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
