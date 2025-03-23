import React, { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { createDummyHead } from './DummyModelLoader';

interface AvatarPlayerProps {
  className?: string;
}

export default function AvatarPlayer({ className }: AvatarPlayerProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const Avatar = () => {
    const model = createDummyHead();
    const groupRef = useRef<THREE.Group>(null);

    useEffect(() => {
      if (groupRef.current) {
        groupRef.current.rotation.y = -Math.PI / 4;
      }
    }, []);

    return (
      <group ref={groupRef}>
        <primitive object={model.scene} scale={2} />
      </group>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className={`h-[300px] w-full ${className || ''}`}
    >
      {isClient && (
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <Avatar />
          <OrbitControls
            enableZoom={false}
            autoRotate
            autoRotateSpeed={1}
            enablePan={false}
          />
        </Canvas>
      )}
    </motion.div>
  );
} 