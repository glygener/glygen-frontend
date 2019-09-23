/* @author:Rupali Mahadik.
 @description: UO1 Version-1.1. 
 @date:17 June 2019.
 @updated:27 June 2019.
 */

var uniprot_canonical_ac = "";

// to set data in datapoint variable
function setupProtvista(data) {
	var allTrackData = {};
	var displayStart = 1;
	var displayEnd = data.sequence.length;
	var highlightStart = 10;

	var glycos = [{
			type: "N-Linked-With-Image",
			residues: [],
			color: "red",
			shape: "circle"
		},
		{
			type: "N-Linked-No-Image",
			residues: [],
			color: "red",
			shape: "triangle"
		},
		{
			type: "O-Linked-With-Image",
			residues: [],
			color: "blue",
			shape: "circle"
		},
		{
			type: "O-Linked-No-Image",
			residues: [],
			color: "blue",
			shape: "triangle"
		},
		{
			type: "Annotations",
			residues: [],
			color: "orange",
			shape: "square"
		}
	];

	var mutations = [{
		type: "Mutations",
		residues: [],
		color: "green",
		shape: "diamond"
	}
];

	$.each(data.glycosylation, function (i, glyco) {
		if (glyco.type === "N-linked") {
			if (glyco.glytoucan_ac) {
				glycos[0].residues.push({
					start: glyco.position,
					end: glyco.position,
					color: glycos[0].color,
					shape: glycos[0].shape,
					accession: data.uniprot.uniprot_canonical_ac,
					type: glyco.residue,
					tooltipContent: "<img src='https://api.glygen.org/glycan/image/" + glyco.glytoucan_ac + "' /><br/></br>",

				});
			} else {
				glycos[1].residues.push({
					start: glyco.position,
					end: glyco.position,
					color: glycos[1].color,
					shape: glycos[1].shape,
					accession: data.uniprot.uniprot_canonical_ac,
					type: glyco.residue,
					tooltipContent: "<span>Glycosylation site without reported glycan at " + glyco.position + " </span>",
				});
			}
		} else if (glyco.type === "O-linked") {
			if (glyco.glytoucan_ac) {
				glycos[2].residues.push({
					start: glyco.position,
					end: glyco.position,
					color: glycos[2].color,
					shape: glycos[2].shape,
					accession: data.uniprot.uniprot_canonical_ac,
					type: glyco.residue,
					tooltipContent: "<img src='https://api.glygen.org/glycan/image/" + glyco.glytoucan_ac + "' /><br/><br/><span class=marker>Click marker show more</span>",

				});
			} else {
				glycos[3].residues.push({
					start: glyco.position,
					end: glyco.position,
					color: glycos[3].color,
					shape: glycos[3].shape,
					accession: data.uniprot.uniprot_canonical_ac,
					type: glyco.residue,
					tooltipContent: "<span>Glycosylation site without reported glycan at " + glyco.position + " </span>",

				});
			}
		}
	});

	$.each(data.mutation, function (i, mutation) {
		mutations[0].residues.push({
			start: mutation.start_pos,
			end: mutation.end_pos,
			color: mutations[0].color,
			shape: mutations[0].shape,
			accession: data.uniprot.uniprot_canonical_ac,
			type: "(" + mutation.sequence_org + " → " + mutation.sequence_mut + ")",
			tooltipContent: "<span> annotation " + mutation.annotation + "</span>"

		});
	});

	$.each(data.site_annotation, function (i, site_annotation) {
		glycos[4].residues.push({
			start: site_annotation.start_pos,
			end: site_annotation.end_pos,
			color: glycos[4].color,
			shape: glycos[4].shape,
			accession: data.uniprot.uniprot_canonical_ac,
		    type: "N-Glycan-Sequon",
			tooltipContent: "<span>" + site_annotation.annotation + "</span>"

		});
	});

	var navHTML =
		"<protvista-navigation length='" +
		data.uniprot.length +
		"' displaystart='" +
		displayStart +
		"' displayend='" +
		displayEnd +
		"' ></protvista-navigation>";
	$(navHTML).appendTo("#manager");

	var seqHTML =
		"<protvista-sequence id='seq1' class='nav-track 'length='" +
		data.uniprot.length +
		"' displaystart='" +
		displayStart +
		"' displayend='" +
		displayEnd +
		"' sequence='" +
		data.sequence.sequence +
		"'></protvista-sequence>";
	$(seqHTML).appendTo("#manager");

	var glycoHTML =
		"<protvista-track id='glycotrack' class='nav-track glycotrack  ' length='" +
		data.uniprot.length +
		"' displaystart='" +
		displayStart +
		"' displayend='" +
		displayEnd +
		"' highlightStart='" +
		highlightStart +
		"' layout='non-overlapping'></protvista-track>";

	// tO CHECK MULTILE GLYCOSYLATION AT SAME POINT
	glycosCombined = [];
	$.each(glycos, function (i, v) {
		var combinedResiduesMap = {};
		$.each(glycos[i].residues, function (i, v) {
			if (!combinedResiduesMap[v.start + ":" + v.end]) {
				v['count'] = 1;
				combinedResiduesMap[v.start + ":" + v.end] = v;
			} else {
				combinedResiduesMap[v.start + ":" + v.end].count += 1;
			}
		});
		glycosCombined.push(
			$.map(combinedResiduesMap, function (v, i) {
				v['tooltipContent'] += v['count'] > 1 ? "<span class=marker>Click marker to show " + (v['count'] - 1) + " more at this site</span>" : "";
				return v;
			})
		);
	});

	var alltrack = [];
	$.merge(alltrack, glycosCombined[0]);
	$.merge(alltrack, glycosCombined[1]);
	$.merge(alltrack, glycosCombined[2]);
	$.merge(alltrack, glycosCombined[3]);
	$.merge(alltrack, glycosCombined[4]);
	$(glycoHTML).appendTo("#manager");
	document.querySelector("#glycotrack").data = alltrack;

	var glycoHTML1 =
		"<protvista-track id='glycotrack1' class='nav-track glycotrack1 hidden ' length='" +
		data.uniprot.length +
		"' displaystart='" +
		displayStart +
		"' displayend='" +
		displayEnd +
		"' highlightStart='" +
		highlightStart +
		"' layout='non-overlapping'></protvista-track>";
	$(glycoHTML1).appendTo("#manager");

	var nitrachtml =
		"<protvista-track class='nav-track hidden hover-style' id='Ntrack_withImage' length='" +
		data.uniprot.length +
		"' displaystart='" +
		displayStart +
		"' displayend='" +
		displayEnd +
		"' highlightStart='" +
		highlightStart +
		"'></protvista-track>";
	$(nitrachtml).appendTo("#manager");

	document.querySelector("#Ntrack_withImage").data = glycosCombined[0];
	var nwitrachtml =
		"<protvista-track class='nav-track hidden hover-style' id='Ntrack_withnoImage' length='" +
		data.uniprot.length +
		"' displaystart='" +
		displayStart +
		"' displayend='" +
		displayEnd +
		"' highlightStart='" +
		highlightStart +
		"' layout='non-overlapping' ></protvista-track>";
	$(nwitrachtml).appendTo("#manager");
	document.querySelector("#Ntrack_withnoImage").data = glycosCombined[1];

	var oitrachtml =
		"<protvista-track class='nav-track hidden hover-style' id='Otrack_withImage' length='" +
		data.uniprot.length +
		"' displaystart='" +
		displayStart +
		"' displayend='" +
		displayEnd +
		"' highlightStart='" +
		highlightStart +
		"' layout='non-overlapping' ></protvista-track>";
	$(oitrachtml).appendTo("#manager");
	document.querySelector("#Otrack_withImage").data = glycosCombined[2];

	var owitrachtml =
		"<protvista-track class='nav-track hidden hover-style' id='Otrack_withnoImage' length='" +
		data.uniprot.length +
		"' displaystart='" +
		displayStart +
		"' displayend='" +
		displayEnd +
		"' highlightStart='" +
		highlightStart +
		"' layout='non-overlapping' ></protvista-track>";
	$(owitrachtml).appendTo("#manager");
	document.querySelector("#Otrack_withnoImage").data = glycosCombined[3];
	
	var annotationhtml =
		"<protvista-track class='nav-track hover-style hidden' id='track_sequon' length='" +
		data.uniprot.length +
		"' displaystart='" +
		displayStart +
		"' displayend='" +
		displayEnd +
		"' highlightStart='" +
		highlightStart +
		"' layout='non-overlapping' ></protvista-track>";
	$(annotationhtml).appendTo("#manager");
	document.querySelector("#track_sequon").data = glycosCombined[4];

	var mutrachtml =
		"<protvista-track class='nav-track hover-style' id='track_muarray' length='" +
		data.uniprot.length +
		"' displaystart='" +
		displayStart +
		"' displayend='" +
		displayEnd +
		"' highlightStart='" +
		highlightStart +
		"' layout='non-overlapping' ></protvista-track>";
	$(mutrachtml).appendTo("#manager");
	document.querySelector("#track_muarray").data = mutations[0].residues;



	var features = $("g .feature-group");
	features.css("cursor", "pointer");
	features.on("click", function () {
		var start = $("#glycotrack").attr("highlightstart");
		window.location.href = "./site_view.html?uniprot_canonical_ac=" + uniprot_canonical_ac + "&position=" + start;

	});
}

$('#arrowanimation').click(function(){
    $(this).toggleClass('arrowanimation-down');
});
/**
 * Handling a succesful call to the server for details page
 * @param {Object} data - the data set returned from the server on success
 */
function ajaxSuccess(data) {
	if (data.error_code) {
		activityTracker("error", uniprot_canonical_ac, data.error_code);
		// activity tracker.
		alertify.alert("Error occured", data.error_code);
	} else {
		activityTracker("user", uniprot_canonical_ac, "successful response");
		setupProtvista(data);
		// to change the svg position
		document.querySelectorAll("g.sequence-features").forEach(x => {
			x.setAttribute("transform", "translate(0, -7)");
		});
	}
}

// hide and show n-glycan and o-glycan separate track or combined track
function navglycoclick() {
	if ($("#reported_Nglycan").hasClass("hidden")) {
		$("#reported_Nglycan").removeClass("hidden");
		$("#nonreported_Nglycan").removeClass("hidden");
		$("#reported_Oglycan").removeClass("hidden");
		$("#nonreported_Oglycan").removeClass("hidden");
		$("#Ntrack_withImage").removeClass("hidden");
		$("#Ntrack_withnoImage").removeClass("hidden");
		$("#Otrack_withImage").removeClass("hidden");
		$("#Otrack_withnoImage").removeClass("hidden");
		$("#glycotrack1").removeClass("hidden");
		$("#track_sequon").removeClass("hidden");
		$("#reported_sequon").removeClass("hidden");
		$("#glycotrack").addClass("hidden");
	} else {
		$("#reported_Nglycan").addClass("hidden");
		$("#nonreported_Nglycan").addClass("hidden");
		$("#reported_Oglycan").addClass("hidden");
		$("#nonreported_Oglycan").addClass("hidden");
		$("#Ntrack_withImage").addClass("hidden");
		$("#Ntrack_withnoImage").addClass("hidden");
		$("#Otrack_withImage").addClass("hidden");
		$("#Otrack_withnoImage").addClass("hidden");
		$("#glycotrack1").addClass("hidden");
		$("#track_sequon").addClass("hidden");
		$("#reported_sequon").addClass("hidden");
		$("#glycotrack").removeClass("hidden");
		
	}
}

$(document).ready(function () {
	uniprot_canonical_ac = getParameterByName("uniprot_canonical_ac");
	$(".title_protein").html(uniprot_canonical_ac);
	LoadData(uniprot_canonical_ac);
	updateBreadcrumbLinks();

	var supported = false;
	// var is_chrome = navigator.userAgent.toLowerCase().indexOf('MSIE') > -1;
	var ua = navigator.userAgent;
	if(ua.indexOf('Edge') > -1) {
		var EdgeVersion = parseInt(ua.substr(ua.indexOf('Edge') + 5, 2));
		if(EdgeVersion >= 17)	{
			supported = true;
		}
	} 
	if(ua.indexOf('Chrome') > -1) {
		var chromeVersion = parseInt(ua.substr(ua.indexOf('Chrome') + 7, 2));
		if(chromeVersion >= 75)	{
			supported = true;
		}
	} 
	else if(ua.indexOf('Firefox') > -1) {
		var ffVersion = parseInt(ua.substr(ua.indexOf('Chrome') + 8, 2));
		if(ffVersion >= 65)	{
			supported = true;
		}
	} 
	else if(ua.indexOf('Safari') > -1) {
		var safariVersion = parseInt(ua.substr(ua.indexOf('Safari') - 7, 2));
		if(safariVersion >= 11)	{
			supported = true;
		}
	}
	if(!supported){  
		$("#Supportnote").text(" Supported browsers are Chrome 75 and above, Firefox 67 and above, Edge 44 (Windows only),Safari 11 and above ");
	  }
});

//set up breadcrumb for navigation

function updateBreadcrumbLinks() {
	const proteinacc = getParameterByName("uniprot_canonical_ac") || "";
	const listID = getParameterByName("listID") || "";
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
			"#sequence"
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
			"#sequence"
		);
	}
	//else {
	//   $("#li-breadcrumb-detailbback").css("display", "none");
	// }
}

function LoadData(uniprot_canonical_ac) {
	var ajaxConfig = {
		dataType: "json",
		url: getWsUrl("protein_detail", uniprot_canonical_ac),
		method: "GET",
		timeout: 1000,
		success: ajaxSuccess
	};

	// calls the service
	$.ajax(ajaxConfig);
}


$(".hover").hover(
	function hoverIn() {
		var id = $(this).attr("data-highlight");
		$("#" + id).css("background-color", "rgba(255,255,0,0.3)");
	},
	function hoverOut() {
		$(".hover-style").css("background-color", "inherit");
	}
);

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
	if (!results[2]) return "";
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}




