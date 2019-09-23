// @author:Rupali Mahadik.
// @description: UO1 Version-1.1.

// Formmating Evidence data in required format.

function formatEvidences(item) {
    if (item && item.length) {
        for (var i = 0; i < item.length; i++) {
            var currentItem = item[i];
            var databases = [];
            if (currentItem && currentItem.evidence && currentItem.evidence.length) {
                for (var j = 0; j < currentItem.evidence.length; j++) {
                    var evidenceitem = currentItem.evidence[j];
                    var found = '';
                    for (var x = 0; x < databases.length; x++) {
                        var databaseitem = databases[x];
                        if (databaseitem.database === evidenceitem.database) {
                            found = true;
                            databaseitem.links.push({
                                url: evidenceitem.url,
                                id: evidenceitem.id
                            });
                        }
                    }

                    if (!found) {
                        databases.push({
                            database: evidenceitem.database,
                            color: databasecolor(evidenceitem.database),
                            links: [{
                                url: evidenceitem.url,
                                id: evidenceitem.id
                            }]
                        })
                    }
                }
            }
            currentItem.databases = databases;
        }
    }
}

// Creating Badge for each database with diffrent color with respective link.
function EvidencebadgeFormator(value, row, index, field) {
    var buttonsHtml = "";
    $.each(value, function (i, v) {
        var linksHtml = "";
        $.each(v.links, function (i, w) {
            linksHtml += '<li class="linkHtml5">' +
                '<a href="' + w.url + '" target="_blank">' + w.id + '</a></li>'
        });

        buttonsHtml += '<span class="evidence_badge">' +
            '<button class="btn btn-primary color-' + v.database + ' evidence-badge-btn" type="button" style="background-color: ' + v.color + '; border-color: ' + v.color + '">' + v.database +
            '&nbsp;&nbsp;&nbsp;&nbsp;<span class="badge">' + v.links.length + '</span>' +
            '</button>' +
            '<div class="hidden evidence_links">' +
            '<ul>' + linksHtml + '</ul>' +
            '</div>' +
            '</span>';
    });
    return buttonsHtml;
}

// setting evidnec list for each badge
function setupEvidenceList() {
    // var $evidenceBadges = $('.evidence_badge');
    // $evidenceBadges.each(function () {
        $('#content').on('click', '.evidence-badge-btn', show_evidence);
    // });
}

// show and hide evidences 
function show_evidence() {
    var $evidenceList = $(this).next();
    var isHidden = $evidenceList.hasClass('hidden');
    // $(".evidence_links").addClass("hidden");

    if (isHidden) {
        $evidenceList.removeClass("hidden");
    } else {
        $evidenceList.addClass("hidden");
    }

}

function groupEvidences(item) {
    //group by evidence ids
    if (item && item.length) {
        var evidencesMap = new Map();
        for (var i = 0; i < item.length; i++) {
            var currentItem = item[i];
            for (var e = 0; e < currentItem.evidence.length; e++) {
                if (!(evidencesMap.has(currentItem.evidence[e].id))) {
                    evidencesMap.set(currentItem.evidence[e].id, [currentItem]);
                }
                else {
                    evidencesMap.get(currentItem.evidence[e].id).push(currentItem);
                }
            }
        }
        //combine annotations for each evidence id
        groupedEvidences = [];
        evidencesMap.forEach(function (v, key) {
            //combine annotations into the first, delete the rest
            for (var i = 1; i < v.length; i++) {
                v[0].annotation += "\n\n" + v[i].annotation;
            }
            groupedEvidences.push(v[0]);
        });

        return groupedEvidences;
    }
    return item;
}