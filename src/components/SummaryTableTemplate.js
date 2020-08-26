import React from "react";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Table from "react-bootstrap/Table";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import { Row, Col } from "react-bootstrap";

const SummaryTableTemplate = () => {
	return (
		<React.Fragment>
			<CssBaseline />
			<Container maxWidth="xl" className="gg-container">
				<Table
					bordered
					hover5
					size="lg"
					className="results-table-top text-center">
					<thead className="panelHeadBgr panelHeadText">
						<tr>
							<th>
								<h3>Summary Table Template</h3>
							</th>
						</tr>
					</thead>
					<tbody className="table-body">
						<tr className="table-row">
							<td>
								<h4>
									<strong>Heading</strong>
								</h4>
								<Row>
									<Col>Text:</Col>
									<Col>Data</Col>
								</Row>
								<p>Your text goes here.</p>
							</td>
						</tr>
					</tbody>
				</Table>
			</Container>
		</React.Fragment>
	);
};
export default SummaryTableTemplate;
