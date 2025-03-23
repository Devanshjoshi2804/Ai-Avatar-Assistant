'use client';

import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Float, Environment, Sparkles } from '@react-three/drei';
import { motion } from 'framer-motion';
import Link from 'next/link';
import * as THREE from 'three';

interface AnimatedSphereProps {
  position: [number, number, number];
  color: string;
  speed: number;
}

function AnimatedSphere({ position, color, speed }: AnimatedSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(time * speed) * 0.2;
      meshRef.current.rotation.y = time * 0.5;
      meshRef.current.rotation.x = time * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color={color} roughness={0.1} metalness={0.8} />
    </mesh>
  );
}

function FloatingText() {
  return (
    <Float 
      speed={1.5} 
      rotationIntensity={0.2} 
      floatIntensity={0.5}
      position={[0, 1, 0]}
    >
      <Text
        color="#ffffff"
        fontSize={1}
        maxWidth={10}
        lineHeight={1}
        letterSpacing={0.02}
        textAlign="center"
        font="/fonts/Inter-Bold.woff"
      >
        AI-Avatar Assistant
      </Text>
    </Float>
  );
}

export default function About() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  
  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-blue-950 to-black">
      <div className="absolute inset-0 z-10">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Environment preset="city" />
          <Sparkles count={100} scale={10} size={1} speed={0.3} />
          
          <AnimatedSphere position={[-2, 0, 0]} color="#4285F4" speed={1} />
          <AnimatedSphere position={[2, 0, 0]} color="#EA4335" speed={0.8} />
          <AnimatedSphere position={[0, -2, 0]} color="#FBBC05" speed={1.2} />
          <AnimatedSphere position={[0, 2, 0]} color="#34A853" speed={0.6} />
          
          <FloatingText />
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
      </div>
      
      <div className="relative z-20 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto bg-black/30 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold text-white mb-4">About AI-Avatar Assistant</h1>
            <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto"></div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="prose prose-invert lg:prose-xl max-w-none"
          >
            <p className="text-xl leading-relaxed mb-6">
              The AI-Avatar Assistant is a cutting-edge virtual assistant that combines advanced AI technology with lifelike digital avatars to provide an immersive and intuitive user experience.
            </p>
            
            <p className="text-lg leading-relaxed mb-6">
              Our system leverages state-of-the-art natural language processing, computer vision, and 3D rendering technologies to create a virtual assistant that not only understands your needs but responds with human-like expressions and gestures.
            </p>
            
            <h2 className="text-3xl font-bold mt-12 mb-6">Key Features</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 rounded-xl p-6 shadow-lg">
                <h3 className="text-2xl font-bold text-blue-300 mb-3">Natural Conversations</h3>
                <p>Engage in fluid, context-aware conversations with an AI that understands nuance, remembers your preferences, and adapts to your communication style.</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 rounded-xl p-6 shadow-lg">
                <h3 className="text-2xl font-bold text-purple-300 mb-3">Expressive Avatars</h3>
                <p>Experience communication with lifelike digital avatars capable of displaying realistic facial expressions, emotions, and gestures that enhance understanding.</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-900/40 to-teal-900/40 rounded-xl p-6 shadow-lg">
                <h3 className="text-2xl font-bold text-green-300 mb-3">Multimodal Interaction</h3>
                <p>Communicate through text, voice, or visual inputs, with our system capable of understanding and responding through multiple channels.</p>
              </div>
              
              <div className="bg-gradient-to-br from-orange-900/40 to-red-900/40 rounded-xl p-6 shadow-lg">
                <h3 className="text-2xl font-bold text-orange-300 mb-3">Seamless Integration</h3>
                <p>Easily integrate with existing systems and platforms to enhance productivity, customer service, or entertainment experiences.</p>
              </div>
            </div>
            
            <div className="flex justify-center mt-12">
              <Link 
                href="/"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Try the Assistant Now
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 