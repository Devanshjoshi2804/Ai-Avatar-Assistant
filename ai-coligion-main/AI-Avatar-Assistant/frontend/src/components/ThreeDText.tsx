import React, { useState, useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FontLoader, Font } from 'three/examples/jsm/loaders/FontLoader';
import * as THREE from 'three';

interface ThreeDTextProps {
  text: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  color?: string;
  size?: number;
  height?: number;
  hover?: boolean;
  fontPath?: string;
}

export default function ThreeDText({
  text,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  color = '#ffffff',
  size = 0.5,
  height = 0.2,
  hover = true,
  fontPath = '/fonts/inter_bold.json',
}: ThreeDTextProps) {
  const [font, setFont] = useState<Font | null>(null);
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const mesh = useRef<THREE.Mesh>(null);
  const { camera } = useThree();
  
  // Load font
  useEffect(() => {
    const loader = new FontLoader();
    loader.load(fontPath, (loadedFont) => {
      setFont(loadedFont);
      try {
        const textGeometry = new TextGeometry(text, {
          font: loadedFont,
          size,
          depth: height,
          curveSegments: 4,
          bevelEnabled: false,
        });
        textGeometry.computeBoundingBox();
        textGeometry.center();
        setGeometry(textGeometry);
        setIsLoaded(true);
      } catch (error) {
        console.error('Error creating text geometry:', error);
        // Create a fallback geometry when TextGeometry fails
        const fallbackGeometry = new THREE.BoxGeometry(text.length * 0.3, 0.4, 0.1);
        setGeometry(fallbackGeometry);
        setIsLoaded(true);
      }
    }, 
    // Progress callback
    undefined,
    // Error callback
    (error) => {
      console.error('Error loading font:', error);
      // Create a fallback geometry when font loading fails
      const fallbackGeometry = new THREE.BoxGeometry(text.length * 0.3, 0.4, 0.1);
      setGeometry(fallbackGeometry);
      setIsLoaded(true);
    });
  }, [text, size, height, fontPath]);
  
  // Animation on hover
  useFrame((state) => {
    if (!mesh.current || !hover) return;
    
    // Make text face the camera
    mesh.current.lookAt(camera.position);
    
    // Gentle floating animation
    mesh.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.05;
    
    // Subtle pulsing
    const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.03;
    mesh.current.scale.set(scale, scale, scale);
  });
  
  if (!isLoaded || !geometry) return null;
  
  return (
    <mesh
      ref={mesh}
      position={position}
      rotation={rotation && [rotation[0], rotation[1], rotation[2]]}
    >
      {geometry && <primitive object={geometry} attach="geometry" />}
      <meshStandardMaterial 
        color={color} 
        metalness={0.5}
        roughness={0.2}
      />
    </mesh>
  );
} 