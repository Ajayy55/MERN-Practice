import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/Navbar/Navbar'
import HeroArea from './components/Hero/HeroArea'
import Features from './components/Features/Features'
import Overview from './components/Overview/Overview'
import Pricing from './components/Pricing/Pricing'

function App() {
  const [count, setCount] = useState(0)

  return (
   <>
   <Navbar/>
   <HeroArea/>
   <Features/>
   <Overview/>
   <Pricing/>
   </>
  )
}

export default App
