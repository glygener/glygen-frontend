import React from "react";
import { NavLink } from "react-router-dom";
import { Navbar } from "react-bootstrap";
import { getJson, postToAndGetBlob } from "./api";
import routeConstants from "./json/routeConstants";
import stringConstants from "./json/stringConstants";
import LineTooltip from "../components/tooltip/LineTooltip";
import { groupEvidences } from "../data/data-format";
import EvidenceList from "../components/EvidenceList";
import { logActivity } from "../data/logging";

const proteinStrings = stringConstants.protein.common;
const glycanStrings = stringConstants.glycan.common;

/**
 * Add commas to string.
 * @param {string} nStr - string value.
 */
function addCommas(nStr) {
  nStr += "";
  var x = nStr.split(".");
  var x1 = x[0];
  var x2 = x.length > 1 ? "." + x[1] : "";
  var rgx = /(\d+)(\d{3})/;

  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, "$1" + "," + "$2");
  }
  return x1 + x2;
}

/**
 * Gets JSON for glycan to biosynthesis enzymes usecase.
 * @param {string} organism - organism value.
 * @param {string} glycanId - glycan id value.
 */
export const getGlycanToBiosynthesisEnzymes = (organism, glycanId) => {
  const url = "/usecases/glycan_to_biosynthesis_enzymes/" + organism + "/" + glycanId;
  return getJson(url);
};

/**
 * Gets JSON for glycan to glycoproteins usecase.
 * @param {string} organism - organism value.
 * @param {string} glycanId - glycan id value.
 */
export const getGlycanToGlycoproteins = (organism, glycanId) => {
  const url = "/usecases/glycan_to_glycoproteins/" + organism + "/" + glycanId;
  return getJson(url);
};

/**
 * Gets JSON for glycan to enzyme gene loci usecase.
 * @param {string} organism - organism value.
 * @param {string} glycanId - glycan id value.
 */
export const getGlycanToEnzymeGeneLoci = (organism, glycanId) => {
  const url = "/usecases/glycan_to_enzyme_gene_loci/" + organism + "/" + glycanId;
  return getJson(url);
};

/**
 * Locus list page columns defination.
 */
export const LOCUS_COLUMNS = [
  {
    dataField: proteinStrings.shortName,
    text: proteinStrings.uniprot_accession.name,
    sort: true,
    selected: true,
    headerStyle: (colum, colIndex) => {
      return { backgroundColor: "#4B85B6", color: "white" };
    },

    formatter: (value, row) => (
      <LineTooltip text="View details">
        <Navbar.Text as={NavLink} to={routeConstants.proteinDetail + row.uniprot_canonical_ac}>
          {row.uniprot_canonical_ac}
        </Navbar.Text>
      </LineTooltip>
    ),
  },
  {
    dataField: proteinStrings.gene_name.id,
    text: proteinStrings.gene_name.name,
    sort: true,
    headerStyle: (colum, colIndex) => {
      return { backgroundColor: "#4B85B6", color: "white" };
    },
  },
  {
    dataField: proteinStrings.chromosome.id,
    text: proteinStrings.gene_location.name,
    sort: true,
    headerStyle: (colum, colIndex) => {
      return { backgroundColor: "#4B85B6", color: "white" };
    },

    formatter: (value, row) => (
      <>
        {row.chromosome ? (
          <>
            Chr {row.chromosome}: {addCommas(row.start_pos)} - {addCommas(row.end_pos)}
          </>
        ) : (
          "N/A"
        )}
      </>
    ),
  },
  {
    dataField: proteinStrings.protein_name.id,
    text: proteinStrings.protein_name.name,
    sort: true,
    headerStyle: (colum, colIndex) => {
      return { backgroundColor: "#4B85B6", color: "white" };
    },
  },
  {
    dataField: proteinStrings.organism.id,
    text: proteinStrings.organism.name,
    sort: true,
    headerStyle: (colum, colIndex) => {
      return { backgroundColor: "#4B85B6", color: "white" };
    },
  },
  {
    dataField: proteinStrings.tax_id.id,
    text: proteinStrings.tax_id.name,
    sort: true,
    headerStyle: (colum, colIndex) => {
      return { backgroundColor: "#4B85B6", color: "white" };
    },
  },
];

/**
 * Gets JSON for gene locus list.
 * @param {string} locusListId - list id.
 * @param {number} offset - offset value.
 * @param {number} limit - limit value.
 * @param {string} sort - sort field.
 * @param {string} order - order value - asc/desc.
 */
export const getGeneLocusList = (
  locusListId,
  offset = 1,
  limit = 20,
  sort = "uniprot_canonical_ac",
  order = "asc"
) => {
  const queryParams = {
    id: locusListId,
    offset: offset,
    sort: sort,
    limit: limit,
    order: order,
  };
  const queryParamString = JSON.stringify(queryParams);
  const url = `/usecases/genelocus_list?query=${queryParamString}`;
  return getJson(url);
};

/**
 * Downloads data for gene locus list.
 * @param {string} id - list id.
 * @param {string} format - download format.
 * @param {boolean} compressed - compressed - true, false.
 * @param {string} type - download type.
 * @param {object} headers - headers.
 */
export const getLocusListDownload = (id, format, compressed, type, headers) => {
  let message = "downloaded successfully ";
  logActivity("user", id, format, compressed, "No results. " + message);
  const query = { id, "download_type": type, format, compressed };
  const url = `/data/list_download?query=${JSON.stringify(query)}`;
  return postToAndGetBlob(url, headers);
};

/**
 * Gets JSON for disease to glycosyltransferases usecase.
 * @param {object} formObject - formObject value.
 */
export const getDiseaseToGlycosyltransferases = (formObject) => {
  var json = "query=" + JSON.stringify(formObject);
  const url = "/usecases/disease_to_glycosyltransferases?" + json;
  return getJson(url);
};

/**
 * Orthologs list page columns defination.
 */
export const ORTHOLOGS_COLUMNS = [
  {
    dataField: proteinStrings.evidence.id,
    text: proteinStrings.evidence.name,
    sort: true,
    headerStyle: (colum, colIndex) => {
      return { backgroundColor: "#4B85B6", color: "white" };
    },

    formatter: (cell, row) => {
      return (
        <EvidenceList
          key={row.position + row.uniprot_canonical_ac}
          evidences={groupEvidences(cell)}
        />
      );
    },
  },
  {
    dataField: proteinStrings.uniprot_canonical_ac.id,
    text: proteinStrings.uniprot_accession.name,
    sort: true,
    selected: true,
    headerStyle: (colum, colIndex) => {
      return { backgroundColor: "#4B85B6", color: "white" };
    },

    formatter: (value, row) => (
      <LineTooltip text="View details">
        <Navbar.Text as={NavLink} to={routeConstants.proteinDetail + row.uniprot_canonical_ac}>
          {row.uniprot_canonical_ac}
        </Navbar.Text>
      </LineTooltip>
    ),
  },
  {
    dataField: proteinStrings.protein_name.id,
    text: proteinStrings.protein_name.name,
    sort: true,
    headerStyle: (colum, colIndex) => {
      return { backgroundColor: "#4B85B6", color: "white" };
    },
  },
  {
    dataField: glycanStrings.common_name.id,
    text: proteinStrings.organism.name,
    sort: true,
    headerStyle: (colum, colIndex) => {
      return { backgroundColor: "#4B85B6", color: "white" };
    },
  },
  {
    dataField: proteinStrings.tax_id.id,
    text: proteinStrings.tax_id.name,
    sort: true,
    headerStyle: (colum, colIndex) => {
      return { backgroundColor: "#4B85B6", color: "white" };
    },
  },
];

/**
 * Gets JSON for protein to orthologs usecase.
 * @param {string} proteinId - protein id value.
 */
export const getProteinToOrthologs = (proteinId) => {
  const url = "/usecases/protein_to_orthologs/" + proteinId;
  return getJson(url);
};

/**
 * Gets JSON for species to glycosyltransferases usecase.
 * @param {string} organism - organism value.
 */
export const getOrganismToGlycosyltransferases = (organism) => {
  const url = "/usecases/species_to_glycosyltransferases/" + organism;
  return getJson(url);
};

/**
 * Gets JSON for species to glycohydrolases usecase.
 * @param {string} organism - organism value.
 */
export const getOrganismToGlycohydrolases = (organism) => {
  const url = "/usecases/species_to_glycohydrolases/" + organism;
  return getJson(url);
};

/**
 * Gets JSON for species to glycoproteins usecase.
 * @param {string} organism - organism value.
 * @param {string} evidenceType - evidence type value.
 */
export const getOrganismToGlycoproteins = (organism, evidenceType) => {
  const url = "/usecases/species_to_glycoproteins/" + organism + "/" + evidenceType;
  return getJson(url);
};

/**
 * Gets JSON for orthologs list.
 * @param {string} orthologsListId - list id.
 * @param {number} offset - offset value.
 * @param {number} limit - limit value.
 * @param {string} sort - sort field.
 * @param {string} order - order value - asc/desc.
 */
export const getOrthologsList = (
  orthologsListId,
  offset = 1,
  limit = 20,
  sort = "uniprot_canonical_ac",
  order = "asc"
) => {
  const queryParams = {
    id: orthologsListId,
    offset: offset,
    sort: sort,
    limit: limit,
    order: order,
  };
  const queryParamString = JSON.stringify(queryParams);
  const url = `/usecases/ortholog_list?query=${queryParamString}`;
  return getJson(url);
};

/**
 * Downloads data for ortholog list.
 * @param {string} id - list id.
 * @param {string} format - download format.
 * @param {boolean} compressed - compressed - true, false.
 * @param {string} type - download type.
 * @param {object} headers - headers.
 */
export const getOrthologListDownload = (id, format, compressed, type, headers) => {
  let message = "downloaded successfully ";
  logActivity("user", id, format, compressed, "No results. " + message);
  const query = { id, "download_type": type, format, compressed };
  const url = `/data/list_download?query=${JSON.stringify(query)}`;
  return postToAndGetBlob(url, headers);
};

/**
 * Gets JSON for biosynthesis enzyme to glycans usecase.
 * @param {string} organism - organism value.
 * @param {string} proteinId - protein id value.
 */
export const getBiosynthesisEnzymeToGlycans = (organism, proteinId) => {
  const url = "/usecases/biosynthesis_enzyme_to_glycans/" + organism + "/" + proteinId;
  return getJson(url);
};

/**
 * Gets JSON for glycan search init.
 */
export const getUsecaseInit = () => {
  const url = `/usecases/search_init`;
  return getJson(url);
};
