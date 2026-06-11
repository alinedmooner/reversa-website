/**
 * aurora.ts — vanilla mount for the hero's WebGL Aurora (the page's single
 * WebGL canvas), translated from the former React island (Aurora.tsx +
 * AuroraBackground.tsx) so no React reaches the load path.
 *
 * Mounted once from Hero.astro and lives for the lifetime of the page, so
 * the React cleanup paths (cancelAnimationFrame, observer disconnect,
 * resize unlisten, context loss) are intentionally omitted.
 *
 * - Never initializes WebGL when the user prefers reduced motion — the
 *   caller in Hero.astro gates on that, and the static ds-gradient
 *   fallback rendered behind the canvas stays.
 * - Resolves the ds accent tokens at runtime so the shader is themed from
 *   the design system without hardcoding hex values here.
 */

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform vec3 uColorStops[3];
uniform vec2 uResolution;
uniform float uBlend;

out vec4 fragColor;

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v){
  const vec4 C = vec4(
      0.211324865405187, 0.366025403784439,
      -0.577350269189626, 0.024390243902439
  );
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);

  vec3 p = permute(
      permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0)
  );

  vec3 m = max(
      0.5 - vec3(
          dot(x0, x0),
          dot(x12.xy, x12.xy),
          dot(x12.zw, x12.zw)
      ),
      0.0
  );
  m = m * m;
  m = m * m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);

  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

struct ColorStop {
  vec3 color;
  float position;
};

#define COLOR_RAMP(colors, factor, finalColor) {              \
  int index = 0;                                            \
  for (int i = 0; i < 2; i++) {                               \
     ColorStop currentColor = colors[i];                    \
     bool isInBetween = currentColor.position <= factor;    \
     index = int(mix(float(index), float(i), float(isInBetween))); \
  }                                                         \
  ColorStop currentColor = colors[index];                   \
  ColorStop nextColor = colors[index + 1];                  \
  float range = nextColor.position - currentColor.position; \
  float lerpFactor = (factor - currentColor.position) / range; \
  finalColor = mix(currentColor.color, nextColor.color, lerpFactor); \
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;

  ColorStop colors[3];
  colors[0] = ColorStop(uColorStops[0], 0.0);
  colors[1] = ColorStop(uColorStops[1], 0.5);
  colors[2] = ColorStop(uColorStops[2], 1.0);

  vec3 rampColor;
  COLOR_RAMP(colors, uv.x, rampColor);

  float height = snoise(vec2(uv.x * 2.0 + uTime * 0.1, uTime * 0.25)) * 0.5 * uAmplitude;
  height = exp(height);
  height = (uv.y * 2.0 - height + 0.2);
  float intensity = 0.6 * height;

  float midPoint = 0.20;
  float auroraAlpha = smoothstep(midPoint - uBlend * 0.5, midPoint + uBlend * 0.5, intensity);

  vec3 auroraColor = intensity * rampColor;

  fragColor = vec4(auroraColor * auroraAlpha, auroraAlpha);
}
`;

const STOP_TOKENS = ['--color-accent', '--color-accent-purple', '--color-accent-orange'];

/* Fixed shader props the page rendered the React island with. */
const AMPLITUDE = 1.1;
const BLEND = 0.55;
const SPEED = 0.7;

/** True only when WebGL is hardware-accelerated. A software rasterizer
 *  (SwiftShader/llvmpipe) would burn the main thread on every frame —
 *  those machines keep the static gradient fallback instead. */
function hasHardwareWebGL(): boolean {
  try {
    const probe = document.createElement('canvas');
    const gl = probe.getContext('webgl2') ?? probe.getContext('webgl');
    if (!gl) return false;
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = String(
      debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER)
    );
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return !/swiftshader|llvmpipe|software/i.test(renderer);
  } catch {
    return false;
  }
}

export async function mountAurora(ctn: HTMLElement | null): Promise<void> {
  if (!ctn) return;
  if (!hasHardwareWebGL()) return;

  const styles = getComputedStyle(document.documentElement);
  const colorStops = STOP_TOKENS.map(token => styles.getPropertyValue(token).trim());
  if (!colorStops.every(Boolean)) return;

  // ogl loads only after every gate above passes: it stays off the critical
  // path, and software-GL machines never download it at all.
  const { Renderer, Program, Mesh, Color, Triangle } = await import('ogl');

  const renderer = new Renderer({
    alpha: true,
    premultipliedAlpha: true,
    antialias: true
  });
  const gl = renderer.gl;
  gl.clearColor(0, 0, 0, 0);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  gl.canvas.style.backgroundColor = 'transparent';

  const geometry = new Triangle(gl);
  if (geometry.attributes.uv) {
    delete geometry.attributes.uv;
  }

  const colorStopsArray = colorStops.map(hex => {
    const c = new Color(hex);
    return [c.r, c.g, c.b];
  });

  const program = new Program(gl, {
    vertex: VERT,
    fragment: FRAG,
    uniforms: {
      uTime: { value: 0 },
      uAmplitude: { value: AMPLITUDE },
      uColorStops: { value: colorStopsArray },
      uResolution: { value: [ctn.offsetWidth, ctn.offsetHeight] },
      uBlend: { value: BLEND }
    }
  });

  const mesh = new Mesh(gl, { geometry, program });

  function resize() {
    if (!ctn) return;
    const width = ctn.offsetWidth;
    const height = ctn.offsetHeight;
    renderer.setSize(width, height);
    program.uniforms.uResolution.value = [width, height];
  }
  window.addEventListener('resize', resize);

  ctn.appendChild(gl.canvas);

  // Skip shader work entirely while the hero is scrolled out of view.
  let inView = true;
  const io = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
  });
  io.observe(ctn);

  const update = (t: number) => {
    requestAnimationFrame(update);
    if (!inView) return;
    // Same math as the React version with fixed props:
    // time = t * 0.01, then uTime = time * speed * 0.1.
    program.uniforms.uTime.value = t * 0.01 * SPEED * 0.1;
    renderer.render({ scene: mesh });
  };
  requestAnimationFrame(update);

  resize();
}
