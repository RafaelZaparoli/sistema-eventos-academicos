const API_URL = (window.EVENTS_API_URL || 'https://sistema-eventos-academicos.onrender.com').replace(/\/$/, '');
const form = document.querySelector('#event-form');
const eventsContainer = document.querySelector('#events');
const feedback = document.querySelector('#feedback');

function renderEvents(events) {
  if (!events.length) { eventsContainer.innerHTML = '<p class="empty">Nenhum evento cadastrado ainda.</p>'; return; }
  eventsContainer.innerHTML = events.map((event) => `<article class="event"><h3>${escapeHtml(event.titulo)}</h3><p>${escapeHtml(event.descricao || 'Sem descrição informada.')}</p><p class="event-meta"><span>▣ ${escapeHtml(event.data_evento)}</span><span>⌖ ${escapeHtml(event.local)}</span></p></article>`).join('');
}

function escapeHtml(value) { return String(value).replace(/[&<>'"]/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char])); }
async function loadEvents() {
  eventsContainer.innerHTML = '<p class="muted">Carregando eventos...</p>';
  try { const response = await fetch(`${API_URL}/api/eventos`); if (!response.ok) throw new Error(); renderEvents(await response.json()); }
  catch { eventsContainer.innerHTML = '<p class="empty">Não foi possível carregar os eventos. Verifique a API.</p>'; }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault(); feedback.className = 'feedback'; feedback.textContent = 'Salvando...';
  const body = Object.fromEntries(new FormData(form));
  try {
    const response = await fetch(`${API_URL}/api/eventos`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body) });
    const result = await response.json(); if (!response.ok) throw new Error(result.error || 'Não foi possível cadastrar.');
    form.reset(); feedback.textContent = 'Evento cadastrado com sucesso.'; await loadEvents();
  } catch (error) { feedback.className = 'feedback error'; feedback.textContent = error.message; }
});
document.querySelector('#refresh').addEventListener('click', loadEvents);
loadEvents();
