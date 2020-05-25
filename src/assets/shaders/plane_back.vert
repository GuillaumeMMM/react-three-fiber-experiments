varying vec3 Normal;
varying vec3 Position;
varying vec2 vUv;
uniform float uTime;
uniform vec2 mouse;
varying vec3 vNormal;

void main(){
    vUv = uv;
    vec3 pos = position;
    Position = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
}