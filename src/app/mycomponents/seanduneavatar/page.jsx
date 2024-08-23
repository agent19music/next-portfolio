"use client";
import React, { useEffect, useRef } from 'react'
import { useFrame, useGraph } from '@react-three/fiber'
import { useAnimations, useFBX, useGLTF } from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'
import { useControls } from 'leva';
import * as THREE from 'three';

export function SeanDuneAvatar(props) {
  const {animation} = props
  
  const group = useRef();  

  const {cursorFollow} = useControls({
    cursorFollow : false,
  })
  const { scene } = useGLTF('models/66c60fa8b8d58a94a84a9060.glb')
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { nodes, materials } = useGraph(clone)

  const {animations: wavingAnimation} = useFBX("animations/Waving.fbx");
  const {animations: standingAnimation} = useFBX("animations/Standing Idle.fbx");
  const {animations: fallingAnimation} = useFBX("animations/Falling Idle.fbx");
  const {animations: landingAnimation} = useFBX("animations/Falling To Landing.fbx");



  wavingAnimation[0].name = "Waving";
  standingAnimation[0].name = "Standing";
  fallingAnimation[0].name = "Falling";
  landingAnimation[0].name = "Landing";
  

  useFrame((state) => {
    if (!group.current) return;
    if (cursorFollow) {
           const target = new THREE.Vector3(state.mouse.x, state.mouse.y, 1);
      group.current.getObjectByName("Head").lookAt(target); 
     }
  });
  const {actions} = useAnimations([wavingAnimation[0], fallingAnimation[0], landingAnimation[0], standingAnimation[0]], group)
  useEffect(()=>{
    actions[animation].reset().fadeIn(0.5).play()
    return ()=>{
      actions[animation].reset().fadeOut(0.5)
    }
  },[animation])

  return (
    <group {...props} ref={group} dispose={null} >
      <group >
      <primitive object={nodes.Hips} />
      <skinnedMesh geometry={nodes.Wolf3D_Hair.geometry} material={materials.Wolf3D_Hair} skeleton={nodes.Wolf3D_Hair.skeleton} />
      <skinnedMesh geometry={nodes.Wolf3D_Outfit_Bottom.geometry} material={materials.Wolf3D_Outfit_Bottom} skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton} />
      <skinnedMesh geometry={nodes.Wolf3D_Outfit_Footwear.geometry} material={materials.Wolf3D_Outfit_Footwear} skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton} />
      <skinnedMesh geometry={nodes.Wolf3D_Outfit_Top.geometry} material={materials.Wolf3D_Outfit_Top} skeleton={nodes.Wolf3D_Outfit_Top.skeleton} />
      <skinnedMesh name="EyeLeft" geometry={nodes.EyeLeft.geometry} material={materials.Wolf3D_Eye} skeleton={nodes.EyeLeft.skeleton} morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary} morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences} />
      <skinnedMesh name="EyeRight" geometry={nodes.EyeRight.geometry} material={materials.Wolf3D_Eye} skeleton={nodes.EyeRight.skeleton} morphTargetDictionary={nodes.EyeRight.morphTargetDictionary} morphTargetInfluences={nodes.EyeRight.morphTargetInfluences} />
      <skinnedMesh name="Wolf3D_Head" geometry={nodes.Wolf3D_Head.geometry} material={materials.Wolf3D_Skin} skeleton={nodes.Wolf3D_Head.skeleton} morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary} morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences} />
      <skinnedMesh name="Wolf3D_Teeth" geometry={nodes.Wolf3D_Teeth.geometry} material={materials.Wolf3D_Teeth} skeleton={nodes.Wolf3D_Teeth.skeleton} morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary} morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences} />
      </group>
    </group>
  )
}

useGLTF.preload('models/66c60fa8b8d58a94a84a9060.glb')
