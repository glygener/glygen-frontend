import React, { useState, useEffect } from "react";

import { Link, useParams } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import routeConstants from '../data/json/routeConstants.json';

import {
  GLYCAN_COLUMNS,
  getUserSelectedColumns,
  setUserSelectedColumns
} from "../data/glycan";

const GlycanListEditColumns = () => {
  let { id } = useParams();
  const [columns, setColumns] = useState([]);
  const [selectedCount, setSelectedCount] = useState(0);

  useEffect(() => {
    const selected = getUserSelectedColumns();
    const selectedColumns = GLYCAN_COLUMNS.map(column => ({
      ...column,
      selected: selected.includes(column.dataField)
    }));

    setColumns(selectedColumns);
    setSelectedCount(selected.length);
  }, []);

  const onColumnSelection = event => {
    const checkbox = event.target;
    const changedColumn = checkbox.getAttribute("data-column");

    const newColumns = columns.map(column => ({
      ...column,
      selected:
        column.text === changedColumn ? event.target.checked : column.selected
    }));

    const newSelectedColumns = newColumns.filter(column => column.selected);

    setColumns(newColumns);

    const selectedFields = newSelectedColumns.map(column => column.text);
    setUserSelectedColumns(selectedFields);
    setSelectedCount(newSelectedColumns.length);
  };

  return (
    <>
      <h1>Columns</h1>
      <ul>
        {columns.map(column => (
          <li key={column.dataField}>
            <label>
              <input
                data-column={column.dataField}
                type="checkbox"
                checked={column.selected}
                onChange={onColumnSelection}
              />
              <span>{column.text}</span>
            </label>
          </li>
        ))}
      </ul>
      {selectedCount === 0 && (
        <p style={{ color: "red" }}>Please select atleast one checkbox</p>
      )}
      {/* <Button
        variant="contained"
        color="primary"
        component={Link}
        to={`${routeConstants.glycanList + id}`}
        variant="contained"
        disabled={selectedCount === 0}
      >
        Back to Glycan List
      </Button> */}

      <Link to={`${routeConstants.glycanList + id}`}>
        <button
          type="button"
          className="btn btn-primary"
          disabled={selectedCount === 0}
        >
          Back to Glycan List
        </button>
      </Link>
    </>
  );
};

export default GlycanListEditColumns;
