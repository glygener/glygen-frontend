import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { DefaultPluginSpec, PluginSpec } from "molstar/lib/mol-plugin/spec";
import { DefaultPluginUISpec } from "molstar/lib/mol-plugin-ui/spec";
import { createPluginUI } from "molstar/lib/mol-plugin-ui/index";
import { PluginContext } from "molstar/lib/mol-plugin/context";
import { PluginConfig } from 'molstar/lib/mol-plugin/config';
import "molstar/build/viewer/molstar.css";
import { ParamDefinition } from "molstar/lib/mol-util/param-definition";
import { CameraHelperParams } from "molstar/lib/mol-canvas3d/helper/camera-helper";
import { ColorNames } from 'molstar/lib/mol-util/color/names';
import { PluginCommands } from 'molstar/lib/mol-plugin/commands';

const Molstar = props => {

  const { useInterface, pdbId, url, file, dimensions, className, showControls, showAxes } = props;
  const parentRef = useRef(null);
  const canvasRef = useRef(null);
  const plugin = useRef(null);
  
  useEffect(() => {
    (async () => {
      if (useInterface) {
        const spec = DefaultPluginUISpec();
        spec.layout = {
          initial: {
            isExpanded: false,
            controlsDisplay: "reactive",
          }
        };
        spec.config = [
          [PluginConfig.Viewport.ShowExpand, false],
          [PluginConfig.Viewport.ShowControls, false],
          [PluginConfig.Viewport.ShowSelectionMode, false],
          [PluginConfig.Viewport.ShowAnimation, false],
          [PluginConfig.Viewport.ShowSettings, false],
          [PluginConfig.Viewport.ShowTrajectoryControls, true],
       [PluginConfig.Structure.SaccharideCompIdMapType, "glycam"]
      ];
    //   spec.canvas3d = {
    //     camera: {
    //         helper: { axes: { name: 'off', params: {} } }
    //     }
    // }
        spec.components = {
                controls: { left: 'none', right: 'none', top: 'none', bottom: 'none' },
            };
        plugin.current = await createPluginUI(parentRef.current, spec);
        await loadStructure(pdbId, url, file, plugin.current);
      } else {

        const spec = DefaultPluginSpec();
        spec.config = [[PluginConfig.VolumeStreaming.Enabled, false],
                        [PluginConfig.Viewport.ShowSettings, true],
                      // [PluginConfig.Structure.SaccharideCompIdMapType, true]
                    ]
        spec.layout = {
          initial: {
            isExpanded: false,
            controlsDisplay: "reactive",
            showControls,
          }
        };
        
        plugin.current = new PluginContext(spec);
        await plugin.current.init();

        if (!plugin.current.initViewer(canvasRef.current, parentRef.current)) {
          console.error('Failed to init Mol*');
          return;
        }

      }
      if (!showAxes) {
        plugin.current.canvas3d?.setProps({ camera: { helper: { axes: {
          name: "off", params: {}
        } } } });
      }
      // await loadStructure(pdbId, url, file, plugin.current);
    })();
    return () => plugin.current = null;
  }, [])


  useEffect(() => {
    loadStructure(pdbId, url, file, plugin.current);
  }, [pdbId, url, file])


  useEffect(() => {
    if (plugin.current) {
      if (!showAxes) {
        plugin.current.canvas3d?.setProps({ camera: { helper: { axes: {
          name: "off", params: {}
        } } } })
      } else {
        plugin.current.canvas3d?.setProps({ camera: { helper: {
          axes: ParamDefinition.getDefaultValues(CameraHelperParams).axes
        } } })
      }
    }
  }, [showAxes]) 


  const loadStructure = async (pdbId, url, file, plugin) => {
    if (plugin) {
      plugin.clear();
      if (file) {
        const data = await plugin.builders.data.rawData({
          data: file.filestring
        });
        const traj = await plugin.builders.structure.parseTrajectory(data, file.type);
        await plugin.builders.structure.hierarchy.applyPreset(traj, "default");
      } else {
        const structureUrl = url ? url : pdbId ? `https://files.rcsb.org/view/${pdbId}.cif` : null;
        if (!structureUrl) return;
        const data = await plugin.builders.data.download(
          { url: structureUrl }, {state: {isGhost: true}}
        );
        console.log(data);
        const extension = structureUrl.split(".").pop().replace("cif", "mmcif");
        const traj = await plugin.builders.structure.parseTrajectory(data, "pdb");
        await plugin.builders.structure.hierarchy.applyPreset(traj, "default");

        const renderer = plugin.canvas3d?.props.renderer;
        PluginCommands.Canvas3D.SetSettings(plugin, { settings: { renderer: { ...renderer, backgroundColor: ColorNames.white /* or: 0xff0000 as Color */ } } });

      }
    }
  }

  const width = dimensions ? dimensions[0] : "100%";
  const height = dimensions ? dimensions[1] : "100%";

  if (useInterface) {
    return (
      <div style={{position: "absolute", width, height, overflow: "hidden", color: "#474748 !important"}} className="viewer-center">
        <div className="viewer-center" ref={parentRef} st1yle={{ width: 640, height: 480, backgroundColor: "#474748 !important" }} style={{position: "absolute", left: 0, top: 0, right: 0, bottom: 0}} />
      </div>
    )
  }

  return (
    <div
      ref={parentRef}
      style={{position: "relative", width, height, backgroundColor: "#474748 !important"}}
      className={className || "viewer-center"}
    >
      <canvas
        ref={canvasRef}
        style={{ wi1dth: 640, h1ight: 480, backgroundColor: "#474748 !important" }}
        st1yle={{position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "#fff !important"}}
      />
    </div>
  );
};

Molstar.propTypes = {
  useInterface: PropTypes.bool,
  pdbId: PropTypes.string,
  url: PropTypes.string,
  file: PropTypes.object,
  dimensions: PropTypes.array,
  showControls: PropTypes.bool,
  showAxes: PropTypes.bool,
  className: PropTypes.string
};

export default Molstar;