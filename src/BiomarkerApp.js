import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import BiomarkerRoutes from "./BiomarkerRoutes.js";
import Header from "./components/navigation//biomarker/Header.js";
import Footer from "./components/navigation/biomarker/Footer.js";
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
        <Header
          userTrackingBannerState={userTrackingBannerState}
          setUserTrackingBannerState={setUserTrackingBannerState}
        />
        <ScrollToTopBtn />
        <BiomarkerRoutes
          userTrackingBannerState={userTrackingBannerState}
          setUserTrackingBannerState={setUserTrackingBannerState}
        />
        <Footer />
      </ThemeProvider>
    </div>
  );
}

export default BiomarkerApp;
