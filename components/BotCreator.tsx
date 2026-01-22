"use client";

import { useState } from 'react';
import { botAPI, BotCreateResponse } from '@/lib/api';
import { Loader2, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';

export default function BotCreator({ onBotCreated }: { onBotCreated?: () => void }) {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BotCreateResponse | null>(null);
  const [useAI, setUseAI] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim()) {
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await botAPI.create({
        description,
        use_ai: useAI,
        skip_web: false
      });

      setResult(response);
      
      if (response.success) {
        setDescription('');
        onBotCreated?.();
      }
    } catch (error: any) {
      setResult({
        success: false,
        error: error.response?.data?.detail || error.message || 'Erro ao criar bot'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Criar Novo Bot</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descrição do Bot
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ex: Criar bot de check-in que pergunta se treinou, se fez refeições e se bebeu água"
            className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            disabled={loading}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="use-ai"
            checked={useAI}
            onChange={(e) => setUseAI(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            disabled={loading}
          />
          <label htmlFor="use-ai" className="text-sm text-gray-700">
            Usar IA para melhorar parsing (recomendado)
          </label>
        </div>

        <button
          type="submit"
          disabled={loading || !description.trim()}
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Criando Bot...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Criar Bot com IA
            </>
          )}
        </button>
      </form>

      {result && (
        <div className={`mt-4 p-4 rounded-lg ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          {result.success ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-green-800 font-medium">
                <CheckCircle className="w-5 h-5" />
                Bot criado com sucesso!
              </div>
              <div className="text-sm text-green-700 space-y-1">
                <p><strong>Nome:</strong> {result.name}</p>
                <p><strong>ID:</strong> {result.bot_id}</p>
                <p><strong>Estratégia:</strong> {result.strategy_used}</p>
                {result.url && (
                  <a
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-blue-600 hover:text-blue-700 font-medium underline"
                  >
                    Abrir no Typebot →
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-red-800 font-medium">
                <AlertCircle className="w-5 h-5" />
                Erro ao criar bot
              </div>
              <p className="text-sm text-red-700">{result.error}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
