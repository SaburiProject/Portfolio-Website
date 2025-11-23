
import React from 'react';

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div id="mobile-menu" className="fixed inset-0 bg-black/80 backdrop-blur-lg z-[60] flex flex-col items-center justify-center">
            <button id="mobile-menu-close-btn" className="absolute top-8 right-8 text-3xl text-white" onClick={onClose}>
                <i className="ph ph-x"></i>
            </button>
            <a href="#about" onClick={onClose} className="mobile-nav-link text-3xl font-bold my-4 text-white">About</a>
            <a href="#work-experience" onClick={onClose} className="mobile-nav-link text-3xl font-bold my-4 text-white">Experience</a>
            <a href="#projects" onClick={onClose} className="mobile-nav-link text-3xl font-bold my-4 text-white">Projects</a>
            <a href="#contact" onClick={onClose} className="mobile-nav-link text-3xl font-bold my-4 text-white glowing-button py-3 px-8 rounded-full">Hire Me</a>
        </div>
    );
};

export default MobileMenu;
