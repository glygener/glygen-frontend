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
import { groupOrganismEvidences } from "../../data/data-format";
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
 *  Protein Node display component.
 */
const ProteinNodeDisplay = (props) => {
  const [detailData, setDetailData] = useState({});

  useEffect(() => {

    if (props.nodeData === undefined)
      return;
    let detailDataTemp = props.nodeData.details;
    let nodeData = props.nodeData;
    setDetailData(detailDataTemp);

  }, [props.nodeType])

  const {
    chemical_mass,
    length,
    gene,
    gene_link,
    gene_names,
    protein_name,
    species,
    tax_common_name,
    tax_id,
    tax_name,
    uniprot_canonical_ac,
    weight,
    xref_id,
    xref_key,
    evidence,
  } = detailData;

  const organismEvidence = groupOrganismEvidences(species);


  return (
    <>
      <Dialog
        open={(props.nodeType === "protein" || props.nodeType === "binding-protein" || props.nodeType === "enzyme")}
        classes={{
          paper: "alert-dialog",
        }}
        style={{ margin: 40 }}
        maxWidth={'lg'}
        disableScrollLock
        onClose={() => props.setNodeType("")}
      >
        {true && <div className="gf-content-div">
          <h5 className="sups-dialog-title" style={{ width: '800px' }}>
            {props.nodeType === "protein" ? "Protein : " + uniprot_canonical_ac : ""}
            {props.nodeType === "binding-protein" ? "Bound Protein : " + uniprot_canonical_ac : ""}
            {props.nodeType === "enzyme" ? "Enzyme : " + uniprot_canonical_ac : ""}
          </h5>
          <div
            style={{ paddingRight: 40, paddingLeft: 40, content: 'center', width: '800px' }}
          >
            <p><span id='display'></span></p>
            <div style={{ padding: '20px', overflow: 'scroll', content: 'center', maxHeight: '300px', width: '720px' }}>

              {(props.nodeType === "protein" || props.nodeType === "binding-protein" || props.nodeType === "enzyme") && <div>


                {gene && gene.length > 0 && (
                  <>
                    <span key={gene}>
                      <div>
                        <strong>{proteinStrings.gene_name.name}:</strong>{" "}
                        <a href={gene_link} target="_blank" rel="noopener noreferrer">
                          {gene}
                        </a>
                      </div>
                    </span>
                  </>
                )}

                {protein_name && protein_name.length > 0 && (
                  <>
                    <span key={gene}>
                      <div>
                        <strong>{proteinStrings.protein_name.name}:</strong>{" "}
                        <span>
                          {protein_name}
                        </span>
                      </div>
                    </span>
                  </>
                )}

                {uniprot_canonical_ac && (
                  <>
                    <div>
                      <strong>{proteinStrings.uniprot_accession.name}: </strong>
                      <Link to={routeConstants.proteinDetail + uniprot_canonical_ac} target="_blank" rel="noopener noreferrer">
                        {uniprot_canonical_ac}
                      </Link>
                    </div>
                    <div>
                      <strong>{proteinStrings.sequence_length.name}: </strong>
                      <a
                        href={`https://www.uniprot.org/uniprot/${uniprot_canonical_ac}/#sequences`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {length}
                      </a>
                    </div>
                    <div>
                      <strong>{proteinStrings.chemical_mass.name}: </strong>
                      {addCommas(chemical_mass)} Da{" "}
                    </div>


                  </>
                )}
                <div>
                  {organismEvidence &&
                    // For every organism object
                    Object.keys(organismEvidence).map((orgEvi) => (
                      // For every database for current organism object
                      <div key={organismEvidence[orgEvi].taxid}>
                        <div>
                          <strong>{proteinStrings.organism.name}: </strong>
                          {organismEvidence[orgEvi].glygen_name}
                        </div>
                        <div>
                          <strong>{proteinStrings.reference_species.name}: </strong>
                          {orgEvi} {"["}
                          {/* <LineTooltip text="View details on NCBI"> */}
                          <a
                            href={`https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=${organismEvidence[orgEvi].taxid}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {organismEvidence[orgEvi].taxid}
                          </a>
                          {/* </LineTooltip> */}
                          {"]"}
                          <EvidenceList evidences={organismEvidence[orgEvi].evidence} />
                        </div>
                      </div>
                    ))}
                  {/* {!species && (
													<p className="no-data-msg">{dataStatus}</p>
												)} */}
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
        </div>}
      </Dialog>
    </>
  );
};

export default ProteinNodeDisplay;

ProteinNodeDisplay.propTypes = {
  nodeType: PropTypes.string,
};
