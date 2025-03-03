"use client";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import {SeanDuneAvatar} from "@/app/mycomponents/seanduneavatar";
import { PointLight } from "@react-three/drei";
import { useControls } from "leva";
import { Sky } from "@react-three/drei";
import { Environment } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { usePathname } from "next/navigation";

const ExperienceContent = () => {
  const {animation} = useControls({
    animation:{
    value : "Waving",
    options : ["Waving", "Standing", "Falling", "Landing"]
    }
  })
  return (
    <>
    <OrbitControls />
    <Sky />
    <Environment preset="sunset"/>
    <group position-y={-1}>
      <ContactShadows
      opacity={1}
      scale={10}
      blur={1}
      far={10}
      resolution={256}
      color="#000000"/>      
      <SeanDuneAvatar animation ={animation} />
    </group>

    <ambientLight intensity={0.4} /> 
    <pointLight 
      position={[1, 1, 1]}  
      intensity={0.2} 
    />
     <directionalLight 
        position={[3, 1, 1]} 
        intensity={0.3} 
      />
      <mesh scale={5} rotation-x={-Math.PI*0.5} position-y={-1.21}>

        <planeGeometry/>
        <meshStandardMaterial color={"#92736C"}/>
      </mesh>
  </>
  );
};

const Page = () => {
  const pathname = usePathname();
  const isDirectAccess = pathname === "/mycomponents/experience";

  // If accessed directly as a page, wrap with Canvas
  if (isDirectAccess) {
    return (
      <Canvas shadows camera={{position:[0,2,5]}} style={{ width: '100vw', height: '100vh' }}>
        <color attach="background" args={["#ececec"]}/>
        <ExperienceContent />
      </Canvas>
    );
  }

  // When imported by other components, return content directly
  return <ExperienceContent />;
};

export default Page;
