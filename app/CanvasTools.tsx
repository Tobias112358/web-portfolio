'use client';
import { forwardRef } from "react";

type CanvasToolsProps = {
    lightPos: THREE.Vector3,
    setLightPos: any,
    opacity: number,
    setOpacity: Function,
    display: boolean,

}

const CanvasTools = forwardRef<HTMLDivElement, CanvasToolsProps>(
    (props:any, ref:any) => (
        <div id="canvasTools" ref={ref} className={`float-left align-middle w-{80%} py-10 bg-lime-700 ${props.display ? "" : "hidden"}`} >
            <label>Position X:</label><input type="range" min={-100} defaultValue={"10"} onChange={(e) => {
                props.setLightPos([parseFloat(e.target.value), props.lightPos[1], props.lightPos[2]]);
            }} /> {props.lightPos[0]} |
            <label>Position Y:</label><input type="range" min={-100} defaultValue={"10"} onChange={(e) => {
                
                props.setLightPos([props.lightPos[0], parseFloat(e.target.value), props.lightPos[2]]);
            }} /> {props.lightPos[1]} |
            <label>Position Z:</label><input type="range" min={-100} defaultValue={"10"} onChange={(e) => {
                props.setLightPos([props.lightPos[0], props.lightPos[1], parseFloat(e.target.value)]);
            }} /> {props.lightPos[2]} |
            <label>Opacity:</label><input type="range" min={0} max={1} step={0.001} defaultValue={"1"} onChange={(e) => {
                props.setOpacity(parseFloat(e.target.value));
            }} /> {props.opacity} |
        </div>
    )
);

CanvasTools.displayName = "CanvasTools";

export default CanvasTools;
