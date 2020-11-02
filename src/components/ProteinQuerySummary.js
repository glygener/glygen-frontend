import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import stringConstants from "../data/json/stringConstants";
import { Row, Col } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { getProteinInit } from "../data/protein";

function getDateTime() {
  var now = new Date();
  var year = now.getFullYear();
  var month = now.getMonth() + 1;
  var day = now.getDate();
  var hour = now.getHours();
  var minute = now.getMinutes();
  var second = now.getSeconds();

  if (month.toString().length == 1) {
    month = "0" + month;
  }
  if (day.toString().length == 1) {
    day = "0" + day;
  }
  if (hour.toString().length == 1) {
    hour = "0" + hour;
  }
  if (minute.toString().length == 1) {
    minute = "0" + minute;
  }
  if (second.toString().length == 1) {
    second = "0" + second;
  }
  var dateTime =
    year + "/" + month + "/" + day + " " + hour + ":" + minute + ":" + second;
  return dateTime;
}

const ProteinQuerySummary = props => {
  const title = "Protein Search Summary";
  let quickSearch = stringConstants.quick_search;

  const { data, onModifySearch } = props;
  const proteinStrings = stringConstants.protein.common;
  const {
    uniprot_canonical_ac,
    refseq_ac,
    go_id,
    mass,
    mass_type,
    go_term,
    organism,
    gene_name,
    pathway_id,
    protein_name,
    sequence,
    glycosylated_aa,
    glycosylation_evidence,
    pmid,
    term,
    term_category,
    disease_name,
    disease_id,
    attached_glycan_id,
    binding_glycan_id,
  } = data;

  const executionTime = data.execution_time
    ? getDateTime(data.execution_time)
    : "";

  function formatProtein() {
    const ProteinAc = data.uniprot_canonical_ac;
    return ProteinAc.split(",").join(", ");
  }

  const [aminoAcidLookup, setAminoAcidLookup] = useState({});

  useEffect(() => {
    getProteinInit().then(data => {
      const lookup = data.data.aa_list
        .map(({ name, key }) => {
          const tokens = name.split(" - ");
          return {
            key,
            short: tokens[1],
            long: tokens[0]
          };
        })
        .reduce(
          (ind, { key, short, long }) => ({
            ...ind,
            [key]: { short, long }
          }),
          {}
        );

      setAminoAcidLookup(lookup);
    });
  }, []);

  return (
    <>
      {/* <pre>Test: {JSON.stringify(data, null, 2)}</pre> */}
      <Card className="text-center summary-panel">
        <Card.Header as="h3" className="panelHeadBgr panelHeadText">
          {title}
        </Card.Header>
        <Card.Body>
          <Card.Title>
            <p>
              <strong>Performed on: {executionTime} (EST)</strong>
            </p>
          </Card.Title>
          <Card.Text>
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
              <Row className="summary-table-col" sm={12}>
                <Col align="right" xs={6} sm={6} md={6} lg={6}>
                  {proteinStrings.uniprot_canonical_ac.name}:
                </Col>
                <Col align="left" xs={6} sm={6} md={6} lg={6}>
                  {formatProtein(uniprot_canonical_ac)}
                </Col>
              </Row>
            )}

            {mass && mass.min && (
              <Row className="summary-table-col">
                <Col align="right" xs={6} sm={6} md={6} lg={6}>
                  {proteinStrings.mass.name}:
                </Col>
                <Col align="left" xs={6} sm={6} md={6} lg={6}>
                  {mass.min}&#8209;{mass.max}&nbsp;Da&nbsp;({mass_type})
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
                    .map(key => aminoAcidLookup[key].short || "")
                    .join(` ${glycosylated_aa.operation} `)}
                </Col>
              </Row>
            )}
            {glycosylation_evidence && (
              <Row className="summary-table-col">
                <Col align="right" xs={6} sm={6} md={6} lg={6}>
                  {proteinStrings.glycosylation_evidence.name}:
                </Col>
                <Col align="left" xs={6} sm={6} md={6} lg={6}>
                  {glycosylation_evidence}
                </Col>
              </Row>
            )}
            {sequence && sequence.aa_sequence && (
              <Row className="summary-table-col">
                <Col align="right" xs={6} sm={6} md={6} lg={6}>
                  {proteinStrings.sequence.name}:
                </Col>
                <Col align="left" xs={6} sm={6} md={6} lg={6}>
                  <abbr
                    className="limit-text-size"
                    title="{{sequence.aa_sequence}}"
                  >
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
          </Card.Text>
          <div className="pb-3">
            <Button
              type="button"
              className="gg-btn-outline mr-4"
              onClick={() => {
                window.location.reload();
              }}
            >
              Update Results
            </Button>
            <Button
              type="button"
              className="gg-btn-blue"
              onClick={onModifySearch}
            >
              Modify Search
            </Button>
          </div>
          <Card.Text>
            ** To perform the same search again using the current version of the
            database, click <strong>“Update Results”</strong>.
          </Card.Text>
        </Card.Body>
      </Card>
    </>
  );
};

export default ProteinQuerySummary;
