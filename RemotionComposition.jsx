import { jsxDEV } from "react/jsx-dev-runtime";
import React, { useMemo } from "react";
import { useCurrentFrame, AbsoluteFill, useVideoConfig } from "remotion";
import { Canvas } from "@react-three/fiber";
import { OptimizedGrassField, WorldEnv, PlayerRig } from "./Components.jsx";
import * as THREE from "three";
const MeadowComposition = ({ recordedState }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stateIndex = Math.min(Math.max(0, frame), recordedState.length - 1);
  const currentFrameData = recordedState[stateIndex] || recordedState[0];
  const time = currentFrameData?.time || 0;
  const interactors = useMemo(() => {
    if (!currentFrameData?.hands) return [];
    return currentFrameData.hands;
  }, [currentFrameData]);
  const sunPos = new THREE.Vector3(100, 20, 100);
  return /* @__PURE__ */ jsxDEV(AbsoluteFill, { children: [
    /* @__PURE__ */ jsxDEV(
      Canvas,
      {
        shadows: true,
        camera: { fov: 75 },
        gl: { toneMapping: THREE.ACESFilmicToneMapping },
        children: [
          /* @__PURE__ */ jsxDEV(WorldEnv, { sunPosition: [sunPos.x, sunPos.y, sunPos.z] }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 35,
            columnNumber: 9
          }),
          /* @__PURE__ */ jsxDEV(OptimizedGrassField, { time, interactors }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 36,
            columnNumber: 9
          }),
          /* @__PURE__ */ jsxDEV(
            PlayerRig,
            {
              isReplay: true,
              frameData: currentFrameData
            },
            void 0,
            false,
            {
              fileName: "<stdin>",
              lineNumber: 39,
              columnNumber: 9
            }
          )
        ]
      },
      void 0,
      true,
      {
        fileName: "<stdin>",
        lineNumber: 30,
        columnNumber: 7
      }
    ),
    /* @__PURE__ */ jsxDEV("div", { style: {
      position: "absolute",
      bottom: 40,
      left: 40,
      color: "white",
      fontFamily: "sans-serif",
      fontSize: "24px",
      textShadow: "0 2px 4px rgba(0,0,0,0.5)"
    }, children: [
      "Frame: ",
      frame,
      " / ",
      recordedState.length
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 46,
      columnNumber: 7
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 29,
    columnNumber: 5
  });
};
export {
  MeadowComposition
};
