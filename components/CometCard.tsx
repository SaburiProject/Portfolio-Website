
import React, { useRef, useEffect } from 'react';

const CometCard: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const motionRef = useRef<HTMLDivElement>(null);
    const glareRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        const motion = motionRef.current;
        const glare = glareRef.current;
        if (!container || !motion || !glare) return;

        const rotateDepth = 17.5;
        const translateDepth = 20;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            const xPct = mouseX / rect.width - 0.5;
            const yPct = mouseY / rect.height - 0.5;

            const rotateX = yPct * -rotateDepth;
            const rotateY = xPct * rotateDepth;
            const translateX = xPct * translateDepth;
            const translateY = yPct * -translateDepth;
            const glareX = xPct * 50 + 50;
            const glareY = yPct * 50 + 50;
            
            motion.style.transition = 'transform 0.1s linear, box-shadow 0.1s linear';
            motion.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateX(${translateX}px) translateY(${translateY}px) scale(1.05) translateZ(50px)`;
            motion.style.boxShadow = "rgba(0, 0, 0, 0.01) 0px 520px 146px 0px, rgba(0, 0, 0, 0.04) 0px 333px 133px 0px, rgba(0, 0, 0, 0.26) 0px 83px 83px 0px, rgba(0, 0, 0, 0.29) 0px 21px 46px 0px";
            glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.9) 10%, rgba(255, 255, 255, 0.75) 20%, rgba(255, 255, 255, 0) 80%)`;
        };

        const handleMouseLeave = () => {
            motion.style.transition = 'transform 0.5s ease-out, box-shadow 0.5s ease-out';
            motion.style.transform = 'rotateX(0deg) rotateY(0deg) translateX(0px) translateY(0px) scale(1) translateZ(0px)';
            motion.style.boxShadow = "none";
            glare.style.background = 'none';
        };

        container.addEventListener('mousemove', handleMouseMove);
        container.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            container.removeEventListener('mousemove', handleMouseMove);
            container.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <div id="comet-card-container" ref={containerRef} className="perspective-distant transform-3d">
            <div id="comet-card-motion" ref={motionRef} className="relative rounded-2xl">
                <div className="w-80 cursor-pointer flex-col items-stretch rounded-[14px] p-2 saturate-0 md:p-4 relative z-10">
                    <div className="mx-2 flex-1">
                        <div className="relative mt-2 aspect-[3/4] w-full">
                            <img
                                loading="lazy"
                                className="absolute inset-0 h-full w-full rounded-[16px] object-cover"
                                alt="Your Headshot"
                                src="/assets/about-photo.png"
                            />
                        </div>
                    </div>
                    <div className="mt-4 flex flex-shrink-0 items-center justify-center space-x-6 p-4">
                        <a href="https://github.com/SaburiProject" target="_blank" rel="noopener noreferrer" className="text-3xl text-slate-400 hover:text-sky-300 transition-all hover:scale-110"><i className="ph ph-github-logo"></i></a>
                        <a href="https://www.linkedin.com/in/saburirane" target="_blank" rel="noopener noreferrer" className="text-3xl text-slate-400 hover:text-sky-300 transition-all hover:scale-110"><i className="ph ph-linkedin-logo"></i></a>
                        <a href="https://wa.me/917972758287?text=Hello%20Saburi,%20I%20would%20like%20to%20contact%20you%20about%20your%20service" target="_blank" rel="noopener noreferrer" className="text-3xl text-slate-400 hover:text-sky-300 transition-all hover:scale-110"><i className="ph ph-whatsapp-logo"></i></a>
                    </div>
                </div>
                <div id="comet-glare" ref={glareRef} className="pointer-events-none absolute inset-0 z-50 h-full w-full rounded-[16px] mix-blend-overlay" style={{ opacity: 0.6 }}></div>
            </div>
        </div>
    );
};

export default CometCard;
