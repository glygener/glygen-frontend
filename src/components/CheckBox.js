import React, { useState } from "react";
import { Checkbox, Collapse } from "@material-ui/core";
//import { BrowserRouter } from "react-router-dom";
const { Panel } = Collapse;

const FirstLevelData = [
  { id: 1, name: "Mass" },
  { id: 2, name: "Organism" },
  { id: 3, name: "Glycan Type" },
  { id: 4, name: "Sugar" },
  { id: 5, name: "Data" }
];

function CheckBox(props) {
  const [Checked, setChecked] = useState([]);
  const HandleSelection = value => {
    const currentIndex = Checked.indexOf(value);
    const newChecked = [...Checked];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
    props.HandleSelection(newChecked);
  };

  const renderCheckboxLists = () =>
    FirstLevelData.map((value, index) => (
      <React.Fragment key={index}>
        <Checkbox
          onChange={() => HandleSelection(value.id)}
          type="checkbox"
          checked={Checked.indexOf(value.id) === -1 ? false : true}
        />
        <span>{value.name}</span>
      </React.Fragment>
    ));

  return (
    <div>
      <Collapse defaultActiveKey={["0"]}></Collapse>
      <Panel header="FirstLevelData" key="1"></Panel>
      {renderCheckboxLists()}
    </div>
  );
}
export default CheckBox;
