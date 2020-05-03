import React, { Component, Suspense } from 'react';
import { Canvas, useThree, extend, useFrame } from 'react-three-fiber';
/* import { DefaultThing } from './objects/DefaultObject';
import { DefaultTextObject } from './objects/DefaultTextObject'; */
import { Damier } from './objects/Damier';
import { OrbitControls } from '../assets/orbit';

extend({ OrbitControls })

const Scene = () => {
    const {
        camera,
        gl: { domElement }
    } = useThree();


    return (
        <>
            <group>
                <Damier camera={camera}></Damier>
            </group>
            {/* <orbitControls args={[camera, domElement]} /> */}
        </>
    )
}

class Home extends Component {

    render() {
        let cameraXPos = 1;

        return (
            <div className="home-container">
                <div className="canvas-container">
                    <Canvas gl={{ antialias: false, alpha: false }} camera={{ position: [cameraXPos, 0, 15] }} onCreated={({ gl, camera }) => {
                        console.log(camera)
                        camera.lookAt(cameraXPos, 0, 0)
                        return gl.setClearColor('lightpink')
                        }}>
                        <Suspense fallback={null}>
                            <Scene></Scene>
                        </Suspense>
                    </Canvas>
                </div>
            </div>
        );
    }
}

export default Home;