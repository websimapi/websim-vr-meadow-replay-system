import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
import React, { useRef, useMemo, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Instance, Instances, Sky, Environment } from "@react-three/drei";
import * as THREE from "three";
import { GrassMaterial } from "./GrassMaterial.js";
const GrassField = ({ time, interactors }) => {
  const meshRef = useRef();
  const instanceCount = 3e4;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < instanceCount; i++) {
      const x = (Math.random() - 0.5) * 60;
      const z = (Math.random() - 0.5) * 60;
      const scale = 0.5 + Math.random() * 0.5;
      const rotation = Math.random() * Math.PI;
      temp.push({ position: [x, 0, z], scale: [1, scale, 1], rotation: [0, rotation, 0] });
    }
    return temp;
  }, []);
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.material.uniforms.uTime.value = time;
      if (interactors && interactors.length > 0) {
        const vecs = interactors.map((i) => new THREE.Vector3(i.x, i.y, i.z));
        while (vecs.length < 5) vecs.push(new THREE.Vector3(1e3, 1e3, 1e3));
        meshRef.current.material.uniforms.uInteractors.value = vecs.slice(0, 5);
      }
    }
  });
  return /* @__PURE__ */ jsxDEV("instancedMesh", { ref: meshRef, args: [null, null, instanceCount], children: [
    /* @__PURE__ */ jsxDEV("planeGeometry", { args: [0.1, 1, 1, 4] }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 44,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV("primitive", { object: GrassMaterial, attach: "material" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 45,
      columnNumber: 7
    }),
    particles.map((data, i) => /* @__PURE__ */ jsxDEV(GroupInstance, { ...data }, i, false, {
      fileName: "<stdin>",
      lineNumber: 47,
      columnNumber: 9
    }))
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 43,
    columnNumber: 5
  });
};
const GroupInstance = ({ position, scale, rotation }) => {
  return /* @__PURE__ */ jsxDEV("group", { position, scale, rotation }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 55,
    columnNumber: 9
  });
};
const OptimizedGrassField = ({ time, interactors }) => {
  const meshRef = useRef();
  const count = 3e4;
  useEffect(() => {
    const mesh = meshRef.current;
    const dummy = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      dummy.position.set(
        (Math.random() - 0.5) * 50,
        0,
        (Math.random() - 0.5) * 50
      );
      dummy.scale.setScalar(0.5 + Math.random() * 0.5);
      dummy.scale.y = 0.8 + Math.random() * 0.8;
      dummy.rotation.y = Math.random() * Math.PI;
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, []);
  useFrame(() => {
    if (!meshRef.current) return;
    meshRef.current.material.uniforms.uTime.value = time;
    const vecArr = meshRef.current.material.uniforms.uInteractors.value;
    for (let i = 0; i < 5; i++) vecArr[i].set(1e3, 1e3, 1e3);
    if (interactors) {
      interactors.forEach((pos, i) => {
        if (i < 5) vecArr[i].set(pos.x, pos.y, pos.z);
      });
    }
  });
  return /* @__PURE__ */ jsxDEV("instancedMesh", { ref: meshRef, args: [null, null, count], children: [
    /* @__PURE__ */ jsxDEV("planeGeometry", { args: [0.15, 1.2, 2, 5] }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 103,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV("primitive", { object: GrassMaterial, attach: "material" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 104,
      columnNumber: 7
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 102,
    columnNumber: 5
  });
};
const PlayerRig = ({ isReplay, frameData, onUpdate }) => {
  const { camera, gl } = useThree();
  const joystickRef = useRef(null);
  const posRef = useRef(new THREE.Vector3(0, 1.7, 5));
  const targetRef = useRef(new THREE.Vector3(0, 1.7, 0));
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isReplay) return;
      const speed = 0.5;
      const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
      forward.y = 0;
      forward.normalize();
      const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
      right.y = 0;
      right.normalize();
      if (e.key === "w") posRef.current.add(forward.multiplyScalar(speed));
      if (e.key === "s") posRef.current.sub(forward.multiplyScalar(speed));
      if (e.key === "a") posRef.current.sub(right.multiplyScalar(speed));
      if (e.key === "d") posRef.current.add(right.multiplyScalar(speed));
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [camera, isReplay]);
  useFrame((state) => {
    if (isReplay && frameData) {
      if (frameData.camera) {
        camera.position.set(frameData.camera.px, frameData.camera.py, frameData.camera.pz);
        camera.quaternion.set(frameData.camera.qx, frameData.camera.qy, frameData.camera.qz, frameData.camera.qw);
      }
    } else {
      camera.position.lerp(posRef.current, 0.1);
      if (onUpdate) {
        onUpdate({
          position: camera.position.clone(),
          quaternion: camera.quaternion.clone(),
          // Simulated hand (cursor raycast)
          pointer: state.pointer
        });
      }
    }
  });
  return null;
};
const WorldEnv = ({ sunPosition }) => {
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV(Sky, { sunPosition, turbidity: 8, rayleigh: 6 }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 173,
      columnNumber: 13
    }),
    /* @__PURE__ */ jsxDEV("ambientLight", { intensity: 0.5 }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 174,
      columnNumber: 13
    }),
    /* @__PURE__ */ jsxDEV("directionalLight", { position: sunPosition, intensity: 1.5, castShadow: true }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 175,
      columnNumber: 13
    }),
    /* @__PURE__ */ jsxDEV("mesh", { rotation: [-Math.PI / 2, 0, 0], receiveShadow: true, children: [
      /* @__PURE__ */ jsxDEV("planeGeometry", { args: [100, 100] }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 177,
        columnNumber: 17
      }),
      /* @__PURE__ */ jsxDEV("meshStandardMaterial", { color: "#1a2a1a" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 178,
        columnNumber: 17
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 176,
      columnNumber: 13
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 172,
    columnNumber: 9
  });
};
export {
  GrassField,
  OptimizedGrassField,
  PlayerRig,
  WorldEnv
};
