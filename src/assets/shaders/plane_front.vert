attribute vec4 position;
attribute vec2 uv;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 Position;

void main() {
  vUv = uv;
  Position = position.xyz;
  gl_Position = projectionMatrix * modelViewMatrix * position;
}