/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useReducer } from "react";
import { getGlycanDetail, getGlycanImageUrl } from "../data/glycan";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import Sidebar from "../components/navigation/Sidebar";
import Helmet from "react-helmet";
import { getTitle, getMeta } from "../utils/head";
import { Grid } from "@material-ui/core";
import { Col, Row, Image } from "react-bootstrap";
import { FiBookOpen } from "react-icons/fi";
import { groupEvidences, groupOrganismEvidences } from "../data/data-format";
import EvidenceList from "../components/EvidenceList";
import ClientPaginatedTable from "../components/ClientPaginatedTable";
import "../css/detail.css";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import DownloadButton from "../components/DownloadButton";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import Table from "react-bootstrap/Table";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import relatedGlycansIcon from "../images/icons/related-glycans-icon.svg";
import DetailTooltips from "../data/json/detailTooltips.json";
import HelpTooltip from "../components/tooltip/HelpTooltip";
import LineTooltip from "../components/tooltip/LineTooltip";
import FeedbackWidget from "../components/FeedbackWidget";
import ReactCopyClipboard from "../components/ReactCopyClipboard";
import routeConstants from "../data/json/routeConstants";
import { logActivity } from "../data/logging";
import PageLoader from "../components/load/PageLoader";
import DialogAlert from "../components/alert/DialogAlert";
import { axiosError } from "../data/axiosError";
import Button from "react-bootstrap/Button";
import stringConstants from "../data/json/stringConstants";
import { Link } from "react-router-dom";

const glycanStrings = stringConstants.glycan.common;
const proteinStrings = stringConstants.protein.common;
const motifStrings = stringConstants.motif.common;

const items = [
  { label: stringConstants.sidebar.general.displayname, id: "General" },
  { label: stringConstants.sidebar.organism.displayname, id: "Organism" },
  { label: stringConstants.sidebar.motifs.displayname, id: "Motifs" },
  {
    label: stringConstants.sidebar.associated_glycan.displayname,
    id: "Associated-Protein"
  },
  {
    label: stringConstants.sidebar.glycan_binding_protein.displayname,
    id: "Glycan-Binding-Protein"
  },
  {
    label: stringConstants.sidebar.bio_Enzymes.displayname,
    id: "Biosynthetic-Enzymes"
  },
  {
    label: stringConstants.sidebar.digital_seq.displayname,
    id: "Digital-Sequence"
  },
  {
    label: stringConstants.sidebar.cross_ref.displayname,
    id: "Cross-References"
  },
  { label: stringConstants.sidebar.publication.displayname, id: "Publications" }
];

const CompositionDisplay = props => {
  return (
    <>
      {props.composition.map(item => (
        <>
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
        </>
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

const getItemsCrossRef = data => {
  let itemscrossRef = [];

  //check data.
  if (data.crossref) {
    for (let crossrefitem of data.crossref) {
      let found = "";
      for (let databaseitem of itemscrossRef) {
        if (databaseitem.database === crossrefitem.database) {
          found = true;
          databaseitem.links.push({
            url: crossrefitem.url,
            id: crossrefitem.id
          });
        }
      }
      if (!found) {
        itemscrossRef.push({
          database: crossrefitem.database,
          links: [
            {
              url: crossrefitem.url,
              id: crossrefitem.id
            }
          ]
        });
      }
    }
  }
  return itemscrossRef;
};

const GlycanDetail = props => {
  let { id } = useParams();

  const [detailData, setDetailData] = useState({});
  const [itemsCrossRef, setItemsCrossRef] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [alertDialogInput, setAlertDialogInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { show: false, id: "" }
  );
  useEffect(() => {
    setPageLoading(true);
    logActivity("user", id);
    const getGlycanDetailData = getGlycanDetail(id);

    getGlycanDetailData.then(({ data }) => {
      if (data.code) {
        let message = "Glycan Detail api call";
        logActivity("user", id, "No results. " + message);
        setPageLoading(false);
      } else {
        setItemsCrossRef(getItemsCrossRef(data));

        setDetailData(data);
        setPageLoading(false);
      }

      setTimeout(() => {
        const anchorElement = props.history.location.hash;
        if (anchorElement && document.getElementById(anchorElement.substr(1))) {
          document
            .getElementById(anchorElement.substr(1))
            .scrollIntoView({ behavior: "auto" });
        }
      }, 500);
    });
    getGlycanDetailData.catch(({ response }) => {
      let message = "Glycan Detail api call";
      axiosError(response, id, message, setPageLoading, setAlertDialogInput);
    });
    // eslint-disable-next-line
  }, []);

  if (detailData.mass) {
    detailData.mass = addCommas(detailData.mass);
  }
  if (detailData.mass_pme) {
    detailData.mass_pme = addCommas(detailData.mass_pme);
  }
  if (detailData.glycoct) {
    detailData.glycoct = detailData.glycoct.replace(/ /g, "\r\n");
  }

  if (detailData.composition) {
    detailData.composition = detailData.composition
      .map((res, ind, arr) => {
        if (glycanStrings.composition[res.residue.toLowerCase()]) {
          res.name =
            glycanStrings.composition[res.residue.toLowerCase()].shortName;
          res.orderID =
            glycanStrings.composition[res.residue.toLowerCase()].orderID;
          return res;
        } else {
          let message = "New residue in Composition: " + res.residue;
          logActivity("error", id, message);
          res.name = res.residue;
          res.orderID =
            parseInt(glycanStrings.composition["other"].orderID) -
            (parseInt(arr.length) - parseInt(ind));
          return res;
        }
      })
      .sort(function(res1, res2) {
        return parseInt(res1.orderID) - parseInt(res2.orderID);
      });
  }
  const {
    mass,
    glytoucan,
    inchi_key,
    species,
    composition,
    motifs,
    iupac,
    glycam,
    smiles_isomeric,
    inchi,
    classification,
    glycoprotein,
    interactions,
    glycoct,
    publication,
    wurcs,
    enzyme,
    mass_pme,
    tool_support
  } = detailData;

  const organismEvidence = groupOrganismEvidences(species);

  const glycoProtienColumns = [
    {
      dataField: "evidence",
      text: proteinStrings.evidence.name,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white", width: "25%" };
      },
      formatter: (cell, row) => {
        return (
          <EvidenceList
            key={row.position + row.uniprot_canonical_ac}
            evidences={groupEvidences(cell)}
          />
        );
      }
    },
    {
      dataField: "protein_name",
      text: proteinStrings.Protein_ShortName.name,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white" };
      }
    },
    {
      dataField: "uniprot_canonical_ac",
      text: proteinStrings.uniprot_canonical_ac.name,
      defaultSortField: "uniprot_canonical_ac",
      sort: true,

      headerStyle: (column, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white", width: "15%" };
      },
      formatter: (value, row) => (
        <LineTooltip text="View protein details">
          <Link to={routeConstants.proteinDetail + row.uniprot_canonical_ac}>
            {row.uniprot_canonical_ac}
          </Link>
        </LineTooltip>
      )
    },

    {
      dataField: "position residue",
      text: proteinStrings.position.name,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white", width: "15%" };
      },
      formatter: (value, row) => (
        <>
          {row.residue}
          {row.position}
        </>
      )
    }
  ];
  const glycanBindingProteinColumns = [
    {
      dataField: "evidence",
      text: proteinStrings.evidence.name,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white", width: "25%" };
      },
      formatter: (cell, row) => {
        return (
          <EvidenceList
            key={row.interactor_id}
            evidences={groupEvidences(cell)}
          />
        );
      }
    },
    {
      dataField: "interactor_name",
      text: proteinStrings.protein_name.name,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white" };
      }
    },
    {
      dataField: "interactor_id",
      text: proteinStrings.uniprot_canonical_ac.name,
      defaultSortField: "interactor_id",
      sort: true,

      headerStyle: (column, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white", width: "15%" };
      },
      formatter: (value, row) => (
        <LineTooltip text="View protein details">
          <Link to={routeConstants.proteinDetail + row.interactor_id}>
            {row.interactor_id}
          </Link>
        </LineTooltip>
      )
    }
  ];
  const bioEnzymeColumns = [
    {
      dataField: "uniprot_canonical_ac",
      text: proteinStrings.uniprot_canonical_ac.name,
      sort: true,

      headerStyle: () => {
        return { backgroundColor: "#4B85B6", color: "white", width: "15%" };
      },
      formatter: (value, row) => (
        <LineTooltip text="View details">
          <Link to={routeConstants.proteinDetail + row.uniprot_canonical_ac}>
            {row.uniprot_canonical_ac}
          </Link>
        </LineTooltip>
      )
    },
    {
      dataField: "gene",
      text: proteinStrings.gene_name.name,
      defaultSortField: "gene",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white", width: "25%" };
      },

      formatter: (value, row) => (
        <LineTooltip text="View details on UniProt">
          <a href={row.gene_link} target="_blank" rel="noopener noreferrer">
            {value}
          </a>
        </LineTooltip>
      )
    },

    {
      dataField: "protein_name",
      text: proteinStrings.Protein_ShortName.name,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white" };
      }
    },

    {
      dataField: "tax_name",
      text: glycanStrings.organism.shortName,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white", width: "20%" };
      },
      formatter: (value, row) => (
        <>
          {row.tax_name} {"("}
          <span className="text-capitalize">{row.tax_common_name}</span>
          {")"}
        </>
      )
    }
  ];
  const motifColumns = [
    {
      dataField: "id",
      text: glycanStrings.glycan_image.name,
      sort: false,
      selected: true,
      formatter: (value, row) => (
        <div className="img-wrapper">
          <img
            className="img-cartoon"
            src={getGlycanImageUrl(row.id)}
            alt="Glycan img"
          />
        </div>
      ),
      headerStyle: (colum, colIndex) => {
        return {
          textAlign: "left",
          backgroundColor: "#4B85B6",
          color: "white",
          whiteSpace: "nowrap"
        };
      }
    },
    {
      dataField: "id",
      text: motifStrings.motif_id.name,
      sort: true,

      headerStyle: () => {
        return { backgroundColor: "#4B85B6", color: "white" };
      },
      formatter: (value, row) => (
        <LineTooltip text="View details">
          <Link to={routeConstants.motifDetail + row.id}>{row.id}</Link>
        </LineTooltip>
      )
    },
    {
      dataField: "name",
      text: motifStrings.motif_name.name,
      defaultSortField: "name",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white" };
      },
      formatter: (value, row) => (
        <LineTooltip text="View details">
          <Link to={routeConstants.motifDetail + row.id}>{row.name}</Link>
        </LineTooltip>
      )
    }
  ];
  // ==================================== //
  /**
   * Adding toggle collapse arrow icon to card header individualy.
   * @param {object} glytoucan_ac- glytoucan accession ID.
   **/
  const [collapsed, setCollapsed] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      general: true,
      organism: true,
      motif: true,
      glycoprotein: true,
      glycanBindingProtein: true,
      bioEnzyme: true,
      digitalSeq: true,
      crossref: true,
      publication: true
    }
  );

  function toggleCollapse(name, value) {
    setCollapsed({ [name]: !value });
  }
  const expandIcon = <ExpandMoreIcon fontSize="large" />;
  const closeIcon = <ExpandLessIcon fontSize="large" />;
  // ===================================== //

  /**
   * Redirect and opens glytoucan_ac in a subsumption browser
   * @param {object} glytoucan_ac- glytoucan accession ID.
   **/
  function handleOpenSubsumptionBrowse(glytoucan_ac) {
    var url =
      //"https://raw.githack.com/glygen-glycan-data/GNOme/GlyGen_DEV/restrictions/GNOme_GlyGen.browser.html?focus=" +
      "http://gnome.glyomics.org/restrictions/GlyGen.StructureBrowser.html?focus=" +
      glytoucan_ac;
    window.open(url);
  }

  return (
    <>
      <Row className="gg-baseline">
        <Col sm={12} md={12} lg={12} xl={3} className="sidebar-col">
          <Sidebar items={items} />
        </Col>

        <Col sm={12} md={12} lg={12} xl={9} className="sidebar-page">
          <div className="sidebar-page-mb">
            <div className="content-box-md">
              <Row>
                <Grid item xs={12} sm={12} className="text-center">
                  <div className="horizontal-heading">
                    <h5>Look At</h5>
                    <h2>
                      {" "}
                      <span>
                        Details for Glycan
                        <strong>
                          {glytoucan && glytoucan.glytoucan_ac && (
                            <> {glytoucan.glytoucan_ac}</>
                          )}
                        </strong>
                      </span>
                    </h2>
                  </div>
                </Grid>
              </Row>
            </div>
            <div className="gg-download-btn-width">
              <DownloadButton
                types={[
                  {
                    display: stringConstants.download.glycan_image.displayname,
                    type: "png",
                    data: "glycan_image"
                  },
                  {
                    display:
                      stringConstants.download.glycan_jsondata.displayname,
                    type: "json",
                    data: "glycan_detail"
                  }
                ]}
                dataType="glycan_detail"
                dataId={id}
              />
            </div>
            <React.Fragment>
              <Helmet>
                {getTitle("glycanDetail", {
                  glytoucan_ac:
                    glytoucan && glytoucan.glytoucan_ac
                      ? glytoucan.glytoucan_ac
                      : ""
                })}
                {getMeta("glycanDetail")}
              </Helmet>
              <FeedbackWidget />
              <PageLoader pageLoading={pageLoading} />
              <DialogAlert
                alertInput={alertDialogInput}
                setOpen={input => {
                  setAlertDialogInput({ show: input });
                }}
              />
              {/* general */}
              <Accordion
                id="General"
                defaultActiveKey="0"
                className="panel-width"
                style={{ padding: "20px 0" }}
              >
                <Card>
                  <Card.Header className="panelHeadBgr">
                    <span className="gg-green d-inline">
                      <HelpTooltip
                        title={DetailTooltips.glycan.general.title}
                        text={DetailTooltips.glycan.general.text}
                        urlText={DetailTooltips.glycan.general.urlText}
                        url={DetailTooltips.glycan.general.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">
                      {stringConstants.sidebar.general.displayname}
                    </h4>
                    <div className="float-right">
                      <span>
                        <Button
                          type="button"
                          className="gg-btn-blue"
                          disabled={
                            tool_support && tool_support.gnome === "yes"
                              ? false
                              : true
                          }
                          onClick={() => {
                            handleOpenSubsumptionBrowse(
                              glytoucan && glytoucan.glytoucan_ac
                            );
                          }}
                        >
                          <span>
                            <Image
                              className="pr-2"
                              src={relatedGlycansIcon}
                              alt="Related glycans"
                            />
                          </span>
                          Related Glycans
                        </Button>
                      </span>
                      {/* <span className="pr-3">
												<a
													// eslint-disable-next-line
													href="javascript:void(0)"
													onClick={() => {
														handleOpenSubsumptionBrowse(
															glytoucan && glytoucan.glytoucan_ac
														);
													}}>
													<LineTooltip text="Related glycans">
														<Image
															src={relatedGlycansIcon}
															alt="Related glycans"
														/>
													</LineTooltip>
												</a>
											</span> */}
                      <Accordion.Toggle
                        eventKey="0"
                        onClick={() =>
                          toggleCollapse("general", collapsed.general)
                        }
                        className="gg-green arrow-btn"
                      >
                        <span>
                          {collapsed.general ? closeIcon : expandIcon}
                        </span>
                      </Accordion.Toggle>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      <p>
                        {glytoucan && glytoucan.glytoucan_ac && (
                          <>
                            <p>
                              <img
                                className="img-cartoon"
                                src={getGlycanImageUrl(glytoucan.glytoucan_ac)}
                                alt="Glycan img"
                              />
                            </p>
                            <div>
                              <strong>
                                {proteinStrings.glytoucan_ac.shortName}:{" "}
                              </strong>
                              <a
                                href={glytoucan.glytoucan_url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {glytoucan.glytoucan_ac}
                              </a>
                            </div>

                            <div>
                              {mass ? (
                                <>
                                  <strong>
                                    {" "}
                                    {glycanStrings.mass.shortName}:{" "}
                                  </strong>
                                  {mass} Da{" "}
                                </>
                              ) : (
                                <p> </p>
                              )}
                            </div>
                            <div>
                              {mass_pme ? (
                                <>
                                  <strong>
                                    {" "}
                                    {glycanStrings.mass_pme.shortName}:{" "}
                                  </strong>
                                  {mass_pme} Da{" "}
                                </>
                              ) : (
                                <p> </p>
                              )}
                            </div>
                          </>
                        )}
                        {composition && (
                          <div>
                            <strong>Composition</strong>:{" "}
                            <CompositionDisplay composition={composition} />
                          </div>
                        )}

                        {classification && classification.length && (
                          <div>
                            <strong>
                              {glycanStrings.glycan_type.name} /{" "}
                              {glycanStrings.glycan_subtype.name}:{" "}
                            </strong>

                            {classification.map(Formatclassification => (
                              <>
                                <a
                                  href={Formatclassification.type.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {Formatclassification.type.name}
                                </a>
                                &nbsp; <b>/</b> &nbsp;
                                <a
                                  href={Formatclassification.subtype.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {Formatclassification.subtype.name}
                                </a>
                              </>
                            ))}
                          </div>
                        )}
                        {inchi_key && inchi_key.key && (
                          <>
                            <div>
                              <strong>{glycanStrings.inchi_key.name}: </strong>
                              <a
                                href={inchi_key.url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {inchi_key.key}
                              </a>
                            </div>
                          </>
                        )}
                      </p>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
              {/*  species */}
              <Accordion
                id="Organism"
                defaultActiveKey="0"
                className="panel-width"
                style={{ padding: "20px 0" }}
              >
                <Card>
                  <Card.Header className="panelHeadBgr">
                    <span className="gg-green d-inline">
                      <HelpTooltip
                        title={DetailTooltips.glycan.organism.title}
                        text={DetailTooltips.glycan.organism.text}
                        urlText={DetailTooltips.glycan.organism.urlText}
                        url={DetailTooltips.glycan.organism.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">
                      {stringConstants.sidebar.organism.displayname}
                    </h4>
                    <div className="float-right">
                      <Accordion.Toggle
                        eventKey="0"
                        onClick={() =>
                          toggleCollapse("organism", collapsed.organism)
                        }
                        className="gg-green arrow-btn"
                      >
                        <span>
                          {collapsed.organism ? closeIcon : expandIcon}
                        </span>
                      </Accordion.Toggle>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      <Row>
                        {organismEvidence &&
                          // For every organism object
                          Object.keys(organismEvidence).map(orgEvi => (
                            // For every database for current organism object
                            <Col
                              xs={12}
                              sm={12}
                              md={4}
                              lg={4}
                              xl={4}
                              style={{ marginBottom: "10px" }}
                            >
                              <>
                                <strong>{orgEvi}</strong> {"("}
                                <span className="text-capitalize">
                                  {organismEvidence[orgEvi].common_name}
                                </span>
                                {")"} {"["}
                                <LineTooltip text="View details on NCBI">
                                  <a
                                    href={`https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=${organismEvidence[orgEvi].taxid}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {organismEvidence[orgEvi].taxid}
                                  </a>
                                </LineTooltip>
                                {"]"}
                                <EvidenceList
                                  evidences={organismEvidence[orgEvi].evidence}
                                />
                              </>
                            </Col>
                          ))}
                        {!species && (
                          <p className="no-data-msg">No data available.</p>
                        )}
                      </Row>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
              {/* Motif */}
              <Accordion
                id="Motifs"
                defaultActiveKey="0"
                className="panel-width"
                style={{ padding: "20px 0" }}
              >
                <Card>
                  <Card.Header className="panelHeadBgr">
                    <span className="gg-green d-inline">
                      <HelpTooltip
                        title={DetailTooltips.glycan.motif.title}
                        text={DetailTooltips.glycan.motif.text}
                        urlText={DetailTooltips.glycan.motif.urlText}
                        url={DetailTooltips.glycan.motif.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">
                      {stringConstants.sidebar.motifs.displayname}
                    </h4>
                    <div className="float-right">
                      <Accordion.Toggle
                        eventKey="0"
                        onClick={() => toggleCollapse("motif", collapsed.motif)}
                        className="gg-green arrow-btn"
                      >
                        <span>{collapsed.motif ? closeIcon : expandIcon}</span>
                      </Accordion.Toggle>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      {motifs && motifs.length !== 0 && (
                        <ClientPaginatedTable
                          data={motifs}
                          columns={motifColumns}
                          defaultSortField={"name"}
                          onClickTarget={"#motif"}
                        />
                      )}
                      {!motifs && <p>No data available.</p>}
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
              {/* Associated-Protein */}
              <Accordion
                id="Associated-Protein"
                defaultActiveKey="0"
                className="panel-width"
                style={{ padding: "20px 0" }}
              >
                <Card>
                  <Card.Header className="panelHeadBgr">
                    <span className="gg-green d-inline">
                      <HelpTooltip
                        title={DetailTooltips.glycan.glycoproteins.title}
                        text={DetailTooltips.glycan.glycoproteins.text}
                        urlText={DetailTooltips.glycan.glycoproteins.urlText}
                        url={DetailTooltips.glycan.glycoproteins.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">
                      {stringConstants.sidebar.associated_glycan.displayname}
                    </h4>
                    <div className="float-right">
                      <Accordion.Toggle
                        eventKey="0"
                        onClick={() =>
                          toggleCollapse("glycoprotein", collapsed.glycoprotein)
                        }
                        className="gg-green arrow-btn"
                      >
                        <span>
                          {collapsed.glycoprotein ? closeIcon : expandIcon}
                        </span>
                      </Accordion.Toggle>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      {glycoprotein && glycoprotein.length !== 0 && (
                        <ClientPaginatedTable
                          data={glycoprotein}
                          columns={glycoProtienColumns}
                          defaultSortField={"uniprot_canonical_ac"}
                          onClickTarget={"#glycoprotein"}
                        />
                      )}
                      {!glycoprotein && <p>No data available.</p>}
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
              {/* Glycan Binding Protein */}
              <Accordion
                id="Glycan-Binding-Protein"
                defaultActiveKey="0"
                className="panel-width"
                style={{ padding: "20px 0" }}
              >
                <Card>
                  <Card.Header className="panelHeadBgr">
                    <span className="gg-green d-inline">
                      <HelpTooltip
                        title={
                          DetailTooltips.glycan.glycan_binding_protein.title
                        }
                        text={DetailTooltips.glycan.glycan_binding_protein.text}
                        urlText={
                          DetailTooltips.glycan.glycan_binding_protein.urlText
                        }
                        url={DetailTooltips.glycan.glycan_binding_protein.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">
                      {
                        stringConstants.sidebar.glycan_binding_protein
                          .displayname
                      }
                    </h4>
                    <div className="float-right">
                      <Accordion.Toggle
                        eventKey="0"
                        onClick={() =>
                          toggleCollapse(
                            "glycanBindingProtein",
                            collapsed.glycanBindingProtein
                          )
                        }
                        className="gg-green arrow-btn"
                      >
                        <span>
                          {collapsed.glycanBindingProtein
                            ? closeIcon
                            : expandIcon}
                        </span>
                      </Accordion.Toggle>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      {interactions && interactions.length !== 0 && (
                        <ClientPaginatedTable
                          data={interactions}
                          columns={glycanBindingProteinColumns}
                          defaultSortField={"interactor_id"}
                          onClickTarget={"#glycanBindingProtein"}
                        />
                      )}
                      {!interactions && <p>No data available.</p>}
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
              {/* Biosynthetic Enzymes */}
              <Accordion
                id="Biosynthetic-Enzymes"
                defaultActiveKey="0"
                className="panel-width"
                style={{ padding: "20px 0" }}
              >
                <Card>
                  <Card.Header className="panelHeadBgr">
                    <span className="gg-green d-inline">
                      <HelpTooltip
                        title={DetailTooltips.glycan.biosyntheticEnzyme.title}
                        text={DetailTooltips.glycan.biosyntheticEnzyme.text}
                        urlText={
                          DetailTooltips.glycan.biosyntheticEnzyme.urlText
                        }
                        url={DetailTooltips.glycan.biosyntheticEnzyme.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">
                      {stringConstants.sidebar.bio_Enzymes.displayname}
                    </h4>
                    <div className="float-right">
                      <Accordion.Toggle
                        eventKey="0"
                        onClick={() =>
                          toggleCollapse("bioEnzyme", collapsed.bioEnzyme)
                        }
                        className="gg-green arrow-btn"
                      >
                        <span>
                          {collapsed.bioEnzyme ? closeIcon : expandIcon}
                        </span>
                      </Accordion.Toggle>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      {enzyme && enzyme.length !== 0 && (
                        <ClientPaginatedTable
                          data={enzyme}
                          columns={bioEnzymeColumns}
                          defaultSortField={"gene"}
                          onClickTarget={"#biosyntheticenzymes"}
                        />
                      )}
                      {!enzyme && <p>No data available.</p>}
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
              {/* Digital Sequence */}
              <Accordion
                id="Digital-Sequence"
                defaultActiveKey="0"
                className="panel-width"
                style={{ padding: "20px 0" }}
              >
                <Card>
                  <Card.Header className="panelHeadBgr">
                    <span className="gg-green d-inline">
                      <HelpTooltip
                        title={DetailTooltips.glycan.digitalSequence.title}
                        text={DetailTooltips.glycan.digitalSequence.text}
                        urlText={DetailTooltips.glycan.digitalSequence.urlText}
                        url={DetailTooltips.glycan.digitalSequence.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">
                      {stringConstants.sidebar.digital_seq.displayname}
                    </h4>
                    <div className="float-right">
                      <Accordion.Toggle
                        eventKey="0"
                        onClick={() =>
                          toggleCollapse("digitalSeq", collapsed.digitalSeq)
                        }
                        className="gg-green arrow-btn"
                      >
                        <span>
                          {collapsed.digitalSeq ? closeIcon : expandIcon}
                        </span>
                      </Accordion.Toggle>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body className="text-responsive">
                      <p>
                        {iupac ? (
                          <>
                            <Row>
                              <Col xs={6} sm={6}>
                                {" "}
                                <strong>{glycanStrings.iupac.name}</strong>
                              </Col>{" "}
                              <Col xs={6} sm={6} style={{ textAlign: "right" }}>
                                <ReactCopyClipboard value={iupac} />
                              </Col>
                            </Row>
                            <p className="text-overflow">{iupac} </p>
                          </>
                        ) : (
                          <p> </p>
                        )}

                        {wurcs ? (
                          <>
                            <Row>
                              <Col xs={6} sm={6}>
                                {" "}
                                <strong>{glycanStrings.WURCS.name}</strong>
                              </Col>{" "}
                              <Col xs={6} sm={6} style={{ textAlign: "right" }}>
                                <ReactCopyClipboard value={wurcs} />
                              </Col>
                            </Row>
                            <p className="text-overflow">{wurcs} </p>
                          </>
                        ) : (
                          <p> </p>
                        )}

                        {glycoct ? (
                          <>
                            <Row>
                              <Col xs={6} sm={6}>
                                {" "}
                                <strong>{glycanStrings.GlycoCT.name}</strong>
                              </Col>{" "}
                              <Col xs={6} sm={6} style={{ textAlign: "right" }}>
                                <ReactCopyClipboard value={glycoct} />
                              </Col>
                            </Row>
                            <p id="text_element" className="text-overflow">
                              {glycoct}
                            </p>
                          </>
                        ) : (
                          <p></p>
                        )}

                        {inchi ? (
                          <>
                            <Row>
                              <Col xs={6} sm={6}>
                                <strong>
                                  {glycanStrings.inchi_key.shortName}
                                </strong>
                              </Col>
                              <Col xs={6} sm={6} style={{ textAlign: "right" }}>
                                <ReactCopyClipboard value={inchi} />
                              </Col>
                            </Row>
                            <p className="text-overflow">{inchi}</p>
                          </>
                        ) : (
                          <p></p>
                        )}

                        {glycam ? (
                          <>
                            <Row>
                              <Col xs={6} sm={6}>
                                <strong>
                                  {glycanStrings.GLYCAM_IUPAC.shortName}
                                </strong>
                              </Col>
                              <Col xs={6} sm={6} style={{ textAlign: "right" }}>
                                <ReactCopyClipboard value={glycam} />
                              </Col>
                            </Row>
                            <p className="text-overflow">{glycam}</p>
                          </>
                        ) : (
                          <p></p>
                        )}

                        {smiles_isomeric ? (
                          <>
                            <Row>
                              <Col xs={6} sm={6}>
                                <strong>
                                  {glycanStrings.Isomeric_SMILES.shortName}
                                </strong>
                              </Col>
                              <Col xs={6} sm={6} style={{ textAlign: "right" }}>
                                <ReactCopyClipboard value={smiles_isomeric} />
                              </Col>
                            </Row>
                            <p className="text-overflow">{smiles_isomeric}</p>
                          </>
                        ) : (
                          <p></p>
                        )}
                      </p>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
              {/* Cross References */}
              <Accordion
                id="Cross-References"
                defaultActiveKey="0"
                className="panel-width"
                style={{ padding: "20px 0" }}
              >
                <Card>
                  <Card.Header className="panelHeadBgr">
                    <span className="gg-green d-inline">
                      <HelpTooltip
                        title={DetailTooltips.glycan.crossReferences.title}
                        text={DetailTooltips.glycan.crossReferences.text}
                        urlText={DetailTooltips.glycan.crossReferences.urlText}
                        url={DetailTooltips.glycan.crossReferences.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">
                      {stringConstants.sidebar.cross_ref.displayname}
                    </h4>
                    <div className="float-right">
                      <Accordion.Toggle
                        eventKey="0"
                        onClick={() =>
                          toggleCollapse("crossref", collapsed.crossref)
                        }
                        className="gg-green arrow-btn"
                      >
                        <span>
                          {collapsed.crossref ? closeIcon : expandIcon}
                        </span>
                      </Accordion.Toggle>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      {itemsCrossRef && itemsCrossRef.length ? (
                        <p>
                          <ul className="list-style-none">
                            {/* <Row> */}
                            {itemsCrossRef.map(crossRef => (
                              <li>
                                {/* <Col> */}
                                <strong>{crossRef.database}:</strong>
                                <ul>
                                  <Row>
                                    {crossRef.links.map(link => (
                                      <Col xs={12} sm={4}>
                                        <li>
                                          <a
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            {link.id}
                                          </a>
                                        </li>
                                      </Col>
                                    ))}
                                  </Row>
                                </ul>
                              </li>
                            ))}
                          </ul>
                        </p>
                      ) : (
                        <p>No data available.</p>
                      )}
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
              {/* publication */}
              <Accordion
                id="Publications"
                defaultActiveKey="0"
                className="panel-width"
                style={{ padding: "20px 0" }}
              >
                <Card>
                  <Card.Header className="panelHeadBgr">
                    <span className="gg-green d-inline">
                      <HelpTooltip
                        title={DetailTooltips.motif.publications.title}
                        text={DetailTooltips.motif.publications.text}
                        urlText={DetailTooltips.motif.publications.urlText}
                        url={DetailTooltips.motif.publications.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">
                      {stringConstants.sidebar.publication.displayname}
                    </h4>
                    <div className="float-right">
                      <Accordion.Toggle
                        // as={Card.Header}
                        eventKey="0"
                        onClick={() =>
                          toggleCollapse("publication", collapsed.publication)
                        }
                        className="gg-green arrow-btn"
                      >
                        <span>
                          {collapsed.publication ? closeIcon : expandIcon}
                        </span>
                      </Accordion.Toggle>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0" out={!collapsed.publication}>
                    <Card.Body className="card-padding-zero">
                      <Table hover fluid>
                        {publication && (
                          <tbody className="table-body">
                            {publication.map((pub, pubIndex) => (
                              <tr className="table-row">
                                <td key={pubIndex}>
                                  <p>
                                    <div>
                                      <h5 style={{ marginBottom: "3px" }}>
                                        <strong>{pub.title}</strong>
                                      </h5>
                                    </div>
                                    <div>{pub.authors}</div>
                                    <div>
                                      {pub.journal} <span>&nbsp;</span>(
                                      {pub.date})
                                    </div>
                                    <div>
                                      {pub.reference.map(ref => (
                                        <>
                                          <FiBookOpen />
                                          <span style={{ paddingLeft: "15px" }}>
                                            {glycanStrings.pmid.shortName}:
                                            {/* {glycanStrings.referenceType[ref.type].shortName}: */}
                                          </span>{" "}
                                          <a
                                            href={ref.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            <>{ref.id}</>
                                          </a>
                                        </>
                                      ))}
                                    </div>
                                    <EvidenceList
                                      inline={true}
                                      evidences={groupEvidences(pub.evidence)}
                                    />
                                  </p>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        )}
                        {!publication && (
                          <p className="no-data-msg-publication">
                            No data available.
                          </p>
                        )}
                      </Table>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
            </React.Fragment>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default GlycanDetail;