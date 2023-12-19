import React from "react";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Table from "react-bootstrap/Table";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import { Link } from "react-router-dom";
import Image from "react-bootstrap/Image";
import Card from "react-bootstrap/Card";
import LineTooltip from "../components/tooltip/LineTooltip";
import {
	GLYGEN_DOMAIN
  } from "../envVariables";

/**
 * PanelOutreach component for showing glygen outreach data.
 */
const PanelOutreach = (props) => {
  return (
    <div>
      <CssBaseline />
       <Container maxWidth="xl" className="gg-container">
        <Card className="panel-width-outreach">
          <Card.Body className="card-padding-zero">
            {props.data && props.data.length > 0 && <Table hover>
              <tbody className="table-body">
                {props.data.map((json) => (
                  <tr className="table-row">
                    <td style={{ position: "relative", paddingLeft: "15px", paddingRight: "15px", width: "70px" }}>
                    {json.imagePath && <div style={{ top: "50%", left: "50%", position: "absolute", transform: "translate(-50%, -50%)" }}>	
                      <LineTooltip text={json.outreach_type}>
                        <Image
                          src={GLYGEN_DOMAIN + "/icons/" + json.imagePath}
                          style={{ width: "40px", height: "40px"}}
                        />
                      </LineTooltip>
                    </div>}
                    </td>
                    <td style={{ paddingLeft: "0px" }}>
                      <div>
                        <div>
                          <h5 style={{ marginBottom: "3px" }}>
                            <strong>{json.title}</strong>
                          </h5>
                        </div>
                        {json.author_list}
                        {json.presenter && (<>
                          {"Presenter:"}{" "}
                          {json.presenter}{". "}
                        </>)}
                        <div style={{ textIndent: "-50px", paddingLeft: "50px" }}>
                          {json.citations}
                        </div>
                        {json.journal &&(<>
                          <i>{json.journal}</i>{". "}
                        </>)}
                        {json.meeting && (<div>
                          {"Meeting:"}{" "}
                          {json.meeting_url ? <a href={json.meeting_url} target="_blank" rel="noopener noreferrer">
                            {json.meeting}
                            </a> : <>{json.meeting}</>}
                          {json.period}
                        </div>)}
                        {json.location &&(<>
                          {json.location}{". "}
                        </>)}
                        {json.participants &&(<>
                          {"Participants:"}{" "}
                          {json.participants}{". "}
                        </>)}
                        {json.date &&(<>
                          {json.date}{". "}
                        </>)}
                        {json.issue &&(<>
                          {json.issue}{": "}
                        </>)}
                        {json.pages &&(<>
                          {json.pages}{". "}
                        </>)}
                        {json.pmid && (<div>
                          {"PMID:"}{" "}
                          <a href={"http://www.ncbi.nlm.nih.gov/pubmed/" + json.pmid} target="_blank" rel="noopener noreferrer">
                            {json.pmid}
                          </a>
                          {json.period}
                        </div>)}
                        {json.doid && (<div>
                          {"DOI:"}{" "}
                          <a href={"https://doi.org/" + json.doid} target="_blank" rel="noopener noreferrer">
                            {json.doid}
                          </a>
                          {json.period}
                        </div>)}
                        {json.pdf && (<div>
                          <Link
                            to={json.pdf}
                            target="_blank"
                            download
                            style={{ paddingRight: "20px" }}
                          >
                            {json.pdflabel}
                          </Link>
                        </div>)}
                        {json.files && (<div style={{ height: "30px", verticalAlign: "center" }}>
                          {json.files.map((obj) => (
                            <span>
                              {obj && (<>
                                <a href={obj.url} target="_blank" rel="noopener noreferrer">
                                  <Image
                                    src={GLYGEN_DOMAIN + "/icons/" + obj.imagePath}
                                    style={{ height: "25px" }}
                                  />{" "}{obj.label}
                                </a>
                                  &nbsp;&nbsp;&nbsp;&nbsp;
                                </>)}
                            </span>
                          ))}
                        </div>)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>}
            {props.data && props.data.length === 0 && (
              <Table>
                <td>
                  <tr>
                    <p className="no-data-msg text-center">{"No data available."}</p>
                  </tr>
                </td>
              </Table>
            )}
          </Card.Body>
        </Card>
        <br />
      </Container>
    </div>
  );
};
export default PanelOutreach;
