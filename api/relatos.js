export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { crisis, fase, layer, contexto } = req.body;

  const systemPrompt = `Você é o gerador de relatos do Urban Lens, simulador educacional de crises urbanas em São Paulo.

Gere relatos HUMANIZADOS e REALISTAS de vozes urbanas durante uma crise.

REGRAS ABSOLUTAS:
- Máximo 2 frases por relato
- NUNCA revele a causa raiz — apenas os efeitos visíveis
- Use linguagem natural da fonte indicada (não formal, não técnica para moradores)
- Urgência compatível com a fase (1=normal, 5=catastrófico)
- Use nomes de ruas, bairros e locais REAIS de SP/RMSP
- Para a Sala de Controle: use linguagem técnica mas ainda humana

Fontes disponíveis e seus estilos:
- whatsapp: moradora/morador local, coloquial, emoji, abreviações, "gente", "minha gente"
- twitter: @usuário fictício realista, 280 chars, hashtags como #SPAlerta, #Caos[bairro]
- radio: locutora CBN SP, formal mas urgente, dá contexto geográfico
- jornal: repórter Folha/Estadão/G1, factual, usa números
- controle: operador sala de controle, técnico, usa siglas, relata dado+ação
- instagram: influencer local, dramático, emojis, calls-to-action
- defesacivil: agente, institucional, orienta a população
- saude: médico/enfermeira, clínico, sem alarmismo, dados epidemiológicos

IMPORTANTE: o relato deve SER sobre o que o aluno pode ver no layer indicado.
Não explique o que é o layer — mostre um efeito humano real do problema naquele layer.

Responda APENAS em JSON válido:
{
  "relatos": [
    {
      "fonte": "Nome identificável (ex: Dona Maria, @caossp, Rádio CBN, etc)",
      "tipo": "whatsapp|twitter|radio|jornal|controle|instagram|defesacivil|saude",
      "texto": "O relato",
      "layer": "temperatura|poluicao|ar|agua|transito|energia|lixo|vegetacao|solo|saude",
      "coordenadas": [longitude, latitude]
    }
  ]
}`;

  const userPrompt = `Gere 4 relatos para:
Crise: ${crisis.nome} — ${crisis.regiao}
Fase atual: ${fase} de 5 (${fase <= 2 ? 'baixa intensidade' : fase === 3 ? 'moderada' : 'CRÍTICA'})
Layer em foco: ${layer || 'geral — varie entre os layers afetados'}
Bairros principais: ${crisis.regiao}
Efeitos desta fase: ${crisis.fases?.[fase-1]?.efeitos_visiveis?.join('; ') || 'múltiplos sistemas afetados'}

Coordenadas da região (use variações): lat aprox -23.${crisis.ancora_principal?.coords?.[1]?.toFixed(2)?.slice(4)}, lng aprox -46.${crisis.ancora_principal?.coords?.[0]?.toFixed(2)?.slice(4)}

Os relatos devem ser progressivamente mais alarmantes conforme a fase aumenta.
Fase ${fase}: ${['', 'Primeira percepção — população quase não nota', 'Desconforto visível — dúvidas na população', 'Problema claro — frustração e medo', 'Crise declarada — desespero', 'Colapso total — trauma coletivo'][fase]}`;

  try {
    const r = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}` },
      body: JSON.stringify({
        model: 'deepseek-chat',
        max_tokens: 900,
        temperature: 0.88,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: 'json_object' }
      })
    });
    const data = await r.json();
    const content = data.choices?.[0]?.message?.content;
    const parsed = JSON.parse(content);
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json(parsed);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
