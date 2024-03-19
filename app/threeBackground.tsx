'use client'
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import {Billboard, Text, Html, useGLTF } from "@react-three/drei"
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useResizeDetector } from 'react-resize-detector';
import { ModelNode, color } from "three/examples/jsm/nodes/Nodes.js";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import THREE, { MeshBasicMaterial, MeshPhysicalMaterial, Vector3 } from "three";
import CanvasTools  from "./CanvasTools";
import {Model} from './Folder';

function MyMaterial(props:any) {
    return 
}

function PageMesh(props: any) {

    const ref = useRef<THREE.Mesh>(null!);

    const [rot, setRot] = useState<number>(0);

    const [hovered, setHover] = useState(false);


    const [whichWay, setWay] = useState(false);
    const [folderModel, setFolderModel] = useState<any>(useLoader(GLTFLoader, '/folder.glb'));
    const [deltaSum, setDeltaSum] = useState<number>(-2);

    const [opacity, setOpacity] = useState<number>(0);

    //const [material, setMaterial] = useState<THREE.MeshPhysicalMaterial>(new THREE.MeshPhysicalMaterial({
    //    color: props.color,
    //    roughness: 0.5,
    //    metalness: 0.5,
    //    transmission: 1,
    //    thickness: 0.5,
    //    clearcoat: 1,
    //    clearcoatRoughness: 0.5,
    //    reflectivity: 0.5,
    //    ior: 1.5,
    //    envMapIntensity: 0.5,
    //    opacity: 0.5,
    //    side: THREE.DoubleSide,
    //}));

    useFrame((state, delta) => {

        if(ref.current.rotation.x <= -Math.PI/24) {
            setWay(false);
        } else if (ref.current.rotation.x >= Math.PI/24) {
            setWay(true);
        }
        //whichWay ? ref.current.rotation.x -= delta/8 : ref.current.rotation.x += delta/8;

        if(ref.current.position.z > -2.2)
        {
            setDeltaSum(deltaSum + delta);
            ref.current.position.z = 0.9/(deltaSum+2) - 2.51//(delta)/(3+ref.current.position.z);
            setOpacity(-(ref.current.position.z)-1.125);
            ref.current
        }

        if(props.color == "green")
        {
            //console.log(props.color)
            //console.log(ref.current.position.z)    

            //console.log(ref.current)
        }
        setRot(ref.current.rotation.x);
    })
    
    return(
        
        <mesh  ref={ref} position={[0,0,0]} onPointerOver={(event) => setHover(true)} onPointerOut={(event) => setHover(false)} >
            {/*<boxGeometry attach="geometry" args={[5, 2, 1]} />*/}
            <Model scale={3} rotation={[0, -Math.PI/2, 0]} position={[0.1 + (props.order/5), -0.625+(props.order/4), -((props.order/2)-0.5)]} color={props.color} opacity={opacity}>
            </Model>
            {/*<primitive object={folderModel.scene} scale={3} rotation={[0, -Math.PI/2, 0]} position={[0.1, 0, 0]} children-0-castShadow children-0-material-color={props.color} children-0-material-transparent="true" children-0-material-opacity={opacity} />
            <meshStandardMaterial color={hovered ? 'hotpink' : '#36FF14'} opacity={opacity}/>*/}
            <Text scale={0.15} position={[0 + (props.order/5), -0.625+(props.order/4), -((props.order/2)-0.6)]} maxWidth={20} fillOpacity={opacity} outlineOpacity={opacity/2} outlineWidth={0.1}>{props.text}</Text>
            {/*<Html scale={0.125} position={[0 + (props.order/5), -0.625+(props.order/4), -((props.order/2)-0.5)]} transform hidden={props.order != 1 ? true : false}>
                    <div className="w-dvw text-3xl border-4 border-purple-500 bg-gradient-to-t from-purple-700 to-purple-100 hover:animate-spin" hidden={props.order != 1 ? true : false}>
                    <p>{props.text}</p>
                    <br/>
                    <p className="text-center">Page {props.order}</p>
                    </div>
                </Html>
        */}
        </mesh>
    )
}

type Page = {
    text: string;
    order: number;
    color: string;
}


export function ThreeBackground(props: any) {
    
    //States

    const [lightPos, setLightPos] = useState<Vector3>(new Vector3(10, 10, 10));
    const [opacity, setOpacity] = useState<number>(1);

    const [canvasToolsHeight, setCanvasToolsHeight] = useState<number>(0);
    const canvasToolsRef = useRef<HTMLDivElement>(null!);

    const [pages, setPages] = useState<Page[]>([
        {text: props.text, order: 1, color: "blue"},
        {text: "Another thing here!", order: 2, color: "yellow"},
        {text: "Page 3", order: 3, color: "purple"},
        {text: "Page 4", order: 4, color: "green"},
    ]);

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

    const nextPage = () => {
        var newPages: Page[] = [];
        pages.forEach(page => {
            var newPage = page;
            newPage.order = ((page.order-1) % 4)
            if(newPage.order == 0) newPage.order = 4;
            newPages.push(newPage)
            console.log(newPage);
        });
        setPages(newPages);
    }



    return(
    <div className="h-screen">
        <CanvasTools ref={canvasToolsRef} lightPos={lightPos} setLightPos={setLightPos} opacity={opacity} setOpacity={setOpacity} display={false} />
        <div className={`${ toolsOffsetVariants[canvasToolsHeight as keyof typeof toolsOffsetVariants]}`}>
            <Canvas onClick={nextPage} camera={{ position: [0, 0, 0] }}>
                <ambientLight />
                <pointLight intensity={10.0} position={lightPos} decay={0.1} />
                <PageMesh text={pages[0].text} order={pages[0].order} color={pages[0].color} opacity={opacity} canvasToolsHeight={canvasToolsHeight} />
                <PageMesh text={pages[1].text} order={pages[1].order} color={pages[1].color} opacity={opacity} canvasToolsHeight={canvasToolsHeight} />
                <PageMesh text={pages[2].text} order={pages[2].order} color={pages[2].color} opacity={opacity} canvasToolsHeight={canvasToolsHeight} />
                <PageMesh text={pages[3].text} order={pages[3].order} color={pages[3].color} opacity={opacity} canvasToolsHeight={canvasToolsHeight} />
            </Canvas>
        </div>
    </div>
    );
}