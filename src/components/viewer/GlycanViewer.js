import { useEffect, useState, useRef, useReducer } from "react";
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import { glymagesvgInit } from "../../data/glycan"
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import "../../css/glymagesvg.css";
import Button from "react-bootstrap/Button";
import motifList from "../../data/json/motif_mapping.json";
import enzyme from "../../data/json/enzyme_mapping.json";
import GlycanViewerTooltip from "../tooltip/GlycanViewerTooltip";
import { Col, Row } from "react-bootstrap";
import routeConstants from "../../data/json/routeConstants";

/**
 * GlycanViewer component for highlighting glycan image features.
 */
export default function GlycanViewer({motifList, resParentList, enzParentList, checkedResidue, setCheckedResidue, 
  checkedMotif, setCheckedMotif, checkedEnzyme, setCheckedEnzyme}) {

  const [expanded, setExpanded] = useState('residues');

  const handleChange =
  (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);

    residueClear();
    motifClear();
    enzymeClear();
  };

  useEffect(() => {
    let temp = {};
      for (let i = 0; i < resParentList.length; i++) {
        temp["Residue." + resParentList[i].id] = false
        if (resParentList[i]) {
          let children = resParentList[i].children;
          if (children) {
            for (let j = 0; j < children.length; j++) {
              temp["Residue." + children[j].id] = false
            }
          }
        }
      }
      setCheckedResidue({...temp});

      let tempMotif = {};
      for (let i = 0; i < motifList.length; i++) {
        tempMotif["Motif." + motifList[i].id] = false;
      }
      setCheckedMotif({...tempMotif});

      let tempEnz = {};
      for (let i = 0; i < enzParentList.length; i++) {
        if (enzParentList[i]) {
          let enz_list = enzParentList[i].enz_list;
          if (enz_list) {
            for (let j = 0; j < enz_list.length; j++) {
              tempEnz["Enzyme." + enz_list[j].id] = false;
            }
          }
        }
      }
      setCheckedEnzyme({...tempEnz})
      glymagesvgInit();
  }, [])

  const handleChangeResidue = (event, id) => {
    let temp = checkedResidue;
    temp[id] = event.target.checked;
    setCheckedResidue({...temp});

    let el = document.getElementById(id);
    if (el) {
      el.click();
    }
  };

  const handleChangeEnzyme = (event, id, parentIndex, index) => {
    let temp = checkedEnzyme;
    temp[id] = event.target.checked;
    setCheckedEnzyme({...temp});

    let el = document.getElementById(id);
    if (el) {
      el.click();
    }
  };

  const handleChangeMotif = (event, id, index, motif_ac) => {
    let temp = checkedMotif;
    temp[id] = event.target.checked;
    setCheckedMotif({...temp});

    let el = document.getElementById(id);
    if (el) {
      el.click();
    }
  };

  function residueClear() {
    let temp = checkedResidue;

    const nodeList = document.querySelectorAll('[glymagesvg_residues=residues]');
    for (let i = 0; i < nodeList.length; i++) {
      let node = nodeList[i];
      if (node && nodeList[i].id && temp[nodeList[i].id]) {
        nodeList[i].click();
        temp[nodeList[i].id] = false;
      }
    }

    setCheckedResidue({...temp});
  }

  function motifClear() {
    let temp = checkedMotif;

    const nodeList = document.querySelectorAll('[glymagesvg_motifs=motifs]');
    for (let i = 0; i < nodeList.length; i++) {
      let node = nodeList[i];
      if (node && nodeList[i].id && temp[nodeList[i].id]) {
        nodeList[i].click();
        temp[nodeList[i].id] = false;
      }
    }

    setCheckedMotif({...temp})
  }

  function enzymeClear() {
    let temp = checkedEnzyme;

    const nodeList = document.querySelectorAll('[glymagesvg_enzymes=enzymes]');
    for (let i = 0; i < nodeList.length; i++) {
      let node = nodeList[i];
      if (node && nodeList[i].id && temp[nodeList[i].id]) {
        nodeList[i].click();
        temp[nodeList[i].id] = false;
      }
    }

    setCheckedEnzyme({...temp});
  }

  const ChildNodesResidue = ({childrenList, parentIndex}) => (<>
      <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3, overflow: "auto" }}>
        {childrenList && childrenList.length > 0 && childrenList.map((child, index) => (
          <div>
            <FormControlLabel
                className="feature-view-label"
                label={child.name}
                control={<Checkbox 
                checked={checkedResidue["Residue." + child.id] === undefined ? false : checkedResidue["Residue." + child.id]} 
                onChange={(event) => handleChangeResidue(event, "Residue." + child.id)} 
              />}
            />
            <GlycanViewerTooltip
              title={child.name}
              text={""}
              helpIcon="gg-helpicon-feature-view"
              type="residue"
              id={child.id}
              pubChemCompound={child.pubChemCompound}
              pubChemUrl={"https://pubchem.ncbi.nlm.nih.gov/compound/"}
              wikiLink={child.url}
              imagePath= {"/icons/svg/" + child.image}
            />
          </div>
        ))}
      </Box>
    </>);

  const ChildNodesEnzyme = ({childrenList}) => (<>
      <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3, overflow: "auto" }}>
        {childrenList && childrenList.length > 0 && childrenList.map((child, index) => (
          <div>
            <FormControlLabel
              className="feature-view-label"
              label={child.name}
              control={<Checkbox 
                checked={checkedEnzyme["EnzymeUniAcc." + child.id] === undefined ? false : checkedEnzyme["EnzymeUniAcc." + child.id]}
                onChange={(event) => handleChangeEnzyme(event, "EnzymeUniAcc." + child.id)} />}
            />
            <GlycanViewerTooltip
              title={child.name}
              text={""}
              helpIcon="gg-helpicon-feature-view"
              urlText={child.id}
              url={routeConstants.proteinDetail + child.id}
              type="enzyme"
              id={child.id}
            />
          </div>
        ))}
      </Box>
     </>);

   const ChildNodesMotif = ({childrenList}) => (<>
      <Box sx={{ display: 'flex', flexDirection: 'column', overflow: "auto" }}>
        {childrenList && childrenList.length > 0 && childrenList.map((child, index) => (
          <div>
            <FormControlLabel
              className="feature-view-label"
              label={child.name}
              control={<span>
                <Checkbox 
                checked={checkedMotif["Motif." + child.id] === undefined ? false : checkedMotif["Motif." + child.id]} 
                onChange={(event) => handleChangeMotif(event, "Motif." + child.id)} />
              </span>
              }
            />
            <GlycanViewerTooltip
              title={child.name}
              text={""}
              helpIcon="gg-helpicon-feature-view"
              urlText={child.id}
              url={routeConstants.motifDetail + child.id}
              glycoMotifUrl={"https://glycomotif.glyomics.org/glycomotif/"}
              type="motif"
              id={child.id}
            />
          </div>
        ))}
      </Box>
    </>);

  return (
    <div>
        <Accordion defaultExpanded={true} disableGutters={true} expanded={expanded === 'residues'} onChange={handleChange('residues')}>
          <AccordionSummary
            style={{backgroundColor: "#f5f8fa"}}
            expandIcon={<ExpandMoreIcon className="gg-blue-color"/>}
            aria-controls="panel1a-content"
            id="panel1a-header"
            classes={{
              content:"acc-summary"
            }}
          >
            <Row>
              <Col>
                <Typography className="gg-blue-color pt-1">Residues</Typography>
              </Col>
              <Col>
                <div className="text-end gg-download-btn-width 1pe-1">
                  <Button
                    type="button"
                    className="gg-btn-blue"
                    onClick={(e) => {
                      e.stopPropagation();
                      residueClear();
                    }}
                  >
                    Clear
                  </Button>
                </div>
              </Col>
            </Row>
          </AccordionSummary>
          <AccordionDetails style={{maxHeight: "350px", minWidth: "100px", overflow: "scroll"}}>
            {resParentList.map((resParent, index) => (<>
                <div>
                  <FormControlLabel
                    className="feature-view-label"
                    label={resParent.name}
                    control={
                      <Checkbox
                        checked={checkedResidue["Residue." + resParent.id] === undefined ? false : checkedResidue["Residue." + resParent.id]}
                        onChange={(event) => handleChangeResidue(event, "Residue." + resParent.id)}
                      />
                    }
                  />
                  <GlycanViewerTooltip
                    title={resParent.name}
                    text={""}
                    helpIcon="gg-helpicon-feature-view"
                    type="residue"
                    id={resParent.id}
                    pubChemCompound={resParent.pubChemCompound}
                    pubChemUrl={"https://pubchem.ncbi.nlm.nih.gov/compound/"}
                    wikiLink={resParent.url}
                    imagePath= {"/icons/svg/" + resParent.image}
                  />
                </div>
                {resParent.children && resParent.children.length > 0 && <ChildNodesResidue childrenList={resParent.children} parentIndex={index}/>}
              </>))}
          </AccordionDetails>
        </Accordion>

        <Accordion disableGutters={true} expanded={expanded === 'motifs'} onChange={handleChange('motifs')}>
          <AccordionSummary
            style={{backgroundColor: "#f5f8fa"}}
            expandIcon={<ExpandMoreIcon className="gg-blue-color"/>}
            aria-controls="panel1a-content"
            id="panel1a-header"
            classes={{
              content:"acc-summary"
            }}
          >
            <Row>
              <Col>
                <Typography className="gg-blue-color pt-1">Motifs</Typography>
              </Col>
            <Col> 
              <div className="text-end gg-download-btn-width">
                <Button
                  type="button"
                  className="gg-btn-blue"
                  onClick={(e) => {
                    e.stopPropagation();
                    motifClear();
                  }}
                >
                  Clear
                </Button>
              </div>
            </Col>
            </Row>
          </AccordionSummary>
          <AccordionDetails style={{maxHeight: "350px", minWidth: "100px", overflow: "scroll"}}>
          {motifList && motifList.length > 0 && <ChildNodesMotif childrenList = {motifList}/>}
        </AccordionDetails>
      </Accordion>

      <Accordion disableGutters={true} expanded={expanded === 'enzymes'} onChange={handleChange('enzymes')}>
        <AccordionSummary
          style={{backgroundColor: "#f5f8fa"}}
          expandIcon={<ExpandMoreIcon className="gg-blue-color"/>}
          aria-controls="panel1a-content"
          id="panel1a-header"
          classes={{
            content:"acc-summary"
          }}
        >
          <Row>
            <Col>
              <Typography className="gg-blue-color pt-1">Enzymes</Typography>
            </Col>
            <Col>
              <div className="text-end gg-download-btn-width">
                <Button
                  type="button"
                  className="gg-btn-blue"
                  onClick={(e) => {
                    e.stopPropagation();
                    enzymeClear();
                  }}
                >
                  Clear
                </Button>
              </div>
            </Col>
          </Row>
        </AccordionSummary>
        <AccordionDetails style={{maxHeight: "350px", minWidth: "100px", overflow: "scroll"}}>
          {enzParentList.map((enzParent, index) => (<>
              <div>
                <FormLabel component="legend"><strong>{enzParent.tax_common_name}</strong></FormLabel>
              </div>
              <ChildNodesEnzyme childrenList={enzParent.enz_list} parentIndex={index}/>
            </>))
          }
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
