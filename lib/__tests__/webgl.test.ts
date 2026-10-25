import { describe, expect, it } from "vitest";
import { isSoftwareRenderer } from "@/lib/webgl";

// The renderer names browsers report (WEBGL_debug_renderer_info)
describe("isSoftwareRenderer", () => {
  it("spots renderers that draw on the CPU", () => {
    for (const renderer of [
      "ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device (LLVM 10.0.0) (0x0000C0DE)), SwiftShader driver)",
      "Google SwiftShader",
      "llvmpipe (LLVM 15.0.7, 256 bits)",
      "softpipe",
      "ANGLE (Microsoft, Microsoft Basic Render Driver Direct3D11 vs_5_0 ps_5_0)",
    ]) {
      expect(isSoftwareRenderer(renderer), renderer).toBe(true);
    }
  });

  it("lets GPUs through", () => {
    for (const renderer of [
      "Apple GPU",
      "ANGLE (Apple, ANGLE Metal Renderer: Apple M2, Unspecified Version)",
      "Adreno (TM) 650",
      "Mali-G78 MC14",
      "ANGLE (NVIDIA, NVIDIA GeForce RTX 3060 Direct3D11 vs_5_0 ps_5_0, D3D11)",
      "ANGLE (Intel, Intel(R) UHD Graphics 620 Direct3D11 vs_5_0 ps_5_0, D3D11)",
    ]) {
      expect(isSoftwareRenderer(renderer), renderer).toBe(false);
    }
  });
});
