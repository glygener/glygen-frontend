//@author: Rupali Mahadik
// @description: UO1 Version-1.5.
// @Date:Oct 1/2019.

/**
 * Format function to create link to the details page
 * @param {object} aln- The entire data  set 
 * @return -Leading rending line of block
 */

    function renderSequenceValue(aln) {
        var line = $('<div class="aln-line-value col-xs-12 col-md-8" />');
        line.text(aln.string);
        return line;
    }

    /**
 * Format function to create link to the details page
 * @param {object} aln- The entire data  set 
 * @return -Href link for proteinIDs which redirect to protein deatil page of specific protein 
 */
    function renderSequenceLink(aln){
        var collink = $('<div class="aln-line-header col-xs-12 col-md-1" />');
        var link = $('<a class="aln-line-link" />');
        link.text(aln.id);
        link.attr("href", "protein_detail.html?uniprot_canonical_ac=" + aln.id);
        link.appendTo(collink);
        return collink;

    }

       /**
 * Format function to create link to the details page
 * @param {object} aln- The entire data  set 
 * @return -Protein name
 */
    function renderSequenceName(aln) {
        var namelink = $('<div class="aln-line-header col-xs-12 col-md-3 nameclass" />');
        namelink.text(aln.name);
        return namelink;
    }

       /**
 * Format function to create link to the details page
 * @param {object} aln- The entire data  set 
 * @return -line which will have link name and seq
 */
    function renderSequenceLine(aln) {
        var line = $('<div class="aln-line row" />');

        // generate leading content
        var link = renderSequenceLink(aln);
        var name = renderSequenceName(aln);
        var seq = renderSequenceValue(aln);
        link.appendTo(line);
        name.appendTo(line);
        seq.appendTo(line);

        return line;
    }

           /**
 * Format function to create link to the details page
 * @param {object} sequenceAlignment- The entire consesus string
 * @return -line of align consesus string
 */

    function renderAlignmentLine(sequenceAlignment) {
        var line = $('<div class="aln-line row" />');
        // make a container for the name
        var col1 = $('<div class="col-xs-12  col-md-4" />');
        col1.text("  ");
        var name = $('<div class="aln-line-consensus col-xs-12 col-md-8" />');
        name.text(sequenceAlignment.string);
        col1.appendTo(line);
        name.appendTo(line);
        return line;
    }

              /**
 * Format function to create link to the details page
 * @param {object} sequenceAlignment- The entire consesus string
 * @return -line of align consesus string
 */

    function renderSequence(sequenceObject) {
        // Makes a block to hold all the sequences and consensus
        var block = $('<div class="aln-block" />');

        // for each aln, make a display line
        $(sequenceObject.sequences).each(function (i, obj) {
            // generate the display, add to the block
            renderSequenceLine(obj).appendTo(block);
        });

        // create the consensus display, and add to the block;
        renderAlignmentLine(sequenceObject.consensus).appendTo(block);

        return block;
    }

    function renderSequences(sequenceArray) {
        // for each aln, make a display block
        $(sequenceArray).each(function (i, obj) {
            // generate the display, add block to ui
            renderSequence(obj).appendTo('#sequncealign');
        });
    }


    // finds the max length of all sequences or consensus
    function findMaxSequenceLength(sequenceObject) {
        // get length of consensus
        var alignmentLength = sequenceObject.consensus.length;
        // get length of all sequences
        var sequenceLengths = sequenceObject.sequences.map(function (aln) {
            return aln.aln.length;
        });
        // sort aln length, from smallest to largest
        sequenceLengths.sort();
        // get the largest aln length
        var maxSequenceLength = sequenceLengths[sequenceLengths.length - 1];
        var uniprot_canonical_ac = getParameterByName("uniprot_canonical_ac");
        //log if consensus not equal to the longest sequence
        activityTracker("error", uniprot_canonical_ac, "Longest seq length=" + maxSequenceLength + ", Consensus length=" + alignmentLength);
        // return whichever is larger
        return Math.max(alignmentLength, maxSequenceLength);
    }

            // this function breaks aln data into blocks with data per line
            function formatSequenceBlocks(sequenceObject, perLine) {
                var sequenceBlocks = [];
                var maxSequenceLength = findMaxSequenceLength(sequenceObject);
                for (var x = 0; x < maxSequenceLength; x += perLine) {
                    var sequenceBlock = {
                        // holds each aln peice for the block
                        sequences: sequenceObject.sequences.map(function (aln) {
                            return {
                                start: x,
                                id: aln.id,
                                name: aln.name,
                                string: aln.aln.substr(x, perLine)
                            };
                        }),
                        // consensus data for block
                        consensus: {
                            start: x,
                            string: sequenceObject.consensus.substr(x, perLine)
                        }
                    };
    
                    sequenceBlocks.push(sequenceBlock);
                }
    
                return sequenceBlocks;
            }

            function buildSummary(aln) {
                var Datadate = new Date(aln.date);
                document.getElementById("date").innerHTML = Datadate;
                var DataCluId= aln.cls_id;
                document.getElementById("cluid").innerHTML = DataCluId;
                var DatauniId = aln._id
                document.getElementById("unid").innerHTML = DatauniId;
                var Dataident = aln.identity
                document.getElementById("ident").innerHTML = Dataident;
                var Dataidentpos = aln.identical_positions;
                document.getElementById("identpos").innerHTML = Dataidentpos;
                var Datasimilarpos = aln.similar_positions;
                document.getElementById("pos").innerHTML = Datasimilarpos;
                var Dataalgo = aln.algorithm.name;
                document.getElementById("algo").innerHTML = Dataalgo;
                var url = aln.algorithm.url;
                var parameter = aln.algorithm.parameter;
                var algname = aln.algorithm.name;
             
                // url += "?parameter=" + aln.algorithm.parameter
                $("#algo").attr("href", url);
               
            }

function ajaxAlignSuccess(aln) {
    if (aln.code) {
        console.log(aln.code);
        displayErrorByCode(aln.code);
        //activityTracker("error", id, "error code: " + data.code + " (page: " + page + ", sort: " + sort + ", dir: " + dir + ", limit: " + limit + ")");
    } else {
       
        var perLine = 60;
        var sequenceBlockData = formatSequenceBlocks(aln, perLine);
        renderSequences(sequenceBlockData);
        buildSummary(aln);
    }

    updateBreadcrumbLinks();
 
}




function updateBreadcrumbLinks() {
    const proteinacc = getParameterByName("uniprot_canonical_ac") || "";
    const listID = getParameterByName("listID") || "";
    //const listID = "2f5f963be06fd39152da2a54508a9935";
    const globalSearchTerm = getParameterByName("gs") || "";
    var glycanPageType = window.location.pathname.includes("glycoprotein") ?
        "glycoprotein" :
        "protein";

    if (globalSearchTerm) {
        $("#breadcrumb-search").text("General Search");
        $("#breadcrumb-search").attr(
            "href",
            "global_search_result.html?search_query=" + globalSearchTerm
        );
        if (listID)
            $("#breadcrumb-list").attr(
                "href",
                glycanPageType + "_list.html?id=" + listID + "&gs=" + globalSearchTerm
            );
        else $("#li-breadcrumb-list").css("display", "none");
    } else {
        $("#breadcrumb-search").attr(
            "href",
            glycanPageType + "_search.html?id=" + listID
        );
        if (listID && (listID !== 'null'))
            $("#breadcrumb-list").attr(
                "href",
                glycanPageType + "_list.html?id=" + listID
            );
        else $("#li-breadcrumb-list").css("display", "none");
    }
    if (proteinacc) {
        $("#breadcrumb-detail").attr(
            "href",
            glycanPageType +
            "_detail.html?uniprot_canonical_ac=" +
            proteinacc +
            "&listID=" +
            listID +
            "#isoforms"
        );
    } else {
        $("#li-breadcrumb-detail").css("display", "none");
    }
    if (proteinacc) {
        $("#breadcrumb-detailback").attr(
            "href",
            glycanPageType +
            "_detail.html?uniprot_canonical_ac=" +
            proteinacc +
            "&listID=" +
            listID +
            "#isoforms"
        );
    }
}
/**
 * LoadDataList function to configure and start the request to GWU  service
 * @param {string} id - The protein id to load
 * */
function LoadDataisoAlignment() {
    var uniprot_canonical_ac = getParameterByName('uniprot_canonical_ac');
    var listID = getParameterByName('listID');
    var cluster_type = "isoformset.uniprotkb";
    var aln = {
        dataType: "json",
        url: getWsUrl("protein_alignment"),
        data: getAlignmentPostData(uniprot_canonical_ac, cluster_type),
        method: 'GET',
        success: ajaxAlignSuccess,
    };
    // make the server call
    $.ajax(aln);
    $(".title_protein").html(uniprot_canonical_ac);
}
$(document).ready(function () {
    LoadDataisoAlignment();
});
/**
 * getParameterByName function to Extract query parameters from url
 * @param {string} name - The name of the variable to extract from query string
 * @param {string} url- The complete url with query string values
 * @return- A new string representing the decoded version of the given encoded Uniform Resource Identifier (URI) component.
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