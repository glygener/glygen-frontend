import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import stringConstants from "../data/json/stringConstants";
import { Row, Col } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import LineTooltip from "../components/tooltip/LineTooltip";
import { getProteinInit } from "../data/protein";
import Radio from '@mui/material/Radio';
import NotifyGlyGen from "../components/alert/NotifyGlyGen";
import "../css/detail.css";

function getDateTime() {
  var now = new Date();
  var year = now.getFullYear();
  var month = now.getMonth() + 1;
  var day = now.getDate();
  var hour = now.getHours();
  var minute = now.getMinutes();
  var second = now.getSeconds();

  if (month.toString().length === 1) {
    month = "0" + month;
  }
  if (day.toString().length === 1) {
    day = "0" + day;
  }
  if (hour.toString().length === 1) {
    hour = "0" + hour;
  }
  if (minute.toString().length === 1) {
    minute = "0" + minute;
  }
  if (second.toString().length === 1) {
    second = "0" + second;
  }
  var dateTime = year + "/" + month + "/" + day + " " + hour + ":" + minute + ":" + second;
  return dateTime;
}

const ProteinQuerySummary = (props) => {
  const title = "Protein Search Summary";
  // let quickSearch = stringConstants.quick_search;

  const { data, onModifySearch, timestamp, searchId, dataUnmap, aIQueryAssistant, setPageLoading, listID, searchQuery } = props;
  const proteinStrings = stringConstants.protein.common;
  const superSearchStrings = stringConstants.super_search.common;

  const {
    uniprot_canonical_ac,
    uniprot_canonical_ac_short,
    refseq_ac,
    go_id,
    mass,
    go_term,
    organism,
    gene_name,
    pathway_id,
    protein_name,
    sequence,
    glycosylated_aa,
    glycosylation_evidence,
    glycosylation_type,
    glycosylation_subtype,
    pmid,
    term,
    term_category,
    disease_name,
    disease_id,
    attached_glycan_id,
    binding_glycan_id,
    biomarker
  } = data;

  const executionTime = timestamp ? getDateTime(timestamp) : "";

  function formatProtein(proteinAc) {
    return proteinAc.split(",").join(", ");
  }

  const [aminoAcidLookup, setAminoAcidLookup] = useState({});
  const [uniprotCanonicalACShowMore, setUniprotCanonicalACShowMore] = useState(true);
  const [glycosylationEvidenceType, setGlycosylationEvidenceType] = useState(undefined);
  const [selectedQueryType, setSelectedQueryType] = React.useState("Advanced-Search");
  
  const handleQueryTypeChange = (event) => {
    setSelectedQueryType(event.target.value);
  };


  useEffect(() => {
    getProteinInit().then((data) => {
      const lookup = data.data.aa_list
        .map(({ name, key }) => {
          const tokens = name.split(" - ");
          return {
            key,
            short: tokens[1],
            long: tokens[0],
          };
        })
        .reduce(
          (ind, { key, short, long }) => ({
            ...ind,
            [key]: { short, long },
          }),
          {}
        );

      setAminoAcidLookup(lookup);
      if (data.data.glycosylation_evidence_type) {
        let glycoEvidence = data.data.glycosylation_evidence_type.find(obj => obj.id === glycosylation_evidence);
        if (glycoEvidence && glycoEvidence.display) {
          setGlycosylationEvidenceType(glycoEvidence.display);
        }
      }
    });
  }, [glycosylation_evidence]);

  return (
    <>
      {/* <pre>Test: {JSON.stringify(data, null, 2)}</pre> */}
      <Card className="text-center summary-panel">
        <Card.Header as="h3" className="panelHeadBgr panelHeadText">
          {title}
        </Card.Header>
        <Card.Body>
          <Card.Text>
            <strong>Performed on: {executionTime}</strong>
          </Card.Text>
          <Row>
            <Col>
              {aIQueryAssistant && (
                <Row className="summary-table-col" sm={12}>
                  <div align="center">
                    <Radio
                      style={{marginTop:"-5px"}}
                      checked={selectedQueryType === "AI-Query-Assistant"}
                      onChange={handleQueryTypeChange}
                      value="AI-Query-Assistant"
                      name="query-type-radio-buttons"
                    />
                    <strong><i>User Query</i></strong>
                  </div>
                  <div align="center">{aIQueryAssistant}</div>
                  <p/>
                  <div align="center">
                    <Radio
                      style={{marginTop:"-5px"}}
                      checked={selectedQueryType === "Advanced-Search"}
                      onChange={handleQueryTypeChange}
                      value="Advanced-Search"
                      name="query-type-radio-buttons"
                    />
                    <strong><i>Internal Query</i></strong>
                  </div>
                </Row>
              )}
              {props.question && data.glytoucan_ac && (
                <>
                  {props.question.text.split("{0}")[0]}
                  <strong>{data.glytoucan_ac}</strong>
                  {props.question.text.split("{0}")[1]}
                </>
              )}

              {props.question && uniprot_canonical_ac && (
                <>
                  {props.question.text.split("{0}")[0]}
                  <strong>{uniprot_canonical_ac}</strong>
                  {props.question.text.split("{0}")[1]}
                </>
              )}

              {props.question && data.do_name && (
                <>
                  {props.question.text.split("{0}")[0]}
                  <strong>{data.do_name}</strong>
                  {props.question.text.split("{0}")[1]}
                </>
              )}

              {props.question && organism && props.question.organism && (
                <>
                  {props.question.text.split("{0}")[0]}
                  <strong>{organism.name}</strong>
                  {props.question.text.split("{0}")[1]}
                </>
              )}

              {/*  Protein typeahead */}
              {!props.question && uniprot_canonical_ac && (
                <>
                  <Row className="summary-table-col" sm={12}>
                    <Col align="right" xs={6} sm={6} md={6} lg={6}>
                      {proteinStrings.uniprot_canonical_ac.name}:
                    </Col>
                    <Col align="left" xs={6} sm={6} md={6} lg={6}>
                      {formatProtein(
                        uniprotCanonicalACShowMore && uniprot_canonical_ac_short === ""
                          ? uniprot_canonical_ac
                          : uniprotCanonicalACShowMore
                          ? uniprot_canonical_ac_short
                          : uniprot_canonical_ac
                      )}
                    </Col>
                  </Row>
                  <Row>
                    <Col align="right" xs={12} sm={12} md={12} lg={12}>
                      {uniprot_canonical_ac_short && uniprot_canonical_ac_short !== "" && (
                        <Button
                          style={{
                            marginLeft: "20px",
                            marginTop: "5px",
                          }}
                          className={"lnk-btn"}
                          variant="link"
                          onClick={() => {
                            setUniprotCanonicalACShowMore(!uniprotCanonicalACShowMore);
                          }}
                        >
                          {uniprotCanonicalACShowMore ? "Show More..." : "Show Less..."}
                        </Button>
                      )}
                    </Col>
                  </Row>
                </>
              )}

              {searchId && searchId.includes("sups") && <>{superSearchStrings.query}</>}

              {mass && mass.min && (
                <Row className="summary-table-col">
                  <Col align="right" xs={6} sm={6} md={6} lg={6}>
                    {proteinStrings.mass.name}:
                  </Col>
                  <Col align="left" xs={6} sm={6} md={6} lg={6}>
                    {mass.min}&#8209;{mass.max}&nbsp;Da&nbsp;
                  </Col>
                </Row>
              )}
              {gene_name && (
                <Row className="summary-table-col">
                  <Col align="right" xs={6} sm={6} md={6} lg={6}>
                    {proteinStrings.gene_name.name}:
                  </Col>
                  <Col align="left" xs={6} sm={6} md={6} lg={6}>
                    {gene_name}
                  </Col>
                </Row>
              )}
              {glycosylated_aa && (
                <Row className="summary-table-col">
                  <Col align="right" xs={6} sm={6} md={6} lg={6}>
                    {proteinStrings.glycosylated_aa.shortName}:
                  </Col>
                  <Col align="left" xs={6} sm={6} md={6} lg={6}>
                    {glycosylated_aa.aa_list
                      .map((key) => aminoAcidLookup[key].short || "")
                      .join(` ${glycosylated_aa.operation} `)}
                  </Col>
                </Row>
              )}
              {glycosylationEvidenceType && (
                <Row className="summary-table-col">
                  <Col align="right" xs={6} sm={6} md={6} lg={6}>
                    {proteinStrings.glycosylation_evidence.name}:
                  </Col>
                  <Col xs={6} sm={6} md={6} lg={6} className="evidencetype" align="left">
                    {glycosylationEvidenceType}
                  </Col>
                </Row>
              )}
              {glycosylation_type && (
                <Row className="summary-table-col">
                  <Col align="right" xs={6} sm={6} md={6} lg={6}>
                    {proteinStrings.glycosylation_type.name}:
                  </Col>
                  <Col align="left" xs={6} sm={6} md={6} lg={6}>
                    {glycosylation_type}
                  </Col>
                </Row>
              )}
              {glycosylation_subtype && (
                <Row className="summary-table-col">
                  <Col align="right" xs={6} sm={6} md={6} lg={6}>
                    {proteinStrings.glycosylation_subtype.name}:
                  </Col>
                  <Col align="left" xs={6} sm={6} md={6} lg={6}>
                    {glycosylation_subtype}
                  </Col>
                </Row>
              )}
              {sequence && sequence.aa_sequence && (
                <Row className="summary-table-col">
                  <Col align="right" xs={6} sm={6} md={6} lg={6}>
                    {proteinStrings.sequence.name}:
                  </Col>
                  <Col align="left" xs={6} sm={6} md={6} lg={6}>
                    <abbr className="limit-text-size" title="{{sequence.aa_sequence}}">
                      {sequence.aa_sequence}{" "}
                    </abbr>
                  </Col>
                </Row>
              )}
              {protein_name && (
                <Row className="summary-table-col">
                  <Col align="right" xs={6} sm={6} md={6} lg={6}>
                    {proteinStrings.protein_name.name}:
                  </Col>
                  <Col align="left" xs={6} sm={6} md={6} lg={6}>
                    {protein_name}
                  </Col>
                </Row>
              )}

              {/* glycan typeahead */}
              {term && (
                <Row className="summary-table-col" sm={12}>
                  <Col align="right">Search Term:</Col>
                  <Col align="left">{term}</Col>
                </Row>
              )}

              {/* glycan typeahead */}
              {term_category && (
                <Row className="summary-table-col" sm={12}>
                  <Col align="right" xs={6} sm={6} md={6} lg={6}>
                    Category:
                  </Col>
                  <Col align="left" xs={6} sm={6} md={6} lg={6}>
                    {term_category}
                  </Col>
                </Row>
              )}
              {!props.question && organism && organism.name && (
                <Row className="summary-table-col">
                  <Col align="right" xs={6} sm={6} md={6} lg={6}>
                    {proteinStrings.organism.name}:
                  </Col>
                  <Col align="left" xs={6} sm={6} md={6} lg={6}>
                    {organism.name}
                  </Col>
                </Row>
              )}
              {refseq_ac && (
                <Row className="summary-table-col">
                  <Col align="right" xs={6} sm={6} md={6} lg={6}>
                    {proteinStrings.refseq_ac.name}:
                  </Col>
                  <Col align="left" xs={6} sm={6} md={6} lg={6}>
                    {refseq_ac}
                  </Col>
                </Row>
              )}

              {go_term && (
                <Row className="summary-table-col">
                  <Col align="right" xs={6} sm={6} md={6} lg={6}>
                    {proteinStrings.go_term.name}:
                  </Col>
                  <Col align="left" xs={6} sm={6} md={6} lg={6}>
                    {go_term}
                  </Col>
                </Row>
              )}

              {go_id && (
                <Row className="summary-table-col">
                  <Col align="right" xs={6} sm={6} md={6} lg={6}>
                    {proteinStrings.go_id.name}:
                  </Col>
                  <Col align="left" xs={6} sm={6} md={6} lg={6}>
                    {go_id}
                  </Col>
                </Row>
              )}

              {attached_glycan_id && (
                <Row className="summary-table-col">
                  <Col align="right" xs={6} sm={6} md={6} lg={6}>
                    {proteinStrings.attached_glycan_id.name}:
                  </Col>
                  <Col align="left" xs={6} sm={6} md={6} lg={6}>
                    {attached_glycan_id}
                  </Col>
                </Row>
              )}

              {binding_glycan_id && (
                <Row className="summary-table-col">
                  <Col align="right" xs={6} sm={6} md={6} lg={6}>
                    {proteinStrings.binding_glycan_id.name}:
                  </Col>
                  <Col align="left" xs={6} sm={6} md={6} lg={6}>
                    {binding_glycan_id}
                  </Col>
                </Row>
              )}

              {pathway_id && (
                <Row className="summary-table-col">
                  <Col align="right" xs={6} sm={6} md={6} lg={6}>
                    {proteinStrings.pathway_id.name}:
                  </Col>
                  <Col align="left" xs={6} sm={6} md={6} lg={6}>
                    {pathway_id}
                  </Col>
                </Row>
              )}
              {disease_name && (
                <Row className="summary-table-col">
                  <Col align="right" xs={6} sm={6} md={6} lg={6}>
                    {proteinStrings.disease_name.name}:
                  </Col>
                  <Col align="left" xs={6} sm={6} md={6} lg={6}>
                    {disease_name}
                  </Col>
                </Row>
              )}
              {disease_id && (
                <Row className="summary-table-col">
                  <Col align="right" xs={6} sm={6} md={6} lg={6}>
                    {proteinStrings.disease_id.name}:
                  </Col>
                  <Col align="left" xs={6} sm={6} md={6} lg={6}>
                    {disease_id}
                  </Col>
                </Row>
              )}
              {pmid && (
                <Row className="summary-table-col">
                  <Col align="right" xs={6} sm={6} md={6} lg={6}>
                    {proteinStrings.pmid.name}:
                  </Col>
                  <Col align="left" xs={6} sm={6} md={6} lg={6}>
                    {pmid}
                  </Col>
                </Row>
              )}
              {biomarker && biomarker.disease_name && (
                <Row className="summary-table-col">
                  <Col align="right" xs={6} sm={6} md={6} lg={6}>
                    {proteinStrings.biomarker_disease.name}:
                  </Col>
                  <Col align="left" xs={6} sm={6} md={6} lg={6}>
                    {biomarker.disease_name}
                  </Col>
                </Row>
              )}
              {biomarker && biomarker.type && (
                <Row className="summary-table-col">
                  <Col align="right" xs={6} sm={6} md={6} lg={6}>
                    {proteinStrings.biomarker_type.name}:
                  </Col>
                  <Col align="left" xs={6} sm={6} md={6} lg={6}>
                    {biomarker.type.charAt(0).toUpperCase() + biomarker.type.slice(1)}
                  </Col>
                </Row>
              )}
            </Col>
          </Row>

          {aIQueryAssistant &&
            <NotifyGlyGen
              search={"Protein AI Search"}
              query={searchQuery}
              listID={listID}
              setPageLoading={setPageLoading}
            />
          }

          <div className="pb-3 pt-3">
            <Button
              type="button"
              className="gg-btn-outline me-4"
              onClick={() => {
                window.location.reload();
              }}
            >
              Update Results
            </Button>
            <Button type="button" className="gg-btn-blue" onClick={onModifySearch}>
              Modify Search
            </Button>
          </div>
          <Card.Text>
            ** To perform the same search again using the current version of the database, click{" "}
            <strong>“Update Results”</strong>.
          </Card.Text>
          {dataUnmap && dataUnmap.length > 0 && (<Card.Text>
            ** {dataUnmap.length} ID(s) could not be found. To see the reason please,{" "}
            <LineTooltip text="Unmapped ID Table">
              <a href="#Unmapped-Table">click here</a>
            </LineTooltip>
            .
          </Card.Text>)}
        </Card.Body>
      </Card>
    </>
  );
};

export default ProteinQuerySummary;
