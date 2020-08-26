import React from "react";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Table from "react-bootstrap/Table";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

const PanelTemplate = () => {
	return (
		<React.Fragment>
			<CssBaseline />
			<Container maxWidth="xl" className="gg-container">
				<Table bordered hover5 size="lg" className="panel-width">
					<thead className="panelHeadBgr panelHeadText">
						<tr>
							<th>
								<h3>Panel Title</h3>
							</th>
						</tr>
					</thead>
					<tbody className="table-body">
						<tr className="table-row">
							<td>
								<ul>
									<li>
										<h4>
											<strong>Heading</strong>
										</h4>
										<p>Your text here.</p>
									</li>
								</ul>
							</td>
						</tr>
					</tbody>
				</Table>
			</Container>
		</React.Fragment>
	);
};
export default PanelTemplate;
