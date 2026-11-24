# Sistema de Eventos Acadêmicos

Aplicação da atividade prática de Desenvolvimento Web: frontend estático, API Node.js/Express e banco PostgreSQL via Supabase.

## Estrutura

- `frontend/`: `index.html`, `style.css` e `script.js` para publicação na Vercel.
- `src/`: API Express para publicação no Render.
- `supabase/schema.sql`: criação da tabela, políticas RLS e carga inicial.

## Execução local

1. Execute `supabase/schema.sql` no SQL Editor do projeto Supabase.
2. Copie `.env.example` para `.env` e preencha `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY`.
3. Execute `npm install` e `npm start`.
4. Abra `frontend/index.html`. Para apontar para outra API, defina `window.EVENTS_API_URL` antes de carregar `script.js` ou substitua `API_URL` no arquivo.

## Publicação

No Render, use este repositório como Web Service, build `npm install`, start `npm start`, e configure `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` e `FRONTEND_URL`.

Na Vercel, publique a pasta `frontend/` como projeto estático e altere `API_URL` em `frontend/script.js` para a URL pública do Render.
