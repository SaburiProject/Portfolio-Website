
import React, { forwardRef } from 'react';

interface ShinyButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    children: React.ReactNode;
}

const ShinyButton = forwardRef<HTMLAnchorElement, ShinyButtonProps>(({ children, ...props }, ref) => {
    return (
        <a ref={ref} {...props} className={`shiny-cta ${props.className || ''}`}>
            <span>
                {children}
            </span>
        </a>
    );
});

export default ShinyButton;
