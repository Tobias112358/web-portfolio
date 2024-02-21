'use client'
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import {Billboard, Text, Html, useGLTF } from "@react-three/drei"
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useResizeDetector } from 'react-resize-detector';
import { ModelNode, color } from "three/examples/jsm/nodes/Nodes.js";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import THREE, { MeshBasicMaterial, Vector3 } from "three";
import CanvasTools  from "./CanvasTools";


function PageMesh(props: any) {

    const ref = useRef<THREE.Mesh>(null!);

    const [rot, setRot] = useState<number>(0);

    const [hovered, setHover] = useState(false);


    const [whichWay, setWay] = useState(false);
    const [folderModel, setFolderModel] = useState<any>(useLoader(GLTFLoader, '/folder.glb'));

    useFrame((state, delta) => {

        if(ref.current.rotation.x <= -Math.PI/24) {
            setWay(false);
        } else if (ref.current.rotation.x >= Math.PI/24) {
            setWay(true);
        }
        //whichWay ? ref.current.rotation.x -= delta/8 : ref.current.rotation.x += delta/8;

        ref.current.position.z -= delta/2;

        setRot(ref.current.rotation.x);
    })

    return(
        
        <mesh  ref={ref} position={[0,-0.2,-2]} onPointerOver={(event) => setHover(true)} onPointerOut={(event) => setHover(false)} >
            {/*<boxGeometry attach="geometry" args={[5, 2, 1]} />*/}
            <primitive object={folderModel.scene} scale={3} rotation={[0, -Math.PI/2, 0]} position={[0.1, 0, 0]} children-0-castShadow />
            <meshStandardMaterial color={hovered ? 'hotpink' : '#365314'} opacity={props.opacity}/>
            <Html scale={0.1} position={[0,0,0.5]} transform >
                <div className="w-dvw text-3xl bg-gradient-radial from-lime-800">
                <p>{props.text}</p>
                <p>{props.canvasToolsHeight}</p>
                </div>
            </Html>
        </mesh>
    )
}


export function ThreeBackground(props: any) {
    
    //States

    const [lightPos, setLightPos] = useState<Vector3>(new Vector3(10, 10, 10));
    const [opacity, setOpacity] = useState<number>(1);

    const [canvasToolsHeight, setCanvasToolsHeight] = useState<number>(0);
    const canvasToolsRef = useRef<HTMLDivElement>(null!);

    const toolsOffsetVariants = {
        0: "h-screen",
        107: "h-[calc(100vh_-_107px)]",
        131: "h-[calc(100vh_-_131px)]",
    }
    const onToolbarResize = useCallback(() => {

        setCanvasToolsHeight(Math.floor(canvasToolsRef.current.clientHeight));
    }, []);

    const {width, height} = useResizeDetector({    
        targetRef: canvasToolsRef,
        handleHeight: false,
        refreshMode: 'debounce',
        refreshRate: 1000,
        onResize: onToolbarResize
    });



    return(
    <div className="h-screen">
        <CanvasTools ref={canvasToolsRef} lightPos={lightPos} setLightPos={setLightPos} opacity={opacity} setOpacity={setOpacity} display={false} />
        <div className={`${ toolsOffsetVariants[canvasToolsHeight as keyof typeof toolsOffsetVariants]}`}>
            <Canvas camera={{ position: [0, 0, 0] }}>
                <ambientLight />
                <pointLight intensity={10.0} position={lightPos} decay={0.1} />
                <PageMesh text={props.text} opacity={opacity} canvasToolsHeight={canvasToolsHeight} />
            </Canvas>
        </div>
    </div>
    );
}