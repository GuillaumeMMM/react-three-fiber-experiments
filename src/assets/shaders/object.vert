varying vec3 Normal;
varying vec3 Position;
varying vec2 vUv;
uniform float uTime;
varying vec3 vNormal;

void main(){
    vUv = uv;
    vec3 pos = position;
    Position = position;
    vNormal = (modelViewMatrix * vec4(normal, 0.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
}