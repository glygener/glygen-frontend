import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Row, Col } from "react-bootstrap";
import { downloadFileFromServer } from "../utils/download";
import FormControl from "@mui/material/FormControl";
// import InputLabel from '@mui/material/InputLabel';
import Button from "react-bootstrap/Button";
import GetAppIcon from "@mui/icons-material/GetApp";
import { Link } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SelectControl from "./select/SelectControl";
import { getFileDownload } from "../data/commonApi";
import { Loading } from "./load/Loading";

const DownloadFile = (props) => {
  const { url, id, itemType, fileName, mimeType } = props;
  const [showLoading, setShowLoading] = useState(false);

  const [itemTypeResolver] = useState(() => {
    switch (itemType) {
      case "url_file_download":
        return getFileDownload;
      default:
    }
    return null;
  });

  const handleDownload = async () => {
    setShowLoading(true);

    try {
      await downloadFileFromServer(id, url, mimeType, fileName, itemTypeResolver);
    } finally {
      setShowLoading(false);
    }
  };

  return (
    <>
    {showLoading && <Loading show={showLoading} />}
    <span className="text-right">
      <Link>
        <Button
          className="gg-btn-blue gg-drownload-btn-card"
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
            handleDownload();
          }}
        >
          <GetAppIcon /> DOWNLOAD
        </Button>
      </Link>
    </span>
    </>
  );
};
export default DownloadFile;
