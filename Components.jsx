import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
import React, { useRef, useMemo, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Instance, Instances, Sky, Environment } from "@react-three/drei";
import * as THREE from "three";
import { GrassMaterial } from "./GrassMaterial.js";
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
  useFrame((state) => {
    if (!meshRef.current) return;
    const t = time !== void 0 && time !== null ? time : state.clock.elapsedTime;
    meshRef.current.material.uniforms.uTime.value = t;
    const vecArr = meshRef.current.material.uniforms.uInteractors.value;
    for (let i = 0; i < 5; i++) vecArr[i].set(1e3, 1e3, 1e3);
    if (interactors) {
      interactors.forEach((pos, i) => {
        if (i < 5 && pos) vecArr[i].set(pos.x, pos.y, pos.z);
      });
    }
  });
  return /* @__PURE__ */ jsxDEV("instancedMesh", { ref: meshRef, args: [null, null, count], children: [
    /* @__PURE__ */ jsxDEV("planeGeometry", { args: [0.15, 1.2, 2, 5] }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 51,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV("primitive", { object: GrassMaterial, attach: "material" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 52,
      columnNumber: 7
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 50,
    columnNumber: 5
  });
};
const PlayerRig = ({ isReplay, frameData, onUpdate, movementInput }) => {
  const { camera, scene, pointer } = useThree();
  const posRef = useRef(new THREE.Vector3(0, 1.7, 5));
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), []);
  const intersectPoint = useMemo(() => new THREE.Vector3(), []);
  useEffect(() => {
    if (!isReplay) {
      posRef.current.copy(camera.position);
    }
  }, []);
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
      if (e.key === "w" || e.key === "W") posRef.current.add(forward.multiplyScalar(speed));
      if (e.key === "s" || e.key === "S") posRef.current.sub(forward.multiplyScalar(speed));
      if (e.key === "a" || e.key === "A") posRef.current.sub(right.multiplyScalar(speed));
      if (e.key === "d" || e.key === "D") posRef.current.add(right.multiplyScalar(speed));
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
      if (movementInput && movementInput.current) {
        const { x, y } = movementInput.current;
        if (x !== 0 || y !== 0) {
          const speed = 0.1;
          const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
          forward.y = 0;
          forward.normalize();
          const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
          right.y = 0;
          right.normalize();
          posRef.current.add(forward.multiplyScalar(y * speed));
          posRef.current.add(right.multiplyScalar(x * speed));
        }
      }
      camera.position.lerp(posRef.current, 0.1);
      raycaster.setFromCamera(pointer, camera);
      let interactorPos = null;
      if (raycaster.ray.intersectPlane(plane, intersectPoint)) {
        interactorPos = intersectPoint.clone();
      }
      if (onUpdate) {
        onUpdate({
          position: camera.position.clone(),
          quaternion: camera.quaternion.clone(),
          interactor: interactorPos
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
      lineNumber: 146,
      columnNumber: 13
    }),
    /* @__PURE__ */ jsxDEV("ambientLight", { intensity: 0.5 }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 147,
      columnNumber: 13
    }),
    /* @__PURE__ */ jsxDEV("directionalLight", { position: sunPosition, intensity: 1.5, castShadow: true }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 148,
      columnNumber: 13
    }),
    /* @__PURE__ */ jsxDEV("mesh", { rotation: [-Math.PI / 2, 0, 0], receiveShadow: true, children: [
      /* @__PURE__ */ jsxDEV("planeGeometry", { args: [100, 100] }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 150,
        columnNumber: 17
      }),
      /* @__PURE__ */ jsxDEV("meshStandardMaterial", { color: "#1a2a1a" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 151,
        columnNumber: 17
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 149,
      columnNumber: 13
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 145,
    columnNumber: 9
  });
};
export {
  OptimizedGrassField,
  PlayerRig,
  WorldEnv
};
