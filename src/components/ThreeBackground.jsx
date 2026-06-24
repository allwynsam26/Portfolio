import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { gsap } from 'gsap'

export default function ThreeBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current) return

    // --- SETUP SCENE, CAMERA, RENDERER ---
    const scene = new THREE.Scene()

    // Deep cosmic space background color
    const spaceColor = 0x030308
    scene.background = new THREE.Color(spaceColor)
    scene.fog = new THREE.FogExp2(spaceColor, 0.015)

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    )
    camera.position.z = 8

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // --- PARTICLE BACKGROUND ---
    const count = 1200
    const brightCount = Math.floor(count * 0.10) // 10% brighter particles
    const normalCount = count - brightCount

    // Normal particles geometry
    const normalGeometry = new THREE.BufferGeometry()
    const normalPositions = new Float32Array(normalCount * 3)
    const normalColors = new Float32Array(normalCount * 3)

    // Bright particles geometry
    const brightGeometry = new THREE.BufferGeometry()
    const brightPositions = new Float32Array(brightCount * 3)
    const brightColors = new Float32Array(brightCount * 3)

    // Colors: bright silver-white and bright sky blue for 90% background stars
    const colorWhite = new THREE.Color(0xeeeeee)
    const colorBlue = new THREE.Color(0x38bdf8)
    // Colors: fully bright white and vivid cyan/blue for 10% highlight stars
    const colorBrightWhite = new THREE.Color(0xffffff)
    const colorBrightBlue = new THREE.Color(0x00ffff)

    // Helper to generate coordinates and colors
    const populateParticles = (positions, colors, sizeCount, isBright) => {
      const colWhite = isBright ? colorBrightWhite : colorWhite
      const colBlue = isBright ? colorBrightBlue : colorBlue

      for (let i = 0; i < sizeCount; i++) {
        const idx = i * 3
        positions[idx] = (Math.random() - 0.5) * 150
        positions[idx + 1] = (Math.random() - 0.5) * 200 - 50
        positions[idx + 2] = -25.0 - Math.random() * 50.0

        const col = Math.random() < 0.8 ? colWhite : colBlue
        colors[idx] = col.r
        colors[idx + 1] = col.g
        colors[idx + 2] = col.b
      }
    }

    populateParticles(normalPositions, normalColors, normalCount, false)
    populateParticles(brightPositions, brightColors, brightCount, true)

    normalGeometry.setAttribute('position', new THREE.BufferAttribute(normalPositions, 3))
    normalGeometry.setAttribute('color', new THREE.BufferAttribute(normalColors, 3))

    brightGeometry.setAttribute('position', new THREE.BufferAttribute(brightPositions, 3))
    brightGeometry.setAttribute('color', new THREE.BufferAttribute(brightColors, 3))

    // Generate glowing dot texture programmatically with a solid bright center core
    const pCanvas = document.createElement('canvas')
    pCanvas.width = 16
    pCanvas.height = 16
    const ctx = pCanvas.getContext('2d')
    const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8)
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)')
    grad.addColorStop(0.35, 'rgba(255, 255, 255, 1)')
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 16, 16)
    const pTexture = new THREE.CanvasTexture(pCanvas)

    const normalMaterial = new THREE.PointsMaterial({
      size: 0.15,
      map: pTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true,
      fog: false,
    })

    const brightMaterial = new THREE.PointsMaterial({
      size: 0.32,
      map: pTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true,
      fog: false,
    })

    const normalParticles = new THREE.Points(normalGeometry, normalMaterial)
    const brightParticles = new THREE.Points(brightGeometry, brightMaterial)
    scene.add(normalParticles)
    scene.add(brightParticles)

    // --- INTERACTIVITY: SCROLL PARALLAX ONLY ---
    const scrollState = { y: 0 }

    const onScroll = () => {
      gsap.to(scrollState, {
        y: window.scrollY,
        duration: 1.2,
        overwrite: 'auto',
      })
    }

    window.addEventListener('scroll', onScroll)

    // --- RESPONSIVE RESIZE ---
    const onWindowResize = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }

    window.addEventListener('resize', onWindowResize)

    // --- ANIMATION LOOP ---
    let animationFrameId

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)

      // Position camera based purely on scroll offset
      const currentScroll = scrollState.y
      const camY = -(currentScroll * 0.006)
      camera.position.y = camY
      camera.lookAt(0, camY, 0)

      renderer.render(scene, camera)
    }

    animate()

    // --- CLEANUP ---
    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onWindowResize)

      renderer.dispose()

      normalGeometry.dispose()
      brightGeometry.dispose()
      normalMaterial.dispose()
      brightMaterial.dispose()
      pTexture.dispose()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-screen z-[1] pointer-events-none block"
    />
  )
}
