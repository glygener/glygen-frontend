import React from "react";
import Container from "@mui/material/Container";
import { Image } from "react-bootstrap";
import ugaImg from "../../images/about/univ-logo/uga.png";
import gwImg from "../../images/about/univ-logo/gw.png";
import georgetownImg from "../../images/about/univ-logo/georgetown.png";
import harvardImg from "../../images/about/univ-logo/harvard.png";
import ncbiImg from "../../images/about/univ-logo/ncbi.png";
import griffithImg from "../../images/about/univ-logo/griffith.png";
import imperialImg from "../../images/about/univ-logo/imperial.png";
import emblImg from "../../images/about/univ-logo/embl.png";
import sokaImg from "../../images/about/univ-logo/soka.png";
import glyspaceImg from "../../images/about/univ-logo/glyspace.png";
import delawareImg from "../../images/about/univ-logo/delaware.png";
import macquarieImg from "../../images/about/univ-logo/macquarie.png";
import sibImg from "../../images/about/univ-logo/sib.png";

const UnivLogos = (props) => {
  return (
    <React.Fragment>
      {/* University logos */}
      <section className="content-box-lg">
      <Container maxWidth="lg">
          <div className="gg-align-middle gg-align-center">
            {/* University 01 */}
            <div>
              <Image src={ugaImg} className="univ-logo img-fluid" alt="uga university logo" />
            </div>
            {/* University 02 */}
            <div>
              <Image src={gwImg} className="univ-logo img-fluid" alt="gw university logo" />
            </div>
            {/* University 03 */}
            <div>
              <Image
                src={georgetownImg}
                className="univ-logo img-fluid"
                alt="georgetown university logo"
              />
            </div>
            {/* University 04 */}
            <div>
              <Image
                src={harvardImg}
                className="univ-logo img-fluid"
                alt="harvard university logo"
              />
            </div>
            {/* University 05 */}
            <div>
              <Image src={ncbiImg} className="univ-logo img-fluid" alt="ncbi logo" />
            </div>
            {/* University 06 */}
            <div>
              <Image
                src={griffithImg}
                className="univ-logo img-fluid"
                alt="griffith university logo"
              />
            </div>
            {/* University 07  */}
            <div>
              <Image
                src={imperialImg}
                className="univ-logo img-fluid"
                alt="imperial university logo"
              />
            </div>
            {/* University 08  */}
            <div>
              <Image src={emblImg} className="univ-logo img-fluid" alt="embl logo" />
            </div>
            {/* University 09 */}
            <div>
              <Image src={sokaImg} className="univ-logo img-fluid" alt="soka university logo" />
            </div>
            {/* University 10  */}
            <div>
              <Image src={glyspaceImg} className="univ-logo img-fluid" alt="glyspace logo" />
            </div>
            {/* University 11  */}
            <div>
              <Image
                src={delawareImg}
                className="univ-logo img-fluid"
                alt="delaware university logo"
              />
            </div>
            {/* University 12 */}
            <div>
              <Image
                src={macquarieImg}
                className="univ-logo img-fluid"
                alt="macquarie university logo"
              />
            </div>
            {/* University 13*/}
            <div>
              <Image src={sibImg} className="univ-logo img-fluid" alt="sibImg university logo" />
            </div>
          </div>
        </Container>
      </section>
    </React.Fragment>
  );
};
export default UnivLogos;
