import { Row, Col } from "react-bootstrap";
import React, { useState } from "react";

const ColumnList = (props) => {
  const { columns, className, selectedColumns, handleSelectHighlight } = props;

  return (
    <>
      <Row>
        {columns && columns.map((column) => (
          <Col xs={12} sm={4} key={column.id}>
            <label style={{ marginBottom: "0.5rem" }}>
              <input
                type="checkbox"
                name="checkbox"
                checked={selectedColumns[column.id]}
                onClick={() => handleSelectHighlight(column.id)}
              />
              &nbsp;
              <span className={className}>{column.label}</span>
            </label>
          </Col>
        ))}
      </Row>
    </>
  );
};
export default ColumnList;
