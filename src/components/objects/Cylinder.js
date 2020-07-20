import React, { useRef, useEffect, useState } from 'react'
import { useFrame } from 'react-three-fiber'
import objectFragmentShader from '../../assets/shaders/object.frag';
import objectVertexShader from '../../assets/shaders/object.vert';
import emptyFragShader from '../../assets/shaders/empty.frag';
/* global.THREE = require('three'); */
import * as THREE from 'three';
import { ShaderMaterial } from 'three';

export const Cylinder = function (props) {

  const cylinder = useRef();
  const initialZPoisiton = 1;
  const TEXT_SIZE = 0.3;
/*   const [time, updateTime] = useState(100000); */
  const [lastTextPos, updateLastTextPos] = useState([]);
  const [randomTextSpeed, updateRandomTextSpeed] = useState([]);
  const [mouseOver, updateMouseover] = useState(false);
  let time = 100000;
  const [data, updateData] = useState({
    uniforms: {
      uTime: { value: Math.random() * 100000 },
      uMouseOver: { value: 0 },
      uTimeOnOver: { value: 0 },
      uText: { value: 0 },
    },
    transparent: true,
    fragmentShader: objectFragmentShader,
    vertexShader: objectVertexShader,
  })

  useFrame(() => {
    /* cylinder.current.rotation.x += 0.1; */
    if (!props.planeFrontOpened) {
      cylinder.current.material.uniforms.uTime.value += 0.1;
      if (mouseOver && cylinder.current.position.z < initialZPoisiton + 0.5) {
        cylinder.current.position.z += 0.1;
      }
      time += 0.05;
      if (!mouseOver && cylinder.current.position.z > initialZPoisiton) {
        cylinder.current.position.z -= 0.1;
  
        if (lastTextPos.length > 0) {
          updateLastTextPos([])
        }
      }
  
      if (mouseOver) {
        cylinder.current.material.uniforms.uMouseOver.value = 1;
        cylinder.current.material.uniforms.uTimeOnOver.value += 0.1;
  
        if (cylinder.current.children[2]) {
          cylinder.current.children[2].children.forEach((text, i) => {
            if (text) {
              text.children[0].material.uniforms.uMouseOver.value = 1;
            }
          });
        }
  
        if (lastTextPos.length === 0 && cylinder.current.children[2]) {
          cylinder.current.children[2].children.forEach((text, i) => {
            const newLastTextPos = lastTextPos.concat([]);
            newLastTextPos.push(text.position);
            updateLastTextPos(newLastTextPos);
          });
        }
      } else {
        cylinder.current.material.uniforms.uMouseOver.value = 0;
        cylinder.current.material.uniforms.uTimeOnOver.value = 0;
        if (cylinder.current.children[2]) {
          cylinder.current.children[2].children.forEach((text, i) => {
            if (text) {
              text.children[0].material.uniforms.uMouseOver.value = 0;
            }
          });
        }
      }
  
      if (cylinder.current && cylinder.current.children && cylinder.current.children.length > 0 && cylinder.current.children[2]) {
        cylinder.current.children[2].children.forEach((text, i) => {
          if (lastTextPos.length === 0) {
            text.position.set(10 * 0.5 * TEXT_SIZE * Math.cos(time * randomTextSpeed[i] / 20), -0.5 + (i / 10) + Math.sin(time * randomTextSpeed[i] / 20), 10 * 0.5 * TEXT_SIZE * Math.sin(time * randomTextSpeed[i] / 20))
          } else {
            text.position.set(1 + (i * TEXT_SIZE / 1.3), -0.5, TEXT_SIZE / 2)
          }
        })
      }
    }
  });

  useEffect(() => {

    cylinder.current.rotation.x = Math.PI / 2;

    var loader = new THREE.FontLoader();
    loader.load('fonts/Roboto Mono_Bold Italic.json', (font1) => {
      drawTitle(props.text, font1);
    });

    function drawTitle(text, font) {
      const newRandom = [];
      for (let i = 0; i < text.length; i++) {
        newRandom.push((Math.random() * 5) + 2);
      }
      updateRandomTextSpeed(newRandom);


      if (text && text.length > 0) {
        const textGroup = new THREE.Object3D();
        cylinder.current.add(textGroup);
        for (let i = 0; i < text.length; i++) {
          const textGroupItem = new THREE.Object3D();

          textGroup.add(textGroupItem);
          const newData = JSON.parse(JSON.stringify(data));
          newData.uniforms.uText.value = 1.;
          var material = new ShaderMaterial(newData)
          const geometry = new THREE.TextGeometry(text[i], { font: font, height: 0, size: TEXT_SIZE })
          let textmesh = new THREE.Mesh(geometry, material);
          textmesh.position.set(0, 1, 0);
          textmesh.rotation.x = -Math.PI / 2;
          textGroupItem.add(textmesh);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (props.planeFrontOpened) {
      cylinder.current.material.fragmentShader = emptyFragShader;
      cylinder.current.material.needsUpdate = true;
    } else {
      cylinder.current.material.fragmentShader = objectFragmentShader;
      cylinder.current.material.needsUpdate = true;
    }
  }, [props.planeFrontOpened])

  const onPointerOver = (event) => {
    updateMouseover(true);
  }

  const onPointerOut = (event) => {
    updateMouseover(false);
  }

  return (
    <React.Fragment>
      <mesh position={props.position} onClick={e => props.onObjectClick()} onPointerOver={e => onPointerOver()} onPointerOut={e => onPointerOut()}>
        <sphereGeometry attach="geometry" args={[2, 8, 8]}></sphereGeometry>
        <meshBasicMaterial attach="material" color="red" opacity={0.5} alphaTest={1} transparent={true} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={cylinder} position={props.position} castShadow={true} receiveShadow={true}>
        {/* <cylinderBufferGeometry attach="geometry" args={[0.5, 0.5, initialZPoisiton, 32]}></cylinderBufferGeometry> */}
        <sphereGeometry attach="geometry" args={[0.75, 32, 32]}></sphereGeometry>
        {/* <meshPhongMaterial attach="material" color="red" /> */}
        <shaderMaterial attach="material" {...data} />
        <ambientLight intensity={0.3} />
        <pointLight position={[100, 100, 100]} />
      </mesh>
    </React.Fragment>
  )
};