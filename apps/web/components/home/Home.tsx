import React from 'react'
import { HeroSection } from './HeroSection'
import About from './navbar/About'
import Contact from './navbar/Contact'

const Home = () => {
  return (
<div className="h-full">
      <HeroSection />
       <About/>
          <Contact/>
    </div>
  )
}

export default Home