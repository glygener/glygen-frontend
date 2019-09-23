/**
 * Object to hold highlight data in state
 */
var highlight = {};
var SEQUENCE_ROW_RUN_LENGTH = 10;
var SEQUENCE_SPACES_BETWEEN_RUNS = 1;

/**
 * get glycosylation data
 * @param {array} glycosylationData
 * @param {string} type
 * @return an array of highlight info.
 */
function getGlycosylationHighlightData(glycosylationData, type) {
    var result = [];
    var positions = {};
    for (var x = 0; x < glycosylationData.length; x++) {
        if (!positions[glycosylationData[x].position] && (glycosylationData[x].type === type)) {
            positions[glycosylationData[x].position] = true;
            result.push({
                start: glycosylationData[x].position,
                length: 1
            });
        }
    }
    return result;
}

/**
 * Getting mutation data
 * @param {array} mutationData
 * @return an array of highlight info.
 */
function getMutationHighlightData(mutationData) {
    var result = [];
    var positions = {};
    for (var x = 0; x < mutationData.length; x++) {
        if (!positions[mutationData[x].start_pos]) {
            positions[mutationData[x].start_pos] = true;
            result.push({
                start: mutationData[x].start_pos,
                length: (mutationData[x].end_pos - mutationData[x].start_pos) + 1
            });
        }
    }
    return result;
}

/**
 * checking is highlighted or not
 * @param {number} position
 * @param {array} selection
 * @return:boolean if position in the ranges
 */
function isHighlighted(position, selection) {
    var result = false;
    if (selection) {
        for (var x = 0; x < selection.length; x++) {
            var start = selection[x].start;
            var end = selection[x].start + selection[x].length - 1;

            if ((start <= position) && (position <= end)) {
                result = true;
                break;
            }
        }
        return result;
    }
    return false;
}

/**
 * building highlight
 * @param {string} sequence
 * @param {object} highlightData:
 * @returns an array of each charcter of the sequence and is highlighted by its each type
 */
function buildHighlightData(sequence, highlightData) {
    var result = [];
    if (sequence) {
        for (var x = 0; x < sequence.length; x++) {
            var position = x + 1;
            result.push({
                character: sequence[x],
                n_link_glycosylation: isHighlighted(position, highlightData.n_link_glycosylation),
                o_link_glycosylation: isHighlighted(position, highlightData.o_link_glycosylation),
                mutation: isHighlighted(position, highlightData.mutation)
            });
        }
        return result;
    }
    return [];
}

/**
 * building row
 * @param {array} rowData
 * @returns string of sequence
 */
function buildRowText(rowData) {
    var text = [];

    for (var x = 0; x < rowData.length; x++) {
        text.push(rowData[x].character);
    }
    return text.join('');
}

/**
 * building rowhighlight
 * @param {array} rowData
 * @param {string}type
 * @returns string of sequence
 */
function buildRowHighlight(rowData, type) {
    var highlight = [];
    for (var x = 0; x < rowData.length; x++) {
        if (rowData[x][type]) {
            highlight.push('<span class="highlight-highlight-area">&nbsp;</span>');
        } else {
            highlight.push('&nbsp;');
        }
    }
    return highlight.join('');
}

/**
 * creating row
 * @param {number} start
 * @param {array} rowData
 * @returns jquery object of the row
 */
function createHighlightRow(start, rowData) {
    var $row = $('<div class="highlight-row"></div>');
    $('<span class="highlight-line-number"></span>')
        .text(("     " + (start + 1)).slice(-5) + ' ')
        .appendTo($row);

    var $section = $('<span class="highlight-section"></span>');
    $('<span class="highlight-text"></span>')
        .html(buildRowText(rowData))
        .appendTo($section);

    $('<span class="highlight-highlight"></span>')
        .attr('data-type', 'mutation')
        .html(buildRowHighlight(rowData, 'mutation'))
        .hide()
        .appendTo($section);

    $('<span class="highlight-highlight"></span>')
        .attr('data-type', 'n_link_glycosylation')
        .html(buildRowHighlight(rowData, 'n_link_glycosylation'))
        .hide()
        .appendTo($section);

    $('<span class="highlight-highlight"></span>')
        .attr('data-type', 'o_link_glycosylation')
        .html(buildRowHighlight(rowData, 'o_link_glycosylation'))
        .hide()
        .appendTo($section);
    $section.appendTo($row);
    return $row;
}

/**
 * creating UI perline
 * @param {object} highlightData
 * @param {number} perLine
 */
function createHighlightUi(highlightData, perLine) {
    var $ui = $('<div class="highlight-display"></div>');
    var seqTopIndex = "<pre style='border:0px; padding:0px; margin-bottom:0px; font-family:monospace; font-size: 14px;'>                +10        +20        +30        +40        +50</pre>";
    var seqTopIndexLines = "<pre style='border:0px; padding:0px; margin-bottom:0px; font-family:monospace; font-size: 14px;'>                 |          |          |          |          |</pre>";
    $ui.append(seqTopIndex);
    $ui.append(seqTopIndexLines);
    for (var x = 0; x < highlightData.length; x += perLine) {
        var rowDataTemp = adjustSequenceRuns(highlightData.slice(x, x + perLine));
        var rowData = [];
        for (var i = 0; i < rowDataTemp.length; i++) {
            for (var s = 0; s < SEQUENCE_SPACES_BETWEEN_RUNS; s++) {
                rowDataTemp[i].push({
                    character: '&nbsp;',
                    n_link_glycosylation: false,
                    o_link_glycosylation: false,
                    mutation: false
                });
            }
            $.merge(rowData, rowDataTemp[i]);
        }

        var $row = createHighlightRow(x, rowData);
        $ui.append($row);
    }
    $('#sequnce_highlight').append($ui);
}

var uniprot_canonical_ac;

/**
 * Sequence formatting Function
 * @param {string} sequenceString 
 * @return {string} 
 */
function formatSequence(sequenceString) {
    var perLine = 60;
    var output = '';
    var seqTopIndex = "<pre style='border:0px; padding:0px; margin-bottom:0px; font-family:monospace; font-size: 14px;'>                +10        +20        +30        +40        +50</pre>";
    var seqTopIndexLines = "<pre style='border:0px; padding:0px; margin-bottom:0px; font-family:monospace;font-size: 14px;'>                 |          |          |          |          |</pre>";
    output += seqTopIndex;
    output += seqTopIndexLines;

    for (var x = 0; x < sequenceString.length; x += perLine) {
        //fix for IE 11 and lower where String.prototype.repeat() is not available
        var nSpacesBetweenRuns = '';
        for (var i = 0; i < SEQUENCE_SPACES_BETWEEN_RUNS; i++) {
            nSpacesBetweenRuns += ' ';
        }
        var y = adjustSequenceRuns(sequenceString.substr(x, perLine)).join(nSpacesBetweenRuns);
        // var y = adjustSequenceRuns(sequenceString.substr(x, perLine)).join(' '.repeat(SEQUENCE_SPACES_BETWEEN_RUNS));
        output += '<span class="non-selection">' + ("     " + (x + 1)).slice(-5) + ' </span>' + y + '\n'
    }
    return output;
}

/**
 * Adjusts a sequence array by splitting it into multiple arrays of max length defined by the constant SEQUENCE_ROW_RUN_LENGTH
 * @author Sanath Bhat
 * @since Nov 15, 2018.
 */
function adjustSequenceRuns(sequence) {
    var y_arr = [];
    for (var i = 0; i < sequence.length; i += SEQUENCE_ROW_RUN_LENGTH) {
        y_arr.push(sequence.slice(i, i + SEQUENCE_ROW_RUN_LENGTH));
    }
    return y_arr;
}


/**
 * to check checkbox selected not selected
 * @param {string} type
 */
function checkUncheck(type, element) {
    var $elements = $('.highlight-highlight[data-type="' + type + '"]');

    if (element.checked) {
        $elements.show();
    } else {
        $elements.hide();
    }
}