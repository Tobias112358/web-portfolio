'use client'
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import {Billboard, Text, Html, useGLTF, PerspectiveCamera } from "@react-three/drei"
import { MouseEvent, MouseEventHandler, ReactElement, createRef, forwardRef, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useResizeDetector } from 'react-resize-detector';
import { ModelNode, color } from "three/examples/jsm/nodes/Nodes.js";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import THREE, { MeshBasicMaterial, MeshPhongMaterial, MeshPhysicalMaterial, Vector3 } from "three";
import CanvasTools  from "./CanvasTools";
import {Model} from './Folder';
import getSoftware from "./getSoftware";


export type Ref = THREE.Group;

// eslint-disable-next-line react/display-name
const PageScene = forwardRef<Ref, any>((props, ref) => {
    const [opacity, setOpacity] = useState<number>(0.8);
    const [cameraPos, setCameraPos] = useState<Vector3>(new Vector3(0,0,2));
    const [lightPos, setLightPos] = useState<Vector3>(new Vector3(3,-1.7,-1));
    
    const [pageObjects, setPageObjects] = useState<ReactElement<any, any>[]>(null!);



    const cameraRef = useRef<THREE.PerspectiveCamera>(null!);
    const pagesRef = useRef<THREE.Group>(null!);

    useEffect(() => {
        var array: ReactElement<any, any>[] = [];
        for(let i = 0; i < props.pages.length; i++) {
            
            array.push(
                <PageMesh text={props.pages[i].text} order={props.pages[i].order} color={props.pages[i].color} tagText={props.pages[i].tagText} opacity={opacity} pageLength={props.pages.length} github_url={props.pages[i].github_url} />)
        }
        setPageObjects(array);
    }, [opacity, props.pages]);

    

    

    useFrame(({ mouse, viewport }) => {
        const x = (mouse.x * viewport.width) / 15
        const y = (mouse.y * viewport.height) / 15
        pagesRef.current.lookAt(x, y, 1)
        
      })
    return (
        <group ref={ref}>
            <PerspectiveCamera ref={cameraRef} makeDefault position={cameraPos} />
            <MyRenderer opacity={opacity} />
            <ambientLight />
            {/*<mesh position={[1, 0, 0]} > 
                <sphereGeometry args={[-14.4, 10, undefined]} /> 
                <meshStandardMaterial color={'black'} opacity={opacity} transparent />
            </mesh>*/}
            <pointLight intensity={20.0} position={lightPos} decay={0.2} />
            <group ref={pagesRef}>
                {pageObjects}
            </group>    
        </group>
    )
})

function PageMesh(props: any) {

    const ref = useRef<THREE.Mesh>(null!);
    const modelRef = createRef<THREE.Group>();

    const [thisOrder, setThisOrder] = useState<number>(props.order);


    const [whichWay, setWay] = useState(false);
    const [folderModel, setFolderModel] = useState<any>(useLoader(GLTFLoader, '/folder.glb'));
    const [deltaSum, setDeltaSum] = useState<number>(-2);

    const [opacity, setOpacity] = useState<number>(0);


    const [startingZ, setStartingZ] = useState<number>(-(props.order/8));
    const [settledZ, setSettledZ] = useState<number>(-((props.order/8)+2));

    useEffect(() => {
        if (props.order == props.pageLength && settledZ != -((props.order/8)+2)) {
            setSettledZ(-1);

        } else if (settledZ != -1) {
            setSettledZ(-((props.order/8)+2));
        }
        
        
    }, [props.order, props.pageLength, settledZ]);

    useFrame((state, delta) => {

        //Formula for moving the page's position
        if(ref.current.position.z != settledZ) {
            if(ref.current.position.z < settledZ) {
                ref.current.position.z += delta*2
                if(ref.current.position.z >= settledZ) {
                    ref.current.position.z = settledZ
                    setStartingZ(settledZ);
                }   
            } else if (ref.current.position.z > settledZ) {
                ref.current.position.z -= delta*2
                if(ref.current.position.z <= settledZ) {
                    ref.current.position.z = settledZ
                    setStartingZ(settledZ);
                }
            }
        } else if(ref.current.position.z == -1) {
            ref.current.position.z = -3.5;
            setSettledZ(-((props.order/8)+2))
        }
             

        setOpacity(-(ref.current.position.z)-1);
    })

    
    return(
        
        <mesh ref={ref} position={[0,-0.2,startingZ]} >
            <Model ref={modelRef} scale={3} rotation={[0, -Math.PI/2, 0]} position={[0,0,0]} color={props.color} opacity={opacity}>
            </Model>
            <Text scale={0.15} position={[0,0,0.125]} maxWidth={20} fillOpacity={opacity} outlineOpacity={opacity/1.4} castShadow={true} color={"#FFDEFF"} outlineColor={"#152010"} outlineWidth={0.1} fontSize={1.5} font="/fonts/Inter-Bold.ttf">
                {props.text}
            </Text>
            <Text scale={0.075} position={[-2.0575,1.4,0.125]} color={'#FFFFFF'} fillOpacity={opacity} fontSize={0.75}  outlineColor={0xaaaaba} letterSpacing={0.25} outlineWidth={0.0333} outlineBlur={0.75} castShadow>{props.tagText} </Text>
            {props.order == 1 && props.github_url != undefined &&
                <mesh scale={[1,0.5,0.5]} position={[1.2,-0.5,0.25]} frustumCulled onClick={() => {window.open(props.github_url)}}>
                    <boxGeometry />
                    <meshBasicMaterial color={props.color} transparent opacity={opacity}/>
                    <Text scale={0.15} position={[0,0,0.825]} maxWidth={20} fillOpacity={opacity} outlineOpacity={opacity/1.4} castShadow={true} color={"#FFDEFF"} fontSize={1} font="/fonts/Inter-Bold.ttf">
                        Github Here
                    </Text>
                </mesh> 

            }
            
        </mesh>
    )
}

type Page = {
    text: string;
    order: number;
    color: string;
    tagText: string;
    github_url?: string;
}

function MyRenderer(props: any) {
    const { gl } = useThree();
    useEffect(() => {
        // gl === WebGLRenderer
        // gl.info.calls
        gl.setClearColor(0x101011, props.opacity);
        //console.log(gl.info);
    });

    return null;
}


export function ThreeBackground(props: any) {
    

    //States
    const [pages, setPages] = useState<Page[]>([
    ]);

    const [opacity, setOpacity] = useState<number>(0.8);

    const [canvasToolsHeight, setCanvasToolsHeight] = useState<number>(0);
    const canvasToolsRef = useRef<HTMLDivElement>(null!);
    const pageSceneRef = useRef<THREE.Group>(null!);

    
    const toolsOffsetVariants = {
        0: "h-screen",
        107: "h-[calc(100vh_-_107px)]",
        131: "h-[calc(100vh_-_131px)]",
    }
    const onToolbarResize = useCallback(() => {

        setCanvasToolsHeight(Math.floor(canvasToolsRef.current.clientHeight));
    }, []);

    
    function handleMouseMove(event: MouseEvent) {

        /*
        console.log(window.outerHeight);
        
        var newCameraPos = new Vector3((event.clientX-(window.outerWidth/2))/100, (event.clientY-(window.outerHeight/2))/100, 2);

        console.log(newCameraPos);
        setCameraPos(newCameraPos);

        console.log(cameraRef);
        var lookAt = new THREE.Vector3(0,-0.2,-((1/8)+2));
        cameraRef.current.lookAt(lookAt);*/

    }


    const {width, height} = useResizeDetector({    
        targetRef: canvasToolsRef,
        handleHeight: false,
        refreshMode: 'debounce',
        refreshRate: 1000,
        onResize: onToolbarResize
    });

    useEffect(() => {
        async function gSoftware() {
            var software = await getSoftware();
            console.log(software);

            var pages:Page[] = [
                {text: props.text, order: 1, color: "blue", tagText: "Home"},
                {text: "Another thing here!", order: 2, color: "olive", tagText: "Software"},
                {text: "Page 3", order: 3, color: "forestgreen", tagText: "Music"},
                {text: "Page 4", order: 4, color: "darkmagenta", tagText: "Experience"},
                {text: "Final Paage", order: 5, color: "HotPink", tagText: "Socials"},
            ]

            for(var i = 0; i<software.length; i++) {

                pages.push({text: software[i].description, order: i+6, color: "red", tagText: software[i].title, github_url: software[i].github_url})
            };
            setPages(pages);
        }
        gSoftware();
        
    }, []);
    

    const nextPage = () => {
        var newPages: Page[] = [];
        pages.forEach(page => {
            var newPage = page;
            newPage.order = ((page.order-1) % pages.length)
            if(newPage.order == 0) newPage.order = pages.length;
            newPages.push(newPage)
            //console.log(newPage);
        });
        setPages(newPages);
    }



    return(
    <div className="h-screen" onMouseMove={handleMouseMove}>
        <CanvasTools ref={canvasToolsRef} lightPos={new Vector3(0,0,0)} setLightPos={() => {console.log("Null")}} opacity={opacity} setOpacity={setOpacity} display={false} />
        <div className={`${ toolsOffsetVariants[canvasToolsHeight as keyof typeof toolsOffsetVariants]}`}>
            <Canvas color="#FFFFFF" onClick={nextPage} >
                <PageScene ref={pageSceneRef} pages={pages} text={props.text} />
            </Canvas>
        </div>
    </div>
    );
}