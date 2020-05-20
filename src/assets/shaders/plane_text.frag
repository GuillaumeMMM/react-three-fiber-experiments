#extension GL_OES_standard_derivatives : enable
precision highp float;

uniform float opacity;
uniform vec3 color;
uniform sampler2D map;
varying vec2 vUv;

#pragma glslify: noise = require('glsl-noise/simplex/3d')
#pragma glslify: aastep = require('glsl-aastep')

void main() {
  vec4 texColor = texture2D(map, vUv);
  vec3 newColor = vec3(1., 1., 1.);
  gl_FragColor = vec4(newColor, 1.);
}