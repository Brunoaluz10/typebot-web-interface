"use client";

import { useState } from 'react';
import BotCreator from '@/components/BotCreator';
import BotHistory from '@/components/BotHistory';
import Templates from '@/components/Templates';
import LogViewer from '@/components/LogViewer';
import Stats from '@/components/Stats';
import { Bot, Sparkles } from 'lucide-react';

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleBotCreated = () => {
    // Atualiza histórico e stats
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Typebot Bot Creator</h1>
              <p className="text-sm text-gray-500">Criação autônoma de bots com IA</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <Stats refreshTrigger={refreshTrigger} />

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Bot Creator */}
          <BotCreator onBotCreated={handleBotCreated} />

          {/* Log Viewer */}
          <LogViewer />
        </div>

        {/* Templates */}
        <div className="mb-6">
          <Templates onTemplateUsed={handleBotCreated} />
        </div>

        {/* History */}
        <BotHistory refreshTrigger={refreshTrigger} />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <p>Typebot Bot Creator - Sistema Autônomo com IA</p>
            <div className="flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              <span>Powered by OpenAI GPT-4o-mini</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
