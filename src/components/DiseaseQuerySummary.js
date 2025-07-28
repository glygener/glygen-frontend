import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import stringConstants from "../data/json/stringConstants";
import { Row, Col } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import "../css/detail.css";

const superSearchStrings = stringConstants.super_search.common;

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

const DiseaseQuerySummary = (props) => {
  const title = "Disease Search Summary";

  const { data, onModifySearch, timestamp, searchId } = props;
  const diseaseStrings = stringConstants.disease.common;

  const {
    disease_id,
    biomarker_type,
    biomarker_id,
    disease_name,
    refseq_id,
    gene_name,
    protein_name,
    search_type,
    protein_id,
    glycan_id,
    glycan_name,
    tax_id,
    tax_name,
    term,
    term_category,
  } = data;

  const executionTime = timestamp ? getDateTime(timestamp) : "";

  function formatDisease(diseaseId) {
    return diseaseId.split(",").join(", ");
  }
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

              {searchId && searchId.includes("sups") && <>{superSearchStrings.query}</>}

              {disease_id && (
                <Row className="summary-table-col">
                  <Col align="right" xs={6} sm={6} md={6} lg={6}>
                    {diseaseStrings.disease_id.name}:
                  </Col>
                  <Col align="left" xs={6} sm={6} md={6} lg={6}>
                    {formatDisease(disease_id)}
                  </Col>
                </Row>
              )}
              {disease_name && (
                <Row className="summary-table-col">
                  <Col align="right" xs={6} sm={6} md={6} lg={6}>
                    {diseaseStrings.disease_name.name}:
                  </Col>
                  <Col align="left" xs={6} sm={6} md={6} lg={6}>
                    {disease_name}
                  </Col>
                </Row>
              )}
              {search_type && (
                <Row className="summary-table-col">
                  <Col align="right" xs={6} sm={6} md={6} lg={6}>
                    {diseaseStrings.search_type.name}:
                  </Col>
                  <Col align="left" xs={6} sm={6} md={6} lg={6}>
                    {search_type}
                  </Col>
                </Row>
              )}
              {tax_name && (
                <Row className="summary-table-col">
                  <Col align="right" xs={6} sm={6} md={6} lg={6}>
                    {diseaseStrings.organism.name}:
                  </Col>
                  <Col xs={6} sm={6} md={6} lg={6} className="evidencetype" align="left">
                    {tax_name}
                  </Col>
                </Row>
              )}
               {biomarker_id && (
                <Row className="summary-table-col">
                  <Col align="right" xs={6} sm={6} md={6} lg={6}>
                    {diseaseStrings.biomarker_id.name}:
                  </Col>
                  <Col align="left" xs={6} sm={6} md={6} lg={6}>
                    {biomarker_id}
                  </Col>
                </Row>
              )}
               {biomarker_type && (
                <Row className="summary-table-col">
                  <Col align="right" xs={6} sm={6} md={6} lg={6}>
                    {diseaseStrings.biomarker_type.name}:
                  </Col>
                  <Col align="left" xs={6} sm={6} md={6} lg={6}>
                    {biomarker_type}
                  </Col>
                </Row>
              )}
              {gene_name && (
                <Row className="summary-table-col">
                  <Col align="right" xs={6} sm={6} md={6} lg={6}>
                    {diseaseStrings.gene_name.name}:
                  </Col>
                  <Col align="left" xs={6} sm={6} md={6} lg={6}>
                    {gene_name}
                  </Col>
                </Row>
              )}
              {refseq_id && (
                <Row className="summary-table-col">
                  <Col align="right" xs={6} sm={6} md={6} lg={6}>
                    {diseaseStrings.refseq_id.name}:
                  </Col>
                  <Col align="left" xs={6} sm={6} md={6} lg={6}>
                    {refseq_id}
                  </Col>
                </Row>
              )}
              {protein_id && (
                <Row className="summary-table-col">
                  <Col align="right" xs={6} sm={6} md={6} lg={6}>
                    {diseaseStrings.protein_id.name}:
                  </Col>
                  <Col align="left" xs={6} sm={6} md={6} lg={6}>
                    {protein_id}
                  </Col>
                </Row>
              )}
              {protein_name && (
                <Row className="summary-table-col">
                  <Col align="right" xs={6} sm={6} md={6} lg={6}>
                    {diseaseStrings.protein_name.name}:
                  </Col>
                  <Col align="left" xs={6} sm={6} md={6} lg={6}>
                      {protein_name}
                  </Col>
                </Row>
              )}
              {glycan_id && (
                <Row className="summary-table-col">
                  <Col align="right" xs={6} sm={6} md={6} lg={6}>
                    {diseaseStrings.glycan_id.name}:
                  </Col>
                  <Col align="left" xs={6} sm={6} md={6} lg={6}>
                      {glycan_id}
                  </Col>
                </Row>
              )}
              {glycan_name && (
                <Row className="summary-table-col">
                  <Col align="right" xs={6} sm={6} md={6} lg={6}>
                    {diseaseStrings.glycan_name.name}:
                  </Col>
                  <Col align="left" xs={6} sm={6} md={6} lg={6}>
                    {glycan_name}
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
            </Col>
          </Row>
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
        </Card.Body>
      </Card>
    </>
  );
};

export default DiseaseQuerySummary;
