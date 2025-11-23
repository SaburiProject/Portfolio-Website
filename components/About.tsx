
import React, { useState } from 'react';
import CometCard from './CometCard';

const About: React.FC = () => {
    const [showMore, setShowMore] = useState(false);

    return (
        <section id="about" className="py-24 px-8">
            <div className="container mx-auto grid md:grid-cols-2 gap-16 items-center">
                <div className="animate-on-scroll slide-in-left flex justify-center items-center">
                    <CometCard />
                </div>
                <div className="animate-on-scroll slide-in-right text-center md:text-left">
                    <div id="about-text-container">
                        <h2 className="text-4xl font-bold mb-4">Professional Summary</h2>
                        <p id="about-paragraph" className="text-lg text-slate-300 mb-4">
                            As an AI Engineer and Machine Learning Specialist, I bring a unique blend of theoretical knowledge and practical experience in developing intelligent systems. My expertise spans across Large Language Models (LLMs), Retrieval-Augmented Generation (RAG) systems, and scalable machine learning architectures.
                        </p>
                        <div id="more-summary" className={`transition-all duration-500 ease-in-out overflow-hidden ${showMore ? 'max-h-screen' : 'max-h-0'}`}>
                             <p className="text-lg text-slate-300 mb-4">
                                I specialize in fine-tuning state-of-the-art models like Meta's Llama, implementing efficient training techniques such as LoRA and quantization, and building robust AI-powered applications. My work focuses on bridging the gap between cutting-edge research and practical, production-ready solutions.
                            </p>
                             <p className="text-lg text-slate-300 mb-8">
                                With a strong foundation in cloud computing, particularly AWS and GCP, and extensive experience with frameworks like TensorFlow, PyTorch, and LangChain, I'm passionate about creating AI solutions that make a real impact on businesses and users alike.
                            </p>
                        </div>
                        <button id="show-more-btn" onClick={() => setShowMore(!showMore)} className="font-semibold text-sky-300 hover:text-sky-200 transition-colors">
                            {showMore ? 'Show Less' : 'Show More...'}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
