import React, { useEffect } from "react";
import { styled } from '@mui/material/styles';
import Helmet from "react-helmet";
import { getTitle, getMeta } from "../utils/head";
import CssBaseline from "@mui/material/CssBaseline";
import VerticalHeading from "../components/headings/VerticalHeading";
import BootstrapTable from "react-bootstrap-table-next";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import resourcesData from "../data/json/resourcesData";
import { Link } from "react-router-dom";
import "../css/Responsive.css";
import Sidebar from "../components/navigation/Sidebar";
import { Row, Col } from "react-bootstrap";
import { logActivity } from "../data/logging";
import routeConstants from "../data/json/routeConstants.json";

const PREFIX = 'Resources';

const classes = {
  tableHeader: `${PREFIX}-tableHeader`
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')((
  {
    theme
  }
) => ({
  [`& .${classes.tableHeader}`]: {
    backgroundColor: "#4B85B6",
    color: "white",
  }
}));

const verticalHeadingData = {
  h5VerticalText: "LOOK AT",
  h2textTopStrongAfter: "Data",
  h2textBottom: "Resources",
  pText:
    "A list of publicly available databases, repositories and knowledgebases providing glycan-related information.",
};
const verticalHeadingTools = {
  h5VerticalText: "collection",
  h2textTopStrongBefore: "Tools",
  h2textBottom: "Resources",
  pText: "A list of tools, tool collections or link pages to glycomics related tools.",
};
const verticallHeadingOrganiz = {
  h5VerticalText: "CONNECT",
  h2textTop: "Resources",
  h2textBottom: "of",
  h2textBottomStrongAfter: "Organizations",
  pText: "List of glycomics related organizations.",
};
const verticalHeadingLearn = {
  h5VerticalText: "EDUCATION",
  h2textTopStrongBefore: "Learn",
  h2textBottom: "Glycobiology",
  pText: "There is still a great deal to learn about essentials of Glycobiology.",
};

const Resources = () => {
  const items = [
    { label: "Data", id: "Data" },
    { label: "Tools", id: "Tools" },
    { label: "Organizations", id: "Organizations" },
    { label: "Learn", id: "Learn" },
  ];

  const dataResourcesCols = [
    {
      dataField: "category",
      text: "Category",
      defaultSortField: "category",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "15%" };
      },
    },
    {
      dataField: "website",
      text: "Website",
      // sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "13%" };
      },
      formatter: (cell) => (
        <a href={cell.url} target="_blank" rel="noopener noreferrer">
          {cell.name}
        </a>
      ),
    },
    {
      dataField: "description",
      text: "Description",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "30%" };
      },
    },
    {
      dataField: "contains_publ",
      text: "Contains Publications",
      sort: true,
    },
    {
      dataField: "experimental_data",
      text: "Experimental Data",
      sort: true,
    },
    {
      dataField: "curated",
      text: "Curated",
      sort: true,
    },
  ];
  const toolsResourcesCols = [
    {
      dataField: "category",
      text: "Category",
      sort: true,
    },
    {
      dataField: "website",
      text: "Website",
      // sort: true,
      formatter: (cell) => (
        <a href={cell.url} target="_blank" rel="noopener noreferrer">
          {cell.name}
        </a>
      ),
    },
    {
      dataField: "description",
      text: "Description",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "40%" };
      },
    },
    {
      dataField: "experimental_data",
      text: "Experimental Data",
      sort: true,
    },
    {
      dataField: "availability",
      text: "Availability",
      sort: true,
    },
  ];
  const organizResourcesCols = [
    {
      dataField: "category",
      text: "Category",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "20%" };
      },
    },
    {
      dataField: "website",
      text: "Website",
      // sort: true,
      formatter: (cell) => (
        <a href={cell.url} target="_blank" rel="noopener noreferrer">
          {cell.name}
        </a>
      ),
    },
    {
      dataField: "description",
      text: "Description",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "50%" };
      },
    },
    {
      dataField: "domain",
      text: "Domain",
      sort: true,
    },
  ];
  const learnResourcesCols = [
    {
      dataField: "name",
      text: "Name",
      sort: true,
    },
    {
      dataField: "type",
      text: "Type",
      // sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "10%" };
      },
      formatter: (cell) => (
        <a href={cell.url} target="_blank" rel="noopener noreferrer">
          {cell.name}
        </a>
      ),
    },
    {
      dataField: "description",
      text: "Description",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "35%" };
      },
    },
    {
      dataField: "glycan",
      text: "Glycan",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "11%" };
      },
    },
    {
      dataField: "protein",
      text: "Protein",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "11%" };
      },
    },
    {
      dataField: "glycoprotein",
      text: "Glycoprotein",
      sort: true,
    },
  ];

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    logActivity();
  }, []);

  return (
    <Root>
      <Helmet>
        {/* <title>{head.resources.title}</title>
				{getMeta(head.resources)} */}
        {getTitle("resources")}
        {getMeta("resources")}
      </Helmet>
      <CssBaseline />
      <Row className="gg-baseline text-start">
        <Col sm={12} md={12} lg={12} xl={3} className="sidebar-col">
          <Sidebar items={items} />
        </Col>
        <Col sm={12} md={12} lg={12} xl={9} className="sidebar-page sidebar-page-mb-40">
          <div id="Data">
            <VerticalHeading post={verticalHeadingData} />
            <BootstrapTable
              bootstrap4
              striped
              hover
              wrapperClasses="table-responsive table-height-resources"
              headerClasses={classes.tableHeader}
              keyField="id"
              data={resourcesData.dataResourcesData}
              columns={dataResourcesCols}
              defaultSorted={[
                {
                  dataField: "category",
                  order: "asc",
                },
              ]}
            />
          </div>

          <div id="Tools">
            <VerticalHeading post={verticalHeadingTools} />
            <BootstrapTable
              bootstrap4
              striped
              hover
              wrapperClasses="table-responsive table-height-resources"
              headerClasses={classes.tableHeader}
              keyField="id"
              data={resourcesData.toolsResourcesData}
              columns={toolsResourcesCols}
              defaultSorted={[
                {
                  dataField: "category",
                  order: "asc",
                },
              ]}
            />
          </div>

          <div id="Organizations">
            <VerticalHeading post={verticallHeadingOrganiz} />
            <BootstrapTable
              bootstrap4
              striped
              hover
              wrapperClasses="table-responsive"
              headerClasses={classes.tableHeader}
              keyField="id"
              data={resourcesData.organizResourcesData}
              columns={organizResourcesCols}
              defaultSorted={[
                {
                  dataField: "category",
                  order: "asc",
                },
              ]}
            />
          </div>
          <p>
            *** If you want to see your tools and/or data resources on our website, please{" "}
            <Link to={routeConstants.contactUs}>contact us</Link>.***
          </p>

          <div id="Learn">
            <VerticalHeading post={verticalHeadingLearn} />
            <BootstrapTable
              bootstrap4
              striped
              hover
              wrapperClasses="table-responsive"
              headerClasses={classes.tableHeader}
              keyField="id"
              data={resourcesData.learnResourcesData}
              columns={learnResourcesCols}
              defaultSorted={[
                {
                  dataField: "name",
                  order: "asc",
                },
              ]}
            />
          </div>
          <p>
            *** If you want to see your tools and/or data resources on our website, please{" "}
            <Link to={routeConstants.contactUs}>contact us</Link>.***
          </p>
        </Col>
      </Row>
      {/* </Container> */}
    </Root>
  );
};

export default Resources;
