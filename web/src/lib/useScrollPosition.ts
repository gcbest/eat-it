import { useRef, useLayoutEffect } from 'react'

const isBrowser = typeof window !== `undefined`


function getScrollPosition({ element, useWindow }: any) {
  if (!isBrowser) return { x: 0, y: 0 }

  const target = element ? element.current : document.body
  const position = target.getBoundingClientRect()

  return useWindow
    ? { x: window.scrollX, y: window.scrollY }
    : { x: position.left, y: position.top }
}

export function useScrollPosition(effect: any, deps?: any, element?: any, useWindow: any = true, wait?: any) {
  const position = useRef(getScrollPosition({ useWindow }))

  const callBack = (throttleTimeout: any) => {
    const currPos = getScrollPosition({ element, useWindow })
    effect({ prevPos: position.current, currPos })
    position.current = currPos
    throttleTimeout = null
  }

  useLayoutEffect(() => {
  let throttleTimeout: any = null

    const handleScroll = () => {
      if (wait) {
        if (throttleTimeout === null) {
          throttleTimeout = setTimeout(callBack, wait)
        }
      } else {
        callBack(throttleTimeout)
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  })
}