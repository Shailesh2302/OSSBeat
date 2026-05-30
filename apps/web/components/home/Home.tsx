"use client";

import React from "react";
import PageTransition from "@/components/animations/PageTransition";
import { HeroSection } from "./HeroSection";
import StatsBar from "./StatsBar";
import Features from "./Features";
import Demo from "./Demo";
import OpenSourceSection from "./OpenSourceSection";
import Testimonials from "./Testimonials";
import FAQ from "./FAQ";
import About from "./navbar/About";
import Contact from "./navbar/Contact";
import Newsletter from "./Newsletter";
import Footer from "./Footer";

const Home = () => {
  return (
    <PageTransition>
      <div className="h-full">
        <HeroSection />
        <StatsBar />
        <Features />
        <Demo />
        <OpenSourceSection />
        <Testimonials />
        <FAQ />
        <About />
        <Contact />
        <Newsletter />
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Home;
