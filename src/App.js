import React, { useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Routes from "./Routes";
import Header from "./components/navigation/Header";
import Footer from "./components/navigation/Footer";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ReactGA from "react-ga";
import { GLYGEN_ENV } from "./envVariables.js";
import ScrollToTopBtn from "./components/ScrollToTop";

function initializeReactGA() {
  if (GLYGEN_ENV === "prod" || GLYGEN_ENV === "beta") {
    ReactGA.initialize("UA-123338976-1");
    ReactGA.pageview(window.location.pathname);
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

export default App;
