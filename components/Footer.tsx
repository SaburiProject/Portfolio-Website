
import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="relative w-full max-w-6xl mx-auto flex flex-col items-center justify-center rounded-t-4xl border-t border-white/10 px-6 py-12 lg:py-16 mt-24">
            <div className="grid w-full gap-8 xl:grid-cols-3 xl:gap-8">
                <div className="space-y-4 animate-on-scroll fade-in">
                    <h2 className="text-2xl font-bold tracking-wider">SB</h2>
                    <p className="text-slate-400 text-sm md:mt-0">
                        © 2025 Saburi Rane. All rights reserved.
                    </p>
                </div>

                <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-3 xl:col-span-2 xl:mt-0">
                    <div className="animate-on-scroll fade-in" style={{ transitionDelay: '100ms' }}>
                        <h3 className="text-sm font-semibold">Navigation</h3>
                        <ul className="text-slate-400 mt-4 space-y-2 text-sm">
                            <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
                            <li><a href="#work-experience" className="hover:text-white transition-colors">Experience</a></li>
                            <li><a href="#projects" className="hover:text-white transition-colors">Projects</a></li>
                        </ul>
                    </div>
                     <div className="animate-on-scroll fade-in" style={{ transitionDelay: '200ms' }}>
                        <h3 className="text-sm font-semibold">Resources</h3>
                        <ul className="text-slate-400 mt-4 space-y-2 text-sm">
                            <li><a href="#" className="hover:text-white transition-colors">Blog (Coming Soon)</a></li>
                            <li><a href="https://docs.google.com/document/d/1gNKYQAhwA90B9LLiYb6Sl-vB2zLs0rtC/edit?usp=sharing&ouid=116354631516096491724&rtpof=true&sd=true" target="_blank" className="hover:text-white transition-colors">Case Studies</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                        </ul>
                    </div>
                    <div className="animate-on-scroll fade-in" style={{ transitionDelay: '300ms' }}>
                        <h3 className="text-sm font-semibold">Social Links</h3>
                        <ul className="text-slate-400 mt-4 space-y-2 text-sm">
                            <li><a href="https://github.com/SaburiProject" target="_blank" rel="noopener noreferrer" className="hover:text-white inline-flex items-center gap-2 transition-colors"><i className="ph-fill ph-github-logo"></i> Github</a></li>
                            <li><a href="https://www.linkedin.com/in/saburirane" target="_blank" rel="noopener noreferrer" className="hover:text-white inline-flex items-center gap-2 transition-colors"><i className="ph-fill ph-linkedin-logo"></i> LinkedIn</a></li>
                            <li><a href="https://wa.me/917972758287?text=Hello%20Saburi,%20I%20would%20like%20to%20contact%20you%20about%20your%20service" target="_blank" rel="noopener noreferrer" className="hover:text-white inline-flex items-center gap-2 transition-colors"><i className="ph-fill ph-whatsapp-logo"></i> WhatsApp</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
