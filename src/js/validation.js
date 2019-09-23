//@author: Rupali Mahadik
// @description: UO1 Version-1.1.
//6sep-18

/** 
* validation for simple category  field
*/
function validateSimpleCategory(input) {
    var validLength = (input.value.length <=13);
    if (validLength) {
        document.getElementById("simpleCategoryMsg").innerHTML = " ";
        return true;
    } else {
        document.getElementById("simpleCategoryMsg").innerHTML = "Entry is too long - max length is 13.";
        return false;
    }
}



/** 
* validation for each field
*/
function validatePathwayID(input) {
    var validLength = (input.value.length <=13);
    if (validLength) {
        document.getElementById("pathwayIDMsg").innerHTML = " ";
        return true;
    } else {
        document.getElementById("pathwayIDMsg").innerHTML = "Entry is too long - max length is 13.";
        return false;
    }
}



/** 
* validation for each field
*/
function validateProteinAcc(input) {
    var validLength = (input.value.length <=12);
    if (validLength) {
        document.getElementById("proteinAccMsg").innerHTML = " ";
        return true;
    } else {
        document.getElementById("proteinAccMsg").innerHTML = "Entry is too long - max length is 12.";
        return false;
    }
}

/** 
*validation for each field
*/
function validateProteinAcc1(input) {
    var validLength = (input.value.length <=12);
    if (validLength) {
        document.getElementById("proteinAccMsg1").innerHTML = " ";
        return true;
    } else {
        document.getElementById("proteinAccMsg1").innerHTML = "Entry is too long - max length is 12.";
        return false;
    }
}

/** 
* validation for each field
*/
function validateProteinAcc2(input) {
    var validLength = (input.value.length <= 12);
    if (validLength) {
        document.getElementById("proteinAccMsg2").innerHTML = " ";
        return true;
    } else {
        document.getElementById("proteinAccMsg2").innerHTML = "Entry is too long - max length is 12.";
        return false;
    }
}

/** 
* validation for each field
*/

function validateProteinName(input) {
    var validLength = (input.value.length <= 111);
    if (validLength) {
        document.getElementById("proteinNameMsg").innerHTML = " ";
        return true;
    } else {
        document.getElementById("proteinNameMsg").innerHTML = "Entry is too long - max length is 111.";
        return false;
    }
}

/** 
* validation for each field
*/
function validateEnzymeAcc(input) {
    var validLength = (input.value.length <= 12);
    if (validLength) {
        document.getElementById("enzymeAccMsg").innerHTML = " ";
        return true;
    } else {
        document.getElementById("enzymeAccMsg").innerHTML = "Entry is too long - max length is 12.";
        return false;
    }
}

/** 
* validation for each field
*/
function validateProteinID(input) {
    var validLength = (input.value.length <= 16);
    if (validLength) {
        document.getElementById("proteinIDMsg").innerHTML = " ";
        return true;
    } else {
        document.getElementById("proteinIDMsg").innerHTML = "Entry is too long - max length is 16.";
        return false;
    }
}

/** 
* validation for each field
*/
function validateDiseaseName(input) {
    var validLength = (input.value.length <= 108);
    if (validLength) {
        document.getElementById("diseaseNameMsg").innerHTML = " ";
        return true;
    } else {
        document.getElementById("diseaseNameMsg").innerHTML = "Entry is too long - max length is 108.";
        return false;
    }
}

/** 
* validation for each field
*/
function validatePathwayName(input) {
    var validLength = (input.value.length <=141);
    if (validLength) {
        document.getElementById("pathwayNameMsg").innerHTML = " ";
        return true;
    } else {
        document.getElementById("pathwayNameMsg").innerHTML = "Entry is too long - max length is 141.";
        return false;
    }
}

/** 
* validation for each field
*/
function validateRefAcc(input) {
    var validLength = (input.value.length <=14);
    if (validLength) {
        document.getElementById("refAccMsg").innerHTML = " ";
        return true;
    } else {
        document.getElementById("refAccMsg").innerHTML = "Entry is too long - max length is 14.";
        return false;
    }
}

/** 
* validation for each field
*/
function validateMotifName(input) {
    var validLength = (input.value.length <=47);
    if (validLength) {
        document.getElementById("motifNameMsg").innerHTML = " ";
        return true;
    } else {
        document.getElementById("motifNameMsg").innerHTML = "Entry is too long - max length is 47.";
        return false;
    }
}

/** 
* validation for each field
*/
function validateGlycanAcc(input) {
    var validLength = (input.value.length <= 8);
    if (validLength) {
        document.getElementById("glycanAccMsg").innerHTML = " ";
        return true;
    } else {
        document.getElementById("glycanAccMsg").innerHTML = "Entry is too long - max length is 8.";
        return false;
    }
}

/** 
* validation for each field
*/
function validateGlycanAcc1(input) {
    var validLength = (input.value.length <= 8);
    if (validLength) {
        document.getElementById("glycanAccMsg1").innerHTML = " ";
        return true;
    } else {
        document.getElementById("glycanAccMsg1").innerHTML = "Entry is too long - max length is 8.";
        return false;
    }
}

/** 
* validation for each field
*/
function validateGlycanAcc2(input) {
    var validLength = (input.value.length <= 8);
    if (validLength) {
        document.getElementById("glycanAccMsg2").innerHTML = " ";
        return true;
    } else {
        document.getElementById("glycanAccMsg2").innerHTML = "Entry is too long - max length is 8.";
        return false;
    }
}

/** 
* validation for each field
*/
function validateGeneName(input) {
    var validLength = (input.value.length <=25);
    if (validLength) {
        document.getElementById("geneNameMsg").innerHTML = " ";
        return true;
    } else {
        document.getElementById("geneNameMsg").innerHTML = "Entry is too long - max length is 47";
        return false;
    }
}

/** 
* validation for each field
*/
function aminoLetter(textareatxt) {
    var letters = /^[RKDEQNHSTYCWAILMFVPGX\n]+$/gi;
    var validLength = (textareatxt.value.length <= 3356);
    var validCharacters = textareatxt.value.match(letters);
    var validEntry = (validLength && validCharacters);
    document.getElementById("msg").innerHTML = "";
    document.getElementById("msg").innerHTML += (validCharacters ? '' : "Enter a valid amino seq.");
    document.getElementById("msg").innerHTML += (validLength ? '' : " Entry is too long - max length ");
    return validEntry;
}
