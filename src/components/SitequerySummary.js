import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import stringConstants from "../data/json/stringConstants";
import { Row, Col } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

import {
  getSuperSearchList,
  createSiteQuerySummary
} from "../data/supersearch";

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

const SiteQuerySummary = props => {
  const title = "Site Search Summary";
  const { data, onModifySearch, timestamp, searchId, initData } = props;
  const proteinStrings = stringConstants.protein.common;
  const superSearchStrings = stringConstants.super_search.common;

  const executionTime = timestamp ? getDateTime(timestamp) : "";

  const querySummary = createSiteQuerySummary(data);

  let annotations = [];
  if (
    initData &&
    initData.annotation_type_list &&
    initData.annotation_type_list.length &&
    querySummary.annotations
  ) {
    annotations = initData.annotation_type_list.filter(annotation => {
      return querySummary.annotations.includes(annotation.id);
    });
  }
  let annotationOperation = "";
  if (querySummary.annotationOperation) {
    annotationOperation =
      querySummary.annotationOperation === "$and" ? "And" : "Or";
  }

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
              <strong>Performed on: {executionTime}</strong>
            </p>
          </Card.Title>
          <Card.Text>
            {/*  Protein typeahead */}

            {searchId !== "sups" && !!Object.keys(querySummary).length && (
              <>
                {querySummary.proteinId && (
                  <Row className="summary-table-col" sm={12}>
                    <Col align="right" xs={6} sm={6} md={6} lg={6}>
                      {proteinStrings.uniprot_canonical_ac.name}:
                    </Col>
                    <Col align="left" xs={6} sm={6} md={6} lg={6}>
                      {querySummary.proteinId.join(", ")}
                    </Col>
                  </Row>
                )}
                {annotations && !!annotations.length && (
                  <Row className="summary-table-col" sm={12}>
                    <Col align="right" xs={6} sm={6} md={6} lg={6}>
                      {proteinStrings.annotation_type.name}:
                    </Col>
                    <Col align="left" xs={6} sm={6} md={6} lg={6}>
                      {annotations
                        .map(anno => anno.label)
                        .join(` ${annotationOperation} `)}
                    </Col>
                  </Row>
                )}
                {querySummary.aminoType && (
                  <Row className="summary-table-col" sm={12}>
                    <Col align="right" xs={6} sm={6} md={6} lg={6}>
                      {proteinStrings.glycosylated_aa.site_form}:
                    </Col>
                    <Col align="left" xs={6} sm={6} md={6} lg={6}>
                      {querySummary.aminoType}
                    </Col>
                  </Row>
                )}
                {querySummary.position && (
                  <Row className="summary-table-col" sm={12}>
                    <Col align="right" xs={6} sm={6} md={6} lg={6}>
                      Position:
                    </Col>
                    <Col align="left" xs={6} sm={6} md={6} lg={6}>
                      {querySummary.position}
                    </Col>
                  </Row>
                )}
                {querySummary.min && querySummary.max && (
                  <Row className="summary-table-col" sm={12}>
                    <Col align="right" xs={6} sm={6} md={6} lg={6}>
                      Range:
                    </Col>
                    <Col align="left" xs={6} sm={6} md={6} lg={6}>
                      {querySummary.min} to {querySummary.max}
                    </Col>
                  </Row>
                )}
              </>
            )}
            {searchId && searchId === "sups" && <>{superSearchStrings.query}</>}
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

export default SiteQuerySummary;
