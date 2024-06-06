import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Routes from "./Routes.js";
import Header from "./components/navigation/Header.js";
import Footer from "./components/navigation/Footer.js";
import { ThemeProvider } from "@mui/material/styles";
import ScrollToTopBtn from "./components/ScrollToTop.js";


/**
 * Glygen App component.
 */
function GlyGenApp(props) {

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
        <Routes
          userTrackingBannerState={userTrackingBannerState}
          setUserTrackingBannerState={setUserTrackingBannerState}
        />
        <Footer />
      </ThemeProvider>
    </div>
  );
}

export default GlyGenApp;
