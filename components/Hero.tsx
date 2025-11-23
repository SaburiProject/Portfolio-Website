
import React from 'react';
import '../types'; // Import to include global JSX namespace declaration

interface HeroProps {
    splineContainerRef: React.RefObject<HTMLDivElement>;
}

const Hero: React.FC<HeroProps> = ({ splineContainerRef }) => {
    return (
        <section id="hero" className="relative overflow-hidden px-8 min-h-screen flex items-center">
            <div className="container mx-auto grid md:grid-cols-2 gap-8 items-center pt-16 md:pt-0 z-10 relative">
                <div className="text-center md:text-left animate-on-scroll fade-in">
                    <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-4">
                        Generative <br />AI Developer
                    </h1>
                    <p className="text-lg text-slate-300 max-w-md mx-auto md:mx-0 mb-8">
                        AI Developer specializing in building and deploying end-to-end Generative AI solutions. Proven ability to create production-grade automation tools and full-stack AI applications using Python, LangChain, and GPT-4.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <a href="#contact" className="glowing-button font-semibold text-white py-3 px-8 rounded-full inline-block">Hire Me</a>
                        <a href="#projects" className="glowing-button-secondary font-semibold text-white py-3 px-8 rounded-full inline-block">View Projects</a>
                    </div>
                </div>
                <div id="spline-container" ref={splineContainerRef} className="relative h-[50vh] md:h-[70vh] animate-on-scroll fade-in" style={{ transitionDelay: '200ms' }}>
                    <spline-viewer url="https://prod.spline.design/UyZ6uRwwHxBuYKiY/scene.splinecode"></spline-viewer>
                </div>
            </div>
        </section>
    );
};

export default Hero;
