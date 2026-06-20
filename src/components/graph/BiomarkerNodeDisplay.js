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
import Card from "react-bootstrap/Card";
import routeConstants from "../../data/json/routeConstants";
import EvidenceList from "../EvidenceList";
import { Link } from "react-router-dom";
import { groupEvidences, groupOrganismEvidences } from "../../data/data-format";
import ClientPaginatedTable from "../ClientPaginatedTable";
import DetailTooltips from "../../data/json/biomarkerDetailTooltips.json";
import HelpTooltip from "../tooltip/HelpTooltip";
import Table from "react-bootstrap/Table";
import { Grid } from "@mui/material";


const glycanStrings = stringConstants.glycan.common;
const glycanDirectSearch = stringConstants.glycan.direct_search;
const proteinStrings = stringConstants.protein.common;
const motifStrings = stringConstants.motif.common;
const biomarkerStrings = stringConstants.biomarker.common;

const CompositionDisplay = props => {
  return (
    <>
      {props.composition.map(item => (
        <React.Fragment key={item.name}>
          {item.url ? (
            <>
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                {item.name}
              </a>
              <sub>{item.count} </sub>
              {"  "}
            </>
          ) : (
            <>
              {item.name}
              <sub>{item.count}</sub>
              {"  "}
            </>
          )}
        </React.Fragment>
      ))}
    </>
  );
};

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

const proteinColumns = [
  {
    dataField: "evidence",
    text: proteinStrings.evidence.name,
    headerStyle: (colum, colIndex) => {
      return { backgroundColor: "#4B85B6", color: "white", width: "20%" };
    },
    formatter: (cell, row) => {
      return (
        <EvidenceList
          key={row.position + row.assessed_biomarker_entity_id}
          evidences={groupEvidences(cell)}
        />
      );
    }
  },
  {
    dataField: "biomarker",
    text: biomarkerStrings.biomarker.name,
    sort: true,
    selected: true,
    headerStyle: (colum, colIndex) => {
      return { backgroundColor: "#4B85B6", color: "white" };
    },
  },
  {
    dataField: "assessed_biomarker_entity",
    text: biomarkerStrings.assessed_biomarker_entity.name,
    sort: true,
    selected: true,
    headerStyle: (colum, colIndex) => {
      return { backgroundColor: "#4B85B6", color: "white" };
    },
  },
  {
    dataField: "assessed_biomarker_entity_id",
    text: biomarkerStrings.assessed_biomarker_entity_id.name,
    sort: true,
    headerStyle: (colum, colIndex) => {
      return { backgroundColor: "#4B85B6", color: "white" };
    },
    formatter: (value, row) => (
      <>
        <Link to={routeConstants.proteinDetail + row.assessed_biomarker_entity_id} target="_blank" rel="noopener noreferrer">{row.assessed_biomarker_entity_id}</Link>
      </>
    ),
  },
  {
    dataField: "loinc_code",
    text: biomarkerStrings.loinc_code.name,
    // sort: true,
    selected: true,
    headerStyle: (colum, colIndex) => {
      return { backgroundColor: "#4B85B6", color: "white" };
    },
    formatter: (cell, row) => {
      return (<>
        <ul style={{ marginLeft: "-40px" }}>
          <ul>
            {row && row.loinc_code && row.loinc_code.map(obj => (
              <li>{obj}</li>))}
          </ul>
        </ul>
      </>);
    }
  },
  {
    dataField: "specimen_id",
    text: biomarkerStrings.specimen_name.name,
    // sort: true,
    selected: true,
    headerStyle: (colum, colIndex) => {
      return { backgroundColor: "#4B85B6", color: "white" };
    },
    formatter: (cell, row) => {
      return (<>
        <ul style={{ marginLeft: "-40px" }}>
          <ul>
            {row && row.specimen && row.specimen.map(obj => (
              <li>{obj.name} ({obj.namespace}: <a href={obj.url} target="_blank" rel="noopener noreferrer">{obj.id}</a>)</li>
            ))}
          </ul>
        </ul>
      </>);
    }
  },
];

const glycanColumns = [
  {
    dataField: "evidence",
    text: proteinStrings.evidence.name,
    headerStyle: (colum, colIndex) => {
      return { backgroundColor: "#4B85B6", color: "white", width: "20%" };
    },
    formatter: (cell, row) => {
      return (
        <EvidenceList
          key={row.position + row.assessed_biomarker_entity_id}
          evidences={groupEvidences(cell)}
        />
      );
    }
  },
  {
    dataField: "biomarker",
    text: biomarkerStrings.biomarker.name,
    sort: true,
    selected: true,
    headerStyle: (colum, colIndex) => {
      return { backgroundColor: "#4B85B6", color: "white" };
    },
  },
  {
    text: glycanStrings.glycan_image.name,
    formatter: (value, row) => (
      <div className="img-wrapper">
        <img className="img-cartoon" src={getGlycanImageUrl(row.assessed_biomarker_entity_id)} alt="Glycan img" />
      </div>
    ),
    headerStyle: (colum, colIndex) => {
      return {
        textAlign: "left",
        backgroundColor: "#4B85B6",
        color: "white",
        whiteSpace: "nowrap",
      };
    },
  },
  {
    dataField: "assessed_biomarker_entity",
    text: biomarkerStrings.assessed_biomarker_entity.name,
    sort: true,
    selected: true,
    headerStyle: (colum, colIndex) => {
      return { backgroundColor: "#4B85B6", color: "white" };
    },
  },
  {
    dataField: "assessed_biomarker_entity_id",
    text: biomarkerStrings.assessed_biomarker_entity_id.name,
    sort: true,
    headerStyle: (colum, colIndex) => {
      return { backgroundColor: "#4B85B6", color: "white" };
    },
    formatter: (value, row) => (
      <>
        <Link to={routeConstants.glycanDetail + row.assessed_biomarker_entity_id} target="_blank" rel="noopener noreferrer">{row.assessed_biomarker_entity_id}</Link>
      </>
    ),
  },
  {
    dataField: "specimen_id",
    text: biomarkerStrings.specimen_name.name,
    // sort: true,
    selected: true,
    headerStyle: (colum, colIndex) => {
      return { backgroundColor: "#4B85B6", color: "white" };
    },
    formatter: (cell, row) => {
      return (<>
        <ul style={{ marginLeft: "-40px" }}>
          <ul>
            {row && row.specimen && row.specimen.map(obj => (
              <li>{obj.name} ({obj.namespace}: <a href={obj.url} target="_blank" rel="noopener noreferrer">{obj.id}</a>)</li>
            ))}
          </ul>
        </ul>
      </>);
    }
  },
];


/**
 * Biomarker Node display component.
 */
const BiomarkerNodeDisplay = (props) => {
  const [detailData, setDetailData] = useState({});
  const [BESTBiomarkerRole, setBESTBiomarkerRole] = useState([]);
  const [components, setComponents] = useState(undefined);
  const [biomarkerId, setBiomarkerId] = useState("");
  const [biomarkerCanonicalId, setBiomarkerCanonicalId] = useState("");
  const [glycanComponents, setGlycanComponents] = useState("");
  const [proteinComponents, setProteinComponents] = useState("");
  const [dataStatus, setDataStatus] = useState("No Data Available.");
  const [conditionData, setConditionData] = useState([]);


  useEffect(() => {

    if (props.nodeData === undefined || props.nodeType !== "biomarker")
      return

    let detailDataTemp = props.nodeData.details;
    let nodeData = props.nodeData

    setDetailData(detailDataTemp);

    setBESTBiomarkerRole(detailDataTemp.best_biomarker_role);
    setComponents(detailDataTemp.biomarker_component);
    setBiomarkerId(detailDataTemp.biomarker_id);
    setBiomarkerCanonicalId(detailDataTemp.biomarker_canonical_id);

    let glyComp = [];
    let proComp = [];
    if (props.graphType === "glycan") {
      glyComp = detailDataTemp.biomarker_component.map((obj) => { return { evidence: obj.evidence_source, biomarker: obj.biomarker, assessed_biomarker_entity_id: obj.assessed_biomarker_entity_id, assessed_biomarker_entity: obj.assessed_biomarker_entity ? obj.assessed_biomarker_entity.recommended_name : "", specimen_id: obj.specimen ? obj.specimen.map(obj => obj.id).filter(obj => obj !== undefined) : [], specimen: obj.specimen } })
    } else if (props.graphType === "protein") {
      proComp = detailDataTemp.biomarker_component.map((obj) => { return { evidence: obj.evidence_source, biomarker: obj.biomarker, assessed_biomarker_entity_id: obj.assessed_biomarker_entity_id, assessed_biomarker_entity: obj.assessed_biomarker_entity ? obj.assessed_biomarker_entity.recommended_name : "", loinc_code: obj.specimen ? obj.specimen.map(obj => obj.loinc_code).filter(obj => obj !== undefined && obj !== "") : [], specimen_id: obj.specimen ? obj.specimen.map(obj => obj.id).filter(obj => obj !== undefined) : [], specimen: obj.specimen } })
    }
    setGlycanComponents(glyComp);
    setProteinComponents(proComp);

    if (detailDataTemp.condition) {
      let conditionDataTemp = conditionDataRearrangement();
      setConditionData(conditionDataTemp);
      function conditionDataRearrangement() {
        var condition = []
        condition.push(detailDataTemp.condition);
        for (var i = 0; i < condition.length; i++) {
          if (condition[i].synonyms) {
            var synTemp = [];
            var synonyms = condition[i].synonyms.slice();
            for (var j = 0, k = 0; j < condition[i].synonyms.length; j++) {
              var temp = synonyms.filter((syn) => syn.name === condition[i].synonyms[j].name);
              if (temp && temp.length) {
                synTemp[k] = {
                  name: condition[i].synonyms[j].name,
                  resource: temp,
                };
                synonyms = synonyms.filter((syn) => syn.name !== synTemp[k].name);
                k++;
              }
            }
            condition[i].synonyms = synTemp;
            condition[i].synShortLen = synTemp.length > 2 ? 2 : synTemp.length;
            condition[i].synLen = synTemp.length;
            condition[i].synBtnDisplay = synTemp.length <= 2 ? false : true;
            condition[i].synShowMore = true;
          }
        }
        return condition;
      }
    } else {
      setConditionData([]);
    }
  }, [props.nodeType]);


  return (
    <>
      <Dialog
        open={props.nodeType == "biomarker"}
        classes={{
          paper: "alert-dialog",
        }}
        style={{ margin: 40 }}
        maxWidth={'lg'}
        disableScrollLock
        onClose={() => props.setNodeType("")}
      >
        <div className="gf-content-div">
          <h5 className="sups-dialog-title" style={{ width: '1000px' }}>{"Biomarker : " + biomarkerId}</h5>
          <div
            style={{ paddingRight: 40, paddingLeft: 40, content: 'center', width: '1000px' }}
          >
            <p><span id='display'></span></p>
            <div style={{ padding: '20px', overflow: 'scroll', content: 'center', maxHeight: '500px', width: '920px' }}>
              {props.nodeType === "biomarker" && <div>

                {/* General */}
                <Card>
                  <Card.Header style={{ paddingTop: "12px", paddingBottom: "12px" }} className="panelHeadBgr">
                    <span className="gg-green d-inline">
                      <HelpTooltip
                        title={DetailTooltips.biomarker.general.title}
                        text={DetailTooltips.biomarker.general.text}
                        urlText={DetailTooltips.biomarker.general.urlText}
                        url={DetailTooltips.biomarker.general.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">
                      {stringConstants.sidebar.general.displayname}
                    </h4>
                  </Card.Header>
                  <Card.Body>
                    <p>
                      {biomarkerId ? (
                        <>
                          <div>
                            <strong>{biomarkerStrings.biomarker_id.name}: </strong>{" "}
                            <Link to={routeConstants.biomarkerDetail + biomarkerId} target="_blank" rel="noopener noreferrer">
                              {biomarkerId}
                            </Link>
                          </div>
                          {biomarkerCanonicalId && <div>
                            <strong>{biomarkerStrings.biomarker_canonical_id.name}: </strong>{" "}
                            <a href={"https://biomarkerkb.org/canonical/" + biomarkerCanonicalId} target="_blank" rel="noopener noreferrer">
                              {biomarkerCanonicalId}
                            </a>
                          </div>}
                        </>
                      ) : (
                        <p>{dataStatus}</p>
                      )}
                    </p>
                  </Card.Body>
                </Card>

                {/*  Components */}
                <div style={{ marginTop: "20px" }}>
                  <Card>
                    <Card.Header style={{ paddingTop: "12px", paddingBottom: "12px" }} className="panelHeadBgr">
                      <span className="gg-green d-inline">
                        <HelpTooltip
                          title={DetailTooltips.biomarker.components.title}
                          text={DetailTooltips.biomarker.components.text}
                          urlText={DetailTooltips.biomarker.components.urlText}
                          url={DetailTooltips.biomarker.components.url}
                          helpIcon="gg-helpicon-detail"
                        />
                      </span>
                      <h4 className="gg-green d-inline">{stringConstants.sidebar.components.displayname}</h4>
                    </Card.Header>
                    <Card.Body>
                      {glycanComponents && glycanComponents.length > 0 && (
                        <ClientPaginatedTable
                          data={glycanComponents}
                          columns={glycanColumns}
                          onClickTarget={"#components"}
                          defaultSortField="assessed_biomarker_entity_id"
                          defaultSortOrder="asc"
                          record_type={"glycan"}
                          serverPagination={false}
                          viewPort={false}
                          title="Biomarker Component - Glycan"
                        />
                      )}
                      {proteinComponents && proteinComponents.length > 0 && (
                        <ClientPaginatedTable
                          data={proteinComponents}
                          columns={proteinColumns}
                          onClickTarget={"#components"}
                          defaultSortField="assessed_biomarker_entity_id"
                          defaultSortOrder="asc"
                          record_type={"protein"}
                          serverPagination={false}
                          viewPort={false}
                          title="Biomarker Component - Protein"
                        />
                      )}
                      {(((proteinComponents === undefined || proteinComponents.length === 0) && (glycanComponents === undefined || glycanComponents.length === 0))) && <p>{dataStatus}</p>}
                    </Card.Body>
                  </Card>
                </div>

                {/*  Condition */}
                <div style={{ marginTop: "20px" }}>
                  <Card>
                    <Card.Header style={{ paddingTop: "12px", paddingBottom: "12px" }} className="panelHeadBgr">
                      <span className="gg-green d-inline">
                        <HelpTooltip
                          title={DetailTooltips.biomarker.condition.title}
                          text={DetailTooltips.biomarker.condition.text}
                          urlText={DetailTooltips.biomarker.condition.urlText}
                          url={DetailTooltips.biomarker.condition.url}
                          helpIcon="gg-helpicon-detail"
                        />
                      </span>
                      <h4 className="gg-green d-inline">
                        {stringConstants.sidebar.condition.displayname}
                      </h4>
                    </Card.Header>
                    <Card.Body className="card-padding-zero">
                      {conditionData && conditionData.length > 0 && (
                        <Table hover fluid="true">
                          <tbody className="table-body">
                            {conditionData.map((thisCondition, indDis) => (
                              <tr className="table-row" key={"dis" + indDis}>
                                <td>
                                  <div className1="mb-3">
                                    <Grid item size={{ xs: 12 }}>
                                      <div>
                                        <div className1="mb-3">
                                          <strong> {proteinStrings.name.name}: </strong>{" "}
                                          {thisCondition.recommended_name.name} (
                                          <Link
                                            to={routeConstants.diseaseDetail + thisCondition.recommended_name.id}
                                            target="_blank" rel="noopener noreferrer"
                                          >
                                            {thisCondition.recommended_name.id}
                                          </Link>
                                          )
                                          <EvidenceList
                                            inline={true}
                                            evidences={groupEvidences(thisCondition.evidence)}
                                          />
                                        </div>
                                      </div>
                                    </Grid>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      )}

                      {BESTBiomarkerRole && BESTBiomarkerRole.length > 0 && (
                        <div style={{ paddingTop: "20px", paddingBottom: "20px", paddingRight: "25px", paddingLeft: "25px" }}>
                          <Row>
                            <Col Col md="auto" className="pe-0">
                              <strong>{biomarkerStrings.best_biomarker_role.name}: </strong>
                            </Col>
                            <Col className="nowrap d-inline5 ps-1">
                              {BESTBiomarkerRole.map((obj) => (
                                <>
                                  <span>
                                    {obj.role}
                                  </span>
                                  {<br />}
                                </>
                              ))}
                            </Col>
                          </Row>
                        </div>
                      )}

                      {conditionData && conditionData.length === 0 && BESTBiomarkerRole && BESTBiomarkerRole.length === 0 && (
                        <p className="no-data-msg-publication">{dataStatus}</p>
                      )}
                    </Card.Body>
                  </Card>
                </div>

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
        </div>
      </Dialog>
    </>
  );
};

export default BiomarkerNodeDisplay;

BiomarkerNodeDisplay.propTypes = {
  nodeType: PropTypes.string,
};
