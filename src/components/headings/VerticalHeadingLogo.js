import React from "react";
import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";
import { Grid, Link } from "@mui/material";
import glygenLogoDownload from "../../images/glygen_logos/logo-glygen-blue-36.svg";
import CardMedia from "@mui/material/CardMedia";
import GetAppIcon from "@mui/icons-material/GetApp";

export default function VerticalHeadingLogo(props) {
	const { post, logo = true } = props;

	return (
		<div className="content-box-md" id={props.id}>
			<Grid container alignItems="center" maxWidth="lg" className="vert-head-logo-container">
				<Grid item size= {{ xs: 8, sm: 8, md: 9, lg: 9 }}>
					<div className="vertical-heading">
						<Typography variant="h5">{post.h5VerticalText}</Typography>
						<Typography variant="h2">
							<span>
								<strong>{post.h2textTopStrongBefore}</strong>
							</span>{" "}
							{post.h2textTop}{" "}
							<span>
								<strong>{post.h2textTopStrongAfter}</strong>
							</span>
							<br />
							<span>
								<strong>{post.h2textBottomStrongBefore}</strong>
							</span>{" "}
							{post.h2textBottom}{" "}
							<span>
								<strong>{post.h2textBottomStrongAfter}</strong>
							</span>
						</Typography>
						<Typography
							variant="p"
							style={{ fontSize: "18px", margin: "0 0 0 35px" }}>
							{post.pText}
						</Typography>
					</div>
				</Grid>
				{logo && <Grid item size= {{ xs: 4, sm: 4, md: 3, lg: 3 }}>
					<Link
						className="align-logo"
						alignContent="bottom"
						href="https://github.com/glygener/glygen-frontend/tree/master/src/images/glygen_logos"
						target="_blank">
						<div>
						<div>
							<GetAppIcon /> Download Logo
						</div>
						<CardMedia
							component="img"
							image={glygenLogoDownload}
							title="Download GlyGen Logo"
						/>
						</div>
					</Link>
				</Grid>}
			</Grid>
		</div>
	);
}

VerticalHeadingLogo.propTypes = {
	post: PropTypes.object,
};
