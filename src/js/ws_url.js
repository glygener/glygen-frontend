/**
 * This is a dictionary file containing the Web service string URLs mapped to Keys.
 * @author: Gaurav Agarwal
 */
//update: Rupali Mahadik:  //Glycan webservices, //Protein webservices
// @description: UO1 Version-1.1.
//@update:6 June 2018
//update:20 july://usecases search webservices
//update:31 july:// New base URL updated.

function getWsUrl(request, id, id1, glytoucan_ac) {
    var ws_home_init = ws_base + "pages/home_init";
    var ws_base_glycan = ws_base + "glycan";
    var ws_base_protein = ws_base + "protein";
    var ws_base_typeahead = ws_base + "typeahead";
    var ws_logging = ws_base + "log/logging";
    var ws_userID = ws_base + "auth/userid";
    var ws_contact = ws_base + "auth/contact";
    var ws_useCaseSearch = ws_base + "usecases";
    var ws_homeInit = ws_base + "pages/home_init";
    var ws_dataDownload = ws_base + "data/download";
    var ws_globalSearch = ws_base + "globalsearch/search";
    var ws_base_motif = ws_base + "motif";

    // var ws_base_loci=ws_base+"usecases";

    switch (request.toLowerCase()) {
        //Auth Webservices.
        case "generate_id":
            return ws_userID;
        case "log_activity":
            return ws_logging;
        case "contact":
            return ws_contact;
        //Homepage webservices
        case "home_init":
            return ws_homeInit;
        //Glycan webservices
        case "search_init_glycan":
            return ws_base_glycan + "/search_init";

        case "glycan_search":
            return ws_base_glycan + "/search";

        case "glycan_search_simple":
            return ws_base_glycan + "/search_simple";

        case "glycan_image":
            return ws_base_glycan + "/image/" + id;

        case "glycan_list":
            return ws_base_glycan + "/list";

        case "glycan_detail":
            return ws_base_glycan + "/detail/" + id;

        case "motif_detail":
            return ws_base_motif + "/detail";

        //Protein webservices
        case "search_init_protein":
            return ws_base_protein + "/search_init";

        case "search_protein":
            return ws_base_protein + "/search";

        case "protein_search_simple":
            return ws_base_protein + "/search_simple";

        case "protein_image_service":
            return ws_base_glycan + "/image/" + id;

        case "protein_list":
            return ws_base_protein + "/list";

        case "protein_detail":
            return ws_base_protein + "/detail/" + id;

        //Typeahead webservices

        case "type-ahead":
            return ws_base_typeahead;
        default:
            return "WWW.GOOGLE.COM";

        //Usecases search webservices
        //Usecases search webservices Q1-Q2-Q3
        case "search_bioenzyme":
            return ws_useCaseSearch + "/glycan_to_biosynthesis_enzymes/9606/" + id;

        case "search_glycansite":
            return ws_useCaseSearch + "/glycan_to_glycoproteins/0/" + id;

        case "search_glycangene":
            return ws_useCaseSearch + "/glycan_to_enzyme_gene_loci/9606/" + id;

        // usecases list API Q3 and 4
        case "list_glycangene":
            return ws_useCaseSearch + "/ortholog_list";

        case "loci_list":
            return ws_useCaseSearch + "/genelocus_list";

        //Usecases search webservices Q4-Q6
        case "search_proteinorthologues":
            return ws_useCaseSearch + "/protein_to_orthologs/" + id;

        case "search_glycanenzyme":
            return ws_useCaseSearch + "/biosynthesis_enzyme_to_glycans/10090/" + id;

        //Usecases search webservices Q7-Q8-Q9

        case "search_glycosyltransferases":
            return ws_useCaseSearch + "/species_to_glycosyltransferases/" + id;

        case "search_glycohydrolases":
            return ws_useCaseSearch + "/species_to_glycohydrolases/" + id;

        case "search_glycoproteins":
            return ws_useCaseSearch + "/species_to_glycoproteins/" + id + "/" + id1;

        //Usecases DISEASE webservices Q.10
        case "search_disease":
            return ws_useCaseSearch + "/disease_to_glycosyltransferases";

        case "data_download":
            return ws_dataDownload;

        case "global_search":
            return ws_globalSearch;
    }
}


/**
 * getListPostData  function that returns the string with the correct format the GWU service need to get the list for a specific Id
 * @param {string} id -  serach ID
 */

function getListPostData(id, page, sort, dir, limit) {
    var query = {};
    query.id = id;
    //query.offset = parseInt(page);
    query.sort = sort;
    query.offset = ((page - 1) * limit) + 1;
    query.limit = parseInt(limit);
    query.order = dir;

    return "query=" + JSON.stringify(query);
}

function getSearchtypeheadData(field, value) {
    var query = {};
    query.field = field;
    query.value = value;
    query.limit = 100;
    return "query=" + JSON.stringify(query);
}

function getListPostMotifData(glytoucan_ac, page, sort, dir, limit) {
    var query = {};
    query.glytoucan_ac = glytoucan_ac;
    // query.offset = parseInt(page);
    query.sort = sort;
    query.offset = ((page - 1) * limit) + 1;
    query.limit = parseInt(limit);
    query.order = dir;

    return "query=" + JSON.stringify(query);
}