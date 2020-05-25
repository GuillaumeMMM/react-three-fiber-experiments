#extension GL_OES_standard_derivatives : enable
#pragma glslify:grid=require('glsl-grid')
#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)

varying vec2 vUv;
varying vec3 vNormal;
uniform float uTime;
uniform vec2 mouse;
varying vec3 Position;

/* discontinuous pseudorandom uniformly distributed in [-0.5, +0.5]^3 */
vec3 random3(vec3 c) {
	float j = 4096.0*sin(dot(c,vec3(17.0, 59.4, 15.0)));
	vec3 r;
	r.z = fract(512.0*j);
	j *= .125;
	r.x = fract(512.0*j);
	j *= .125;
	r.y = fract(512.0*j);
	return r-0.5;
}

/* skew constants for 3d simplex functions */
const float F3 =  0.3333333;
const float G3 =  0.1666667;

/* 3d simplex noise */
float simplex3d(vec3 p) {
	 /* 1. find current tetrahedron T and it's four vertices */
	 /* s, s+i1, s+i2, s+1.0 - absolute skewed (integer) coordinates of T vertices */
	 /* x, x1, x2, x3 - unskewed coordinates of p relative to each of T vertices*/
	 
	 /* calculate s and x */
	 vec3 s = floor(p + dot(p, vec3(F3)));
	 vec3 x = p - s + dot(s, vec3(G3));
	 
	 /* calculate i1 and i2 */
	 vec3 e = step(vec3(0.0), x - x.yzx);
	 vec3 i1 = e*(1.0 - e.zxy);
	 vec3 i2 = 1.0 - e.zxy*(1.0 - e);
	 	
	 /* x1, x2, x3 */
	 vec3 x1 = x - i1 + G3;
	 vec3 x2 = x - i2 + 2.0*G3;
	 vec3 x3 = x - 1.0 + 3.0*G3;
	 
	 /* 2. find four surflets and store them in d */
	 vec4 w, d;
	 
	 /* calculate surflet weights */
	 w.x = dot(x, x);
	 w.y = dot(x1, x1);
	 w.z = dot(x2, x2);
	 w.w = dot(x3, x3);
	 
	 /* w fades from 0.6 at the center of the surflet to 0.0 at the margin */
	 w = max(0.6 - w, 0.0);
	 
	 /* calculate surflet components */
	 d.x = dot(random3(s), x);
	 d.y = dot(random3(s + i1), x1);
	 d.z = dot(random3(s + i2), x2);
	 d.w = dot(random3(s + 1.0), x3);
	 
	 /* multiply d by w^4 */
	 w *= w;
	 w *= w;
	 d *= w;
	 
	 /* 3. return the sum of the four surflets */
	 return dot(d, vec4(52.0));
}

/* const matrices for 3d rotation */
const mat3 rot1 = mat3(-0.37, 0.36, 0.85,-0.14,-0.93, 0.34,0.92, 0.01,0.4);
const mat3 rot2 = mat3(-0.55,-0.39, 0.74, 0.33,-0.91,-0.24,0.77, 0.12,0.63);
const mat3 rot3 = mat3(-0.71, 0.52,-0.47,-0.08,-0.72,-0.68,-0.7,-0.45,0.56);

/* directional artifacts can be reduced by rotating each octave */
float simplex3d_fractal(vec3 m) {
    return   0.5333333*simplex3d(m*rot1)
			+0.2666667*simplex3d(2.0*m*rot2)
			+0.1333333*simplex3d(4.0*m*rot3)
			+0.0666667*simplex3d(8.0*m);
}

vec4 addAmbiantNoise(vec2 pos, vec4 c) {
	float noiseAmount = 0.2;
    float n = fract(sin(dot(pos, vec2(12.9898, 78.233))) * 
                    43758.5453);
    c.x *= (1.0 - noiseAmount + n * noiseAmount  + n * n * n * noiseAmount / 2.);
    c.y *= (1.0 - noiseAmount + n * noiseAmount  + n * n * n * noiseAmount / 2.);
    c.z *= (1.0 - noiseAmount + n * noiseAmount  + n * n * n * noiseAmount / 2.);
	return c;
}

void main(){
    vec3 color=vec3(0.1922, 0.8196, 0.6627);
    vec3 color1bis=vec3(0.6902, 0.8275, 0.7961);
    vec3 color2=vec3(1.0, 0.4, 0.0);
    vec3 color2bis=vec3(0.8588, 0.4588, 0.8275);
    vec3 color3=vec3(1.0, 0.0, 0.9176);
    vec3 color3bis=color2bis;
    vec3 light=vec3(1.0, 0.0, 10.0);
    light=normalize(light);

    float dProd=dot(vNormal,light)*.5 + 1.;

	vec3 p3 = vec3(Position.xy, uTime * 2.);
    float valueGlobal = simplex3d_fractal(p3/20.);
    float valueInner = simplex3d_fractal(p3/20.);
    float valueReduced = simplex3d_fractal(p3/4.);

    float valueSmooth = smoothstep(-1., 1., valueInner);
    float valueStep = smoothstep(-.2, .2, valueGlobal);
    float valueSmooth2 = smoothstep(-1., 1., valueReduced);

    vec3 color1F = vec3(color) * vec3(valueSmooth) + vec3(color1bis) * (1. - vec3(valueSmooth));
    vec3 color2F = vec3(color2) * vec3(valueSmooth) + vec3(color2bis) * (1. - vec3(valueSmooth));
    vec3 color3F = vec3(color3bis) * vec3(valueSmooth2);

    float alpha = smoothstep(0., 4., distance(Position.xy, mouse));
    float alphaMouse = 1. - smoothstep(0., 4., distance(Position.xy, mouse));

    vec4 ambaintColor = alpha * addAmbiantNoise(Position.xy, vec4((vec3(color1F) * vec3(valueStep) + vec3(color2F) * (1. - vec3(valueStep))) * vec3(dProd), 1.)) + (1.25 - alpha) * addAmbiantNoise(Position.xy, vec4(color3F, length(color3F)));

    gl_FragColor = ambaintColor;
}