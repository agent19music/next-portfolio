"use client"
import { Canvas } from "@react-three/fiber";
import {Experience} from "../app/mycomponents/experience/page"

export default function SeanAvatar (){
    return (
        <Canvas shadows camera={{position:[0,2,5]}}  style={{ width: '100vw', height: '100vh' }}>
            <color attach="background" args={["#ececec"]}/>
            <Experience/>

        </Canvas>
    )
}