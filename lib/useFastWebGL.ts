"use client";

import { useSyncExternalStore } from "react";

let cached: boolean | undefined;

// True only when WebGL runs on a GPU. Software rendering (no GPU, blocklisted drivers,
// CI machines) counts as a "major performance caveat", and the 3D would stutter there.
function detect() {
  if (cached === undefined) {
    const canvas = document.createElement("canvas");
    const options = { failIfMajorPerformanceCaveat: true };
    cached = Boolean(canvas.getContext("webgl2", options) ?? canvas.getContext("webgl", options));
  }
  return cached;
}

const subscribe = () => () => {};

export function useFastWebGL(): boolean {
  return useSyncExternalStore(subscribe, detect, () => false);
}
