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
import { Link } from "react-router-dom";
import routeConstants from "../../data/json/routeConstants";

const glycanStrings = stringConstants.glycan.common;
const glycanDirectSearch = stringConstants.glycan.direct_search;
const proteinStrings = stringConstants.protein.common;
const motifStrings = stringConstants.motif.common;
const biomarkerStrings = stringConstants.biomarker.common;


/**
 * Motif Node display component.
 */
const MotifNodeDisplay = (props) => {
  const [detailData, setDetailData] = useState({});


  useEffect(() => {

    if (props.nodeData === undefined)
      return
    let detailDataTemp = props.nodeData.details;
    let nodeData = props.nodeData;

    setDetailData(detailDataTemp)

  }, [props.nodeType])

  const {
    id: accession,
    name: motifName,
    synonym: motifSynonym,
    keywords: motifKeywords
  } = detailData;

  return (
    <>
      <Dialog
        open={props.nodeType === "motif"}
        classes={{
          paper: "alert-dialog",
        }}
        style={{ margin: 40 }}
        maxWidth={'lg'}
        disableScrollLock
        onClose={() => props.setNodeType("")}
      >
        <div className="gf-content-div">
          <h5 className="sups-dialog-title" style={{ width: '800px' }}>{"Motif : " + accession}</h5>
          <div
            style={{ paddingRight: 40, paddingLeft: 40, content: 'center', width: '800px' }}
          >
            <p><span id='display'></span></p>
            <div style={{ padding: '20px', overflow: 'scroll', content: 'center', maxHeight: '300px', width: '720px' }}>

              {props.nodeType === "motif" && <div>
                {accession && (
                  <>
                    <p>
                      <img
                        className="img-cartoon"
                        src={getGlycanImageUrl(accession)}
                        alt="Cartoon"
                      />
                    </p>
                    <div>
                      <strong>{motifStrings.motif_id.name}: </strong>
                      <Link to={routeConstants.motifDetail + accession} target="_blank" rel="noopener noreferrer">
                        {accession}
                      </Link>
                    </div>
                    <div>
                      <strong>{motifStrings.motif_name.name}: </strong>
                      <Link to={routeConstants.motifDetail + accession} target="_blank" rel="noopener noreferrer">
                        {motifName}
                      </Link>
                    </div>
                    <div>
                      {motifSynonym && motifSynonym.length > 0 && (
                        <>
                          <Row>
                            <Col Col md="auto" className="pe-0">
                              <strong>{motifStrings.motif_synonym.synonym}: </strong>
                            </Col>
                            <Col className="nowrap d-inline5 ps-1">
                              <>
                                <span>
                                  {motifSynonym}
                                </span>
                                {<br />}
                              </>
                            </Col>
                          </Row>
                        </>
                      )}
                    </div>
                  </>
                )}
                <div>
                  {motifKeywords && motifKeywords.length > 0 ? (
                    <>
                      <Row>
                        <Col Col md="auto" className="pe-0">
                          <strong>{motifStrings.motif_keywords.name}: </strong>
                        </Col>
                        <Col className="nowrap d-inline5 ps-1">
                          {motifKeywords.split(";").map((keywords) => (
                            <>
                              <span>
                                {keywords}
                              </span>
                              {<br />}
                            </>
                          ))}
                        </Col>
                      </Row>
                    </>
                  ) : (
                    <></>
                  )}
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

export default MotifNodeDisplay;

MotifNodeDisplay.propTypes = {
  nodeType: PropTypes.string,
};
