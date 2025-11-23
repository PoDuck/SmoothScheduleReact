

import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { GoogleGenAI, Type } from "@google/genai";
import { Business, WebsiteTemplate } from '../../types';
import { TEMPLATES, SERVICES } from '../../mockData';
import { Wand2, Sparkles, AlertTriangle, CheckCircle2 } from 'lucide-react';
import GeminiIcon from '../../components/GeminiIcon';

const SetupWizard: React.FC = () => {
  const { business, updateBusiness } = useOutletContext<{ business: Business; updateBusiness: (updates: Partial<Business>) => void }>();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [businessDescription, setBusinessDescription] = useState(
    `We are an auto repair shop named '${business.name}'. We specialize in providing top-notch vehicle maintenance and repair. Our key services are oil changes, brake repairs, and engine diagnostics. We are known for our honest, reliable, and quick service.`
  );
  const [generatedTemplates, setGeneratedTemplates] = useState<WebsiteTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateTemplates = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (!process.env.API_KEY) throw new Error("API_KEY environment variable not set.");
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const responseSchema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                id: { type: Type.STRING, description: "A unique ID for the template, e.g., 'template-modern-1'."},
                name: { type: Type.STRING, description: "A creative name for the template, e.g., 'Modern Mechanic'."},
                description: { type: Type.STRING, description: "A short, one-sentence description of the template's style."},
                html: { type: Type.STRING, description: "The complete HTML structure for the homepage. Use {{placeholder_name}} syntax for content that the user can edit later. Include placeholders for a hero title, subtitle, an image, an about section, and featured services."},
                css: { type: Type.STRING, description: "The complete CSS for the template. It should be modern, professional, and responsive. Use CSS variables for colors based on the business's primaryColor." },
                screenshots: {
                    type: Type.OBJECT,
                    properties: {
                        desktop: { type: Type.STRING, description: "A placeholder image URL from unsplash.com for the desktop preview. e.g., https://images.unsplash.com/photo-1553854315-1a8b13d54c0c?q=80&w=1200" },
                        mobile: { type: Type.STRING, description: "A placeholder image URL from unsplash.com for the mobile preview. e.g., https://images.unsplash.com/photo-1605885286241-38c6444c1635?q=80&w=600" }
                    }
                }
            }
        }
      };

      const prompt = `You are an expert web developer creating 3 distinct website templates for a business.
      Business Description: "${businessDescription}"
      Business Primary Color: ${business.primaryColor}
      Available Services: ${JSON.stringify(SERVICES.map(s => s.name))}

      Instructions:
      1.  Generate THREE unique, professional, and visually appealing homepage templates.
      2.  Each template must have its own HTML structure and CSS. The CSS MUST be responsive.
      3.  The HTML must use {{placeholder_name}} syntax for editable content (e.g., {{hero_title}}, {{about_us_paragraph}}, {{service_1_title}}).
      4.  The CSS must use a CSS variable var(--primary-color) which will be replaced with ${business.primaryColor}.
      5.  Also generate initial text content for the placeholders and include it directly in the HTML.
      6.  Return a JSON array of 3 template objects conforming strictly to the schema. Do not include any other text.
      `;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: "application/json", responseSchema: responseSchema },
      });

      const templates = JSON.parse(response.text) as WebsiteTemplate[];
      setGeneratedTemplates(templates);
      TEMPLATES.push(...templates); // Store templates globally (in-memory for this demo)
      setStep(2);

    } catch (e) {
      console.error("AI generation failed:", e);
      setError(e instanceof Error ? e.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFinishSetup = () => {
    if (!selectedTemplateId) return;
    const selectedTemplate = generatedTemplates.find(t => t.id === selectedTemplateId);
    if (!selectedTemplate) return;

    // Extract initial content from the template's HTML placeholders
    const initialContent: Record<string, string> = {};
    // FIX: Explicitly type the matches array to avoid type inference issues
    const placeholders: string[] = selectedTemplate.html.match(/\{\{\s*([^}]+)\s*\}\}/g) || [];
    placeholders.forEach(p => {
        const key = p.replace(/[{}]/g, '').trim();
        // This is a simplification; a real implementation might parse default values
        initialContent[key] = `Edit this: ${key.replace(/_/g, ' ')}`;
    });
    
    updateBusiness({
        initialSetupComplete: true,
        activeTemplateId: selectedTemplateId,
        websiteContent: initialContent,
    });
    navigate('/settings/website-editor');
  };

  return (
    <div className="bg-white dark:bg-gray-800 min-h-full flex flex-col items-center p-8 transition-colors">
        {step === 1 && (
             <div className="max-w-2xl w-full text-center animate-in fade-in">
                <Wand2 className="mx-auto text-brand-500" size={40}/>
                <h1 className="text-3xl font-bold mt-4">AI-Powered Website Setup</h1>
                <p className="text-gray-500 mt-2">Describe your business, and let Gemini generate unique website templates for you.</p>
                <div className="mt-8 text-left">
                    <label htmlFor="businessDescription" className="block text-sm font-medium text-gray-700 mb-2">Business Description:</label>
                    <textarea id="businessDescription" value={businessDescription} onChange={(e) => setBusinessDescription(e.target.value)} rows={5} className="w-full p-2 border rounded-lg focus:ring-brand-500" disabled={isLoading}/>
                </div>
                {error && <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg"><AlertTriangle className="inline mr-2"/>{error}</div>}
                <div className="mt-8">
                    <button onClick={handleGenerateTemplates} disabled={isLoading} className="w-full max-w-sm py-3 px-6 bg-brand-600 text-white font-semibold rounded-lg hover:bg-brand-700 disabled:bg-opacity-50 flex items-center justify-center gap-3">
                        {isLoading ? <><GeminiIcon className="w-6 h-6" /> Generating Templates...</> : <><Sparkles size={18} /> Generate Templates</>}
                    </button>
                </div>
            </div>
        )}
        {step === 2 && (
            <div className="w-full animate-in fade-in">
                <div className="text-center mb-8">
                    <CheckCircle2 className="mx-auto text-green-500" size={40}/>
                    <h1 className="text-3xl font-bold mt-4">Choose Your Template</h1>
                    <p className="text-gray-500 mt-2">Select a starting point for your new website.</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {generatedTemplates.map(template => (
                        <div key={template.id} onClick={() => setSelectedTemplateId(template.id)} className={`rounded-xl border-4 transition-all cursor-pointer group ${selectedTemplateId === template.id ? 'border-brand-500 shadow-2xl' : 'border-gray-200 hover:border-brand-300'}`}>
                           <div className="p-4 bg-gray-50">
                             <h3 className="font-bold">{template.name}</h3>
                             <p className="text-xs text-gray-500">{template.description}</p>
                           </div>
                           <div className="bg-gray-200 aspect-[4/3] overflow-hidden">
                            <img src={template.screenshots.desktop} alt={template.name} className="w-full h-full object-cover object-top transition-transform group-hover:scale-105" />
                           </div>
                        </div>
                    ))}
                </div>
                <div className="mt-8 text-center">
                    <button onClick={handleFinishSetup} disabled={!selectedTemplateId} className="py-3 px-8 bg-brand-600 text-white font-semibold rounded-lg hover:bg-brand-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
                        Finish & Edit Content
                    </button>
                </div>
            </div>
        )}
    </div>
  );
};

export default SetupWizard;
