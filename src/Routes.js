import React from "react";
import { Route, Routes as Switch } from "react-router-dom";
import Home from "./pages/Home";
import GlycanList from "./pages/GlycanList";
import ProteinList from "./pages/ProteinList";
import Resources from "./pages/Resources";
import GlycanDetail from "./pages/GlycanDetail";
import ProteinDetail from "./pages/ProteinDetail";
import GlycanListEditColumns from "./pages/GlycanListEditColumns";
import GlycanSearch from "./pages/GlycanSearch";
import ProteinSearch from "./pages/ProteinSearch";
import BiomarkerSearch from "./pages/BiomarkerSearch";
import BiomarkerList from "./pages/BiomarkerList";
import SiteSearch from "./pages/SiteSearch";
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
import Outreach from "./pages/Outreach";
import Frameworks from "./pages/Frameworks";
import Media from "./pages/Media";
import LocusList from "./pages/LocusList";
import OrthologsList from "./pages/OrthologsList";
import QuickSearch from "./pages/QuickSearch";
import IsoAlignment from "./pages/ProteinAlignment";
import ProtVista from "./pages/ProtVista";
import MotifList from "./pages/MotifList";
import SiteList from "./pages/SiteList";
import MotifDetail from "./pages/MotifDetail";
import Siteview from "./pages/Siteview";
import IdMapping from "./pages/IdMapping";
import IdMappingResult from "./pages/IdMappingResult";
import IsoformMapping from "./pages/IsoformMapping";
import IsoformMappingResult from "./pages/IsoformMappingResult";
import SuperSearch from "./pages/SuperSearch";
import BlastSearch from "./pages/BlastSearch";
import BlastResult from "./pages/BlastResult"
import PublicationDetail from "./pages/PublicationDetail";
import BiomarkerDetail from "./pages/BiomarkerDetail";

/**
 * Defines route path for Glygen. Use routeConstants from routeConstants.json.
 * Do not use direct url paths.
 */
const Routes = (props) => (
  <Switch>
    <Route path={`${routeConstants.glycanListEdit}:id`} element={<GlycanListEditColumns/>} />
    <Route path={`${routeConstants.glycanList}:id/:searchId`} element={<GlycanList/>} />
    <Route path={`${routeConstants.glycanList}:id`} element={<GlycanList/>} />
    <Route path={`${routeConstants.proteinList}:id/:searchId`} element={<ProteinList/>} />
    <Route path={`${routeConstants.proteinList}:id`} element={<ProteinList/>} />
    <Route path={`${routeConstants.glycanSearch}:id`} element={<GlycanSearch/>} />
    <Route path={routeConstants.glycanSearch} element={<GlycanSearch/>} />
    <Route path={`${routeConstants.proteinSearch}:id`} element={<ProteinSearch/>} />
    <Route path={routeConstants.proteinSearch} element={<ProteinSearch/>} />
    <Route path={`${routeConstants.siteList}:id/:searchId`} element={<SiteList/>} />
    <Route path={`${routeConstants.siteList}:id`} element={<SiteList/>} />
    <Route path={`${routeConstants.siteSearch}:id`} element={<SiteSearch/>} />
    <Route path={routeConstants.siteSearch} element={<SiteSearch/>} />
    <Route path={routeConstants.motifList} element={<MotifList/>} />
    <Route path={`${routeConstants.motifDetail}:id`} element={<MotifDetail/>} />
    <Route path={routeConstants.motifDetail} element={<MotifDetail/>} />
    <Route path={`${routeConstants.glycanDetail}:id`} element={<GlycanDetail/>} />
    <Route path={`${routeConstants.proteinDetail}:id/:select`} element={<ProteinDetail/>} />
    <Route path={`${routeConstants.proteinDetail}:id/`} element={<ProteinDetail/>} />
    <Route path={`${routeConstants.isoAlignment}:id/:alignment`} element={<IsoAlignment/>} />
    <Route path={`${routeConstants.protVista}:id`} element={<ProtVista/>} />
    <Route
      path={`${routeConstants.siteview}:id/:position`}
      element={<Siteview/>}
    />
    {/* <Route
      path={`${routeConstants.siteview}:id/:position`}
      render={(props) => { return <Siteview {...props} position={props.match.params.position} />} }
    /> */}
    <Route path={`${routeConstants.siteview}:id`} element={<Siteview/>} />
    <Route path={`${routeConstants.globalSearchResult}:id`} element={<GlobalSearchResult/>} />
    <Route path={routeConstants.resources} element={<Resources/>} />
    <Route path={routeConstants.howToCite} element={<HowToCite/>} />
    <Route path={routeConstants.contactUs} element={<ContactUs/>} />
    <Route path={routeConstants.disclaimer} element={<Disclaimer/>} />
    <Route path={routeConstants.privacyPolicy} element={<PrivacyPolicy/>} />
    <Route path={routeConstants.license} element={<License/>} />
    <Route path={routeConstants.privacySettings} element={<PrivacySettings {...props}/>} />
    <Route path={routeConstants.feedback} element={<Feedback/>} />
    <Route path={routeConstants.tryMe} element={<TryMe/>} />
    <Route path={routeConstants.about} element={<About/>} />
    <Route path={routeConstants.outreach} element={<Outreach/>} />
    <Route path={routeConstants.frameworks} element={<Frameworks/>} />
    <Route path={routeConstants.media} element={<Media/>} />
    <Route path={`${routeConstants.orthologsList}:id/:searchId`} element={<OrthologsList/>} />
    <Route path={`${routeConstants.locusList}:id/:searchId`} element={<LocusList/>} />
    <Route path={`${routeConstants.quickSearch}:id/:questionId`} element={<QuickSearch/>} />
    <Route path={routeConstants.quickSearch} element={<QuickSearch/>} />
    <Route path={`${routeConstants.isoformMapping}:id`} element={<IsoformMapping/>} />
    <Route path={routeConstants.isoformMapping} element={<IsoformMapping/>} />
    <Route path={`${routeConstants.isoformMappingResult}:jobId`} element={<IsoformMappingResult/>} />
    <Route path={`${routeConstants.idMapping}:id`} element={<IdMapping/>} />
    <Route path={routeConstants.idMapping} element={<IdMapping/>} />
    <Route path={`${routeConstants.idMappingResult}:id`} element={<IdMappingResult/>} />
    <Route path={routeConstants.idMappingResult} element={<idMappingResult/>} />
    <Route path={`${routeConstants.superSearch}:id/:searchId`} element={<SuperSearch/>} />
    <Route path={`${routeConstants.superSearch}:id`} element={<SuperSearch/>} />
    <Route path={routeConstants.superSearch} element={<SuperSearch/>} />
    <Route
      path={`${routeConstants.publicationDetail}:publType/:id/:doi`}
      element={<PublicationDetail/>}
    />
    <Route
      path={`${routeConstants.publicationDetail}:publType/:id`}
      element={<PublicationDetail/>}
    />
    <Route path={`${routeConstants.publicationDetail}:id`} element={<PublicationDetail/>} />
    <Route path={routeConstants.publicationDetail} element={<PublicationDetail/>} />
    <Route path={`${routeConstants.blastSearch}:id`} element={<BlastSearch/>} />
    <Route path={routeConstants.blastSearch} element={<BlastSearch/>} />
    <Route path={`${routeConstants.blastResult}:jobId`} element={<BlastResult/>} />
    <Route path={routeConstants.blastResult} element={<BlastResult/>} />
    <Route path={`${routeConstants.biomarkerList}:id`} element={<BiomarkerList/>} />
    <Route path={`${routeConstants.biomarkerSearch}:id`} element={<BiomarkerSearch/>} />
    <Route path={routeConstants.biomarkerSearch} element={<BiomarkerSearch/>} />
    <Route path={`${routeConstants.biomarkerDetail}:id`} element={<BiomarkerDetail/>} />
    {/* Keep path='/' at the bottom */}
    <Route path={routeConstants.home} element={<Home/>} />
    <Route path={routeConstants.default} element={<Home/>} />
  </Switch>
);

export default Routes;
