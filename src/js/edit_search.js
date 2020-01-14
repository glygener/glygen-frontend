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
        if (data.query.query_type){
            var glytoucan_id = data.query.glytoucan_ac;
            if (glytoucan_id && glytoucan_id.length > 0) {
                glytoucan_id = glytoucan_id + ',';
            }
            $("#glycan_id").val(glytoucan_id);
            $("#mass-drop").val(data.query.mass_type ? data.query.mass_type : mass_type_native);
        
            var min_range = native_mass_min;
            var max_range = native_mass_max;
            var min = native_mass_min;
            var max = native_mass_max;
            if (data.query.mass_type != mass_type_native) {
                min_range = perMet_mass_min;
                max_range = perMet_mass_max;
                min = perMet_mass_min;
                max = perMet_mass_max;
            }
            if (data.query.mass) {
                min = data.query.mass.min;
                max = data.query.mass.max;
            }

            var massSlider = document.getElementById('sliderbox-slider');
            massSlider.noUiSlider.updateOptions({
                    range: {
                        'min': min_range,
                        'max': max_range
                    }
                });
            massSlider.noUiSlider.set([min, max]);

            var monosaccharides_min = sugar_mass_min;
            var monosaccharides_max = sugar_mass_max;
            if (data.query.number_monosaccharides) {
                monosaccharides_min = data.query.number_monosaccharides.min;
                monosaccharides_max = data.query.number_monosaccharides.max;
            }

            var massSlider1 = document.getElementById('sliderbox-slider1');
            massSlider1.noUiSlider.set([monosaccharides_min, monosaccharides_max]);

            var organism_id = undefined;
            if (data.query.organism && data.query.organism.organism_list) {
                organism_id = data.query.organism.organism_list.map(function(organism){return organism.id})
            }

            $("#species").val(organism_id || "").trigger("chosen:updated");
            $("#species_operation").val(data.query.organism ? data.query.organism.operation: "or");
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
            $("#pmid").val(data.query.pmid || "");
        }
        if (data.query.composition){
            for (i = 0; i < data.query.composition.length; i++ ){
                var res_curr = residue_list.filter(function(res) {return data.query.composition[i].residue == res.residue})[0];
                $("#comp_" + data.query.composition[i].residue + "_sel").val(getSelectionValue(data.query.composition[i].min, data.query.composition[i].max, res_curr.min, res_curr.max));
                setResidueMinMaxValue(document.getElementById("comp_" + data.query.composition[i].residue + "_min"), document.getElementById("comp_" + data.query.composition[i].residue + "_max"), 
                                        res_curr.min, res_curr.max);
                $("#comp_" + data.query.composition[i].residue + "_min").val(data.query.composition[i].min);
                $("#comp_" + data.query.composition[i].residue + "_max").val(data.query.composition[i].max);
            }
        }
    }
}

/**
 * setting the Form Values based on object data
 * @param {object} data - The data is object with query value
 * @param {object} data.query -
 */
function setProteinFormValues(data) {
    if (data.query) {
        var uniprot_canonical_ac = data.query.uniprot_canonical_ac;
        if (uniprot_canonical_ac && uniprot_canonical_ac.length > 0) {
            uniprot_canonical_ac = uniprot_canonical_ac + ',';
        }
        $("#protein").val(uniprot_canonical_ac);
        var min = mass_min;
        var max = mass_max;
        if (data.query.mass) {
            min = data.query.mass.min;
            max = data.query.mass.max;
        }
        var massSlider = document.getElementById('sliderbox-slider');
        massSlider.noUiSlider.set([min, max]);
        $("#species").val(data.query.organism ? data.query.organism.id : "0");
        $("#gene_name").val(data.query.gene_name || "");
        $("#protein_name").val(data.query.protein_name || "");
        $("#go_term").val(data.query.go_term || "");
        $("#go_id").val(data.query.go_id || "");
        $("#pmid").val(data.query.pmid || "");
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
        var uniprot_canonical_ac = data.query.uniprot_canonical_ac;
        if (uniprot_canonical_ac && uniprot_canonical_ac.length > 0) {
            uniprot_canonical_ac = uniprot_canonical_ac + ',';
        }
        $("#protein").val(uniprot_canonical_ac);
        var min = mass_min;
        var max = mass_max;
        if (data.query.mass) {
            min = data.query.mass.min;
            max = data.query.mass.max;
        }
        var massSlider = document.getElementById('sliderbox-slider');
        massSlider.noUiSlider.set([min, max]);
        $("#species").val(data.query.organism ? data.query.organism.id : 0);
        $("#gene_name").val(data.query.gene_name || "");
        $("#glycan_id").val(data.query.glycan? data.query.glycan.glytoucan_ac : "");
        $("#relation").val(data.query.glycan? data.query.glycan.relation : "");
        $("#protein_name").val(data.query.protein_name || "");
        $("#go_term").val(data.query.go_term || "");
        $("#go_id").val(data.query.go_id || "");
        $("#pmid").val(data.query.pmid || "");
        $("#pathway").val(data.query.pathway_id || "");
        $("#sequences").val(data.query.sequence? data.query.sequence.aa_sequence : "");
        $("#type").val(data.query.sequence? data.query.sequence.type : "");
        $("#glycosylated_aa").val(data.query.glycosylated_aa ? data.query.glycosylated_aa.aa_list : "").trigger("chosen:updated");
        $("#glycosylated_aa_operation").val(data.query.glycosylated_aa ? data.query.glycosylated_aa.operation : "or");
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
