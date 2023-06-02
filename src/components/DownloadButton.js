import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Row, Col } from "react-bootstrap";
import { downloadFromServer } from "../utils/download";
import FormControl from "@mui/material/FormControl";
// import InputLabel from '@mui/material/InputLabel';
import Button from "react-bootstrap/Button";
import GetAppIcon from "@mui/icons-material/GetApp";
import { Link } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SelectControl from "./select/SelectControl";
import { getProteinDetailDownload, getProteinListDownload, getProteinSectionDownload } from "../data/protein";
import { getProteinSiteDetailDownload, getProteinSiteListDownload, getProteinSiteSectionDownload } from "../data/protein";
import { getGlycanDetailDownload, getGlycanListDownload, getGlycanSectionDownload } from "../data/glycan";
import { getMotifListDownload, getMotifDetailDownload, getMotifSectionDownload } from "../data/motif";
import { getIdMappingMappedDownload } from "../data/mapping";
import { getIdMappingUnmappedDownload } from "../data/mapping";
import { getOrthologListDownload, getLocusListDownload } from "../data/usecases";
import { getPublicationDetailDownload, getPublicationSectionDownload } from "../data/publication";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { Loading } from "./load/Loading";

const DownloadButton = (props) => {
  const { types, dataId, itemType = "glycan_list" } = props;
  const [showLoading, setShowLoading] = useState(false);

  const [itemTypeResolver] = useState(() => {
    switch (itemType) {
      case "glycan_list":
        return getGlycanListDownload;
      case "glycan_detail":
          return getGlycanDetailDownload;
      case "glycan_section":
            return getGlycanSectionDownload;
      case "motif_list":
        return getMotifListDownload;
      case "motif_detail":
        return getMotifDetailDownload;
      case "motif_section":
        return getMotifSectionDownload;
      case "protein_list":
        return getProteinListDownload;
      case "protein_detail":
          return getProteinDetailDownload;
      case "protein_section":
            return getProteinSectionDownload;
      case "site_list":
        return getProteinSiteListDownload;
      case "site_detail":
          return getProteinSiteDetailDownload;
      case "site_section":
          return getProteinSiteSectionDownload;
      case "idMappingMapped":
        return getIdMappingMappedDownload;
      case "idMappingUnmapped":
        return getIdMappingUnmappedDownload;
      case "ortholog_list":
        return getOrthologListDownload;
      case "locus_list":
        return getLocusListDownload;
      case "publication_detail":
        return getPublicationDetailDownload;
      case "publication_section":
        return getPublicationSectionDownload;
      default:
    }
    return null;
  });

  const [show, setShow] = useState(false);
  const [format, setFormat] = useState(props.format || props.types[0].type);
  // const [displayformat, setDisplayFormat] = useState(display);
  const [compressed, setCompressed] = useState(props.compressed || false);

  const handleDownload = async () => {
    setShowLoading(true);
    const selObj = types.find((typeItem) => typeItem.type === format);
    const dataType = selObj.data;
    const section = selObj.section;
    let fileFormat = format;
    let fileName = undefined;
    if (section) {
      fileFormat = selObj.format;
      fileName = selObj.fileName;
    }
    try {
      await downloadFromServer(dataId, fileFormat, compressed, dataType, itemTypeResolver, section, fileName, props.filters);
    } finally {
      setShow(false);
      setShowLoading(false);
    }
  };
  const clearForm = () => {
    setFormat( props.format || props.types[0].type);
    setCompressed(props.compressed || false);
  };
  const handleClickOutside = (event) => {
    setShow(false);
  };

  return (
    <>
    {showLoading && <Loading show={showLoading} />}
    <span className="text-right">
      <Link>
      {(props.showBlueBackground) ?  
        (<Button
          className="gg-btn-blue gg-drownload-btn-card dropdown-toggle"
          style={{
            marginLeft: "10px",
            display:"inline-block"
          }}
          disabled={!props.enable}
          type="button"
          id="download"
          alt="Download results"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="true"
          onClick={() => {
            setShow(!show);
          }}
        >
          <GetAppIcon /> DOWNLOAD
          <span className="caret me-1"></span>
        </Button>)
        :
        (<button
          className="btn btn-link gg-download-btn dropdown-toggle"
          type="button"
          id="download"
          alt="Download results"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="true"
          onClick={() => {
            setShow(!show);
          }}
        >
          <GetAppIcon /> DOWNLOAD
          <span className="caret me-1"></span>
        </button>)}
      </Link>
      {show && (
        <>
          <ClickAwayListener onClickAway={handleClickOutside}>
            <div
              style={{ padding: "15px" }}
              className={"dropdown-menu dropdown-menu-right" + (show ? " open show" : "")}
              aria-labelledby="download"
            >
              <Row>
                <Col>
                  <button
                    type="button"
                    class1Name="gg-blue-color"
                    style={{
                      float: "right",
                      border: "none",
                      backgroundColor: "inherit",
                      padding: "0",
                    }}
                    onClick={() => {
                      clearForm();
                      setShow(!show);
                    }}
                  >
                    <CloseIcon />
                  </button>
                </Col>
              </Row>
              <Row>
                <Col>
                  <FormControl margin="dense" variant="outlined" fullWidth>
                    <Row>
                      <Col x1s={4} s1m={4} style={{ paddingTop: "6px" }}>
                        <strong>Format:</strong>
                      </Col>

                      <Col
                        x1s={8}
                        sm1={8}
                        // align="right !important"
                        clas1sName="text-end"
                      >
                        <SelectControl
                          fullWidth
                          inputValue={format}
                          defaultValue={props.types[0].type}
                          menu={types.map((typeItem) => {
                            return {
                              id: typeItem.type,
                              name: typeItem.display,
                            };
                          })}
                          setInputValue={(value) => {
                            setFormat(value);
                          }}
                        />
                      </Col>
                    </Row>
                  </FormControl>
                </Col>
              </Row>
              <Row style={{ paddingTop: "10px" }}>
                <Col
                // xs={ 7 } sm={ 7 }
                >
                  <strong style={{ whiteSpace: "nowrap" }}>Compress file (*.gzip):</strong>
                </Col>
                <Col
                  // xs={ 5 } sm={ 5 }
                  align="right"
                >
                  <input
                    // style={{ fontSize: 'xx-large' }}
                    type="checkbox"
                    id="download_compression"
                    checked={compressed}
                    onChange={(e) => {
                      setCompressed(e.target.checked);
                    }}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button
                    type="button"
                    style={{ marginTop: "15px", float: "right" }}
                    className="gg-btn-outline"
                    onClick={handleDownload}
                  >
                    OK
                  </Button>
                </Col>
              </Row>
            </div>
          </ClickAwayListener>
        </>
      )}
    </span>
    </>
  );
};
export default DownloadButton;
