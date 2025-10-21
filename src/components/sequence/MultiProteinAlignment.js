/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useReducer } from "react";
import { Grid, Typography } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import HelpTooltip from "../tooltip/HelpTooltip";
import SequenceDashboard from "./SequenceDashboard";
import routeConstants from "../../data/json/routeConstants";
import stringConstants from "../../data/json/stringConstants";
import SequenceViewer from "./SequenceViewer";
import "../../css/proteinsequence.css";
import { GLYGEN_BASENAME } from "../../envVariables";
import SelectControl from "../select/SelectControl";
import Container from "@mui/material/Container";
import { Link } from "react-router-dom";
import LineTooltip from "../tooltip/LineTooltip";
import { logActivity } from "../../data/logging";

const blastSearch = stringConstants.blast_search.common;


const MultiProteinAlignment = ({algnData, proteinID, proteinIDChange, jobId}) => {

  const [selectedHighlights, setSelectedHighlights] = useState({
    mutation: false,
    site_annotation: false,
    n_link_glycosylation: false,
    o_link_glycosylation: false,
    phosphorylation: false,
    glycation: false,
  });
  const [sequenceSearchText, setSequenceSearchText] = useState("");
  const [sequenceTemplateText, setSequenceTemplateText] = useState("");
  const [ sequences, setSequences ] = useState([]);
  const [ multiSequences, setMultiSequences ] = useState([]);
  const [ details, setDetails  ] = useState([]);
  const [consensusMenu, setConsesusMenu] = useState(
    [
      { id: "NX[ST]", name: "N-Glycan Sequon - NX[ST]" },
      { id: "CXXXX[ST]C", name: "O-Fucose - CXXXX[ST]C" },
      { id: "CXX[ST]CXXG", name: "O-Fucose - CXX[ST]CXXG" },
      { id: "CXSX[PA]C", name: "O-Glucose - CXSX[PA]C" },
      { id: "CXNTXGSFXC", name: "O-Glucose - CXNTXGSFXC"},
      { id: "CXXXX[ST]GXXC", name:"O-GlcNAc (external) - CXXXX[ST]GXXC"},
      { id: "CXX[ST]C", name:"O-Fucose - CXX[ST]C"},
      { id: "WXX[WC]", name:"C-Mannose - WXX[WC]"},
      { id: "WXXWXXW", name:"C-Mannose - WXXWXXW"},
      { id: "WXXWXXWXXC", name:"C-Mannose - WXXWXXWXXC"},
    ]
  )


  useEffect(() => {
    let proData = algnData[proteinID];

    if (algnData && Object.keys(algnData).length > 0) {
      let protArr = Object.keys(algnData).filter(item => algnData[item].details === undefined);
      if (protArr && protArr.length > 0){
        let message = "Protein objects with no details object: " + protArr.join(", ");
        logActivity("error", jobId, message);
      }
    }
    let newData = [];
    if (proData && proData.hsp_list) {
      for (let i = 0; i < proData.hsp_list.length; i++) {
        let data = proData.hsp_list[i].sequences.find((seq => seq.uniprot_ac === proteinID));
        newData.push({
          sequences: proData.hsp_list[i].sequences.filter((seq => seq.id !== "matches")).map((seq) => ({
            ...seq,
            clickThruUrl: seq.uniprot_ac === ""
              ? undefined
              : `${basename}${routeConstants.proteinDetail}${proData.details.uniprot_canonical_ac}`,
            uniprot_ac : seq.uniprot_ac === "" ? seq.id + " " + (i + 1) : seq.uniprot_ac,
            offset: seq.start_pos ? parseInt(seq.start_pos) - 1 : 0,
          })),
          start_pos: data.start_pos,
          end_pos: data.end_pos,
          protein_name: proData.details.protein_name,
          gene_name: proData.details.gene_name,
          species_name: proData.details.species.glygen_name,
          evalue: proData.hsp_list[i].evalue,
          score: proData.hsp_list[i].score,
          positives: proData.hsp_list[i].positives,
          identities: proData.hsp_list[i].identities,
          identities_val: parseInt(proData.hsp_list[i].identities.slice(proData.hsp_list[i].identities.indexOf("(")+1, proData.hsp_list[i].identities.indexOf("%"))),
          gaps: proData.hsp_list[i].gaps,
          method: proData.hsp_list[i].method,
          uniprot_canonical_ac: proData.details.uniprot_canonical_ac,
          uniprot_ac: proteinID,
          consensus: proData.hsp_list[i].sequences.find(seq => seq.id === "matches").aln
        });
      }
    } else {
      return;
    }
      proData.details.uniprot_canonical_ac = proData.details.uniprot_canonical_ac;
      proData.details.uniprot_ac = proteinID;

      let seqData = [];
      for (let i = 0; i < proData.hsp_list.length; i++) {
        let sequence = proData.hsp_list[i].sequences.find((seq => seq.id !== "matches" && seq.id !== "QUERY"));
        seqData.push({
          "start_pos": sequence.start_pos,
          "end_pos": sequence.end_pos,
        });
      }

      let newDetailData = [];
      let siteArr = ["ptm_annotation", "glycosylation", "mutagenesis", "phosphorylation", "snv", "glycation", 
      "site_annotation"];

      for (let j = 0; j < siteArr.length; j++) {
        newDetailData[siteArr[j]] = proData.details[siteArr[j]].filter((site) => {
          for (let i = 0; i < seqData.length; i++) {
            if (seqData[i].start_pos <= site.start_pos &&  site.end_pos <= seqData[i].end_pos)
              return true;
          }
          return false;
        })
      }
      newDetailData.uniprot_canonical_ac = proteinID;

      setDetails([newDetailData]);
      setMultiSequences(newData);
      setSequences(newData[0].sequences);
      setSelectedHighlights({
        mutation: false,
        site_annotation: false,
        n_link_glycosylation: false,
        o_link_glycosylation: false,
        phosphorylation: false,
        glycation: false,
      });
      setSequenceSearchText("");
  }, [algnData, proteinID]);

  // ===================================== //
  const basename = GLYGEN_BASENAME === "/" ? "" : GLYGEN_BASENAME;

  return (
    <>
      <Container maxWidth="xl" content="center" className="gg-container">
        <SequenceDashboard
          details={details}
          sequenceObject={sequences}
          selectedHighlights={selectedHighlights}
          setSelectedHighlights={setSelectedHighlights}
          sequenceSearchText={sequenceSearchText}
          setSequenceSearchText={setSequenceSearchText}
          sequenceTemplateText={sequenceTemplateText}
          setSequenceTemplateText={setSequenceTemplateText}
          consensusMenu={consensusMenu}
          showNumbers={true}
        />
        <Grid
          container
          style={{ margin: '0  auto' }}
          spacing={3}
          jus1tify='center'>
          <Grid item sx={{pl: 3, pt: 3}} size= {{ xs: 7, sm: 7, md: 7 }} >
            <FormControl
              fullWidth
              variant="outlined"
            >
              <Typography className={"search-lbl"} gutterBottom>
                <HelpTooltip
                  title={"Select Protein ID"}
                  text={"Select Protein ID"}
                />
                {"Select Protein ID"}
              </Typography>
              <SelectControl
                inputValue={proteinID}
                setInputValue={(val) => proteinIDChange(val)}
                menu={algnData && Object.keys(algnData).length > 0 ? Object.keys(algnData).filter(item => algnData[item].details !== undefined).map(item => {return {name : item + " : " + algnData[item].details.protein_name + " (" + algnData[item].hsp_list.length + " match(es)), " + algnData[item].details.species.glygen_name, id : item}}) : []}
                required={true}
              />
            </FormControl>
          </Grid>
          <Grid item sx={{pl: 3, pt: 3}} size= {{ xs: 12, sm: 12, md: 12 }}>
            {multiSequences && multiSequences.sort((obj1, obj2) => {
              if (obj1.evalue === obj2.evalue) {
                return obj2.identities_val - obj1.identities_val;
              }
              return obj1.evalue - obj2.evalue;
            }).map((multiSeque) =>  
            <div className="mb-3">
               <div>
              <strong>{blastSearch.uniprot_canonical_ac.name}: </strong>{" "}
              {<LineTooltip text="View details">
              <Link to={routeConstants.proteinDetail + multiSeque.uniprot_canonical_ac}>
                {multiSeque.uniprot_ac}
              </Link>
              </LineTooltip>} {"(" + multiSeque.start_pos + " : " + multiSeque.end_pos +")"}
            </div>
            <div>
              <strong>{blastSearch.protein_name.name}: </strong>{" "}
              {multiSeque.protein_name}
            </div>
            <div>
              <strong>{blastSearch.gene_name.name}: </strong>{" "}
              {multiSeque.gene_name}
            </div>
            <div>
              <strong>{blastSearch.species_name.name}: </strong>{" "}
              {multiSeque.species_name}
            </div>
            <div>
              <strong>{blastSearch.evalue.name}: </strong>{" "}
              {multiSeque.evalue}
            </div>
            <div>
              <strong>{blastSearch.score.name}: </strong>{" "}
              {multiSeque.score}
            </div>
            <div>
              <strong>{blastSearch.positives.name}: </strong>{" "}
              {multiSeque.positives}
            </div>
            <div>
              <strong>{blastSearch.identities.name}: </strong>{" "}
              {multiSeque.identities}
            </div>
            <div>
              <strong>{blastSearch.gaps.name}: </strong>{" "}
              {multiSeque.gaps}
            </div>
            <div className="mb-3">
              <strong>{blastSearch.method.name}: </strong>{" "}
              {multiSeque.method}
            </div>
              {algnData && (
                <SequenceViewer
                  details={details}
                  sequenceObject={multiSeque.sequences}
                  consensus={multiSeque.consensus}
                  selectedHighlights={selectedHighlights}
                  sequenceSearchText={sequenceSearchText}
                  multiSequence={true}
                />
              )}
            </div>)}
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default MultiProteinAlignment;
