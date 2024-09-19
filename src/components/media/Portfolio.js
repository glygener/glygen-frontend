import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import { Row, Image, Col } from "react-bootstrap";
import HorizontalHeading from "../../components/headings/HorizontalHeading";
import "../../css/Media.css";
import triFoldJunePdf from "../../images/media/portfolio/brochures/tri-fold-brochure-june.pdf";
import triFold1Img from "../../images/media/portfolio/brochures/Tri-fold-1.png";
import bioCurationPdf from "../../images/media/portfolio/posters/BioCuration-GlyGen-2019.04.pdf";
import poster1Img from "../../images/media/portfolio/posters/poster-1.png";
import onePageBrochurePdf from "../../images/media/portfolio/brochures/glygen-one-page-brochure.pdf";
import onePageBrochurImg from "../../images/media/portfolio/brochures/One-page-brochure-1.png";
import sfgData19posterPdf from "../../images/media/portfolio/posters/SFG-Data-GlyGen-Nov-2019.pdf";
import poster2Img from "../../images/media/portfolio/posters/poster-2.png";
import sfgWeb19posterPdf from "../../images/media/portfolio/posters/SFG-Web-GlyGen-Nov-2019.pdf";
import poster3Img from "../../images/media/portfolio/posters/poster-3.png";
import sfgGlycoTree20posterPdf from "../../images/media/portfolio/posters/SFG-GlyGen-GlycoTree-Nov-2020.pdf";
import poster4GlycoTreeImg from "../../images/media/portfolio/posters/poster-4-GlycoTree.png";
import sfgNCBI20posterPdf from "../../images/media/portfolio/posters/SFG-GlyGen-NCBI-Nov-2020.pdf";
import textMining21posterPdf from "../../images/media/portfolio/posters/Text_Mining_Jeet_Catherine_GlyGenISB.pdf";
import poster5NCBIImg from "../../images/media/portfolio/posters/poster-5-NCBI.png";
import poster6ISBImg from "../../images/media/portfolio/posters/poster-6-ISB.png";
import logos from "../../images/media/portfolio/logo/Logos.png";
import logosPDF from "../../images/media/portfolio/logo/GlyGen-Logos.pdf";
import onePageBrochure2Pdf from "../../images/media/portfolio/brochures/glygen-one-page-brochure-2.pdf";
import onePageBrochureImg from "../../images/media/portfolio/brochures/one-page-brochure-2.png";
import stickersLogoPdf from "../../images/media/portfolio/stickers/stikers-oval-logo-blue-white.pdf";
import stickersLogoImg from "../../images/media/portfolio/stickers/stickers-logo.png";
import Isotope from "isotope-layout";

// import { LightBoxGallery, GalleryItem } from "react-magnific-popup";
// https://bodunadebiyi.github.io/react-magnific-popup/
// https://www.npmjs.com/package/react-magnific-popup

// const config = {
// 	delegate: "a",
// 	type: "image",
// 	tLoading: "Loading image #%curr%...",
// 	mainClass: "mfp-img-mobile",
// 	gallery: {
// 		enabled: true,
// 		navigateByImgClick: true,
// 		preload: [0, 1], // Will preload 0 - before current, and 1 after the current image
// 	},
// 	image: {
// 		tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
// 		titleSrc: function (item) {
// 			return item.el.attr("title") + "<small>by GlyGen</small>";
// 		},
// 	},
// };

const Portfolio = (props) => {
  const horHeadPortfolio = {
    h5VerticalText: "Portfolio",
    h2textTop: "Our Amazing",
    h2textTopStrongAfter: "Work",
  };

  // store the isotope object in one state
  const [isotope, setIsotope] = useState(null);
  // store the filter keyword in another state
  const [filterKey, setFilterKey] = useState("*");
  // Set the active class to clicked button
  const [activeBtnArr, setActiveBtnArr] = useState([true, false, false, false]);

  function onButtonClick(filterKey, index) {
    // Filter keyword
    setFilterKey(filterKey);
    // Set active class
    let btnArr = [false, false, false, false];
    btnArr[index] = true;
    setActiveBtnArr(btnArr);
  }

  // initialize an Isotope object with configs
  useEffect(() => {
      setIsotope(
        new Isotope(".isotope-container", {
          itemSelector: ".filter-item",
          layoutMode: "fitRows",
        }));
  }, []);

  // handling filter key change
  useEffect(() => {
    if (isotope) {
      filterKey === "*"
        ? isotope.arrange({ filter: `*` })
        : isotope.arrange({
            filter: `.${filterKey}`,
          });
    }
  }, [isotope, filterKey]);

  return (
    <React.Fragment>
      <section className="content-box-md" style={{marginLeft:"12px", marginRight:"12px"}}>
        <Container maxWidth="lg">
          <HorizontalHeading post={horHeadPortfolio} id="horizontal-heading-pb0" />
          <Row className="gg-align-middle5 gg-align-center">
            <Col sm={12} className="text-center">
              {/* Portfolio Items Filters  */}
              <div id="isotope-filters">
                <button
                  className={activeBtnArr[0] ? "btn btn-active" : "btn"}
                  onClick={() => onButtonClick("*", 0)}
                >
                  <span>All</span>
                </button>
                <button
                  className={activeBtnArr[1] ? "btn btn-active" : "btn"}
                  onClick={() => onButtonClick("poster", 1)}
                >
                  <span>Poster</span>
                </button>
                <button
                  className={activeBtnArr[2] ? "btn btn-active" : "btn"}
                  onClick={() => onButtonClick("brochure", 2)}
                >
                  <span>Brochure</span>
                </button>
                <button
                  className={activeBtnArr[3] ? "btn btn-active" : "btn"}
                  onClick={() => onButtonClick("logo", 3)}
                >
                  <span>Logo</span>
                </button>
              </div>
            </Col>
          </Row>
        </Container>
        {/* Portfolio Items Wrapper  */}
        <section id="portfolio-wrapper">
          <Row className="no-gutters isotope-container" id="isotope-container">
            {/* <LightBoxGallery className="popup-gallery" config={config}> */}
            <Col xs={12} sm={6} md={3} lg={3} className="filter-item brochure">
              <div className="text-end">
                <a
                  className="btn btn-link"
                  role="button"
                  href={triFoldJunePdf}
                  download="GlyGen tri-fold brochure.pdf"
                >
                  DOWNLOAD
                </a>
              </div>
              <div className="portfolio-item">
                <a href={triFold1Img} title="Tri-Fold Brochure June 2019">
                  <Image src={triFold1Img} className="img-fluid" alt="tri-fold brochure" />
                  <div className="portfolio-item-overlay">
                    <div className="portfolio-item-details text-center">
                      {/* Item Header  */}
                      <h3>Brochure</h3>
                      {/* Item Strips  */}
                      <span></span>
                      {/* Item Description  */}
                      <p>Tri-Fold Brochure</p>
                    </div>
                  </div>
                </a>
              </div>
            </Col>
            {/* Portfolio Item 02 Poster Biocuration */}
            <Col xs={12} sm={6} md={3} lg={3} className="filter-item poster">
              <div className="text-end">
                <a
                  className="btn btn-link"
                  role="button"
                  href={bioCurationPdf}
                  download="GlyGen BioCuration poster April 2019.pdf"
                >
                  DOWNLOAD
                </a>
              </div>
              <div className="portfolio-item">
                <a href={poster1Img} title="GlyGen BioCuration April 2019">
                  <Image src={poster1Img} className="img-fluid" alt="Poster Biocuration" />
                  <div className="portfolio-item-overlay">
                    <div className="portfolio-item-details text-center">
                      {/* Item Header  */}
                      <h3>Poster</h3>
                      {/* Item Strips */}
                      <span></span>
                      {/* Item Description  */}
                      <p>BioCuration</p>
                    </div>
                  </div>
                </a>
              </div>
            </Col>
            {/* Portfolio Item 03 One Page Brochure  */}
            <Col xs={12} sm={6} md={3} lg={3} className="filter-item brochure">
              <div className="text-end">
                <a
                  className="btn btn-link"
                  role="button"
                  href={onePageBrochurePdf}
                  download="glygen-one-page-brochure.pdf"
                >
                  DOWNLOAD
                </a>
              </div>
              <div className="portfolio-item">
                <a href={onePageBrochurImg} title="GlyGen One Page Brochure June 2019">
                  <Image src={onePageBrochurImg} className="img-fluid" alt="One Page Brochure" />
                  <div className="portfolio-item-overlay">
                    <div className="portfolio-item-details text-center">
                      {/* Item Header  */}
                      <h3>Brochure</h3>
                      {/* Item Strips  */}
                      <span></span>
                      {/* Item Description  */}
                      <p>One Page Brochure</p>
                    </div>
                  </div>
                </a>
              </div>
            </Col>
            {/* Portfolio Item 04 Poster SFG Data  */}
            <Col xs={12} sm={6} md={3} lg={3} className="filter-item poster">
              <div className="text-end">
                <a
                  className="btn btn-link"
                  role="button"
                  href={sfgData19posterPdf}
                  download="GlyGen SFG Data poster November 2019.pdf"
                >
                  DOWNLOAD
                </a>
              </div>
              <div className="portfolio-item">
                <a href={poster2Img} title="GlyGen SFG Data November 2019">
                  <Image src={poster2Img} className="img-fluid" alt="Poster SFG Data" />
                  <div className="portfolio-item-overlay">
                    <div className="portfolio-item-details text-center">
                      {/* Item Header  */}
                      <h3>Poster</h3>
                      {/* Item Strips  */}
                      <span></span>
                      {/* Item Description  */}
                      <p>SFG Data</p>
                    </div>
                  </div>
                </a>
              </div>
            </Col>

            {/* Portfolio Item 05 Logo  */}
            <Col xs={12} sm={6} md={3} lg={3} className="filter-item logo">
              <div className="text-end">
                <a
                  className="btn btn-link"
                  role="button"
                  href={logosPDF}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={"GlyGen logos"}
                >
                  DOWNLOAD
                </a>
              </div>
              <div className="portfolio-item">
                <a href={logos} title="GlyGen logo">
                  <Image src={logos} className="img-fluid" alt="Logo" />
                  <div className="portfolio-item-overlay">
                    <div className="portfolio-item-details text-center">
                      {/* Item Header  */}
                      <h3>Logo</h3>
                      {/* Item Strips  */}
                      <span></span>
                      {/* Item Description  */}
                      <p>GlyGen logo</p>
                    </div>
                  </div>
                </a>
              </div>
            </Col>
            {/* Portfolio Item 06 Poster SFG Website  */}
            <Col xs={12} sm={6} md={3} lg={3} className="filter-item poster">
              <div className="text-end">
                <a
                  className="btn btn-link"
                  role="button"
                  href={sfgWeb19posterPdf}
                  download="GlyGen SFG Website poster November 2019.pdf"
                >
                  DOWNLOAD
                </a>
              </div>
              <div className="portfolio-item">
                <a href={poster3Img} title="GlyGen SFG Website November 2019">
                  <Image src={poster3Img} className="img-fluid" alt="Poster SFG Website" />
                  <div className="portfolio-item-overlay">
                    <div className="portfolio-item-details text-center">
                      {/* Item Header  */}
                      <h3>Poster</h3>
                      {/* Item Strips  */}
                      <span></span>
                      {/* Item Description  */}
                      <p>SFG Website</p>
                    </div>
                  </div>
                </a>
              </div>
            </Col>
            {/* Portfolio Item 07 One Page Brochure */}
            <Col xs={12} sm={6} md={3} lg={3} className="filter-item brochure">
              <div className="text-end">
                <a
                  className="btn btn-link"
                  role="button"
                  href={onePageBrochure2Pdf}
                  download="glygen-one-page-brochure.pdf"
                >
                  DOWNLOAD
                </a>
              </div>
              <div className="portfolio-item">
                <a href={onePageBrochureImg} title="GlyGen One Page Brochure December 2019">
                  <Image src={onePageBrochureImg} className="img-fluid" alt="One Page Brochure" />
                  <div className="portfolio-item-overlay">
                    <div className="portfolio-item-details text-center">
                      {/* Item Header  */}
                      <h3>Brochure</h3>
                      {/* Item Strips  */}
                      <span></span>
                      {/* Item Description  */}
                      <p>One Page Brochure</p>
                    </div>
                  </div>
                </a>
              </div>
            </Col>
            {/* Portfolio Item 08 Poster SFG GlycoTree Will York */}
            <Col xs={12} sm={6} md={3} lg={3} className="filter-item poster">
              <div className="text-end">
                <a
                  className="btn btn-link"
                  role="button"
                  href={sfgGlycoTree20posterPdf}
                  download="GlyGen SFG GlycoTree poster November 2020.pdf"
                >
                  DOWNLOAD
                </a>
              </div>
              <div className="portfolio-item">
                <a href={poster4GlycoTreeImg} title="SFG GlyGen GlycoTree November 2020">
                  <Image
                    src={poster4GlycoTreeImg}
                    className="img-fluid"
                    alt="Poster SFG GlycoTree"
                  />
                  <div className="portfolio-item-overlay">
                    <div className="portfolio-item-details text-center">
                      {/* Item Header  */}
                      <h3>Poster</h3>
                      {/* Item Strips  */}
                      <span></span>
                      {/* Item Description  */}
                      <p>SFG GlycoTree</p>
                    </div>
                  </div>
                </a>
              </div>
            </Col>
            {/* Portfolio Item 09 GlyGen Logo Stickers  */}
            <Col xs={12} sm={6} md={3} lg={3} className="filter-item logo">
              <div className="text-end">
                <a
                  className="btn btn-link"
                  role="button"
                  href={stickersLogoPdf}
                  download="glygen-oval-logo-stickers.pdf"
                >
                  DOWNLOAD
                </a>
              </div>
              <div className="portfolio-item">
                <a href={stickersLogoImg} title="GlyGen logo stickers">
                  <Image src={stickersLogoImg} className="img-fluid" alt="GlyGen logo stickers" />
                  <div className="portfolio-item-overlay">
                    <div className="portfolio-item-details text-center">
                      {/* Item Header  */}
                      <h3>Logo</h3>
                      {/* Item Strips  */}
                      <span></span>
                      {/* Item Description  */}
                      <p>GlyGen Logo Stickers</p>
                    </div>
                  </div>
                </a>
              </div>
            </Col>
            {/* Portfolio Item 10 Poster SFG GlyGen NCBI 2020 Rahi */}
            <Col xs={12} sm={6} md={3} lg={3} className="filter-item poster">
              <div className="text-end">
                <a
                  className="btn btn-link"
                  role="button"
                  href={sfgNCBI20posterPdf}
                  download="GlyGen SFG NCBI poster November 2020.pdf"
                >
                  DOWNLOAD
                </a>
              </div>
              <div className="portfolio-item">
                <a href={poster5NCBIImg} title="SFG GlyGen NCBI November 2020">
                  <Image src={poster5NCBIImg} className="img-fluid" alt="Poster SFG GlyGen NCBI" />
                  <div className="portfolio-item-overlay">
                    <div className="portfolio-item-details text-center">
                      {/* Item Header  */}
                      <h3>Poster</h3>
                      {/* Item Strips  */}
                      <span></span>
                      {/* Item Description  */}
                      <p>SFG GlyGen NCBI</p>
                    </div>
                  </div>
                </a>
              </div>
            </Col>
             {/* Portfolio Item 11 Poster GlyGen BioCuration Text Mining poster October 2021 Jeet */}
             <Col xs={12} sm={6} md={3} lg={3} className="filter-item poster">
              <div className="text-end">
                <a
                  className="btn btn-link"
                  role="button"
                  href={textMining21posterPdf}
                  download="GlyGen BioCuration Text Mining poster October 2021.pdf"
                >
                  DOWNLOAD
                </a>
              </div>
              <div className="portfolio-item">
                <a href={poster6ISBImg} title="GlyGen BioCuration Text Mining October 2021">
                  <Image src={poster6ISBImg} className="img-fluid" alt="Poster GlyGen BioCuration Text Mining" />
                  <div className="portfolio-item-overlay">
                    <div className="portfolio-item-details text-center">
                      {/* Item Header  */}
                      <h3>Poster</h3>
                      {/* Item Strips  */}
                      <span></span>
                      {/* Item Description  */}
                      <p>BioCuration Text Mining</p>
                    </div>
                  </div>
                </a>
              </div>
            </Col>
            {/* </LightBoxGallery> */}
          </Row>
        </section>
      </section>
    </React.Fragment>
  );
};
export default Portfolio;
