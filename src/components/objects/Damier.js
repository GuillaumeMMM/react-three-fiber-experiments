import React, { useRef, useMemo } from 'react'
import { useFrame, useThree } from 'react-three-fiber'
import fragmentShader from '../../assets/shaders/basic.frag';
import vertexShader from '../../assets/shaders/basic.vert';

export function Damier(props) {
    
    const ref = useRef();
    useFrame((event) => {
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
    let currentDownPosX = null;
    let currentDownPosY = null;

    const onPointerDown = (e) => {
        pointerDown = true;
        currentDownPosX = e.pageX;
        currentDownPosY = e.pageY;
    }

    const onPointerUp = () => {
        pointerDown = false;
        currentDownPosX = null;
        currentDownPosY = null;
    }

    const onPointerMove = (event) => {
        if (pointerDown) {
            const diffX = currentDownPosX - event.pageX;
            const diffY = currentDownPosY - event.pageY;
            currentDownPosX = event.pageX;
            currentDownPosY = event.pageY;
            props.updateTranslate(diffX/100, diffY/100);
        }
    }

    return (
        <group position={[0, 0, 10]}>
            <mesh ref={ref} 
            onPointerDown={e => onPointerDown(e)} 
            onPointerUp={e => onPointerUp()} 
            onPointerMove={e => onPointerMove(e)} 
            onPointerOut={e => onPointerUp()}
            >
                <planeBufferGeometry attach="geometry" args={[20, 20,  128, 128]}></planeBufferGeometry>
                <shaderMaterial attach="material" {...data} />
            </mesh>
        </group>
    )
}
