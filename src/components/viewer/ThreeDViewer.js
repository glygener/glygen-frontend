import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { DefaultPluginUISpec } from "molstar/lib/mol-plugin-ui/spec";
import { createPluginUI } from "molstar/lib/mol-plugin-ui/index";
import { PluginConfig } from 'molstar/lib/mol-plugin/config';
import "molstar/build/viewer/molstar.css";
import { ColorNames } from 'molstar/lib/mol-util/color/names';
import { PluginCommands } from 'molstar/lib/mol-plugin/commands';

const ThreeDViewer = props => {

  const { url } = props;
  const parentRef = useRef(null);
  const plugin = useRef(null);
  
  useEffect(() => {
    (async () => {
        const spec = DefaultPluginUISpec();
        spec.layout = {
          initial: {
            isExpanded: false,
            controlsDisplay: "reactive",
            showControls: false
          }
        };
        spec.config = [
       [PluginConfig.Structure.SaccharideCompIdMapType, "glycam"],
      ];
        plugin.current = await createPluginUI(parentRef.current, spec);
        await loadPDBFromUrl(url, plugin.current);
    })();
    return () => plugin.current = null;
  }, [])

  const loadPDBFromUrl = async (url, plugin) => {
    if (plugin) {
      plugin.clear();

      if (!url) return;
      const data = await plugin.builders.data.download(
        { url: url }, {state: {isGhost: true}}
      );
      if (!data) return;
      const traj = await plugin.builders.structure.parseTrajectory(data, "pdb");
      await plugin.builders.structure.hierarchy.applyPreset(traj, "default");

      const renderer = plugin.canvas3d?.props.renderer;
      PluginCommands.Canvas3D.SetSettings(plugin, { settings: { renderer: { ...renderer, backgroundColor: ColorNames.white } } });
    }
  }

  return (
      <div style={{position: "relative", width: "100%", height: "100%", overflow: "hidden"}}>
        <div ref={parentRef} style={{position: "absolute", left: 0, top: 0, right: 0, bottom: 0}} />
      </div>
  )
};

ThreeDViewer.propTypes = {
  url: PropTypes.string,
};

export default ThreeDViewer;