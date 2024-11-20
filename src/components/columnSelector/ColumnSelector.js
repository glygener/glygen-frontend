
import React, { useState, useEffect, useReducer } from "react";
import Slide from '@mui/material/Slide';
import Typography from '@mui/material/Typography';
import ColumnList from "./ColumnList"
import AccordionMUI from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Transition = React.forwardRef(function Transition(
  props,
  ref
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CustomSelector = props => {
  const {
    categories,
    selectedColumns,
    handleSelectHighlight
  } = props;

  const [showCategories, setShowCategories] = useState(true);
  const [expandedCategories, setExpandedCategories] = useReducer(
    (state, newState) => ({
      ...state,
      ...newState,
    }), {
    catInd: []
  }
  );

  /**
 * Function to handle on change event for category accordian.
 **/
  function handleCategories(event, expanded, catInd) {
    let catArr = expandedCategories;
    if (expanded) {
      catArr.catInd.push(catInd);
    } else {
      const ind = catArr.catInd.indexOf(catInd);
      if (ind > -1) {
        catArr.catInd.splice(ind, 1);
      }
    }
    setExpandedCategories(catArr)
  }

  return (
    <>

      {categories && categories.length && (
        <div>
          {categories.map((category, catInd) => (
            <AccordionMUI disableGutters={true} key={"catDiv" + catInd}
              expanded={showCategories ? !expandedCategories.catInd.includes(catInd) : expandedCategories.catInd.includes(catInd)}
              onChange={(event, expanded) => handleCategories(event, showCategories ? !expanded : expanded, catInd)}
            >
              <AccordionSummary
                style={{ backgroundColor: "#f0f0f0", height: "50px" }}
                expandIcon={<ExpandMoreIcon className="gg-blue-color" />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography className="gg-blue-color">{category.label}</Typography>
              </AccordionSummary>
              <AccordionDetails style={{ paddingBottom: "0px" }}>
                <ColumnList
                  columns={category.columns}
                  selectedColumns={selectedColumns}
                  handleSelectHighlight={handleSelectHighlight}
                />
              </AccordionDetails>
            </AccordionMUI>
          ))}
        </div>
      )}

    </>);
};

export default CustomSelector;