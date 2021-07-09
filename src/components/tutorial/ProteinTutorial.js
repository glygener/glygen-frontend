import React from "react";
import Grid from "@material-ui/core/Grid";
import HorizontalHeading from "../headings/HorizontalHeading";
// import VerticalHeading from "../headings/VerticalHeading";
import Iframe from "react-iframe";
import { Typography } from "@material-ui/core";

export default function ProteinTutorial(props) {
  const horHeadSimpleOne = {
    h5VerticalText: "SIMPLE SEARCH",
    h2textTopStrongBefore: "How To",
    h2textTop: "Use",
    h2textTopStrongAfter: "Simple",
    h2textTop2: "Protein Search",
  };

  return (
    <>
      <div style={{ paddingBottom: "20px" }}>
        <HorizontalHeading post={horHeadSimpleOne} />
      </div>
      <Grid container spacing={3} justify="center">
        <Grid item xs={12} sm={6}>
          <Iframe
            src="//www.slideshare.net/slideshow/embed_code/key/NFd39OszUyFZwi"
            width="100%"
            height="305"
            frameborder="0"
            marginwidth="0"
            marginheight="0"
            scrolling="no"
            style={{
              border: "1px solid #CCC",
              borderWidth: "1px",
              marginBottom: "5px",
              maxWidth: "100%",
            }}
            allowfullscreen
          >
            {" "}
          </Iframe>
          <div style={{ marginBottom: "5px" }}>
            {" "}
            <strong>
              {" "}
              <a
                href="//www.slideshare.net/GlyGen/how-to-use-simple-protein-search-tutorial-131972123"
                title="How To Use Simple Protein Search Tutorial"
                target="_blank"
                rel="noopener noreferrer"
              >
                How To Use Simple Protein Search Tutorial
              </a>{" "}
            </strong>{" "}
            from{" "}
            <strong>
              <a href="https://www.slideshare.net/GlyGen" target="_blank" rel="noopener noreferrer">
                GlyGen
              </a>
            </strong>{" "}
          </div>
        </Grid>
        <Grid item xs={12} sm={6} className="tutorial-text-middle">
          <Typography>
            You can search for proteins by specifying their UniProtKB Accession numbers, their
            specific structures or the specific biochemical contexts within which they are found.
          </Typography>
          <div style={{ marginBottom: "20px" }}></div>
          <Typography>
            This tutorial was created using a portal version: 1.0.1 (09/19/2018).
          </Typography>
        </Grid>
      </Grid>
    </>
  );
}
