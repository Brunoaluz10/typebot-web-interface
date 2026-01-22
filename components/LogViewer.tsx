"use client";

import { useState, useEffect, useRef } from 'react';
import { LogsWebSocket } from '@/lib/api';
import { Terminal, X } from 'lucide-react';

interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  bot_id?: string;
  logger?: string;
}

export default function LogViewer() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<LogsWebSocket | null>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Conecta WebSocket
    wsRef.current = new LogsWebSocket((log: LogEntry) => {
      setLogs(prev => [...prev, log].slice(-100)); // Mantém últimos 100 logs
    });

    wsRef.current.connect();
    setConnected(true);

    return () => {
      wsRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    // Auto-scroll para o final
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const clearLogs = () => {
    setLogs([]);
  };

  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      'INFO': 'text-blue-600',
      'WARNING': 'text-yellow-600',
      'ERROR': 'text-red-600',
      'DEBUG': 'text-gray-500',
    };
    return colors[level] || 'text-gray-700';
  };

  return (
    <div className="bg-gray-900 rounded-lg shadow-lg p-4 text-white">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-green-400" />
          <h3 className="font-semibold">Logs em Tempo Real</h3>
          {connected && (
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          )}
        </div>
        <button
          onClick={clearLogs}
          className="p-1 hover:bg-gray-800 rounded transition-colors"
          title="Limpar logs"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-black rounded-lg p-3 h-64 overflow-y-auto font-mono text-xs">
        {logs.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            Aguardando logs...
          </div>
        ) : (
          <div className="space-y-1">
            {logs.map((log, index) => (
              <div key={index} className="flex gap-2">
                <span className="text-gray-500 shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString('pt-BR')}
                </span>
                <span className={`font-semibold shrink-0 ${getLevelColor(log.level)}`}>
                  [{log.level}]
                </span>
                <span className="text-gray-300">{log.message}</span>
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>
        )}
      </div>
    </div>
  );
}
