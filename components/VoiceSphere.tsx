'use client'
import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function SphereParticles() {
  const pointsRef = useRef<THREE.Points>(null)
  const mouse = useRef({ x: 0, y: 0 })

  const geometry = useMemo(() => {
    const count = 2800
    const ringCount = 500
    const total = count + ringCount
    const positions = new Float32Array(total * 3)
    const colors = new Float32Array(total * 3)
    const blue = new THREE.Color('#3d6cff')
    const purple = new THREE.Color('#a855f7')
    const golden = Math.PI * (3 - Math.sqrt(5))

    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2
      const r = Math.sqrt(1 - y * y)
      const theta = golden * i
      positions[i * 3] = Math.cos(theta) * r
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = Math.sin(theta) * r
      const t = (y + 1) / 2
      const c = blue.clone().lerp(purple, 1 - t)
      colors[i * 3] = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
    }

    const midColor = new THREE.Color('#3d6cff').lerp(new THREE.Color('#a855f7'), 0.5)
    for (let i = 0; i < ringCount; i++) {
      const idx = count + i
      const theta = (i / ringCount) * Math.PI * 2
      positions[idx * 3] = Math.cos(theta) * 1.06
      positions[idx * 3 + 1] = 0
      positions[idx * 3 + 2] = Math.sin(theta) * 1.06
      colors[idx * 3] = midColor.r
      colors[idx * 3 + 1] = midColor.g
      colors[idx * 3 + 2] = midColor.b
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    return geo
  }, [])

  useEffect(() => {
    const onMouse = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouse)
    return () => window.removeEventListener('mousemove', onMouse)
  }, [])

  useFrame(({ clock }) => {
    if (!pointsRef.current) return
    const t = clock.getElapsedTime()
    pointsRef.current.rotation.y += 0.003
    pointsRef.current.rotation.x += (mouse.current.y * 0.2 - pointsRef.current.rotation.x) * 0.05
    pointsRef.current.rotation.z += (mouse.current.x * 0.05 - pointsRef.current.rotation.z) * 0.05
    const pulse = 1 + Math.sin(t * 1.8) * 0.045
    pointsRef.current.scale.setScalar(pulse)
  })

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial size={0.025} vertexColors transparent opacity={0.88} sizeAttenuation />
    </points>
  )
}

function InnerGlow() {
  const meshRef = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const mat = meshRef.current.material as THREE.MeshBasicMaterial
    mat.opacity = 0.03 + Math.sin(clock.getElapsedTime() * 2) * 0.015
  })
  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.91, 32, 32]} />
      <meshBasicMaterial color="#3d6cff" transparent opacity={0.03} side={THREE.BackSide} />
    </mesh>
  )
}

export default function VoiceSphere() {
  return (
    <Canvas
      camera={{ position: [0, 0, 2.8], fov: 55 }}
      style={{ background: 'transparent', width: '100%', height: '100%' }}
      gl={{ alpha: true, antialias: true }}
    >
      <SphereParticles />
      <InnerGlow />
    </Canvas>
  )
}
