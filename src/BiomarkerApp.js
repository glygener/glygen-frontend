import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import BiomarkerRoutes from "./BiomarkerRoutes.js";
import BiomarkerHeader from "./components/navigation/BiomarkerHeader.js";
import BiomarkerFooter from "./components/navigation/BiomarkerFooter.js";
import { ThemeProvider } from "@mui/material/styles";
import ScrollToTopBtn from "./components/ScrollToTop.js";


/**
 * Glygen App component.
 */
function BiomarkerApp(props) {

  const {
    theme,
    userTrackingBannerState,
    setUserTrackingBannerState
  } = props;

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <BiomarkerHeader
          userTrackingBannerState={userTrackingBannerState}
          setUserTrackingBannerState={setUserTrackingBannerState}
        />
        <ScrollToTopBtn />
        <BiomarkerRoutes
          userTrackingBannerState={userTrackingBannerState}
          setUserTrackingBannerState={setUserTrackingBannerState}
        />
        <BiomarkerFooter />
      </ThemeProvider>
    </div>
  );
}

export default BiomarkerApp;
