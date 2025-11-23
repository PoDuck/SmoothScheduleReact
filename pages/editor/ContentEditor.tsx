

import React, { useState, useMemo, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { Business, WebsiteContent } from '../../types';
import { TEMPLATES } from '../../mockData';
import { Save, ChevronLeft, Image as ImageIcon, Type, Link as LinkIcon } from 'lucide-react';

const ContentEditor: React.FC = () => {
  const { business, updateBusiness } = useOutletContext<{ business: Business; updateBusiness: (updates: Partial<Business>) => void }>();
  
  const activeTemplate = useMemo(() => TEMPLATES.find(t => t.id === business.activeTemplateId), [business.activeTemplateId]);
  const [content, setContent] = useState<WebsiteContent>(business.websiteContent || {});

  const placeholders = useMemo(() => {
    if (!activeTemplate) return [];
    const found = activeTemplate.html.match(/\{\{\s*([^}]+)\s*\}\}/g) || [];
    // Deduplicate and clean up
    return [...new Set(found)].map((p: string) => p.replace(/[{}]/g, '').trim());
  }, [activeTemplate]);

  useEffect(() => {
    // Initialize content state with placeholders if they don't exist
    const initialContent = { ...business.websiteContent };
    let hasChanged = false;
    placeholders.forEach(p => {
        if (!(p in initialContent)) {
            initialContent[p] = '';
            hasChanged = true;
        }
    });
    if (hasChanged) {
        setContent(initialContent);
    }
  }, [placeholders, business.websiteContent]);

  const handleContentChange = (key: string, value: string) => {
    setContent(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    updateBusiness({ websiteContent: content });
    alert('Content saved successfully!');
  };

  const getInputType = (placeholder: string) => {
      if (placeholder.toLowerCase().includes('image') || placeholder.toLowerCase().includes('logo')) {
          return { type: 'url', icon: ImageIcon, as: 'input' };
      }
      if (placeholder.toLowerCase().includes('href') || placeholder.toLowerCase().includes('link')) {
          return { type: 'url', icon: LinkIcon, as: 'input' };
      }
      if (placeholder.toLowerCase().includes('paragraph') || placeholder.toLowerCase().includes('description')) {
          return { type: 'text', icon: Type, as: 'textarea' };
      }
      return { type: 'text', icon: Type, as: 'input' };
  }

  if (!activeTemplate) {
    return <div>No active template selected. Please complete the setup wizard.</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link to="/settings" className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand-600 mb-2"><ChevronLeft size={16}/> Back to Settings</Link>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Website Content Editor</h2>
          <p className="text-gray-500 dark:text-gray-400">Editing content for the '{activeTemplate.name}' template.</p>
        </div>
        <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors shadow-sm font-medium"
        >
          <Save size={18} />
          Save Content
        </button>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
        {placeholders.map(placeholder => {
            const { type, icon: Icon, as } = getInputType(placeholder);
            const InputComponent = as as React.ElementType;
            return (
                <div key={placeholder}>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 capitalize">
                        <Icon size={14} className="text-gray-400" />
                        {placeholder.replace(/_/g, ' ')}
                    </label>
                    <InputComponent
                        type={type}
                        value={content[placeholder] || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => handleContentChange(placeholder, e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                        rows={as === 'textarea' ? 4 : undefined}
                    />
                </div>
            )
        })}
      </div>
    </div>
  );
};

export default ContentEditor;