import React, { useRef, useEffect } from 'react'
import { useFrame } from 'react-three-fiber'
import planeFragmentShader from '../../assets/shaders/plane.frag';
import planeVertexShader from '../../assets/shaders/plane.vert';
import * as THREE from 'three';


export function FrontPlane(props) {
    let initialCameraPosition = null;

    useFrame((event) => {
        /* planeFront.current.material.uniforms.uTime.value += 0.01; */
        /* setPlanePosition(props.camera.position.x, props.camera.position.y); */
    });

    /* const setPlanePosition = (x, y) => {
        if (planeFront.current.position) {
          planeFront.current.position.set(x, y + 10, planeFront.current.position.z);
        }
    }  */

    useEffect(() => {
        const geometry = new THREE.PlaneBufferGeometry(5, 5, 8, 8);
        const material = new THREE.MeshBasicMaterial({ color: 0x0000ff, side: THREE.BackSide });
        const planeFront = new THREE.Mesh(geometry, material);
        props.camera.add(planeFront);
        planeFront.position.set(0, 0, -1);
    });

    const data = {
        uniforms: {
            uTime: { value: 0 },
            mouse: { value: { x: 0, y: 0 } },
        },
        transparent: true,
        fragmentShader: planeFragmentShader,
        vertexShader: planeVertexShader,
    };

    return;
}
