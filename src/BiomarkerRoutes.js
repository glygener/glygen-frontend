import React from "react";
import { Route, Routes as Switch } from "react-router-dom";
import Home from "./pages/biomarker/Home";
import Resources from "./pages/Resources";
import BiomarkerSearch from "./pages/BiomarkerSearch";
import BiomarkerList from "./pages/BiomarkerList";
import GlobalSearchResult from "./pages/GlobalSearchResult";
import HowToCite from "./pages/biomarker/HowToCite";
import ContactUs from "./pages/ContactUs";
import Disclaimer from "./pages/biomarker/Disclaimer";
import PrivacyPolicy from "./pages/biomarker/PrivacyPolicy";
import License from "./pages/biomarker/License";
import PrivacySettings from "./pages/biomarker/PrivacySettings";
import Feedback from "./pages/Feedback";
import routeConstants from "./data/json/routeConstants.json";
import About from "./pages/biomarker/About";
import Frameworks from "./pages/Frameworks";
import Media from "./pages/Media";
import BiomarkerDetail from "./pages/BiomarkerDetail";

/**
 * Defines route path for Biomarker portal. Use routeConstants from routeConstants.json.
 * Do not use direct url paths.
 */
const BiomarkerRoutes = (props) => (
  <Switch>
    <Route path={`${routeConstants.globalSearchResult}:id`} element={<GlobalSearchResult/>} />
    <Route path={routeConstants.howToCite} element={<HowToCite/>} />
    <Route path={routeConstants.contactUs} element={<ContactUs/>} />
    <Route path={routeConstants.disclaimer} element={<Disclaimer/>} />
    <Route path={routeConstants.privacyPolicy} element={<PrivacyPolicy/>} />
    <Route path={routeConstants.license} element={<License/>} />
    <Route path={routeConstants.privacySettings} element={<PrivacySettings {...props}/>} />
    <Route path={routeConstants.feedback} element={<Feedback/>} />
    <Route path={routeConstants.about} element={<About/>} />
    <Route path={routeConstants.frameworks} element={<Frameworks/>} />
    <Route path={`${routeConstants.biomarkerList}:id`} element={<BiomarkerList/>} />
    <Route path={`${routeConstants.biomarkerSearch}:id`} element={<BiomarkerSearch/>} />
    <Route path={routeConstants.biomarkerSearch} element={<BiomarkerSearch/>} />
    <Route path={`${routeConstants.biomarkerDetail}:id`} element={<BiomarkerDetail/>} />
    {/* Keep path='/' at the bottom */}
    <Route path={routeConstants.home} element={<Home/>} />
    <Route path={routeConstants.default} element={<Home/>} />
  </Switch>
);

export default BiomarkerRoutes;
