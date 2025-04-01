import React, { useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import GlyGenApp from "./GlyGenApp";
import BiomarkerApp from "./BiomarkerApp";
import { createTheme } from "@mui/material/styles";
import ReactGA from "react-ga4";
import { GLYGEN_ENV, GLYGEN_BUILD } from "./envVariables.js";
import GlyGenNotificationProvider from "./components/GlyGenNotificationProvider.js";

function initializeReactGA() {
  if (GLYGEN_ENV === "prod" || GLYGEN_ENV === "beta") {
    ReactGA.initialize("G-47WSZ1WYRZ");
    ReactGA.send({ hitType: "pageview", page: window.location.pathname });
  }
}

/**
 * for the pageproofer feedback.
 */
function pageProofer(d, t) {
  var url = "";

  if (GLYGEN_ENV === "beta") url = "//app.pageproofer.com/overlay/js/3502/1801";

  if (GLYGEN_ENV === "test") url = "//app.pageproofer.com/overlay/js/3487/1801";

  if (GLYGEN_ENV === "beta" || GLYGEN_ENV === "test") {
    var pp = d.createElement(t),
      s = d.getElementsByTagName(t)[0];
    pp.src = url;
    pp.type = "text/javascript";
    pp.async = true;
    s.parentNode.insertBefore(pp, s);
  }
}

const theme = createTheme({
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      "Oxygen",
      "Ubuntu",
      "Cantarell",
      '"Fira Sans"',
      '"Droid Sans"',
      '"Helvetica Neue"',
      "sans-serif",
    ].join(","),
  },
});

/**
 * Glygen App component.
 */
function App() {
  initializeReactGA();
  pageProofer(document, "script");
  const [userTrackingBannerState, setUserTrackingBannerState] = useState("none");

  return (
    <div className="App">
      <GlyGenNotificationProvider>

      {GLYGEN_BUILD === "glygen" && 
        <GlyGenApp 
          theme={theme} 
          userTrackingBannerState={userTrackingBannerState} 
          setUserTrackingBannerState={setUserTrackingBannerState}
      />}

      {GLYGEN_BUILD === "biomarker" && 
        <BiomarkerApp 
          theme={theme} 
          userTrackingBannerState={userTrackingBannerState} 
          setUserTrackingBannerState={setUserTrackingBannerState}
      />}
      </GlyGenNotificationProvider>

    </div>
  );
}

export default App;
