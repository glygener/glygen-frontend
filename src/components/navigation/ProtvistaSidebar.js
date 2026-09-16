import "../../css/protvista.css";
import { FaAngleRight, FaAngleDown } from "react-icons/fa";
import React from "react";

const ProtvistaSidebar = ({ data, handleExpand, handleExpand2, expanded, metalTypes, expanded2, tracksShown }) => {
  return (
    <div class="main menu">
      <nav class="main-nav sidebarpadding">
        <ul className="main-nav-list">
          <li class="nav-item1 nav-nav  legendlist glycotrack">
            <a class="nav-links" >
              Navigation
            </a>
          </li>
          <li class="nav-itemss nav-seq glycotrack legendlist">
            <a class="nav-links" >
              Sequence
            </a>
          </li>
          <li className="nav-itemss nav-track nav-combinetrack legendlist">
            <a class="nav-links "  onClick={handleExpand}>
              Glycosylation &nbsp;&nbsp;{" "}
              <span class="sizefor">{expanded ? <FaAngleDown /> : <FaAngleRight />}</span>
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
              className="nav-links"
              data-toggle="tooltip"
              title="Consensus sequence for N-glycosylation"
            >
              N-Glycan-Sequon
            </a>
          </li>
          <li className="nav-itemss nav-track nav-combinetrack legendlist">
            <a class="nav-links "  onClick={handleExpand2}>
              Binding Metal &nbsp;&nbsp;{" "}
              <span class="sizefor">{expanded2 ? <FaAngleDown /> : <FaAngleRight />}</span>
            </a>
          </li>
          {metalTypes && metalTypes.length > 0 && metalTypes.map(type => <li
            id="reported_Nglycan"
            className={
              "nav-itemss nav-track indentsubnav glycotrack legendlist" +
              (expanded2 ? "" : " hidden")
            }
          >
            <a
              class="nav-links"
              data-toggle="tooltip"
              title="N-Glycans reported at indicated site!"
            >
              {type}
            </a>
          </li>)}
          <li class="nav-item1 nav-nav  legendlist glycotrack">
            <a class="nav-links" >
              Domain
            </a>
          </li>
          <li class="nav-item1 nav-nav  legendlist glycotrack">
            <a class="nav-links" >
              Phosphorylation
            </a>
          </li>
          <li class="nav-item1 nav-nav  legendlist glycotrack">
            <a class="nav-links" >
              Glycation
            </a>
          </li>
          {/* {tracksShown && tracksShown.mutation && ( */}
          <li class="nav-itemss glycotrack legendlist">
            <a
              className="nav-links"
              data-toggle="tooltip"
              title="The action or process of mutating."
            >
              Single Nucleotide Variation
            </a>
          </li>
          {/* )} */}
          <li class="nav-item1 nav-nav  legendlist glycotrack">
            <a class="nav-links" >
              Mutagenesis
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default ProtvistaSidebar;
