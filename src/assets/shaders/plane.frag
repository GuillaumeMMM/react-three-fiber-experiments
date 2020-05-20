#extension GL_OES_standard_derivatives : enable
#pragma glslify:grid=require('glsl-grid')
#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)

varying vec2 vUv;
varying vec3 vNormal;
uniform float uTime;
uniform vec2 mouse;
varying vec3 Position;

void main(){
    vec3 color=vec3(.9,.9,.9);
    vec3 light=vec3(0.,0.,1.);
    light=normalize(light);
    
    float lines=grid(Position,vec3(1.,1.,1.),1.);
    
    float dProd=dot(vNormal,light)*.5+1.;
    
    vec4 gray=vec4(vec3(color.r*.3+color.g*.59+color.b*.11),1.);

    float noise = 1. - (sin(uTime) * cos(uTime * 3.) * cos(uTime / 10.));
    float alpha = smoothstep(0., 3., distance(Position.xy, mouse)) - 0.1 * (abs(snoise2(Position.xy * 0.2 * (cos(uTime / 5.) * cos(uTime / 3.) + sin(uTime / 2.) * sin(uTime / 3.) + cos(uTime / 1.5) * sin(uTime / 7.) + cos(uTime / 2.5) * sin(uTime / 4.4)))));
    
    gl_FragColor= vec4(vec3(1.-lines) * vec3(color) * vec3(dProd), 0.3 + alpha);
}