/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.16 ./public/folder.glb --transform --types 
Files: ./public/folder.glb [20.02KB] > /home/toby/Projects/web-portfolio/folder-transformed.glb [2.46KB] (88%)
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    Cube: THREE.Mesh
  }
  materials: {
    Material: THREE.MeshPhysicalMaterial
  }
  //animations: GLTFAction[]
}

type myProps = JSX.IntrinsicElements['group'] & {
  color: string
  opacity: number
}

type ContextType = Record<string, React.ForwardRefExoticComponent<JSX.IntrinsicElements['mesh']>>

export function Model(props: myProps) {
  const { nodes, materials } = useGLTF('/folder-transformed.glb') as GLTFResult
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.Cube.geometry} /*material={materials.Material} material-color="red"*/ >
        <meshPhysicalMaterial color={props.color} opacity={props.opacity} transparent metalness={0.1}/>
      </mesh>
    </group>
  )
}

useGLTF.preload('/folder-transformed.glb')
