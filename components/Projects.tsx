
import React from 'react';

const Projects: React.FC = () => {
    return (
        <section id="projects" className="py-24 px-8">
            <div className="container mx-auto space-y-24">
                <h2 className="text-4xl font-bold text-center mb-12 animate-on-scroll fade-in">Featured Work</h2>
                {/* Project 1 */}
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="rounded-xl overflow-hidden animate-on-scroll slide-in-left">
                        <img src="/assets/projects/ai-customer-support-widget.png" alt="AutoBlogGen UI" className="w-full h-full object-cover" />
                    </div>
                    <div className="animate-on-scroll slide-in-right">
                        <h3 className="text-3xl font-bold mb-3">AutoBlogGen: AI Blog Automation</h3>
                        <p className="text-slate-300 mb-4">A full-cycle automation system using GPT-4 and n8n to manage workflow, reducing content creation efforts by over 80%.</p>
                        <div className="flex flex-wrap gap-2 mb-6">
                            <span className="bg-white/10 text-sm py-1 px-3 rounded-full">GPT-4</span>
                            <span className="bg-white/10 text-sm py-1 px-3 rounded-full">n8n</span>
                            <span className="bg-white/10 text-sm py-1 px-3 rounded-full">Google Workspace API</span>
                        </div>
                        <a href="#" className="glowing-button font-semibold text-white py-3 px-8 rounded-full inline-block opacity-50 cursor-not-allowed">View Project</a>
                        <p className="mt-2 text-sm text-sky-300/80">Live Demo Coming Soon</p>
                    </div>
                </div>
                {/* Project 2 */}
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="animate-on-scroll slide-in-left md:order-2">
                        <img src="/assets/projects/ai-customer-support-widget.png" alt="AI Chat Widget" className="rounded-xl overflow-hidden w-full h-full object-cover" />
                    </div>
                    <div className="animate-on-scroll slide-in-right md:order-1">
                        <h3 className="text-3xl font-bold mb-3">Full-Stack AI Support Chatbot</h3>
                        <p className="text-slate-300 mb-4">An intelligent, full-stack support widget built with OpenAI and LangChain, featuring lead capture and 24/7 automated assistance.</p>
                         <div className="flex flex-wrap gap-2 mb-6">
                            <span className="bg-white/10 text-sm py-1 px-3 rounded-full">OpenAI</span>
                            <span className="bg-white/10 text-sm py-1 px-3 rounded-full">LangChain</span>
                            <span className="bg-white/10 text-sm py-1 px-3 rounded-full">Pinecone</span>
                            <span className="bg-white/10 text-sm py-1 px-3 rounded-full">FastAPI</span>
                        </div>
                        <a href="#" className="glowing-button font-semibold text-white py-3 px-8 rounded-full inline-block opacity-50 cursor-not-allowed">View Project</a>
                        <p className="mt-2 text-sm text-sky-300/80">Live Demo Coming Soon</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Projects;
