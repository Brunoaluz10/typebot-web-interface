"use client";

import { useState, useEffect } from 'react';
import { botAPI, TemplateItem } from '@/lib/api';
import { FileText, Calendar, TrendingUp, Loader2 } from 'lucide-react';

export default function Templates({ onTemplateUsed }: { onTemplateUsed?: () => void }) {
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingTemplate, setUsingTemplate] = useState<string | null>(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const data = await botAPI.getTemplates();
      setTemplates(data);
    } catch (error) {
      console.error('Erro ao carregar templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUseTemplate = async (templateName: string) => {
    try {
      setUsingTemplate(templateName);
      await botAPI.useTemplate(templateName);
      onTemplateUsed?.();
      alert('Bot criado com sucesso usando template!');
    } catch (error: any) {
      alert('Erro ao usar template: ' + (error.response?.data?.detail || error.message));
    } finally {
      setUsingTemplate(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-6 h-6 text-purple-600" />
        <h2 className="text-2xl font-bold text-gray-900">Templates</h2>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : templates.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>Nenhum template disponível</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 hover:shadow-md transition-all"
            >
              <h3 className="font-semibold text-gray-900 mb-2">{template.name}</h3>
              
              {template.pattern && (
                <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                  {template.pattern}
                </p>
              )}

              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>{template.success_count} usos</span>
                </div>
                {template.last_used && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>Usado recentemente</span>
                  </div>
                )}
              </div>

              <button
                onClick={() => handleUseTemplate(template.name)}
                disabled={usingTemplate === template.name}
                className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {usingTemplate === template.name ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Criando...
                  </>
                ) : (
                  'Usar Template'
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
