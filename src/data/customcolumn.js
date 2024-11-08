import { getJson, postToAndGetBlob, glycanImageUrl, glycanSvgUrl, glycanJsonUrl, postFormDataTo1 } from "./api";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import routeConstants from "./json/routeConstants";
import LineTooltip from "../components/tooltip/LineTooltip";
import HitScoreTooltip from "../components/tooltip/HitScoreTooltip";
import stringConstants from "./json/stringConstants";
import { logActivity } from "./logging";
import { Link } from "react-router-dom";
import axios from "axios";
import { Col } from "react-bootstrap";
import CollapsibleText from "../components/CollapsibleText";
import CollapsibleWrapText from "../components/CollapsibleWrapText";
import CollapsableLinkText from "../components/CollapsableLinkText"
import { getGlycanImageUrl } from "../data/glycan";

const proteinStrings = stringConstants.protein.common;
const glycanStrings = stringConstants.glycan.common;

export const getColumnList = (
  tableId
) => {
  const queryParams = {
    table_id: tableId
  };

  return postFormDataTo1(`/pages/list_init`, queryParams);
};

const glycanColumnsStorageKey = "glycan-columns";

export const getUserStoredColumns = (tableId) => {
  let selectedColumns = [];
  try {
    const parsedValue1 =  localStorage.getItem(glycanColumnsStorageKey);
    let parsedValue = JSON.parse(parsedValue1);
    if (parsedValue && parsedValue[tableId]) {
      selectedColumns = parsedValue[tableId];
    }
  } catch (err) {
  }

  return selectedColumns;
};

export const setUserStoredColumns = (tableId, selectedColumns) => {
  try {
    const parsedValue1 = localStorage.getItem(glycanColumnsStorageKey);
    let parsedValue = JSON.parse(parsedValue1);
    if (parsedValue) {
      parsedValue[tableId] = selectedColumns;
    } else {
      parsedValue = {
        [tableId] : selectedColumns
      };
    }
    localStorage.setItem(glycanColumnsStorageKey, JSON.stringify(parsedValue));
  } catch (err) {
  }
};


const MAP_COLUMN_FIELDS = {
  "glytoucan_ac": "glytoucan_ac",
  "hit_score": "hit_score",
  "number_proteins": "number_proteins",
  "species_list": "list",
  "classification": "list",
  "iupac": "show_more",
  "glycoct": "show_more",
  "gwb": "show_more",
  "glycam": "show_more",
  "wurcs": "show_more",
  "inchi": "show_more_wrap",
  "publication_id_list": "show_more_list",
  "publication": "show_more_list",
  "glycoprotein": "glycoprotein",
  "names": "show_more_wrap",
  "enzyme": "glycoprotein",
  "composition_id": "glytoucan_ac",
  "base_composition_id": "glytoucan_ac",
  "glycoprotein_count": "number_proteins",
  "image_url": "image_url",
  "motifs":"motifs",
  "snv":"yes_no_formater",
  "glycosylation":"yes_no_formater",
  "mutagenesis":"yes_no_formater",
  "glycation":"yes_no_formater",
  "phosphorylation":"yes_no_formater",
  "biomarkers":"yes_no_formater",
  "glycosylation_type":"list",
  "uniprot_canonical_ac":"uniprot_canonical_ac",
  "start_pos":"site",
  "end_pos":"site",
  "gene_names_uniprotkb":"list",
  "gene_names_refseq":"list",
  "protein_names_uniprotkb":"list",
  "protein_names_refseq":"list",
  "gene_names_refseq":"list",
  "disease":"show_more",
  "function":"show_more",
  "pathway":"show_more",
  "snv_type":"list"
}

const yesNoFormater = (value, row) => {
  return value && value.length > 1 ? value.charAt(0).toUpperCase() + value.slice(1) : value;
};

const columnDisplayTypes = {
  "glytoucan_ac":{
    dataField: "",
    text: "",
    sort: true,
    selected: true,
    headerStyle: (colum, colIndex) => {
      return {
        backgroundColor: "#4B85B6",
        color: "white",
        width: "15% !important"
      };
    },

    formatter: (value, row) => (
      <LineTooltip text="View details">
        <Link to={routeConstants.glycanDetail + value}>
          {value}
        </Link>
      </LineTooltip>
    )
  },
  "image_url":{
    text: "",
    dataField: "image_url",
    sort: false,
    selected: true,
    formatter: (value, row) => (
      <div className="img-wrapper">
        <img
          className="img-cartoon"
          src={getGlycanImageUrl(row.glytoucan_ac)}
          alt="Glycan img"
        />
      </div>
    ),
    headerStyle: (colum, colIndex) => {
      return {
        width: "30%",
        textAlign: "left",
        backgroundColor: "#4B85B6",
        color: "white",
        whiteSpace: "nowrap"
      };
    }
  },
  "uniprot_canonical_ac":{
    dataField: "",
    text: "",
    sort: true,
    selected: true,
    headerStyle: (colum, colIndex) => {
      return {
        backgroundColor: "#4B85B6",
        color: "white",
        width: "15% !important"
      };
    },
    formatter: (value, row) => (
      <LineTooltip text="View details">
        <Link to={routeConstants.proteinDetail + value}>
          {value}
        </Link>
      </LineTooltip>
    )
  },
  "site":{
    dataField: "start_pos",
    text: "Start Pos",
    sort: true,
    formatter: (value, row) =>
      row.start_pos === row.end_pos && value !== 0 ? (
        <LineTooltip text="View siteview details">
          <Link
            to={`${routeConstants.siteview + row.uniprot_canonical_ac}/${
              value
            }`}
          >
            {value}
          </Link>
        </LineTooltip>
      ) : (
        row.start_pos === row.end_pos && value === 0 ? "Not Reported" : value
      ),
  },
  "hit_score":{
    dataField: "hit_score",
    text: "Hit Score",
    sort: true,
    headerStyle: (colum, colIndex) => {
      return { backgroundColor: "#4B85B6", color: "white" };
    },
    formatter: (value, row) => (
      <>
        <HitScoreTooltip
          title={"Hit Score"}
          text={"Hit Score Formula"}
          formula={"0.1 + ∑ (Weight + 0.01 * Frequency)"}
          contributions={row.score_info && row.score_info.contributions && row.score_info.contributions.map((item) => {return {c:glycanStrings.contributions[item.c] ? glycanStrings.contributions[item.c].name: item.c, w: item.w, f: item.f}})}
        />
        {row.hit_score}
      </>
    )
  },
  "list":{
    dataField: "",
    text: "",
    sort: true,
    headerStyle: (colum, colIndex) => {
      return { width: "20%" };
    },
    formatter: (value, row) => (
      <>
        {value && value.split(";").map(val => (
          <Col className="nowrap ps-0">
            <div>
              {val}
            </div>
          </Col>
        ))}
      </>
    )
  },
  "list_pipe":{
    dataField: "",
    text: "",
    sort: true,
    headerStyle: (colum, colIndex) => {
      return { width: "20%" };
    },
    formatter: (value, row) => (
      <>
        {value && value.split("|").map(val => (
          <Col className="nowrap ps-0">
            <div>
              {val}
            </div>
          </Col>
        ))}
      </>
    )
  },
  "motifs":{
    dataField: "",
    text: "",
    sort: false,
    headerStyle: (colum, colIndex) => {
      return { width: "20%" };
    },
    formatter: (value, row) => (
      <>
        {value && 
          <CollapsableLinkText data={value.split(";")} routeLink={routeConstants.motifDetail}/>
        }
      </>
    )
  },
  "glycoprotein":{
    dataField: "",
    text: "",
    sort: false,
    headerStyle: (colum, colIndex) => {
      return { width: "20%" };
    },
    formatter: (value, row) => (
      <>
        {value && 
          <CollapsableLinkText data={value.split(";")} routeLink={routeConstants.proteinDetail}/>
        }
      </>
    )
  },
  "show_more_list":{
    dataField: "",
    text: "",
    sort: false,
    headerStyle: (colum, colIndex) => {
      return { width: "20%" };
    },
    formatter: (value, row) => (
      <>
        {value && 
          <CollapsableLinkText data={value.split(";")}/>
        }
      </>
    )
  },
  "show_more":{
    dataField: "",
    text: "",
    sort: true,
    headerStyle: (colum, colIndex) => {
      return {
        width: "20%",
      };
    },
    formatter: (value, row) => <CollapsibleText text={value} lines={5} />,
  },
  "show_more_wrap":{
    dataField: "",
    text: "",
    sort: true,
    headerStyle: (colum, colIndex) => {
      return {
        width: "20%",
      };
    },
    formatter: (value, row) => <CollapsibleWrapText text={value} lines={5} />,
  },
  "yes_no_formater":{
    dataField: "",
    text: "",
    sort: true,
    formatter: yesNoFormater,
  },
  "display_no_format":{
    dataField: "",
    text: "",
    sort: true,
    headerStyle: (colum, colIndex) => {
      return { backgroundColor: "#4B85B6", color: "white" };
    },
    selected: true
  },
  "display_format_na":{
    dataField: "",
    text: "",
    sort: true,
    headerStyle: (colum, colIndex) => {
      return { backgroundColor: "#4B85B6", color: "white" };
    },
    formatter: value => (value && (typeof value === "string" || typeof value === "number")? value : "N/A")
  },
  "display_format":{
    dataField: "",
    text: "",
    sort: true,
    headerStyle: (colum, colIndex) => {
      return { backgroundColor: "#4B85B6", color: "white" };
    },
    formatter: value => (value && (typeof value === "string" || typeof value === "number") ? value : "")
  }
};

export function getDisplayColumnList(userSelColumns, setSelectedColumns, columnSpecDispTypes) {
  let columnsArr = [];
  for (let i = 0; i < userSelColumns.length; i++) {
    let col = userSelColumns[i];
    let disType = MAP_COLUMN_FIELDS[col.id];
    if (!disType) {
      disType = "display_format";
    }
    let colObj = columnSpecDispTypes ? columnSpecDispTypes[disType] : undefined;
    if (!colObj) {
      colObj = columnDisplayTypes[disType];
    }
    colObj.dataField = col.property_name;
    colObj.text = col.label;
    columnsArr.push({...colObj});
  }
  if (columnsArr.length > 0) {
    setSelectedColumns(columnsArr);
  }
}
