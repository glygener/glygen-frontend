import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import Table from 'react-bootstrap/Table'

/**
 * ClientTable component with no pagination support. Supports footer for total.
 */
const ClientTable = ({
  data,
  columns,
  totalName,
  totalColspan,
  total
}) => {

  return (
    <div>
      <Table striped bordered hover responsive size="sm">
        <thead style={{
          backgroundColor: "#4B85B6",
          color: "#FFFFFF",
          height: "35px"
        }}>
          <tr>
            {columns && (
            columns.map((item) =>
              <th>{item.name}</th>
            )
            )} 
          </tr>
        </thead>
        <tbody>                
          {data && (
            data.map((dataItem) => 
              <tr>
                  {columns && (
                  columns.map((item) =>
                    <td>{dataItem[item.dataField]}</td>
                  )
                  )}
              </tr>
            ) 
          )}
          <tr>
            <th colSpan={totalColspan}>{totalName}</th>
            <th>{total}</th> 
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default ClientTable;
