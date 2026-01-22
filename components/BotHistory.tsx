"use client";

import { useState, useEffect } from 'react';
import { botAPI, BotHistoryItem } from '@/lib/api';
import { formatDate, getStatusColor, getStrategyLabel } from '@/lib/utils';
import { History, ExternalLink, RefreshCw } from 'lucide-react';

export default function BotHistory({ refreshTrigger }: { refreshTrigger?: number }) {
  const [bots, setBots] = useState<BotHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const history = await botAPI.getHistory(50, 0);
      setBots(history);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [refreshTrigger]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <History className="w-6 h-6 text-gray-700" />
          <h2 className="text-2xl font-bold text-gray-900">Histórico de Bots</h2>
        </div>
        <button
          onClick={loadHistory}
          disabled={loading}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <RefreshCw className={`w-5 h-5 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : bots.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <History className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>Nenhum bot criado ainda</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estratégia</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bots.map((bot) => (
                <tr key={bot.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{bot.name}</div>
                    {bot.description && (
                      <div className="text-xs text-gray-500 truncate max-w-xs">
                        {bot.description}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(bot.status)}`}>
                      {bot.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {bot.strategy_used ? getStrategyLabel(bot.strategy_used) : '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {formatDate(bot.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    {bot.url && bot.status === 'success' && (
                      <a
                        href={bot.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Abrir
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
