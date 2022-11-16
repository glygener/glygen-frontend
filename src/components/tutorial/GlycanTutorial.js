import React from "react";
import Grid from "@mui/material/Grid";
import HorizontalHeading from "../headings/HorizontalHeading";
import VerticalHeading from "../headings/VerticalHeading";
import Iframe from "react-iframe";
import { Typography } from "@mui/material";

export default function GlycanTutorial(props) {
	const horHeadSimpleOne = {
		h5VerticalText: "SIMPLE SEARCH",
		h2textTopStrongBefore: "How To",
		h2textTop: "Use",
		h2textTopStrongAfter: "Simple",
		h2textTop2: "Glycan Search",
	};
	const horHeadAdvancedeOne = {
		h5VerticalText: "ADVANCED SEARCH",
		h2textTopStrongBefore: "How To",
		h2textTop: "Use",
		h2textTopStrongAfter: "Advanced",
		h2textTop2: "Glycan Search",
	};
	const vertHeadAdvancedeOne = {
		h5VerticalText: "Advanced",
		h2textTop: "Finding a",
		h2textTopStrongAfter: "glycan",
		h2textTop2: "using its",
		h2textBottomStrongBefore: "GlyTouCan Accession",
	};
	const vertHeadAdvancedeTwo = {
		h5VerticalText: "Advanced",
		h2textTop: "Finding a",
		h2textTopStrongAfter: "glycan",
		h2textTop2: "based on its",
		h2textBottomStrongBefore: "chemical ",
		h2textBottom: "features or",
		h2textBottomStrongAfter: "biological",
		h2textBottom2: "context",
	};

	return (
		<>
			<div style={{ paddingBottom: "20px" }}>
				<HorizontalHeading post={horHeadSimpleOne} />
			</div>
			<Grid container spacing={3} justify="center">
				<Grid item xs={12} sm={6}>
					<Iframe
						src="//www.slideshare.net/slideshow/embed_code/key/1Gk9i2RWn1D9wV"
						width="100%"
						height="305"
						frameborder="0"
						marginwidth="0"
						marginheight="0"
						scrolling="no"
						style={{
							border: "1px solid #CCC",
							borderWidth: "1px",
							marginBottom: "5px",
							maxWidth: "100%",
						}}
						allowfullscreen>
						{" "}
					</Iframe>
					<div style={{ marginBottom: "5px" }}>
						{" "}
						<strong>
							{" "}
							<a
								href="//www.slideshare.net/GlyGen/how-to-use-simple-glycan-search-tutorial-131972574"
								title="How To Use Simple Glycan Search Tutorial"
								target="_blank"
								rel="noopener noreferrer">
								How To Use Simple Glycan Search Tutorial
							</a>{" "}
						</strong>{" "}
						from{" "}
						<strong>
							<a
								href="https://www.slideshare.net/GlyGen"
								target="_blank"
								rel="noopener noreferrer">
								GlyGen
							</a>
						</strong>{" "}
					</div>
				</Grid>
				<Grid item xs={12} sm={6} className="tutorial-text-middle">
					<Typography>
						You can search for glycans by specifying their GlyTouCan accession
						numbers, their specific structures or the specific biochemical
						contexts within which they are found.
					</Typography>
					<div style={{ marginBottom: "20px" }}></div>
					<Typography>
						This tutorial was created using a portal version: 1.0.1
						(09/19/2018).
					</Typography>
				</Grid>
			</Grid>
			{/* Advanced Search */}
			<div className="content-box-sm">
				<HorizontalHeading post={horHeadAdvancedeOne} />
			</div>
			<Grid container spacing={3} justify="center">
				<Grid item xs={12} sm={6} className="tutorial-text-middle">
					<Typography>
						You can search for glycans by specifying their chemical features of
						biological context. In many cases, you may not have this information
						but will have other information about the glycan or collection of
						glycans that makes them interesting to you.
					</Typography>
					<div style={{ marginBottom: "20px" }}></div>
					<Typography>
						This tutorial was created using a portal version: 1.0.1
						(09/19/2018).
					</Typography>
				</Grid>
				<Grid item xs={12} sm={6}>
					<Iframe
						src="//www.slideshare.net/slideshow/embed_code/key/2taO0glBKuZWQx"
						width="100%"
						height="305"
						frameborder="0"
						marginwidth="0"
						marginheight="0"
						scrolling="no"
						style={{
							border: "1px solid #CCC",
							borderWidth: "1px",
							marginBottom: "5px",
							maxWidth: "100%",
						}}
						allowfullscreen>
						{" "}
					</Iframe>{" "}
					<div style={{ marginBottom: "5px" }}>
						{" "}
						<strong>
							{" "}
							<a
								href="//www.slideshare.net/GlyGen/how-to-use-advanced-glycan-search-tutorial-131973162"
								title="How To Use Advanced Glycan Search Tutorial"
								target="_blank"
								rel="noopener noreferrer">
								How To Use Advanced Glycan Search Tutorial
							</a>{" "}
						</strong>{" "}
						from{" "}
						<strong>
							<a
								href="https://www.slideshare.net/GlyGen"
								target="_blank"
								rel="noopener noreferrer">
								GlyGen
							</a>
						</strong>{" "}
					</div>
				</Grid>
			</Grid>
			{/* Advanced Search Finding a glycan using its GlyTouCan Accession */}
			{/* <div className='content-box-sm'> */}
			<VerticalHeading post={vertHeadAdvancedeOne} />
			{/* </div> */}
			<Grid container spacing={3} justify="center">
				<Grid item xs={12} sm={6}>
					<Iframe
						width="100%"
						height="305"
						src="https://www.youtube.com/embed/BlhCYJM3G30?rel=0"
						frameborder="0"
						marginwidth="0"
						marginheight="0"
						scrolling="no"
						allow="autoplay; encrypted-media"
						allowfullscreen></Iframe>
					<div style={{ marginBottom: "5px" }}>
						{" "}
						<strong>
							{" "}
							<a
								href="https://www.youtube.com/embed/BlhCYJM3G30?rel=0"
								title="How To Use Advanced Glycan Search Tutorial"
								target="_blank"
								rel="noopener noreferrer">
								How To Use Advanced Glycan Search Tutorial
							</a>{" "}
						</strong>{" "}
						from <strong>GlyGen</strong>{" "}
					</div>
				</Grid>
				<Grid item xs={12} sm={6} className="tutorial-text-middle">
					<Typography>
						This tutorial describes how to initiate the exploration of GlyGen
						data by searching for a specific glycan when its GlyTouCan accession
						is known.
					</Typography>
					<div style={{ marginBottom: "20px" }}></div>
					<Typography>
						This tutorial was created using a portal version: 1.0.1
						(09/19/2018).
					</Typography>
				</Grid>
			</Grid>
			{/* ADVANCED SEARCH: How to Use Advanced Glycan Search */}
			{/* <div className='content-box-sm'> */}
			<VerticalHeading post={vertHeadAdvancedeTwo} />
			{/* </div> */}
			<Grid container spacing={3} justify="center">
				<Grid item xs={12} sm={6} className="tutorial-text-middle">
					<Typography>
						This tutorial illustrates how to search for a glycan or collection
						of glycans based on their general properties, structural features,
						attachment to a glycoprotein, mechanisms of biosynthesis.
					</Typography>
					<div style={{ marginBottom: "20px" }}></div>
					<Typography>
						This tutorial was created using a portal version: 1.0.1
						(09/19/2018).
					</Typography>
				</Grid>
				<Grid item xs={12} sm={6}>
					<Iframe
						src="https://www.youtube.com/embed/7TEjBsolbRY?rel=0"
						width="100%"
						height="305"
						frameborder="0"
						marginwidth="0"
						marginheight="0"
						scrolling="no"
						allow="autoplay; encrypted-media"
						allowfullscreen></Iframe>{" "}
					<div style={{ marginBottom: "5px" }}>
						{" "}
						<strong>
							{" "}
							<a
								href="https://www.youtube.com/embed/7TEjBsolbRY?rel=0"
								title="How To Use Advanced Glycan Search Tutorial"
								target="_blank"
								rel="noopener noreferrer">
								How To Use Advanced Glycan Search Tutorial
							</a>{" "}
						</strong>{" "}
						from <strong>GlyGen</strong>{" "}
					</div>
				</Grid>
			</Grid>
		</>
	);
}
