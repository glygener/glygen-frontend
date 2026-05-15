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
 *  Molecular Function Node display component.
 */
const MolecularFunctionNodeDisplay = (props) => {
  const [detailData, setDetailData] = useState({});

  useEffect(() => {

    if (props.nodeData === undefined)
      return
    let detailDataTemp = props.nodeData.details;
    let nodeData = props.nodeData

    setDetailData(detailDataTemp)

  }, [props.nodeType])

  const {
    id,
    url,
    name,
    evidence,
  } = detailData;

  return (
    <>
      <Dialog
        open={props.nodeType === "molecular-function"}
        classes={{
          paper: "alert-dialog",
        }}
        style={{ margin: 40 }}
        maxWidth={'lg'}
        disableScrollLock
        onClose={() => props.setNodeType("")}
      >
        <div className="gf-content-div">
          <h5 className="sups-dialog-title" style={{ width: '800px' }}>{"Molecular Function : " + name}</h5>
          <div
            style={{ paddingRight: 40, paddingLeft: 40, content: 'center', width: '800px' }}
          >
            <p><span id='display'></span></p>
            <div style={{ padding: '20px', overflow: 'scroll', content: 'center', maxHeight: '300px', width: '720px' }}>

              {props.nodeType === "molecular-function" && <div>
                <div>
                  <div>
                    <strong>
                      {"Name"}:{" "}
                    </strong>
                    {name}{" "}
                    (<a href={url} target="_blank" rel="noopener noreferrer">
                      {id}
                    </a>)
                  </div>
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

export default MolecularFunctionNodeDisplay;

MolecularFunctionNodeDisplay.propTypes = {
  nodeType: PropTypes.string,
};
