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
import { groupEvidences } from "../../data/data-format";
import EvidenceList from "../EvidenceList";
import routeConstants from "../../data/json/routeConstants";
import { Link } from "react-router-dom";

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

/**
 *  Glycan Node display component.
 */
const GlycanNodeDisplay = (props) => {
  const [detailData, setDetailData] = useState({});

  useEffect(() => {
    if (props.nodeData === undefined)
      return
    let detailDataTemp = props.nodeData.details;
    let nodeData = props.nodeData;

    let data = {};
    if (detailDataTemp.mass) {
      data.mass = addCommas(detailDataTemp.mass);
    }

    if (detailDataTemp.glytoucan_ac) {
      data.glytoucan_ac = detailDataTemp.glytoucan_ac;
    }

    if (detailDataTemp.interactor_id) {
      data.glytoucan_ac = detailDataTemp.interactor_id;
    }

    if (detailDataTemp.composition) {
      data.composition = detailDataTemp.composition
        .map((res, ind, arr) => {
          if (glycanStrings.composition[res.residue.toLowerCase()]) {
            res.name =
              glycanStrings.composition[
                res.residue.toLowerCase()
              ].shortName;
            res.orderID =
              glycanStrings.composition[res.residue.toLowerCase()].orderID;
            return res;
          } else {
            res.name = res.residue;
            res.orderID =
              parseInt(glycanStrings.composition["other"].orderID) -
              (parseInt(arr.length) - parseInt(ind));
            return res;
          }
        })
        .sort(function (res1, res2) {
          return parseInt(res1.orderID) - parseInt(res2.orderID);
        });
    }

    if (detailDataTemp.classification) {
      data.classification = detailDataTemp.classification;
    }

    if (detailDataTemp.evidence) {
      data.evidence = detailDataTemp.evidence;
    }

    setDetailData(data)

  }, [props.nodeType])

  const {
    mass,
    glytoucan_ac,
    composition,
    classification,
    evidence
  } = detailData;

  return (
    <>
      <Dialog
        open={props.nodeType === "glycan" || props.nodeType === "binding-glycan"}
        classes={{
          paper: "alert-dialog",
        }}
        style={{ margin: 40 }}
        maxWidth={'lg'}
        disableScrollLock
        onClose={() => props.setNodeType("")}
      >
        <div className="gf-content-div">
          <h5 className="sups-dialog-title" style={{ width: '800px' }}>
            {props.nodeType === "binding-glycan" ? "Binding Glycan : " + glytoucan_ac : ""}
            {props.nodeType === "glycan" ? "Glycan : " + glytoucan_ac : ""}
          </h5>
          <div
            style={{ paddingRight: 40, paddingLeft: 40, content: 'center', width: '800px' }}
          >
            <p><span id='display'></span></p>
            <div style={{ padding: '20px', overflow: 'scroll', content: 'center', maxHeight: '500px', width: '720px' }}>
              {(props.nodeType === "glycan" || props.nodeType === "binding-glycan") && <div>
                <div>

                  <span>
                    <img
                      className="img-cartoon"
                      src={getGlycanImageUrl(glytoucan_ac)}
                      alt="Glycan img"
                    />
                  </span>
                  <div>
                    <strong>
                      {proteinStrings.glytoucan_ac.shortName}:{" "}
                    </strong>
                    <Link to={routeConstants.glycanDetail + glytoucan_ac} target="_blank" rel="noopener noreferrer">
                      {glytoucan_ac}
                    </Link>
                  </div>

                  <div>
                    {mass ? (
                      <>
                        <strong>
                          {" "}
                          {glycanStrings.mass.shortName}:{" "}
                        </strong>
                        {mass} Da{" "}
                      </>
                    ) : (
                      <> </>
                    )}
                  </div>

                  {composition && (
                    <div>
                      <strong>Composition:{" "}</strong>
                      <CompositionDisplay composition={composition} />
                    </div>
                  )}

                  {classification && classification.length && (
                    <div>
                      <Row>
                        <Col md="auto" className="pe-0">
                          <strong>
                            {glycanStrings.glycan_type.name} /{" "}
                            {glycanStrings.glycan_subtype.name}:{" "}
                          </strong>
                        </Col>
                        <Col className="ps-0">
                          {classification.map(Formatclassification => (
                            <React.Fragment
                              key={`${Formatclassification.type.name}-${Formatclassification.subtype.name}`}
                            >
                              <div>
                                {Formatclassification.type.url && (
                                  <a
                                    href={Formatclassification.type.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    &nbsp;{Formatclassification.type.name}
                                  </a>
                                )}
                                {!Formatclassification.type.url && (
                                  <>
                                    &nbsp;{Formatclassification.type.name}
                                  </>
                                )}
                                {Formatclassification.subtype &&
                                  Formatclassification.subtype.name !==
                                  "Other" && (
                                    <>
                                      &nbsp; <b>/</b> &nbsp;
                                      {Formatclassification.subtype
                                        .url && (
                                          <a
                                            href={
                                              Formatclassification.subtype
                                                .url
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            {
                                              Formatclassification.subtype
                                                .name
                                            }
                                          </a>
                                        )}
                                      {!Formatclassification.subtype
                                        .url && (
                                          <>
                                            {
                                              Formatclassification.subtype
                                                .name
                                            }
                                          </>
                                        )}
                                    </>
                                  )}
                              </div>
                            </React.Fragment>
                          ))}{" "}
                        </Col>
                      </Row>
                    </div>
                  )}

                  <div>
                    <EvidenceList
                      evidences={groupEvidences(
                        evidence ? evidence : []
                      )}
                      inline={true}
                    />
                  </div>

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

export default GlycanNodeDisplay;

GlycanNodeDisplay.propTypes = {
  nodeType: PropTypes.string,
};
