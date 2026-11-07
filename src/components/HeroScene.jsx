import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Abstract metallic sculpture.
 *
 * Form: a square-profile (4 radial segments) torus knot, flat-shaded so every
 * fold becomes a crisp reflective plane — like folded architectural metal.
 * A slimmer copper knot threads through it so the piece reads as two
 * interconnected forms. Two draw calls, no textures, no post-processing.
 *
 * Lighting: instead of an HDRI, a tiny "studio" scene (a few emissive boxes:
 * warm-ivory strip lights + one restrained burnt-orange strip) is baked once
 * through PMREM into scene.environment. That is what the metal reflects.
 */

function useStudioEnvironment() {
  const { gl, scene } = useThree()
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl)
    const studio = new THREE.Scene()
    studio.background = new THREE.Color('#0a0908')
    const owned = []
    const strip = (size, pos, color, power) => {
      const geo = new THREE.BoxGeometry(...size)
      const mat = new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(power) })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(...pos)
      studio.add(mesh)
      owned.push(geo, mat)
    }
    strip([9, 1.1, 0.3], [0, 6, -2], '#f0ede5', 5) // key light, top
    strip([0.3, 8, 3], [-7, 0.5, 0], '#f0ede5', 2.4) // left strip
    strip([0.3, 5, 2], [7, 0, 1], '#d97745', 3.4) // right strip — the restrained orange
    strip([7, 0.3, 7], [0, -6, 0], '#5a5348', 1) // floor bounce
    strip([3, 3, 0.2], [0, 0, 8], '#f0ede5', 0.5) // soft front fill
    const target = pmrem.fromScene(studio, 0.03)
    scene.environment = target.texture
    return () => {
      scene.environment = null
      target.dispose()
      pmrem.dispose()
      owned.forEach((o) => o.dispose())
    }
  }, [gl, scene])
}

function Sculpture({ mobile }) {
  const group = useRef()
  const { viewport, camera, gl } = useThree()
  useStudioEnvironment()

  const seg = mobile ? 150 : 240
  const outerMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#1a1917', metalness: 1, roughness: 0.34, envMapIntensity: 1.15, flatShading: true }),
    [],
  )
  const innerMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#7a4630', metalness: 1, roughness: 0.38, envMapIntensity: 1, flatShading: true }),
    [],
  )
  useEffect(
    () => () => {
      outerMat.dispose()
      innerMat.dispose()
    },
    [outerMat, innerMat],
  )

  useFrame((state, dt) => {
    const g = group.current
    if (!g) return
    const wide = viewport.width / viewport.height > 1.1
    const scroll = THREE.MathUtils.clamp(window.scrollY / Math.max(window.innerHeight * 0.9, 1), 0, 1)

    // extremely slow, continuous rotation
    g.rotation.y += dt * 0.045
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, 0.42 + state.pointer.y * 0.08, 2, dt)
    g.rotation.z = THREE.MathUtils.damp(g.rotation.z, -state.pointer.x * 0.06, 2, dt)

    // placement + gradual scale reduction on scroll
    const baseX = wide ? viewport.width * 0.2 : 0
    const baseY = wide ? 0 : viewport.height * 0.16
    const s = (mobile ? 0.82 : wide ? 1.3 : 1) * (1 - scroll * 0.34)
    g.position.x = THREE.MathUtils.damp(g.position.x, baseX, 3, dt)
    g.position.y = THREE.MathUtils.damp(g.position.y, baseY + scroll * 0.7, 3, dt)
    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, s, 4, dt))

    // smooth camera drift toward the pointer (parallax)
    camera.position.x = THREE.MathUtils.damp(camera.position.x, state.pointer.x * 0.45, 2, dt)
    camera.position.y = THREE.MathUtils.damp(camera.position.y, state.pointer.y * 0.28, 2, dt)
    camera.lookAt(0, 0, 0)

    // dissolve as the hero exits
    gl.domElement.style.opacity = String(1 - Math.pow(scroll, 1.4))
  })

  return (
    <group ref={group} rotation={[0.42, 0.5, 0]}>
      <mesh material={outerMat}>
        <torusKnotGeometry args={[1, 0.3, seg, 4, 2, 3]} />
      </mesh>
      <mesh material={innerMat} scale={0.64} rotation={[0, 0.52, 0]}>
        <torusKnotGeometry args={[1, 0.1, seg, 4, 2, 3]} />
      </mesh>
    </group>
  )
}

export default function HeroScene({ active, mobile, onReady }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 7.4], fov: 38 }}
      dpr={mobile ? 1 : [1, 1.75]}
      frameloop={active ? 'always' : 'never'}
      gl={{ antialias: !mobile, alpha: true, powerPreference: 'high-performance' }}
      onCreated={onReady}
    >
      <directionalLight position={[-3, 4, 4]} intensity={0.5} color="#f0ede5" />
      <pointLight position={[4, -1.5, 2.5]} intensity={9} color="#d97745" />
      <Sculpture mobile={mobile} />
    </Canvas>
  )
}
