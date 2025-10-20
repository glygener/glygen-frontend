import React from "react";
import { styled } from '@mui/material/styles';
import PropTypes from "prop-types";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import PersonPinCircleOutlinedIcon from "@mui/icons-material/PersonPinCircleOutlined";
// import FormatQuoteOutlinedIcon from "@mui/icons-material/FormatQuoteOutlined";
import quoteIcon from "../../images/icons/quote-open-outline-white.svg";
import cfdeIcon from "../../images/icons/CFDE-logo.png";
import demo from "../../images/icons/demo.png";
import glyspaceIcon from "../../images/icons/glyspace-logo.png";
import routeConstants from "../../data/json/routeConstants.json";
import { Link } from "react-router-dom";
import { Image } from "react-bootstrap";
import {
  NIH_COMMONFUND_DATAECOSYSTEM,
  GLYSPACE,
  GLYGEN_BUILD
} from "../../envVariables";


const PREFIX = 'MainFeaturedCard';

const classes = {
  mainFeaturedCard: `${PREFIX}-mainFeaturedCard`,
  overlay: `${PREFIX}-overlay`,
  mainFeaturedCardContent: `${PREFIX}-mainFeaturedCardContent`,
  mainFeaturedCardButtons: `${PREFIX}-mainFeaturedCardButtons`
};

const StyledPaper = styled(Paper)((
  {
    theme
  }
) => ({
  [`&.${classes.mainFeaturedCard}`]: {
    position: "relative",
    backgroundColor: theme.palette.grey[800],
    color: theme.palette.common.white,
    marginBottom: theme.spacing(4),
    // backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  },

  [`& .${classes.overlay}`]: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: "rgba(0,0,0,.4)",
  },

  [`& .${classes.mainFeaturedCardContent}`]: {
    position: "relative",
    textAlign: "center",
    padding: theme.spacing(2),
    [theme.breakpoints.up("md")]: {
      padding: theme.spacing(3, 4),
      textAlign: "left",
    },
  },

  // linkText: {
  // 	color: "#ffffff !important",
  // 	fontWeight: "600",
  // 	"&:hover": {
  // 		color: "#57affa",
  // 	},
  // },
  [`& .${classes.mainFeaturedCardButtons}`]: {
    position: "relative",
    textAlign: "center",
    padding: theme.spacing(2),
    [theme.breakpoints.up("md")]: {
      padding: theme.spacing(3, 4),
      textAlign: "right",
    },
  }
}));

export default function MainFeaturedCard(props) {

  const { post } = props;
  const demoForm = "https://docs.google.com/forms/d/e/1FAIpQLSdUwz7SiTD9f0uEieTjHIqBllY5OTfEa0G1SiitQmrbMVEhUw/viewform";

  return (
    <StyledPaper className={classes.mainFeaturedCard} style={{ backgroundImage: `url(${post.image})` }}>
      {<img style={{ display: "none" }} src={post.image} alt={post.imageText} />}
      <div className={classes.overlay} />
      {/* <Grid container className="gg-align-center"> */}
      <Grid container>
        {/* <Grid item sm={ 12 } lg={ 8 }> */}
        <Grid item size= {{ sm:12, md:5, lg:6 }} className="text-left me-3">
          <div className={classes.mainFeaturedCardContent} style={{ letterSpacing: "1px" }}>
            <Typography component="h5" variant="h6" color="#fff" gutterBottom>
              {post.title}
            </Typography>
            <Typography component="h6" color="#fff" paragraph>
              {post.description}
            </Typography>
          </div>
        </Grid>
        {/* <Grid item sm={12} md={2} lg={2} className="text-right"></Grid> */}
        <Grid item size= {{ sm:12, md:3, lg:3 }} className="btn-outline-white-col">
          <div className={classes.mainFeaturedCardButtons}>
          {GLYGEN_BUILD === "glygen" && <div className="btn-outline-white">
              <a href={demoForm} target="_blank" rel="noopener noreferrer" className="gg-btn-outline-blue text-start">
                <span
                  style={{
                    paddingRight: "15px",
                    paddingLeft: "5px"
                  }}
                  class="pagination-centered"
                >
                  <Image
                    className="img-home"
                    src={demo}
                    alt={"cfde icon"}
                  />
                </span>                
                Schedule A Demo
              </a>
            </div>}
            {GLYGEN_BUILD === "glygen" && <div className="btn-outline-white">
              <a href={GLYSPACE} target="_blank" rel="noopener noreferrer" className="gg-btn-outline-white text-start">
                <span
                  style={{
                    paddingRight: "15px",
                    paddingLeft: "5px",
                  }}
                  class="pagination-centered"
                >
                  <Image
                    className="img-home"
                    src={glyspaceIcon}
                    alt={"glyspace icon"}
                  />
                </span>
                GlySpace Alliance
                </a>
            </div>}
            {GLYGEN_BUILD === "glygen" && <div className="btn-outline-white">
              <a href={NIH_COMMONFUND_DATAECOSYSTEM} target="_blank" rel="noopener noreferrer" className="gg-btn-outline-white text-start">
                <span
                  style={{
                    paddingRight: "15px",
                    paddingLeft: "5px"
                  }}
                  class="pagination-centered"
                >
                  <Image
                    className="img-home"
                    src={cfdeIcon}
                    alt={"cfde icon"}
                  />
                </span>                
                Member of CFDE
              </a>
            </div>}
          </div>
        </Grid>
        <Grid item size= {{ sm: 12, md: 3, lg: 2 }} className="btn-outline-white-col">
          <div className={classes.mainFeaturedCardButtons}>
            <div className="btn-outline-white">
              <Link to={routeConstants.howToCite} className="gg-btn-outline-blue">
                <span
                  style={{
                    paddingRight: "15px",
                    paddingLeft: "5px",
                  }}
                >
                  {/* <FormatQuoteOutlinedIcon
										style={{
											fontSize: "26px",
										}}
									/> */}
                  <img
                    component="img"
                    style={{
                      paddingBottom: "4px",
                      paddingTop: "4px",
                    }}
                    src={quoteIcon}
                    alt="quote icon"
                  />
                </span>
                How To Cite
              </Link>
            </div>
            {GLYGEN_BUILD === "glygen" && <div className="btn-outline-white">
              <Link to={routeConstants.tryMe} className="gg-btn-outline-white">
                <span style={{ paddingRight: "10px" }}>
                  <HourglassEmptyIcon style={{ fontSize: "24px" }} />
                </span>
                Quick Start
              </Link>
            </div>}
            <div className="btn-outline-white">
              <Link to={routeConstants.about} className="gg-btn-outline-white">
                <span style={{ paddingRight: "10px" }}>
                  <PersonPinCircleOutlinedIcon style={{ fontSize: "24px" }} />
                </span>
                Our Mission
              </Link>
            </div>
            {GLYGEN_BUILD === "biomarker" && <div className="btn-outline-white">
              <a href={NIH_COMMONFUND_DATAECOSYSTEM} target="_blank" rel="noopener noreferrer" className="gg-btn-outline-white text-center">
                <span
                  style={{
                    paddingRight: "15px",
                    paddingLeft: "5px"
                  }}
                  class="pagination-centered"
                >
                  <Image
                    className="img-home"
                    src={cfdeIcon}
                    alt={"cfde icon"}
                  />
                </span>                
                CFDE
              </a>
            </div>}
          </div>
        </Grid>
      </Grid>
    </StyledPaper>
  );
}

MainFeaturedCard.propTypes = {
  post: PropTypes.object,
};

// Proposal 1
// import React from "react";
// import PropTypes from "prop-types";
// import { makeStyles } from "@mui/styles";
// import Paper from "@mui/material/Paper";
// import Typography from "@mui/material/Typography";
// import Grid from "@mui/material/Grid";
// import { Link, NavLink } from "react-router-dom";
// import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
// import PersonPinCircleOutlinedIcon from "@mui/icons-material/PersonPinCircleOutlined";
// import quoteIcon from "../../images/icons/quote-open-outline-white.svg";
// import routeConstants from "../../data/json/routeConstants.json";


// 	mainFeaturedCard: {
// 		position: "relative",
// 		backgroundColor: theme.palette.grey[800],
// 		color: theme.palette.common.white,
// 		marginBottom: theme.spacing(4),
// 		// backgroundImage: 'url(https://source.unsplash.com/random)',
// 		backgroundSize: "cover",
// 		backgroundRepeat: "no-repeat",
// 		backgroundPosition: "center",
// 	},
// 	overlay: {
// 		position: "absolute",
// 		top: 0,
// 		bottom: 0,
// 		right: 0,
// 		left: 0,
// 		backgroundColor: "rgba(0,0,0,.3)",
// 	},
// 	mainFeaturedCardContent: {
// 		position: "relative",
// 		// height: "400px !important",
// 		textAlign: "center",
// 		padding: theme.spacing(3),
// 		[theme.breakpoints.up("md")]: {
// 			padding: theme.spacing(8),
// 		},
// 	},
// 	linkText: {
// 		color: "#ffffff !important",
// 		fontWeight: "600",
// 		"&:hover": {
// 			color: "#57affa",
// 		},
// 	},
// }));
// export default function MainFeaturedCard(props) {

// 	const { post } = props;

// 	return (
// 		<Paper
// 			className={classes.mainFeaturedCard}
// 			style={{ backgroundImage: `url(${post.image})` }}>
// 			{
// 				<img
// 					style={{ display: "none" }}
// 					src={post.image}
// 					alt={post.imageText}
// 				/>
// 			}
// 			<div className={classes.overlay} />
// 			<Grid container className="gg-align-center">
// 				<Grid item sm={12} lg={8}>
// 					<div className={classes.mainFeaturedCardContent}>
// 						<Typography
// 							component="h5"
// 							variant="h6"
// 							color="inherit"
// 							gutterBottom
// 							// style={ { letterSpacing: "1px" } }
// 						>
// 							{post.title}
// 						</Typography>
// 						<Typography
// 							component="h6"
// 							color="inherit"
// 							paragraph
// 							// style={ { letterSpacing: "1px" } }
// 						>
// 							{post.description}
// 						</Typography>
// 						{/* <Typography paragraph style={{ marginBottom: "40px" }}>
// 							<Link as={NavLink} to={post.toAbout} className={classes.linkText}>
// 								{post.linkText}
// 							</Link>
// 						</Typography> */}
// 						<Typography paragraph style={{ marginTop: "60px" }}>
// 							<Link
// 								as={NavLink}
// 								to={routeConstants.howToCite}
// 								className="gg-btn-outline-white">
// 								<span>
// 									<img
// 										component="img"
// 										style={{ paddingRight: "15px", marginTop: "-5px" }}
// 										src={quoteIcon}
// 										alt="quote icon"
// 									/>
// 								</span>
// 								How To Cite
// 							</Link>
// 							<Link
// 								as={NavLink}
// 								to={routeConstants.tryMe}
// 								className="gg-btn-outline-white">
// 								<span>
// 									<HourglassEmptyIcon
// 										style={{ paddingRight: "10px", marginTop: "-5px" }}
// 									/>
// 								</span>
// 								Quick Start
// 							</Link>
// 							<Link
// 								as={NavLink}
// 								to={routeConstants.about}
// 								className="gg-btn-outline-white">
// 								<span>
// 									<PersonPinCircleOutlinedIcon
// 										style={{ paddingRight: "10px", marginTop: "-5px" }}
// 									/>
// 								</span>
// 								Our Mission
// 							</Link>
// 						</Typography>
// 						<Grid item></Grid>
// 					</div>
// 				</Grid>
// 			</Grid>
// 		</Paper>
// 	);
// }

// MainFeaturedCard.propTypes = {
// 	post: PropTypes.object,
// };

// Proposal 2
// import React from "react";
// import PropTypes from "prop-types";
// import { makeStyles } from "@mui/styles";
// import Paper from "@mui/material/Paper";
// import Typography from "@mui/material/Typography";
// import Grid from "@mui/material/Grid";
// import { Link } from "react-router-dom";
// import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
// import PersonPinCircleOutlinedIcon from "@mui/icons-material/PersonPinCircleOutlined";
// import quoteIcon from "../../images/icons/quote-open-outline-white.svg";
// import routeConstants from "../../data/json/routeConstants.json";


// 	mainFeaturedCard: {
// 		position: "relative",
// 		backgroundColor: theme.palette.grey[800],
// 		color: theme.palette.common.white,
// 		marginBottom: theme.spacing(4),
// 		// backgroundImage: 'url(https://source.unsplash.com/random)',
// 		backgroundSize: "cover",
// 		backgroundRepeat: "no-repeat",
// 		backgroundPosition: "center",
// 	},
// 	overlay: {
// 		position: "absolute",
// 		top: 0,
// 		bottom: 0,
// 		right: 0,
// 		left: 0,
// 		backgroundColor: "rgba(0,0,0,.3)",
// 	},
// 	mainFeaturedCardContent: {
// 		position: "relative",
// 		// height: "400px !important",
// 		textAlign: "center",
// 		padding: theme.spacing(3),
// 		[theme.breakpoints.up("md")]: {
// 			padding: theme.spacing(3),
// 		},
// 	},
// 	linkText: {
// 		color: "#ffffff !important",
// 		fontWeight: "600",
// 		"&:hover": {
// 			color: "#57affa",
// 		},
// 	},
// }));
// export default function MainFeaturedCard(props) {

// 	const { post } = props;

// 	return (
// 		<Paper
// 			className={classes.mainFeaturedCard}
// 			style={{ backgroundImage: `url(${post.image})` }}>
// 			{
// 				<img
// 					style={{ display: "none" }}
// 					src={post.image}
// 					alt={post.imageText}
// 				/>
// 			}
// 			<div className={classes.overlay} />
// 			<Grid container className="gg-align-center">
// 				<Grid item sm={12} lg={9}>
// 					<div className={classes.mainFeaturedCardContent}>
// 						<Typography
// 							component="h5"
// 							variant="h6"
// 							color="inherit"
// 							gutterBottom
// 							// style={ { letterSpacing: "1px" } }
// 						>
// 							{post.title}
// 						</Typography>
// 						<Typography
// 							component="h6"
// 							color="inherit"
// 							paragraph
// 							// style={ { letterSpacing: "1px" } }
// 						>
// 							{post.description}
// 						</Typography>
// 						{/* <Typography paragraph style={{ marginBottom: "40px" }}>
// 							<Link as={NavLink} to={post.toAbout} className={classes.linkText}>
// 								{post.linkText}
// 							</Link>
// 						</Typography> */}
// 						<Typography paragraph style={{ marginTop: "30px" }}>
// 							<Link
// 								to={routeConstants.howToCite}
// 								className="gg-btn-outline-white">
// 								<span>
// 									<img
// 										component="img"
// 										style={{ paddingRight: "15px", marginTop: "-5px" }}
// 										src={quoteIcon}
// 										alt="quote icon"
// 									/>
// 								</span>
// 								How To Cite
// 							</Link>
// 							<Link to={routeConstants.tryMe} className="gg-btn-outline-white">
// 								<span>
// 									<HourglassEmptyIcon
// 										style={{ paddingRight: "10px", marginTop: "-5px" }}
// 									/>
// 								</span>
// 								Quick Start
// 							</Link>
// 							<Link to={routeConstants.about} className="gg-btn-outline-white">
// 								<span>
// 									<PersonPinCircleOutlinedIcon
// 										style={{ paddingRight: "10px", marginTop: "-5px" }}
// 									/>
// 								</span>
// 								Our Mission
// 							</Link>
// 						</Typography>
// 						<Grid item></Grid>
// 					</div>
// 				</Grid>
// 			</Grid>
// 		</Paper>
// 	);
// }

// MainFeaturedCard.propTypes = {
// 	post: PropTypes.object,
// };

// 07 / 27 / 2020;
