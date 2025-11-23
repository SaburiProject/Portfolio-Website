// FIX: Import React to make its types available, and use React.JSX namespace for intrinsic elements to match modern JSX transform.
import React from 'react';

// This allows TypeScript to recognize the <spline-viewer> custom element
declare global {
  namespace React.JSX {
    interface IntrinsicElements {
      'spline-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { 
        url: string;
        // Add other Spline Viewer props here if needed
      };
    }
  }
}

export type SectionId = 'hero' | 'about' | 'work-experience' | 'projects' | 'contact';