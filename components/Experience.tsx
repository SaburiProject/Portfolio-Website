
import React, { useEffect, useRef } from 'react';

const Experience: React.FC = () => {
    const timelineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleTimelineScroll = () => {
            if (!timelineRef.current) return;

            const timelineRect = timelineRef.current.getBoundingClientRect();
            const timelineHeight = timelineRect.height;
            const viewportHeight = window.innerHeight;

            const triggerPointY = viewportHeight / 2;
            const distanceFromTop = triggerPointY - timelineRect.top;
            let progressPercent = (distanceFromTop / timelineHeight) * 100;
            progressPercent = Math.max(0, Math.min(100, progressPercent));
            timelineRef.current.style.setProperty('--timeline-progress', `${progressPercent}%`);
        };

        window.addEventListener('scroll', handleTimelineScroll);
        window.addEventListener('resize', handleTimelineScroll);
        handleTimelineScroll(); // Initial check

        return () => {
            window.removeEventListener('scroll', handleTimelineScroll);
            window.removeEventListener('resize', handleTimelineScroll);
        };
    }, []);

    return (
        <section id="work-experience" className="py-24 px-8">
            <div className="container mx-auto">
                <h2 className="text-4xl font-bold text-center mb-16 animate-on-scroll fade-in">Career Journey</h2>
                <div className="aceternity-timeline" ref={timelineRef}>
                    {/* Timeline Item 1 */}
                    <div className="timeline-item animate-on-scroll fade-in">
                        <div className="flex gap-6 md:gap-8">
                            <div className="flex-shrink-0">
                                <p className="text-5xl font-bold text-slate-400/80 -mt-1">2025</p>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold mb-2">AI Developer @ American Hairline</h3>
                                <p className="text-sky-300/80 mb-4 text-sm">Jan 2025 - Sep 2025</p>
                                <p className="text-slate-300 mb-6 max-w-2xl">
                                   Key accomplishments in this role include architecting production-grade AI automation solutions and deploying a full-stack AI Support Chat Widget.
                                </p>
                                <ul className="text-slate-300 list-disc list-inside space-y-2 max-w-2xl">
                                    <li>Reduced content creation effort by over 80% with the AutoBlogGen system.</li>
                                    <li>Implemented advanced RAG pipelines using Pinecone & HuggingFace.</li>
                                    <li>Designed and deployed intuitive user interfaces for AI tools.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    {/* Timeline Item 2 */}
                    <div className="timeline-item animate-on-scroll fade-in">
                         <div className="flex gap-6 md:gap-8">
                            <div className="flex-shrink-0">
                                <p className="text-5xl font-bold text-slate-400/80 -mt-1">2024</p>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold mb-2">Freelance Developer</h3>
                                <p className="text-sky-300/80 mb-4 text-sm">2024 - Present</p>
                                <p className="text-slate-300 mb-6 max-w-2xl">
                                    Developed bespoke web applications and interactive experiences for various clients, focusing on creating responsive, high-performance sites using modern frameworks.
                                </p>
                                 <ul className="text-slate-300 list-disc list-inside space-y-2 max-w-2xl">
                                    <li>Managed end-to-end project lifecycle from concept to deployment.</li>
                                    <li>Specialized in creating dynamic user interfaces with React.</li>
                                    <li>Integrated various third-party APIs for enhanced functionality.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Experience;
