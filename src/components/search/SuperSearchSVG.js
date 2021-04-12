import React, { useEffect } from 'react';
import '../../css/Search.css';
import global_var from '../../data/json/superSearchSVGData';
import {event, select, selectAll, forceSimulation, forceManyBody, forceLink } from 'd3';
import searchIcon from "../../images/icons/search.svg";
import noSearchIcon from "../../images/icons/nosearch.svg";
import PropTypes from "prop-types";

/**
 * Super search svg component for displaying svg image.
 */
const SuperSearchSVG = (props) => {

  var svgNodes = global_var.nodes; //stores the data of nodes
  var svgLinks = global_var.links; //stores the data of the links
  
  //initializing the values so that it can be changed in future of needed
  var nodeWidth = 140;  //width of node
  var nodeHeight = 40; //height of node
  var node2Width = 90;
  var node2Height = (nodeHeight/2);

  /**
	* useEffect for loadiing svg data and displaying it.
  */
  useEffect(() => {
    loadSVG(props.svgData);
  }, [])

  /**
	* useEffect for updating svg number data and displaying it.
  */
  useEffect(() => {
    loadSVG(props.svgData);
  }, [props.svgData, props.showData])

 /**
  * Function for updating svg number data and displaying it.
  * @param {array} nodeData - node data.
  */
  function updateNumnodesSVG(nodeData) {
    select("#mapSVG").selectAll(".svg-numnode").remove();
    var nodes = svgNodes.map((node)=> { var nodeTemp =  nodeData.find((n) => node.id === n.id);  
                                        node.name = nodeTemp.label; 
                                        node.count = Number(nodeTemp.record_count).toLocaleString('en-US'); 
                                        node.list_id = nodeTemp.list_id;
                                        return node;});
    var svg = select("#mapSVG")

    var numnodes = svg.selectAll(".svg-numnode")
        .data(nodes)
        .enter()
        .append("g")
        .attr("class", "svg-numnode")
        .attr("id", ((d) => "svg-numnode-" + d.id))
        .on("mouseover", mouseover)
        .on("mouseout",mouseout)
        .attr("transform", function(d) {
            return "translate(" + ((d.xCord)+1.0*node2Width) +"," + ((d.yCord)-0.5*node2Height) + ")";
        })
        //go to the list page
        .on("click", function(d) {
          if (d.list_id !== "") {
            var data = select(this).select("rect").data();
            props.goToListPage(data[0].list_id, data[0].id);
          }
      });

        numnodes
        .append("rect")
        .attr("class", ((d) => d.list_id !== "" ? "svg-numnode" : "svg-numnode-nl"))
        .attr("width", node2Width)
        .attr("height", node2Height)
        .attr("rx", 5)
        .attr("ry", 5)

        //appending text on numeric nodes
        numnodes.append("text")
        .data(nodes)
          .text(function(d) {
            return d.count;
          })
          .attr("class", ((d) => d.list_id  !== "" ? "svg-numnode-text" : "svg-numnode-text-nl"))
          .attr("x", node2Width/2)
          .attr("y", node2Height/2)
          .attr("dy", "0.35em")

          //appending text on numeric nodes
          numnodes.append("image")
          .data(nodes)
          .attr("xlink:href", ((d) => d.list_id  !== "" ? searchIcon : noSearchIcon))
            .attr("class", ((d) => d.list_id  !== "" ? "svg-numnode-text" : "svg-numnode-text-nl"))
            .attr("x", node2Width - 18)
            .attr("y", node2Height/6)
            .attr("height", "15px")
            .attr("width", "15px")
            .attr("dy", "0.35em")

      /**
      * Function for showing tooltip on mouseover.
      * @param {object} d - node data.
      */
      function mouseover(d) {
        if (d.list_id !== "") {
            let element = document.getElementById("svg-numnode-" + d.id);
            var bcr = element.getBoundingClientRect();
            let tooltip = document.getElementById("tooltip"); 
            let tooltipText = document.getElementById("tooltip-text");
            tooltipText.innerHTML = "Click to see list page.";
            tooltip.style.left = bcr.x + 0.8 * bcr.width + event.clientX - event.pageX - 10 + 'px';
            tooltip.style.top = bcr.y + 1.25 * bcr.height + event.pageY - event.clientY + 'px';
            tooltip.style.display = "inline";
        }
      }

      /**
      * Function for hiding tooltip on mouseout.
      * @param {object} d - node data.
      */
      function mouseout(d) {
        if (d.list_id !== "") {
            var tooltip = document.getElementById("tooltip");
            tooltip.style.display = "none";
        }
      }
  }

  /**
  * Function for loading svg data and displaying it.
  * @param {array} nodeData - node data.
  */
  function loadSVG(nodeData){
    // Empty svg
    select("#mapSVG").selectAll("*").remove();
    var nodes = svgNodes.map((node)=> {
      node.name =  nodeData.find((n) => node.id === n.id).label; 
      return node});
      var edges = svgLinks.map((e) => { 
        // Get the source and target nodes
        var linkName = e.linkName;
        var sourceNode = nodes.filter(function(n) { return n.id === e.source; })[0],
            targetNode = nodes.filter(function(n) { return n.id === e.target; })[0];

        var svgSource =  nodeData.find((n) => sourceNode.id === n.id);
        var svgTarget =  nodeData.find((n) => targetNode.id === n.id);

        return {sourceOffset: e.sourceOffset, targetOffset: e.targetOffset, dasharray: e.dasharray, rotate: e.rotate, 
                xCord: e.xCord, yCord: e.yCord, linkid: sourceNode.id + "_" + targetNode.id, source: sourceNode, target: targetNode, linkName: linkName,
                sourceNumber: svgSource[sourceNode.id + "_" + targetNode.id + "_record_count"] !== undefined ? Number(svgSource[sourceNode.id + "_" + targetNode.id + "_record_count"]).toLocaleString('en-US') : "", 
                sourceListID: svgSource[sourceNode.id + "_" + targetNode.id + "_list_id"] !== undefined ? svgSource[sourceNode.id + "_" + targetNode.id + "_list_id"] : "",
                sourcexCord: e.source_xCord, sourceyCord: e.source_yCord, 
                targetNumber: svgTarget[targetNode.id + "_" + sourceNode.id + "_record_count"] !== undefined ? Number(svgTarget[targetNode.id + "_" + sourceNode.id + "_record_count"]).toLocaleString('en-US') : "", 
                targetListID: svgTarget[targetNode.id + "_" + sourceNode.id + "_list_id"] !== undefined ? svgTarget[targetNode.id + "_" + sourceNode.id + "_list_id"] : "",
                targetxCord: e.target_xCord, targetyCord: e.target_yCord
              };
    });

    //setting basic d3 properties
    var force = forceSimulation()
                .force("charge", forceManyBody().strength(-5))
                .force("link", forceLink().id(function(d) { return d.id; }).distance(200))
                .nodes(nodes);
    //appending on the div and rendering the graph on it
    var svg = select("#mapSVG")
       
    //Links
    //this builds the links
    var link = svg.selectAll(".svg-link")
                .data(edges)
                .enter()
                .append("g")
                .attr("class", "svg-link")
                .append("polyline")
                .style("stroke-dasharray", function(d) {
                    return d.dasharray;
                })
                .attr("points", function(d) { 
                  return (d.source.xCord+(nodeWidth / 2) + d.sourceOffset) + "," + (d.source.yCord+(nodeHeight / 2) + d.sourceOffset) + " " +
                  (d.target.xCord+(nodeWidth / 2) + d.targetOffset) + "," + (d.target.yCord+(nodeHeight / 2) + d.targetOffset); })

    //appending Name of the Links on them
    var linkText = svg.selectAll(".svg-link")
                    .data(edges)
                    .append("text")
                    .attr("class", "svg-link-text")
                    .attr("dy", "1.8em")
                    .text(function(d) {
                        return d.linkName;
                    })
                    .attr("transform", function(d) {
                        var trans = "translate(" + d.xCord + "," + d.yCord + ")" + " rotate(" +  d.rotate + ")";
                        return trans;
                    })

                    var linkText1 = svg.selectAll(".svg-link")
                    .data(edges)           
                    .append("text")
                    .attr("class", !props.showData ? "svg-link-text-number-disabled" : ((d) => d.sourceListID  !== "" ? "svg-link-text-number" : "svg-link-text-number-nl"))
                    .attr("id", ((d) => "svg-link-source" + d.linkid))
                    .on("mouseover", mouseoverSource)
                    .on("mouseout",mouseoutSource)
                    .attr("dy", "1.8em")
                    .text(function(d) {
                        return d.sourceNumber;
                    })
                    .attr("transform", function(d) {
                        var trans = "translate(" + d.sourcexCord + "," + d.sourceyCord + ")" + " rotate(" +  d.rotate + ")";
                        return trans;
                    })
                    //go to the list page
                    .on("click", function(d) {
                      if (d.sourceListID !== "") {
                        props.goToListPage(d.sourceListID, d.source.id);
                      }
                  });
                          /**
      * Function for showing tooltip on mouseover.
      * @param {object} d - node data.
      */
      function mouseoverSource(d) {
          let element = document.getElementById("svg-link-source" + d.linkid);
          var bcr = element.getBoundingClientRect();
          let tooltip = document.getElementById("tooltip"); 
          let tooltipText = document.getElementById("tooltip-text");
          tooltipText.innerHTML = d.target.name  + " to " + d.source.name + " edge numbers." + (d.sourceListID !== "" ? "<br/>Click to see list page." : "");
          tooltip.style.left = bcr.x + 0.8 * bcr.width + event.clientX - event.pageX - 10 + 'px';
          tooltip.style.top = bcr.y + 1.25 * bcr.height + event.pageY - event.clientY + 'px';
          tooltip.style.display = "inline";
      }

      /**
      * Function for hiding tooltip on mouseout.
      * @param {object} d - node data.
      */
      function mouseoutSource(d) {
          var tooltip = document.getElementById("tooltip");
          tooltip.style.display = "none";
      }

      var linkText2 = svg.selectAll(".svg-link")
      .data(edges)           
      .append("text")
      .attr("class", !props.showData ? "svg-link-text-number-disabled" : ((d) => d.targetListID  !== "" ? "svg-link-text-number" : "svg-link-text-number-nl"))
      .attr("id", ((d) => "svg-link-target" + d.linkid))
      .on("mouseover", mouseoverTarget)
      .on("mouseout",mouseoutTarget)
      .attr("dy", "1.8em")
      .text(function(d) {
          return d.targetNumber;
      })
      .attr("transform", function(d) {
          var trans = "translate(" + d.targetxCord + "," + d.targetyCord + ")" + " rotate(" +  d.rotate + ")";
          return trans;
      })
      //go to the list page
      .on("click", function(d) {
        if (d.targetListID !== "") {
          props.goToListPage(d.targetListID, d.target.id);
        }
      });

      /* Function for showing tooltip on mouseover.
      * @param {object} d - node data.
      */
      function mouseoverTarget(d) {
          let element = document.getElementById("svg-link-target" + d.linkid);
          var bcr = element.getBoundingClientRect();
          let tooltip = document.getElementById("tooltip"); 
          let tooltipText = document.getElementById("tooltip-text");
          tooltipText.innerHTML = d.source.name  + " to " + d.target.name + " edge numbers." + (d.targetListID !== "" ? "<br/>Click to see list page." : "");
          tooltip.style.left = bcr.x + 0.8 * bcr.width + event.clientX - event.pageX - 10 + 'px';
          tooltip.style.top = bcr.y + 1.25 * bcr.height + event.pageY - event.clientY + 'px';
          tooltip.style.display = "inline";
      }

      /**
      * Function for hiding tooltip on mouseout.
      * @param {object} d - node data.
      */
      function mouseoutTarget(d) {
          var tooltip = document.getElementById("tooltip");
          tooltip.style.display = "none";
      }

    //appending the regular nodes
    var node = svg.selectAll(".svg-node")
                .data(nodes)
                .enter()
                .append("g")
                .attr("class", "svg-node")
                .attr("id", ((d) => "svg-node-" + d.id))
                .attr("transform", function(d) {
                    return "translate(" + d.xCord + "," + d.yCord + ")";
                })
    
    //sets the id of the selected node.
    .on("click", function(d) {
        props.nodeClickSuperSearchQuery(d.id);
    });
    
    //appending the node
    node.append("rect")
        .attr("class", "svg-node")
        .on("mouseover", mouseover)
        .on("mouseout",mouseout)
        .attr("width", nodeWidth)
        .attr("height", nodeHeight)
        .attr("rx", 5)
        .attr("ry", 5)

      //appending text on the main nodes
      node.append("text")
          .text(function(d) {
              return d.name;
          })
          .attr("class", "svg-node-text")
          .on("mouseover", mouseover)
          .on("mouseout",mouseout)
          .attr("x", (nodeWidth/2))
          .attr("y",(nodeHeight/2))
          .attr("dy", ".35em")

        updateNumnodesSVG(nodeData);

      /**
      * Function for showing tooltip on mouseover.
      * @param {object} d - node data.
      */
      function mouseover(d) {
        let element = document.getElementById("svg-node-" + d.id);
        var bcr = element.getBoundingClientRect();
        let tooltip = document.getElementById("tooltip"); 
        let tooltipText = document.getElementById("tooltip-text");
        tooltipText.innerHTML = "Click to see search properties.";
        tooltip.style.left =  bcr.x + 0.85 * bcr.width + event.clientX - event.pageX - 10 + 'px';
        tooltip.style.top = bcr.y + 1.1 * bcr.height + event.pageY - event.clientY + 'px';
        tooltip.style.display = "inline";
      }

      /**
      * Function for hiding tooltip on mouseout.
      * @param {object} d - node data.
      */
      function mouseout(d) {
          var tooltip = document.getElementById("tooltip");
          tooltip.style.display = "none";
      }

    }

    return (
		<>    
          <div>
            <div id="tooltip" className="svg-tooltip" style={{position: "absolute", display: "none"}}>
              <div id="svg-arrow" className="svg-arrow-up"/>
              <div id="tooltip-text" className="svg-tooltip-text"/>
            </div>
            <svg id="mapSVG" height={"100%"} width={"100%"} viewBox={"0 0 1050 550"} ></svg>
          </div>
    </>
	);
};

export default SuperSearchSVG;

SuperSearchSVG.propTypes = {
  svgData: PropTypes.array,
  showData: PropTypes.bool,
  nodeClickSuperSearchQuery: PropTypes.func,
  goToListPage: PropTypes.func,
};