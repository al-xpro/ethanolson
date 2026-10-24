// Whether the hero's 3D scene should run: only when WebGL draws on a GPU. In software it
// stutters and keeps the main thread busy for seconds.

// Renderers that draw on the CPU: Chrome's SwiftShader (servers and headless browsers without
// a GPU, where PageSpeed Insights runs), Mesa's llvmpipe and softpipe, Windows' Basic Render
const SOFTWARE = /swiftshader|llvmpipe|softpipe|software|basic render/i;

export function isSoftwareRenderer(renderer: string) {
  return SOFTWARE.test(renderer);
}

type Probe = { supported: boolean; renderer: string | null };

// Blocklisted drivers count as a "major performance caveat" and get no context; SwiftShader
// often gets one, so the renderer's name is read too
const PROBE = `
const options = { failIfMajorPerformanceCaveat: true };
const result = { supported: typeof WebGLRenderingContext !== "undefined", renderer: null };
if (result.supported) {
  const canvas = new OffscreenCanvas(1, 1);
  const gl = canvas.getContext("webgl2", options) || canvas.getContext("webgl", options);
  if (gl) {
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    result.renderer = String(gl.getParameter(info ? info.UNMASKED_RENDERER_WEBGL : gl.RENDERER));
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  }
}
postMessage(result);
`;

// In a worker: without a GPU, creating the context alone blocks its thread for over a second
function probeInWorker(): Promise<Probe | null> {
  if (typeof Worker === "undefined" || typeof OffscreenCanvas === "undefined") return Promise.resolve(null);
  return new Promise((resolve) => {
    const url = URL.createObjectURL(new Blob([PROBE], { type: "text/javascript" }));
    let worker: Worker;
    try {
      worker = new Worker(url);
    } catch {
      URL.revokeObjectURL(url);
      return resolve(null);
    }
    const done = (probe: Probe | null) => {
      clearTimeout(timer);
      worker.terminate();
      URL.revokeObjectURL(url);
      resolve(probe);
    };
    // A context that takes this long isn't on a GPU
    const timer = setTimeout(() => done({ supported: true, renderer: null }), 5000);
    worker.onmessage = (event: MessageEvent<Probe>) => done(event.data);
    worker.onerror = () => done(null);
  });
}

// On the page, for browsers without WebGL in workers (Safari before 17)
function probeHere(): Probe {
  const canvas = document.createElement("canvas");
  const options: WebGLContextAttributes = { failIfMajorPerformanceCaveat: true };
  const gl = canvas.getContext("webgl2", options) ?? canvas.getContext("webgl", options);
  if (!gl) return { supported: true, renderer: null };
  const info = gl.getExtension("WEBGL_debug_renderer_info");
  const renderer = String(gl.getParameter(info ? info.UNMASKED_RENDERER_WEBGL : gl.RENDERER));
  gl.getExtension("WEBGL_lose_context")?.loseContext();
  return { supported: true, renderer };
}

let fast: Promise<boolean> | undefined;

/** True when WebGL runs on a GPU; asked once per visit */
export function hasFastWebGL(): Promise<boolean> {
  fast ??= probeInWorker().then((probe) => {
    const { renderer } = probe?.supported ? probe : probeHere();
    return renderer !== null && !isSoftwareRenderer(renderer);
  });
  return fast;
}
