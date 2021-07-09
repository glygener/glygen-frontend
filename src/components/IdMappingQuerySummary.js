import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import { Row, Col } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import LineTooltip from "../components/tooltip/LineTooltip";
import { ReactComponent as TableArowDown } from "../images/icons/table-arrow-down.svg";
// import { ReactComponent as TableIcon } from "../images/icons/table.svg";

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

const IdMappingQuerySummary = (props) => {
  const title = "GlyGen Mapper Summary";
  const { onModifySearch, timestamp, totalSize, totalSizeUnmap } = props;

  const executionTime = timestamp ? getDateTime(timestamp) : "";

  return (
    <>
      <Card className="text-center summary-panel">
        <Card.Header as="h3" className="panelHeadBgr panelHeadText">
          {title}
        </Card.Header>
        <Card.Body>
          <Card.Text>
            <strong>Performed on: {executionTime}</strong>
          </Card.Text>
          <Row className="summary-table-col">
            <Col align="right" xs={6} sm={6} md={6} lg={6}>
              Mapped ID:
            </Col>
            <Col align="left" xs={6} sm={6} md={6} lg={6}>
              <LineTooltip text="Mapped ID Table">
                <a className="media-wiki-icon" href="#Mapped-Table">
                  {totalSize ? totalSize : "0"} <TableArowDown className="ml-1" />
                </a>
              </LineTooltip>
            </Col>
          </Row>
          <Row className="summary-table-col">
            <Col align="right" xs={6} sm={6} md={6} lg={6}>
              Unmapped ID:
            </Col>
            <Col align="left" xs={6} sm={6} md={6} lg={6}>
              <LineTooltip text="Unmapped ID Table">
                <a className="media-wiki-icon" href="#Unmapped-Table">
                  {totalSizeUnmap ? totalSizeUnmap : "0"} <TableArowDown className="ml-1" />
                </a>
              </LineTooltip>
            </Col>
          </Row>
          <Button type="button" className="gg-btn-blue mb-3 mt-3" onClick={onModifySearch}>
            Modify Request
          </Button>
          <Card.Text>
            ** To see the reason why certain entries could not be mapped,{" "}
            <LineTooltip text="Unmapped ID Table">
              <a href="#Unmapped-Table">click here</a>
            </LineTooltip>
            .
          </Card.Text>
        </Card.Body>
      </Card>
    </>
  );
};

export default IdMappingQuerySummary;
