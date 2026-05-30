"use client";

import React from "react";
import PageTransition from "@/components/animations/PageTransition";
import { HeroSection } from "./HeroSection";
import Features from "./Features";
import Demo from "./Demo";
import Testimonials from "./Testimonials";
import FAQ from "./FAQ";
import About from "./navbar/About";
import Contact from "./navbar/Contact";
import Footer from "./Footer";

const Home = () => {
  return (
    <PageTransition>
      <div className="h-full">
        <HeroSection />
        <Features />
        <Demo />
        <Testimonials />
        <FAQ />
        <About />
        <Contact />
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Home;
