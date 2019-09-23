/** ---------------------------------
    The homepage.js
    @author: Tatiana Williamson
    @date-created: 09/24/2018
 ------------------------------------*/
$(document).ready(function () {
    $.ajax({
        dataType: "json",
        url: getWsUrl("home_init"),
        timeout: getTimeout("home_init"),
        success: displayHomeInitData,
        error: displayFailHomeInitData,
        complete: function () {
            $("#loadVersion").css("display", "none")
            $("#loadStatistics").css("display", "none")
        }
    });
});
$(document).ajaxStop(function () {
    $('#loadVersion #loadStatistics').fadeOut(1000);
});

/**
 * All Sucsess functions go here 
 * @param {string} jsonResponse 
 */
function displayHomeInitData(jsonResponse) {
    //VERSION: Displays component name, version number, and date
    var versionDisplay = document.getElementById('version-display');
    jsonResponse.version.forEach(function (component) {
        var componentName = component.component;
        var componentVersion = component.version;
        var componentDate = component.release_date;
        switch (componentName) {
            case "api":
                $("#apiVersion").text(componentVersion + " " + "(" + getDateMMDDYYYY(componentDate) + ")");
                break;
            case "data":
                $("#dataVersion").text(componentVersion + " " + "(" + getDateMMDDYYYY(componentDate) + ")");
                break;
            case "software":
                $("#softwareVersion").append("<a href='https://github.com/glygener/glygen-frontend/wiki/Release-notes' target='_blank'>" + componentVersion + "</a> (" + getDateMMDDYYYY(componentDate) + ")");
                break;
        }
    })

    //STATISTICS: Displays statistics table - name and number
    var statisticsDisplay = document.getElementById('statistics-display');

    jsonResponse.statistics.forEach(function (statistic) {
        var header = document.createElement('h5');

        header.className = 'text-left';
        header.innerHTML = statistic.species;

        statisticsDisplay.appendChild(header);

        var table = document.createElement('table');
        var tbody = document.createElement('tbody');
        tbody.className = 'statistics-table';

        var row1 = document.createElement('tr');
        var row2 = document.createElement('tr');
        var row3 = document.createElement('tr');

        var row1cell1 = document.createElement('td');
        var row1cell2 = document.createElement('td');

        row1cell1.innerHTML = 'Glycans';
        row1cell2.innerHTML = statistic.glycans;
        row1.appendChild(row1cell1);
        row1.appendChild(row1cell2);

        var row2cell1 = document.createElement('td');
        var row2cell2 = document.createElement('td');
        row2cell1.innerHTML = 'Proteins';
        row2cell2.innerHTML = statistic.proteins;
        row2.appendChild(row2cell1);
        row2.appendChild(row2cell2);

        var row3cell1 = document.createElement('td');
        var row3cell2 = document.createElement('td');
        row3cell1.innerHTML = 'Glycoproteins';
        row3cell2.innerHTML = statistic.glycoproteins;
        row3.appendChild(row3cell1);
        row3.appendChild(row3cell2);

        tbody.appendChild(row1);
        tbody.appendChild(row2);
        tbody.appendChild(row3);
        table.appendChild(tbody);
        statisticsDisplay.appendChild(table);
    }
    )
};

// ajaxFailure is the callback function when ajax to GWU service fails
function displayFailHomeInitData(jqXHR, textStatus, errorThrown) {
    showJsError = true;
    // getting the appropriate error message from this function in utility.js file
    var err = decideAjaxError(jqXHR.status, textStatus);
    var errorMessage = JSON.parse(jqXHR.responseText).error_list[0].error_code || errorThrown;
    //log error on server 
    activityTracker("error", null, err + ": " + errorMessage + ": home_init WS error");
    $("#version-display").text("Data is not available.").addClass("errorMessageHomepage");
    $("#statistics-display").text("Data is not available.").addClass("errorMessageHomepage");
    showJsError = false;
}
