import React, { useEffect, useReducer, useState } from 'react';
import '../../css/Search.css';
import stringConstants from '../../data/json/stringConstants';
import superSearchData from '../../data/json/superSearchData';
import { getSuperSearch } from '../../data/supersearch';
import SuperSearchInputcontrol from '../input/SuperSearchInputcontrol';
import { Dialog } from "@mui/material";
import Button from 'react-bootstrap/Button';
import { logActivity } from '../../data/logging';
import { axiosError } from '../../data/axiosError';
import TextAlert from '../alert/TextAlert';
import PropTypes from "prop-types";
import { getGlycanImageUrl } from "../../data/glycan";
import { Col, Row } from "react-bootstrap";
import EvidenceList from "../EvidenceList";
import LineTooltip from "../tooltip/LineTooltip";
import ClientExpandableTableNew from "../ClientExpandableTableNew"
import { Link as LinkMUI } from "@mui/material";
import { groupOrganismEvidencesTableView } from "../../data/data-format";


const glycanStrings = stringConstants.glycan.common;
const glycanDirectSearch = stringConstants.glycan.direct_search;
const proteinStrings = stringConstants.protein.common;
const motifStrings = stringConstants.motif.common;
const biomarkerStrings = stringConstants.biomarker.common;


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

const glycoOrganismColumns = [
  {
    id: "evidence",
    header: proteinStrings.evidence.name,
    // sort: true,
    headerStyle: (colum, colIndex) => {
      return { backgroundColor: "#4B85B6", color: "white", width: "25%" };
    },
    Cell: ({ renderedCellValue, row }) => {
      return (
        <EvidenceList
          key={row.position + row.uniprot_canonical_ac}
          evidences={row.original.evidence}
        />
      );
    }
  },
  {
    id: "glygen_name",
    header: glycanStrings.organism.shortName,
    sort: true,
    headerStyle: (colum, colIndex) => {
      return { backgroundColor: "#4B85B6", color: "white", width: "20%" };
    },
    Cell: ({ renderedCellValue, row }) => (
      <>
        {row.original.glygen_name}
      </>
    )
  },
  {
    id: "details",
    header: glycanStrings.details.name,
    // sort: true,
    headerStyle: (colum, colIndex) => {
      return { backgroundColor: "#4B85B6", color: "white", width: "35%" };
    },
    Cell: ({ renderedCellValue, row }) => (<>
      {row.original.annotation_count && row.original.species_count &&
        <span
          style={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {`${row.original.annotation_count} annotations and ${row.original.species_count} Species`}
        </span>}
    </>)
  }
];

const glycoOrganismExpandedColumns = [
  {
    dataField: "database",
    text: proteinStrings.evidence.name,
    sort: true,
    headerStyle: (colum, colIndex) => {
      return { backgroundColor: "#4B85B6", color: "white", width: "20%" };
    },
    formatter: (value, row) => (
      <>
        {value}
      </>
    )
  },
  {
    dataField: "id",
    text: glycanStrings.id.name,
    sort: true,
    headerStyle: (colum, colIndex) => {
      return { backgroundColor: "#4B85B6", color: "white", width: "20%" };
    },
    formatter: (value, row) => (
      <>
        {row.url ? <LinkMUI href={row.url} target="_blank" rel="noopener noreferrer">
          {value}
        </LinkMUI> :
          <span>{value}</span>}
      </>
    )
  },
  {
    dataField: "name",
    // text: glycanStrings.species_name.name,
    text: glycanStrings.scientific_name.name,
    sort: true,
    headerStyle: (colum, colIndex) => {
      return { backgroundColor: "#4B85B6", color: "white", width: "20%" };
    },
    formatter: (value, row) => (
      <>
        {value}
      </>
    )
  },
  {
    dataField: "common_name",
    text: glycanStrings.common_name.name,
    sort: true,
    headerStyle: (colum, colIndex) => {
      return { backgroundColor: "#4B85B6", color: "white", width: "20%" };
    },
    ormatter: (value, row) => (
      <>
        {value}
      </>
    )
  },
  {
    dataField: "taxid",
    text: proteinStrings.tax_id.name,
    sort: true,
    headerStyle: (colum, colIndex) => {
      return { backgroundColor: "#4B85B6", color: "white", width: "20%" };
    },
    formatter: (value, row) => (
      <>
        {value && <LineTooltip text="View details on NCBI">
          <a
            href={`https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=${value}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {value}
          </a>
        </LineTooltip>}
      </>
    )
  },
];

/**
 * Organism Node display component.
 */
const OrganismNodeDisplay = (props) => {
  const [detailData, setDetailData] = useState({});
  const [organism, setOrganism] = useState("");

  const [orgExpandedRow, setOrgExpandedRow] = useReducer(
    (state, newState) => ({
      ...state,
      ...newState,
    }), {
    orgArr: []
  }
  );

  function expandCloseTableRow(id, expand) {
    let orgExp = orgExpandedRow;
    if (expand) {
      orgExp.orgArr.push(id);
      setOrgExpandedRow(orgExp)
    } else {
      orgExp.orgArr = orgExp.orgArr.filter(org => org !== id);
      setOrgExpandedRow(orgExp)
    }
  }

  useEffect(() => {

    if (props.nodeData === undefined || props.nodeType !== "organism")
      return
    let detailDataTemp = props.nodeData.details;
    let nodeData = props.nodeData;
    setOrganism(detailDataTemp.glygen_name)

    setDetailData({ "species": [detailDataTemp] })

  }, [props.nodeType])

  const {
    species
  } = detailData;

  const organismEvidence = groupOrganismEvidencesTableView(species);


  return (
    <>
      <Dialog
        open={props.nodeType === "organism"}
        classes={{
          paper: "alert-dialog",
        }}
        style={{ margin: 40 }}
        maxWidth={'lg'}
        disableScrollLock
        onClose={() => props.setNodeType("")}
      >
        {props.nodeType === "organism" && <div className="gf-content-div">
          <h5 className="sups-dialog-title" style={{ width: '1000px' }}>{"Organism : " + organism}</h5>
          <div
            style={{ paddingRight: 40, paddingLeft: 40, content: 'center', width: '1000px' }}
          >
            <p><span id='display'></span></p>
            <div style={{ padding: '20px', overflow: 'scroll', content: 'center', maxHeight: '500px', width: '920px' }}>
              {props.nodeType === "organism" && <div>
                {organismEvidence && organismEvidence.length > 0 &&
                  <ClientExpandableTableNew
                    data={organismEvidence}
                    orgExpandedRow={orgExpandedRow}
                    columns={glycoOrganismColumns}
                    expandableTableColumns={glycoOrganismExpandedColumns}
                    defaultSortField={"common_name"}
                    onClickTarget={"#organism"}
                  />
                }
              </div>}

            </div>
            <div style={{ marginTop: "20px", marginRight: "15px" }}>
              <Button
                className='gg-btn-blue mb-5'
                style={{ float: "right" }}
                onClick={() => { props.setNodeType("") }}
              >
                Ok
              </Button>
            </div>
          </div>
        </div>}
      </Dialog>
    </>
  );
};

export default OrganismNodeDisplay;

OrganismNodeDisplay.propTypes = {
  nodeType: PropTypes.string,
};
