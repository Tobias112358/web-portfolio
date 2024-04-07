'use client'
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Text, PerspectiveCamera } from "@react-three/drei"
import { Dispatch, MouseEvent, ReactElement, SetStateAction, createRef, forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { useResizeDetector } from 'react-resize-detector';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import THREE, { Color, Vector3 } from "three";
import CanvasTools  from "./CanvasTools";
import {Model} from './Folder';
import getProjects, { Project } from "./getProjects";


export type PageSceneRef = THREE.Group;
type PageSceneProps = {
    pages: Page[]
}

// eslint-disable-next-line react/display-name
const PageScene = forwardRef<PageSceneRef, PageSceneProps>((props, ref) => {
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
                <PageMesh page={props.pages[i]} opacity={opacity} totalPages={props.pages.length} />)
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
            <pointLight intensity={20.0} position={lightPos} decay={0.2} />
            <group ref={pagesRef}>
                {pageObjects}
            </group>    
        </group>
    )
})

type PageMeshProps = {
    page: Page,
    opacity: number,
    totalPages: number,
}

function PageMesh(props: PageMeshProps) {

    const ref = useRef<THREE.Mesh>(null!);
    const modelRef = createRef<THREE.Group>();

    const [opacity, setOpacity] = useState<number>(0);


    const [startingZ, setStartingZ] = useState<number>(-(props.page.order/8));
    const [settledZ, setSettledZ] = useState<number>(-((props.page.order/8)+2));

    useEffect(() => {
        if (props.page.order == props.totalPages && settledZ != -((props.page.order/8)+2)) {
            setSettledZ(-1);

        } else if (settledZ != -1) {
            setSettledZ(-((props.page.order/8)+2));
        }
        
        
    }, [props.page.order, props.totalPages, settledZ]);

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
            setSettledZ(-((props.page.order/8)+2))
        }
             

        setOpacity(-(ref.current.position.z)-1);
    })

    
    return(
        
        <mesh ref={ref} position={[0,-0.2,startingZ]} >
            <Model ref={modelRef} scale={3} rotation={[0, -Math.PI/2, 0]} position={[0,0,0]} color={props.page.project.color} opacity={opacity}>
            </Model>
            <Text scale={0.15} position={[0,0,0.125]} maxWidth={20} fillOpacity={opacity} outlineOpacity={opacity/1.4} castShadow={true} color={"#FFDEFF"} outlineColor={"#152010"} outlineWidth={0.1} fontSize={1.5} font="/fonts/Inter-Bold.ttf">
                {props.page.project.description}
            </Text>
            <Text scale={0.075} position={[-2.0575,1.4,0.125]} color={'#FFFFFF'} fillOpacity={opacity} fontSize={0.75}  outlineColor={0xaaaaba} letterSpacing={0.25} outlineWidth={0.0333} outlineBlur={0.75} castShadow>{props.page.project.title} </Text>
            {props.page.order == 1 && props.page.project.project_link != undefined &&
                <mesh scale={[0.4,0.2,0.4]} rotation={[-Math.PI/2, 0, 0]} position={[1.5,-0.6,0.2]} frustumCulled onClick={() => {window.open(props.page.project.project_link)}}>
                    
                    <coneGeometry />
                    <meshBasicMaterial color={props.page.project.color} reflectivity={0.9} transparent opacity={opacity}/>
                    <Text scale={[0.5,0.5,0.5]} rotation={[Math.PI/2, 0, 0]} position={[0,-1,0]} maxWidth={1} fillOpacity={opacity} outlineColor={"#FFF"} outlineWidth={0.1} outlineOpacity={opacity/1.4} castShadow={true} color={"#020001"}  fontSize={1} font="/fonts/Inter-Bold.ttf">
                        {props.page.project.link_label}
                    </Text>
                </mesh> 

            }
            
        </mesh>
    )
}

type Page = {
    order: number;
    project: Project;
}

async function constructProjectPages(setPages: Dispatch<SetStateAction<Page[]>>) {
    var software: Project[] = await getProjects();
    
    var pages:Page[] = []

    for(var i = 0; i<software.length; i++) {

        pages.push({ order: i+1, project: software[i]})
    };
    setPages(pages);
}


function MyRenderer(props: any) {
    const { gl } = useThree();
    useEffect(() => {
        gl.setClearColor(0x101011, props.opacity);
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

    useEffect(() => {
        constructProjectPages(setPages);
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
    <div className="h-screen" >
        <CanvasTools ref={canvasToolsRef} lightPos={new Vector3(0,0,0)} setLightPos={() => {console.log("Null")}} opacity={opacity} setOpacity={setOpacity} display={false} />
        <div className={`${ toolsOffsetVariants[canvasToolsHeight as keyof typeof toolsOffsetVariants]}`}>
            <Canvas color="#FFFFFF" onClick={nextPage} >
                <PageScene ref={pageSceneRef} pages={pages}  />
            </Canvas>
        </div>
    </div>
    );
}