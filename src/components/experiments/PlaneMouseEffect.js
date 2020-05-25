import React, { useRef } from 'react'
import { useFrame, useThree } from 'react-three-fiber'
import textureMouseExperimentFragmentShader from '../../assets/shaders/texture_mouse_experiment.frag';
import textureMouseExperimentVertexShader from '../../assets/shaders/texture_mouse_experiment.vert';
import * as THREE from 'three';


export function PlaneMouseEffect(props) {

  const group = useRef();
  const { scene } = useThree();

  var axesHelper = new THREE.AxesHelper(1);
  scene.add(axesHelper)
  
  const ref = useRef();
  useFrame((event) => {
    ref.current.material.uniforms.uTime.value += 0.01;

    if (mouse) {
        ref.current.material.uniforms.mouse.value.x = mouse.x;
        ref.current.material.uniforms.mouse.value.y = mouse.y;
      }
  });


  const data = {
    uniforms: {
      uTime: { value: 0 },
      mouse: { value: {x: 0, y: 0 } },
      lights: true,
    },
    transparent: true,
    fragmentShader: textureMouseExperimentFragmentShader,
    vertexShader: textureMouseExperimentVertexShader,
  };

  const mouse = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();

  const onPointerMove = (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, props.camera);
    var objects = raycaster.intersectObjects(ref.current.parent.children);
    mouse.x = objects[0].point.x;
    mouse.y = objects[0].point.y;
  }

  return (
    <group position={[0, 0, 20]}>
      <mesh ref={ref} onPointerMove={e => onPointerMove(e)}>
        <planeBufferGeometry attach="geometry" args={[50, 30, 128, 128]}></planeBufferGeometry>
        <shaderMaterial attach="material" {...data} />
      </mesh>
    </group>
  )
}
