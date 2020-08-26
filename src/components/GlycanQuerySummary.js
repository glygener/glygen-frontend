import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import { Row, Col } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import stringConstants from "../data/json/stringConstants";
import Button from "react-bootstrap/Button";
const glycanStrings = stringConstants.glycan.common;

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
const GlycanQuerySummary = props => {
  const title = "Glycan Search Summary";

  const { data, onModifySearch } = props;

  const executionTime = data.execution_time
    ? getDateTime(data.execution_time)
    : "";
  const {
    glytoucan_ac,
    mass,
    mass_type,
    number_monosaccharides,
    organism,
    glycan_type,
    glycan_subtype,
    protein_identifier,
    glycan_motif,
    enzyme,
    pmid,
    term,
    term_category,
    composition
  } = data;

  const formatOrganisms = organism => {
    if (organism.organism_list) {
      const organismNames = organism.organism_list.map(item => item.name);
      const OrganiOperation = organism.operation.toUpperCase();
      return organismNames.join(` ${OrganiOperation} `);
    }
  };

  function formatGlycans() {
    const glycansAc = data.glytoucan_ac;
    return glycansAc.split(",").join(", ");
  }

  // data.glytoucan_ac = data.glytoucan_ac.split(",").join(", ");

  return (
    <>
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
            {props.question && data.uniprot_canonical_ac && (
              <>
                {props.question.text.split("{0}")[0]}
                <strong>{data.uniprot_canonical_ac}</strong>
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
            {composition &&
              composition.map((compItem, index) => (
                <Row className="summary-table-col" key={index}>
                  <Col align="right" xs={6} sm={6} md={6} lg={6}>
                    {compItem.residue}:
                  </Col>
                  <Col align="left" xs={6} sm={6} md={6} lg={6}>
                    {compItem.min} - {compItem.max}
                  </Col>
                </Row>
              ))}
            {/* glycan typeahead */}
            {glytoucan_ac && (
              <Row className="summary-table-col" sm={12}>
                <Col align="right" xs={6} sm={6} md={6} lg={6}>
                  {glycanStrings.glycan_id.name}:
                  {/* {glycanStrings.glytoucan_ac.shortName}: */}
                </Col>
                <Col align="left" xs={6} sm={6} md={6} lg={6}>
                  {formatGlycans(glytoucan_ac)}
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
            {/* glycan mass */}
            {mass && mass.min && (
              <Row className="summary-table-col">
                <Col align="right" xs={6} sm={6} md={6} lg={6}>
                  {glycanStrings.mass.name}:
                </Col>
                <Col align="left" xs={6} sm={6} md={6} lg={6}>
                  {mass.min}&#8209;{mass.max}&nbsp;Da&nbsp;({mass_type})
                </Col>
              </Row>
            )}
            {/* glycan sugar */}
            {number_monosaccharides && number_monosaccharides.min && (
              <Row className="summary-table-col">
                <Col align="right" xs={6} sm={6} md={6} lg={6}>
                  {glycanStrings.number_monosaccharides.shortName}:
                </Col>
                <Col align="left" xs={6} sm={6} md={6} lg={6}>
                  {number_monosaccharides.min}&#8209;
                  {number_monosaccharides.max}&nbsp;Da&nbsp;
                </Col>
              </Row>
            )}

            {/* Oraganism */}
            {!props.question && organism && (
              <Row className="summary-table-col">
                <Col align="right" xs={6} sm={6} md={6} lg={6}>
                  {glycanStrings.organism.shortName}:
                </Col>
                <Col align="left" xs={6} sm={6} md={6} lg={6}>
                  {formatOrganisms(organism)}
                </Col>
              </Row>
            )}
            {glycan_type && (
              <Row className="summary-table-col">
                <Col align="right" xs={6} sm={6} md={6} lg={6}>
                  {glycanStrings.glycan_type.shortName}:
                </Col>
                <Col align="left" xs={6} sm={6} md={6} lg={6}>
                  {glycan_type}
                </Col>
              </Row>
            )}
            {glycan_subtype && (
              <Row className="summary-table-col">
                <Col align="right" xs={6} sm={6} md={6} lg={6}>
                  {glycanStrings.glycan_subtype.shortName}:
                </Col>
                <Col align="left" xs={6} sm={6} md={6} lg={6}>
                  {glycan_subtype}
                </Col>
              </Row>
            )}
            {protein_identifier && (
              <Row className="summary-table-col">
                <Col align="right" xs={6} sm={6} md={6} lg={6}>
                  {glycanStrings.protein_identifier.shortName}:
                </Col>
                <Col align="left" xs={6} sm={6} md={6} lg={6}>
                  {protein_identifier}
                </Col>
              </Row>
            )}
            {enzyme && enzyme.id && (
              <Row className="summary-table-col">
                <Col align="right" xs={6} sm={6} md={6} lg={6}>
                  {glycanStrings.enzyme.shortName}:
                </Col>
                <Col align="left" xs={6} sm={6} md={6} lg={6}>
                  {enzyme.id}
                </Col>
              </Row>
            )}
            {glycan_motif && (
              <Row className="summary-table-col">
                <Col align="right" xs={6} sm={6} md={6} lg={6}>
                  {glycanStrings.glycan_motif.shortName}:
                </Col>
                <Col align="left" xs={6} sm={6} md={6} lg={6}>
                  {glycan_motif}
                </Col>
              </Row>
            )}
            {pmid && (
              <Row className="summary-table-col">
                <Col align="right" xs={6} sm={6} md={6} lg={6}>
                  {glycanStrings.pmid.shortName}:
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

export default GlycanQuerySummary;
