'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { createDummyHead } from '@/utils/DummyModelLoader';

// Optimized 3D Model component with proper typing
interface ModelProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

const Model: React.FC<ModelProps> = React.memo(({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }) => {
  // Using useMemo to create the dummy model only once
  const model = useMemo(() => createDummyHead(), []);
  
  useFrame((state) => {
    // Slight automatic rotation for visual appeal
    if (model.scene) {
      model.scene.rotation.y += 0.003;
    }
  });

  return (
    <primitive
      object={model.scene}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  );
});

Model.displayName = 'Model';

// Optimized Particle Field component
interface ParticleFieldProps {
  count?: number;
  color?: string;
}

const ParticleField: React.FC<ParticleFieldProps> = React.memo(({ count = 500, color = '#88f' }) => {
  const { scene } = useThree();
  const pointsRef = useRef<THREE.Points>(null);
  
  // Create geometry only once with useMemo
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 20;
      positions[i3 + 1] = (Math.random() - 0.5) * 20;
      positions[i3 + 2] = (Math.random() - 0.5) * 20;
      speeds[i] = Math.random() * 0.02 + 0.01;
    }
    
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('speed', new THREE.BufferAttribute(speeds, 1));
    return geo;
  }, [count]);
  
  // Create material only once with useMemo
  const material = useMemo(() => {
    return new THREE.PointsMaterial({
      size: 0.1,
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
    });
  }, [color]);
  
  useFrame(() => {
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position;
      const speeds = pointsRef.current.geometry.attributes.speed;
      
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        
        // Move particles upward and reset when they go too high
        positions.array[i3 + 1] += speeds.array[i] * 0.2;
        
        if (positions.array[i3 + 1] > 10) {
          positions.array[i3 + 1] = -10;
        }
      }
      
      positions.needsUpdate = true;
    }
  });
  
  return <points ref={pointsRef} geometry={geometry} material={material} />;
});

ParticleField.displayName = 'ParticleField';

// Feature Card Component with proper typing
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

const FeatureCard: React.FC<FeatureCardProps> = React.memo(({ icon, title, description, index }) => {
  return (
    <motion.div
      className="bg-gradient-to-br from-indigo-900/30 to-indigo-800/10 backdrop-blur-sm rounded-2xl p-6 border border-indigo-800/20 shadow-xl"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 * index }}
      whileHover={{ 
        scale: 1.03, 
        boxShadow: "0 20px 25px -5px rgba(76, 29, 149, 0.1), 0 10px 10px -5px rgba(76, 29, 149, 0.04)",
        backgroundColor: "rgba(79, 70, 229, 0.1)"
      }}
    >
      <div className="bg-indigo-700/30 p-3 rounded-xl mb-4 w-14 h-14 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-300 text-base">{description}</p>
    </motion.div>
  );
});

FeatureCard.displayName = 'FeatureCard';

export default function Features() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-indigo-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center text-center mb-16">
          <motion.h1 
            className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Advanced Features
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-300 max-w-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Experience cutting-edge AI capabilities in our assistant with realistic avatar rendering, natural language processing, and seamless voice interaction.
          </motion.p>
        </div>
        
        {/* 3D Model Showcase */}
        <div className="flex flex-col lg:flex-row items-center gap-12 mb-24">
          <motion.div 
            className="w-full lg:w-1/2 h-80 md:h-96 bg-indigo-900/20 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl border border-indigo-800/20"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} intensity={1} />
              <pointLight position={[-10, -10, -10]} intensity={0.5} color="#6366f1" />
              <Model position={[0, -0.5, 0]} />
              <ParticleField count={200} color="#a5b4fc" />
              <OrbitControls 
                enableZoom={false} 
                enablePan={false}
                rotateSpeed={0.5}
                maxPolarAngle={Math.PI / 1.8}
                minPolarAngle={Math.PI / 3}
              />
            </Canvas>
          </motion.div>
          
          <motion.div 
            className="w-full lg:w-1/2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Lifelike 3D Avatar Technology</h2>
            <p className="text-gray-300 text-lg mb-8">
              Our AI Avatar Assistant utilizes advanced 3D modeling and animation techniques to create realistic human-like avatars that can express emotions and engage users in natural conversation.
            </p>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-indigo-700/30 p-2 rounded-lg mr-4 mt-1">
                  <svg className="w-5 h-5 text-indigo-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-1">Real-time Facial Expressions</h3>
                  <p className="text-gray-400">Dynamic expressions that match the conversation context</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-indigo-700/30 p-2 rounded-lg mr-4 mt-1">
                  <svg className="w-5 h-5 text-indigo-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-1">Lip Sync Technology</h3>
                  <p className="text-gray-400">Precise lip movements matching spoken words</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-indigo-700/30 p-2 rounded-lg mr-4 mt-1">
                  <svg className="w-5 h-5 text-indigo-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-1">Customizable Appearance</h3>
                  <p className="text-gray-400">Choose from a variety of realistic avatar styles</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Feature Cards */}
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-center text-white mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Powerful AI Capabilities
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          <FeatureCard
            icon={
              <svg className="w-8 h-8 text-indigo-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path>
              </svg>
            }
            title="Advanced Vision Processing"
            description="Our AI can analyze and understand visual data, recognizing objects, faces, and environments to provide context-aware responses."
            index={0}
          />
          
          <FeatureCard
            icon={
              <svg className="w-8 h-8 text-indigo-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd"></path>
              </svg>
            }
            title="Natural Language Processing"
            description="Understand and respond to complex queries with human-like comprehension, detecting intent, sentiment, and contextual nuances."
            index={1}
          />
          
          <FeatureCard
            icon={
              <svg className="w-8 h-8 text-indigo-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"></path>
              </svg>
            }
            title="Contextual Memory"
            description="Remember conversation history and user preferences to provide personalized assistance and maintain coherent interactions."
            index={2}
          />
          
          <FeatureCard
            icon={
              <svg className="w-8 h-8 text-indigo-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8z" clipRule="evenodd"></path>
              </svg>
            }
            title="Knowledge Integration"
            description="Access and leverage vast amounts of information to provide accurate answers, facts, and insights on a wide range of topics."
            index={3}
          />
          
          <FeatureCard
            icon={
              <svg className="w-8 h-8 text-indigo-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
              </svg>
            }
            title="Multimodal Integration"
            description="Seamlessly combine text, voice, and visual inputs to create a natural and intuitive interaction experience across different modalities."
            index={4}
          />
          
          <FeatureCard
            icon={
              <svg className="w-8 h-8 text-indigo-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"></path>
              </svg>
            }
            title="Real-time Response"
            description="Lightning-fast processing enables immediate responses, creating a smooth and responsive conversation flow without noticeable delays."
            index={5}
          />
        </div>
        
        {/* Call to Action */}
        <motion.div 
          className="bg-gradient-to-r from-indigo-800/30 to-purple-800/30 rounded-2xl p-8 md:p-12 text-center backdrop-blur-md border border-indigo-800/20 shadow-xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to experience the future?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Try our advanced AI Avatar Assistant now and revolutionize how you interact with artificial intelligence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a 
              href="/demo" 
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg text-lg font-semibold shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Try Demo
            </motion.a>
            <motion.a 
              href="/" 
              className="bg-transparent border border-indigo-500 text-indigo-400 hover:text-indigo-300 hover:border-indigo-400 px-8 py-3 rounded-lg text-lg font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
            </motion.a>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 