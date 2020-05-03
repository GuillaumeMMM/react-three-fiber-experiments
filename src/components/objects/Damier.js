import React, { useRef, useMemo } from 'react'
import { useFrame, useThree } from 'react-three-fiber'
import fragmentShader from '../../assets/shaders/basic.frag';
import vertexShader from '../../assets/shaders/basic.vert';

export function Damier(props) {
    
    const ref = useRef();
    useFrame(() => {
        ref.current.material.uniforms.uTime.value += 0.01;
        ref.current.material.extensions = {
            derivatives: true
         };
    });

    const data = useMemo(
        () => ({
            uniforms: {
                uTime: { value: 0 },
                lights: true
            },
            fragmentShader,
            vertexShader,
        }),
        []
    )

    let pointerDown = false;
    let initialDownPosX = null;
    let initialDownPosY = null;

    const onPointerDown = (e) => {
        pointerDown = true;
        initialDownPosX = e.pageX;
        initialDownPosY = e.pageY;
    }

    const onPointerUp = () => {
        pointerDown = false;
        initialDownPosX = null;
        initialDownPosY = null;
    }

    const onPointerMove = (event) => {
        if (pointerDown) {
            const diffX = initialDownPosX - event.pageX;
            const diffY = initialDownPosY - event.pageY;
            initialDownPosX = event.pageX;
            initialDownPosY = event.pageY;
            props.camera.position.x += diffX / 30.;
            props.camera.position.y -= diffY / 100.;
        }
    }

    return (
        <group position={[0, 0, 9]}>
            <mesh ref={ref} onPointerDown={e => onPointerDown(e)} onPointerUp={e => onPointerUp()} onPointerMove={e => onPointerMove(e)} onPointerOut={e => onPointerUp()}>
                <planeBufferGeometry attach="geometry" args={[10, 10,  128, 128]}></planeBufferGeometry>
                <shaderMaterial attach="material" {...data} />
            </mesh>
        </group>
    )
}
