import React, { useRef } from 'react'
import { useFrame, useThree } from 'react-three-fiber'
import textureExperimentFragmentShader from '../../assets/shaders/texture_experiment.frag';
import textureExperimentVertexShader from '../../assets/shaders/texture_experiment.vert';
import * as THREE from 'three';


export function PlaneTexture(props) {

  const group = useRef();
  const { scene } = useThree();

  var axesHelper = new THREE.AxesHelper(1);
  scene.add(axesHelper)
  
  const ref = useRef();
  useFrame((event) => {
    ref.current.material.uniforms.uTime.value += 0.01;
  });


  const data = {
    uniforms: {
      uTime: { value: 0 },
      mouse: { value: {x: 0, y: 0 } },
      lights: true,
    },
    transparent: true,
    fragmentShader: textureExperimentFragmentShader,
    vertexShader: textureExperimentVertexShader,
  };

  return (
    <group position={[10, 8, 10]}>
      <mesh ref={ref}>
        <planeBufferGeometry attach="geometry" args={[50, 30, 128, 128]}></planeBufferGeometry>
        <shaderMaterial attach="material" {...data} />
      </mesh>
    </group>
  )
}
