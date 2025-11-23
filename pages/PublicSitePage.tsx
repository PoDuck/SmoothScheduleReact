
import React, { useEffect } from 'react';
import { Business } from '../types';
import { TEMPLATES } from '../mockData'; // In a real app, this would be fetched

interface PublicSitePageProps {
  business: Business;
  path: string; // The path is less relevant now as we render the whole template
}

const PublicSitePage: React.FC<PublicSitePageProps> = ({ business, path }) => {
  const activeTemplate = TEMPLATES.find(t => t.id === business.activeTemplateId);

  useEffect(() => {
    if (!activeTemplate) return;
    
    // Dynamically add the template's CSS to the head
    const styleElement = document.createElement('style');
    styleElement.id = `template-style-${activeTemplate.id}`;
    styleElement.innerHTML = activeTemplate.css;
    document.head.appendChild(styleElement);
    
    let scriptElement: HTMLScriptElement | null = null;
    if (activeTemplate.js) {
        scriptElement = document.createElement('script');
        scriptElement.id = `template-script-${activeTemplate.id}`;
        scriptElement.innerHTML = activeTemplate.js;
        document.body.appendChild(scriptElement);
    }

    return () => {
      // Cleanup on component unmount
      const existingStyle = document.getElementById(styleElement.id);
      if (existingStyle) document.head.removeChild(existingStyle);
      
      if (scriptElement) {
        const existingScript = document.getElementById(scriptElement.id);
        if (existingScript) document.body.removeChild(existingScript);
      }
    };
  }, [activeTemplate]);

  if (!activeTemplate || !business.websiteContent) {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-2xl font-bold text-gray-700">This site has not been configured yet.</h1>
            <p className="text-gray-500 mt-2">The business owner needs to complete the setup wizard.</p>
        </div>
    );
  }

  // Perform template replacement
  let renderedHtml = activeTemplate.html;
  for (const [key, value] of Object.entries(business.websiteContent)) {
    const placeholder = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
    renderedHtml = renderedHtml.replace(placeholder, value);
  }
  
  // Replace any leftover placeholders with empty strings
  renderedHtml = renderedHtml.replace(/\{\{\s*[^}]+\s*\}\}/g, '');

  return (
    <div dangerouslySetInnerHTML={{ __html: renderedHtml }} />
  );
};

export default PublicSitePage;