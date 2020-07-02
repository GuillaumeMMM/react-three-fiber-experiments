import React, { Suspense, useEffect, useState } from 'react';
import { Canvas, useThree, useFrame } from 'react-three-fiber';
import { Damier } from './objects/Damier';
/* import { PlaneTexture } from './experiments/PlaneTexture';
import { PlaneMouseEffect } from './experiments/PlaneMouseEffect'; */
import CameraControls from 'camera-controls';
import * as THREE from 'three';
import { Cylinder } from './objects/Cylinder';
import AboutMe from './projects/AboutMe';
import AndreeLawrance from './projects/AndreeLawrance';
import plantFrontFragmentShader from '../assets/shaders/plane_front.frag';
import plantFrontVertexShader from '../assets/shaders/plane_front.vert';

CameraControls.install({ THREE: THREE });

const Scene = (props) => {
    let time = 0;
    const {
        camera,
        gl: { domElement },
        scene
    } = useThree();

    const [clock] = useState(new THREE.Clock());
    const [cameraControls] = useState(new CameraControls(camera, domElement));
    const [bringPlaneFront, updateBringPlaneFront] = useState(false);
    const [sendPlaneBack, updateSendPlaneBack] = useState(false);

    //  Define front plane for info display
    const geometry = new THREE.PlaneBufferGeometry(1, 1, 8, 8);
    /* const material = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 }); */
    const material = new THREE.RawShaderMaterial({
        vertexShader: plantFrontVertexShader,
        fragmentShader: plantFrontFragmentShader,
        uniforms: {
          uTime: { value: 0 },
        },
        transparent: true,
        side: THREE.DoubleSide,
        /* depthTest: false */
      })
    const [planeFront] = useState(new THREE.Mesh(geometry, material));
    const [planeFrontOpened, updatePlaneFrontOpened] = useState(false);
    const PLANE_DIM = { width: 40, height: 30 };


    useFrame((event) => {
        const delta = clock.getDelta();
        cameraControls.update(delta);
        time += 0.1;

        if (bringPlaneFront) {
            if (planeFront.material.opacity < 0.8) {
                planeFront.material.opacity += 0.02
            } else {
                updatePlaneFrontOpened(true);
                updateBringPlaneFront(false);
            }
        }
        if (sendPlaneBack) {
            if (planeFront.material.opacity > 0) {
                planeFront.material.opacity -= 0.02
            } else {
                updatePlaneFrontOpened(false);
                updateSendPlaneBack(false);
            }
        }
    });

    useEffect(() => {
        scene.add(camera);
        camera.fov = 20;
        camera.updateProjectionMatrix();
        cameraControls.enabled = false;

        console.log('add effect');
        camera.add(planeFront);
        planeFront.position.set(0, 0, -1);
        /* planeFront.rotation.set(-1, 0, 0) */
    }, [])

    const canMoveX = (posX, delta) => {
        if (delta > 0) {
            if (posX < (PLANE_DIM.width / 2) - 10) {
                return true;
            } else {
                return false;
            }
        } else {
            if (posX > (- PLANE_DIM.width / 2) + 10) {
                return true;
            } else {
                return false;
            }
        }
    }

    const canMoveY = (posY, delta) => {
        if (delta < 0) {
            if (posY < (PLANE_DIM.height / 2) - 16) {
                return true;
            } else {
                return false;
            }
        } else {
            if (posY > (- PLANE_DIM.height / 2) + 0) {
                return true;
            } else {
                return false;
            }
        }
    }

    const updateTranslate = (x, y) => {
        let position = cameraControls.getPosition();
        const deltaX = canMoveX(position.x, x) ? x : 0;
        const deltaY = canMoveY(position.y, y) ? y : 0;
        cameraControls.truck(deltaX, deltaY, true);
        position = cameraControls.getPosition();
        cameraControls.setPosition(position.x, position.y, position.z + deltaY / 2, true);
    }

    const onObjectClick = (objectId) => {
        console.log(objectId)
        if (!planeFrontOpened) {
            props.updateOpenedPage(objectId);
            if (!sendPlaneBack) {
                updateBringPlaneFront(true);
            }
        } else {
            props.updateOpenedPage(null);
            if (!bringPlaneFront) {
                updateSendPlaneBack(true);
            }
        }
    }

    return (
        <>
            <group>
                <Damier camera={camera} positions={[[-3, -1, 1.5], [3, 1, 1.5], [3, -3, 1.5], [8, 7, 1.5], [-5, -8, 1.5]]} updateTranslate={updateTranslate} planeFrontOpened={planeFrontOpened}></Damier>
                <Cylinder onObjectClick={onObjectClick.bind(this, 'andree-lawrance')} text={'ANDREE LAWRANCE'} position={[-3, -1, 1.5]}></Cylinder>
                <Cylinder onObjectClick={onObjectClick.bind(this, 'clubbing-feels')} text={'CLUBBING FEELS'} position={[3, 1, 1.5]}></Cylinder>
                <Cylinder onObjectClick={onObjectClick.bind(this, 'data-art')} text={'DATA ART'} position={[3, -3, 1.5]}></Cylinder>
                <Cylinder onObjectClick={onObjectClick.bind(this, 'orbiting-portraits')} text={'ORBITING PORTRAITS'} position={[8, 7, 1.5]}></Cylinder>
                <Cylinder onObjectClick={onObjectClick.bind(this, 'about-me')} text={'ABOUT ME'} position={[-5, -8, 1.5]}></Cylinder>
                {/* <FrontPlane camera={camera}></FrontPlane> */}
                {/* <PlaneTexture camera={camera} updateTranslate={updateTranslate}></PlaneTexture> */}
                {/* <PlaneMouseEffect camera={camera} updateTranslate={updateTranslate}></PlaneMouseEffect> */}
            </group>
        </>
    )
}

export const Home = () => {

    let cameraXPos = 0;
    const [openedPage, updateOpenedPage] = useState(null);

    return (
        <div className="home-container">
            <div className="canvas-container">
                <Canvas gl={{ antialias: false, alpha: false }} camera={{ position: [cameraXPos, -10, 20] }} onCreated={({ gl, camera }) => {
                    /* camera.lookAt(cameraXPos, 0, 0) */
                    return gl.setClearColor('white')
                }}>
                    <Suspense fallback={null}>
                        <Scene updateOpenedPage={updateOpenedPage}></Scene>
                    </Suspense>
                </Canvas>
            </div>
            <div className="project-content">
                {(openedPage === 'about-me') ? <AboutMe></AboutMe> : null}
                {(openedPage === 'andree-lawrance') ? <AndreeLawrance></AndreeLawrance> : null}
            </div>
        </div>
    );
}

export default Home;