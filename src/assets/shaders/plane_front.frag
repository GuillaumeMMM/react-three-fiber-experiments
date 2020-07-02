#extension GL_OES_standard_derivatives : enable
precision highp float;

uniform float uTime;
varying vec2 vUv;

void main() {
  vec3 newColor = vec3(1., 1., 1.);
  gl_FragColor = vec4(newColor, 0.);
}