import React, { useState, useReducer } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Row, Col } from "react-bootstrap";
import { downloadFileFromServer, downloadFile } from "../utils/download";
import FormControl from "@mui/material/FormControl";
// import InputLabel from '@mui/material/InputLabel';
import Button from "react-bootstrap/Button";
import GetAppIcon from "@mui/icons-material/GetApp";
import { Link } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SelectControl from "./select/SelectControl";
import { getFileDownload } from "../data/commonApi";
import { Loading } from "./load/Loading";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import stringConstants from '../data/json/stringConstants';
import DialogAlert from "../components/alert/DialogAlert";

const DownloadFileMenu = (props) => {
  const { url, id, itemType, fileName, mimeType, fileData, fromData, dataId, types, getData } = props;
  const [showLoading, setShowLoading] = useState(false);
  const [alertDialogInput, setAlertDialogInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { show: false, id: "" }
  );

  const [show, setShow] = useState(false);
  const [format, setFormat] = useState(props.format || props.types[0].type);
  const [compressed, setCompressed] = useState(props.compressed || false);
  const [collapsed, setCollapsed] = useState(false);

  const [itemTypeResolver] = useState(() => {
    switch (itemType) {
      case "url_file_download":
        return getFileDownload;
      default:
    }
    return null;
  });

  const handleDownload = async () => {

    let fromData = getData(format);

    if (fromData === undefined || fromData.length === 0) {
     (setAlertDialogInput && setAlertDialogInput({"show": true, "id": stringConstants.errors.selectIDCartDownload.id}));
     return;
    }

    setShowLoading(true);

    try {
      if (fromData) {
         downloadFile(fromData, format + "_" + fileName + "." + mimeType, mimeType);
      } else {
        await downloadFileFromServer(id, url, mimeType, fileName, itemTypeResolver);
      }
    } finally {
      setShowLoading(false);
    }
  };

  const clearForm = () => {
    setFormat(props.types[0].type);
    setCompressed(props.compressed || false);
    setCollapsed(false);
  };

  const handleClickOutside = (event) => {
    setShow(false);
  };

  return (
    <>
    {showLoading && <Loading show={showLoading} />}
    <DialogAlert
      alertInput={alertDialogInput}
      setOpen={input => {
        setAlertDialogInput({ show: input });
      }}
      />
    <span className="text-right">
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
          <GetAppIcon /> DOWNLOAD
          <span className="caret me-1"></span>
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
                        <strong>Download:</strong>
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
                          defaultValue={types.filter(Boolean)[0].type}
                          menu={types.filter(Boolean).map((typeItem) => {
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
export default DownloadFileMenu;
