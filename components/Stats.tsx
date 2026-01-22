"use client";

import { useState, useEffect } from 'react';
import { botAPI, StatsResponse } from '@/lib/api';
import { BarChart3, CheckCircle, XCircle, Zap } from 'lucide-react';

export default function Stats({ refreshTrigger }: { refreshTrigger?: number }) {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [refreshTrigger]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await botAPI.getStats();
      setStats(data);
    } catch (error) {
      console.error('Erro ao carregar stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return null;
  }

  const successCount = stats.by_status?.success || 0;
  const errorCount = stats.by_status?.error || 0;
  const successRate = stats.total_bots > 0 ? Math.round((successCount / stats.total_bots) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total de Bots</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total_bots}</p>
          </div>
          <BarChart3 className="w-8 h-8 text-blue-600" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Sucesso</p>
            <p className="text-2xl font-bold text-green-600">{successCount}</p>
          </div>
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Erros</p>
            <p className="text-2xl font-bold text-red-600">{errorCount}</p>
          </div>
          <XCircle className="w-8 h-8 text-red-600" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Taxa de Sucesso</p>
            <p className="text-2xl font-bold text-blue-600">{successRate}%</p>
          </div>
          <Zap className="w-8 h-8 text-blue-600" />
        </div>
      </div>
    </div>
  );
}
