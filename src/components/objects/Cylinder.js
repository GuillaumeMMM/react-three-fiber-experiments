import React, { useRef, useEffect } from 'react'
import { useFrame } from 'react-three-fiber'
import objectFragmentShader from '../../assets/shaders/object.frag';
import objectVertexShader from '../../assets/shaders/object.vert';
/* global.THREE = require('three'); */
import * as THREE from 'three';

export const Cylinder = function (props) {

  const cylinder = useRef();
  let mouseOver = false;
  const initialZPoisiton = 1;
  const TEXT_SIZE = 0.3;

  useFrame(() => {
      /* cylinder.current.rotation.x += 0.1; */
      cylinder.current.material.uniforms.uTime.value += 0.1;
      if (mouseOver && cylinder.current.position.z < initialZPoisiton + 0.5) {
        cylinder.current.position.z += 0.05;
      }

      if (!mouseOver && cylinder.current.position.z > initialZPoisiton) {
        cylinder.current.position.z -= 0.1;
      }

      if (mouseOver) {
        cylinder.current.material.uniforms.uMouseOver.value = 1;
        cylinder.current.material.uniforms.uTimeOnOver.value += 0.1;
      } else {
        cylinder.current.material.uniforms.uMouseOver.value = 0;
        cylinder.current.material.uniforms.uTimeOnOver.value = 0;
      }
  });

/*   useEffect(() => {
    cylinder.current.rotation.x = Math.PI / 2;

    var loader = new THREE.FontLoader();
    loader.load('fonts/Roboto Mono_Bold Italic.json', (font1) => {
      drawTitle('CORONAVIRUS II', font1);
    });

    function drawTitle(text, font) {
      const textGroup = new THREE.Object3D();

      cylinder.current.add(textGroup);
      var material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, side: THREE.BackSide });
      const geometry = new THREE.TextGeometry(text, { font: font, height: 0, size: TEXT_SIZE })
      let textmesh = new THREE.Mesh(geometry, material);
      textmesh.position.set(0.6, 0.5, TEXT_SIZE / 2);
      textmesh.rotation.x = -Math.PI / 2;
      textGroup.add(textmesh);
    }
  }); */

  const onPointerOver = (event) => {
    mouseOver = true;
  }

  const onPointerOut = (event) => {
    mouseOver = false;
  }

  const data = {
    uniforms: {
      uTime: { value: 0 },
      uMouseOver: {value: 0},
      uTimeOnOver: {value: 0},
    },
    transparent: true,
    fragmentShader: objectFragmentShader,
    vertexShader: objectVertexShader,
  };

  return (
    <mesh ref={cylinder} position={[-3, -1, 1]} castShadow={true} receiveShadow={true} onPointerOver={e => onPointerOver()} onPointerOut={e => onPointerOut()}>
        {/* <cylinderBufferGeometry attach="geometry" args={[0.5, 0.5, initialZPoisiton, 32]}></cylinderBufferGeometry> */}
        <sphereGeometry attach="geometry" args={[0.5, 32, 32]}></sphereGeometry>
        {/* <meshPhongMaterial attach="material" color="red" /> */}
        <shaderMaterial attach="material" {...data} />
        <ambientLight intensity={0.3}/>
        <pointLight position={[100, 100, 100]} />
    </mesh>
  )
};