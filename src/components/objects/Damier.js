import React, { useRef, useEffect, useState } from 'react'
import { useFrame, useThree } from 'react-three-fiber'
import planeFragmentShader from '../../assets/shaders/plane.frag';
import emptyFragShader from '../../assets/shaders/empty.frag';
import planeBackFragmentShader from '../../assets/shaders/plane_back.frag';
import planeBackVertexShader from '../../assets/shaders/plane_back.vert';
import planeVertexShader from '../../assets/shaders/plane.vert';
import fragmentShader from '../../assets/shaders/plane_text.frag';
import vertexShader from '../../assets/shaders/plane_text.vert';
import * as THREE from 'three';


export function Damier(props) {

  const [point, updatePoint] = useState(null);

  const [data, updateData] = useState({
    uniforms: {
      uTime: { value: 0 },
      mouse: { value: {x: 0, y: 0 } },
      uShadowPosition1: { value: {x: props.positions[0][0], y: props.positions[0][1]} },
      uShadowPosition2: { value: {x: props.positions[1][0], y: props.positions[1][1]} },
      uShadowPosition3: { value: {x: props.positions[2][0], y: props.positions[2][1]} },
      uShadowPosition4: { value: {x: props.positions[3][0], y: props.positions[3][1]} },
      uShadowPosition5: { value: {x: props.positions[4][0], y: props.positions[4][1]} },
    },
    transparent: true,
    fragmentShader: planeFragmentShader,
    vertexShader: planeVertexShader,
  });

  const TEXT_SIZE = 1.5;
  const TEXT_MIN_SPEED = 0.02;
  const TEXT_MAX_SPEED = 0.05;
  const TEXT_OUTLINE_SIZE = 0.1;
  const TEXT_INLINE_SIZE = 0.02;
  const LINE_COUNT = 3;
  const ENABLE_TEXT = true;
  const TEXT_INTER_LINE = 2. * (TEXT_SIZE + 0.15);
  const PLANE_DIM = {width: 40, height: 30};

  const group = useRef();
  const back = useRef();
/*   const { scene } = useThree(); */
  const [lines] = useState([]);
  const [raycaster, updateRaycaster] = useState(new THREE.Raycaster());
  const [mouse, updateMouse] = useState(new THREE.Vector2());
  const [pointerDown, updatePointerDown] = useState(false);
  const [currentDownPosX, updateCurrentDownPosX] = useState(null);
  const [currentDownPosY, updateCurrentDownPosY] = useState(null);
/*   var axesHelper = new THREE.AxesHelper(1);
  scene.add(axesHelper) */

  const ref = useRef();

  useFrame((event) => {
    ref.current.material.uniforms.uTime.value += 0.01;
      back.current.material.uniforms.uTime.value += 0.01;
      if (point) {
        ref.current.material.uniforms.mouse.value.x = point.x;
        ref.current.material.uniforms.mouse.value.y = point.y;
  
        back.current.position.x = point.x;
        back.current.position.y = point.y;
      }

    if (!props.planeFrontOpened) {
  
      if (ENABLE_TEXT) {
        if (group.current.children && group.current.children[0] && group.current.children[0].children && group.current.children[0].children.length > 0) {
          const lines_bbox = new THREE.Box3();
          lines_bbox.setFromObject(group.current);
  
          group.current.children.forEach((lineGroupTmp, j) => {
            const elmWidthTmp = lines.find(line => line.id === lineGroupTmp.uuid) ? lines.find(line => line.id === lineGroupTmp.uuid).elmWidth : 0;
            const direction = lines.find(line => line.id === lineGroupTmp.uuid) ? lines.find(line => line.id === lineGroupTmp.uuid).direction : -1;
            if (direction === 1 && lineGroupTmp.position.x + 15 > elmWidthTmp) {
              lineGroupTmp.position.x -= (elmWidthTmp + TEXT_SIZE)
            }
            if (direction === -1 && lineGroupTmp.position.x - 15 < -elmWidthTmp) {
              lineGroupTmp.position.x += (elmWidthTmp + TEXT_SIZE)
            }
            if (lines.find(line => line.id === lineGroupTmp.uuid)) {
              const line = lines.find(line => line.id === lineGroupTmp.uuid);
              group.current.children[j].position.x += line.direction * line.speed;
            }
          });
  
          if (point && (point.y) > lines_bbox.max.y - (TEXT_SIZE + 0.3)) {
            /* group.current.position.y -= (lines_bbox.min.y - lines_bbox.max.y) / LINE_COUNT; */
            getLowestLine(group.current.children).position.set(group.current.children[0].position.x, getHighestLine(group.current.children).position.y + TEXT_INTER_LINE, group.current.children[0].position.z);
          }
  
          if (point && (point.y) < lines_bbox.min.y + (TEXT_SIZE + 0.3)) {
            /* group.current.position.y -= (lines_bbox.max.y - lines_bbox.min.y) / LINE_COUNT; */
            getHighestLine(group.current.children).position.set(group.current.children[0].position.x, getLowestLine(group.current.children).position.y - TEXT_INTER_LINE, group.current.children[0].position.z);
          }
        }
      }
    }
  });

  const getLowestLine = (lines) => {
    let lowest = lines[0];
    lines.forEach(line => {
      if (line.position.y < lowest.position.y) {
        lowest = line;
      }
    });
    return lowest;
  }

  const getHighestLine = (lines) => {
    let highest = lines[0];
    lines.forEach(line => {
      if (line.position.y > highest.position.y) {
        highest = line;
      }
    });
    return highest;
  }

  useEffect(() => {

    console.log('useEffect')
    const lettersGeometries = [];

    if (ENABLE_TEXT) {
      var loader = new THREE.FontLoader();
      loader.load('fonts/Roboto Mono_Bold Italic.json', (font1) => {
        loader.load('fonts/MS Mincho_Regular.json', (font2) => {
          const texts = [
            { chars: 'Bonjour - Bonjour - Bonjour - Bonjour - Bonjour - Bonjour - ', font: font1 },
            { chars: 'おはよう - おはよう - おはよう - おはよう - おはよう - おはよう', font: font2 },
            { chars: 'Hello0 - Hello1 - Hello2 - Hello3 - Hello4 - Hello5 - Hello6 - Hello7 - Hello8 - Hello9', font: font1 }];
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
                const mouvement = { direction: Math.random() > 0.5 ? 1 : -1, speed: TEXT_MIN_SPEED + (Math.random() * (TEXT_MAX_SPEED - TEXT_MIN_SPEED)) }
                drawLine(0, mouvement, texts[i % texts.length].chars, i);
              }
            }
          })
        });
      });
    }

    function drawLine(linePos, mouvement, text, i) {
      const lineGroup = new THREE.Object3D();
      lineGroup.position.y = i * TEXT_INTER_LINE;
      lineGroup.position.z = 0;
      const lineGroupBlock1 = new THREE.Object3D();
      const lineGroupBlock2 = new THREE.Object3D();
      /* const lineGroupBlock3 = new THREE.Object3D(); */
      lineGroup.add(lineGroupBlock1);
      lineGroup.add(lineGroupBlock2);
      /* lineGroup.add(lineGroupBlock3); */
      group.current.add(lineGroup);
      var outlineMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide });

      var material = new THREE.RawShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: {
          /* map: { value: texture }, */
          mouse: { value: {x: 0, y: 0 } },
          color: { value: new THREE.Color('#000') }
        },
        transparent: true,
        side: THREE.DoubleSide,
        /* depthTest: false */
      })

      let currentLeft = 10;
      for (let i = 0; i < text.length; i++) {
        if (text[i] === ' ') {
          currentLeft += 0.5
        } else {
          let mesh1 = new THREE.Mesh(lettersGeometries.find(geo => geo.char === text[i])?.geometry, material);
          let mesh1Back = new THREE.Mesh(lettersGeometries.find(geo => geo.char === text[i])?.geometryBack, outlineMaterial);
          let mesh2 = new THREE.Mesh(lettersGeometries.find(geo => geo.char === text[i])?.geometry, material);
          let mesh2Back = new THREE.Mesh(lettersGeometries.find(geo => geo.char === text[i])?.geometryBack, outlineMaterial);
          /* let mesh3 = new THREE.Mesh(lettersGeometries.find(geo => geo.char === text[i])?.geometry, material);
          let mesh3Back = new THREE.Mesh(lettersGeometries.find(geo => geo.char === text[i])?.geometryBack, outlineMaterial); */
          mesh1.position.set(currentLeft, linePos, 0.01);
          mesh1Back.position.set(currentLeft, linePos, 0);
          mesh2.position.set(currentLeft, linePos, 0.01);
          mesh2Back.position.set(currentLeft, linePos, 0);
          /* mesh3.position.set(currentLeft, linePos, 0);
          mesh3Back.position.set(currentLeft, linePos, 0); */
          lineGroup.children[0].add(mesh1);
          lineGroup.children[0].add(mesh1Back);
          lineGroup.children[1].add(mesh2);
          lineGroup.children[1].add(mesh2Back);
          /* lineGroup.children[2].add(mesh3);
          lineGroup.children[2].add(mesh3Back); */
          var cube_bbox = new THREE.Box3();
          cube_bbox.setFromObject(mesh1);
          currentLeft += getBoxWidth(cube_bbox) + 0.1;
        }
      }
      const line_bbox = new THREE.Box3();
      line_bbox.setFromObject(lineGroup);
      lineGroup.children[0].position.set(- getBoxWidth(line_bbox) - TEXT_SIZE, 0, 0);
      /* lineGroup.children[2].position.set(getBoxWidth(line_bbox) + TEXT_SIZE, 0, 0); */
      lines.push({ id: lineGroup.uuid, direction: mouvement.direction, speed: mouvement.speed, elmWidth: getBoxWidth(line_bbox) });
    }

    const getBoxWidth = (bbox) => {
      return (bbox.max.x - bbox.min.x);
    }
  }, []);

  useEffect(() => {
    if (props.planeFrontOpened) {
      ref.current.material.fragmentShader = emptyFragShader;
      ref.current.material.needsUpdate = true;
    } else {
      ref.current.material.fragmentShader = planeFragmentShader;
      ref.current.material.needsUpdate = true;
    }
  }, [props.planeFrontOpened])

  const dataBack = JSON.parse(JSON.stringify(data));
  dataBack.fragmentShader = planeBackFragmentShader;
  dataBack.vertexShader = planeBackVertexShader;

  const onPointerDown = (e) => {
    updatePointerDown(true);
    updateCurrentDownPosX(e.pageX);
    updateCurrentDownPosY(e.pageY);
  }

  const onPointerUp = () => {
    updatePointerDown(false);
    updateCurrentDownPosX(null);
    updateCurrentDownPosY(null);
  }

  const onPointerMove = (event) => {
    if (!props.planeFrontOpened) {
      const newMouse = mouse.clone();
      newMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      newMouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
      updateMouse(newMouse);
      raycaster.setFromCamera(newMouse, props.camera);
      updateRaycaster(raycaster)
      var objects = raycaster.intersectObjects(ref.current.parent.children);
      updatePoint(objects[0].point);

      if (pointerDown) {
        const diffX = currentDownPosX - event.pageX;
        const diffY = currentDownPosY - event.pageY;
        updateCurrentDownPosX(event.pageX);
        updateCurrentDownPosY(event.pageY);
        props.updateTranslate(diffX / 50, diffY / 50);
      }
    }
  }

  /* const distance = (a, b) => {
    return Math.sqrt(((a.x - b.x) * (a.x - b.x)) + ((a.y - b.y) * (a.y - b.y)));
  } */

  return (
    <group position={[0, 0, 0]}>
      <mesh ref={ref}
        onPointerDown={e => onPointerDown(e)}
        onPointerUp={e => onPointerUp()}
        onPointerMove={e => onPointerMove(e)}
        onPointerOut={e => onPointerUp()}
      >
        <planeBufferGeometry attach="geometry" args={[PLANE_DIM.width, PLANE_DIM.height, 8, 8]}></planeBufferGeometry>
        <shaderMaterial attach="material" {...data} />
      </mesh>
      <mesh ref={back} position={[0, 0, -5]}>
        <planeBufferGeometry attach="geometry" args={[12, 12, 8, 8]}></planeBufferGeometry>
        <shaderMaterial attach="material" {...dataBack} />
      </mesh>

      <group ref={group} position={[0, 0, -4.9]}>

      </group>
    </group>
  )
}
