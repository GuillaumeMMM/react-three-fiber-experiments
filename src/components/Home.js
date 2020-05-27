import React, { Suspense } from 'react';
import { Canvas, useThree, useFrame } from 'react-three-fiber';
import { Damier } from './objects/Damier';
import { PlaneTexture } from './experiments/PlaneTexture';
import { PlaneMouseEffect } from './experiments/PlaneMouseEffect';
import CameraControls from 'camera-controls';
import * as THREE from 'three';

CameraControls.install( { THREE: THREE } );

const Scene = (props) => {
    const {
        camera,
        gl: { domElement }
    } = useThree();

    const clock = new THREE.Clock();
    const cameraControls = new CameraControls( camera, domElement );
    cameraControls.enabled = false;

    useFrame((event) => {
        const delta = clock.getDelta();
	    cameraControls.update( delta );
    });

    const updateTranslate = (x, y) => {
        cameraControls.truck( x, y, true );
        let position = cameraControls.getPosition();
        cameraControls.setPosition(position.x, position.y, position.z + y / 8, true)
    }

    return (
        <>
            <group>
                <Damier camera={camera} updateTranslate={updateTranslate}></Damier>
                {/* <PlaneTexture camera={camera} updateTranslate={updateTranslate}></PlaneTexture> */}
                {/* <PlaneMouseEffect camera={camera} updateTranslate={updateTranslate}></PlaneMouseEffect> */}
            </group>
        </>
    )
}

export const Home = () => {

        let cameraXPos = 0;

        return (
            <div className="home-container">
                <div className="canvas-container">
                    <Canvas gl={{ antialias: false, alpha: false }} camera={{ position: [cameraXPos, -1, 8] }} onCreated={({ gl, camera }) => {
                        /* camera.lookAt(cameraXPos, 0, 0) */
                        return gl.setClearColor('white')
                        }}>
                        <Suspense fallback={null}>
                            <Scene></Scene>
                        </Suspense>
                    </Canvas>
                </div>
            </div>
        );
}

export default Home;