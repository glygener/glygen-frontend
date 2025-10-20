import React from "react";
import { groupEvidences } from "../data/data-format";
import { Grid } from "@mui/material";
import EvidenceList from "./EvidenceList";

const formatGoannotation = goannotations => {
  const formattedEvidences = goannotations.map(func => {
    return {
      ...func,
      evidence: groupEvidences(func.evidence)
    };
  });

  const groupedGoannotation = formattedEvidences.reduce(
    (results, { evidence, total, name }) => {
      // find if a given db already exists
      const [database] = Object.keys(evidence);
      let existingEvidence = results.find(
        existing => existing.evidence[database]
      );

      // if notexists, create new functions
      if (!existingEvidence) {
        // create new function entry
        existingEvidence = {
          goannotations: [],
          evidence
        };

        results.push(existingEvidence);
      }

      // add function to list
      existingEvidence.goannotations.push({
        total,
        name
      });

      return results;
    },
    []
  );

  return groupedGoannotation;
};

const Goannotationlist = ({ goannotations }) => {
  if (!goannotations) {
    return <></>;
  }

  const formattedGoannotation = formatGoannotation(goannotations);

  return (
    <Grid container>
      {formattedGoannotation.map(group => (
        <>
          <Grid item size={{ xs: 9 }}>
            {group.goannotation.map(func => (
              <p>{func.annotation}</p>
            ))}
          </Grid>
          <Grid item size={{ xs: 3 }}>
            <EvidenceList evidences={group.evidence} />
          </Grid>
        </>
      ))}
    </Grid>
  );
  //   return <pre>{JSON.stringify(formattedGoannotation, null, 2)}</pre>;
};

export default Goannotationlist;
