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
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import routeConstants from "../../data/json/routeConstants";
import LineTooltip from "../tooltip/LineTooltip";
import CollapsibleText from "../CollapsibleText";
import EvidenceList from "../EvidenceList";
import { Link } from "react-router-dom";
import { groupEvidences, groupOrganismEvidences } from "../../data/data-format";
import ClientPaginatedTable from "../ClientPaginatedTable";
import Card from "react-bootstrap/Card";
import DetailTooltips from "../../data/json/siteDetailTooltips.json";
import HelpTooltip from "../tooltip/HelpTooltip";

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

const phosphorylationColumns = [
  {
    dataField: "evidence",
    text: proteinStrings.evidence.name,
    headerStyle: (colum, colIndex) => {
      return {
        // width: "15%",
      };
    },
    formatter: (cell, row) => {
      return <EvidenceList evidences={groupEvidences(cell)} />;
    },
  },
  {
    dataField: "kinase_uniprot_canonical_ac",
    text: proteinStrings.kinase_protein.name,
    sort: true,
    formatter: (value, row) =>
      value ? (
        <LineTooltip text="View protein details">
          <Link to={routeConstants.proteinDetail + row.kinase_uniprot_canonical_ac} target="_blank" rel="noopener noreferrer">
            {row.kinase_uniprot_canonical_ac}
          </Link>
        </LineTooltip>
      ) : (
        "No data available"
      ),
  },
  {
    dataField: "kinase_gene_name",
    text: proteinStrings.kinase_gene_name.name,
    sort: true,
    formatter: (value, row) => (value ? <>{row.kinase_gene_name}</> : "No data available"),
  },
  {
    dataField: "position",
    text: proteinStrings.residue.name,
    sort: true,
    formatter: (value, row) =>
      value ? (
        <span>
          {row.residue}
          {row.position}
        </span>
      ) : (
        "Not Reported"
      ),
  },
  {
    dataField: "comment",
    text: "Note",
    sort: true,
    headerStyle: (colum, colIndex) => {
      return {
        width: "20%",
      };
    },
    formatter: (value, row) => <CollapsibleText text={row.comment} lines={2} />,
  },
];

const mutationColumns = [
  {
    dataField: "evidence",
    text: proteinStrings.evidence.name,

    headerStyle: (colum, colIndex) => {
      return {
        backgroundColor: "#4B85B6",
        color: "white",
        width: "20%",
      };
    },
    formatter: (cell, row) => {
      return (
        <EvidenceList key={`ev_${row.ref_nt}_${row.chr_pos}`} evidences={groupEvidences(cell)} />
      );
    },
  },
  {
    dataField: "comment",
    text: "Filter Annotations",
    sort: true,
    headerStyle: (colum, colIndex) => {
      return {
        width: "20%",
      };
    },
    formatter: (value, row) => <CollapsibleText text={row.comment} lines={2} />,
  },
  {
    dataField: "chr_id",
    text: "Genomic Locus",
    sort: true,
    headerStyle: (colum, colIndex) => {
      return {
        backgroundColor: "#4B85B6",
        color: "white",
        width: "20%",
      };
    },
    formatter: (value, row) => (
      <>
        Chr{row.chr_id}:{row.chr_pos}
      </>
    ),
  },
  {
    dataField: "position",
    text: proteinStrings.position.name,
    sort: true,
    headerStyle: (colum, colIndex) => {
      return {
        backgroundColor: "#4B85B6",
        color: "white",
      };
    },
    formatter: (value, row) =>
      value ? (
        <span>
          {row.position}
        </span>
      ) : (
        "Not Reported"
      ),
  },
  {
    dataField: "sequence",
    text: stringConstants.sidebar.sequence.displayname,
    sort: true,
    headerStyle: (colum, colIndex) => {
      return {
        backgroundColor: "#4B85B6",
        color: "white",
      };
    },
    formatter: (value, row) => (
      <>
        {row.sequence_org} → {row.sequence_mut}
      </>
    ),
  },
  {
    dataField: "disease",
    text: stringConstants.sidebar.disease.displayname,
    style: { whiteSpace: "nowrap" },
    headerStyle: (column, colIndex) => {
      return {
        backgroundColor: "#4B85B6",
        color: "white",
        width: "25%",
      };
    },
    formatter: (value, row) => (
      <>
        {value && value.map((disease, index) => (
          <ul key={index} className="ps-3">
            <li key={disease.disease_id}>
              {disease.name}{" "}
              <span className="nowrap">
                (<a href={disease.url} target="_blank" rel="noopener noreferrer">{disease.disease_id}</a>){" "}
              </span>
            </li>
          </ul>
        ))}
      </>
    ),
  },
  {
    dataField: "minor_allelic_frequency",
    text: "MAF",
    sort: true,
    headerStyle: (colum, colIndex) => {
      return {
        backgroundColor: "#4B85B6",
        color: "white",
      };
    },
  },
];

const mutagenesisColumns = [
  {
    dataField: "evidence",
    text: proteinStrings.evidence.name,
    headerStyle: (colum, colIndex) => {
      return {
        width: "20%",
      };
    },
    formatter: (cell, row) => {
      return <EvidenceList evidences={groupEvidences(cell)} />;
    },
  },
  {
    dataField: "position",
    text: proteinStrings.position.name,
    sort: true,
    formatter: (value, row) =>
      value ? (
        <span>
          {row.position}
        </span>
      ) : (
        "Not Reported"
      ),
  },
  {
    dataField: "sequence",
    text: stringConstants.sidebar.sequence.displayname,
    sort: true,
    formatter: (value, row) => (
      <>
        {row.sequence_org && <span className="wrapword">{row.sequence_org}</span>}
        {!row.sequence_org && <span> (insertion)</span>}
        {row.sequence_org && row.sequence_mut && <> → </>}
        {row.sequence_mut && <>{row.sequence_mut}</>}
        {!row.sequence_mut && <span> (deletion)</span>}
      </>
    ),
  },
  {
    dataField: "comment",
    text: "Note",
    sort: true,
    headerStyle: (colum, colIndex) => {
      return {
        width: "35%",
      };
    },
    formatter: (value, row) => <CollapsibleText text={row.comment} lines={2} />,
  },
];

/**
 * Site Node display component.
 */
const SiteNodeDisplay = (props) => {
  const [detailData, setDetailData] = useState({});
  const [protDetailData, setProtDetailData] = useState({});
  const [dataStatus, setDataStatus] = useState("No Data Available.");
  const [glycosylation, setGlycosylation] = useState(undefined);
  const [glycosylationPredicted, setGlycosylationPredicted] = useState([]);
  const [glycosylationMining, setGlycosylationMining] = useState([]);
  const [glycosylationWithImage, setGlycosylationWithImage] = useState([]);
  const [glycosylationWithoutImage, setGlycosylationWithoutImage] = useState([]);

  useEffect(() => {
    if (props.nodeData === undefined)
      return
    let detailDataTemp = props.nodeData.details;
    let nodeData = props.nodeData;

    if (detailDataTemp.glycosylation  && detailDataTemp.glycosylation.length > 0) {
      const mapOfGlycosylationCategories = detailDataTemp.glycosylation.reduce((collection, item) => {
        const category = item.site_category;

        return {
          ...collection,
          [category]: [...(collection[category] || []), item],
        };
      }, {});

      const withImage = mapOfGlycosylationCategories.reported_with_glycan || [];
      const withoutImage = mapOfGlycosylationCategories.reported || [];
      const predicted = mapOfGlycosylationCategories.predicted || [];
      const mining = mapOfGlycosylationCategories.automatic_literature_mining || [];
      setGlycosylationWithImage(withImage);
      setGlycosylationWithoutImage(withoutImage);
      setGlycosylationPredicted(predicted);
      setGlycosylationMining(mining);
    }

    setDetailData(detailDataTemp)
    if (detailDataTemp.glycoprotein && detailDataTemp.glycoprotein.length > 0) {
      setProtDetailData(detailDataTemp.glycoprotein[0])
      setGlycosylation("Yes")
    } else if (props.nodeData.proteinData) {
      setProtDetailData(props.nodeData.proteinData)
    }

  }, [props.nodeType])

  const {
    chemical_mass,
    length,
    gene,
    gene_link,
    gene_name,
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
  } = protDetailData;

  const {
    start_pos,
    site_lbl,
    end_pos,
    glycans,
    snv,
    mutagenesis,
    phosphorylation,
    glycation
  } = detailData;

  const organismEvidence = groupOrganismEvidences(species);

  const glycoSylationColumns = [
    {
      dataField: "evidence",
      text: proteinStrings.evidence.name,

      headerStyle: (colum, colIndex) => {
        return {
          backgroundColor: "#4B85B6",
          color: "white",
          width: "25%",
        };
      },
      formatter: (cell, row) => {
        return (
          <EvidenceList key={row.start_pos + row.glytoucan_ac} evidences={groupEvidences(cell)} />
        );
      },
    },
    {
      dataField: "type",
      text: proteinStrings.type.name,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return {
          backgroundColor: "#4B85B6",
          color: "white",
        };
      },
    },
    {
      dataField: "glytoucan_ac",
      text: proteinStrings.glytoucan_ac.shortName,
      defaultSortField: "glytoucan_ac",
      sort: true,
      headerStyle: (column, colIndex) => {
        return {
          backgroundColor: "#4B85B6",
          color: "white",
          width: "15%",
        };
      },
      formatter: (value, row) => (
        <LineTooltip text="View glycan details">
          <Link to={routeConstants.glycanDetail + row.glytoucan_ac}>{row.glytoucan_ac}</Link>
        </LineTooltip>
      ),
    },
    {
      dataField: "image",
      text: glycanStrings.glycan_image.name,
      sort: false,
      formatter: (value, row) => (
        <div className="img-wrapper">
          <img className="img-cartoon" src={getGlycanImageUrl(row.glytoucan_ac)} alt="Glycan img" />
        </div>
      ),
      headerStyle: (colum, colIndex) => {
        return {
          textAlign: "left",
          backgroundColor: "#4B85B6",
          color: "white",
          whiteSpace: "nowrap",
        };
      },
    },
    {
      dataField: "start_pos",
      text: proteinStrings.residue.name,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return {
          backgroundColor: "#4B85B6",
          color: "white",
        };
      },
      formatter: (value, row) =>
        value ? (row.start_pos !== row.end_pos ? (
          <span>
            {row.start_aa}
            {row.start_pos}
            {" to "}
            {row.end_aa}
            {row.end_pos}
          </span>
        ) : (<LineTooltip text="View siteview details">
          <Link to={`${routeConstants.siteview}${uniprot_canonical_ac}/${row.start_pos}`}>
            {row.residue}
            {row.start_pos}
          </Link>
        </LineTooltip>)
        ) : (
          "Not Reported"
        ),
    },
    {
      dataField: "mining_tool_list",
      text: "Tool",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return {
          width: "20%",
        };
      },
      formatter:
        (value, row) =>
          value ?
            <ul className="ps-3">
              {value.map((tool, index) => (
                <li key={tool.label}>
                  {tool.url ?
                    <span className="nowrap">
                      <a href={tool.url} target="_blank" rel="noopener noreferrer">{tool.label}</a>
                    </span> :
                    <span className="nowrap">
                      {tool.label}
                    </span>}
                </li>
              ))}
            </ul>
            : (
              "Not Reported"
            ),
    },
    {
      dataField: "comment",
      text: "Note",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return {
          width: "20%",
        };
      },
      formatter: (value, row) => <CollapsibleText text={row.comment} lines={2} />,
    }
  ];

  return (
    <>
      <Dialog
        open={props.nodeType === "site"}
        classes={{
          paper: "alert-dialog",
        }}
        style={{ margin: 40 }}
        maxWidth={'lg'}
        disableScrollLock
        onClose={() => props.setNodeType("")}
      >
        {props.nodeType === "site" && <div className="gf-content-div">
          <h5 className="sups-dialog-title" style={{ width: '1000px' }}>{"Site : "} {start_pos !== end_pos ? start_pos + " - " + end_pos : site_lbl}</h5>
          <div
            style={{ paddingRight: 40, paddingLeft: 40, content: 'center', width: '1000px' }}
          >
            <p><span id='display'></span></p>
            <div style={{ padding: '20px', overflow: 'scroll', content: 'center', maxHeight: '500px', width: '920px' }}>

              <div>
                <div style={{ marginBottom: "5px" }}>
                  {/* general */}
                  <Card>
                    <Card.Header style={{ paddingTop: "12px", paddingBottom: "12px" }} className="panelHeadBgr">
                      <span className="gg-green d-inline">
                        <HelpTooltip
                          title={DetailTooltips.site.general.title}
                          text={DetailTooltips.site.general.text}
                          urlText={DetailTooltips.site.general.urlText}
                          url={DetailTooltips.site.general.url}
                          helpIcon="gg-helpicon-detail"
                        />
                      </span>
                      <h4 className="gg-green d-inline">
                        {stringConstants.sidebar.general.displayname}
                      </h4>
                    </Card.Header>
                    <Card.Body>
                      {site_lbl && site_lbl.length > 0 && (
                        <>
                          <span key={gene_name}>
                            <div>
                              <strong>{proteinStrings.residue.name}:</strong>{" "}
                              {start_pos !== end_pos ? (
                                <span>
                                  {start_pos}
                                  {" to "}
                                  {end_pos}
                                </span>
                              ) : (
                                <Link to={`${routeConstants.siteview}${uniprot_canonical_ac}/${start_pos}`} target="_blank" rel="noopener noreferrer">
                                  {site_lbl}
                                </Link>
                              )
                              }
                            </div>
                          </span>
                        </>
                      )}

                      {glycosylation && (
                        <>
                          <span key={gene_name}>
                            <div>
                              <strong>{"Glycosylation"}:</strong>{" "}
                              <span>
                                {glycosylation}
                              </span>
                            </div>
                          </span>
                        </>
                      )}

                      {gene_name && gene_name.length > 0 && (
                        <>
                          <span key={gene_name}>
                            <div>
                              <strong>{proteinStrings.gene_name.name}:</strong>{" "}
                              <a href={gene_link} target="_blank" rel="noopener noreferrer">
                                {gene_name}
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
                          {length && <div>
                            <strong>{proteinStrings.sequence_length.name}: </strong>
                            <a
                              href={`https://www.uniprot.org/uniprot/${uniprot_canonical_ac}/#sequences`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {length}
                            </a>
                          </div>}
                          {chemical_mass && <div>
                            <strong>{proteinStrings.chemical_mass.name}: </strong>
                            {addCommas(chemical_mass)} Da{" "}
                          </div>}
                        </>
                      )}
                      <div>
                        {tax_common_name &&
                          // For every organism object
                          // For every database for current organism object
                          <div>
                            <div>
                              <strong>{proteinStrings.organism.name}: </strong>
                              {tax_common_name}
                            </div>
                            <div>
                              <strong>{proteinStrings.reference_species.name}: </strong>
                              {tax_name} {"["}
                              {/* <LineTooltip text="View details on NCBI"> */}
                              <a
                                href={`https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=${tax_id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {tax_id}
                              </a>
                              {/* </LineTooltip> */}
                              {"]"}
                              {/* <EvidenceList evidences={organismEvidence[orgEvi].evidence} /> */}
                            </div>
                          </div>
                        }
                      </div>
                      <div>
                        <EvidenceList
                          evidences={groupEvidences(
                            evidence ? evidence : []
                          )}
                          inline={true}
                        />
                      </div>
                    </Card.Body>
                  </Card>
                </div>

                {/*  Glycosylation - Reported Sites with Glycan */}
                {glycosylationWithImage && glycosylationWithImage.length > 0 && (<div style={{ paddingTop: "20px" }}>
                  <Card>
                    <Card.Header style={{ paddingTop: "12px", paddingBottom: "12px" }} className="panelHeadBgr">
                      <span className="gg-green d-inline">
                        <HelpTooltip
                          title={DetailTooltips.site.glycosylation_with_glycans.title}
                          text={DetailTooltips.site.glycosylation_with_glycans.text}
                          urlText={DetailTooltips.site.glycosylation_with_glycans.urlText}
                          url={DetailTooltips.site.glycosylation_with_glycans.url}
                          helpIcon="gg-helpicon-detail"
                        />
                      </span>
                      <h4 className="gg-green d-inline">
                        {stringConstants.sidebar.glycosylation_with_glycans.displayname}
                      </h4>
                    </Card.Header>
                    <Card.Body>
                      <ClientPaginatedTable
                        data={glycosylationWithImage}
                        columns={glycoSylationColumns.filter(
                          (column) =>
                            column.dataField !== "mining_tool_list"
                        )}
                        defaultSortField="start_pos"
                        defaultSortOrder="asc"
                        viewPort={false}
                        title="Glycosylation - Reported Sites with Glycan"
                      />
                    </Card.Body>
                  </Card>
                </div>)}

                {/*  Glycosylation - Reported Sites */}
                {glycosylationWithoutImage && glycosylationWithoutImage.length > 0 && (<div style={{ paddingTop: "20px" }}>
                  <Card>
                    <Card.Header style={{ paddingTop: "12px", paddingBottom: "12px" }} className="panelHeadBgr">
                      <span className="gg-green d-inline">
                        <HelpTooltip
                          title={DetailTooltips.site.glycosylation_reported.title}
                          text={DetailTooltips.site.glycosylation_reported.text}
                          urlText={DetailTooltips.site.glycosylation_reported.urlText}
                          url={DetailTooltips.site.glycosylation_reported.url}
                          helpIcon="gg-helpicon-detail"
                        />
                      </span>
                      <h4 className="gg-green d-inline">
                        {stringConstants.sidebar.glycosylation_reported.displayname}
                      </h4>
                    </Card.Header>
                    <Card.Body>
                      <ClientPaginatedTable
                        data={glycosylationWithoutImage}
                        columns={glycoSylationColumns.filter(
                          (column) =>
                            column.dataField !== "image" &&
                            column.dataField !== "glytoucan_ac" &&
                            column.dataField !== "mining_tool_list"
                        )}
                        defaultSortField="start_pos"
                        defaultSortOrder="asc"
                        viewPort={false}
                        title="Glycosylation - Reported Sites"
                      />
                    </Card.Body>
                  </Card>
                </div>)}

                {/*  Glycosylation - Predicted Only */}
                {glycosylationPredicted && glycosylationPredicted.length > 0 && (<div style={{ paddingTop: "20px" }}>
                  <Card>
                    <Card.Header style={{ paddingTop: "12px", paddingBottom: "12px" }} className="panelHeadBgr">
                      <span className="gg-green d-inline">
                        <HelpTooltip
                          title={DetailTooltips.site.glycosylation_predicted.title}
                          text={DetailTooltips.site.glycosylation_predicted.text}
                          urlText={DetailTooltips.site.glycosylation_predicted.urlText}
                          url={DetailTooltips.site.glycosylation_predicted.url}
                          helpIcon="gg-helpicon-detail"
                        />
                      </span>
                      <h4 className="gg-green d-inline">
                        {stringConstants.sidebar.glycosylation_predicted.displayname}
                      </h4>
                    </Card.Header>
                    <Card.Body>
                      <ClientPaginatedTable
                        data={glycosylationPredicted}
                        columns={glycoSylationColumns.filter(
                          (column) =>
                            column.dataField !== "image" &&
                            column.dataField !== "glytoucan_ac" &&
                            column.dataField !== "mining_tool_list"
                        )}
                        defaultSortField="start_pos"
                        defaultSortOrder="asc"
                        viewPort={false}
                        title="Glycosylation - Predicted Only"
                      />
                    </Card.Body>
                  </Card>
                </div>)}

                {/*  Glycosylation - Text Mining */}
                {glycosylationMining && glycosylationMining.length > 0 && (<div style={{ paddingTop: "20px" }}>
                  <Card>
                    <Card.Header style={{ paddingTop: "12px", paddingBottom: "12px" }} className="panelHeadBgr">
                      <span className="gg-green d-inline">
                        <HelpTooltip
                          title={DetailTooltips.site.glycosylation_mining.title}
                          text={DetailTooltips.site.glycosylation_mining.text}
                          urlText={DetailTooltips.site.glycosylation_mining.urlText}
                          url={DetailTooltips.site.glycosylation_mining.url}
                          helpIcon="gg-helpicon-detail"
                        />
                      </span>
                      <h4 className="gg-green d-inline">
                        {stringConstants.sidebar.glycosylation_mining.displayname}
                      </h4>
                    </Card.Header>
                    <Card.Body>
                      <ClientPaginatedTable
                        data={glycosylationMining}
                        columns={glycoSylationColumns.filter(
                          (column) =>
                            column.dataField !== "image" &&
                            column.dataField !== "glytoucan_ac"
                        )}
                        defaultSortField="start_pos"
                        defaultSortOrder="asc"
                        viewPort={false}
                        title="Glycosylation - Text Mining"
                      />
                    </Card.Body>
                  </Card>
                </div>)}

                {/* Phosphorylation */}
                {phosphorylation && phosphorylation.length > 0 && <div style={{ paddingTop: "20px" }}>
                  <Card>
                    <Card.Header style={{ paddingTop: "12px", paddingBottom: "12px" }} className="panelHeadBgr">
                      <span className="gg-green d-inline">
                        <HelpTooltip
                          title={DetailTooltips.site.phosphorylation.title}
                          text={DetailTooltips.site.phosphorylation.text}
                          urlText={DetailTooltips.site.phosphorylation.urlText}
                          url={DetailTooltips.site.phosphorylation.url}
                          helpIcon="gg-helpicon-detail"
                        />
                      </span>
                      <h4 className="gg-green d-inline">
                        {stringConstants.sidebar.phosphorylation.displayname}
                      </h4>
                    </Card.Header>
                    <Card.Body>
                      <ClientPaginatedTable
                        data={phosphorylation}
                        columns={phosphorylationColumns}
                        viewPort={false}
                        title="Phosphorylation"
                      />
                    </Card.Body>
                  </Card>
                </div>}

                {/*  SNV (Single-Nucleotide-Variation)*/}
                {snv && snv.length > 0 && <div style={{ paddingTop: "20px" }}>
                  <Card>
                    <Card.Header style={{ paddingTop: "12px", paddingBottom: "12px" }} className="panelHeadBgr">
                      <span className="gg-green d-inline">
                        <HelpTooltip
                          title={DetailTooltips.site.snv.title}
                          text={DetailTooltips.site.snv.text}
                          urlText={DetailTooltips.site.snv.urlText}
                          url={DetailTooltips.site.snv.url}
                          helpIcon="gg-helpicon-detail"
                        />
                      </span>
                      <h4 className="gg-green d-inline">{stringConstants.sidebar.snv.displayname}</h4>
                    </Card.Header>
                    <Card.Body>
                      <ClientPaginatedTable
                        data={snv}
                        columns={mutationColumns}
                        viewPort={false}
                        title="Single Nucleotide Variation"
                      />
                    </Card.Body>
                  </Card>
                </div>}

                {/*  Mutagenesis */}
                {mutagenesis && mutagenesis.length > 0 && <div style={{ paddingTop: "20px" }}>
                  <Card>
                    <Card.Header style={{ paddingTop: "12px", paddingBottom: "12px" }} className="panelHeadBgr">
                      <span className="gg-green d-inline">
                        <HelpTooltip
                          title={DetailTooltips.site.mutagenesis.title}
                          text={DetailTooltips.site.mutagenesis.text}
                          urlText={DetailTooltips.site.mutagenesis.urlText}
                          url={DetailTooltips.site.mutagenesis.url}
                          helpIcon="gg-helpicon-detail"
                        />
                      </span>
                      <h4 className="gg-green d-inline">
                        {" "}
                        {stringConstants.sidebar.mutagenesis.displayname}
                      </h4>
                    </Card.Header>
                    <Card.Body>
                      <ClientPaginatedTable
                        data={mutagenesis}
                        columns={mutagenesisColumns}
                        viewPort={false}
                        title="Mutagenesis"
                      />
                    </Card.Body>
                  </Card>
                </div>}

              </div>
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

export default SiteNodeDisplay;

SiteNodeDisplay.propTypes = {
  nodeType: PropTypes.string,
};
