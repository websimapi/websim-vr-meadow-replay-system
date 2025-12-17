import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
import React, { useState, useEffect, useRef, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { PointerLockControls, Loader } from "@react-three/drei";
import { Player } from "@remotion/player";
import nipplejs from "nipplejs";
import * as THREE from "three";
import { MeadowComposition } from "./RemotionComposition.jsx";
import { OptimizedGrassField, WorldEnv, PlayerRig } from "./Components.jsx";
import { recorder } from "./state.js";
import { windAudio } from "./sound_gen.js";
const LiveScene = ({ movementInputRef, onInteractorUpdate }) => {
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV(WorldEnv, { sunPosition: [100, 20, 100] }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 16,
      columnNumber: 13
    }),
    /* @__PURE__ */ jsxDEV(OptimizedGrassField, { interactors: [] }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 17,
      columnNumber: 13
    }),
    /* @__PURE__ */ jsxDEV(
      PlayerRig,
      {
        isReplay: false,
        movementInput: movementInputRef,
        onUpdate: (data) => {
          const frameData = {
            time: performance.now() / 1e3,
            camera: {
              px: data.position.x,
              py: data.position.y,
              pz: data.position.z,
              qx: data.quaternion.x,
              qy: data.quaternion.y,
              qz: data.quaternion.z,
              qw: data.quaternion.w
            },
            hands: data.interactor ? [data.interactor] : []
          };
          recorder.push(frameData);
          if (onInteractorUpdate) onInteractorUpdate(frameData.hands);
        }
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 20,
        columnNumber: 13
      }
    ),
    /* @__PURE__ */ jsxDEV(PointerLockControls, {}, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 51,
      columnNumber: 13
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 15,
    columnNumber: 9
  });
};
const Joystick = ({ onMove }) => {
  const ref = useRef();
  useEffect(() => {
    if (!ref.current) return;
    const manager = nipplejs.create({
      zone: ref.current,
      mode: "static",
      position: { left: "50%", bottom: "15%" },
      color: "white",
      size: 100
    });
    manager.on("move", (evt, data) => {
      if (onMove) {
        const forward = data.vector.y;
        const right = data.vector.x;
        onMove({ x: right, y: forward });
      }
    });
    manager.on("end", () => {
      if (onMove) onMove({ x: 0, y: 0 });
    });
    return () => manager.destroy();
  }, []);
  return /* @__PURE__ */ jsxDEV("div", { ref, style: { position: "absolute", bottom: 0, left: 0, width: "100%", height: "200px", pointerEvents: "auto", zIndex: 20 } }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 90,
    columnNumber: 12
  });
};
function App() {
  const [started, setStarted] = useState(false);
  const [mode, setMode] = useState("live");
  const [recordedData, setRecordedData] = useState([]);
  const movementInput = useRef({ x: 0, y: 0 });
  const handleStart = () => {
    setStarted(true);
    windAudio.start();
  };
  const toggleReplay = () => {
    if (mode === "live") {
      const data = recorder.getRecording();
      if (data.length > 0) {
        const startTime = data[0].time;
        const normalized = data.map((d) => ({ ...d, time: d.time - startTime }));
        setRecordedData(normalized);
        setMode("replay");
      } else {
        alert("No footage recorded yet! Move around first.");
      }
    } else {
      setMode("live");
    }
  };
  return /* @__PURE__ */ jsxDEV("div", { style: { width: "100vw", height: "100vh", background: "black" }, children: [
    !started && /* @__PURE__ */ jsxDEV("div", { style: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "rgba(0,0,0,0.8)",
      zIndex: 100,
      color: "white",
      flexDirection: "column"
    }, children: [
      /* @__PURE__ */ jsxDEV("h1", { children: "VR Meadow Replay" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 129,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          onClick: handleStart,
          style: { padding: "15px 30px", fontSize: "20px", cursor: "pointer", marginTop: "20px" },
          children: "Enter Meadow"
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 130,
          columnNumber: 21
        },
        this
      )
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 124,
      columnNumber: 17
    }, this),
    started && /* @__PURE__ */ jsxDEV(Fragment, { children: [
      /* @__PURE__ */ jsxDEV("div", { style: { position: "absolute", top: 20, right: 20, zIndex: 50 }, children: /* @__PURE__ */ jsxDEV(
        "button",
        {
          onClick: toggleReplay,
          style: { padding: "10px 20px", fontSize: "16px", cursor: "pointer", background: "white", border: "none", borderRadius: "5px" },
          children: mode === "live" ? "Watch Replay" : "Back to Live"
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 143,
          columnNumber: 25
        },
        this
      ) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 142,
        columnNumber: 21
      }, this),
      mode === "live" ? /* @__PURE__ */ jsxDEV(Fragment, { children: [
        /* @__PURE__ */ jsxDEV(Canvas, { shadows: true, camera: { position: [0, 1.7, 5], fov: 75 }, children: /* @__PURE__ */ jsxDEV(Suspense, { fallback: null, children: /* @__PURE__ */ jsxDEV(LiveScene, { movementInputRef: movementInput }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 155,
          columnNumber: 37
        }, this) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 154,
          columnNumber: 33
        }, this) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 153,
          columnNumber: 29
        }, this),
        /* @__PURE__ */ jsxDEV(Joystick, { onMove: (val) => movementInput.current = val }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 158,
          columnNumber: 29
        }, this),
        /* @__PURE__ */ jsxDEV("div", { style: { position: "absolute", bottom: 20, left: 20, color: "white", opacity: 0.7, pointerEvents: "none" }, children: /* @__PURE__ */ jsxDEV("p", { children: "WASD / Joystick to Move \u2022 Mouse to Interact" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 161,
          columnNumber: 33
        }, this) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 160,
          columnNumber: 29
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 152,
        columnNumber: 25
      }, this) : /* @__PURE__ */ jsxDEV("div", { style: { width: "100%", height: "100%" }, children: /* @__PURE__ */ jsxDEV(
        Player,
        {
          component: MeadowComposition,
          durationInFrames: recordedData.length,
          fps: 60,
          compositionWidth: 1920,
          compositionHeight: 1080,
          controls: true,
          inputProps: { recordedState: recordedData },
          style: { width: "100%", height: "100%" }
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 166,
          columnNumber: 29
        },
        this
      ) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 165,
        columnNumber: 25
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 140,
      columnNumber: 17
    }, this),
    /* @__PURE__ */ jsxDEV(Loader, {}, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 181,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 122,
    columnNumber: 9
  }, this);
}
export {
  App as default
};
