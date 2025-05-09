import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

// Central event system for speech activity
export const useSpeechActivity = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechIntensity, setSpeechIntensity] = useState(0);
  
  return {
    isSpeaking,
    setIsSpeaking,
    speechIntensity,
    setSpeechIntensity
  };
};

// Shared speech state
const speechState = {
  isSpeaking: false,
  intensity: 0,
  isThinking: false
};

// Update speech state from outside components
export const updateSpeechState = (speaking: boolean, intensity: number = 0, thinking: boolean = false) => {
  speechState.isSpeaking = speaking;
  speechState.intensity = intensity;
  speechState.isThinking = thinking;
  
  // Also create brain particles if thinking
  if (thinking && !document.getElementById('brain-particles-container')) {
    createBrainParticles();
  } else if (!thinking) {
    removeBrainParticles();
  }
};

// Create brain activity particles
const createBrainParticles = () => {
  // Create container if it doesn't exist
  let container = document.getElementById('brain-particles-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'brain-particles-container';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100vw';
    container.style.height = '100vh';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '10';
    document.body.appendChild(container);
  }
  
  // Create particles
  const particleCount = 30;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('brain-particle');
    
    // Random size between 10px and 50px
    const size = 10 + Math.random() * 40;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    // Random position
    particle.style.position = 'absolute';
    particle.style.left = `${Math.random() * 100}vw`;
    particle.style.top = `${Math.random() * 100}vh`;
    
    // Random animation duration and delay
    const duration = 5 + Math.random() * 10;
    const delay = Math.random() * 5;
    
    // Custom properties for random movement
    particle.style.setProperty('--random-x1', `${(Math.random() * 200 - 100)}px`);
    particle.style.setProperty('--random-y1', `${(Math.random() * 200 - 100)}px`);
    particle.style.setProperty('--random-x2', `${(Math.random() * 200 - 100)}px`);
    particle.style.setProperty('--random-y2', `${(Math.random() * 200 - 100)}px`);
    particle.style.setProperty('--random-x3', `${(Math.random() * 200 - 100)}px`);
    particle.style.setProperty('--random-y3', `${(Math.random() * 200 - 100)}px`);
    
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `${delay}s`;
    particle.style.opacity = '0';
    
    container.appendChild(particle);
  }
};

// Remove brain activity particles
const removeBrainParticles = () => {
  const container = document.getElementById('brain-particles-container');
  if (container) {
    // Fade out particles first
    const particles = container.getElementsByClassName('brain-particle');
    for (let i = 0; i < particles.length; i++) {
      const particle = particles[i] as HTMLElement;
      gsap.to(particle, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          // Remove container after last particle fades
          if (i === particles.length - 1) {
            container.remove();
          }
        }
      });
    }
  }
};

// Dynamic particles forming the sphere structure with ability to detach particles
function Particles({ count = 2000 }) {
  const mesh = useRef<THREE.Points>(null);
  const particlesRef = useRef<THREE.BufferAttribute | null>(null);
  const originalPositionsRef = useRef<Float32Array | null>(null);
  const detachedParticlesRef = useRef<number[]>([]);
  const particleVelocitiesRef = useRef<THREE.Vector3[]>([]);
  const { size } = useThree();
  
  // Create particles in a spherical distribution
  const particlesGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const radius = 5;
    
    // Store velocities for detached particles
    const velocities: THREE.Vector3[] = [];
    
    for (let i = 0; i < count; i++) {
      // Spherical distribution with some randomness
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = radius * (0.8 + Math.random() * 0.2);
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      // Initialize velocity vector for each particle
      velocities.push(new THREE.Vector3(
        (Math.random() - 0.5) * 0.05,
        (Math.random() - 0.5) * 0.05,
        (Math.random() - 0.5) * 0.05
      ));
    }
    
    particleVelocitiesRef.current = velocities;
    originalPositionsRef.current = positions.slice();
    
    const positionAttribute = new THREE.BufferAttribute(positions, 3);
    geometry.setAttribute('position', positionAttribute);
    particlesRef.current = positionAttribute;
    
    return geometry;
  }, [count]);
  
  // Animation
  useFrame((state) => {
    if (mesh.current && particlesRef.current) {
      // Base rotation
      mesh.current.rotation.x = state.clock.getElapsedTime() * 0.05;
      mesh.current.rotation.y = state.clock.getElapsedTime() * 0.08;
      
      // Enhanced particle behavior when thinking
      if (speechState.isThinking) {
        if (Math.random() > 0.8 && detachedParticlesRef.current.length < 400) {
          // Add more detached particles while thinking
          const numNewParticles = Math.floor(5 + Math.random() * 10);
          
          for (let i = 0; i < numNewParticles; i++) {
            const randomIndex = Math.floor(Math.random() * count);
            if (!detachedParticlesRef.current.includes(randomIndex)) {
              detachedParticlesRef.current.push(randomIndex);
              
              // Give stronger initial velocities during thinking
              particleVelocitiesRef.current[randomIndex].x = (Math.random() - 0.5) * 0.2;
              particleVelocitiesRef.current[randomIndex].y = (Math.random() - 0.5) * 0.2;
              particleVelocitiesRef.current[randomIndex].z = (Math.random() - 0.5) * 0.2;
            }
          }
        }
      // When Anique is speaking, detach some particles
      } else if (speechState.isSpeaking && Math.random() > 0.95 && detachedParticlesRef.current.length < 100) {
        // Add more detached particles based on speech intensity
        const numNewParticles = Math.floor(speechState.intensity * 3) + 1;
        
        for (let i = 0; i < numNewParticles; i++) {
          const randomIndex = Math.floor(Math.random() * count);
          if (!detachedParticlesRef.current.includes(randomIndex)) {
            detachedParticlesRef.current.push(randomIndex);
          }
        }
      }
      
      // Update positions of detached particles
      const positions = particlesRef.current.array as Float32Array;
      const originalPositions = originalPositionsRef.current as Float32Array;
      
      for (let i = 0; i < detachedParticlesRef.current.length; i++) {
        const index = detachedParticlesRef.current[i];
        const idx = index * 3;
        
        // Current position
        const x = positions[idx];
        const y = positions[idx + 1];
        const z = positions[idx + 2];
        
        // Original position
        const ox = originalPositions[idx];
        const oy = originalPositions[idx + 1];
        const oz = originalPositions[idx + 2];
        
        // Apply velocity
        positions[idx] += particleVelocitiesRef.current[index].x;
        positions[idx + 1] += particleVelocitiesRef.current[index].y;
        positions[idx + 2] += particleVelocitiesRef.current[index].z;
        
        // Apply different behavior based on state
        if (speechState.isThinking) {
          // Particles move more erratically during thinking
          particleVelocitiesRef.current[index].multiplyScalar(0.99);
          
          // More random movement
          if (Math.random() > 0.7) {
            particleVelocitiesRef.current[index].x += (Math.random() - 0.5) * 0.05;
            particleVelocitiesRef.current[index].y += (Math.random() - 0.5) * 0.05;
            particleVelocitiesRef.current[index].z += (Math.random() - 0.5) * 0.05;
          }
        } else {
          // Gradually slow down or change direction for natural movement
          particleVelocitiesRef.current[index].multiplyScalar(0.98);
          
          // Add a bit of random movement
          if (Math.random() > 0.9) {
            particleVelocitiesRef.current[index].x += (Math.random() - 0.5) * 0.02;
            particleVelocitiesRef.current[index].y += (Math.random() - 0.5) * 0.02;
            particleVelocitiesRef.current[index].z += (Math.random() - 0.5) * 0.02;
          }
        }
        
        // Check distance from the original position
        const distance = Math.sqrt(
          Math.pow(x - ox, 2) + 
          Math.pow(y - oy, 2) + 
          Math.pow(z - oz, 2)
        );
        
        // If particle is too far, start bringing it back (unless thinking)
        if (distance > 15) {
          const returnForce = speechState.isThinking ? 0.01 : 0.02;
          particleVelocitiesRef.current[index].x += (ox - x) * returnForce;
          particleVelocitiesRef.current[index].y += (oy - y) * returnForce;
          particleVelocitiesRef.current[index].z += (oz - z) * returnForce;
        }
        
        // If particle is very close to original position and slow, re-attach it
        // But only if not thinking or speaking
        if (distance < 0.1 && 
            particleVelocitiesRef.current[index].length() < 0.01 && 
            !speechState.isSpeaking && 
            !speechState.isThinking) {
          positions[idx] = ox;
          positions[idx + 1] = oy;
          positions[idx + 2] = oz;
          particleVelocitiesRef.current[index].set(0, 0, 0);
          
          // Remove from detached list
          detachedParticlesRef.current.splice(i, 1);
          i--; // Adjust the counter since we removed an item
        }
      }
      
      // Mark the positions as needing an update
      particlesRef.current.needsUpdate = true;
    }
  });
  
  return (
    <points ref={mesh} geometry={particlesGeometry}>
      <pointsMaterial
        size={0.07}
        color="#FFD700"
        sizeAttenuation
        transparent
        opacity={0.8}
      />
    </points>
  );
}

// Glowing core sphere
function CoreSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useEffect(() => {
    if (meshRef.current) {
      // Animate the sphere on load
      gsap.to(meshRef.current.scale, {
        x: 1.1,
        y: 1.1,
        z: 1.1,
        duration: 2,
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true
      });
    }
  }, []);
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.1;
      
      // Pulse the core when speaking or thinking
      if (speechState.isSpeaking) {
        const pulseAmount = 1 + speechState.intensity * 0.1;
        meshRef.current.scale.set(pulseAmount, pulseAmount, pulseAmount);
      } else if (speechState.isThinking) {
        // Irregular pulsing when thinking
        const time = clock.getElapsedTime();
        const pulseAmount = 1 + Math.sin(time * 5) * 0.05 + Math.sin(time * 3) * 0.03;
        meshRef.current.scale.set(pulseAmount, pulseAmount, pulseAmount);
      }
    }
  });
  
  return (
    <Sphere args={[3, 64, 64]} ref={meshRef}>
      <MeshDistortMaterial
        color="#FFD700"
        attach="material"
        distort={speechState.isThinking ? 0.4 : 0.3}
        speed={speechState.isThinking ? 4 : 2}
        roughness={0.2}
        metalness={0.8}
        opacity={0.6}
        transparent
      />
    </Sphere>
  );
}

// Connection lines between core and particles
function ConnectionLines({ count = 20 }) {
  const linesRef = useRef<THREE.Group>(null);
  
  // Create random lines from sphere center
  const lines = useMemo(() => {
    const lineArray = [];
    
    for (let i = 0; i < count; i++) {
      // Create random end positions
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 5 * (0.8 + Math.random() * 0.3);
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      const points = [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(x, y, z)
      ];
      
      const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
      lineArray.push({ geometry: lineGeometry, key: i });
    }
    
    return lineArray;
  }, [count]);
  
  // Animation
  useFrame(({ clock }) => {
    if (linesRef.current) {
      linesRef.current.rotation.y = clock.getElapsedTime() * 0.05;
      linesRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.2) * 0.1;
      
      // Animate lines when speaking or thinking
      if ((speechState.isSpeaking || speechState.isThinking) && linesRef.current.children.length > 0) {
        // Make lines more vibrant and animated
        linesRef.current.children.forEach((line, i) => {
          if (Math.random() > (speechState.isThinking ? 0.6 : 0.8)) {
            const material = (line as THREE.Line).material as THREE.LineBasicMaterial;
            
            if (speechState.isThinking) {
              // More active during thinking
              material.opacity = 0.3 + Math.random() * 0.7;
            } else {
              // Standard activity during speaking
              material.opacity = 0.3 + Math.random() * 0.5 + speechState.intensity * 0.3;
            }
          }
        });
      }
    }
  });
  
  return (
    <group ref={linesRef}>
      {lines.map(({ geometry, key }) => (
        <line key={key}>
          <bufferGeometry attach="geometry" {...geometry} />
          <lineBasicMaterial
            attach="material"
            color="#FFD700"
            transparent
            opacity={0.3 + Math.random() * 0.2}
            linewidth={1}
          />
        </line>
      ))}
    </group>
  );
}

// Main component
function AniqueSphere() {
  return (
    <Canvas 
      camera={{ position: [0, 0, 15], fov: 60 }}
      dpr={[1, 2]}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.2} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
      <fog attach="fog" args={['#000', 15, 25]} />
      
      <CoreSphere />
      <Particles count={2000} />
      <ConnectionLines count={40} />
      
      <OrbitControls 
        enableZoom={false} 
        enablePan={false} 
        rotateSpeed={0.5}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </Canvas>
  );
}

export default AniqueSphere; 