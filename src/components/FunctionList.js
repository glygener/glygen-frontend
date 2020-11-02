import React from "react";
import { groupEvidences } from "../data/data-format";
import { Grid } from "@material-ui/core";
import EvidenceList from "./EvidenceList";
import Table from "react-bootstrap/Table";

const formatFunctions = functions => {
  const formattedEvidences = functions.map(func => {
    return {
      ...func,
      evidence: groupEvidences(func.evidence)
    };
  });

  const groupedFunctions = formattedEvidences.reduce(
    (results, { evidence, url, annotation }) => {
      // find if a given db already exists
      const [database] = Object.keys(evidence);
      let existingEvidence = results.find(
        existing => existing.evidence[database]
      );

      // if notexists, create new functions
      if (!existingEvidence) {
        // create new function entry
        existingEvidence = {
          functions: [],
          evidence
        };

        results.push(existingEvidence);
      }

      // add function to list
      existingEvidence.functions.push({
        url,
        annotation
      });

      return results;
    },
    []
  );

  return groupedFunctions;
};

const FunctionList = ({ functions }) => {
  if (!functions) {
    return <></>;
  }

  const formattedFunctions = formatFunctions(functions);

  formattedFunctions.sort((a, b) => {
    const keyA = Object.keys(a.evidence)[0];
    const keyB = Object.keys(b.evidence)[0];

    if (keyA === "UniProtKB") return -1;
    if (keyB === "UniProtKB") return 1;
    if (keyA < keyB) return -1;
    if (keyA > keyB) return 1;
    return 0;
  });

  return (
    <Table hover fluid>
      {formattedFunctions.map((group, funIndex) => (
        <tbody className="table-body">
          <tr className="table-row">
            <td key={funIndex}>
              {group.functions.map(func => (
                <p>{func.annotation}</p>
              ))}
              <EvidenceList evidences={group.evidence} />
            </td>
          </tr>
        </tbody>
      ))}
    </Table>
  );
  //   return <pre>{JSON.stringify(formattedFunctions, null, 2)}</pre>;
};

export default FunctionList;
