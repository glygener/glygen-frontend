//@author: Rupali Mahadik
// (Rupali Mahadik-Mustache template, Glycosylation table, Highlighting sequence,evidence display )
// @description: UO1 Version-1.1.

var annotations;
/**
 * Handling a succesful call to the server for details page
 * @param {Object} data - the data set returned from the server on success
 */
function ajaxSuccess(data) {
  if (data.error_code) {
    activityTracker("error", uniprot_canonical_ac, data.error_code);
    alertify.alert("Error occured", data.error_code);
  } else {
    activityTracker("user", uniprot_canonical_ac, "successful response");
    var template = $("#item_template").html();
    if (data.sequence) {
      var originalSequence = data.sequence.sequence;
      data.sequence.sequence = originalSequence.split("");
      if (data.gene) {
        for (var i = 0; i < data.gene.length; i++) {
          // assign the newly result of running formatSequence() to replace the old value
          data.gene[i].locus.start_pos = addCommas(
            data.gene[i].locus.start_pos
          );
          data.gene[i].locus.end_pos = addCommas(data.gene[i].locus.end_pos);
        }
      }
    }

    /**
 *  The map() method calls the provided function once for each element in a glycosylation array, in order.
 *  and sorting with respect to position 
 */
    if (data.glycosylation) {
      var glycosylationPositions = data.glycosylation.map(function(
        glycosylation
      ) {
        return {
          position: glycosylation.position,
          type: glycosylation.type.split("-")[0],
          label: glycosylation.residue,
          glycan_image:glycosylation.glytoucan_ac,
          position: glycosylation.position,
          evidence: glycosylation.evidence,
          typeAnnotate: glycosylation.type.split("-")[0] + "-" + "Glycosylation"
        };
      });

      glycosylationPositions.sort(function(a, b) {
        if (a.position < b.position) {
          return -1;
        } else if (b.position < a.position) {
          return 1;
        }
        return 0;
      });

      data.glycosylationPositions = glycosylationPositions;
    }

       /**
 *  The map() method calls the provided function once for each element in a data.site_annotation array, in order.
 *  and sorting with respect to start_pos
 */
    if (data.site_annotation) {
      var site_annotationstart_poss = data.site_annotation.map(function(
        site_annotation
      ) {
        return {
          position: site_annotation.start_pos,
          type: site_annotation.annotation.split("-")[0].toUpperCase(),
          typeAnnotate:"Sequon"
        };
      });

      site_annotationstart_poss.sort(function(a, b) {
        if (a.start_pos < b.start_pos) {
          return -1;
        } else if (b.start_pos < a.start_pos) {
          return 1;
        }
        return 0;
      });

      data.site_annotationstart_poss = site_annotationstart_poss;
    }

           /**
 *  The map() method calls the provided function once for each element in a data.mutation array, in order.
 *  and sorting with respect to start_pos
 */
    if (data.mutation) {
      var mutationstart_poss = data.mutation.map(function(mutation) {
        return {
          position: mutation.start_pos,
          type: mutation.type.split(" ")[1][0].toUpperCase(),
          label: "Mutation",
          evidence: mutation.evidence,
          labelForlist:mutation.evidence.sequence_org,
          typeAnnotate: "Mutation"
        };
      });

      mutationstart_poss.sort(function(a, b) {
        if (a.start_pos < b.start_pos) {
          return -1;
        } else if (b.start_pos < a.start_pos) {
          return 1;
        }
        return 0;
      });
      data.mutationstart_poss = mutationstart_poss;
    }

                  /**
 *  The concat() method is used to join two or more arrays.
 * annotation has complete array of three combine array
 */ 

    annotations = [];

    if (glycosylationPositions) {
      annotations = annotations.concat(glycosylationPositions);
    }

    if (mutationstart_poss) {
      annotations = annotations.concat(mutationstart_poss);
    }
    
    if (site_annotationstart_poss) {
      annotations = annotations.concat(site_annotationstart_poss);
    }



   /** newannotations is iterating through annotation and removes duplicate positions 
    * 
 */
    var newannotations = [];

    $.each(annotations, function(key, value) {
      var exists = false;
      $.each(newannotations, function(k, val2) {
        if (value.position == val2.position) {
          exists = true;
        }
      });
      if (exists == false && value.position != "") {
        newannotations.push(value);
      }
      newannotations.sort(function(a, b) {
        if (a.position < b.position) {
          return -1;
        } else if (b.position < a.position) {
          return 1;
        }
        return 0;
      });
      data.annotations = newannotations;
    });
    var html = Mustache.to_html(template, data);
    var $container = $("#content");
    $container.html(html);

    // call to select position
    selectPostion(position);
    updateGlycosylationPosition();
  }

  $("#loading_image").fadeOut();
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
    method: "POST",
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
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}
var uniprot_canonical_ac;
var id;
var position;
$(document).ready(function() {
  uniprot_canonical_ac = getParameterByName("uniprot_canonical_ac");
  position = parseInt(getParameterByName("position"));
  id = uniprot_canonical_ac;
  document.title = uniprot_canonical_ac + " Detail - glygen"; //updates title with the protein ID
  LoadData(uniprot_canonical_ac);
  setupEvidenceList();
  updateBreadcrumbLinks();
});
function selectPostion(position) {
  var positionOption = getPositionList().find(function(option) {
    return parseInt(option.value.split("-")[0]) === position;
  });
  positionOption.selected = true;
}
/**
 * this function is useful for scrooling through sequence
 * and zooming selected character
 */
// to have scrolling zoom-sequence
function changeGlycosylationPosition() {
  //to select list of character in sequence
  var positionValue = document.querySelector("#positionlist").value.split("-");
  var offset = positionValue[0];
  var type = positionValue[2];
  var label = positionValue[1];
  //to select character in sequence on which zoom class has applied
  var zoom = document.querySelector(".zoom");
  var sequence = document.querySelector(".zoom-sequence");
  var currentElement = sequence.children[offset - 1];
  var centerSize = 54;
  var translateCenter = -22;

  Array.from(sequence.children).forEach(function(child) {
    // To reset character in original font size
    $(child).css({
      "font-size": "inherit",
      transform: "none"
    });
    child.className = "";
  });
  if (type == "N") {
    currentElement.className = "highlightN";
  } else if (type == "O") {
    currentElement.className = "highlightO";
  } else if (type == "M") {
    currentElement.className = "highlightMutate";
  }
  $(currentElement).css("font-size", centerSize + "px");
  $(currentElement).css("transform", "translateY(" + translateCenter + "px)");
  zoom.scrollLeft = (currentElement.offsetLeft - (zoom.offsetWidth - 100) / 2) - 50;
  
  //zoom.scrollLeft = currentElement.offsetLeft;
  
  document.getElementById("label").innerHTML = offset + "-" + label;
  var taperlength = 3;
  var taperDelta = 9;
  var translateDelta = 7;
  for (var i = 1; i <= taperlength; i++) {
    var $element = $(sequence.children[offset - 1 - i]);
    $element.css("font-size", centerSize - i * taperDelta + "px");
    $element.css(
      "transform",
      "translateY(" + (translateCenter + i * translateDelta) + "px)"
    );
  }
  for (var i = 1; i <= taperlength; i++) {
    var $element = $(sequence.children[offset - 1 + i]);
    $element.css("font-size", centerSize - i * taperDelta + "px");
    $element.css(
      "transform",
      "translateY(" + (translateCenter + i * translateDelta) + "px)"
    );
  }
}

// To update position
function updateGlycosylationPosition() {
  changeGlycosylationPosition();
  changeTableGlycosylationPosition();
  updateLable();
  updateUrlPos();
}

//  // To change Url position onchange
 function updateUrlPos(){
 var pos = currentPosition();
 history.pushState( {}, "Position " + pos,"site_view.html?uniprot_canonical_ac="+ getParameterByName("uniprot_canonical_ac") + "&listID="+ getParameterByName("listID") +"&position=" + pos
 );
}

// To update position in Page lable
function updateLable() {
  var pos = currentPosition();
  document.getElementById("cookie1").innerHTML = pos;
}

// To get current position for dropdown
function currentPosition() {
  return document.querySelector("#positionlist").value.split("-")[0];
}
// To get current position for dropdown
function getPositionList() {
  return Array.from(document.querySelector("#positionlist").options);
}

// To get next position for dropdown
function nextPosition() {
  var current = currentPosition();
  var nextPosition = $("#positionlist :selected").next();
  if (nextPosition) {
    nextPosition.prop('selected', true);
    updateGlycosylationPosition();
    setupEvidenceList();
  }
}

// To get current position for dropdown
function previousPosition() {
  var current = currentPosition();
  var prevPosition = $("#positionlist :selected").prev();
  if (prevPosition) {
    prevPosition.prop('selected', true);
    updateGlycosylationPosition();
    setupEvidenceList();
  }
}


function changeTableGlycosylationPosition() {
  var positionValue = currentPosition();
  var newTableData = annotations.filter(function(item) {
    return item.position === parseInt(positionValue);
  });
  formatEvidences(newTableData); 
  $("#table").bootstrapTable("destroy");
  $("#table").bootstrapTable({ data: newTableData });
  setupEvidenceList();
}


// For Image Column
function imageFormat(value, row, index, field) {
  var url = getWsUrl('glycan_image', row.glycan_image);
  return "<div class='img-wrapper'><img class='img-cartoon' src='" + url + "' alt='Cartoon' /></div>";
}



/**
 * this function gets the URL query values
 * and updates the respective links on the breadcrumb fields.
 */
function updateBreadcrumbLinks() {
  const proteinacc = getParameterByName("uniprot_canonical_ac") || "";
  const listID = getParameterByName("listID") || "";
  const globalSearchTerm = getParameterByName("gs") || "";
  var glycanPageType = "";
  if (window.location.pathname.indexOf("glycoprotein") >= 0)
    glycanPageType = "glycoprotein";
  else glycanPageType = "protein";
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
			listID +"#sequence"
			
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
			listID + "#glycosylation"
		);
  }
  if (proteinacc) {
		$("#li-breadcrumb-visualizer").attr(
			"href",
			"protvista_index.html?uniprot_canonical_ac=" +
			proteinacc +
			"&listID=" +
			listID 	
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
			listID 
			// "#sequence"
		);
	}

}

