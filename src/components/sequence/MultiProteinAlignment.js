/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useReducer } from "react";
import { Grid, Typography } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import HelpTooltip from "../tooltip/HelpTooltip";
import SequenceDashboard from "./SequenceDashboard";
import routeConstants from "../../data/json/routeConstants";
import stringConstants from "../../data/json/stringConstants";
import SequenceViewer from "./SequenceViewer";
import "../../css/proteinsequence.css";
import { GLYGEN_BASENAME } from "../../envVariables";
import SelectControl from "../select/SelectControl";
import Container from "@material-ui/core/Container";
import { Link } from "react-router-dom";
import LineTooltip from "../tooltip/LineTooltip";

const blastSearch = stringConstants.blast_search.common;


const MultiProteinAlignment = ({algnData, proteinID, proteinIDChange}) => {

  const [selectedHighlights, setSelectedHighlights] = useState({
    mutation: false,
    site_annotation: false,
    n_link_glycosylation: false,
    o_link_glycosylation: false,
    phosphorylation: false,
    glycation: false,
  });
  const [sequenceSearchText, setSequenceSearchText] = useState("");
  const [ sequences, setSequences ] = useState([]);
  const [ multiSequences, setMultiSequences ] = useState([]);
  const [ details, setDetails  ] = useState([]);


  useEffect(() => {
    let proData = algnData[proteinID];

    let newData = [];
    for (let i = 0; i < proData.hsp_list.length; i++) {
      let data = proData.hsp_list[i].sequences.find((seq => seq.uniprot_ac === proteinID));
      newData.push({
        sequences: proData.hsp_list[i].sequences.filter((seq => seq.id !== "matches")).map((seq) => ({
          ...seq,
          clickThruUrl: seq.uniprot_ac === ""
            ? undefined
            : `${basename}${routeConstants.proteinDetail}${seq.id}`,
           uniprot_ac : seq.uniprot_ac === "" ? seq.id + " " + (i + 1) : seq.uniprot_ac,
           offset: seq.start_pos ? parseInt(seq.start_pos) - 1 : 0,
        })),
        start_pos: data.start_pos,
        end_pos: data.end_pos,
        protein_name: proData.details.protein_name,
        evalue: proData.hsp_list[i].evalue,
        score: proData.hsp_list[i].score,
        uniprot_canonical_ac: proteinID,
        consensus: proData.hsp_list[i].sequences.find(seq => seq.id === "matches").aln
      });
    }
      proData.details.uniprot_canonical_ac = proteinID;

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
          showNumbers={true}
        />
        <Grid
          container
          style={{ margin: '0  auto' }}
          spacing={3}
          jus1tify='center'>
          <Grid item xs={6} sm={6} md={6}>
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
                menu={algnData && Object.keys(algnData).length > 0 ? Object.keys(algnData).map(item => {return {name : item + " (" + algnData[item].details.protein_name + ") ", id : item}}) : []}
                required={true}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12} md={12}>
            {multiSequences && multiSequences.map((multiSeque) =>  
            <div className="mb-3">
               <div>
              <strong>{blastSearch.uniprot_canonical_ac.name}: </strong>{" "}
              {<LineTooltip text="View details">
              <Link to={routeConstants.proteinDetail + multiSeque.uniprot_canonical_ac}>
                {multiSeque.uniprot_canonical_ac}
              </Link>
              </LineTooltip>} {"(" + multiSeque.start_pos + " : " + multiSeque.end_pos +")"}
            </div>
            <div>
              <strong>{blastSearch.uniprot_name.name}: </strong>{" "}
              {multiSeque.protein_name}
            </div>
            <div>
              <strong>{blastSearch.evalue.name}: </strong>{" "}
              {multiSeque.evalue}
            </div>
            <div className="mb-3">
              <strong>{blastSearch.score.name}: </strong>{" "}
              {multiSeque.score}
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
