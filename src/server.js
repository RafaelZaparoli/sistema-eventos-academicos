import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const app = express();
const port = Number(process.env.PORT || 3000);
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const allowedOrigins = (process.env.FRONTEND_URL || '*').split(',').map((value) => value.trim());

if (!supabaseUrl || !supabaseKey) {
  console.warn('SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY/SUPABASE_ANON_KEY não configurados.');
}

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origem não permitida pelo CORS.'));
  }
}));
app.use(express.json({ limit: '100kb' }));

const eventSchema = z.object({
  titulo: z.string().trim().min(3, 'O título deve ter pelo menos 3 caracteres.').max(150),
  descricao: z.string().trim().max(2000).optional().default(''),
  data_evento: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Use a data no formato DD/MM/AAAA.'),
  local: z.string().trim().min(2, 'Informe o local.').max(100)
});

function requireDatabase(res) {
  if (!supabase) {
    res.status(503).json({ error: 'Banco de dados não configurado no servidor.' });
    return false;
  }
  return true;
}

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'eventos-academicos-api' }));

app.get('/api/eventos', async (_req, res) => {
  if (!requireDatabase(res)) return;
  const { data, error } = await supabase.from('eventos').select('*').order('id', { ascending: false });
  if (error) return res.status(500).json({ error: 'Não foi possível carregar os eventos.' });
  return res.json(data);
});

app.post('/api/eventos', async (req, res) => {
  if (!requireDatabase(res)) return;
  const parsed = eventSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message });
  const { data, error } = await supabase.from('eventos').insert(parsed.data).select().single();
  if (error) return res.status(500).json({ error: 'Não foi possível cadastrar o evento.' });
  return res.status(201).json(data);
});

app.use((error, _req, res, _next) => {
  if (error?.message?.includes('CORS')) return res.status(403).json({ error: error.message });
  console.error(error);
  return res.status(500).json({ error: 'Erro interno do servidor.' });
});

app.listen(port, () => console.log(`API de eventos ouvindo na porta ${port}`));
