"use client";

import React from "react";
import dynamic from "next/dynamic";
import PageTransition from "@/components/animations/PageTransition";
import { HeroSection } from "./HeroSection";
import StatsBar from "./StatsBar";
import Features from "./Features";
import Demo from "./Demo";
import OpenSourceSection from "./OpenSourceSection";

const Testimonials = dynamic(() => import("./Testimonials"));
const FAQ = dynamic(() => import("./FAQ"));
const About = dynamic(() => import("./navbar/About"));
const Contact = dynamic(() => import("./navbar/Contact"));
const Newsletter = dynamic(() => import("./Newsletter"));
const Footer = dynamic(() => import("./Footer"), { ssr: true });

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
