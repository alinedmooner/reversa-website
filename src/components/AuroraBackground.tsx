import { useEffect, useState } from 'react';
import Aurora from './Aurora/Aurora';

/**
 * Mount gate for the hero's WebGL Aurora (the page's single WebGL canvas).
 *
 * - Never initializes WebGL when the user prefers reduced motion — the
 *   static ds-gradient fallback rendered behind it in Hero.astro stays.
 * - Resolves the ds accent tokens at runtime so the shader is themed from
 *   the design system without hardcoding hex values here.
 */
const STOP_TOKENS = ['--color-accent', '--color-accent-purple', '--color-accent-orange'];

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

export default function AuroraBackground() {
  const [colorStops, setColorStops] = useState<string[] | null>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!hasHardwareWebGL()) return;
    const styles = getComputedStyle(document.documentElement);
    const stops = STOP_TOKENS.map(token => styles.getPropertyValue(token).trim());
    if (stops.every(Boolean)) setColorStops(stops);
  }, []);

  if (!colorStops) return null;

  return <Aurora colorStops={colorStops} amplitude={1.1} blend={0.55} speed={0.7} />;
}
