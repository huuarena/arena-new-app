import { useEffect, useState } from 'react'

export const useScreen = () => {
  const [screen, setScreen] = useState('mobile')

  useEffect(() => {
    const resizeScreen = () => {
      let root = window.document.querySelector('#app')
      let width = root ? root.offsetWidth : 0
      setScreen(width >= 600 ? 'desktop' : 'mobile')
    }
    resizeScreen()
    window.addEventListener('resize', resizeScreen)
  }, [])

  return screen
}
