attribute vec4 position;
attribute vec2 uv;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float uTime;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 Position;

void main() {
  vUv = uv;
  Position = position.xyz;
  Position.z = Position.z + fract(sin(0.001 * uTime * dot(Position.xy ,vec2(12.9898,78.233))) * 43758.5453) / 100.;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(Position, position.w);
}