import React, { useState } from "react";
import { Button, Link } from "@material-ui/core";
import PropTypes from "prop-types";

function databasecolor(name) {
  switch (name.toLowerCase()) {
    case "glycomedb":
      return "#a06868";
    case "glytoucan":
      return "#ff6464";
    case "unicarbkb":
      return "#6b7f71";
    case "uniprotkb":
      return "#4b8aa0";
    case "pubmed":
      return "#51B0A5";
    case "refseq":
      return "#3ea2ad";
    case "ensembl peptide":
      return "#936caf";
    case "ensembl transcript":
      return "#b971a6";
    case "ensembl gene":
      return "#468FE0";
    case "omim":
      return "#8d85fa";
    case "biomuta":
      return "#7975af";
    case "bgee":
      return "#798bae";
    case "bioxpress":
      return "#7f989a";
    case "mgi":
      return "#ff8080";
    case "hgnc":
      return "#518a8a";
    case "homologene":
      return "#9a039a";
    case "oma":
      return "#7FB97A";
    case "mgi_homologset":
      return "#e8a2e8";
    case "mondo":
      return "#be9fe1";
    case "genomics england":
      return "#8ac6d1";
    case "glyconnect":
      return "#fcba03";
    case "mim":
      return "#BF8181";
    case "dbsnp":
      return "#FFC47F";
    case "gnome":
      return "#029AEC";
    case "exac":
      return "#ff9a76";
    case "topmed":
      return "#e97171";
    case "gnomad":
      return "#AF5A62";
    case "matrixdb":
      return "#64958f";
    case "glygen":
      return "#2F78B7";
    case "automatic literature mining":
      return "#649093";
    case "uniref":
      return "#358C92";
    case "rcsb pdb":
      return "#7e8a97";
    case "pro":
      return "#7e4f10";
  }
  return "#9033ff";
}
// 9d65c9
const GlygenBadge = props => {
  const [showExpandList, setShowExpandList] = useState(false);

  const { text } = props;

  return (
    <div className="badge-div">
      <Button
        className="badge-button"
        style={{
          backgroundColor: databasecolor(text),
          color: "white"
        }}
        onClick={() => setShowExpandList(!showExpandList)}
      >
        {text}
        &nbsp;<span className="badge-count">
          {props.expandList.length}
        </span>{" "}
        {/* <Badge variant="light">{props.expandList.length}</Badge> */}
        {/* <Badge color="primary" badgeContent={props.expandList.length}></Badge> */}
      </Button>
      {showExpandList && (
        <ul style={{ listStyle: "none", padding: "5px", margin: "0" }}>
          {props.expandList.map((value, index) => (
            <li key={index}>
              <Link href={value.url} target="_blank" rel="noopener noreferrer">
                {value.id}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

GlygenBadge.propTypes = {
  text: PropTypes.string,
  expandList: PropTypes.array,
  color: PropTypes.array
};

export default GlygenBadge;
