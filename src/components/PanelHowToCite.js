import React from "react";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Table from "react-bootstrap/Table";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import { Link } from "react-router-dom";
import Image from "react-bootstrap/Image";
import Card from "react-bootstrap/Card";
import CiteImage from "../images/icons/quote-open-outline.svg";

const PanelHowToCite = (props) => {
  return (
    <div id={props.id}>
      <CssBaseline />
      <Container maxWidth="xl" className="gg-container">
        <Card className="panel-width">
          <Card.Header className="panelHeadBgr" style={{ borderBottom: "none" }}>
            {props.data.map((json) => (
              <h4 className="gg-green">{json.title}</h4>
            ))}
          </Card.Header>
          <Card.Body className="card-padding-zero">
            <Table hover fluid>
              <tbody className="table-body">
                {props.data.map((json) => (
                  <tr className="table-row">
                    <td style={{ paddingLeft: "30px", paddingRight: "30px" }}>
                      <p>{json.text}</p>
                      <p>
                        {json.comingSoon}
                        <div>
                          <h5 style={{ marginBottom: "3px" }}>
                            <strong>{json.heading}</strong>
                          </h5>
                        </div>
                        {json.authors}
                        <div style={{ textIndent: "-50px", paddingLeft: "50px" }}>
                          {json.citations}
                        </div>
                        {json.publisher}
                        {json.pmid && json.website && (<div>
                          {json.pmid}{" "}
                          <a href={json.website.url} target="_blank" rel="noopener noreferrer">
                            {json.website.name}
                          </a>
                          {json.period}
                        </div>)}
                        {json.doi && json.website && (<div>
                          {json.doi}{" "}
                          <a href={json.website.url} target="_blank" rel="noopener noreferrer">
                            {json.website.name}
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
                        <div>
                          {json.citeimage && (
                            <Image src={CiteImage} style={{ paddingRight: "20px" }} />
                          )}
                          {json.bibtex && (
                            <Link
                              to={json.bibtex}
                              style={{ paddingRight: "20px" }}
                              target="_blank"
                              download
                            >
                              {json.bibtexlabel}
                            </Link>
                          )}
                          {json.endnote && (
                            <Link
                              to={json.endnote}
                              target="_blank"
                              download
                              style={{ paddingRight: "20px" }}
                            >
                              {json.endnotelabel}
                            </Link>
                          )}
                          {json.ris && (
                            <Link
                              to={json.ris}
                              target="_blank"
                              download
                              style={{ paddingRight: "20px" }}
                            >
                              {json.rislabel}
                            </Link>
                          )}
                        </div>
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
        <br />
      </Container>
    </div>
  );
};
export default PanelHowToCite;
