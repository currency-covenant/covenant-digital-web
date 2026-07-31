'use client'

import { useEffect, useRef, useState } from "react"

const INTERACTIVE_SELECTORS = [
  'a',
  'button',
  'input',
  'textarea',
  'select',
  '[role="button"]',
  '[role="link"]',
  '[data-cursor-hover]',
]

export function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  const innerDot = useRef({ x: 0, y: 0 })
  const outerRing = useRef({ x: 0, y: 0 })

  const innerRef = useRef<HTMLDivElement>(null)
  const outerRef = useRef<HTMLDivElement>(null)
  const rafId = useRef<number | null>(null)

  useEffect(() => {
    // Disable on touch devices
    const hasTouch = window.matchMedia("(pointer: coarse)").matches
    if (hasTouch) {
      setIsTouchDevice(true)
      return
    }

    const handleMouseMove = (e: MouseEvent) => {
      innerDot.current = { x: e.clientX, y: e.clientY }
      if (!isVisible) setIsVisible(true)
    }

    const handleMouseEnter = () => setIsVisible(true)
    const handleMouseLeave = () => setIsVisible(false)

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest(INTERACTIVE_SELECTORS.join(","))) {
        setIsHovering(true)
      }
    }

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest(INTERACTIVE_SELECTORS.join(","))) {
        setIsHovering(false)
      }
    }

    const animate = () => {
      const lerp = 0.15
      outerRing.current.x += (innerDot.current.x - outerRing.current.x) * lerp
      outerRing.current.y += (innerDot.current.y - outerRing.current.y) * lerp

      if (innerRef.current) {
        innerRef.current.style.transform = `translate3d(${innerDot.current.x}px, ${innerDot.current.y}px, 0) translate(-50%, -50%)`
      }
      if (outerRef.current) {
        outerRef.current.style.transform = `translate3d(${outerRing.current.x}px, ${outerRing.current.y}px, 0) translate(-50%, -50%)`
      }

      rafId.current = requestAnimationFrame(animate)
    }

    window.addEventListener("mousemove", handleMouseMove)
    document.body.addEventListener("mouseenter", handleMouseEnter)
    document.body.addEventListener("mouseleave", handleMouseLeave)
    document.body.addEventListener("mouseover", handleMouseOver)
    document.body.addEventListener("mouseout", handleMouseOut)

    rafId.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      document.body.removeEventListener("mouseenter", handleMouseEnter)
      document.body.removeEventListener("mouseleave", handleMouseLeave)
      document.body.removeEventListener("mouseover", handleMouseOver)
      document.body.removeEventListener("mouseout", handleMouseOut)
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [isVisible])

  if (isTouchDevice) return null

  return (
    <>
      {/* Inner dot */}
      <div
        ref={innerRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] size-2 rounded-full bg-foreground mix-blend-difference"
        style={{
          opacity: isVisible ? 1 : 0,
          transition: "opacity 150ms ease",
        }}
        aria-hidden="true"
      />
      {/* Outer ring */}
      <div
        ref={outerRef}
        className="pointer-events-none fixed left-0 top-0 z-[9998] rounded-full border border-foreground mix-blend-difference transition-[width,height,border-color] duration-200 ease-out"
        style={{
          width: isHovering ? 56 : 40,
          height: isHovering ? 56 : 40,
          opacity: isVisible ? 1 : 0,
          transition: "opacity 150ms ease, width 200ms ease, height 200ms ease",
        }}
        aria-hidden="true"
      />
    </>
  )
}
