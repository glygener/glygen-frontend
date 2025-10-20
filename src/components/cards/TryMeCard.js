import React, { useEffect, useReducer, useState } from "react";
import { styled } from '@mui/material/styles';
import PropTypes from "prop-types";
// import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import ListGroup from "react-bootstrap/ListGroup";
import stringConstants from "../../data/json/stringConstants";
import tryMe from "../../data/json/tryMe";
import PageLoader from "../load/PageLoader";
import DialogAlert from "../alert/DialogAlert";
import TextAlert from "../alert/TextAlert";
import routeConstants from "../../data/json/routeConstants";
import { axiosError } from "../../data/axiosError";
import { logActivity } from "../../data/logging";
import {
	getGlycanToBiosynthesisEnzymes,
	getGlycanToGlycoproteins,
	getBiosynthesisEnzymeToGlycans,
} from "../../data/usecases";
import { useNavigate } from "react-router-dom";
const PREFIX = 'TryMeCard';

const classes = {
    cardAction: `${PREFIX}-cardAction`,
    cardTitle: `${PREFIX}-cardTitle`,
    cardDetails: `${PREFIX}-cardDetails`,
    selected: `${PREFIX}-selected`
};

const Root = styled('div')((
    {
        theme
    }
) => ({
    [`& .${classes.cardAction}`]: {
		display: "inline-flex",
	},

    [`& .${classes.cardTitle}`]: {
		textAlign: "center",
		paddingBottom: "8px",
	},

    [`& .${classes.cardDetails}`]: {
		flex: 1,
	},

    [`& .${classes.selected}`]: {
		color: "#2F78B7",
	}
}));

/**
 * Try me card component.
 */
export default function TryMeCard(props) {
	let quickSearch = stringConstants.quick_search;


	const navigate = useNavigate();

	const [pageLoading, setPageLoading] = useState(false);
	const [alertDialogInput, setAlertDialogInput] = useReducer(
		(state, newState) => ({ ...state, ...newState }),
		{ show: false, id: "" }
	);

	const [alertText, setAlertText] = useReducer(
		(state, newState) => ({ ...state, ...newState }),
		{
			question: "",
			input: { show: false, id: "" },
			default: { show: false, id: "" },
		}
	);

	/**
	 * Try me question 1 function for glycan to biosynthesis enzymes usecase.
	 */
	const searchQuestion1 = () => {
		setPageLoading(true);
		logActivity("user", "", "Performing Try Me Search");
		let message = "Try Me Search Question_1 = /9606/G46836GH";
		getGlycanToBiosynthesisEnzymes(9606, "G72079JG")
			.then((response) => {
				if (response.data["list_id"] !== "") {
					setPageLoading(false);
					logActivity("user", response.data["list_id"], message);
					navigate(
						routeConstants.proteinList +
							response.data["list_id"] +
							"/" +
							quickSearch.question_tryMe1.tryMeId
					);
				} else {
					setPageLoading(false);
					logActivity("user", "", "No results. " + message);
					setAlertText({
						question: quickSearch.question_tryMe1.tryMeId,
						input: {
							show: true,
							id: stringConstants.errors.tryMeSerarchError.id,
						},
					});
				}
			})
			.catch(function (error) {
				axiosError(error, "", message, setPageLoading, setAlertDialogInput);
			});
	};

	/**
	 * Try me question 2 function for glycan to glycoproteins usecase.
	 */
	const searchQuestion2 = () => {
		setPageLoading(true);
		logActivity("user", "", "Performing Try Me Search");
		let message = "Try Me Search Question_2 = /0/G77252PU";
		getGlycanToGlycoproteins(0, "G77252PU")
			.then((response) => {
				if (response.data["list_id"] !== "") {
					setPageLoading(false);
					logActivity("user", response.data["list_id"], message);
					navigate(
						routeConstants.proteinList +
							response.data["list_id"] +
							"/" +
							quickSearch.question_tryMe2.tryMeId
					);
				} else {
					setPageLoading(false);
					logActivity("user", "", "No results. " + message);
					setAlertText({
						question: quickSearch.question_tryMe2.tryMeId,
						input: {
							show: true,
							id: stringConstants.errors.tryMeSerarchError.id,
						},
					});
				}
			})
			.catch(function (error) {
				axiosError(error, "", message, setPageLoading, setAlertDialogInput);
			});
	};

	/**
	 * Try me question 3 function for biosynthesis enzyme to glycans usecase.
	 */
	const searchQuestion3 = () => {
		setPageLoading(true);
		logActivity("user", "", "Performing Try Me Search");
		let message = "Try Me Search Question_3 = /10090/P27808-1";
		getBiosynthesisEnzymeToGlycans(10090, "P27808-1")
			.then((response) => {
				if (response.data["list_id"] !== "") {
					logActivity("user", response.data["list_id"], message);
					navigate(
						routeConstants.glycanList +
							response.data["list_id"] +
							"/" +
							quickSearch.question_tryMe3.tryMeId
					);
					setPageLoading(false);
				} else {
					logActivity("user", "", "No results. " + message);
					setPageLoading(false);
					setAlertText({
						question: quickSearch.question_tryMe3.tryMeId,
						input: {
							show: true,
							id: stringConstants.errors.tryMeSerarchError.id,
						},
					});
				}
			})
			.catch(function (error) {
				axiosError(error, "", message, setPageLoading, setAlertDialogInput);
			});
	};
	
	/**
	 * useEffect for setting alert text.
	 */
	useEffect(() => {
		document.addEventListener("click", () => {
			setAlertText({ question: "", input: { show: false, id: "" } });
		});
	}, []);

	return (
        <Root id={props.id}>
            <Grid item size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
				<PageLoader pageLoading={pageLoading} />
				<DialogAlert
					alertInput={alertDialogInput}
					setOpen={(input) => {
						setAlertDialogInput({ show: input });
					}}
				/>
				<Card className="card">
					<div className={classes.cardDetails}>
						<CardContent>
							<h4 className={classes.cardTitle}>Try Me</h4>
							<ListGroup as="p">
								<ListGroup.Item action onClick={searchQuestion1}>
									{tryMe.question_tryMe1.text.split("{0}")[0]}
									<span className={classes.selected}>
										the lipid-linked N-glycan precursor GlcNAc2Man9Glc3 (G72079JG)
									</span>
									{tryMe.question_tryMe1.text.split("{0}")[1]}
									{/* <div style={{ paddingBottom: "10px" }}></div> */}
									<TextAlert
										style={{ paddingTop: "10px" }}
										alertInput={
											alertText.question === quickSearch.question_tryMe1.tryMeId
												? alertText.input
												: alertText.default
										}
									/>
								</ListGroup.Item>
								<ListGroup.Item action onClick={searchQuestion2}>
									{tryMe.question_tryMe2.text.split("{0}")[0]}
									<span className={classes.selected}>
										a bi-antennary fully sialylated N-Glycan (G77252PU)
									</span>
									{tryMe.question_tryMe2.text.split("{0}")[1]}
									{/* <div style={{ paddingBottom: "10px" }}></div> */}
									<TextAlert
										style={{ paddingTop: "10px" }}
										alertInput={
											alertText.question === quickSearch.question_tryMe2.tryMeId
												? alertText.input
												: alertText.default
										}
									/>
								</ListGroup.Item>
								<ListGroup.Item action onClick={searchQuestion3}>
									{tryMe.question_tryMe3.text.split("{0}")[0]}
									<span className={classes.selected}>Mgat1 (P27808-1)</span>
									{tryMe.question_tryMe3.text.split("{0}")[1]}
									{/* <div style={{ paddingBottom: "10px" }}></div> */}
									<TextAlert
										style={{ paddingTop: "10px" }}
										alertInput={
											alertText.question === quickSearch.question_tryMe3.tryMeId
												? alertText.input
												: alertText.default
										}
									/>
								</ListGroup.Item>
							</ListGroup>
						</CardContent>
					</div>
				</Card>
			</Grid>
        </Root>
    );
}

TryMeCard.propTypes = {
	post: PropTypes.object,
};
