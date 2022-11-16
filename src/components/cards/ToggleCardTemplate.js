import React from "react";
// import Container from '@mui/material/Container';
import CssBaseline from "@mui/material/CssBaseline";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

import "../../css/detail.css";
// import { Col, Row } from 'react-bootstrap';
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

// https://smellycode.com/accordion-in-reactjs/
// const ToggleCardlTemplate = () => {
export default function ToggleCardlTemplate() {
	const [collapsed, setCollapsed] = React.useState(true);

	function toggleCollapse() {
		setCollapsed((prevValue) => !prevValue);
	}

	const expandIcon = !collapsed ? (
		<ExpandMoreIcon className="expand-arrow" />
	) : (
		// <ExpandLessIcon className={'expand-arrow' + ' expand-arrow-expanded'} />
		<ExpandLessIcon className={"expand-arrow" + " expand-arrow-expanded"} />
		// <ExpandMoreIcon className='expand-arrow' />
	);

	return (
		<React.Fragment>
			<CssBaseline />
			{/* <Container maxWidth='xl' className='gg-container'> */}
			<Accordion
				defaultActiveKey="0"
				className="panel-width"
				style={{ padding: "20px 0" }}>
				<Card key="0">
					<Accordion.Toggle
						as={Card.Header}
						eventKey="0"
						onClick={() => toggleCollapse()}
						className="panelHeadBgr panelHeadText arrow">
						<h3>ToggleCardlTemplate</h3>
						<span className={"text-right"}>{expandIcon}</span>
					</Accordion.Toggle>
					<Accordion.Collapse eventKey="0" out={!collapsed}>
						<Card.Body>
							Your body text is here for ToggleCardlTemplate
						</Card.Body>
					</Accordion.Collapse>
				</Card>
			</Accordion>
			{/* </Container> */}
		</React.Fragment>
	);
}
// export default ToggleCardlTemplate;

//
// 	 <Accordion
// 	defaultActiveKey='0'
// 	className='panel-width'
// 	style={{ padding: '20px 0' }}>
// 	<Card>
// 		<Accordion.Toggle
// 			as={Card.Header}
// 			eventKey='0'
// 			className='panelHeadBgr panelHeadText'>
// 			<h3>Biosynthetic enzyme</h3>
// 		</Accordion.Toggle>
// 		<Accordion.Collapse eventKey='0'>
// 			<Card.Body>
// 				{enzyme && enzyme.length !== 0 && (
// 					<ClientPaginatedTable data={enzyme} columns={bioEnzymeColumns} />
// 				)}
// 			</Card.Body>
// 		</Accordion.Collapse>
// 	</Card>
// </Accordion>; */
//

// Motif
//
// {/* <Accordion
// defaultActiveKey='0'
// className='panel-width'
// style={{ padding: '20px 0' }}>
// <Card>
//   <Accordion.Toggle
//     as={Card.Header}
//     eventKey='0'
//     className='panelHeadBgr panelHeadText'>
//     <h3>Motif</h3>
//   </Accordion.Toggle>
//   <Accordion.Collapse eventKey='0'>
//     <Card.Body>
//       {motifs && (
//         <>
//           <b> Motif image:</b>
//           <Row>
//             {motifs.map(motif => (
//               <Col>
//                 <div key={motif.id} className='img-motif-wrapper'>
//                   <img
//                     className='img-motif'
//                     src={glycanImageUrl + motif.id}
//                     alt='Cartoon'
//                   />
//                 </div>
//                 <span>
//                   <a href={''}>{motif.name}</a>
//                 </span>
//               </Col>
//             ))}
//           </Row>
//         </>
//       )}
//     </Card.Body>
//   </Accordion.Collapse>
// </Card>
// </Accordion> */}
//

//
// 	<Accordion
// 	defaultActiveKey='0'
// 	className='panel-width'
// 	style={{ padding: '20px 0' }}>
// 	<Card>
// 		<Accordion.Toggle
// 			as={Card.Header}
// 			eventKey='0'
// 			className='panelHeadBgr panelHeadText'>
// 			<h3>Digital Sequence</h3>
// 		</Accordion.Toggle>
// 		<Accordion.Collapse eventKey='0'>
// 			<Card.Body className='text-responsive'>
// 				<strong>IUPAC</strong>
// 				<p>{iupac}</p>
// 				<strong>WURCS</strong>
// 				<p>{wurcs}</p>
// 				<strong>GlycoCT</strong>
// 				<p>{glycoct}</p>
// 				<strong>InChI</strong>
// 				<p>{inchi}</p>
// 				<strong>GLYCAM IUPAC</strong>
// 				<p>{glycam}</p>
// 				<strong>Isomeric SMILES</strong>
// 				<p>{smiles_isomeric}</p>
// 			</Card.Body>
// 		</Accordion.Collapse>
// 	</Card>
// </Accordion>; */
//

// .text-overflow {
// 	white-space: pre-wrap !important;
// }

// .img-motif-wrapper {
// 	overflow: hidden;
// 	z-index: -9999;
// 	padding: 0.5em;
// 	/* width: 100%; */
// 	margin-top: 20px;
// 	margin-bottom: 0px;
// 	/* width: 500px; */
// }
// .img-motif {
// 	/* display: block; */
// 	max-width: 500px;
// 	max-height: 160px;
// 	width: auto;
// 	height: auto;
// 	-webkit-transform: scale(1);
// 	transform: scale(0.8);
// 	-webkit-transition: 0.3s ease-in-out;
// 	transition: 0.3s ease-in-out;
// 	box-shadow: 10px 10px 5px #ddd;
// 	z-index: 99999;
// }
// .img-motif:hover {
// 	-webkit-transform: scale(1.2);
// 	transform: scale(1);
// 	-webkit-transition: 0.3s ease-in-out;
// 	transition: 0.3s ease-in-out;
// 	z-index: 99999;
// }

// .panelHeadText h3 {
// 	position: relative;
// }

// .btn-up h3::before {
// 	-webkit-transform: rotate(45deg);
// 	-moz-transform: rotate(45deg);
// 	-ms-transform: rotate(45deg);
// 	-o-transform: rotate(45deg);
// 	transform: rotate(45deg);
// 	content: '';
// 	position: absolute;
// 	display: block;
// 	width: 15px;
// 	height: 15px;
// 	border-top: 2px solid green;
// 	border-left: 2px solid green;
// 	float: right !important;
// 	/* transition: all 0.5s; */
// 	right: 24px;
// 	top: 50%;
// 	transition: 0.3s transform ease-in-out;
// 	display: inline-block;
// }
// .btn-down ::before {
// 	transform: rotate(0deg);
// }

// .btn-down .btn-up h3::before {
// 	-webkit-transform: rotate(-225deg);
// 	-moz-transform: rotate(-2245deg);
// 	-ms-transform: rotate(-225deg);
// 	-o-transform: rotate(-225deg);
// 	transform: rotate(-225deg);
// 	-webkit-transition-property: -webkit-transform;
// 	-moz-transition-property: -moz-transform;
// 	transition-property: transform;
// 	-webkit-transition-duration: 0.2s;
// 	-moz-transition-duration: 0.2s;
// 	transition-duration: 0.2s;
// }
