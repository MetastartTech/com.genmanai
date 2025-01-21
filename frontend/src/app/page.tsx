/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
"use client";
import Header from "@/components/common/header";
import DetailSection from "@/components/landing/detail-section";
import FeaturesSection from "@/components/landing/features-section";
import Footer from "@/components/landing/footer";
import HeroSection from "@/components/landing/hero-section";
import HowItWorksSection from "@/components/landing/howitworks-section";
import PricingSection from "@/components/landing/pricing-section";
import StepsSection from "@/components/landing/steps-section";
import TryItOut from "@/components/landing/try-it-out";
import UserTestimonials from "@/components/landing/user-testimonials";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark");
  }, []);

  return (
    <div>
      <Header />
      <HeroSection />
      {/* <BrandTestimonials /> */}
      <DetailSection />
      <FeaturesSection />
      <HowItWorksSection />
      <StepsSection />
      <TryItOut />
      <UserTestimonials />
      <PricingSection />
      <Footer />
    </div>
  );
}
