import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import { logID, logActivity } from "../../data/logging";
import { GLYGEN_BUILD } from "../../envVariables";

const IDKey = getIDKey();

function getIDKey() { 
    if (GLYGEN_BUILD === "glygen") {
        return "ID";
    }

    if (GLYGEN_BUILD === "biomarker") {
        return "biomarkerID";
    }
}
/**
 * User tracking banner component.
 */
export default function UserTrackingBanner(props) {
	const [pageLoaded, setPageLoaded] = useState(false);

	/**
	 * This basically checks the browser support for Web storage (i.e. localStorage)
	 * and also logs the page visit activity.
	 */
	const tracking = () => {
		/* Check browser support */
		if (typeof Storage !== "undefined") {
			if (!localStorage.getItem(IDKey)) {
				/* If nothing in the local storage then give the user a choice. */
				props.setUserTrackingBannerState("display");
			}
			logActivity("user");
		} else {
			props.setUserTrackingBannerState("browser");
			logActivity("user", null, "Browser Compatibility");
		}
		setPageLoaded(true);
	};

	/**
	 * useEffect for displaying message based on user response, assign log id to user based on api call.
	 */
	useEffect(() => {
		/**
		 * This is called when the user selects to be logged.
		 * Gets the ID from Web Service and stores in the localStorage of the browser.
		 */
		const allowLogID = () => {
			var user_id = "No ID assigned";

			logID()
				.then((response) => {
					if (response.data.error_code) {
						console.log(response.data.error_code);
					} else {
						user_id = response.data.user;
						localStorage.setItem(IDKey, user_id); //Store the ID from the webservice
						props.setUserTrackingBannerState("track");
						console.log(user_id);
						logActivity("user", null, "Enabled Logging");
					}
				})
				.catch(function (error) {
					console.log("Log user ID generation failure: " + error);
				});
		};

		/**
		 * This is called when the user chooses not to be logged.
		 * Stores the ID as "Anonymous" in the localStorage of the browser.
		 */
		const doNotAllowLogID = () => {
			localStorage.setItem(IDKey, "Anonymous");
			props.setUserTrackingBannerState("donottrack");
			logActivity("user", null, "Disabled Logging");
		};

		if (props.userTrackingBannerState === "track") {
			allowLogID();
		}

		if (props.userTrackingBannerState === "donottrack") {
			doNotAllowLogID();
		}

		if (
			props.userTrackingBannerState !== "none" &&
			props.userTrackingBannerState !== "display"
		) {
			setTimeout(() => {
				props.setUserTrackingBannerState("none");
			}, 10000);
		}
	}, [props, props.userTrackingBannerState]);

	/**
	 * useEffect to check browser support, display message.
	 */
	useEffect(() => {
		if (!pageLoaded) {
			tracking();
		}
	});

	/**
	 * Function to close tracking banner message display.
	 */
	const close = function () {
		props.setUserTrackingBannerState("none");
	};

	return (
		<>
			{props.userTrackingBannerState === "display" && (
				<div className="alert gg-alert">
					<span>
						Do you want <strong>GlyGen</strong> to remember your searches for
						your future use? This can be changed at any time in the{" "}
						<strong>My GlyGen</strong> section.
					</span>
					<br />
					<Button
						type="button"
						className="btn btn-default gg-btn-margin"
						onClick={() => {
							props.setUserTrackingBannerState("track");
						}}>
						Allow
					</Button>
					<Button
						type="button"
						className="btn btn-default gg-btn-margin"
						onClick={() => {
							props.setUserTrackingBannerState("donottrack");
						}}>
						Don't Allow
					</Button>
				</div>
			)}
			{props.userTrackingBannerState === "track" && (
				<div className="alert gg-alert">
					<span>
						We will log your actions to improve the user experience. You can
						always change this setting in <strong>My GlyGen</strong>.
					</span>
					<span
						className="close_banner"
						onClick={close}
						style={{ float: "right" }}>
						&times;
					</span>
				</div>
			)}
			{props.userTrackingBannerState === "donottrack" && (
				<div className="alert gg-alert">
					<span>
						We will not log your actions. You can always change this setting in{" "}
						<strong>My GlyGen</strong>.
					</span>
					<span
						onClick={close}
						className="close_banner"
						style={{ float: "right" }}>
						&times;
					</span>
				</div>
			)}
			{props.userTrackingBannerState === "browser" && (
				<div className="alert gg-alert">
					<span>
						Please update your browser to the latest version in order to access
						all our website features.
					</span>
					<span
						onClick={close}
						className="close_banner"
						style={{ float: "right" }}>
						&times;
					</span>
				</div>
			)}
		</>
	);
}

UserTrackingBanner.propTypes = {
	userTrackingBannerState: PropTypes.string,
};
