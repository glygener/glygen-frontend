//@author: Rupali Mahadik
// (Rupali Mahadik-Mustache template, Glycosylation table, Highlighting sequence,evidence display )
// @description: UO1 Version-1.1.
//@Date:19th Feb 2018. Rupali Mahadik-with dummy web service
//@update: 3-April 2018. Rupali Mahadik-with real web service
//@update: June 26-2018- Rupali Mahadik-with web service changes
// @update: July 16, 2018 - Gaurav Agarwal - Error and page visit logging
// @update on July 25 2018 - Gaurav Agarwal - added code for loading gif.
// @update: July 31 2018 - Gaurav Agarwal - added mutation table.
// @update: Aug 1, 2018 - Rupali Mahadik - Table for Biosynthetic enzyme and found glycoprotein
// @update: Aug 6, 2018 - Rupali Mahadik - Grouping for cross ref
// @added: Oct 22, 2018 - Gaurav Agarwal - added downloadPrompt() which gives selection box for downloading data.
// @update: Jan 17th, 2019 - Rupali Mahadik - added new evidence display 
// @update: Mar 12, 2019 - Gaurav Agarwal - added breadcrumbs
// @update: April 7th, 2019 - Rupali Mahadik - Seqeunce display improved




/**
 * Handling a succesful call to the server for details page
 * @param {Object} data - the data set returned from the server on success
 */
function ajaxSuccess(data) {
    if (data.error_code) {
        activityTracker("error", uniprot_canonical_ac, data.error_code);
        // added by Gaurav on July 27, 2018. Web service error display.
        alertify.alert('Error occured', data.error_code);
    } else {
        activityTracker("user", uniprot_canonical_ac, "successful response");
        var template = $('#item_template').html();
        if (data.sequence) {
            var originalSequence = data.sequence.sequence;
            data.sequence.sequence = formatSequence(originalSequence);
            if (data.mass){
                data.mass.chemical_mass = addCommas(data.mass.chemical_mass);

            }
            if (data.gene) {
                for (var i = 0; i < data.gene.length; i++) {
                    // assign the newly result of running formatSequence() to replace the old value
                     data.gene[i].locus.start_pos = addCommas(data.gene[i].locus.start_pos);
                    data.gene[i].locus.end_pos = addCommas(data.gene[i].locus.end_pos);  
                   
                }
             
            }

            if (data.isoforms) {
                for (var i = 0; i < data.isoforms.length; i++) {
                    // assign the newly result of running formatSequence() to replace the old value
                    data.isoforms[i].sequence.sequence = formatSequence(data.isoforms[i].sequence.sequence);
                    data.isoforms[i].locus.start_pos = addCommas(data.isoforms[i].locus.start_pos);
                    data.isoforms[i].locus.end_pos = addCommas(data.isoforms[i].locus.end_pos);
                    if (data.isoforms[i].locus && data.isoforms[i].locus.evidence) {
                        data.isoforms[i].evidence = data.isoforms[i].locus.evidence;
                        formatEvidences([data.isoforms[i]]);
                    }
                }
            }
            if (data.orthologs) {
                for (var i = 0; i < data.orthologs.length; i++) {
                    // assign the newly result of running formatSequence() to replace the old value
                    data.orthologs[i].sequence.sequence = formatSequence(data.orthologs[i].sequence.sequence);
                    if (data.orthologs[i] && data.orthologs[i].evidence) {
                        data.orthologs[i].evidence = data.orthologs[i].evidence;
                        formatEvidences([data.orthologs[i]]);
                    }
                }
            }
        }
        formatEvidences(data.species);
        formatEvidences(data.function);
        formatEvidences(data.mutation);
        formatEvidences(data.glycosylation);
        formatEvidences(data.expression_disease);
        formatEvidences(data.expression_tissue);
        formatEvidences(data.disease);

        data.function = groupEvidences(data.function);


        var itemscrossRef = [];
        //check data.
        if (data.crossref) {
            for (var i = 0; i < data.crossref.length; i++) {
                var crossrefitem = data.crossref[i];
                var found = '';
                for (var j = 0; j < itemscrossRef.length; j++) {
                    var databaseitem = itemscrossRef[j];
                    if (databaseitem.database === crossrefitem.database) {
                        found = true;
                        databaseitem.links.push({
                            url: crossrefitem.url,
                            id: crossrefitem.id
                        });
                    }
                }
                if (!found) {
                    itemscrossRef.push({
                        database: crossrefitem.database,
                        links: [{
                            url: crossrefitem.url,
                            id: crossrefitem.id
                        }]
                    });
                }
            }

            data.itemscrossRef = itemscrossRef;
        }

        var itemsPathway = [];
        if (data.pathway) {
            for (var i = 0; i < data.pathway.length; i++) {
                var pathwayitem = data.pathway[i];
                var found = '';
                for (var j = 0; j < itemsPathway.length; j++) {
                    var databaseitem1 = itemsPathway[j];
                    if (databaseitem1.resource === pathwayitem.resource) {
                        found = true;
                        databaseitem1.links.push({
                            url: pathwayitem.url,
                            id: pathwayitem.id,
                            name: pathwayitem.name
                        });
                    }
                }
                if (!found) {
                    itemsPathway.push({
                        resource: pathwayitem.resource,
                        links: [{
                            url: pathwayitem.url,
                            id: pathwayitem.id,
                            name: pathwayitem.name
                        }]
                    });
                }
            }

            data.itemsPathway = itemsPathway;
        }

        if (data.glycosylation) {
            highlight.o_link_glycosylation = getGlycosylationHighlightData(data.glycosylation, 'O-linked');
            highlight.n_link_glycosylation = getGlycosylationHighlightData(data.glycosylation, 'N-linked');

            data.glycosylation.sort(function (a, b) {
                // compare residue firs
                if (a.residue < b.residue) { return -1; }
                else if (b.residue < a.residue) { return 1; }
                // compare position
                else if (a.position < b.position) { return -1; }
                else if (b.position < a.position) { return 1; }

                // else the same
                return 0;
            });

            data.hasGlycosylation = (data.glycosylation.length > 0);
        }

        function hasGlycanId(item) {
            return (item.glytoucan_ac !== undefined);
        }

        if (data.glycosylation) {
            data.glycosylation = data.glycosylation.map(function (item) {
                item.residue = item.residue + item.position;
                return item;
            });

            data.itemsGlycosyl = data.glycosylation.filter(hasGlycanId);

            data.itemsGlycosyl2 = data.glycosylation.filter(function (item) {
                return !(hasGlycanId(item));
            });
        }
        var itemsMutate = [];


        // filling in mutation data
        if (data.mutation) {
            // Get data for sequence highlight
            highlight.mutation = getMutationHighlightData(data.mutation);

            for (var i = 0; i < data.mutation.length; i++) {
                var mutate = data.mutation[i];
                formatEvidences([mutate]);

                itemsMutate.push({
                    annotation: mutate.annotation,
                    disease: mutate.disease,
                    type: mutate.type,
                    start_pos: mutate.start_pos,
                    end_pos: mutate.end_pos,
                    // merging the two sequences, separated by arrow symbol.
                    sequence: mutate.sequence_org + " &#8594 " + mutate.sequence_mut,
                    evidence: mutate.evidence,
                    database: mutate.databases
                });
            }
        }


        if (data.glycosylation) {
            data.o_link_glycosylation_count = highlight.o_link_glycosylation.reduce(function (total, current) {
                return total + current.length;
            }, 0);
        }
        if (data.glycosylation) {
            data.n_link_glycosylation_count = highlight.n_link_glycosylation.reduce(function (total, current) {
                return total + current.length;
            }, 0);
        }

        if (data.mutation) {
            data.mutation_count = highlight.mutation.reduce(function (total, current) {
                return total + current.length;
            }, 0);
        }
        var sequenceData = buildHighlightData(originalSequence, highlight);
        var html = Mustache.to_html(template, data);
        var $container = $('#content');
        $container.html(html);
        // setupEvidenceList();

        if (window.innerWidth <= 500) {
            createHighlightUi(sequenceData, 10);
        } else {
            createHighlightUi(sequenceData, 60);
        }


        // glycosylation table
        $('#glycosylation-table').bootstrapTable({
            columns: [
                {
                    field: 'databases',
                    title: 'Sources',
                    sortable: true,
                    formatter: EvidencebadgeFormator
                },
                {
                    field: 'glytoucan_ac',
                    title: 'GlyTouCan <br/> Accession',
                    sortable: true,
                    formatter: function (value, row, index, field) {
                        return "<a href='glycan_detail.html?glytoucan_ac=" + value + "'>" + value + "</a>"
                    }
                },
                {
                    field: 'type',
                    title: 'Type',
                    sortable: true
                },

                {
                    field: 'residue',
                    title: 'Residue',
                    sortable: true
                },
                {
                    field: 'imageFormat',
                    title: 'Image of Glycan Structure',
                    sortable: true,

                    formatter: function imageFormat(value, row, index, field) {
                        var url = getWsUrl('glycan_image', row.glytoucan_ac);
                        return "<div class='img-wrapper'><img class='img-cartoon' src='" + url + "' alt='Cartoon' /></div>";
                    }
                }
            ],
            pagination: 10,
            data: data.itemsGlycosyl,
            onPageChange: function () {
                scrollToPanel("#glycosylation");
                // setupEvidenceList();
            },
           

        });

        // glycosylation table
        $('#glycosylation-table2').bootstrapTable({
            columns: [
                {
                    field: 'databases',
                    title: 'Sources',
                    sortable: true,
                    formatter: EvidencebadgeFormator
                },
                {
                    field: 'type',
                    title: 'Type',
                    sortable: true
                },

                {
                    field: 'residue',
                    title: 'Residue',
                    sortable: true

                }
            ],
            pagination: 10,
            data: data.itemsGlycosyl2,
            onPageChange: function () {
                scrollToPanel("#glycosylation");
                // setupEvidenceList();
            },
          
       
        });

        $(".EmptyFind").each(function () {
            var $tid = $(this).attr("id");
            var $txt = $(this).text();
            if ($txt == "") {
                $('a[data-target=#' + $tid + ']').closest('table').hide();
            }
        });
        $('#loading_image').fadeOut();
        // mutation table
        $('#mutation-table').bootstrapTable({
            columns: [
                {
                    field: 'database',
                    title: 'Sources',
                    sortable: true,
                    formatter: EvidencebadgeFormator
                },

                {
                    field: 'annotation',
                    title: 'Annotation name',
                    sortable: true
                },
                {
                    field: 'disease',
                    title: 'Disease',
                    sortable: true,
                    formatter: function (value, row, index, field) {
                        var diss;
                        if (value.icd10)
                            diss = value.name + " (ICD10: " + value.icd10 + " ; DOID: <a href='" + value.url + "' target='_blank'>" + value.doid + "</a>)";
                        else
                            diss = value.name + " (DOID: <a href='" + value.url + "' target='_blank'>" + value.doid + "</a>)";
                        return diss;
                    }
                },
                {
                    field: 'start_pos',
                    title: 'Start pos',
                    sortable: true
                },
                {
                    field: 'end_pos',
                    title: 'End pos',
                    sortable: true
                },
                {
                    field: 'sequence',
                    title: 'Sequence',
                    sortable: true
                },
                {
                    field: 'type',
                    title: 'Type',
                    sortable: true
                }],
            pagination: 10,
            data: itemsMutate,
          
        });

        $('#loading_image').fadeOut();

        // expression Disease table
        $('#expressionDisease-table').bootstrapTable({
            columns: [
                {
                    field: 'databases',
                    title: 'Sources',
                    sortable: true,
                    formatter: EvidencebadgeFormator
                },
                {
                    field: 'disease',
                    title: 'Disease',
                    sortable: true,
                    formatter: function (value, row, index, field) {
                        var diss1;
                        if (value.icd10)
                            diss1 = value.name + " (ICD10: " + value.icd10 + " ; DOID: <a href='" + value.url + "' target='_blank'>" + value.doid + "</a>)";
                        else
                            diss1 = value.name + " (DOID: <a href='" + value.url + "' target='_blank'>" + value.doid + "</a>)";
                        return diss1;
                    }
                },
                {
                    field: 'significant',
                    title: 'Significant',
                    sortable: true
                },
                {
                    field: 'trend',
                    title: 'Expression Trend',
                    sortable: true
                },
            ],
            pagination: 10,
            data: data.expression_disease,
            onPageChange: function () {

                setupEvidenceList();
            }
           
        });

        $('#loading_image').fadeOut();

        // expression Disease table
        $('#expressionTissue-table').bootstrapTable({
            columns: [
                {
                    field: 'databases',
                    title: 'Sources',
                    sortable: true,
                    formatter: EvidencebadgeFormator
                },
                {
                    field: 'tissue',
                    title: 'Tissue',
                    sortable: true,
                    formatter: function (value, row, index, field) {
                        return value.name + " (UBERON: <a href='" + value.url + "' target='_blank'>" + value.uberon + "</a>)"
                    }
                },
                {
                    field: 'present',
                    title: 'Present',
                    sortable: true,
                    class: 'upper-case'
                }

            ],

            pagination: 10,
            data: data.expression_tissue,
            onPageChange: function () {

                setupEvidenceList();
            }
           
        });
    }
    setupEvidenceList();
    $('#loading_image').fadeOut();
    updateBreadcrumbLinks();
}


/**
 * @param {id} the LoadData function to configure and start the request to GWU service
 * Returns the GWU services.
 */

function LoadData(uniprot_canonical_ac) {
    var ajaxConfig = {
        dataType: "json",
        url: getWsUrl("protein_detail", uniprot_canonical_ac),
        method: 'POST',
        timeout: getTimeout("detail_protein"),
        success: ajaxSuccess,
        error: ajaxFailure
    };

    // calls the service
    $.ajax(ajaxConfig);
}



/**
 * getParameterByName function to extract query parametes from url
 * @param {name} string for the name of the variable variable to extract from query string
 * @param {url} string with the complete url with query string values
 * Returns the GWU services.
 */

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}



$(document).ready(function () {
    uniprot_canonical_ac = getParameterByName('uniprot_canonical_ac');
    id = uniprot_canonical_ac;
    document.title = uniprot_canonical_ac + " Detail - glygen"; //updates title with the protein ID
    LoadData(uniprot_canonical_ac);
    updateBreadcrumbLinks();
});

/**
 * this function gets the URL query values
 * and updates the respective links on the breadcrumb fields.
 */
function updateBreadcrumbLinks() {
    const listID = getParameterByName("listID") || "";
    const globalSearchTerm = getParameterByName("gs") || "";
    var glycanPageType = "";
    
    if (window.location.pathname.indexOf("glycoprotein") >= 0)
        glycanPageType = "glycoprotein";
    else
        glycanPageType = "protein";

    if (globalSearchTerm) {
        $('#breadcrumb-search').text("General Search");
        $('#breadcrumb-search').attr("href", "global_search_result.html?search_query=" + globalSearchTerm);
        if (listID)
            $('#breadcrumb-list').attr("href", glycanPageType + "_list.html?id=" + listID + "&gs=" + globalSearchTerm);
        else
            $('#li-breadcrumb-list').css('display', 'none');
    } else {
        $('#breadcrumb-search').attr("href", glycanPageType + "_search.html?id=" + listID);
        if (listID)
            $('#breadcrumb-list').attr("href", glycanPageType + "_list.html?id=" + listID);
        else
            $('#li-breadcrumb-list').css('display', 'none');
    }
}

/**
 * Gets the values selected in the download dropdown 
 * and sends to the downloadFromServer() function in utility.js
 * @author Gaurav Agarwal
 * @since Oct 22, 2018.
 */
function downloadPrompt() {
    var page_type = "protein_detail";
    var format = $('#download_format').val();
    var IsCompressed = false; //$('#download_compression').is(':checked');
    downloadFromServer(uniprot_canonical_ac, format, IsCompressed, page_type);
}
