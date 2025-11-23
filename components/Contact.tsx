
import React, { useState } from 'react';

const Contact: React.FC = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notice, setNotice] = useState<{ type: 'success' | 'error' | null, message: string | null }>({ type: null, message: null });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setNotice({ type: null, message: null });

        const formData = new FormData(e.currentTarget);

        // Backend expects JSON payload
        const payload = {
            Name: formData.get('Name'),
            Email: formData.get('Email'),
            Message: formData.get('Message')
        };

        // Google Apps Script Web App URL
        const scriptUrl = 'https://script.google.com/macros/s/AKfycbz5yW6BoNPLVYVHNW4Bx0z8GLvqiSalq9o8paHzaDlrSCiJmyvie_hQh-SKuK5qqEc/exec';

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

            // Google Apps Script usually requires 'no-cors' for client-side fetch
            // We send as text/plain to avoid preflight, but body is JSON
            await fetch(scriptUrl, {
                method: 'POST',
                body: JSON.stringify(payload),
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8',
                },
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            // Assume success if no network error occurred
            setNotice({ type: 'success', message: 'Thank you — your message has been sent!' });
            (e.currentTarget as HTMLFormElement).reset();
        } catch (err: any) {
            console.error('Form submit error:', err);
            if (err.name === 'AbortError') {
                setNotice({ type: 'error', message: 'Request timed out. Please try again.' });
            } else {
                setNotice({ type: 'error', message: 'Something went wrong. Please try again later.' });
            }
        } finally {
            setIsSubmitting(false);
            // Hide notice after 5 seconds
            setTimeout(() => setNotice({ type: null, message: null }), 5000);
        }
    };

    return (
        <section id="contact" className="py-24 px-8">
            <div className="container mx-auto grid md:grid-cols-2 gap-16 items-center">
                <div className="animate-on-scroll fade-in text-center md:text-left">
                    <h2 className="text-4xl font-bold mb-4">Let's Connect</h2>
                    <p className="text-lg text-slate-300 mb-8">Have a project in mind or a role to fill? I'm always open to new opportunities. Let's build the future together.</p>
                    <div className="flex justify-center md:justify-start space-x-6">
                        <a href="https://github.com/SaburiProject" target="_blank" rel="noopener noreferrer" className="text-4xl text-slate-400 hover:text-sky-300 transition-all hover:scale-110"><i className="ph ph-github-logo"></i></a>
                        <a href="https://www.linkedin.com/in/saburirane" target="_blank" rel="noopener noreferrer" className="text-4xl text-slate-400 hover:text-sky-300 transition-all hover:scale-110"><i className="ph ph-linkedin-logo"></i></a>
                        <a href="https://wa.me/917972758287?text=Hello%20Saburi,%20I%20would%20like%20to%20contact%20you%20about%20your%20service" target="_blank" rel="noopener noreferrer" className="text-4xl text-slate-400 hover:text-sky-300 transition-all hover:scale-110"><i className="ph ph-whatsapp-logo"></i></a>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6 glass-card p-8 rounded-2xl animate-on-scroll fade-in" style={{ transitionDelay: '200ms' }}>
                    {notice.message && (
                        <div className={`p-3 rounded-md text-sm font-medium ${notice.type === 'success' ? 'bg-green-600/20 text-green-300 border border-green-700' : 'bg-red-600/20 text-red-300 border border-red-700'}`}>
                            {notice.message}
                        </div>
                    )}
                    <input
                        type="text"
                        name="Name"
                        placeholder="Your Name"
                        required
                        minLength={2}
                        className="w-full bg-white/5 p-3 rounded-md border border-white/10 focus:outline-none focus:ring-2 focus:ring-sky-300/50 transition-shadow"
                    />
                    <input
                        type="email"
                        name="Email"
                        placeholder="Your Email"
                        required
                        pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
                        className="w-full bg-white/5 p-3 rounded-md border border-white/10 focus:outline-none focus:ring-2 focus:ring-sky-300/50 transition-shadow"
                    />
                    <textarea
                        placeholder="Your Message"
                        name="Message"
                        rows={4}
                        required
                        minLength={10}
                        className="w-full bg-white/5 p-3 rounded-md border border-white/10 focus:outline-none focus:ring-2 focus:ring-sky-300/50 transition-shadow"
                    ></textarea>
                    <button type="submit" disabled={isSubmitting} className={`w-full glowing-button font-semibold text-white py-3 px-8 rounded-full active:scale-95 ${isSubmitting ? 'animate-pulse' : ''}`}>
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                </form>
            </div>
        </section>
    );
};

export default Contact;
