import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    'success': 'text-green-600 bg-green-50',
    'error': 'text-red-600 bg-red-50',
    'pending': 'text-yellow-600 bg-yellow-50',
  };
  return colors[status] || 'text-gray-600 bg-gray-50';
}

export function getStrategyLabel(strategy: string): string {
  const labels: Record<string, string> = {
    'api_complete_json': 'API Completa',
    'api_base_patch': 'API + PATCH',
    'json_export': 'Export JSON',
    'web_automation': 'Automação Web',
    'failed': 'Falhou',
  };
  return labels[strategy] || strategy;
}
