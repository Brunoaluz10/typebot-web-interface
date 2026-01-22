# Typebot Bot Creator - Interface Web

Interface web moderna para criação autônoma de bots Typebot com IA.

## Stack

- **Frontend:** Next.js 14 + TypeScript + Tailwind CSS
- **Backend:** FastAPI (Python)
- **UI:** shadcn/ui components
- **Comunicação:** REST API + WebSocket

## Desenvolvimento Local

### Backend
```bash
cd automation
source venv/bin/activate
pip install -r requirements-web.txt
python -m webapi.main
```

### Frontend
```bash
cd web-interface
npm install
npm run dev
```

Acesse: http://localhost:3003

## Deploy na VPS

```bash
cd ~/projetos/typebot-automation
bash scripts/install-web.sh
```

## Funcionalidades

- Criar bots por descrição em texto
- IA melhora parsing automaticamente
- Sistema de fallbacks múltiplos
- Histórico de bots criados
- Templates pré-definidos
- Logs em tempo real
- Estatísticas de uso

## Arquitetura

```
[Next.js :3003] ↔ [FastAPI :8000] ↔ [Módulos Python]
      ↓                    ↓                    ↓
   [Navegador]        [WebSocket]         [Typebot API]
```

## URL de Produção

https://bots.drbrunoadriano.com
