'use client'
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import {Billboard, Text, Html, useGLTF } from "@react-three/drei"
import { createRef, useCallback, useEffect, useMemo, useRef, useState } from "react";
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
    const modelRef = createRef<THREE.Group>();

    const [thisOrder, setThisOrder] = useState<number>(props.order);


    const [whichWay, setWay] = useState(false);
    const [folderModel, setFolderModel] = useState<any>(useLoader(GLTFLoader, '/folder.glb'));
    const [deltaSum, setDeltaSum] = useState<number>(-2);

    const [opacity, setOpacity] = useState<number>(0);

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
            console.log(deltaSum)

        }

        if(ref.current.position.z)

        if(props.order != thisOrder && modelRef.current != null) {
            if (modelRef.current.position.z > 1) {
                modelRef.current.position.z = -10;
            }
            setOpacity(-(modelRef.current.position.z)+1);
            modelRef.current.position.z += delta;
            if(modelRef.current.position.z < -((props.order/2)-0.5)) {
                setThisOrder(props.order);
            }
        }

        
        //console.log(state)

        if(props.color == "purple")
        {
            console.log(modelRef)
            console.log(-((props.order/2)-0.5))
            console.log(modelRef.current.position.z)
        }
    })
    
    return(
        
        <mesh  ref={ref} position={[0,0,0]} >
            <Model ref={modelRef} scale={3} rotation={[0, -Math.PI/2, 0]} position={[0.1 + (thisOrder/5), -0.625+(thisOrder/4), -((thisOrder/2)-0.5)]} color={props.color} opacity={opacity}>
            </Model>
            <Text scale={0.15} position={[0 + (thisOrder/5), -0.625+(thisOrder/4), -((thisOrder/2)-0.6)]} maxWidth={20} fillOpacity={opacity} outlineOpacity={opacity/1.4} color={"#FFDEFF"} outlineColor={"#152010"} outlineWidth={0.05}>
                {props.text}
            </Text>
            
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

    const [lightPos, setLightPos] = useState<Vector3>(new Vector3(-4,2,0));
    const [opacity, setOpacity] = useState<number>(0.9);

    const [canvasToolsHeight, setCanvasToolsHeight] = useState<number>(0);
    const canvasToolsRef = useRef<HTMLDivElement>(null!);

    const [pages, setPages] = useState<Page[]>([
        {text: props.text, order: 1, color: "blue"},
        {text: "Another thing here!", order: 2, color: "gold"},
        {text: "Page 3", order: 3, color: "purple"},
        {text: "Page 4", order: 4, color: "red"},
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
        <CanvasTools ref={canvasToolsRef} lightPos={lightPos} setLightPos={setLightPos} opacity={opacity} setOpacity={setOpacity} display={true} />
        <div className={`${ toolsOffsetVariants[canvasToolsHeight as keyof typeof toolsOffsetVariants]}`}>
            <Canvas onClick={nextPage} camera={{ position: [0, 0, 0] }} color="#FFFFFF">
                <ambientLight />
                <mesh  position={[1, 0, 0]} >
      <sphereGeometry args={[-14.4, 10, undefined]} />
      <meshStandardMaterial color={'black'} opacity={opacity} transparent /></mesh>
                <pointLight intensity={20.0} position={lightPos} decay={0.2} />
                <PageMesh text={pages[0].text} order={pages[0].order} color={pages[0].color} opacity={opacity} canvasToolsHeight={canvasToolsHeight} />
                <PageMesh text={pages[1].text} order={pages[1].order} color={pages[1].color} opacity={opacity} canvasToolsHeight={canvasToolsHeight} />
                <PageMesh text={pages[2].text} order={pages[2].order} color={pages[2].color} opacity={opacity} canvasToolsHeight={canvasToolsHeight} />
                <PageMesh text={pages[3].text} order={pages[3].order} color={pages[3].color} opacity={opacity} canvasToolsHeight={canvasToolsHeight} />
            </Canvas>
        </div>
    </div>
    );
}