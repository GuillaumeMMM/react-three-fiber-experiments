#extension GL_OES_standard_derivatives : enable
#pragma glslify:grid=require('glsl-grid')
#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 Position;

void main(){
    vec3 color=vec3(0.5725, 0.5725, 0.5725);
    gl_FragColor = vec4(color, 1.);
}