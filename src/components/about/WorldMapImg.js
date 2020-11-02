import React from "react";
import { Image } from "react-bootstrap";
import worldMap from "../../images/about/about-world-map-circle.svg";
import "../../css/About-map.css";
// !Important Keep these three lines below commented. They're disable <a href="javascript://"> line.
/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-no-comment-textnodes */

const WorldMapImg = (props) => {
  return (
    <React.Fragment>
      <section>
        <ul id="continents" style={{ backgroundImage: `url(${worldMap})` }}>
          <Image
            src={worldMap}
            alt="global map image"
            style={{ display: "none" }}
            className="img-fluid"
          />
          <li id="northamerica">
            <a href="javascript://">
              <span>
                <strong>North America</strong>
                <br />
                Athens, GA
                <br />
                Washington, DC
                <br />
                Bethesda, MD
                <br />
                Cambridge, MA
                <br />
                Bar Harbor, ME
              </span>
            </a>
          </li>
          <li id="asia">
            <a href="javascript://">
              <span>
                <strong>Asia</strong>
                <br />
                Tokyo, Japan
              </span>
            </a>
          </li>
          <li id="australia">
            <a href="javascript://">
              <span>
                <strong>Australia</strong>
                <br />
                Gold Coast, Queensland
              </span>
            </a>
          </li>
          <li id="europe">
            <a href="javascript://">
              <span>
                <strong>Europe</strong>
                <br />
                London, UK
                <br />
                Hinxton, Saffron Walden, UK
              </span>
            </a>
          </li>
        </ul>
      </section>
    </React.Fragment>
  );
};
export default WorldMapImg;
