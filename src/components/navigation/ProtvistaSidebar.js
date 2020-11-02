import "../../css/protvista.css";
import { FaAngleRight, FaAngleDown } from "react-icons/fa";
import React from "react";

const ProtvistaSidebar = ({ data, handleExpand, expanded, tracksShown }) => {
  return (
    <div class="main menu">
      <nav class="main-nav sidebarpadding">
        <ul className="main-nav-list">
          <li class="nav-item1 nav-nav  legendlist glycotrack">
            <a class="nav-links" href="#">
              Navigation
            </a>
          </li>
          <li class="nav-itemss nav-seq glycotrack legendlist">
            <a class="nav-links" href="#">
              Sequence
            </a>
          </li>
          <li className="nav-itemss nav-track nav-combinetrack legendlist">
            <a class="nav-links " href="#" onClick={handleExpand}>
              Glycosylation &nbsp;&nbsp;{" "}
              <span class="sizefor">
                {expanded ? <FaAngleDown /> : <FaAngleRight />}
              </span>
            </a>
          </li>
          <li
            id="reported_Nglycan"
            className={
              "nav-itemss nav-track indentsubnav glycotrack legendlist" +
              (expanded ? "" : " hidden")
            }
          >
            <a
              href="#"
              class="nav-links"
              data-toggle="tooltip"
              title="N-Glycans reported at indicated site!"
            >
              N-Glycan
            </a>
          </li>
          <li
            id="nonreported_Nglycan"
            className={
              "nav-itemss nav-track indentsubnav glycotrack  legendlist" +
              (expanded ? "" : " hidden")
            }
          >
            <a
              href="#"
              class="nav-links"
              data-toggle="tooltip"
              title="Sites informatically predicted to be glycosylated"
            >
              N-Glycan-Site
            </a>
          </li>
          <li
            id="reported_Oglycan glycotrack"
            className={
              "nav-itemss nav-track indentsubnav glycotrack  legendlist" +
              (expanded ? "" : " hidden")
            }
          >
            <a
              href="#"
              class="nav-links"
              data-toggle="tooltip"
              title="O-Glycans reported at indicated site"
            >
              O-Glycan
            </a>
          </li>
          <li
            id="nonreported_Oglycan"
            className={
              "nav-itemss nav-track indentsubnav glycotrack  legendlist" +
              (expanded ? "" : " hidden")
            }
          >
            <a
              href="#"
              class="nav-links"
              data-toggle="tooltip"
              title="Sites informatically predicted to be glycosylated"
            >
              O-Glycan-Site
            </a>
          </li>
          <li
            id="reported_sequon"
            className={
              "nav-itemss nav-track indentsubnav glycotrack.nav-links  legendlist" +
              (expanded ? "" : " hidden")
            }
          >
            <a
              href="#"
              className="nav-links"
              data-toggle="tooltip"
              title="Consensus sequence for N-glycosylation"
            >
              N-Glycan-Sequon
            </a>
          </li>
          {/* {tracksShown && tracksShown.mutation && ( */}
          <li class="nav-itemss glycotrack legendlist">
            <a
              href="#"
              className="nav-links"
              data-toggle="tooltip"
              title="The action or process of mutating."
            >
              Single Nucleotide Variation
            </a>
          </li>
          {/* )} */}
          <li class="nav-item1 nav-nav  legendlist glycotrack">
            <a class="nav-links" href="#">
              Mutagenesis
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default ProtvistaSidebar;
