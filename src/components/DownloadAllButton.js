import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Row, Col } from "react-bootstrap";
import { downloadFromServer } from "../utils/download";
import FormControl from "@mui/material/FormControl";
import Button from "react-bootstrap/Button";
import GetAppIcon from "@mui/icons-material/GetApp";
import { Link } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SelectControl from "./select/SelectControl";
import { getGlycanListDownload } from "../data/glycan";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { getIdMappingDownloadAll } from "../data/mapping";
import { Loading } from "./load/Loading";

const DownloadAllButton = (props) => {
  const { types, dataId, itemType = "glycan" } = props;
  const [showLoading, setShowLoading] = useState(false);

  const [itemTypeResolver] = useState(() => {
    switch (itemType) {
      case "glycan":
        return getGlycanListDownload;
      case "idMappingAll":
        return getIdMappingDownloadAll;
      default:
    }
    return null;
  });

  const [show, setShow] = useState(false);
  const [format, setFormat] = useState(props.format || props.types[0].type);
  const [compressed, setCompressed] = useState(props.compressed || false);
  const [collapsed, setCollapsed] = useState(false);

  const handleDownload = async () => {
    setShowLoading(true);
    let dataType = types.find((typeItem) => typeItem.type === format).data;
    if (collapsed) dataType = "idmapping_list_all_collapsed";
    try {
      await downloadFromServer(dataId, format, compressed, dataType, itemTypeResolver);
    } finally {
      setShow(false);
      setShowLoading(false);
    }
  };
  const clearForm = () => {
    setFormat(props.format || props.types[0].type);
    setCompressed(props.compressed || false);
    setCollapsed(false);
  };
  const handleClickOutside = (event) => {
    setShow(false);
  };

  return (
    <>
      {showLoading && <Loading show={showLoading} />}
      <div className="dropdown text-right">
        <Link>
          <button
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
            <GetAppIcon /> DOWNLOAD ALL
            <span className="caret mr-1"></span>
          </button>
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
                      className="gg-blue-color"
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
                        <Col xs={3} sm={3} style={{ paddingTop: "6px" }}>
                          <strong>Format:</strong>
                        </Col>

                        <Col xs={9} sm={9} className="text-right">
                          <SelectControl
                            fullWidth
                            inputValue={format}
                            menu={types.map((typeItem) => {
                              return { id: typeItem.type, name: typeItem.display };
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
                  <Col>
                    <strong style={{ whiteSpace: "nowrap" }}>Compress file (*.gzip):</strong>
                  </Col>
                  <Col align="right">
                    <input
                      type="checkbox"
                      id="download_compression"
                      checked={compressed}
                      onClick={(e) => {
                        setCompressed(e.target.checked);
                      }}
                    />
                  </Col>
                </Row>
                <Row style={{ paddingTop: "10px" }}>
                  <Col>
                    <strong style={{ whiteSpace: "nowrap" }}>Collapse 1:n mapping:</strong>
                  </Col>
                  <Col align="right">
                    <input
                      type="checkbox"
                      checked={collapsed}
                      onClick={(e) => {
                        setCollapsed(e.target.checked);
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
      </div>
    </>
  );
};
export default DownloadAllButton;
