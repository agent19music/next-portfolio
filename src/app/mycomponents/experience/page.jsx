"use client";
import { OrbitControls } from "@react-three/drei";
import {SeanDuneAvatar} from "@/app/mycomponents/seanduneavatar/page";
import { PointLight } from "@react-three/drei";


export const Experience = () => {
  return (
    <>
    <OrbitControls />
    <group position-y={-1}>
      <SeanDuneAvatar />
    </group>

    <ambientLight intensity={0.6} /> 
    <pointLight 
      position={[1, 1, 1]}  
      intensity={1.7} 
    />
     <directionalLight 
        position={[3, 1, 1]} 
        intensity={0.3} 
      />
  </>
  );
};