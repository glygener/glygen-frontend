import React from "react";

import GlygenBadge from "./GlygenBadge";

const EvidenceList = props => {
  const { evidences } = props;

  return (
    <span>
      {Object.keys(evidences).map((db, index) => (
        <GlygenBadge key={index} text={db} expandList={evidences[db]} />
      ))}
    </span>
  );
};

export default EvidenceList;
