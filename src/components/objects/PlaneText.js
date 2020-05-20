import React, { useRef, useEffect } from 'react'
import { useFrame, useThree } from 'react-three-fiber'
import * as THREE from 'three';
import fragmentShader from '../../assets/shaders/plane_text.frag';
import vertexShader from '../../assets/shaders/plane_text.vert';
global.THREE = require('three');

export const PLaneText = function (props) {

  const TEXT_SIZE = 0.8;
  const TEXT_MIN_SPEED = 0.02;
  const TEXT_MAX_SPEED = 0.05;
  const TEXT_OUTLINE_SIZE = 0.1;
  const TEXT_INLINE_SIZE = 0.02;
  const LINE_COUNT = 3;

  const group = useRef();
  const { scene } = useThree();
  const lines = [];
  var axesHelper = new THREE.AxesHelper(1);
  scene.add(axesHelper)
  const lettersGeometries = [];

  useFrame(() => {
    if (group.current.children && group.current.children[0] && group.current.children[0].children && group.current.children[0].children.length > 0) {
      group.current.children.forEach((lineGroupTmp, j) => {
        const elmWidthTmp = lines.find(line => line.id === lineGroupTmp.uuid) ? lines.find(line => line.id === lineGroupTmp.uuid).elmWidth : 0;
        if (lineGroupTmp.position.x - elmWidthTmp > 10) {
          lineGroupTmp.position.x -= (elmWidthTmp + TEXT_SIZE)
        }
        if (lineGroupTmp.position.x + elmWidthTmp < -20) {
          lineGroupTmp.position.x += (elmWidthTmp + TEXT_SIZE)
        }
        if (lines.find(line => line.id === lineGroupTmp.uuid)) {
          const line = lines.find(line => line.id === lineGroupTmp.uuid);
          group.current.children[j].position.x += line.direction * line.speed;
        }
      });
    }
  });

  useEffect(() => {

    var loader = new THREE.FontLoader();
    loader.load('fonts/Roboto Mono_Bold Italic.json', (font1) => {
      loader.load('fonts/MS Mincho_Regular.json', (font2) => {
        const texts = [
          { chars: 'Bonjour', font: font1 },
          { chars: '私は日本語を話しません', font: font2 },
          { chars: 'Hello', font: font1 }];
        let charsFont1 = '';
        let charsFont2 = '';
        texts.forEach(tx => (tx.font.data.familyName === font1.data.familyName) ? charsFont1 += tx.chars : charsFont2 += tx.chars);
        const charsObj = [{ chars: charsFont1, font: font1 }, { chars: charsFont2, font: font2, inline_thickness: TEXT_INLINE_SIZE }];
        charsObj.forEach(charObj => {
          for (let i = 0; i < charObj.chars.length; i++) {
            if (charObj.chars[i] !== ' ') {
              if (lettersGeometries.length > 0) {
                if (lettersGeometries.map(lettersGeometry => lettersGeometry.char).indexOf(charObj.chars[i]) === -1) {
                  lettersGeometries.push({ char: charObj.chars[i], geometry: new THREE.TextGeometry(charObj.chars[i], { font: charObj.font, height: 0, size: TEXT_SIZE, bevelEnabled: !!charObj.inline_thickness, bevelThickness: 0, bevelSize: charObj.inline_thickness }), geometryBack: new THREE.TextGeometry(charObj.chars[i], { font: charObj.font, height: 0, size: TEXT_SIZE, bevelEnabled: true, bevelThickness: 0, bevelSize: TEXT_OUTLINE_SIZE }) });
                }
              } else {
                lettersGeometries.push({ char: charObj.chars[i], geometry: new THREE.TextGeometry(charObj.chars[i], { font: charObj.font, height: 0, size: TEXT_SIZE }), geometryBack: new THREE.TextGeometry(charObj.chars[i], { font: charObj.font, height: 0, size: TEXT_SIZE, bevelEnabled: true, bevelThickness: 0, bevelSize: TEXT_OUTLINE_SIZE }) });
              }
            }
          }

          for (let i = 0; i < LINE_COUNT; i++) {
            if (texts[i % texts.length].font.data.familyName === charObj.font.data.familyName) {
              const mouvement = { direction: -1, speed: TEXT_MIN_SPEED + (Math.random() * (TEXT_MAX_SPEED - TEXT_MIN_SPEED)) }
              drawLine(i * 2. * TEXT_SIZE, mouvement, texts[i % texts.length].chars);
            }
          }
        })
      });
    });

    function drawLine(linePos, mouvement, text) {
      const lineGroup = new THREE.Object3D();
      const lineGroupBlock1 = new THREE.Object3D();
      const lineGroupBlock2 = new THREE.Object3D();
      const lineGroupBlock3 = new THREE.Object3D();
      lineGroup.add(lineGroupBlock1);
      lineGroup.add(lineGroupBlock2);
      lineGroup.add(lineGroupBlock3);
      group.current.add(lineGroup);
      var outlineMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff, side: THREE.BackSide });

      var material = new THREE.RawShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: {
          /* map: { value: texture }, */
          color: { value: new THREE.Color('#000') }
        },
        transparent: true,
        side: THREE.DoubleSide,
        depthTest: false
      })

      let currentLeft = 0;
      for (let i = 0; i < text.length; i++) {
        if (text[i] === ' ') {
          currentLeft += 0.5
        } else {
          let mesh1 = new THREE.Mesh(lettersGeometries.find(geo => geo.char === text[i])?.geometry, material);
          let mesh1Back = new THREE.Mesh(lettersGeometries.find(geo => geo.char === text[i])?.geometryBack, outlineMaterial);
          let mesh2 = new THREE.Mesh(lettersGeometries.find(geo => geo.char === text[i])?.geometry, material);
          let mesh2Back = new THREE.Mesh(lettersGeometries.find(geo => geo.char === text[i])?.geometryBack, outlineMaterial);
          let mesh3 = new THREE.Mesh(lettersGeometries.find(geo => geo.char === text[i])?.geometry, material);
          let mesh3Back = new THREE.Mesh(lettersGeometries.find(geo => geo.char === text[i])?.geometryBack, outlineMaterial);
          mesh1.position.set(currentLeft, linePos, 0);
          mesh1Back.position.set(currentLeft, linePos, 0);
          mesh2.position.set(currentLeft, linePos, 0);
          mesh2Back.position.set(currentLeft, linePos, 0);
          mesh3.position.set(currentLeft, linePos, 0);
          mesh3Back.position.set(currentLeft, linePos, 0);
          lineGroup.children[0].add(mesh1);
          lineGroup.children[0].add(mesh1Back);
          lineGroup.children[1].add(mesh2);
          lineGroup.children[1].add(mesh2Back);
          lineGroup.children[2].add(mesh3);
          lineGroup.children[2].add(mesh3Back);
          var cube_bbox = new THREE.Box3();
          cube_bbox.setFromObject(mesh1);
          currentLeft += getBoxWidth(cube_bbox) + 0.1;
        }
      }
      const line_bbox = new THREE.Box3();
      line_bbox.setFromObject(lineGroup);
      lineGroup.children[0].position.set(- getBoxWidth(line_bbox) - TEXT_SIZE, 0, 0);
      lineGroup.children[2].position.set(getBoxWidth(line_bbox) + TEXT_SIZE, 0, 0);
      lines.push({ id: lineGroup.uuid, direction: mouvement.direction, speed: mouvement.speed, elmWidth: getBoxWidth(line_bbox) });
    }

    const getBoxWidth = (bbox) => {
      return (bbox.max.x - bbox.min.x);
    }
  }, []);

  return (
    <group ref={group} position={[0, -12, 0.01]}>

    </group>
  )
};