/**
 * Environment variables for Glygen. These variables have been assigned default values for development environment.
 * During docker deployment on tst, beta and prod these variables will get overwritten by respective values.
 * Do not use direct url's in the code.
 */
export const GLYGEN_ENV = process.env.REACT_APP_ENV || "dev";
export const GLYGEN_API = process.env.REACT_APP_API || "https://api.tst.glygen.org";
export const GLYGEN_DOMAIN = process.env.REACT_APP_DOMAIN || "http://localhost:3000";
export const GLYGEN_DATA = process.env.REACT_APP_DATA || "https://data.glygen.org";
export const GLYGEN_SPARQL = process.env.REACT_APP_SPARQL || "https://sparql.glygen.org";
export const GLYGEN_GSD = process.env.REACT_APP_GSD || "https://wiki.glygen.org/Glycan_structure_dictionary";
export const GLYGEN_BETA = process.env.REACT_APP_BETA || "https://beta.glygen.org";
export const GNOME_BROWSER =
  process.env.REACT_APP_GNOME_BROWSER ||
  "https://gnome.glyomics.org/restrictions/GlyGen.StructureBrowser.html";
export const GLYCOMOTIF_WIKI =
  process.env.REACT_APP_GLYCOMOTIF_WIKI || "https://glycomotif.glyomics.org/glycomotif/GlycoMotif";
export const GLYGEN_SANDBOX =
  process.env.REACT_APP_GLYGEN_SANDBOX || "https://sandbox.glyomics.org/";
export const GLYCAN_SEQ_LOOKUP =
  process.env.REACT_APP_GLYCAN_SEQ_LOOKUP || "https://glylookup.glyomics.org/";
export const GRANT_DETAILS =
  process.env.REACT_APP_GRANT_DETAILS || "https://reporter.nih.gov/project-details/10494610";
export const GLYCOSCIENCE =
  process.env.REACT_APP_GLYCOSCIENCE || "https://commonfund.nih.gov/glycoscience";
  export const GRANT_DETAILS_OLD =
  process.env.REACT_APP_GRANT_DETAILS_OLD || "https://reporter.nih.gov/project-details/9942478";
export const NIGMS =
  process.env.REACT_APP_NIGMS || "https://www.nigms.nih.gov/";
export const CCRC_UGA = process.env.REACT_APP_CCRC_UGA || "https://www.ccrc.uga.edu/";
export const TWITTER = process.env.REACT_APP_TWITTER || "https://twitter.com/gly_gen";
export const YOUTUBE =
  process.env.REACT_APP_YOUTUBE || "https://www.youtube.com/channel/UCqfvlu86I7n71iqCG5yx8bg/";
export const GITHUB = process.env.REACT_APP_GITHUB || "https://github.com/glygener";
export const WIKI =
  process.env.REACT_APP_GLYCOMOTIF_WIKI || "https://wiki.glygen.org/index.php/Main_Page";
export const PINTEREST =
  process.env.REACT_APP_PINTEREST || "https://www.pinterest.com/myGlyGen/glygen-portal/";
export const SMHS_GWU = process.env.REACT_APP_SMHS_GWU || "https://smhs.gwu.edu/";
export const NIH_GOV = process.env.REACT_APP_NIH_GOV || "https://www.nih.gov/";

export const GLYGEN_BASENAME = process.env.REACT_APP_BASENAME || "/";
export const UNIPROT_BASENAME = "https://www.uniprot.org/"
export const UNIPROT_REST_BASENAME = "https://rest.uniprot.org/"
export const GLYGEN_FAQ = process.env.REACT_APP_GSD || "https://wiki.glygen.org/Frequently_Asked_Questions";
export const GLYGEN_TUT_HOWT = process.env.REACT_APP_TUT_HOWT || "https://wiki.glygen.org/GlyGen_Tutorials";
export const GLYGEN_DOC = process.env.REACT_APP_DOC || "https://wiki.glygen.org/GlyGen_Documentation";
export const CFDE_GENE_PAGES = process.env.REACT_APP_CFDE_GENE_PAGES || "https://cfde-gene-pages.cloud/";
export const NIH_COMMONFUND_DATAECOSYSTEM = process.env.REACT_APP_COMMONFUND || "https://commonfund.nih.gov/dataecosystem"
export const NIH_COMMONFUND = process.env.REACT_APP_COMMONFUND || "https://commonfund.nih.gov"
export const GLYSPACE = process.env.REACT_APP_GLYSPACE || "http://www.glyspace.org/"
export const GRANT_DETAILS_COMMONFUND =
  process.env.REACT_APP_GRANT_DETAILS_COMMONFUND || "https://reporter.nih.gov/project-details/10397274";
