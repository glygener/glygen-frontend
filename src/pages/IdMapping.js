import React, { useEffect, useState, useReducer, useRef } from "react";
import Helmet from "react-helmet";
import { getTitle, getMeta } from "../utils/head";
import { Container, Row, Col } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { useParams } from "react-router-dom";
import { Grid, Typography } from "@material-ui/core";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import SelectControl from "../components/select/SelectControl";
import HelpTooltip from "../components/tooltip/HelpTooltip";
import PageLoader from "../components/load/PageLoader";
import DialogAlert from "../components/alert/DialogAlert";
import TextAlert from "../components/alert/TextAlert";
import "../css/Search.css";
import { logActivity } from "../data/logging";
import { axiosError } from "../data/axiosError";
import idMappingData from "../data/json/idMapping";
import stringConstants from "../data/json/stringConstants";
import routeConstants from "../data/json/routeConstants";
import { getMappingInit, getMappingSearch, getMappingList } from "../data/mapping";
import ExampleExploreControl from "../components/example/ExampleExploreControl";
import { sortDropdownIgnoreCase } from "../utils/common";

const IdMapping = (props) => {
  let { id } = useParams("");
  const [initData, setInitData] = useState({});

  const fileInputRef = useRef();
  const [idMapSearchData, setIdMapSearchData] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      recordType: "glycan",
      inputNamespace: "any",
      outputNamespace: "any",
      inputIdlist: "",
    }
  );

  const [isInputTouched, setInputTouched] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      recordTypeInput: false,
      fromIdInput: false,
      toIdInput: false,
      idListInput: false,
      fileInput: false,
    }
  );

  const [fileUploadForm, setFileUploadForm] = useState(null);
  const [errorFileUpload, setErrorFileUpload] = useState(null);

  const [moleculeValidated, setMoleculeValidated] = useState(true);
  const [fromIdTypeValidated, setFromIdTypeValidated] = useState(false);
  const [toIdTypeValidated, setToIdTypeValidated] = useState(false);
  const [inputIdListValidated, setInputIdListValidated] = useState(false);
  const [fileUploadValidated, setFileUploadValidated] = useState(false);

  const [pageLoading, setPageLoading] = React.useState(true);
  const [alertTextInput, setAlertTextInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { show: false, id: "" }
  );

  const [alertDialogInput, setAlertDialogInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { show: false, id: "" }
  );

  // let idMapData = stringConstants.id_mapping;
  let commonIdMappingData = stringConstants.id_mapping.common;

  /**
   * Function to set recordtype (molecule) name value.
   * @param {string} value - input recordtype (molecule) name value.
   **/
  const recordTypeOnChange = (value) => {
    setInputTouched({ recordTypeInput: true });
    setIdMapSearchData({ recordType: value });
    setIdMapSearchData({ inputNamespace: "any" });
    setFromIdTypeValidated(false);
    setIdMapSearchData({ outputNamespace: "any" });
    setToIdTypeValidated(false);
    setIdMapSearchData({ inputIdlist: "" });
    setInputIdListValidated(false);
    if (value && value !== "any") {
      setMoleculeValidated(true);
    } else {
      setMoleculeValidated(false);
    }
  };
  /**
   * Function to set inputNamespace (From ID Type) name value.
   * @param {string} value - input inputNamespace (From ID Type) name value.
   **/
  const inputNamespaceOnChange = (value) => {
    setInputTouched({ fromIdInput: true });
    setIdMapSearchData({ inputNamespace: value });
    setIdMapSearchData({ outputNamespace: "any" });
    setToIdTypeValidated(false);
    setIdMapSearchData({ inputIdlist: "" });
    setInputIdListValidated(false);
    if (value && value !== "any") {
      setFromIdTypeValidated(true);
    } else {
      setFromIdTypeValidated(false);
    }
  };

  /**
   * Function to set outputNamespace (To ID Type) name value.
   * @param {string} value - input outputNamespace (To ID Type) name value.
   **/
  const outputNamespaceOnChange = (value) => {
    setInputTouched({ toIdInput: true });
    setIdMapSearchData({ outputNamespace: value });
    if (value && value !== "any") {
      setToIdTypeValidated(true);
    } else {
      setToIdTypeValidated(false);
    }
  };

  /**
   * Function to set inputIdlist (Enter IDs) name value.
   * @param {string} event - input inputIdlist (Enter IDs) name value.
   **/
  const inputIdlistOnChange = (event) => {
    setInputTouched({ idListInput: true });
    fileInputRef.current.value = "";
    setIdMapSearchData({ inputIdlist: event.target.value });
    if (event.target.value) {
      setInputIdListValidated(true);
      setFileUploadValidated(true);
      setErrorFileUpload("");
    } else {
      setInputIdListValidated(false);
    }
  };

  /**
   * Function to set id mapping input ID list value.
   * @param {string} inputFuncInputIdlist - id mapping input ID list value.
   **/
  function funcInputIdlistOnChange(inputFuncInputIdlist) {
    setInputTouched({ idListInput: true });
    fileInputRef.current.value = "";
    setIdMapSearchData({ inputIdlist: inputFuncInputIdlist });
    if (inputFuncInputIdlist) {
      setInputIdListValidated(true);
      setFileUploadValidated(true);
      setErrorFileUpload("");
    } else {
      setInputIdListValidated(false);
    }
  }

  const fileOnChangeHandler = () => {
    const typesFileUpload = ["text/plain"];
    const fileElem = fileInputRef.current;

    if (fileElem.files.length > 0) {
      const file = fileElem.files[0];
      if (fileElem && typesFileUpload.includes(file.type)) {
        setIdMapSearchData({ inputIdlist: "" });
        setFileUploadValidated(true);
        setInputIdListValidated(true);
        setErrorFileUpload("");
      } else {
        setFileUploadForm(null);
        setErrorFileUpload(idMappingData.file_upload.errorFileUpload);
        setFileUploadValidated(false);
      }
    }
  };

  const clearMapFields = () => {
    fileInputRef.current.value = "";
    setErrorFileUpload("");
    setIdMapSearchData({
      recordType: "glycan",
      inputNamespace: "any",
      outputNamespace: "any",
      inputIdlist: "",
    });

    setMoleculeValidated(true);
    setFromIdTypeValidated(false);
    setToIdTypeValidated(false);
    setInputIdListValidated(false);
    setFileUploadValidated(false);

    setInputTouched({
      recordTypeInput: false,
      fromIdInput: false,
      toIdInput: false,
      idListInput: false,
      fileInput: false,
    });
  };

  const onFetchDataByIdFormValidation = () => {
    setMoleculeValidated(true);
    setFromIdTypeValidated(true);
    setToIdTypeValidated(true);
    setInputIdListValidated(true);
    setFileUploadValidated(true);

    setInputTouched({
      recordTypeInput: false,
      fromIdInput: false,
      toIdInput: false,
      idListInput: false,
      fileInput: false,
    });
  };
  /**
   * useEffect for retriving data from api and showing page loading effects.
   */
  useEffect(() => {
    setPageLoading(true);
    logActivity();
    document.addEventListener("click", () => {
      setAlertTextInput({ show: false });
    });
    getMappingInit()
      .then((response) => {
        let initData = response.data;
        setInitData(initData);
        if (id === undefined) setPageLoading(false);
        id &&
          getMappingList(id)
            .then(({ data }) => {
              logActivity("user", id, "IdMapping modification initiated");
              setIdMapSearchData({
                recordType:
                  data.cache_info.query.recordtype === undefined
                    ? "any"
                    : data.cache_info.query.recordtype,
                inputNamespace:
                  data.cache_info.query.input_namespace === undefined
                    ? "any"
                    : data.cache_info.query.input_namespace,
                outputNamespace:
                  data.cache_info.query.output_namespace === undefined
                    ? "any"
                    : data.cache_info.query.output_namespace,
                inputIdlist:
                  data.cache_info.query.input_idlist === undefined
                    ? ""
                    : data.cache_info.query.input_idlist + ",",
                userfile:
                  data.cache_info.query.userfile === undefined
                    ? ""
                    : data.cache_info.query.userfile,
              });
              setPageLoading(false);
              onFetchDataByIdFormValidation();
            })
            .catch(function (error) {
              let message = "list api call";
              axiosError(error, "", message, setPageLoading, setAlertDialogInput);
            });
      })
      .catch(function (error) {
        let message = "search_init api call";
        axiosError(error, "", message, setPageLoading, setAlertDialogInput);
      });
  }, [id]);

  function searchJson(
    input_recordtype,
    input_inputnamespace,
    input_outputnamespace,
    input_inputidlist,
    input_userfile
  ) {
    if (input_inputidlist) {
      input_inputidlist = input_inputidlist.trim();
      input_inputidlist = input_inputidlist.replace(/\u200B/g, "");
      input_inputidlist = input_inputidlist.replace(/\u2011/g, "-");
      input_inputidlist = input_inputidlist.replace(/\s+/g, ",");
      input_inputidlist = input_inputidlist.replace(/,+/g, ",");
      var index = input_inputidlist.lastIndexOf(",");
      if (index > -1 && index + 1 === input_inputidlist.length) {
        input_inputidlist = input_inputidlist.substr(0, index);
      }
    }
    var formJson = {
      [commonIdMappingData.recordtype.id]: input_recordtype,
      [commonIdMappingData.input_namespace.id]: input_inputnamespace,
      [commonIdMappingData.output_namespace.id]: input_outputnamespace,
    };
    if (input_inputidlist) {
      formJson = { ...formJson, [commonIdMappingData.input_idlist.id]: input_inputidlist };
    } else {
      formJson = { ...formJson, [commonIdMappingData.userfile.id]: input_userfile };
    }
    return formJson;
  }

  const idMapHandleSubmit = () => {
    let formObject = searchJson(
      idMapSearchData.recordType,
      idMapSearchData.inputNamespace,
      idMapSearchData.outputNamespace,
      idMapSearchData.inputIdlist,
      fileInputRef.current.files[0]
    );
    logActivity("user", id, "Performing ID Mapping Search");
    let message = "ID Mapping Search query=" + JSON.stringify(formObject);
    getMappingSearch(formObject)
      .then((response) => {
        if (response.data["list_id"] !== "") {
          logActivity("user", (id || "") + ">" + response.data["list_id"], message).finally(() => {
            props.history.push(routeConstants.idMappingResult + response.data["list_id"]);
          });
          setPageLoading(false);
        } else {
          logActivity("user", "", "No results. " + message);
          setPageLoading(false);
          setAlertTextInput({
            show: true,
            id: stringConstants.errors.idMappingError.id,
          });
          window.scrollTo(0, 0);
        }
      })
      .catch(function (error) {
        axiosError(error, "", message, setPageLoading, setAlertDialogInput);
      });
  };

  /**
   * Function to handle click event for ID mapping.
   **/
  const searchIdMapClick = () => {
    setPageLoading(true);
    idMapHandleSubmit();
  };

  return (
    <React.Fragment>
      <Helmet>
        {getTitle("idMapping")}
        {getMeta("idMapping")}
      </Helmet>
      <div className="content-box-md">
        <div className="horizontal-heading text-center">
          <h5>{idMappingData.pageSubtitle}</h5>
          <h2>
            {idMappingData.pageTitle} <strong>{idMappingData.pageTitleBold}</strong>
          </h2>
        </div>
      </div>
      <Container className="id-mapping-content">
        <PageLoader pageLoading={pageLoading} />
        <DialogAlert
          alertInput={alertDialogInput}
          setOpen={(input) => {
            setAlertDialogInput({ show: input });
          }}
        />
        <TextAlert alertInput={alertTextInput} />

        {/* 1 recordtype Select Molecule */}
        <Grid item xs={12} sm={12} md={12}>
          <FormControl
            fullWidth
            variant="outlined"
            error={isInputTouched.recordTypeInput && !moleculeValidated}
          >
            <Typography className={"search-lbl"} gutterBottom>
              <span>1.</span>{" "}
              <HelpTooltip
                title={commonIdMappingData.recordtype.tooltip.title}
                text={commonIdMappingData.recordtype.tooltip.text}
              />
              {commonIdMappingData.recordtype.name}
            </Typography>
            <SelectControl
              placeholder={idMappingData.recordtype.placeholder}
              placeholderId={idMappingData.recordtype.placeholderId}
              placeholderName={idMappingData.recordtype.placeholderName}
              inputValue={idMapSearchData.recordType}
              setInputValue={recordTypeOnChange}
              Value={recordTypeOnChange}
              onBlur={() => {
                setInputTouched({ recordTypeInput: true });
              }}
              menu={Object.keys(initData).map((moleculeType) => {
                return {
                  id: initData[moleculeType].id,
                  name: initData[moleculeType].label,
                };
              })}
              required={true}
            />
          </FormControl>
          {isInputTouched.recordTypeInput && !moleculeValidated && (
            <FormHelperText className={"error-text"} error>
              {idMappingData.recordtype.required}
            </FormHelperText>
          )}
        </Grid>
        {/* 2 From ID / To ID */}
        <Grid container className="select-type">
          {/* input_namespace From ID Type */}
          <Grid item xs={12} sm={12} md={5} className="pt-3">
            <FormControl
              fullWidth
              variant="outlined"
              error={isInputTouched.fromIdInput && !fromIdTypeValidated}
            >
              <Typography className={"search-lbl"} gutterBottom>
                <span>2.</span>{" "}
                <HelpTooltip
                  title={commonIdMappingData.input_namespace.tooltip.title}
                  text={commonIdMappingData.input_namespace.tooltip.text}
                />
                {commonIdMappingData.input_namespace.name}
              </Typography>
              <SelectControl
                placeholder={idMappingData.input_namespace.placeholder}
                placeholderId={idMappingData.input_namespace.placeholderId}
                placeholderName={idMappingData.input_namespace.placeholderName}
                inputValue={idMapSearchData.inputNamespace}
                setInputValue={inputNamespaceOnChange}
                onBlur={() => {
                  setInputTouched({ fromIdInput: true });
                }}
                sortFunction={sortDropdownIgnoreCase}
                menu={
                  idMapSearchData.recordType === "any" || !Object.keys(initData).length
                    ? []
                    : [
                        ...Object.keys(initData[idMapSearchData.recordType].namespace).map(
                          (fromId) => {
                            return {
                              id: fromId,
                              name: fromId,
                            };
                          }
                        ),
                      ]
                }
                // menu={
                //   idMapSearchData.recordType === "any" || !Object.keys(initData).length
                //     ? []
                //     : [
                //         ...Object.keys(initData[idMapSearchData.recordType].namespace).map(
                //           (fromId) => {
                //             return {
                //               id: fromId,
                //               name: fromId,
                //             };
                //           }
                //         ),
                //       ]
                // }
                required={true}
              />
            </FormControl>
            {isInputTouched.fromIdInput && !fromIdTypeValidated && (
              <FormHelperText className={"error-text"} error>
                {idMappingData.input_namespace.required}
              </FormHelperText>
            )}
          </Grid>
          {/* output_namespace To ID Type */}
          <Grid item xs={12} sm={12} md={5} className="pt-3">
            <FormControl
              fullWidth
              variant="outlined"
              error={isInputTouched.toIdInput && !toIdTypeValidated}
            >
              <Typography className={"search-lbl"} gutterBottom>
                <HelpTooltip
                  title={commonIdMappingData.output_namespace.tooltip.title}
                  text={commonIdMappingData.output_namespace.tooltip.text}
                />
                {commonIdMappingData.output_namespace.name}
              </Typography>
              <SelectControl
                placeholder={idMappingData.output_namespace.placeholder}
                placeholderId={idMappingData.output_namespace.placeholderId}
                placeholderName={idMappingData.output_namespace.placeholderName}
                inputValue={idMapSearchData.outputNamespace}
                setInputValue={outputNamespaceOnChange}
                sortFunction={sortDropdownIgnoreCase}
                menu={
                  idMapSearchData.recordType === "any" || idMapSearchData.inputNamespace === "any"
                    ? []
                    : [
                        ...Object.keys(initData[idMapSearchData.recordType].namespace).map(
                          (toId) => {
                            return {
                              id: toId,
                              name: toId,
                            };
                          }
                        ),
                      ]
                }
                // menu={
                //   idMapSearchData.recordType === "any" || idMapSearchData.inputNamespace === "any"
                //     ? []
                //     : [
                //         ...initData[idMapSearchData.recordType].namespace[
                //           idMapSearchData.inputNamespace
                //         ].target_list.map((toId) => {
                //           return {
                //             id: toId,
                //             name: toId,
                //           };
                //         }),
                //       ]
                // }
                required={true}
              />
            </FormControl>
            {isInputTouched.toIdInput && !toIdTypeValidated && (
              <FormHelperText className={"error-text"} error>
                {idMappingData.output_namespace.required}
              </FormHelperText>
            )}
          </Grid>
        </Grid>
        {/* 3 Enter IDs */}
        <Grid item xs={12} sm={12} md={12} className="pt-3">
          <FormControl fullWidth variant="outlined">
            <Typography className={"search-lbl"} gutterBottom>
              <span>3.</span>{" "}
              <HelpTooltip
                title={commonIdMappingData.input_idlist.tooltip.title}
                text={commonIdMappingData.input_idlist.tooltip.text}
              />
              {commonIdMappingData.input_idlist.name}
            </Typography>
            <OutlinedInput
              fullWidth
              multiline
              rows="6"
              required={true}
              // classes={{
              //   option: "auto-option",
              //   inputRoot: "auto-input-root",
              //   input: "input-auto",
              // }}
              placeholder={idMappingData.input_idlist.placeholder}
              value={idMapSearchData.inputIdlist}
              onChange={inputIdlistOnChange}
              error={
                (isInputTouched.idListInput && !inputIdListValidated) ||
                idMapSearchData.inputIdlist.length > idMappingData.input_idlist.length
              }
              onBlur={(e) => {
                setInputTouched({ idListInput: true });
              }}
            ></OutlinedInput>

            {idMapSearchData.inputIdlist.length > idMappingData.input_idlist.length && (
              <FormHelperText className={"error-text"} error>
                {idMappingData.input_idlist.errorText}
              </FormHelperText>
            )}
            {isInputTouched.idListInput && !inputIdListValidated && (
              <FormHelperText className={"error-text"} error>
                {idMappingData.input_idlist.required}
              </FormHelperText>
            )}
            <ExampleExploreControl
              setInputValue={funcInputIdlistOnChange}
              inputValue={
                idMapSearchData.recordType === "any" || idMapSearchData.inputNamespace === "any"
                  ? []
                  : [
                      {
                        orderID: 100,
                        example: {
                          name: `Example for ${idMapSearchData.inputNamespace}: `,
                          id: initData[idMapSearchData.recordType].namespace[
                            idMapSearchData.inputNamespace
                          ].example_id_list.join(", "),
                        },
                      },
                    ]
              }
            />
          </FormControl>
        </Grid>
        {/* File Upload */}
        <Grid className="pt-2">
          <Typography className="mb-1">
            <strong>OR</strong>
          </Typography>
          <Typography className="mb-1">
            <i>{idMappingData.file_upload.upload_text}</i>
          </Typography>
        </Grid>
        <form>
          <label>
            <input
              className="mt-2"
              type="file"
              ref={fileInputRef}
              onChange={fileOnChangeHandler}
              onBlur={() => {
                setInputTouched({ fileInput: true });
              }}
            />
          </label>
          <div className="output">
            {errorFileUpload && (
              <div className="error" style={{ color: "red" }}>
                {errorFileUpload}
              </div>
            )}
            {fileUploadForm && <div>{fileUploadForm.name}</div>}
          </div>
        </form>
        <Typography>
          <i>{idMappingData.file_upload.acceptedFileTypeText}</i>
        </Typography>
        {/*  Buttons */}
        <Grid item xs={12} sm={12}>
          <Row className="gg-align-center pt-5">
            <Button className="gg-btn-outline mr-4" onClick={clearMapFields}>
              Clear Fields
            </Button>
            <Button
              className="gg-btn-blue"
              disabled={
                !(
                  moleculeValidated &&
                  toIdTypeValidated &&
                  fromIdTypeValidated &&
                  inputIdListValidated &&
                  fileUploadValidated
                ) || idMapSearchData.inputIdlist.length > idMappingData.input_idlist.length
              }
              onClick={searchIdMapClick}
            >
              Submit
            </Button>
          </Row>
        </Grid>
        <Row>
          <Col>
            <p className="text-muted mt-2">
              <strong>*</strong> These fields are required.
            </p>
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  );
};
export default IdMapping;
