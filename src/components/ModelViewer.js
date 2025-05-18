import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html, useLoader } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { ErrorBoundary } from 'react-error-boundary';

function Loader() {
  return (
    <Html center>
      <div className="text-gray-600">Loading 3D model...</div>
    </Html>
  );
}

function Model({ url }) {
  const gltf = useLoader(GLTFLoader, url);
  
  React.useEffect(() => {
    if (gltf) {
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    }
  }, [gltf]);

  return gltf ? (
    <primitive 
      object={gltf.scene} 
      scale={[1, 1, 1]} 
      position={[0, -1, 0]} 
      rotation={[0, 0, 0]} 
    />
  ) : null;

}

const ModelViewer = ({ modelUrl, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="relative w-full h-full max-w-4xl max-h-[80vh] m-4 bg-white rounded-lg shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="w-full h-full p-4">
          <ErrorBoundary
            fallback={<div className="text-red-500 p-4">Error: Failed to initialize 3D viewer. Please check if your browser supports WebGL.</div>}
            onError={(error) => console.error('Three.js Error:', error)}
          >
            <Canvas
              shadows
              style={{ width: '100%', height: '100%' }}
              camera={{ position: [0, 0, 3], fov: 50 }}
              gl={{
                antialias: true,
                pixelRatio: window.devicePixelRatio,
                alpha: true
              }}
            >
              <ambientLight intensity={0.5} />
              <directionalLight 
                position={[10, 10, 5]} 
                intensity={1} 
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
              />
              <hemisphereLight intensity={0.3} groundColor="#000000" />
              <Suspense fallback={<Loader />}>
                <Model url={modelUrl} />
              </Suspense>
              <OrbitControls
                makeDefault
                enableZoom={true}
                enablePan={true}
                enableRotate={true}
                minDistance={2}
                maxDistance={10}
              />
            </Canvas>
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};

export default ModelViewer;