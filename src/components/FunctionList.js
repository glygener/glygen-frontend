import React from "react";
import { groupEvidences } from "../data/data-format";
import EvidenceList from "./EvidenceList";
import Table from "react-bootstrap/Table";

const formatFunctions = (functions) => {
   let functionArray = [];
   for (let i = 0; i < functions.length; i++){
        let existingFunction = functionArray.find((existing) => existing.annotation === functions[i].annotation);

        // if notexists, create new function object
        if (!existingFunction) {
          // create new function entry
          functionArray.push(functions[i]);
        } else {
          functionArray = functionArray.filter((existing) => existing.annotation !== functions[i].annotation);
          let temp = [].concat(existingFunction.evidence, functions[i].evidence);
          existingFunction.evidence = temp.reduce((results, evidence) => {
            let existingEvidence = results.find((existing) => existing.id === evidence.id);

            // if notexists, create new evidence
            if (!existingEvidence) {
              let eved = {
                id: evidence.id,
                url: evidence.url,
                database: evidence.database
              };
      
              results.push(eved);
            }
          
            return results;
          }, []);
          functionArray.push(existingFunction);
        }
   }

  const formattedEvidences = functionArray.map((func) => {
    return {
      ...func,
      evidence: groupEvidences(func.evidence),
    };
  });

  const groupedFunctions = formattedEvidences.reduce((results, { evidence, url, annotation }) => {
    // find if a given db already exists
    const databaseArr = Object.keys(evidence);

    for (let i = 0; i < databaseArr.length; i++){
      let database = databaseArr[i];
      //alert(database)
      let existingEvidence = results.find((existing) => existing.evidence[database]);

      // if notexists, create new functions
      if (!existingEvidence) {
        // create new function entry
        existingEvidence = {
          functions: [],
          evidence: {[database]:[]},
        };

        results.push(existingEvidence);
      }
      let tempExEvidence = existingEvidence.evidence[database].map(eve => eve.id);
      let tempEvidence = evidence[database].filter((existing) => !tempExEvidence.includes(existing.id));
      
      existingEvidence.evidence[database].push(...tempEvidence);
      // add function to list
      existingEvidence.functions.push({
        url,
        annotation,
      });
    }
    return results;
  }, []);

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
    <Table hover fluid="true">
      {formattedFunctions.map((group, funIndex) => (
        <tbody key={"body" + funIndex} className="table-body">
          <tr className="table-row">
            <td key={funIndex}>
              {group.functions.map((func, index) => (
                <p key={index}>{func.annotation}</p>
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
