import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./pages/Home";
import GlycanList from "./pages/GlycanList";
import ProteinList from "./pages/ProteinList";
import Resources from "./pages/Resources";
import GlycanDetail from "./pages/GlycanDetail";
import ProteinDetail from "./pages/ProteinDetail";
import GlycanListEditColumns from "./pages/GlycanListEditColumns";
import GlycanSearch from "./pages/GlycanSearch";
import ProteinSearch from "./pages/ProteinSearch";
import GlobalSearchResult from "./pages/GlobalSearchResult";
import HowToCite from "./pages/HowToCite";
import ContactUs from "./pages/ContactUs";
import Disclaimer from "./pages/Disclaimer";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import License from "./pages/License";
import PrivacySettings from "./pages/PrivacySettings";
import Feedback from "./pages/Feedback";
import routeConstants from "./data/json/routeConstants.json";
import TryMe from "./pages/TryMe";
import About from "./pages/About";
import Frameworks from "./pages/Frameworks";
import Media from "./pages/Media";
import LocusList from "./pages/LocusList";
import OrthologsList from "./pages/OrthologsList";
import QuickSearch from "./pages/QuickSearch";
import IsoAlignment from "./pages/ProteinAlignment";
import ProtVista from "./pages/ProtVista";
import MotifList from "./pages/MotifList";
import MotifDetail from "./pages/MotifDetail";
import Siteview from "./pages/Siteview";

const Routes = (props) => (
  <Switch>
    <Route path={`${routeConstants.glycanListEdit}:id`} component={GlycanListEditColumns} />
    <Route path={`${routeConstants.glycanList}:id/:searchId`} component={GlycanList} />
    <Route path={`${routeConstants.glycanList}:id`} component={GlycanList} />
    <Route path={`${routeConstants.proteinList}:id/:searchId`} component={ProteinList} />
    <Route path={`${routeConstants.proteinList}:id`} component={ProteinList} />
    <Route path={`${routeConstants.glycanSearch}:id`} component={GlycanSearch} />
    <Route path={routeConstants.glycanSearch} component={GlycanSearch} />
    <Route path={`${routeConstants.proteinSearch}:id`} component={ProteinSearch} />
    <Route path={routeConstants.proteinSearch} component={ProteinSearch} />
    <Route path={`${routeConstants.glycanDetail}:id`} component={GlycanDetail} />
    <Route path={routeConstants.motifList} component={MotifList} />
    <Route path={`${routeConstants.motifDetail}:id`} component={MotifDetail} />
    <Route path={routeConstants.motifDetail} component={MotifDetail} />
    <Route path={`${routeConstants.proteinDetail}:id/:select?`} component={ProteinDetail} />
    <Route path={`${routeConstants.isoAlignment}:id/:alignment`} component={IsoAlignment} />
    <Route path={`${routeConstants.protVista}:id`} component={ProtVista} />
    <Route
      path={`${routeConstants.siteview}:id/:position`}
      render={(props) => <Siteview {...props} position={props.match.params.position} />}
    />
    <Route path={`${routeConstants.siteview}:id`} component={Siteview} />

    <Route path={`${routeConstants.globalSearchResult}:id`} component={GlobalSearchResult} />
    <Route path={routeConstants.resources} component={Resources} />
    <Route path={routeConstants.howToCite} component={HowToCite} />
    <Route path={routeConstants.contactUs} component={ContactUs} />
    <Route path={routeConstants.disclaimer} component={Disclaimer} />
    <Route path={routeConstants.privacyPolicy} component={PrivacyPolicy} />
    <Route path={routeConstants.license} component={License} />
    <Route path={routeConstants.privacySettings} component={() => <PrivacySettings {...props} />} />
    <Route path={routeConstants.feedback} component={Feedback} />
    <Route path={routeConstants.tryMe} component={TryMe} />
    <Route path={routeConstants.about} component={About} />
    <Route path={routeConstants.frameworks} component={Frameworks} />
    <Route path={routeConstants.media} component={Media} />
    <Route path={`${routeConstants.orthologsList}:id/:searchId`} component={OrthologsList} />
    <Route path={`${routeConstants.locusList}:id/:searchId`} component={LocusList} />
    <Route path={`${routeConstants.quickSearch}:id/:questionId`} component={QuickSearch} />
    <Route path={routeConstants.quickSearch} component={QuickSearch} />
    {/* Keep path='/' at the bottom */}
    <Route path={routeConstants.home} component={Home} />
    <Route path={routeConstants.default} component={Home} />
  </Switch>
);

export default Routes;
