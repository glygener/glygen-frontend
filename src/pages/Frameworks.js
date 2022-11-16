import React, { useEffect } from "react";
import Helmet from "react-helmet";
import { getTitle, getMeta } from "../utils/head";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import { Row, Col } from "react-bootstrap";
import VerticalHeading from "../components/headings/VerticalHeading";
import { logActivity } from "../data/logging";
import {
	FaReact,
	FaHtml5,
	FaCss3Alt,
	FaBootstrap,
	FaPython,
	FaRegPaperPlane,
} from "react-icons/fa";
import { IoLogoJavascript } from "react-icons/io";
import { AiOutlineApi, AiFillDatabase } from "react-icons/ai";
import { DiMongodb } from "react-icons/di";
import { ReactComponent as MaterialUi } from "../images/icons/icon-material-ui.svg";
import { ReactComponent as JsonIcon } from "../images/icons/jsonIcon.svg";
import { ReactComponent as Swagger } from "../images/icons/swagger.svg";
import { ReactComponent as Flask } from "../images/icons/flask.svg";

const Frameworks = (props) => {
	const vertHeadFrameworks = {
		h5VerticalText: "what we use",
		h2textTop: "Programming",
		h2textBottomStrongAfter: "Libraries & Frameworks",
	};
	useEffect(() => {
		logActivity();
	}, []);

	return (
		<React.Fragment>
			<Helmet>
				{getTitle("frameworks")}
				{getMeta("frameworks")}
			</Helmet>

			<CssBaseline />
			<Container maxWidth="md" className="gg-frameworks-container card">
				<Row>
					<Col sm={12} md={12} lg={12}>
						<VerticalHeading post={vertHeadFrameworks} />
					</Col>
				</Row>
				<Row>
					<Col
						xs={12}
						sm={6}
						className="wow slideInLeft"
						data-wow-duration="1s">
						{/* Library 01 React.js */}
						<div className="framework">
							<Row>
								<Col xs={12} sm={2}>
									<div className="icon text-right">
										<FaReact />
									</div>
								</Col>
								<Col xs={12} sm={10}>
									{/* <h5>Development 01</h5> */}
									<h4>React.js</h4>
									<p>
										<em>
											<strong>
												<a
													href="https://reactjs.org/"
													target="_blank"
													rel="noopener noreferrer">
													React.js
												</a>
											</strong>
										</em>{" "}
										is a declarative, efficient, and flexible JavaScript library
										for building user interfaces. It lets you compose complex
										UIs from small and isolated components.
									</p>
								</Col>
							</Row>
						</div>
						{/* Library 02 HTML5 */}
						<div className="framework">
							<Row>
								<Col xs={12} sm={2}>
									<div className="icon text-right">
										<FaHtml5 />
									</div>
								</Col>
								<Col xs={12} sm={10}>
									{/* <h5>Development 02</h5> */}
									<h4>HTML5</h4>
									<p>
										<em>
											<strong>
												<a
													href="https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5"
													target="_blank"
													rel="noopener noreferrer">
													HTML5
												</a>
											</strong>
										</em>{" "}
										is a latest version of Hypertext Markup Language, the code
										that describes the basic structure of any web page where
										other front-end languages are necessary.
									</p>
								</Col>
							</Row>
						</div>
						{/* Development 03 CSS3 */}
						<div className="framework">
							<Row>
								<Col xs={12} sm={2}>
									<div className="icon text-right">
										<FaCss3Alt />
									</div>
								</Col>
								<Col xs={12} sm={10}>
									{/* <h5>Development 03</h5> */}
									<h4>CSS3</h4>
									<p>
										<em>
											<strong>
												<a
													href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS3"
													target="_blank"
													rel="noopener noreferrer">
													CSS3
												</a>
											</strong>
										</em>{" "}
										is a latest version of Cascading Style Sheets language used
										for describing the presentation of a document written in a
										HTML.
									</p>
								</Col>
							</Row>
						</div>
						{/* Development 04 Java Script  */}
						<div className="framework">
							<Row>
								<Col xs={12} sm={2}>
									<div className="icon text-right">
										<IoLogoJavascript />
									</div>
								</Col>
								<Col xs={12} sm={10}>
									{/* <h5>Development 04</h5> */}
									<h4>JavaScript</h4>
									<p>
										<em>
											<strong>
												<a
													href="https://developer.mozilla.org/en-US/docs/Web/JavaScript"
													target="_blank"
													rel="noopener noreferrer">
													JavaScript
												</a>
											</strong>
										</em>{" "}
										is a lightweight, scripting language for building
										interactive and complex JavaScript applications on web
										pages.
									</p>
								</Col>
							</Row>
						</div>
						{/* Development 05 React Bootstrap  */}
						<div className="framework">
							<Row>
								<Col xs={12} sm={2}>
									<div className="icon text-right">
										<FaBootstrap />
									</div>
								</Col>
								<Col xs={12} sm={10}>
									{/* <h5>Development 05</h5> */}
									<h4>React Bootstrap</h4>
									<p>
										<em>
											<strong>
												<a
													href="https://react-bootstrap.github.io/"
													target="_blank"
													rel="noopener noreferrer">
													React Bootstrap
												</a>
											</strong>
										</em>{" "}
										is the most popular front-end framework built as a true
										React component for faster and easier developing responsive,
										mobile first projects on the web.
									</p>
								</Col>
							</Row>
						</div>
						{/* Development 06 MATERIAL-UI */}
						<div className="framework">
							<Row>
								<Col xs={12} sm={2}>
									<div className="icon icon-svg text-right">
										<MaterialUi />
									</div>
								</Col>
								<Col xs={12} sm={10}>
									{/* <h5>Development 06</h5> */}
									<h4>Material-Ui</h4>
									<p>
										<em>
											<strong>
												<a
													href="https://material-ui.com/"
													target="_blank"
													rel="noopener noreferrer">
													Material-Ui
												</a>
											</strong>
										</em>{" "}
										is a framework for React components for faster and easier
										web development. It allows to build your own responsive
										design system.
									</p>
								</Col>
							</Row>
						</div>
						{/* Service 07 ProtVista  */}
						<div className="framework">
							<Row>
								<Col xs={12} sm={2}>
									<div className="icon text-right">
										<FaRegPaperPlane />
									</div>
								</Col>
								<Col xs={12} sm={10}>
									{/* <h5>Development 07</h5> */}
									<h4>ProtVista</h4>
									<p>
										<em>
											<strong>
												<a
													href=" https://github.com/ebi-webcomponents/nightingale"
													target="_blank"
													rel="noopener noreferrer">
													ProtVista
												</a>
											</strong>
										</em>{" "}
										/ nightingale is a library of re-usable data visualisation
										web components, allowing you to easily view multiple data
										sources within the same context.
									</p>
								</Col>
							</Row>
						</div>
					</Col>
					<Col xs={12} sm={6}>
						{/* Development 08 JSON  */}
						<div className="framework">
							<Row>
								<Col xs={12} sm={2}>
									<div className="icon-svg text-right">
										<JsonIcon />
									</div>
								</Col>
								<Col xs={12} sm={10}>
									{/* <h5>Development 10</h5> */}
									<h4>JSON</h4>
									<p>
										<em>
											<strong>
												<a
													href="https://www.json.org/"
													target="_blank"
													rel="noopener noreferrer">
													JSON
												</a>
											</strong>
										</em>{" "}
										stands for JavaScript Object Notation is a lightweight
										data-interchange format. It is easy for humans to read and
										write. It is easy for machines to parse and generate.
									</p>
								</Col>
							</Row>
						</div>
						{/* Development 09 axios  */}
						<div className="framework">
							<Row>
								<Col xs={12} sm={2}>
									<div className="icon-svg text-right">
										<AiOutlineApi />
									</div>
								</Col>
								<Col xs={12} sm={10}>
									{/* <h5>Development 09</h5> */}
									<h4>Axios</h4>
									<p>
										<em>
											<strong>
												<a
													href="https://github.com/axios/axios"
													target="_blank"
													rel="noopener noreferrer">
													Axios
												</a>
											</strong>
										</em>{" "}
										is a library that helps programmers make http requests to
										external resources and to retrieve data from external APIs
										so it can be displayed in the web pages.
									</p>
								</Col>
							</Row>
						</div>
						{/* Development 10 Python  */}
						<div className="framework">
							<Row>
								<Col xs={12} sm={2}>
									<div className="icon text-right">
										<FaPython />
									</div>
								</Col>
								<Col xs={12} sm={10}>
									{/* <h5>Development 10</h5> */}
									<h4>Python</h4>
									<p>
										<em>
											<strong>
												<a
													href="https://www.python.org/"
													target="_blank"
													rel="noopener noreferrer">
													Python
												</a>
											</strong>
										</em>{" "}
										is an object-oriented, high-level programming language with
										integrated dynamic semantics primarily for web and app
										development.
									</p>
								</Col>
							</Row>
						</div>
						{/* Development 11 MongoDB */}
						<div className="framework">
							<Row>
								<Col xs={12} sm={2}>
									<div className="icon icon-svg5 text-right">
										<DiMongodb />
									</div>
								</Col>
								<Col xs={12} sm={10}>
									<h4>MongoDB</h4>
									<p>
										<em>
											<strong>
												<a
													href="https://www.mongodb.com/"
													target="_blank"
													rel="noopener noreferrer">
													MongoDB
												</a>
											</strong>
										</em>{" "}
										is a cross-platform, JSON-like document-based, distributed
										database built for modern application developers and for the
										cloud era.
									</p>
								</Col>
							</Row>
						</div>
						{/* Service 12 Virtuoso */}
						<div className="framework">
							<Row>
								<Col xs={12} sm={2}>
									<div className="icon text-right">
										<AiFillDatabase />
									</div>
								</Col>
								<Col xs={12} sm={10}>
									<h4>Virtuoso</h4>
									<p>
										<em>
											<strong>
												<a
													href="https://virtuoso.openlinksw.com/"
													target="_blank"
													rel="noopener noreferrer">
													Virtuoso
												</a>
											</strong>
										</em>{" "}
										is a Data Virtualization platform that enables fast and
										flexible harmonization of disparate data that increases
										agility for users.
									</p>
								</Col>
							</Row>
						</div>
						{/* Service 13 Swagger */}
						<div className="framework">
							<Row>
								<Col xs={12} sm={2}>
									<div className="icon icon-svg text-right">
										<Swagger />
									</div>
								</Col>
								<Col xs={12} sm={10}>
									<h4>Swagger</h4>
									<p>
										<em>
											<strong>
												<a
													href="https://swagger.io/"
													target="_blank"
													rel="noopener noreferrer">
													Swagger
												</a>
											</strong>
										</em>{" "}
										is an open-source framework backed by a large ecosystem of
										tools that helps developers design, build, document, and
										consume RESTful web services.
									</p>
								</Col>
							</Row>
						</div>
						{/* Service 14 Flask */}
						<div className="framework">
							<Row>
								<Col xs={12} sm={2}>
									<div className="icon icon-svg text-right">
										<Flask />
									</div>
								</Col>
								<Col xs={12} sm={10}>
									<h4>Flask</h4>
									<p>
										<em>
											<strong>
												<a
													href="https://palletsprojects.com/p/flask/"
													target="_blank"
													rel="noopener noreferrer">
													Flask
												</a>
											</strong>
										</em>{" "}
										is a popular, lightweight, extensible micro web framework
										for building web applications with Python. Flask is built
										with a small core and easy-to-extend.
									</p>
								</Col>
							</Row>
						</div>
						{/* Development 11 D3.js  */}
						{/* <div className="framework">
							<Row>
								<Col xs={12} sm={2}>
									<div className="icon icon-svg text-right">
										<img
											src="images/icons/frameworks-icons/d3-js.svg"
											alt="d3.js-icon"
										/>
									</div>
								</Col>
								<Col xs={12} sm={10}>
									<h5>Development 11</h5>
									<h4>D3.js</h4>
									<p>
										<em>
											<strong>
												<a
													href="https://d3js.org/"
													target="_blank"
													rel="noopener noreferrer">
													D3.js
												</a>
											</strong>
										</em>{" "}
										stands for Data-Driven Documents. It is a JavaScript library
										for custom interactive data visualizations in the web
										browser using SVG, HTML and CSS.
									</p>
								</Col>
							</Row>
						</div> */}
					</Col>
				</Row>
			</Container>
		</React.Fragment>
	);
};
export default Frameworks;
