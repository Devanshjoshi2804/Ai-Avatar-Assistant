'use client';

import { useEffect } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';

// Create a simple 3D head model as a fallback
export function createDummyHead() {
  // Create a group to hold all parts
  const group = new THREE.Group();
  
  // Create the head (sphere)
  const headGeometry = new THREE.SphereGeometry(1, 32, 32);
  const headMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x8a7f80, 
    roughness: 0.5, 
    metalness: 0.1 
  });
  const head = new THREE.Mesh(headGeometry, headMaterial);
  group.add(head);
  
  // Create eyes (white spheres)
  const eyeGeometry = new THREE.SphereGeometry(0.15, 16, 16);
  const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
  
  const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
  leftEye.position.set(-0.3, 0.3, 0.8);
  group.add(leftEye);
  
  const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
  rightEye.position.set(0.3, 0.3, 0.8);
  group.add(rightEye);
  
  // Create pupils (black spheres)
  const pupilGeometry = new THREE.SphereGeometry(0.05, 16, 16);
  const pupilMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
  
  const leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
  leftPupil.position.set(-0.3, 0.3, 0.95);
  group.add(leftPupil);
  
  const rightPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
  rightPupil.position.set(0.3, 0.3, 0.95);
  group.add(rightPupil);
  
  // Create mouth (curved line)
  const mouthGeometry = new THREE.TorusGeometry(0.2, 0.05, 16, 16, Math.PI);
  const mouthMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
  const mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
  mouth.rotation.x = Math.PI;
  mouth.position.set(0, -0.2, 0.8);
  group.add(mouth);
  
  // Return as a "model" with a scene property to match GLTF structure
  return { scene: group };
}

// Custom hook to load a model with fallback to dummy model
export function useGLTFWithFallback(modelPath: string) {
  const { scene } = useThree();
  
  // Always return dummy model for now
  // This prevents loading errors with placeholder JSON files
  const model = createDummyHead();
  return model;
}

// Register dummy models so Three.js doesn't throw errors when trying to load them
export function registerDummyModels() {
  // This is a fallback to prevent errors
  // In a real implementation, you would register actual models
  console.log('Using dummy 3D models');
}

export default registerDummyModels; 