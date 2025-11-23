
import React, { useEffect, useRef } from 'react';
import { SectionId } from '../types';

interface HeaderProps {
    activeSection: SectionId;
    onMobileMenuClick: () => void;
    resumeBtnPlaceholderRef: React.RefObject<HTMLAnchorElement>;
}

const navItems: { href: string; label: string }[] = [
    { href: '#about', label: 'About' },
    { href: '#skills', label: 'Skills' },
    { href: '#work-experience', label: 'Experience' },
    { href: '#projects', label: 'Projects' },
    { href: '#contact', label: 'Contact Me' },
];

const Header: React.FC<HeaderProps> = ({ activeSection, onMobileMenuClick, resumeBtnPlaceholderRef }) => {
    const headerRef = useRef<HTMLElement>(null);
    const navMenuRef = useRef<HTMLDivElement>(null);
    const indicatorRef = useRef<HTMLSpanElement>(null);
    const navLinksRef = useRef<(HTMLAnchorElement | null)[]>([]);

    useEffect(() => {
        const handleScroll = () => {
            if (headerRef.current) {
                headerRef.current.classList.toggle('header-scrolled', window.scrollY > 50);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const activeLinkIndex = navItems.findIndex(item => item.href === `#${activeSection}`);
        const activeLinkElement = navLinksRef.current[activeLinkIndex] || navLinksRef.current[0];

        if (activeLinkElement && indicatorRef.current) {
            indicatorRef.current.style.width = `${activeLinkElement.offsetWidth}px`;
            indicatorRef.current.style.left = `${activeLinkElement.offsetLeft}px`;
            
            navLinksRef.current.forEach(link => link?.classList.remove('text-sky-300'));
            activeLinkElement.classList.add('text-sky-300');
        }
    }, [activeSection]);


    const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (indicatorRef.current) {
            indicatorRef.current.style.width = `${e.currentTarget.offsetWidth}px`;
            indicatorRef.current.style.left = `${e.currentTarget.offsetLeft}px`;
        }
    };
    
    const handleMouseLeave = () => {
        const activeLinkIndex = navItems.findIndex(item => item.href === `#${activeSection}`);
        const activeLinkElement = navLinksRef.current[activeLinkIndex] || navLinksRef.current[0];
         if (activeLinkElement && indicatorRef.current) {
            indicatorRef.current.style.width = `${activeLinkElement.offsetWidth}px`;
            indicatorRef.current.style.left = `${activeLinkElement.offsetLeft}px`;
        }
    };


    return (
        <header id="header" ref={headerRef} className="header py-4 px-8">
            <nav className="container mx-auto flex justify-center items-center gap-16">
                <a href="#hero" className="absolute left-8 text-2xl font-bold tracking-wider">SB</a>
                <div 
                    id="nav-menu"
                    ref={navMenuRef} 
                    className="hidden md:flex relative gap-8 font-medium"
                    onMouseLeave={handleMouseLeave}
                >
                    {navItems.map((item, index) => {
                        const isAbout = item.href === '#about';
                        const href = isAbout ? '#/about' : item.href;
                        return (
                        <a 
                            key={item.href}
                            href={href}
                            // FIX: The ref callback function should not return a value. Using a block body to ensure it returns void.
                            ref={el => { navLinksRef.current[index] = el; }}
                            onMouseEnter={handleMouseEnter}
                            className="nav-link hover:text-sky-300 transition-colors"
                        >
                            {item.label}
                        </a>
                        );
                    })}
                    <span id="nav-indicator" ref={indicatorRef} className="nav-indicator"></span>
                </div>
                <div className="hidden md:flex absolute right-8 items-center gap-4">
                     <a ref={resumeBtnPlaceholderRef} href="#" className="shiny-cta font-semibold" style={{ padding: '0.5rem 1rem', visibility: 'hidden' }}>
                        <span>
                            <i className="ph ph-download-simple text-lg"></i>
                             Download Resume
                        </span>
                    </a>
                    <a href="#contact" id="hire-me-btn" className="bg-white/10 hover:bg-white/20 transition-colors text-white font-semibold py-2 px-6 rounded-full">
                        Hire Me
                    </a>
                </div>
                <button id="mobile-menu-btn" className="md:hidden text-2xl" onClick={onMobileMenuClick}><i className="ph ph-list"></i></button>
            </nav>
        </header>
    );
};

export default Header;