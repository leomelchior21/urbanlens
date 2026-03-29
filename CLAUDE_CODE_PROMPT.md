# URBAN LENS — PROMPT MESTRE PARA CLAUDE CODE
# Versão definitiva para deploy em Vercel
# Autor: Leo (educador, São Paulo)
# Uso: Cole este prompt inteiro no Claude Code

---

## CONTEXTO E PROPÓSITO

Você vai construir o **Urban Lens**, um simulador de crises urbanas para uso pedagógico em sala de aula com alunos do ensino médio e superior em São Paulo. A ferramenta é uma aplicação web single-file (HTML + JS inline, sem build step) que roda no Vercel.

O objetivo pedagógico central é **aprendizado investigativo por descoberta**: o aluno recebe uma crise urbana real de São Paulo sem saber a causa — apenas os efeitos aparecem gradualmente no mapa, através de camadas de dados que ele ativa uma a uma. A causa nunca é revelada diretamente. O aluno age como engenheiro urbano, cruzando evidências entre as camadas para deduzir o que está acontecendo.

---

## REFERÊNCIA VISUAL OBRIGATÓRIA

A interface deve se parecer **exatamente** com um dashboard sci-fi de sala de guerra, estilo tela de comando militar/tecnológico futurista. Referência visual: dashboard com fundo escuro profundo (#040d1a), elementos em verde néon (#00ffcc) e ciano (#00bfff), tipografia monospace, brilhos e glows em todos os elementos ativos, scanlines sutis no fundo, grade hexagonal semitransparente sobre o mapa.

### Layout exato em grid (inspirado na imagem de referência):

```
┌─────────────────────────────────────────────────────────────────────┐
│  [HEADER] URBAN LENS ── nome da crise ── FASE X/5 ── timer ── logo  │
├──────────────┬──────────────────────────────────┬───────────────────┤
│  KPI GAUGES  │                                  │  CARDS SISTEMA    │
│  (4 círculos)│                                  │  (4 cards status) │
├──────────────┤      MAPA CENTRAL MapLibre GL    ├───────────────────┤
│  BARRAS      │      (ocupa ~55% da tela)        │  TERMINAL LOGS    │
│  por layer   │      fundo escuro, pontos        │  (texto rolando   │
│              │      pulsantes, hexgrid          │   estilo matrix)  │
├──────────────┤                                  ├───────────────────┤
│  TABELA      │                                  │  MINI MAPA        │
│  âncoras     ├──────────────────────────────────┤  satélite         │
│  críticos    │  GRÁFICO DE LINHA (severidade    │  (região da crise)│
│              │  por layer ao longo das fases)   │                   │
└──────────────┴──────────────────────────────────┴───────────────────┘
```

### Especificações visuais EXATAS:

**Cores do sistema:**
```css
--bg:        #040d1a    /* fundo principal — quase preto azulado */
--panel:     #060f1e    /* painéis laterais */
--panel2:    #071525    /* painéis secundários */
--border:    #0d2535    /* bordas de painel */
--border2:   #0a3040    /* bordas hover */
--accent:    #00ffcc    /* verde néon principal */
--accent2:   #00bfff    /* ciano secundário */
--accent3:   #0080ff    /* azul elétrico */
--warn:      #ffcc00    /* amarelo alerta */
--danger:    #ff3b3b    /* vermelho perigo */
--critical:  #ff0055    /* magenta crítico fase 5 */
--text:      #c8e8f0    /* texto principal */
--text-dim:  #3a6070    /* texto desativado */
--glow-g:    rgba(0,255,204,0.15)   /* glow verde */
--glow-b:    rgba(0,191,255,0.12)   /* glow ciano */
```

**Tipografia:**
- Fonte principal: `'Share Tech Mono', monospace` (Google Fonts CDN)
- Fonte display (títulos grandes): `'Orbitron', sans-serif` (Google Fonts CDN)
- Nunca usar Inter, Roboto, Arial ou fontes genéricas

**Efeitos obrigatórios:**
1. **Scanlines**: pseudo-elemento `::before` no body com `repeating-linear-gradient` de linhas horizontais finas de 1px, opacidade 0.03, pointer-events none
2. **Vinheta**: pseudo-elemento `::after` no body com radial-gradient escuro nas bordas
3. **Glow em todos os elementos ativos**: `box-shadow: 0 0 10px var(--accent), 0 0 20px var(--accent)44`
4. **Bordas com brilho**: `border: 1px solid var(--border)` + `box-shadow: inset 0 0 20px rgba(0,255,204,0.03)`
5. **Animação de entrada dos painéis**: `fadeIn` com `translateY(-4px)` de 0.4s
6. **Números nos KPIs**: contagem animada de 0 até o valor final (400ms)
7. **Texto do terminal**: digitação letra por letra, cursor piscante `█`
8. **Grade hexagonal no mapa**: SVG pattern semitransparente (opacidade 0.04) sobreposto ao canvas do mapa

---

## ESTRUTURA DE ARQUIVOS

```
urban-lens/
├── index.html          ← Tela de loading + sorteio de crise
├── sim.html            ← Simulador completo (arquivo principal)
├── api/
│   └── relatos.js      ← Vercel serverless → Deepseek API
├── data/
│   └── crises.js       ← Dados completos das 10 crises
├── vercel.json
├── package.json
└── .gitignore
```

**REGRA CRÍTICA**: `sim.html` deve ser um único arquivo HTML com todo CSS e JS inline. Zero dependências de build. Apenas CDN.

**CDNs a usar:**
```html
<link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@400;700;900&display=swap" rel="stylesheet">
<link href="https://unpkg.com/maplibre-gl@4.1.3/dist/maplibre-gl.css" rel="stylesheet">
<script src="https://unpkg.com/maplibre-gl@4.1.3/dist/maplibre-gl.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
<script src="data/crises.js"></script>
```

---

## ARQUIVO: `data/crises.js`

Este arquivo contém os dados completos de todas as 10 crises. Cole exatamente o conteúdo abaixo:

```javascript
const CRISES = [

  // ═══════════════════════════════════════════════════════
  // CRISE 01 — Colapso Hídrico no ABC
  // Causa OCULTA: rompimento de adutora em Santo André
  // ═══════════════════════════════════════════════════════
  {
    id: 1,
    nome: "Colapso Hídrico no ABC",
    subtitulo: "Região do Grande ABC — RMSP",
    regiao: "Santo André, São Bernardo do Campo, Mauá",
    cor: "#00bfff",
    icone: "💧",
    sistemas_primarios: [
      { nome: "Abastecimento Hídrico", icone: "💧", layer: "agua" },
      { nome: "Mobilidade Urbana",     icone: "🚗", layer: "transito" },
      { nome: "Saúde Pública",         icone: "🏥", layer: "saude" },
      { nome: "Rede de Energia",       icone: "⚡", layer: "energia" },
    ],
    conexoes_causa_efeito: [
      { de: "a01", para: "a04", descricao: "Rompimento bloqueia via principal" },
      { de: "a01", para: "a07", descricao: "Sobrecarga nas bombas emergenciais" },
      { de: "a02", para: "a05", descricao: "Falta de água na UBS" },
      { de: "a04", para: "a08", descricao: "Caminhões de lixo desviados por bloqueio" },
    ],
    layers_afetados: ["agua", "temperatura", "lixo", "transito", "energia", "solo", "saude"],
    ancora_principal: { coords: [-46.532, -23.664], label: "Santo André Centro" },
    centro_mapa: [-46.510, -23.675],
    zoom_inicial: 11.8,
    ancoras: [
      {
        id: "a01", coords: [-46.532, -23.664],
        label: "Santo André — Adutora Central",
        descricao: "Principal adutora de abastecimento do ABC. DN800mm.",
        layer: "agua", severidade_inicial: 2,
        dados_por_fase: {
          1: { valor: "Pressão: 1.8 bar", delta: "↓ 40% nominal", status: "ANOMALIA" },
          2: { valor: "Pressão: 0.9 bar", delta: "↓ 70% nominal", status: "ALERTA" },
          3: { valor: "Pressão: 0.3 bar", delta: "↓ 90% nominal", status: "CRÍTICO" },
          4: { valor: "Pressão: 0.0 bar", delta: "SEM FLUXO",     status: "FALHA" },
          5: { valor: "Rompido",          delta: "Inoperante",     status: "COLAPSO" },
        }
      },
      {
        id: "a02", coords: [-46.461, -23.667],
        label: "Mauá — Estação de Bombeamento",
        descricao: "Estação de recalque que serve 180 mil habitantes.",
        layer: "agua", severidade_inicial: 1,
        dados_por_fase: {
          1: { valor: "Bomba B1: OK",      delta: "Fluxo normal",   status: "NORMAL" },
          2: { valor: "Bomba B1: ALERTA",  delta: "Pressão baixa",  status: "ALERTA" },
          3: { valor: "Reserv: 45%",       delta: "↓ 30% em 2h",   status: "CRÍTICO" },
          4: { valor: "Reserv: 12%",       delta: "↓ 33% em 2h",   status: "CRÍTICO" },
          5: { valor: "Reserv: 0%",        delta: "Esgotado",       status: "COLAPSO" },
        }
      },
      {
        id: "a03", coords: [-46.565, -23.694],
        label: "São Bernardo — Reservatório Sul",
        descricao: "Reservatório de distribuição. Capacidade: 12 milhões de litros.",
        layer: "agua", severidade_inicial: 1,
        dados_por_fase: {
          1: { valor: "Nível: 78%",       delta: "Estável",         status: "NORMAL" },
          2: { valor: "Nível: 61%",       delta: "↓ 17%",          status: "ATENÇÃO" },
          3: { valor: "Nível: 38%",       delta: "↓ 23%",          status: "ALERTA" },
          4: { valor: "Nível: 14%",       delta: "↓ 24%",          status: "CRÍTICO" },
          5: { valor: "Nível: 2%",        delta: "Crítico",         status: "COLAPSO" },
        }
      },
      {
        id: "a04", coords: [-46.540, -23.650],
        label: "Santo André — Av. Industrial",
        descricao: "Principal eixo viário do ABC. 6 faixas. 42.000 veículos/dia.",
        layer: "transito", severidade_inicial: 1,
        dados_por_fase: {
          1: { valor: "Vel: 38 km/h",     delta: "Levemente abaixo", status: "NORMAL" },
          2: { valor: "Vel: 18 km/h",     delta: "Lento",            status: "ATENÇÃO" },
          3: { valor: "Vel: 6 km/h",      delta: "5 caminhões-pipa", status: "CRÍTICO" },
          4: { valor: "Vel: 2 km/h",      delta: "Bloqueio total",   status: "CRÍTICO" },
          5: { valor: "BLOQUEADA",        delta: "Interdição",       status: "COLAPSO" },
        }
      },
      {
        id: "a05", coords: [-46.480, -23.680],
        label: "Mauá — UBS Central",
        descricao: "Unidade Básica de Saúde Jardim Zaíra. 1.200 atendimentos/dia.",
        layer: "saude", severidade_inicial: 1,
        dados_por_fase: {
          1: { valor: "Atend: normal",    delta: "0 casos hidrat.", status: "NORMAL" },
          2: { valor: "+12 casos",        delta: "Desidratação leve", status: "ATENÇÃO" },
          3: { valor: "+34 casos",        delta: "Fila na entrada", status: "ALERTA" },
          4: { valor: "+67 casos",        delta: "UBS sobrecarregada", status: "CRÍTICO" },
          5: { valor: "LOTADA",           delta: "+120 casos/hora", status: "COLAPSO" },
        }
      },
      {
        id: "a06", coords: [-46.555, -23.710],
        label: "São Bernardo — Subsolo Z3",
        descricao: "Zona de monitoramento de subsolo. Detecta subsidência e vazamento.",
        layer: "solo", severidade_inicial: 1,
        dados_por_fase: {
          1: { valor: "Umidade: 32%",     delta: "Estável",          status: "NORMAL" },
          2: { valor: "Umidade: 28%",     delta: "Leve queda",       status: "NORMAL" },
          3: { valor: "Vibração: 0.8g",   delta: "Detec. anômala",  status: "ALERTA" },
          4: { valor: "Subsidência: 3cm", delta: "Cano rompido sub", status: "CRÍTICO" },
          5: { valor: "Subsidência: 11cm",delta: "Risco colapso",   status: "COLAPSO" },
        }
      },
      {
        id: "a07", coords: [-46.520, -23.670],
        label: "Santo André — Subestação Leste",
        descricao: "Subestação que alimenta as bombas de emergência e hospitais.",
        layer: "energia", severidade_inicial: 1,
        dados_por_fase: {
          1: { valor: "Carga: 62%",       delta: "Normal",           status: "NORMAL" },
          2: { valor: "Carga: 74%",       delta: "Bombas extra",     status: "ATENÇÃO" },
          3: { valor: "Carga: 88%",       delta: "Sobrecarga inicia",status: "ALERTA" },
          4: { valor: "Carga: 97%",       delta: "Risco blackout",  status: "CRÍTICO" },
          5: { valor: "SOBRECARGA",       delta: "Trip ativado",    status: "COLAPSO" },
        }
      },
      {
        id: "a08", coords: [-46.500, -23.660],
        label: "Santo André — Ponto Resíduos R7",
        descricao: "Ponto de coleta de resíduos sólidos. Coleta 3x/semana.",
        layer: "lixo", severidade_inicial: 1,
        dados_por_fase: {
          1: { valor: "Col: no prazo",    delta: "Normal",           status: "NORMAL" },
          2: { valor: "Atraso: 6h",       delta: "Caminhão desviado",status: "ATENÇÃO" },
          3: { valor: "Atraso: 18h",      delta: "2 coletas perdidas",status: "ALERTA" },
          4: { valor: "Atraso: 36h",      delta: "Acúmulo visível",  status: "CRÍTICO" },
          5: { valor: "SEM COLETA",       delta: "4 dias parado",   status: "COLAPSO" },
        }
      },
    ],
    fases: [
      {
        numero: 1, titulo: "Anomalia Detectada",
        duracao_min: 2,
        descricao_fase: "Sensores registram queda de pressão atípica. Poucos moradores percebem.",
        efeitos_visiveis: [
          "Queda de pressão hídrica em 3 pontos do ABC",
          "Sensores de fluxo com leitura 40% abaixo do normal",
          "Leve congestionamento na Av. Industrial",
        ],
        log_tecnico: [
          "[SENSOR_H] a01 :: pressao=1.8bar :: threshold=3.0bar :: ANOMALIA",
          "[SENSOR_H] a02 :: fluxo=0.61 m³/s :: esperado=1.02 m³/s",
          "[SENSOR_T] a04 :: vel_media=38kmh :: status=NORMAL",
        ],
        layers_ativos: { agua: [2,2,1], temperatura: [1,1,1], transito: [1,1,1] }
      },
      {
        numero: 2, titulo: "Degradação Progressiva",
        duracao_min: 2,
        descricao_fase: "A falta de água começa a gerar efeitos secundários em outros sistemas.",
        efeitos_visiveis: [
          "Temperatura sobe +2°C — asfalto sem umidade retém calor",
          "Caminhões de lixo desviados por bloqueio na Av. Industrial",
          "Pressão hídrica crítica em 5 bairros confirmada",
        ],
        log_tecnico: [
          "[SENSOR_H] a01 :: pressao=0.9bar :: STATUS=ALERTA :: escalado",
          "[SENSOR_T] a04 :: congestion_index=0.52 :: caminhoes_parados=3",
          "[SENSOR_TEMP] area_abc :: delta_temp=+2.1C :: ilha_calor=INCIPIENTE",
          "[SENSOR_RS] a08 :: coleta_atraso=6h :: rota_desviada=SIM",
        ],
        layers_ativos: { agua: [3,3,2], temperatura: [2,2,1], lixo: [2,1,1], transito: [2,1,1] }
      },
      {
        numero: 3, titulo: "Cascata Sistêmica",
        duracao_min: 2,
        descricao_fase: "Múltiplos sistemas começam a falhar em cadeia. Moradores em sofrimento.",
        efeitos_visiveis: [
          "5 caminhões-pipa bloqueiam Av. Industrial — congestionamento total",
          "12 relatos de desidratação registrados nas UBSs",
          "Solo: vibração anômala detectada no subsolo de SA",
          "Temperatura: +3°C acima do normal em todo o ABC",
        ],
        log_tecnico: [
          "[ALERTA_CRITICO] a01 :: pressao=0.3bar :: colapso_iminente",
          "[SENSOR_T] a04 :: vel_media=6kmh :: caminhoes_pipa=5 :: BLOQUEIO",
          "[SENSOR_SAUDE] a05 :: atend_extra=34 :: tipo=desidratacao",
          "[SENSOR_SOLO] a06 :: vibracao=0.8g :: subsolo_anomalia=SIM",
          "[SENSOR_TEMP] area_abc :: delta_temp=+3.2C :: status=ALERTA",
        ],
        layers_ativos: { agua: [4,4,3], temperatura: [3,2,2], lixo: [3,2,1], transito: [4,3,2], saude: [2,1,1] }
      },
      {
        numero: 4, titulo: "Crise Declarada",
        duracao_min: 2,
        descricao_fase: "Defesa Civil acionada. Sistemas de emergência sobrecarregados.",
        efeitos_visiveis: [
          "Subsidência: afundamento de 3cm detectado — canos rompidos no subsolo",
          "Subestação de energia sobrecarregada por bombas emergenciais",
          "40+ atendimentos por desidratação nas últimas 2 horas",
          "Coleta de lixo suspensa há 36h — acúmulo visível nas ruas",
        ],
        log_tecnico: [
          "[EMERGENCIA] a01 :: STATUS=ROMPIDO :: equipe_campo=ACIONADA",
          "[SENSOR_SOLO] a06 :: subsidencia=3cm :: risco_colapso_via=MEDIO",
          "[SENSOR_ENER] a07 :: carga=97pct :: risco_blackout=ALTO",
          "[SENSOR_SAUDE] a05 :: atend_extra=67 :: UBS_capacidade=ESGOTANDO",
          "[SENSOR_RS] a08 :: atraso_coleta=36h :: volume_acumulado=ALTO",
        ],
        layers_ativos: { agua: [5,5,4], temperatura: [4,3,3], lixo: [4,3,2], transito: [5,4,3], saude: [4,3,2], solo: [3,2,2], energia: [3,2,1] }
      },
      {
        numero: 5, titulo: "Colapso Total",
        duracao_min: null,
        descricao_fase: "Situação fora de controle. Todos os sistemas interdependentes falharam.",
        efeitos_visiveis: [
          "4 bairros completamente sem água há 18 horas",
          "Hospitais do ABC em alerta máximo — geradores ativados",
          "Parques sem irrigação — cobertura vegetal em colapso hídrico",
          "Risco de blackout geral por sobrecarga das bombas emergenciais",
          "Subsidência de 11cm ameaça estruturas sobre a adutora",
        ],
        log_tecnico: [
          "[COLAPSO] a01 :: STATUS=INOPERANTE :: populacao_afetada=280000",
          "[COLAPSO] a07 :: TRIP_ATIVADO :: blackout_parcial=SIM",
          "[EMERGENCIA] abc_regional :: nivel_crise=5 :: defesa_civil=OPERANDO",
          "[SENSOR_SAUDE] rede_abc :: atend_acumulado=847 :: hospitais=ALERTA_MAX",
          "[SENSOR_SOLO] a06 :: subsidencia=11cm :: INTERDIÇÃO_VIA=IMEDIATA",
        ],
        layers_ativos: { agua: [5,5,5], temperatura: [5,4,4], lixo: [5,5,4], transito: [5,5,4], saude: [5,4,3], solo: [4,4,3], energia: [5,4,3] }
      }
    ]
  },

  // ═══════════════════════════════════════════════════════
  // CRISE 02 — Onda de Calor na Zona Leste
  // Causa OCULTA: falha no sistema de climatização do metrô + ilhas de calor
  // ═══════════════════════════════════════════════════════
  {
    id: 2,
    nome: "Onda de Calor na Zona Leste",
    subtitulo: "Itaquera · Guaianases · Cidade Tiradentes",
    regiao: "Zona Leste — São Paulo Capital",
    cor: "#ff4500",
    icone: "🌡️",
    sistemas_primarios: [
      { nome: "Temperatura Urbana",  icone: "🌡️", layer: "temperatura" },
      { nome: "Saúde Pública",       icone: "🏥",  layer: "saude" },
      { nome: "Rede Elétrica",       icone: "⚡",  layer: "energia" },
      { nome: "Qualidade do Ar",     icone: "💨",  layer: "ar" },
    ],
    conexoes_causa_efeito: [
      { de: "b01", para: "b04", descricao: "Calor gera pico de consumo de A/C" },
      { de: "b04", para: "b03", descricao: "Blackout desliga climatização da UBS" },
      { de: "b02", para: "b07", descricao: "Ilha de calor resseca vegetação" },
      { de: "b05", para: "b01", descricao: "Hidrantes abertos aumentam umidade local" },
    ],
    layers_afetados: ["temperatura", "saude", "energia", "agua", "transito", "ar", "vegetacao"],
    ancora_principal: { coords: [-46.456, -23.537], label: "Itaquera" },
    centro_mapa: [-46.430, -23.555],
    zoom_inicial: 11.5,
    ancoras: [
      {
        id: "b01", coords: [-46.456, -23.537],
        label: "Itaquera — Pátio do Metrô Linha 3",
        descricao: "Maior pátio de manutenção do metrô SP. Área impermeabilizada de 18 ha.",
        layer: "temperatura", severidade_inicial: 3,
        dados_por_fase: {
          1: { valor: "Temp: 36.4°C",    delta: "+4.1°C média",    status: "ALERTA" },
          2: { valor: "Temp: 39.2°C",    delta: "+6.9°C média",    status: "CRÍTICO" },
          3: { valor: "Temp: 41.8°C",    delta: "+9.5°C média",    status: "CRÍTICO" },
          4: { valor: "Temp: 44.1°C",    delta: "+11.8°C média",   status: "CRÍTICO" },
          5: { valor: "Temp: 47.3°C",    delta: "+15°C asfalto",   status: "COLAPSO" },
        }
      },
      {
        id: "b02", coords: [-46.397, -23.588],
        label: "Cidade Tiradentes — Praça Central",
        descricao: "Única praça da maior favela vertical da América Latina. 0% de sombra.",
        layer: "temperatura", severidade_inicial: 2,
        dados_por_fase: {
          1: { valor: "Temp: 37.8°C",    delta: "+5.5°C",          status: "ALERTA" },
          2: { valor: "Temp: 40.2°C",    delta: "+7.9°C",          status: "CRÍTICO" },
          3: { valor: "Temp: 42.5°C",    delta: "+10.2°C",         status: "CRÍTICO" },
          4: { valor: "Temp: 44.8°C",    delta: "+12.5°C",         status: "CRÍTICO" },
          5: { valor: "Temp: 46.1°C",    delta: "+13.8°C",         status: "COLAPSO" },
        }
      },
      {
        id: "b03", coords: [-46.420, -23.565],
        label: "Guaianases — UBS Dr. Olímpio",
        descricao: "UBS com capacidade para 800 pacientes/dia. Sem gerador próprio.",
        layer: "saude", severidade_inicial: 1,
        dados_por_fase: {
          1: { valor: "Fila: normal",     delta: "0 casos calor",  status: "NORMAL" },
          2: { valor: "+18 insolações",   delta: "Fila grande",    status: "ATENÇÃO" },
          3: { valor: "+52 insolações",   delta: "Triagem externa",status: "ALERTA" },
          4: { valor: "+94 casos",        delta: "Superlotada",    status: "CRÍTICO" },
          5: { valor: "LOTADA",           delta: "+160 casos/hora",status: "COLAPSO" },
        }
      },
      {
        id: "b04", coords: [-46.440, -23.550],
        label: "Itaquera — Subestação SE-Itaquera",
        descricao: "Subestação que alimenta 340.000 domicílios da Zona Leste.",
        layer: "energia", severidade_inicial: 1,
        dados_por_fase: {
          1: { valor: "Carga: 71%",       delta: "Pico A/C inicia", status: "ATENÇÃO" },
          2: { valor: "Carga: 84%",       delta: "Demanda alta",   status: "ALERTA" },
          3: { valor: "Carga: 93%",       delta: "Limite técnico", status: "CRÍTICO" },
          4: { valor: "Carga: 99%",       delta: "Trip iminente",  status: "CRÍTICO" },
          5: { valor: "BLACKOUT",         delta: "3 alimentadoras",status: "COLAPSO" },
        }
      },
      {
        id: "b05", coords: [-46.430, -23.570],
        label: "Guaianases — Hidrante Rua das Flores",
        descricao: "Ponto de monitoramento da rede de distribuição hídrica.",
        layer: "agua", severidade_inicial: 1,
        dados_por_fase: {
          1: { valor: "Pressão: OK",      delta: "Normal",          status: "NORMAL" },
          2: { valor: "Pressão: -12%",    delta: "Hidrantes abertos",status: "ATENÇÃO" },
          3: { valor: "Pressão: -28%",    delta: "8 hidrantes abertos",status: "ALERTA" },
          4: { valor: "Pressão: -45%",    delta: "Chuveirões pop.",  status: "CRÍTICO" },
          5: { valor: "SEM PRESSÃO",      delta: "Rede colapsada",  status: "COLAPSO" },
        }
      },
      {
        id: "b06", coords: [-46.460, -23.545],
        label: "Itaquera — Terminal Metropolitano",
        descricao: "Terminal com 85.000 embarques/dia. Sem climatização.",
        layer: "transito", severidade_inicial: 1,
        dados_por_fase: {
          1: { valor: "Normal",           delta: "Fluxo OK",        status: "NORMAL" },
          2: { valor: "Lento",            delta: "3 ônibus parados",status: "ATENÇÃO" },
          3: { valor: "Parcial",          delta: "Superaquec. motor",status: "ALERTA" },
          4: { valor: "Caos",             delta: "8 ônibus parados",status: "CRÍTICO" },
          5: { valor: "PARALIZADO",       delta: "Terminal fechado",status: "COLAPSO" },
        }
      },
      {
        id: "b07", coords: [-46.410, -23.580],
        label: "Cidade Tiradentes — Parque do Carmo",
        descricao: "Maior parque da Zona Leste. 1.500.000 m² de vegetação urbana.",
        layer: "vegetacao", severidade_inicial: 1,
        dados_por_fase: {
          1: { valor: "NDVI: 0.68",       delta: "Vegetação OK",    status: "NORMAL" },
          2: { valor: "NDVI: 0.61",       delta: "Leve estresse",   status: "ATENÇÃO" },
          3: { valor: "NDVI: 0.49",       delta: "Estresse hídrico",status: "ALERTA" },
          4: { valor: "NDVI: 0.31",       delta: "Ressecamento",    status: "CRÍTICO" },
          5: { valor: "NDVI: 0.14",       delta: "Colapso vegetal", status: "COLAPSO" },
        }
      },
      {
        id: "b08", coords: [-46.445, -23.555],
        label: "Guaianases — Estação CETESB",
        descricao: "Estação automática de qualidade do ar. Mede PM2.5, PM10, O₃.",
        layer: "ar", severidade_inicial: 1,
        dados_por_fase: {
          1: { valor: "IQA: 72 (Mod)",    delta: "Normal inverno",  status: "ATENÇÃO" },
          2: { valor: "IQA: 88 (Ruim)",   delta: "O₃ elevado",     status: "ALERTA" },
          3: { valor: "IQA: 108 (Ruim)",  delta: "PM2.5 +34µg/m³", status: "CRÍTICO" },
          4: { valor: "IQA: 134 (MRuim)", delta: "Ozônio crítico", status: "CRÍTICO" },
          5: { valor: "IQA: 182 (Péss)",  delta: "Nível perigoso", status: "COLAPSO" },
        }
      },
    ],
    fases: [
      {
        numero: 1, titulo: "Calor Acima do Normal",
        duracao_min: 2,
        descricao_fase: "Temperatura 4°C acima da média histórica. Anomalia registrada.",
        efeitos_visiveis: ["Temperatura 4°C acima da média em Itaquera", "IQA moderado com ozônio elevando"],
        log_tecnico: [
          "[SENSOR_TEMP] b01 :: temp=36.4C :: delta=+4.1C :: ILHA_CALOR=INCIPIENTE",
          "[SENSOR_TEMP] b02 :: temp=37.8C :: cobertura_arvores=0pct",
          "[SENSOR_AR] b08 :: IQA=72 :: O3=88ug/m3 :: status=MODERADO",
        ],
        layers_ativos: { temperatura: [3,2,2], ar: [1,1,1] }
      },
      {
        numero: 2, titulo: "Pressão nos Serviços",
        duracao_min: 2,
        descricao_fase: "Idosos e crianças começam a buscar atendimento. Consumo de energia dispara.",
        efeitos_visiveis: ["UBSs com fila de idosos com insolação", "Pico histórico de consumo de energia A/C"],
        log_tecnico: [
          "[SENSOR_SAUDE] b03 :: atend_calor=18 :: perfil=idosos_criancas",
          "[SENSOR_ENER] b04 :: carga=84pct :: demanda_A/C=PICO",
          "[SENSOR_TEMP] zona_leste :: delta_medio=+6.9C :: status=CRITICO",
          "[SENSOR_AR] b08 :: IQA=88 :: status=RUIM :: sensivel=EVITAR_EXPOS",
        ],
        layers_ativos: { temperatura: [4,3,3], saude: [2,2,1], energia: [3,2,1], ar: [2,1,1] }
      },
      {
        numero: 3, titulo: "Sistema Hídrico sob Pressão",
        duracao_min: 2,
        descricao_fase: "Moradores abrem hidrantes. Ônibus param por superaquecimento do motor.",
        efeitos_visiveis: ["8 hidrantes abertos espontaneamente", "3 ônibus parados por superaquecimento"],
        log_tecnico: [
          "[SENSOR_H] b05 :: pressao=-28pct :: hidrantes_abertos=8 :: STATUS=ALERTA",
          "[SENSOR_T] b06 :: onibus_parados=3 :: causa=SUPERAQUECIMENTO",
          "[SENSOR_TEMP] b01 :: temp=41.8C :: asfalto_temp=52C",
          "[SENSOR_AR] b08 :: IQA=108 :: PM25=68ug/m3 :: RUIM",
        ],
        layers_ativos: { temperatura: [4,4,3], saude: [3,3,2], energia: [4,3,2], agua: [3,2,2], transito: [3,2,1] }
      },
      {
        numero: 4, titulo: "Ilha de Calor Confirmada",
        duracao_min: 2,
        descricao_fase: "Satélite confirma ilha de calor severa. IQA em nível Muito Ruim.",
        efeitos_visiveis: ["Cobertura arbórea: 0% no núcleo da ilha de calor", "IQA 'Muito Ruim' em toda a zona"],
        log_tecnico: [
          "[SATELITE] zona_leste :: NDVI_medio=0.31 :: ilha_calor=CONFIRMADA",
          "[SENSOR_AR] b08 :: IQA=134 :: O3=CRITICO :: PM25=89ug/m3",
          "[SENSOR_ENER] b04 :: carga=99pct :: TRIP_IMINENTE",
          "[SENSOR_SAUDE] b03 :: atend_acum=94 :: casos_graves=12",
          "[SENSOR_VEG] b07 :: NDVI=0.31 :: estresse_hidrico=SEVERO",
        ],
        layers_ativos: { temperatura: [5,5,4], saude: [4,4,3], energia: [5,4,3], agua: [4,3,2], transito: [4,3,2], vegetacao: [2,1,1], ar: [4,3,2] }
      },
      {
        numero: 5, titulo: "Blackout + Colapso de Saúde",
        duracao_min: null,
        descricao_fase: "Subestação em blackout. 340.000 domicílios sem luz. Saúde pública colapsa.",
        efeitos_visiveis: ["Blackout em 3 subestações — 340.000 domicílios", "Saúde pública em colapso localizado"],
        log_tecnico: [
          "[COLAPSO] b04 :: BLACKOUT :: alimentadoras_desligadas=3 :: dom=340000",
          "[COLAPSO] b03 :: UBS_LOTADA :: casos_hora=160 :: transferencia=SIM",
          "[SENSOR_TEMP] b01 :: temp=47.3C :: RECORD_HISTORICO",
          "[SENSOR_AR] b08 :: IQA=182 :: PERIGOSO :: ALERTA_SAUDE_PUBLICA",
          "[SENSOR_VEG] b07 :: NDVI=0.14 :: COLAPSO_VEGETAL",
        ],
        layers_ativos: { temperatura: [5,5,5], saude: [5,5,4], energia: [5,5,5], agua: [5,4,3], transito: [5,4,3], vegetacao: [3,2,2], ar: [5,4,4] }
      }
    ]
  },

  // ═══════════════════════════════════════════════════════
  // CRISE 03 — Enchente no Rio Tietê
  // Causa OCULTA: lixo obstrui comportas da Barragem Edgard de Souza
  // ═══════════════════════════════════════════════════════
  {
    id: 3, nome: "Enchente no Rio Tietê",
    subtitulo: "Osasco · Carapicuíba · Barueri",
    regiao: "Margem do Tietê — Grande Osasco",
    cor: "#1e90ff", icone: "🌊",
    sistemas_primarios: [
      { nome: "Nível Hídrico",       icone: "🌊", layer: "agua" },
      { nome: "Resíduos Sólidos",    icone: "🗑️", layer: "lixo" },
      { nome: "Mobilidade",          icone: "🚗", layer: "transito" },
      { nome: "Solo / Geotécnica",   icone: "🪨", layer: "solo" },
    ],
    conexoes_causa_efeito: [
      { de: "c03", para: "c01", descricao: "Lixo fluvial bloqueia comportas" },
      { de: "c01", para: "c02", descricao: "Subida do nível fecha Marginal" },
      { de: "c04", para: "c06", descricao: "Solo saturado provoca desabamentos" },
      { de: "c01", para: "c05", descricao: "Alagamento ameaça subestação" },
    ],
    layers_afetados: ["agua", "lixo", "transito", "solo", "energia", "saude"],
    ancora_principal: { coords: [-46.822, -23.526], label: "Barragem Edgard de Souza" },
    centro_mapa: [-46.800, -23.525], zoom_inicial: 11.8,
    ancoras: [
      { id: "c01", coords: [-46.822, -23.526], label: "Barragem Edgard de Souza",
        descricao: "Barragem de controle de cheias do Tietê. Operada pela SABESP.",
        layer: "agua", severidade_inicial: 2,
        dados_por_fase: {
          1: { valor: "Nível: +0.8m",    delta: "Acima do normal",  status: "ATENÇÃO" },
          2: { valor: "Nível: +1.4m",    delta: "Comportas 30% abert", status: "ALERTA" },
          3: { valor: "Nível: +2.1m",    delta: "Comportas 60% abert", status: "CRÍTICO" },
          4: { valor: "Nível: +3.2m",    delta: "Risco sangria",    status: "CRÍTICO" },
          5: { valor: "SANGRIA",         delta: "Controle perdido", status: "COLAPSO" },
        }
      },
      { id: "c02", coords: [-46.792, -23.532], label: "Osasco — Marginal Tietê km 18",
        descricao: "Trecho da Marginal Tietê com cota de inundação baixa. Via expressa.",
        layer: "transito", severidade_inicial: 1,
        dados_por_fase: {
          1: { valor: "Vel: 42 km/h",    delta: "Normal",           status: "NORMAL" },
          2: { valor: "Vel: 21 km/h",    delta: "Lentidão",         status: "ATENÇÃO" },
          3: { valor: "Vel: 8 km/h",     delta: "2 faixas alag.",   status: "ALERTA" },
          4: { valor: "PARCIAL",         delta: "3 faixas alag.",   status: "CRÍTICO" },
          5: { valor: "FECHADA",         delta: "Total alagada",    status: "COLAPSO" },
        }
      },
      { id: "c03", coords: [-46.810, -23.520], label: "Tietê — Ilha de Resíduos km 21",
        descricao: "Acúmulo crônico de resíduos sólidos no leito do Tietê.",
        layer: "lixo", severidade_inicial: 3,
        dados_por_fase: {
          1: { valor: "Volume: 340t",    delta: "Acúmulo crônico",  status: "ALERTA" },
          2: { valor: "Volume: 520t",    delta: "Chuva carreou +180t",status: "CRÍTICO" },
          3: { valor: "Volume: 780t",    delta: "Bloqueando comportas",status: "CRÍTICO" },
          4: { valor: "Comporta: 20%",   delta: "Obstrução severa", status: "CRÍTICO" },
          5: { valor: "Comporta: 0%",    delta: "Totalmente obstruída",status: "COLAPSO" },
        }
      },
      { id: "c04", coords: [-46.840, -23.530], label: "Carapicuíba — Várzea Sul",
        descricao: "Área de várzea naturalmente alagável. Ocupação irregular.",
        layer: "solo", severidade_inicial: 1,
        dados_por_fase: {
          1: { valor: "Umid: 68%",       delta: "Solo úmido",       status: "ATENÇÃO" },
          2: { valor: "Umid: 84%",       delta: "Saturação inicia", status: "ALERTA" },
          3: { valor: "Umid: 97%",       delta: "Solo saturado",    status: "CRÍTICO" },
          4: { valor: "ALAGADO",         delta: "Várzea inundada",  status: "CRÍTICO" },
          5: { valor: "COLAPSO",         delta: "Desmoron. registr.",status: "COLAPSO" },
        }
      },
      { id: "c05", coords: [-46.875, -23.503], label: "Barueri — Subestação Norte",
        descricao: "Subestação de 138kV. Cota 724m — risco de inundação.",
        layer: "energia", severidade_inicial: 1,
        dados_por_fase: {
          1: { valor: "OK",              delta: "Normal",           status: "NORMAL" },
          2: { valor: "Monit. elevado",  delta: "Cota agua: 718m", status: "ATENÇÃO" },
          3: { valor: "Alerta",          delta: "Cota agua: 721m", status: "ALERTA" },
          4: { valor: "Risco real",      delta: "Cota agua: 723m", status: "CRÍTICO" },
          5: { valor: "EVACUADA",        delta: "Trip preventivo",  status: "COLAPSO" },
        }
      },
      { id: "c06", coords: [-46.800, -23.540], label: "Osasco — UPA Central",
        descricao: "UPA 24h com capacidade para 200 atendimentos/dia.",
        layer: "saude", severidade_inicial: 1,
        dados_por_fase: {
          1: { valor: "Normal",          delta: "0 casos enchente",status: "NORMAL" },
          2: { valor: "+8 traumas",      delta: "Acidentes viário", status: "ATENÇÃO" },
          3: { valor: "+23 casos",       delta: "Trauma + lepto.",  status: "ALERTA" },
          4: { valor: "+54 casos",       delta: "Superlotada",     status: "CRÍTICO" },
          5: { valor: "ALERTA LEPTO",    delta: "12 internações",  status: "COLAPSO" },
        }
      },
      { id: "c07", coords: [-46.760, -23.510], label: "Osasco — ETA Piratininga",
        descricao: "Estação de Tratamento de Água. Capta do Tietê.",
        layer: "agua", severidade_inicial: 1,
        dados_por_fase: {
          1: { valor: "Turbid: 42 NTU",  delta: "Normal",          status: "NORMAL" },
          2: { valor: "Turbid: 180 NTU", delta: "Chuva eleva",     status: "ATENÇÃO" },
          3: { valor: "Turbid: 890 NTU", delta: "Limite técnico",  status: "ALERTA" },
          4: { valor: "Turbid: 2400 NTU",delta: "ETA sobrecarreg.",status: "CRÍTICO" },
          5: { valor: "PARADA",          delta: "Turbidez > limite",status: "COLAPSO" },
        }
      },
      { id: "c08", coords: [-46.830, -23.515], label: "Carapicuíba — Solo Ribeirinho",
        descricao: "Monitoramento geotécnico das margens do Tietê.",
        layer: "solo", severidade_inicial: 1,
        dados_por_fase: {
          1: { valor: "Estável",         delta: "OK",              status: "NORMAL" },
          2: { valor: "Umid: 78%",       delta: "Margem encharcada",status: "ATENÇÃO" },
          3: { valor: "Desloc: 1.2cm",   delta: "Erosão marginal", status: "ALERTA" },
          4: { valor: "Desloc: 4.8cm",   delta: "Talude instável", status: "CRÍTICO" },
          5: { valor: "DESLIZAMENTO",    delta: "Confirmed",       status: "COLAPSO" },
        }
      },
    ],
    fases: [
      { numero: 1, titulo: "Nível do Tietê em Elevação", duracao_min: 2,
        descricao_fase: "Chuvas acima da média elevam o nível do rio.",
        efeitos_visiveis: ["Sensores de nível em alerta em Osasco e Carapicuíba"],
        log_tecnico: [
          "[SENSOR_H] c01 :: nivel=+0.8m :: normal=0.2m :: STATUS=ATENCAO",
          "[SENSOR_RS] c03 :: volume_lixo=340t :: risco_comporta=MEDIO",
        ],
        layers_ativos: { agua: [2,2,1], lixo: [3,2,1] }
      },
      { numero: 2, titulo: "Marginal Parcialmente Fechada", duracao_min: 2,
        descricao_fase: "Alagamento fecha 2 faixas. Lixo fluvial ameaça comportas.",
        efeitos_visiveis: ["Marginal Tietê sentido Castelo com 2 faixas alagadas", "Lixo fluvial bloqueia comportas"],
        log_tecnico: [
          "[SENSOR_H] c01 :: nivel=+1.4m :: STATUS=ALERTA :: comportas=30pct",
          "[SENSOR_T] c02 :: faixas_alagadas=2 :: vel=21kmh",
          "[SENSOR_RS] c03 :: volume=520t :: bloqueio_comporta=INICIO",
        ],
        layers_ativos: { agua: [3,3,2], lixo: [4,3,2], transito: [3,2,1] }
      },
      { numero: 3, titulo: "Solo Saturado", duracao_min: 2,
        descricao_fase: "Solo das várzeas atinge saturação. Água do Tietê com alta turbidez.",
        efeitos_visiveis: ["Várzea do Carmo com solo saturado a 97%", "ETA com turbidez 20x acima do normal"],
        log_tecnico: [
          "[SENSOR_SOLO] c04 :: umidade=97pct :: STATUS=SATURADO",
          "[SENSOR_H] c07 :: turbidez=890NTU :: limite=500NTU :: STATUS=ALERTA",
          "[SENSOR_H] c01 :: nivel=+2.1m :: comportas=60pct :: STATUS=CRITICO",
        ],
        layers_ativos: { agua: [4,4,3], lixo: [5,4,3], transito: [4,3,2], solo: [3,2,1] }
      },
      { numero: 4, titulo: "Infraestrutura em Risco", duracao_min: 2,
        descricao_fase: "Subestação de energia ameaçada. Nível crítico na barragem.",
        efeitos_visiveis: ["Subestação de Barueri com risco real de inundação", "Nível: 3.2m acima do normal"],
        log_tecnico: [
          "[SENSOR_ENER] c05 :: cota_agua=723m :: cota_segura=724m :: STATUS=CRITICO",
          "[SENSOR_H] c01 :: nivel=+3.2m :: RISCO_SANGRIA=ALTO",
          "[SENSOR_SOLO] c08 :: deslocamento=4.8cm :: talude=INSTAVEL",
          "[SENSOR_SAUDE] c06 :: atend=54 :: lepto_suspeito=8",
        ],
        layers_ativos: { agua: [5,5,4], lixo: [5,5,4], transito: [5,4,3], solo: [4,3,2], energia: [4,3,1] }
      },
      { numero: 5, titulo: "Evacuação Declarada", duracao_min: null,
        descricao_fase: "Barragem em sangria. Evacuação de 3 bairros decretada.",
        efeitos_visiveis: ["Evacuação de 3 bairros ribeirinhos decretada", "12 internações por leptospirose"],
        log_tecnico: [
          "[COLAPSO] c01 :: SANGRIA_ATIVA :: evacuacao=DECRETADA :: bairros=3",
          "[COLAPSO] c03 :: comporta=0pct :: TOTALMENTE_OBSTRUIDA",
          "[COLAPSO] c05 :: TRIP_PREVENTIVO :: subestacao=EVACUADA",
          "[EMERGENCIA] osasco :: nivel_crise=5 :: pop_evacuada=12000",
        ],
        layers_ativos: { agua: [5,5,5], lixo: [5,5,5], transito: [5,5,4], solo: [5,4,3], energia: [5,4,3], saude: [4,3,2] }
      }
    ]
  },

  // ═══════════════════════════════════════════════════════
  // CRISE 04 — Blackout em Cascata — Centro
  // Causa OCULTA: sobrecarga na subestação Bandeirantes
  // ═══════════════════════════════════════════════════════
  {
    id: 4, nome: "Blackout em Cascata — Centro",
    subtitulo: "Centro Histórico · Santa Ifigênia · Bom Retiro",
    regiao: "Centro de São Paulo",
    cor: "#ffd700", icone: "⚡",
    sistemas_primarios: [
      { nome: "Rede Elétrica",       icone: "⚡",  layer: "energia" },
      { nome: "Mobilidade",          icone: "🚗",  layer: "transito" },
      { nome: "Saúde Hospitalar",    icone: "🏥",  layer: "saude" },
      { nome: "Abastecimento Hídrico",icone: "💧", layer: "agua" },
    ],
    conexoes_causa_efeito: [
      { de: "d01", para: "d03", descricao: "Blackout desliga semáforos" },
      { de: "d01", para: "d04", descricao: "Bombas d'água param" },
      { de: "d03", para: "d08", descricao: "Caos no trânsito paralisa ônibus" },
      { de: "d01", para: "d02", descricao: "Hospital opera em gerador" },
    ],
    layers_afetados: ["energia", "transito", "saude", "agua", "lixo", "ar"],
    ancora_principal: { coords: [-46.664, -23.536], label: "Subestação Bandeirantes" },
    centro_mapa: [-46.652, -23.538], zoom_inicial: 13,
    ancoras: [
      { id: "d01", coords: [-46.664, -23.536], label: "Subestação Bandeirantes — 138kV",
        descricao: "Principal subestação do centro histórico. Alimenta 280.000 domicílios.",
        layer: "energia", severidade_inicial: 3,
        dados_por_fase: {
          1: { valor: "Carga: 78%",      delta: "Pico industrial",  status: "ATENÇÃO" },
          2: { valor: "Carga: 91%",      delta: "Sobrecarga inicia",status: "ALERTA" },
          3: { valor: "Carga: 98%",      delta: "Trip iminente",    status: "CRÍTICO" },
          4: { valor: "BLACKOUT P1",     delta: "50% da área",      status: "COLAPSO" },
          5: { valor: "BLACKOUT TOTAL",  delta: "280.000 dom.",     status: "COLAPSO" },
        }
      },
      { id: "d02", coords: [-46.645, -23.538], label: "Santa Casa de Misericórdia",
        descricao: "Hospital histórico com 720 leitos. UTI com 40 pacientes críticos.",
        layer: "saude", severidade_inicial: 1,
        dados_por_fase: {
          1: { valor: "Normal",          delta: "Rede elétrica OK", status: "NORMAL" },
          2: { valor: "Gerador standby", delta: "Tensão instável",  status: "ATENÇÃO" },
          3: { valor: "Gerador ativo",   delta: "Rede falhou",      status: "ALERTA" },
          4: { valor: "Gerador critico", delta: "Combustível 60%",  status: "CRÍTICO" },
          5: { valor: "UTI EVACUANDO",   delta: "Combust: 8%",     status: "COLAPSO" },
        }
      },
      { id: "d03", coords: [-46.655, -23.530], label: "Centro — Cruzamento República",
        descricao: "Cruzamento com maior volume de pedestres do Brasil. 120.000/dia.",
        layer: "transito", severidade_inicial: 1,
        dados_por_fase: {
          1: { valor: "Normal",          delta: "Semáforos OK",     status: "NORMAL" },
          2: { valor: "Piscando",        delta: "10 semáforos off", status: "ATENÇÃO" },
          3: { valor: "40 apagados",     delta: "Caos inicia",      status: "ALERTA" },
          4: { valor: "200 apagados",    delta: "Acidentes: 12",    status: "CRÍTICO" },
          5: { valor: "CAOS TOTAL",      delta: "Acidentes: 34",   status: "COLAPSO" },
        }
      },
      { id: "d04", coords: [-46.670, -23.545], label: "Bom Retiro — Bomba d'Água BT-3",
        descricao: "Estação elevatória que abastece 80.000 moradores do centro.",
        layer: "agua", severidade_inicial: 1,
        dados_por_fase: {
          1: { valor: "Normal",          delta: "Bomba OK",         status: "NORMAL" },
          2: { valor: "Tensão baixa",    delta: "Bomba instável",   status: "ATENÇÃO" },
          3: { valor: "Bomba parada",    delta: "Sem energia",      status: "CRÍTICO" },
          4: { valor: "Reserv: 34%",     delta: "Consumindo",       status: "CRÍTICO" },
          5: { valor: "Reserv: 4%",      delta: "Colapso iminente", status: "COLAPSO" },
        }
      },
      { id: "d05", coords: [-46.635, -23.542], label: "Santa Ifigênia — Câmaras Frias",
        descricao: "Câmaras frigoríficas do maior polo de eletroeletrônicos do Brasil.",
        layer: "lixo", severidade_inicial: 1,
        dados_por_fase: {
          1: { valor: "Online",          delta: "Triagem normal",   status: "NORMAL" },
          2: { valor: "Oscilando",       delta: "UPS ativo",        status: "ATENÇÃO" },
          3: { valor: "UPS esgotando",   delta: "2h de autonomia",  status: "ALERTA" },
          4: { valor: "Offline",         delta: "Perdas: R$2.4M",  status: "CRÍTICO" },
          5: { valor: "PERDAS TOTAIS",   delta: "R$8.7M perdidos", status: "COLAPSO" },
        }
      },
      { id: "d06", coords: [-46.650, -23.520], label: "Luz — Subestação Secundária",
        descricao: "Subestação de distribuição 13.8kV. Alimenta Luz, Bom Retiro e Brás.",
        layer: "energia", severidade_inicial: 2,
        dados_por_fase: {
          1: { valor: "Carga: 68%",      delta: "Normal",           status: "NORMAL" },
          2: { valor: "Carga: 82%",      delta: "Cascata inicia",   status: "ALERTA" },
          3: { valor: "Carga: 95%",      delta: "Sobrecarga",       status: "CRÍTICO" },
          4: { valor: "BLACKOUT",        delta: "Bairros: 4",       status: "COLAPSO" },
          5: { valor: "BLACKOUT",        delta: "Total",            status: "COLAPSO" },
        }
      },
      { id: "d07", coords: [-46.680, -23.535], label: "Barra Funda — Monit. CO₂",
        descricao: "Sensor de qualidade do ar. Mede CO₂, CO e partículas.",
        layer: "ar", severidade_inicial: 1,
        dados_por_fase: {
          1: { valor: "CO₂: 412 ppm",    delta: "Normal urbano",   status: "NORMAL" },
          2: { valor: "CO: 3.2 ppm",     delta: "Geradores ligados",status: "ATENÇÃO" },
          3: { valor: "CO: 8.9 ppm",     delta: "Geradores diesel", status: "ALERTA" },
          4: { valor: "CO: 18.4 ppm",    delta: "Limite OMS: 9ppm",status: "CRÍTICO" },
          5: { valor: "CO: 34.1 ppm",    delta: "PERIGOSO",        status: "COLAPSO" },
        }
      },
      { id: "d08", coords: [-46.640, -23.550], label: "Brás — Terminal Bresser",
        descricao: "Terminal intermodal com 120.000 passageiros/dia.",
        layer: "transito", severidade_inicial: 1,
        dados_por_fase: {
          1: { valor: "Normal",          delta: "Fluxo OK",         status: "NORMAL" },
          2: { valor: "Lentidão",        delta: "Semáf. piscando",  status: "ATENÇÃO" },
          3: { valor: "Caos parcial",    delta: "8 ônibus parados", status: "ALERTA" },
          4: { valor: "Paralizado",      delta: "Terminal fechado", status: "CRÍTICO" },
          5: { valor: "FECHADO",         delta: "Metro tbm parado", status: "COLAPSO" },
        }
      },
    ],
    fases: [
      { numero: 1, titulo: "Flutuação na Rede Elétrica", duracao_min: 2,
        descricao_fase: "Variações de tensão detectadas na rede do centro-oeste.",
        efeitos_visiveis: ["Oscilações de tensão detectadas em 3 subestações"],
        log_tecnico: [
          "[SENSOR_ENER] d01 :: carga=78pct :: pico_industrial=NOTURNO",
          "[SENSOR_ENER] d06 :: tensao_var=±8pct :: status=MONIT",
        ],
        layers_ativos: { energia: [3,2,1] }
      },
      { numero: 2, titulo: "Semáforos Apagados", duracao_min: 2,
        descricao_fase: "40 cruzamentos sem semáforos. Acidentes começam.",
        efeitos_visiveis: ["40 cruzamentos com semáforos sem energia", "Primeiros acidentes registrados"],
        log_tecnico: [
          "[SENSOR_ENER] d01 :: carga=91pct :: STATUS=SOBRECARGA",
          "[SENSOR_T] d03 :: semaforos_off=40 :: acidentes=3",
          "[SENSOR_ENER] d06 :: carga=82pct :: cascata_inicio=SIM",
        ],
        layers_ativos: { energia: [4,3,2], transito: [3,2,2] }
      },
      { numero: 3, titulo: "Hospital em Gerador", duracao_min: 2,
        descricao_fase: "Santa Casa ativa gerador. Bombas d'água param.",
        efeitos_visiveis: ["Santa Casa em gerador de emergência", "Bomba d'água BT-3 parada"],
        log_tecnico: [
          "[SENSOR_SAUDE] d02 :: gerador=ATIVO :: combustivel=100pct",
          "[SENSOR_H] d04 :: bomba=PARADA :: sem_energia=SIM",
          "[SENSOR_ENER] d01 :: carga=98pct :: TRIP_IMINENTE",
          "[SENSOR_AR] d07 :: CO=8.9ppm :: geradores_diesel=DETECTADOS",
        ],
        layers_ativos: { energia: [5,4,3], transito: [4,3,2], saude: [3,2,1], agua: [3,2,1] }
      },
      { numero: 4, titulo: "Sistemas de Monitoramento Offline", duracao_min: 2,
        descricao_fase: "Blackout parcial. 50% da área sem energia.",
        efeitos_visiveis: ["Câmaras frias de Santa Ifigênia offline", "Blackout em 50% da área central"],
        log_tecnico: [
          "[COLAPSO] d01 :: BLACKOUT_PARCIAL :: dom_afetados=140000",
          "[SENSOR_RS] d05 :: camaras_frias=OFFLINE :: perdas=R$2.4M",
          "[SENSOR_SAUDE] d02 :: gerador=CRITICO :: combustivel=60pct",
          "[SENSOR_T] d03 :: semaforos_off=200 :: acidentes=12",
        ],
        layers_ativos: { energia: [5,5,4], transito: [5,4,3], saude: [4,3,2], agua: [4,3,2], lixo: [3,2,1], ar: [2,1,1] }
      },
      { numero: 5, titulo: "200k Domicílios sem Luz", duracao_min: null,
        descricao_fase: "Blackout total. Metrô parado. UTI da Santa Casa evacuando.",
        efeitos_visiveis: ["280.000 domicílios sem energia", "Metrô Linha 2-Verde parado", "UTI da Santa Casa evacuada"],
        log_tecnico: [
          "[COLAPSO] d01 :: BLACKOUT_TOTAL :: dom_afetados=280000",
          "[COLAPSO] d02 :: UTI_EVACUANDO :: gerador_combustivel=8pct",
          "[COLAPSO] d06 :: BLACKOUT :: bairros_afetados=7",
          "[EMERGENCIA] centro_sp :: nivel_crise=5 :: metro_L2=PARADO",
          "[SENSOR_AR] d07 :: CO=34.1ppm :: NIVEL_PERIGOSO",
        ],
        layers_ativos: { energia: [5,5,5], transito: [5,5,4], saude: [5,4,4], agua: [5,4,3], lixo: [4,3,2], ar: [3,2,2] }
      }
    ]
  },

  // ═══════════════════════════════════════════════════════
  // CRISE 05 — Colapso de Resíduos em Guarulhos
  // Causa OCULTA: greve de garis + incêndio em aterro
  // ═══════════════════════════════════════════════════════
  {
    id: 5, nome: "Colapso de Resíduos — Guarulhos",
    subtitulo: "Aterro Municipal · GRU Airport · Rio Baquirivu",
    regiao: "Guarulhos — Grande São Paulo",
    cor: "#8b4513", icone: "🗑️",
    sistemas_primarios: [
      { nome: "Gestão de Resíduos",  icone: "🗑️", layer: "lixo" },
      { nome: "Qualidade do Ar",     icone: "💨", layer: "ar" },
      { nome: "Recursos Hídricos",   icone: "💧", layer: "agua" },
      { nome: "Saúde Respiratória",  icone: "🏥", layer: "saude" },
    ],
    conexoes_causa_efeito: [
      { de: "e01", para: "e03", descricao: "Fumaça do aterro polui o ar" },
      { de: "e01", para: "e04", descricao: "Lixiviado contamina solo" },
      { de: "e04", para: "e02", descricao: "Solo contaminado atinge rio" },
      { de: "e03", para: "e06", descricao: "Ar poluído superlota UBS" },
    ],
    layers_afetados: ["lixo", "ar", "solo", "agua", "temperatura", "saude"],
    ancora_principal: { coords: [-46.503, -23.430], label: "Aterro Municipal de Guarulhos" },
    centro_mapa: [-46.490, -23.435], zoom_inicial: 11.5,
    ancoras: [
      { id: "e01", coords: [-46.503, -23.430], label: "Aterro CTR Guarulhos",
        descricao: "Central de Tratamento de Resíduos. Capacidade: 1.800t/dia.",
        layer: "lixo", severidade_inicial: 4,
        dados_por_fase: {
          1: { valor: "Coleta: 0%",      delta: "Greve dia 1",      status: "CRÍTICO" },
          2: { valor: "Incêndio: 2ha",   delta: "Fogo no aterro",   status: "CRÍTICO" },
          3: { valor: "Incêndio: 8ha",   delta: "Fogo se alastra",  status: "CRÍTICO" },
          4: { valor: "Incêndio: 22ha",  delta: "Fora de controle", status: "COLAPSO" },
          5: { valor: "Incêndio: 40ha",  delta: "Bombeiros: 12 viat",status: "COLAPSO" },
        }
      },
      { id: "e02", coords: [-46.478, -23.456], label: "Rio Baquirivu-Guaçu — km 14",
        descricao: "Principal afluente do Tietê em Guarulhos. Abastece 400.000 pessoas.",
        layer: "agua", severidade_inicial: 1,
        dados_por_fase: {
          1: { valor: "Normal",          delta: "Qualidade OK",     status: "NORMAL" },
          2: { valor: "Turbid: +40%",    delta: "Lixiviado inicia", status: "ATENÇÃO" },
          3: { valor: "DBO: 180 mg/L",   delta: "Contam. moderada", status: "ALERTA" },
          4: { valor: "DBO: 890 mg/L",   delta: "Poluição severa",  status: "CRÍTICO" },
          5: { valor: "INTERDITO",       delta: "Peixe morto",      status: "COLAPSO" },
        }
      },
      { id: "e03", coords: [-46.510, -23.420], label: "Cumbica — Estação CETESB GRU",
        descricao: "Estação de monitoramento próxima ao aeroporto GRU.",
        layer: "ar", severidade_inicial: 2,
        dados_por_fase: {
          1: { valor: "IQA: 66 (Mod)",   delta: "Leve fumaça",      status: "ATENÇÃO" },
          2: { valor: "IQA: 114 (Ruim)", delta: "Fumaça do aterro", status: "CRÍTICO" },
          3: { valor: "IQA: 156 (MRuim)",delta: "PM2.5=142µg/m³",  status: "CRÍTICO" },
          4: { valor: "IQA: 189 (Péss)", delta: "Fuligem visível",  status: "COLAPSO" },
          5: { valor: "IQA: 216 (Péss)", delta: "NÍVEL PERIGOSO",  status: "COLAPSO" },
        }
      },
      { id: "e04", coords: [-46.490, -23.440], label: "Guarulhos — Solo CTR Sul",
        descricao: "Zona de monitoramento de lixiviado. Sensores geoquímicos.",
        layer: "solo", severidade_inicial: 1,
        dados_por_fase: {
          1: { valor: "pH: 7.2",         delta: "Normal",           status: "NORMAL" },
          2: { valor: "pH: 5.8",         delta: "Acidificação",     status: "ATENÇÃO" },
          3: { valor: "Lixiviado: det.", delta: "Vazamento",        status: "ALERTA" },
          4: { valor: "DBO solo: alt.",  delta: "Contam. severa",   status: "CRÍTICO" },
          5: { valor: "SOLO TÓXICO",     delta: "Área interditada", status: "COLAPSO" },
        }
      },
      { id: "e05", coords: [-46.520, -23.435], label: "Guarulhos — Ponto Coleta R12",
        descricao: "Ponto de coleta residencial. Bairro Jardim Tranquilidade.",
        layer: "lixo", severidade_inicial: 2,
        dados_por_fase: {
          1: { valor: "2 dias parado",   delta: "Greve ativa",      status: "CRÍTICO" },
          2: { valor: "3 dias parado",   delta: "Lixo nas calçadas",status: "CRÍTICO" },
          3: { valor: "4 dias parado",   delta: "Ruas intransitáveis",status: "CRÍTICO" },
          4: { valor: "5 dias parado",   delta: "Fauna sinantrópica",status: "COLAPSO" },
          5: { valor: "6 dias parado",   delta: "Surto de roedores",status: "COLAPSO" },
        }
      },
      { id: "e06", coords: [-46.465, -23.445], label: "Jardim Tranquilidade — UBS",
        descricao: "UBS com 900 atendimentos/dia. Especialidade em respiratório.",
        layer: "saude", severidade_inicial: 1,
        dados_por_fase: {
          1: { valor: "Normal",          delta: "0 casos resp.",    status: "NORMAL" },
          2: { valor: "+22 resp.",        delta: "Crianças/idosos",  status: "ATENÇÃO" },
          3: { valor: "+68 resp.",        delta: "Nebulizando",      status: "ALERTA" },
          4: { valor: "+134 resp.",       delta: "Lotada",           status: "CRÍTICO" },
          5: { valor: "LOTADA",          delta: "+200 casos/hora",  status: "COLAPSO" },
        }
      },
      { id: "e07", coords: [-46.498, -23.415], label: "GRU Airport — ATIS Meteorologia",
        descricao: "Monitoramento meteorológico e de visibilidade do Aeroporto Internacional.",
        layer: "ar", severidade_inicial: 1,
        dados_por_fase: {
          1: { valor: "Visib: 9.8km",    delta: "CAVOK",            status: "NORMAL" },
          2: { valor: "Visib: 6.2km",    delta: "Fumaça detectada", status: "ATENÇÃO" },
          3: { valor: "Visib: 3.4km",    delta: "SIGMET emitido",   status: "ALERTA" },
          4: { valor: "Visib: 1.8km",    delta: "Pousos alterados", status: "CRÍTICO" },
          5: { valor: "Visib: 0.6km",    delta: "AEROPORTO ALERT",  status: "COLAPSO" },
        }
      },
      { id: "e08", coords: [-46.515, -23.450], label: "Guarulhos — Temp. Fumaça/Solo",
        descricao: "Sensor de temperatura de superfície. Detecta focos de calor.",
        layer: "temperatura", severidade_inicial: 1,
        dados_por_fase: {
          1: { valor: "28.4°C",          delta: "Normal",           status: "NORMAL" },
          2: { valor: "Foco: 340°C",     delta: "Incêndio inicia",  status: "CRÍTICO" },
          3: { valor: "Foco: 680°C",     delta: "Alastramento",     status: "CRÍTICO" },
          4: { valor: "Foco: 1100°C",    delta: "Fora de controle", status: "COLAPSO" },
          5: { valor: "Foco: 1400°C",    delta: "Risco explosão",   status: "COLAPSO" },
        }
      },
    ],
    fases: [
      { numero: 1, titulo: "Acúmulo Detectado", duracao_min: 2,
        descricao_fase: "Greve de garis entra no segundo dia. Lixo acumula nas ruas.",
        efeitos_visiveis: ["8 pontos críticos de lixo em Guarulhos sem coleta há 2 dias"],
        log_tecnico: [
          "[SENSOR_RS] e01 :: coleta=0pct :: greve_dia=2 :: STATUS=CRITICO",
          "[SENSOR_RS] e05 :: acumulo=VISIVEL :: reclam_311=234",
          "[SENSOR_AR] e03 :: IQA=66 :: leve_fumaca=SIM",
        ],
        layers_ativos: { lixo: [4,3,2], ar: [2,1,1] }
      },
      { numero: 2, titulo: "Fumaça do Aterro", duracao_min: 2,
        descricao_fase: "Incêndio inicia no aterro. IQA Muito Ruim. Casos respiratórios disparam.",
        efeitos_visiveis: ["Incêndio de 2ha no CTR", "IQA 'Muito Ruim' — fumaça visível de 20km"],
        log_tecnico: [
          "[INCENDIO] e01 :: area=2ha :: STATUS=ATIVO :: bombeiros=ACIONADOS",
          "[SENSOR_AR] e03 :: IQA=114 :: PM25=88ug/m3 :: STATUS=RUIM",
          "[SENSOR_SAUDE] e06 :: atend_resp=22 :: STATUS=ATENCAO",
          "[SENSOR_SOLO] e04 :: pH=5.8 :: acidificacao=INICIO",
        ],
        layers_ativos: { lixo: [5,4,3], ar: [4,3,2], saude: [2,2,1], temperatura: [2,1,1] }
      },
      { numero: 3, titulo: "Solo Contaminado", duracao_min: 2,
        descricao_fase: "Lixiviado detectado. Baquirivu-Guaçu ameaçado.",
        efeitos_visiveis: ["Lixiviado detectado próximo ao Rio Baquirivu-Guaçu"],
        log_tecnico: [
          "[SENSOR_SOLO] e04 :: lixiviado=DETECTADO :: contam=MODERADA",
          "[SENSOR_H] e02 :: DBO=180mgL :: contaminacao=INICIO",
          "[SENSOR_AR] e03 :: IQA=156 :: PM25=142ug/m3 :: STATUS=MRUIM",
          "[INCENDIO] e01 :: area=8ha :: alastramento=RAPIDO",
        ],
        layers_ativos: { lixo: [5,5,4], ar: [5,4,3], saude: [3,2,2], temperatura: [3,2,1], solo: [3,2,1] }
      },
      { numero: 4, titulo: "Mananciais Ameaçados", duracao_min: 2,
        descricao_fase: "GRU Airport com visibilidade reduzida. Pousos alterados.",
        efeitos_visiveis: ["Aeroporto GRU com visibilidade 1.8km — pousos alterados"],
        log_tecnico: [
          "[SENSOR_H] e02 :: DBO=890mgL :: STATUS=POLUIDO",
          "[SENSOR_AR] e07 :: visib=1.8km :: pousos_alterados=SIM :: SIGMET=ATIVO",
          "[SENSOR_AR] e03 :: IQA=189 :: PESSIMO :: PM25=210ug/m3",
          "[SENSOR_SAUDE] e06 :: atend_resp=134 :: UBS_lotada=SIM",
        ],
        layers_ativos: { lixo: [5,5,5], ar: [5,5,4], saude: [4,3,2], temperatura: [3,3,2], solo: [4,3,2], agua: [3,2,1] }
      },
      { numero: 5, titulo: "Emergência Ambiental", duracao_min: null,
        descricao_fase: "Estado de emergência ambiental declarado em Guarulhos.",
        efeitos_visiveis: ["3 escolas fechadas por fumaça", "Rio interditado", "GRU em alerta"],
        log_tecnico: [
          "[EMERGENCIA] guarulhos :: nivel_crise=5 :: escolas_fechadas=3",
          "[COLAPSO] e01 :: incendio=40ha :: bombeiros=12viaturas",
          "[COLAPSO] e02 :: INTERDITO :: peixe_morto=SIM :: DBO=incontrolavel",
          "[COLAPSO] e07 :: visib=0.6km :: AEROPORTO_ALERTA",
          "[COLAPSO] e03 :: IQA=216 :: PERIGOSO :: saude_publica=EMERGENCIA",
        ],
        layers_ativos: { lixo: [5,5,5], ar: [5,5,5], saude: [5,4,3], temperatura: [4,3,3], solo: [5,4,3], agua: [5,4,3] }
      }
    ]
  },

  // ═══════════════════════════════════════════════════════
  // CRISE 06 — Deslizamento em Parelheiros
  // Causa OCULTA: desmatamento irregular + chuva intensa
  // ═══════════════════════════════════════════════════════
  {
    id: 6, nome: "Deslizamento em Parelheiros",
    subtitulo: "Parelheiros · Marsilac · Grajaú",
    regiao: "Extremo Sul de São Paulo",
    cor: "#8b6914", icone: "⛰️",
    sistemas_primarios: [
      { nome: "Geotécnica / Solo",   icone: "🪨", layer: "solo" },
      { nome: "Cobertura Vegetal",   icone: "🌿", layer: "vegetacao" },
      { nome: "Recursos Hídricos",   icone: "💧", layer: "agua" },
      { nome: "Mobilidade",          icone: "🚗", layer: "transito" },
    ],
    conexoes_causa_efeito: [
      { de: "f02", para: "f01", descricao: "Sem vegetação, solo não retém água" },
      { de: "f01", para: "f03", descricao: "Solo saturado transborda córregos" },
      { de: "f01", para: "f04", descricao: "Deslizamento bloqueia via" },
      { de: "f04", para: "f05", descricao: "Bloqueio derruba poste" },
    ],
    layers_afetados: ["solo", "vegetacao", "agua", "transito", "energia", "saude"],
    ancora_principal: { coords: [-46.727, -23.827], label: "Parelheiros — Encosta Norte" },
    centro_mapa: [-46.740, -23.840], zoom_inicial: 11.5,
    ancoras: [
      { id: "f01", coords: [-46.727, -23.827], label: "Parelheiros — Encosta Norte Z1",
        descricao: "Encosta com inclinação de 35°. Monitorada desde 2010.",
        layer: "solo", severidade_inicial: 3,
        dados_por_fase: {
          1: { valor: "Umid: 74%",       delta: "Chuva acumulada",  status: "ALERTA" },
          2: { valor: "Umid: 89%",       delta: "Solo encharcado",  status: "CRÍTICO" },
          3: { valor: "Deslocam: 2.8cm", delta: "Movimento inicia", status: "CRÍTICO" },
          4: { valor: "Deslocam: 14cm",  delta: "Deslizamento ativo",status: "COLAPSO" },
          5: { valor: "COLAPSO",         delta: "Massa: 12.000t",   status: "COLAPSO" },
        }
      },
      { id: "f02", coords: [-46.784, -23.959], label: "Marsilac — Borda de Mata",
        descricao: "Área de transição floresta/ocupação. NDVI monitorado.",
        layer: "vegetacao", severidade_inicial: 2,
        dados_por_fase: {
          1: { valor: "NDVI: 0.42",      delta: "Degradação crônica",status: "ALERTA" },
          2: { valor: "NDVI: 0.38",      delta: "Desmat. irregular", status: "ALERTA" },
          3: { valor: "NDVI: 0.29",      delta: "Área exposta +18%", status: "CRÍTICO" },
          4: { valor: "NDVI: 0.21",      delta: "Solo nu expostos",  status: "CRÍTICO" },
          5: { valor: "NDVI: 0.11",      delta: "Erosão severa",    status: "COLAPSO" },
        }
      },
      { id: "f03", coords: [-46.710, -23.840], label: "Parelheiros — Córrego do Saibro",
        descricao: "Córrego que drena a bacia sul de Parelheiros.",
        layer: "agua", severidade_inicial: 1,
        dados_por_fase: {
          1: { valor: "Nível: 0.4m",     delta: "Cheia inicia",     status: "ATENÇÃO" },
          2: { valor: "Nível: 0.9m",     delta: "Acima da cota",    status: "ALERTA" },
          3: { valor: "Nível: 1.4m",     delta: "Transbordando",    status: "CRÍTICO" },
          4: { valor: "Nível: 2.1m",     delta: "Inundação ruas",   status: "CRÍTICO" },
          5: { valor: "Nível: 2.8m",     delta: "Risco enchente",   status: "COLAPSO" },
        }
      },
      { id: "f04", coords: [-46.735, -23.820], label: "Estrada de Parelheiros km 42",
        descricao: "Única via de acesso ao extremo sul. 8.000 veículos/dia.",
        layer: "transito", severidade_inicial: 1,
        dados_por_fase: {
          1: { valor: "Normal",          delta: "Via liberada",      status: "NORMAL" },
          2: { valor: "Buracos",         delta: "Pista escorregadia",status: "ATENÇÃO" },
          3: { valor: "1 faixa",         delta: "Pedras na pista",   status: "ALERTA" },
          4: { valor: "BLOQUEADA",       delta: "Deslizamento km42", status: "COLAPSO" },
          5: { valor: "BLOQUEADA",       delta: "2 deslizamentos",   status: "COLAPSO" },
        }
      },
      { id: "f05", coords: [-46.750, -23.835], label: "Parelheiros — Poste MT-234",
        descricao: "Poste de média tensão na encosta. Alimenta 4.200 famílias.",
        layer: "energia", severidade_inicial: 1,
        dados_por_fase: {
          1: { valor: "Normal",          delta: "OK",                status: "NORMAL" },
          2: { valor: "Oscilando",       delta: "Vento + chuva",     status: "ATENÇÃO" },
          3: { valor: "Inclinado",       delta: "Solo cedendo",      status: "ALERTA" },
          4: { valor: "CAÍDO",           delta: "4.200 fam. sem luz",status: "COLAPSO" },
          5: { valor: "CAÍDO",           delta: "Risco eletrocussão",status: "COLAPSO" },
        }
      },
      { id: "f06", coords: [-46.715, -23.850], label: "Grajaú — UBS São Luís",
        descricao: "UBS mais próxima. 18km do local do deslizamento.",
        layer: "saude", severidade_inicial: 1,
        dados_por_fase: {
          1: { valor: "Normal",          delta: "0 vítimas",         status: "NORMAL" },
          2: { valor: "+3 traumas",       delta: "Quedas na chuva",  status: "ATENÇÃO" },
          3: { valor: "+11 traumas",      delta: "Acidentes via",    status: "ALERTA" },
          4: { valor: "+29 vítimas",      delta: "Desliz. atingiu",  status: "CRÍTICO" },
          5: { valor: "+52 vítimas",      delta: "28 graves",        status: "COLAPSO" },
        }
      },
      { id: "f07", coords: [-46.760, -23.845], label: "Marsilac — Zona de Recarga Hídrica",
        descricao: "Área de recarga do manancial Billings. Proteção legal.",
        layer: "vegetacao", severidade_inicial: 2,
        dados_por_fase: {
          1: { valor: "NDVI: 0.61",      delta: "Estresse moderado", status: "ATENÇÃO" },
          2: { valor: "NDVI: 0.54",      delta: "Pressão urbana",    status: "ATENÇÃO" },
          3: { valor: "NDVI: 0.44",      delta: "Ocupação irregular",status: "ALERTA" },
          4: { valor: "NDVI: 0.32",      delta: "Degradação severa", status: "CRÍTICO" },
          5: { valor: "NDVI: 0.18",      delta: "Billings em risco", status: "COLAPSO" },
        }
      },
      { id: "f08", coords: [-46.720, -23.860], label: "Grajaú — Solo Instável Z2",
        descricao: "Segunda zona de risco geotécnico. Distância: 1.2km da Z1.",
        layer: "solo", severidade_inicial: 2,
        dados_por_fase: {
          1: { valor: "Umid: 68%",       delta: "Monitorando",       status: "ATENÇÃO" },
          2: { valor: "Umid: 81%",       delta: "Saturando",         status: "ALERTA" },
          3: { valor: "Umid: 94%",       delta: "Quase saturado",    status: "CRÍTICO" },
          4: { valor: "Deslocam: 6cm",   delta: "Movimento",         status: "CRÍTICO" },
          5: { valor: "DESLIZAMENTO",    delta: "Confirmado",        status: "COLAPSO" },
        }
      },
    ],
    fases: [
      { numero: 1, titulo: "Saturação do Solo", duracao_min: 2,
        descricao_fase: "Chuva de 180mm em 24h satura encostas de Parelheiros.",
        efeitos_visiveis: ["Saturação de solo detectada em encostas críticas"],
        log_tecnico: [
          "[SENSOR_SOLO] f01 :: umidade=74pct :: chuva_acum=180mm :: STATUS=ALERTA",
          "[SENSOR_VEG] f02 :: NDVI=0.42 :: degradacao=CRONICA",
        ],
        layers_ativos: { solo: [3,2,2], vegetacao: [2,2,1] }
      },
      { numero: 2, titulo: "Cobertura Vegetal Crítica", duracao_min: 2,
        descricao_fase: "Sem vegetação para reter a água, encostas atingem 89% de umidade.",
        efeitos_visiveis: ["NDVI mínimo detectado — solo exposto nas bordas"],
        log_tecnico: [
          "[SENSOR_SOLO] f01 :: umidade=89pct :: STATUS=CRITICO",
          "[SENSOR_VEG] f02 :: NDVI=0.38 :: desmatamento_ilegal=DETECTADO",
          "[SENSOR_H] f03 :: nivel_corrego=0.9m :: cota_alerta=0.8m",
        ],
        layers_ativos: { solo: [4,3,2], vegetacao: [3,2,2], agua: [2,1,1] }
      },
      { numero: 3, titulo: "Vias Bloqueadas", duracao_min: 2,
        descricao_fase: "Estrada de Parelheiros com pedras na pista. Córrego transbordando.",
        efeitos_visiveis: ["Estrada de Parelheiros com 1 faixa — pedras na pista"],
        log_tecnico: [
          "[SENSOR_SOLO] f01 :: deslocamento=2.8cm :: movimento_ATIVO",
          "[SENSOR_H] f03 :: nivel=1.4m :: TRANSBORDANDO",
          "[SENSOR_T] f04 :: faixas_livres=1 :: pedras_via=SIM",
          "[SENSOR_VEG] f07 :: NDVI=0.44 :: ocupacao_irregular=SIM",
        ],
        layers_ativos: { solo: [4,4,3], vegetacao: [3,3,2], agua: [3,2,2], transito: [4,3,1] }
      },
      { numero: 4, titulo: "Infraestrutura Danificada", duracao_min: 2,
        descricao_fase: "Deslizamento km 42. Poste caído. 29 vítimas.",
        efeitos_visiveis: ["Poste MT-234 caído — 4.200 famílias sem luz", "Estrada bloqueada"],
        log_tecnico: [
          "[COLAPSO] f04 :: BLOQUEADA :: deslizamento_km42=CONFIRMADO",
          "[COLAPSO] f05 :: POSTE_CAIDO :: familias_sem_luz=4200",
          "[SENSOR_SAUDE] f06 :: vitimas=29 :: graves=8",
          "[SENSOR_SOLO] f08 :: deslocamento=6cm :: STATUS=CRITICO",
        ],
        layers_ativos: { solo: [5,4,4], vegetacao: [4,3,2], agua: [4,3,3], transito: [5,4,2], energia: [4,3,1], saude: [3,2,1] }
      },
      { numero: 5, titulo: "3 Deslizamentos Confirmados", duracao_min: null,
        descricao_fase: "Defesa Civil declara estado de emergência. 52 vítimas.",
        efeitos_visiveis: ["3 deslizamentos ativos", "52 vítimas — 28 graves", "Billings em risco"],
        log_tecnico: [
          "[EMERGENCIA] parelheiros :: nivel_crise=5 :: deslizamentos=3",
          "[COLAPSO] f01 :: massa_deslocada=12000t :: STATUS=COLAPSO",
          "[COLAPSO] f08 :: DESLIZAMENTO_CONFIRMADO",
          "[SENSOR_SAUDE] f06 :: vitimas=52 :: graves=28 :: SAMU=OPERANDO",
          "[COLAPSO] f07 :: NDVI=0.18 :: billings_em_risco=SIM",
        ],
        layers_ativos: { solo: [5,5,5], vegetacao: [5,4,3], agua: [5,4,4], transito: [5,5,3], energia: [5,4,2], saude: [4,3,2] }
      }
    ]
  },

  // ═══════════════════════════════════════════════════════
  // CRISE 07 — Crise de Ar na RMSP
  // Causa OCULTA: inversão térmica + queimadas no cinturão metropolitan
  // ═══════════════════════════════════════════════════════
  {
    id: 7, nome: "Crise de Qualidade do Ar — RMSP",
    subtitulo: "Mogi das Cruzes · Suzano · Itaquaquecetuba",
    regiao: "Alto Tietê — Leste da RMSP",
    cor: "#9400d3", icone: "💨",
    sistemas_primarios: [
      { nome: "Qualidade do Ar",     icone: "💨", layer: "ar" },
      { nome: "Saúde Respiratória",  icone: "🏥", layer: "saude" },
      { nome: "Temperatura / Inv.", icone: "🌡️", layer: "temperatura" },
      { nome: "Cobertura Vegetal",   icone: "🌿", layer: "vegetacao" },
    ],
    conexoes_causa_efeito: [
      { de: "g08", para: "g01", descricao: "Queimada gera fumaça que fica presa" },
      { de: "g06", para: "g01", descricao: "Inversão térmica retém poluição" },
      { de: "g01", para: "g07", descricao: "Ar poluído superlota hospitais" },
      { de: "g01", para: "g04", descricao: "Visibilidade reduzida fecha rodovias" },
    ],
    layers_afetados: ["ar", "saude", "temperatura", "transito", "vegetacao"],
    ancora_principal: { coords: [-46.185, -23.523], label: "Mogi das Cruzes — CETESB" },
    centro_mapa: [-46.250, -23.525], zoom_inicial: 11,
    ancoras: [
      { id: "g01", coords: [-46.185, -23.523], label: "Mogi das Cruzes — Estação CETESB",
        descricao: "Principal estação de monitoramento do Alto Tietê.",
        layer: "ar", severidade_inicial: 3,
        dados_por_fase: {
          1: { valor: "IQA: 88 (Ruim)",  delta: "PM2.5: 62µg/m³",  status: "ALERTA" },
          2: { valor: "IQA: 121 (Ruim)", delta: "PM2.5: 98µg/m³",  status: "CRÍTICO" },
          3: { valor: "IQA: 158 (MRuim)",delta: "PM2.5: 142µg/m³", status: "CRÍTICO" },
          4: { valor: "IQA: 194 (Péss)", delta: "PM2.5: 198µg/m³", status: "COLAPSO" },
          5: { valor: "IQA: 228 (Péss)", delta: "PM2.5: 256µg/m³", status: "COLAPSO" },
        }
      },
      { id: "g02", coords: [-46.310, -23.542], label: "Suzano — Estação IQA",
        descricao: "Estação de Suzano. Mede PM2.5, PM10, SO₂ e NO₂.",
        layer: "ar", severidade_inicial: 2,
        dados_por_fase: {
          1: { valor: "IQA: 76 (Mod)",   delta: "Fumaça leve",      status: "ATENÇÃO" },
          2: { valor: "IQA: 109 (Ruim)", delta: "SO₂ elevado",     status: "ALERTA" },
          3: { valor: "IQA: 145 (MRuim)",delta: "Fumaça densa",    status: "CRÍTICO" },
          4: { valor: "IQA: 178 (Péss)", delta: "Alerta público",  status: "COLAPSO" },
          5: { valor: "IQA: 211 (Péss)", delta: "PERIGOSO",        status: "COLAPSO" },
        }
      },
      { id: "g03", coords: [-46.210, -23.487], label: "Itaquaquecetuba — Hospital Municipal",
        descricao: "Hospital com 180 leitos. Referência regional em pneumologia.",
        layer: "saude", severidade_inicial: 1,
        dados_por_fase: {
          1: { valor: "+12 resp.",        delta: "Crianças/idosos",  status: "ATENÇÃO" },
          2: { valor: "+38 resp.",        delta: "+30% sobre média", status: "ALERTA" },
          3: { valor: "+88 resp.",        delta: "Leitos extras",    status: "CRÍTICO" },
          4: { valor: "+154 resp.",       delta: "Superlotado",      status: "CRÍTICO" },
          5: { valor: "SUPERLOTADO",      delta: "+200 casos/hora",  status: "COLAPSO" },
        }
      },
      { id: "g04", coords: [-46.160, -23.540], label: "Mogi — Rodovia Ayrton Senna km 58",
        descricao: "Principal acesso a Mogi das Cruzes. 68.000 veículos/dia.",
        layer: "transito", severidade_inicial: 1,
        dados_por_fase: {
          1: { valor: "Visib: 4.2km",    delta: "Névoa de fumaça",  status: "ATENÇÃO" },
          2: { valor: "Visib: 2.8km",    delta: "Velocidade máx 80",status: "ATENÇÃO" },
          3: { valor: "Visib: 1.4km",    delta: "Vel. máx 60",      status: "ALERTA" },
          4: { valor: "Visib: 0.6km",    delta: "Vel. máx 40",      status: "CRÍTICO" },
          5: { valor: "PARCIAL",         delta: "Acidentes: 8",     status: "COLAPSO" },
        }
      },
      { id: "g05", coords: [-46.290, -23.530], label: "Suzano — Área Verde Norte",
        descricao: "Remanescente florestal. Área de recarga hídrica.",
        layer: "vegetacao", severidade_inicial: 2,
        dados_por_fase: {
          1: { valor: "Foco: 2 pontos",  delta: "Queimadas detectadas",status: "ALERTA" },
          2: { valor: "Foco: 5 pontos",  delta: "Alastramento",      status: "CRÍTICO" },
          3: { valor: "Foco: 11 pontos", delta: "Fogo sem controle",  status: "CRÍTICO" },
          4: { valor: "Área: 180ha",     delta: "Queimados",          status: "COLAPSO" },
          5: { valor: "Área: 420ha",     delta: "Queimados",          status: "COLAPSO" },
        }
      },
      { id: "g06", coords: [-46.200, -23.510], label: "Mogi — Sensor Inversão Térmica",
        descricao: "Sensor meteorológico de altitude. Detecta camadas de inversão.",
        layer: "temperatura", severidade_inicial: 2,
        dados_por_fase: {
          1: { valor: "Inv: 340m alt.",  delta: "Inversão detectada",status: "ALERTA" },
          2: { valor: "Inv: 210m alt.",  delta: "Camada baixando",   status: "CRÍTICO" },
          3: { valor: "Inv: 120m alt.",  delta: "+3°C pela névoa",   status: "CRÍTICO" },
          4: { valor: "Inv: 60m alt.",   delta: "+4.8°C",            status: "CRÍTICO" },
          5: { valor: "Inv: 20m alt.",   delta: "Inversão severa",   status: "COLAPSO" },
        }
      },
      { id: "g07", coords: [-46.330, -23.555], label: "Suzano — UBS Saúde Respiratória",
        descricao: "UBS especializada em doenças respiratórias.",
        layer: "saude", severidade_inicial: 1,
        dados_por_fase: {
          1: { valor: "+8 casos",        delta: "Normal alta",       status: "ATENÇÃO" },
          2: { valor: "+26 casos",       delta: "Fila na porta",     status: "ALERTA" },
          3: { valor: "+61 casos",       delta: "Nebulização",       status: "CRÍTICO" },
          4: { valor: "+108 casos",      delta: "Transbordando",     status: "CRÍTICO" },
          5: { valor: "COLAPSO",         delta: "+180 casos/hora",   status: "COLAPSO" },
        }
      },
      { id: "g08", coords: [-46.240, -23.500], label: "Poá — Foco de Queimada Principal",
        descricao: "Área rural com vegetação seca. Foco de incêndio primário.",
        layer: "vegetacao", severidade_inicial: 3,
        dados_por_fase: {
          1: { valor: "Foco: 0.8ha",     delta: "Início detectado",  status: "CRÍTICO" },
          2: { valor: "Foco: 4.2ha",     delta: "Alastramento",      status: "CRÍTICO" },
          3: { valor: "Foco: 16ha",      delta: "Vento favorece",    status: "CRÍTICO" },
          4: { valor: "Foco: 48ha",      delta: "Fogo ativo",        status: "COLAPSO" },
          5: { valor: "Foco: 110ha",     delta: "Incontrolável",     status: "COLAPSO" },
        }
      },
    ],
    fases: [
      { numero: 1, titulo: "PM2.5 Elevado", duracao_min: 2,
        descricao_fase: "Inversão térmica retém partículas. Focos de queimada detectados.",
        efeitos_visiveis: ["PM2.5 elevado em Mogi, Suzano e Itaquaquecetuba"],
        log_tecnico: [
          "[SENSOR_AR] g01 :: IQA=88 :: PM25=62ug/m3 :: STATUS=RUIM",
          "[SENSOR_VEG] g08 :: foco_queimada=0.8ha :: STATUS=ATIVO",
          "[SENSOR_TEMP] g06 :: inversao_termica=340m :: STATUS=DETECTADA",
        ],
        layers_ativos: { ar: [3,2,2], vegetacao: [2,2,1] }
      },
      { numero: 2, titulo: "Atendimentos Respiratórios +30%", duracao_min: 2,
        descricao_fase: "Hospitais com fila. Queimada se alastra.",
        efeitos_visiveis: ["Hospitais com +30% de atendimentos respiratórios"],
        log_tecnico: [
          "[SENSOR_AR] g01 :: IQA=121 :: PM25=98ug/m3 :: STATUS=CRITICO",
          "[SENSOR_SAUDE] g03 :: atend_resp=38 :: pct_acima_media=+30pct",
          "[SENSOR_VEG] g08 :: foco=4.2ha :: alastramento=SIM",
          "[SENSOR_TEMP] g06 :: inversao=210m :: camada_baixando=SIM",
        ],
        layers_ativos: { ar: [4,3,3], saude: [3,2,1], vegetacao: [3,2,2], temperatura: [2,2,1] }
      },
      { numero: 3, titulo: "Névoa Retém Calor", duracao_min: 2,
        descricao_fase: "Camada de poluição eleva temperatura +3°C. Rodovias fecham.",
        efeitos_visiveis: ["Camada de névoa eleva temperatura +3°C", "Rodovias com velocidade reduzida"],
        log_tecnico: [
          "[SENSOR_TEMP] g06 :: inversao=120m :: delta_temp=+3.0C",
          "[SENSOR_T] g04 :: visibilidade=1.4km :: vel_maxima=60kmh",
          "[SENSOR_AR] g02 :: IQA=145 :: SO2=ELEVADO",
          "[SENSOR_VEG] g05 :: focos=11pontos :: area=SEM_CONTROLE",
        ],
        layers_ativos: { ar: [5,4,3], saude: [4,3,2], temperatura: [4,3,2], transito: [3,2,1], vegetacao: [4,3,2] }
      },
      { numero: 4, titulo: "Estado de Alerta", duracao_min: 2,
        descricao_fase: "IQA Péssimo. 180ha de floresta queimados.",
        efeitos_visiveis: ["IQA 'Péssimo' em toda a região", "180ha de vegetação queimados em Suzano"],
        log_tecnico: [
          "[SENSOR_AR] g01 :: IQA=194 :: PM25=198ug/m3 :: PESSIMO",
          "[SENSOR_VEG] g05 :: area_queimada=180ha :: STATUS=GRAVE",
          "[SENSOR_TEMP] g06 :: inversao=60m :: delta_temp=+4.8C",
          "[SENSOR_SAUDE] g07 :: atend=108 :: transbordando=SIM",
        ],
        layers_ativos: { ar: [5,5,4], saude: [5,4,3], temperatura: [4,4,3], transito: [4,3,2], vegetacao: [5,4,3] }
      },
      { numero: 5, titulo: "Emergência Ambiental Declarada", duracao_min: null,
        descricao_fase: "Escolas fechadas. 420ha queimados. PM2.5 em nível perigoso.",
        efeitos_visiveis: ["Escolas suspensas em 3 municípios", "PM2.5 em nível perigoso — OMS: 10x o limite"],
        log_tecnico: [
          "[EMERGENCIA] alto_tiete :: nivel_crise=5 :: escolas=FECHADAS",
          "[COLAPSO] g01 :: IQA=228 :: PM25=256ug/m3 :: PERIGOSO",
          "[COLAPSO] g08 :: area_queimada=110ha :: INCONTROLAVEL",
          "[SENSOR_TEMP] g06 :: inversao=20m :: SEVERA :: delta=+6C",
          "[COLAPSO] g03 :: SUPERLOTADO :: transferencias=SIM",
        ],
        layers_ativos: { ar: [5,5,5], saude: [5,5,4], temperatura: [5,4,4], transito: [5,4,3], vegetacao: [5,5,4] }
      }
    ]
  },

  // ═══════════════════════════════════════════════════════
  // CRISE 08 — Colapso de Mobilidade — Eixo Paulista
  // Causa OCULTA: acidente com caminhão de produto perigoso
  // ═══════════════════════════════════════════════════════
  {
    id: 8, nome: "Colapso de Mobilidade — Eixo Paulista",
    subtitulo: "Av. Paulista · Radial Leste · República",
    regiao: "Centro Expandido — São Paulo Capital",
    cor: "#ff6347", icone: "🚗",
    sistemas_primarios: [
      { nome: "Mobilidade Urbana",   icone: "🚗", layer: "transito" },
      { nome: "Qualidade do Ar",     icone: "💨", layer: "ar" },
      { nome: "Saúde de Emergência", icone: "🏥", layer: "saude" },
      { nome: "Rede Elétrica",       icone: "⚡", layer: "energia" },
    ],
    conexoes_causa_efeito: [
      { de: "h01", para: "h03", descricao: "Produto químico liberado no ar" },
      { de: "h01", para: "h05", descricao: "Cabos de alta tensão atingidos" },
      { de: "h03", para: "h04", descricao: "Ar contaminado superlota hospital" },
      { de: "h01", para: "h02", descricao: "Produto vaza para o córrego" },
    ],
    layers_afetados: ["transito", "ar", "saude", "energia", "agua"],
    ancora_principal: { coords: [-46.655, -23.561], label: "Radial Leste × Av. Paulista" },
    centro_mapa: [-46.655, -23.560], zoom_inicial: 13.5,
    ancoras: [
      { id: "h01", coords: [-46.655, -23.561], label: "Radial Leste × Av. Paulista — Acidente",
        descricao: "Cruzamento de alta densidade. 180.000 veículos/dia.",
        layer: "transito", severidade_inicial: 4,
        dados_por_fase: {
          1: { valor: "Bloqueio: 4 faixas",delta: "Acidente confirmado",status: "CRÍTICO" },
          2: { valor: "Fila: 12km",       delta: "Transbordando",     status: "CRÍTICO" },
          3: { valor: "Fila: 22km",       delta: "Propagação",        status: "CRÍTICO" },
          4: { valor: "Fila: 38km",       delta: "Toda Radial",       status: "COLAPSO" },
          5: { valor: "CAOS TOTAL",       delta: "Fila: 55km",       status: "COLAPSO" },
        }
      },
      { id: "h02", coords: [-46.651, -23.565], label: "Córrego Sapateiro — Monitoramento",
        descricao: "Córrego canalizado sob a Av. Paulista.",
        layer: "agua", severidade_inicial: 1,
        dados_por_fase: {
          1: { valor: "Normal",          delta: "Monitorando",       status: "NORMAL" },
          2: { valor: "Suspeito",        delta: "Cor amarelada",     status: "ATENÇÃO" },
          3: { valor: "Contaminado",     delta: "Benzeno detectado", status: "CRÍTICO" },
          4: { valor: "DBO: 340mg/L",    delta: "Poluição severa",  status: "CRÍTICO" },
          5: { valor: "INTERDITO",       delta: "Tóxico confirmado", status: "COLAPSO" },
        }
      },
      { id: "h03", coords: [-46.660, -23.558], label: "Bela Vista — Sensor de Ar",
        descricao: "Sensor CETESB próximo ao local do acidente.",
        layer: "ar", severidade_inicial: 2,
        dados_por_fase: {
          1: { valor: "Suspeito",        delta: "Odor relatado",     status: "ATENÇÃO" },
          2: { valor: "Benzeno: 2.4ppb", delta: "Limite: 1.6ppb",  status: "CRÍTICO" },
          3: { valor: "Benzeno: 8.8ppb", delta: "Evacuação zona",   status: "CRÍTICO" },
          4: { valor: "Benzeno: 18ppb",  delta: "500m interditado", status: "COLAPSO" },
          5: { valor: "Benzeno: 32ppb",  delta: "1km interditado",  status: "COLAPSO" },
        }
      },
      { id: "h04", coords: [-46.645, -23.555], label: "Hospital Paulistano",
        descricao: "Hospital de referência do SUS. 280 leitos.",
        layer: "saude", severidade_inicial: 1,
        dados_por_fase: {
          1: { valor: "Normal",          delta: "0 casos químicos",  status: "NORMAL" },
          2: { valor: "+14 expostos",    delta: "Sintomas resp.",    status: "ATENÇÃO" },
          3: { valor: "+42 expostos",    delta: "Descontaminação",   status: "ALERTA" },
          4: { valor: "+96 expostos",    delta: "16 internações",    status: "CRÍTICO" },
          5: { valor: "SOBRECARG.",      delta: "+180 casos",       status: "COLAPSO" },
        }
      },
      { id: "h05", coords: [-46.670, -23.565], label: "Paraíso — Subestação Metrô L2",
        descricao: "Subestação de tração do Metrô Linha 2-Verde.",
        layer: "energia", severidade_inicial: 1,
        dados_por_fase: {
          1: { valor: "Normal",          delta: "OK",                status: "NORMAL" },
          2: { valor: "Monitorando",     delta: "Cabos próximos",    status: "ATENÇÃO" },
          3: { valor: "DESLIGADA",       delta: "Cabos danificados", status: "COLAPSO" },
          4: { valor: "DESLIGADA",       delta: "Linha 2 parada",   status: "COLAPSO" },
          5: { valor: "DESLIGADA",       delta: "Reparo: 6h",       status: "COLAPSO" },
        }
      },
      { id: "h06", coords: [-46.640, -23.568], label: "Vila Mariana — Terminal de Ônibus",
        descricao: "Terminal com 80.000 embarques/dia.",
        layer: "transito", severidade_inicial: 2,
        dados_por_fase: {
          1: { valor: "Lentidão",        delta: "Reflexo do acident.",status: "ATENÇÃO" },
          2: { valor: "Atraso: 45min",   delta: "Linhas desviadas",  status: "ALERTA" },
          3: { valor: "Atraso: 90min",   delta: "Ônibus sem linha",  status: "CRÍTICO" },
          4: { valor: "CAOS",            delta: "Sem previsão",      status: "CRÍTICO" },
          5: { valor: "FECHADO",         delta: "Evacução parcial",  status: "COLAPSO" },
        }
      },
      { id: "h07", coords: [-46.658, -23.548], label: "Consolação — Cruzamento Principal",
        descricao: "Cruzamento Paulista × Consolação. 95.000 ped/dia.",
        layer: "transito", severidade_inicial: 1,
        dados_por_fase: {
          1: { valor: "Lento",           delta: "Reflexo",           status: "ATENÇÃO" },
          2: { valor: "Muito lento",     delta: "Fila progride",     status: "ALERTA" },
          3: { valor: "Parado",          delta: "Zero mov.",         status: "CRÍTICO" },
          4: { valor: "BLOQUEADO",       delta: "Evacuação",         status: "COLAPSO" },
          5: { valor: "BLOQUEADO",       delta: "Perímetro químico", status: "COLAPSO" },
        }
      },
      { id: "h08", coords: [-46.663, -23.572], label: "Saúde — Captação Hídrica Sul",
        descricao: "Captação de água que serve o sul da capital.",
        layer: "agua", severidade_inicial: 1,
        dados_por_fase: {
          1: { valor: "Normal",          delta: "Monitorando",       status: "NORMAL" },
          2: { valor: "Alerta",          delta: "Produto a 2km",     status: "ATENÇÃO" },
          3: { valor: "Preventivo",      delta: "Produto a 0.8km",   status: "ALERTA" },
          4: { valor: "FECHADA",         delta: "Preventivo",        status: "CRÍTICO" },
          5: { valor: "FECHADA",         delta: "Contam. confirmada",status: "COLAPSO" },
        }
      },
    ],
    fases: [
      { numero: 1, titulo: "Engarrafamento Severo", duracao_min: 2,
        descricao_fase: "Acidente na Radial Leste bloqueia 4 faixas.",
        efeitos_visiveis: ["Lentidão extrema na Radial Leste"],
        log_tecnico: [
          "[SENSOR_T] h01 :: ACIDENTE :: faixas_bloqueadas=4 :: fila=12km",
          "[SENSOR_T] h06 :: atraso_onibus=45min :: rotas_desviadas=SIM",
        ],
        layers_ativos: { transito: [4,3,2] }
      },
      { numero: 2, titulo: "Agente Químico Detectado", duracao_min: 2,
        descricao_fase: "Benzeno liberado. Evacuação de quarteirão iniciada.",
        efeitos_visiveis: ["Benzeno 2.4ppb — 1.5x o limite permitido", "Evacuação de quarteirão"],
        log_tecnico: [
          "[SENSOR_AR] h03 :: benzeno=2.4ppb :: limite=1.6ppb :: STATUS=CRITICO",
          "[SENSOR_T] h01 :: fila=22km :: STATUS=CRITICO",
          "[SENSOR_H] h02 :: cor_amarelada=SIM :: suspeita=CONTAMINACAO",
        ],
        layers_ativos: { transito: [5,4,3], ar: [4,3,2], saude: [2,1,1] }
      },
      { numero: 3, titulo: "Infraestrutura Comprometida", duracao_min: 2,
        descricao_fase: "Cabos de alta tensão danificados. Linha 2 do metrô parada.",
        efeitos_visiveis: ["Linha 2-Verde do metrô paralisa", "Benzeno 5x o limite"],
        log_tecnico: [
          "[COLAPSO] h05 :: CABOS_DANIFICADOS :: metro_L2=PARADO",
          "[SENSOR_AR] h03 :: benzeno=8.8ppb :: EVACUACAO_500m",
          "[SENSOR_T] h01 :: fila=38km :: STATUS=COLAPSO",
          "[SENSOR_SAUDE] h04 :: expostos=42 :: descontaminacao=ATIVA",
        ],
        layers_ativos: { transito: [5,5,4], ar: [5,4,3], saude: [3,2,2], energia: [3,2,1] }
      },
      { numero: 4, titulo: "Córrego Sapateiro Interditado", duracao_min: 2,
        descricao_fase: "Produto vaza para o córrego. 3 linhas de metrô impactadas.",
        efeitos_visiveis: ["Córrego Sapateiro interditado", "96 expostos ao benzeno"],
        log_tecnico: [
          "[COLAPSO] h02 :: benzeno=DETECTADO :: INTERDITO :: DBO=340mgL",
          "[SENSOR_AR] h03 :: benzeno=18ppb :: COLAPSO :: area_evacuada=500m",
          "[SENSOR_SAUDE] h04 :: expostos=96 :: internacoes=16 :: STATUS=CRITICO",
          "[COLAPSO] h05 :: metro_L2=PARADO :: L3_impactada=SIM",
        ],
        layers_ativos: { transito: [5,5,5], ar: [5,5,4], saude: [4,3,2], energia: [4,3,2], agua: [3,2,2] }
      },
      { numero: 5, titulo: "500k Afetados", duracao_min: null,
        descricao_fase: "500.000 sem transporte. Córrego tóxico. Hospital sobrecarregado.",
        efeitos_visiveis: ["500.000 pessoas sem transporte público", "Benzeno: 20x o limite"],
        log_tecnico: [
          "[COLAPSO] h01 :: pop_afetada=500000 :: fila=55km",
          "[COLAPSO] h03 :: benzeno=32ppb :: 1km_interditado=SIM",
          "[COLAPSO] h02 :: TOXICO_CONFIRMADO :: captacao_h08=FECHADA",
          "[COLAPSO] h04 :: SOBRECARREGADO :: casos=180 :: transferencias=SIM",
          "[EMERGENCIA] eixo_paulista :: nivel_crise=5 :: metro=3linhas_impactadas",
        ],
        layers_ativos: { transito: [5,5,5], ar: [5,5,5], saude: [5,4,3], energia: [5,4,3], agua: [4,3,3] }
      }
    ]
  },

  // ═══════════════════════════════════════════════════════
  // CRISE 09 — Desabastecimento — Sistema Cantareira
  // Causa OCULTA: captação ilegal + seca prolongada
  // ═══════════════════════════════════════════════════════
  {
    id: 9, nome: "Desabastecimento — Cantareira",
    subtitulo: "Mairiporã · Franco da Rocha · Nazaré Paulista",
    regiao: "Sistema Cantareira — Norte da RMSP",
    cor: "#00ced1", icone: "🏞️",
    sistemas_primarios: [
      { nome: "Volume Hídrico",      icone: "💧", layer: "agua" },
      { nome: "Solo / Recarga",      icone: "🪨", layer: "solo" },
      { nome: "Cobertura Vegetal",   icone: "🌿", layer: "vegetacao" },
      { nome: "Saúde Pública",       icone: "🏥", layer: "saude" },
    ],
    conexoes_causa_efeito: [
      { de: "i04", para: "i03", descricao: "Sem vegetação, solo perde recarga" },
      { de: "i03", para: "i01", descricao: "Sem recarga, reservatório baixa" },
      { de: "i01", para: "i05", descricao: "Sem água, UBSs sem saneamento" },
      { de: "i01", para: "i06", descricao: "Sem coleta, lixo acumula" },
    ],
    layers_afetados: ["agua", "solo", "vegetacao", "saude", "lixo"],
    ancora_principal: { coords: [-46.561, -23.268], label: "Represa Cantareira" },
    centro_mapa: [-46.560, -23.290], zoom_inicial: 11,
    ancoras: [
      { id: "i01", coords: [-46.561, -23.268], label: "Represa Cantareira — Sensor Nível",
        descricao: "Principal reservatório do sistema. Capacidade: 982 bilhões de litros.",
        layer: "agua", severidade_inicial: 3,
        dados_por_fase: {
          1: { valor: "Vol: 38.4%",      delta: "Abaixo do normal",  status: "ALERTA" },
          2: { valor: "Vol: 28.7%",      delta: "Queda de 9.7%",     status: "CRÍTICO" },
          3: { valor: "Vol: 18.2%",      delta: "Zona de atenção",   status: "CRÍTICO" },
          4: { valor: "Vol: 9.8%",       delta: "Volume morto",      status: "COLAPSO" },
          5: { valor: "Vol: 3.1%",       delta: "CRÍTICO HISTÓRICO", status: "COLAPSO" },
        }
      },
      { id: "i02", coords: [-46.587, -23.317], label: "Mairiporã — Captação Sul",
        descricao: "Ponto de captação para tratamento. Monitora turbidez e fluxo.",
        layer: "agua", severidade_inicial: 2,
        dados_por_fase: {
          1: { valor: "Fluxo: -24%",     delta: "Abaixo projetado",  status: "ALERTA" },
          2: { valor: "Fluxo: -42%",     delta: "Restrição início",  status: "CRÍTICO" },
          3: { valor: "Fluxo: -61%",     delta: "5 municípios",      status: "CRÍTICO" },
          4: { valor: "Fluxo: -78%",     delta: "Racionamento",      status: "COLAPSO" },
          5: { valor: "Fluxo: -91%",     delta: "Colapso captação",  status: "COLAPSO" },
        }
      },
      { id: "i03", coords: [-46.540, -23.280], label: "Cantareira — Solo Zona de Recarga",
        descricao: "Área de recarga hídrica do sistema. Monitoramento de infiltração.",
        layer: "solo", severidade_inicial: 2,
        dados_por_fase: {
          1: { valor: "Infiltr: -28%",   delta: "Solo ressequido",   status: "ALERTA" },
          2: { valor: "Infiltr: -44%",   delta: "Compactação",       status: "ALERTA" },
          3: { valor: "Infiltr: -61%",   delta: "Recarga crítica",   status: "CRÍTICO" },
          4: { valor: "Infiltr: -78%",   delta: "Zona morta",        status: "CRÍTICO" },
          5: { valor: "RECARGA ZERO",    delta: "Solo impermeável",  status: "COLAPSO" },
        }
      },
      { id: "i04", coords: [-46.570, -23.295], label: "Mairiporã — Vegetação Margem",
        descricao: "Mata ciliar do entorno do reservatório. Indicador de saúde hídrica.",
        layer: "vegetacao", severidade_inicial: 2,
        dados_por_fase: {
          1: { valor: "NDVI: 0.52",      delta: "Estresse leve",     status: "ATENÇÃO" },
          2: { valor: "NDVI: 0.44",      delta: "Estresse moderado", status: "ALERTA" },
          3: { valor: "NDVI: 0.34",      delta: "Ressecamento",      status: "CRÍTICO" },
          4: { valor: "NDVI: 0.22",      delta: "Morte vegetal",     status: "CRÍTICO" },
          5: { valor: "NDVI: 0.09",      delta: "Desertificação",    status: "COLAPSO" },
        }
      },
      { id: "i05", coords: [-46.595, -23.330], label: "Franco da Rocha — UBS Central",
        descricao: "UBS sem água encanada a partir da fase 3.",
        layer: "saude", severidade_inicial: 1,
        dados_por_fase: {
          1: { valor: "Normal",          delta: "Água OK",           status: "NORMAL" },
          2: { valor: "Pressão baixa",   delta: "Torneiras fracas",  status: "ATENÇÃO" },
          3: { valor: "SEM ÁGUA",        delta: "UBS sem saneam.",   status: "CRÍTICO" },
          4: { valor: "FECHADA",         delta: "Insalubre",         status: "CRÍTICO" },
          5: { valor: "FECHADA",         delta: "550 bairros s/água",status: "COLAPSO" },
        }
      },
      { id: "i06", coords: [-46.555, -23.305], label: "Mairiporã — Lixo Entorno Represa",
        descricao: "Ponto de descarte ilegal detectado próximo à margem da represa.",
        layer: "lixo", severidade_inicial: 2,
        dados_por_fase: {
          1: { valor: "Depósito: 12t",   delta: "Crônico",           status: "ATENÇÃO" },
          2: { valor: "Depósito: 28t",   delta: "Aumentando",        status: "ALERTA" },
          3: { valor: "Depósito: 54t",   delta: "Sem coleta",        status: "CRÍTICO" },
          4: { valor: "Depósito: 98t",   delta: "Lixiviado na água", status: "CRÍTICO" },
          5: { valor: "Depósito: 180t",  delta: "Contam. represa",   status: "COLAPSO" },
        }
      },
      { id: "i07", coords: [-46.520, -23.260], label: "Nazaré Paulista — Afluente Norte",
        descricao: "Principal afluente do Cantareira. Cota e vazão monitoradas.",
        layer: "agua", severidade_inicial: 1,
        dados_por_fase: {
          1: { valor: "Vazão: 1.2 m³/s", delta: "Abaixo do normal", status: "ATENÇÃO" },
          2: { valor: "Vazão: 0.8 m³/s", delta: "Queda acentuada",  status: "ALERTA" },
          3: { valor: "Vazão: 0.4 m³/s", delta: "Seca severa",      status: "CRÍTICO" },
          4: { valor: "Vazão: 0.1 m³/s", delta: "Quase seco",       status: "CRÍTICO" },
          5: { valor: "SECO",            delta: "Afluente seco",     status: "COLAPSO" },
        }
      },
      { id: "i08", coords: [-46.580, -23.310], label: "Mairiporã — Zona de Recarga Z2",
        descricao: "Segunda zona de recarga. Sensores de umidade a 2m de profundidade.",
        layer: "solo", severidade_inicial: 1,
        dados_por_fase: {
          1: { valor: "Umid: 21%",       delta: "Solo seco",         status: "ALERTA" },
          2: { valor: "Umid: 16%",       delta: "Seca profunda",     status: "ALERTA" },
          3: { valor: "Umid: 11%",       delta: "Estresse severo",   status: "CRÍTICO" },
          4: { valor: "Umid: 6%",        delta: "Solo árido",        status: "CRÍTICO" },
          5: { valor: "Umid: 2%",        delta: "Desertificação",    status: "COLAPSO" },
        }
      },
    ],
    fases: [
      { numero: 1, titulo: "Volume em Queda", duracao_min: 2,
        descricao_fase: "Cantareira com 38.4% — abaixo do esperado para a época.",
        efeitos_visiveis: ["Volume do Cantareira 9.7% abaixo da média histórica"],
        log_tecnico: [
          "[SENSOR_H] i01 :: volume=38.4pct :: media_historica=48.1pct :: STATUS=ALERTA",
          "[SENSOR_H] i07 :: vazao=1.2m3s :: abaixo_normal=SIM",
          "[SENSOR_SOLO] i03 :: infiltracao=-28pct :: solo_seco=SIM",
        ],
        layers_ativos: { agua: [3,2,2], solo: [2,1,1] }
      },
      { numero: 2, titulo: "Vegetação em Estresse", duracao_min: 2,
        descricao_fase: "Mata ciliar em estresse hídrico. Solo perde capacidade de recarga.",
        efeitos_visiveis: ["NDVI da mata ciliar em queda — estresse hídrico moderado"],
        log_tecnico: [
          "[SENSOR_VEG] i04 :: NDVI=0.44 :: estresse_hidrico=MODERADO",
          "[SENSOR_SOLO] i03 :: infiltracao=-44pct :: compactacao=SIM",
          "[SENSOR_H] i01 :: volume=28.7pct :: queda=9.7pct",
        ],
        layers_ativos: { agua: [4,3,2], solo: [3,2,2], vegetacao: [3,2,1] }
      },
      { numero: 3, titulo: "Restrição de Abastecimento", duracao_min: 2,
        descricao_fase: "5 municípios com restrição. UBS de Franco da Rocha sem água.",
        efeitos_visiveis: ["5 municípios com fornecimento restrito", "UBS sem água encanada"],
        log_tecnico: [
          "[SENSOR_H] i02 :: fluxo=-61pct :: municipios_afetados=5 :: RESTRICAO",
          "[SENSOR_SAUDE] i05 :: UBS=SEM_AGUA :: insalubridade=SIM",
          "[SENSOR_VEG] i04 :: NDVI=0.34 :: ressecamento=ATIVO",
          "[SENSOR_RS] i06 :: deposito_ilegal=54t :: lixiviado_iminente=SIM",
        ],
        layers_ativos: { agua: [4,4,3], solo: [3,3,2], vegetacao: [3,3,2], saude: [2,1,1] }
      },
      { numero: 4, titulo: "Volume Morto", duracao_min: 2,
        descricao_fase: "Cantareira em volume morto. Racionamento declarado.",
        efeitos_visiveis: ["Cantareira em volume morto: 9.8%", "Racionamento em 8 municípios"],
        log_tecnico: [
          "[COLAPSO] i01 :: volume=9.8pct :: VOLUME_MORTO :: racionamento=SIM",
          "[SENSOR_SAUDE] i05 :: UBS_FECHADA :: insalubre=CONFIRMADO",
          "[SENSOR_RS] i06 :: lixiviado_agua=DETECTADO :: contam=INICIO",
          "[SENSOR_VEG] i04 :: NDVI=0.22 :: morte_vegetal=INICIO",
        ],
        layers_ativos: { agua: [5,5,4], solo: [4,3,3], vegetacao: [4,3,2], saude: [3,2,2], lixo: [3,2,1] }
      },
      { numero: 5, titulo: "Racionamento para 8 Milhões", duracao_min: null,
        descricao_fase: "Crise hídrica histórica. 8 milhões de pessoas afetadas.",
        efeitos_visiveis: ["8 milhões de pessoas com racionamento", "Nível mais baixo da história"],
        log_tecnico: [
          "[EMERGENCIA] cantareira :: nivel_crise=5 :: pop_afetada=8000000",
          "[COLAPSO] i01 :: volume=3.1pct :: HISTORICO_MINIMO",
          "[COLAPSO] i07 :: AFLUENTE_SECO :: STATUS=COLAPSO",
          "[COLAPSO] i06 :: contaminacao_represa=ATIVA :: volume=180t",
          "[COLAPSO] i04 :: NDVI=0.09 :: DESERTIFICACAO",
        ],
        layers_ativos: { agua: [5,5,5], solo: [5,4,4], vegetacao: [4,4,3], saude: [5,4,3], lixo: [4,3,2] }
      }
    ]
  },

  // ═══════════════════════════════════════════════════════
  // CRISE 10 — Emergência de Saúde — Heliópolis
  // Causa OCULTA: esgoto a céu aberto + calor extremo = surto de dengue
  // ═══════════════════════════════════════════════════════
  {
    id: 10, nome: "Emergência de Saúde — Heliópolis",
    subtitulo: "Heliópolis · Ipiranga · Sacomã",
    regiao: "Zona Sul — São Paulo Capital",
    cor: "#dc143c", icone: "🏥",
    sistemas_primarios: [
      { nome: "Saúde Pública",       icone: "🏥", layer: "saude" },
      { nome: "Saneamento Básico",   icone: "💧", layer: "agua" },
      { nome: "Gestão de Resíduos",  icone: "🗑️", layer: "lixo" },
      { nome: "Temperatura Urbana",  icone: "🌡️", layer: "temperatura" },
    ],
    conexoes_causa_efeito: [
      { de: "j02", para: "j08", descricao: "Esgoto cria criadouros do vetor" },
      { de: "j04", para: "j02", descricao: "Calor acelera reprodução do mosquito" },
      { de: "j03", para: "j08", descricao: "Lixo retém água parada" },
      { de: "j01", para: "j05", descricao: "Casos transbordam para Hospital" },
    ],
    layers_afetados: ["saude", "agua", "lixo", "temperatura", "ar"],
    ancora_principal: { coords: [-46.606, -23.607], label: "Heliópolis — UBS Central" },
    centro_mapa: [-46.605, -23.610], zoom_inicial: 13,
    ancoras: [
      { id: "j01", coords: [-46.606, -23.607], label: "Heliópolis — UBS Central Dr. Faustino",
        descricao: "UBS de referência. 1.400 atendimentos/dia.",
        layer: "saude", severidade_inicial: 3,
        dados_por_fase: {
          1: { valor: "+28 febre",       delta: "Cluster suspeito",  status: "ALERTA" },
          2: { valor: "+64 febre",       delta: "Dengue suspeita",   status: "CRÍTICO" },
          3: { valor: "+122 casos",      delta: "Dengue confirmada", status: "CRÍTICO" },
          4: { valor: "+220 casos",      delta: "UBS superlotada",   status: "COLAPSO" },
          5: { valor: "COLAPSO",         delta: "+360 casos/hora",   status: "COLAPSO" },
        }
      },
      { id: "j02", coords: [-46.601, -23.612], label: "Heliópolis — Córrego Esgoto Z4",
        descricao: "Córrego com esgoto a céu aberto. 2.4km de extensão.",
        layer: "agua", severidade_inicial: 3,
        dados_por_fase: {
          1: { valor: "DBO: 220 mg/L",   delta: "Esgoto crônico",   status: "ALERTA" },
          2: { valor: "DBO: 480 mg/L",   delta: "Criadouro ativo",  status: "CRÍTICO" },
          3: { valor: "DBO: 890 mg/L",   delta: "Larvas detectadas",status: "CRÍTICO" },
          4: { valor: "DBO: 1400 mg/L",  delta: "Foco principal",   status: "COLAPSO" },
          5: { valor: "DBO: 2100 mg/L",  delta: "Esgoto total",     status: "COLAPSO" },
        }
      },
      { id: "j03", coords: [-46.615, -23.605], label: "Sacomã — Ponto Lixo Norte",
        descricao: "Ponto de acúmulo de resíduos. Recipientes com água parada.",
        layer: "lixo", severidade_inicial: 2,
        dados_por_fase: {
          1: { valor: "Recip: 340 u.",   delta: "Água parada",       status: "ALERTA" },
          2: { valor: "Recip: 680 u.",   delta: "Aedes detectado",   status: "CRÍTICO" },
          3: { valor: "Recip: 1200 u.",  delta: "Foco confirmado",   status: "CRÍTICO" },
          4: { valor: "Recip: 1800 u.",  delta: "Sem coleta 4 dias", status: "COLAPSO" },
          5: { valor: "Recip: 2400 u.",  delta: "Explosão vetorial", status: "COLAPSO" },
        }
      },
      { id: "j04", coords: [-46.598, -23.618], label: "Heliópolis — Ilha de Calor Sul",
        descricao: "Sensor de temperatura de superfície. Área 100% impermeabilizada.",
        layer: "temperatura", severidade_inicial: 3,
        dados_por_fase: {
          1: { valor: "Temp: 38.4°C",    delta: "+6.1°C",            status: "CRÍTICO" },
          2: { valor: "Temp: 40.8°C",    delta: "+8.5°C",            status: "CRÍTICO" },
          3: { valor: "Temp: 42.9°C",    delta: "+10.6°C",           status: "CRÍTICO" },
          4: { valor: "Temp: 44.7°C",    delta: "+12.4°C",           status: "COLAPSO" },
          5: { valor: "Temp: 46.2°C",    delta: "+13.9°C",           status: "COLAPSO" },
        }
      },
      { id: "j05", coords: [-46.590, -23.600], label: "Hospital do Ipiranga",
        descricao: "Hospital de referência regional. 420 leitos.",
        layer: "saude", severidade_inicial: 1,
        dados_por_fase: {
          1: { valor: "+8 dengue",        delta: "Transferidos",      status: "ATENÇÃO" },
          2: { valor: "+28 dengue",       delta: "Enfermaria cheia",  status: "ALERTA" },
          3: { valor: "+66 dengue",       delta: "Leitos extras",     status: "CRÍTICO" },
          4: { valor: "+128 dengue",      delta: "SUPERLOTADO",       status: "COLAPSO" },
          5: { valor: "ALERTA MAX",       delta: "+200 casos/hora",   status: "COLAPSO" },
        }
      },
      { id: "j06", coords: [-46.620, -23.610], label: "Sacomã — Sensor IQA (Fumacê)",
        descricao: "Sensor de qualidade do ar próximo ao ponto de nebulização.",
        layer: "ar", severidade_inicial: 1,
        dados_por_fase: {
          1: { valor: "IQA: 68 (Mod)",    delta: "Normal",           status: "NORMAL" },
          2: { valor: "IQA: 82 (Mod)",    delta: "Partículas leve",  status: "ATENÇÃO" },
          3: { valor: "IQA: 94 (Mod)",    delta: "Aerossol detectado",status: "ATENÇÃO" },
          4: { valor: "FUMACÊ ATIVO",     delta: "Inseticida aéreo", status: "ALERTA" },
          5: { valor: "FUMACÊ ATIVO",     delta: "Operação em curso",status: "ALERTA" },
        }
      },
      { id: "j07", coords: [-46.608, -23.625], label: "Heliópolis — Córrego Z7",
        descricao: "Segundo córrego com esgoto. Distância: 400m do Z4.",
        layer: "agua", severidade_inicial: 2,
        dados_por_fase: {
          1: { valor: "DBO: 180 mg/L",   delta: "Crônico",           status: "ALERTA" },
          2: { valor: "DBO: 360 mg/L",   delta: "Piorando",          status: "CRÍTICO" },
          3: { valor: "DBO: 720 mg/L",   delta: "Larvas",            status: "CRÍTICO" },
          4: { valor: "DBO: 1200 mg/L",  delta: "Foco secundário",   status: "COLAPSO" },
          5: { valor: "DBO: 1800 mg/L",  delta: "Crítico",           status: "COLAPSO" },
        }
      },
      { id: "j08", coords: [-46.595, -23.615], label: "Ipiranga — Lixo com Recipientes",
        descricao: "Acúmulo de recipientes plásticos com água parada. Foco de Aedes.",
        layer: "lixo", severidade_inicial: 2,
        dados_por_fase: {
          1: { valor: "Foco: baixo",      delta: "Monitorado",        status: "ATENÇÃO" },
          2: { valor: "Larvas: 28/L",     delta: "Infestação inicia", status: "CRÍTICO" },
          3: { valor: "Larvas: 84/L",     delta: "Foco confirmado",  status: "CRÍTICO" },
          4: { valor: "Larvas: 160/L",    delta: "Foco alto",        status: "COLAPSO" },
          5: { valor: "Larvas: 280/L",    delta: "Explosão",         status: "COLAPSO" },
        }
      },
    ],
    fases: [
      { numero: 1, titulo: "Casos de Febre Agrupados", duracao_min: 2,
        descricao_fase: "Cluster de febre detectado. Padrão incomum de distribuição geográfica.",
        efeitos_visiveis: ["28 casos de febre aguda agrupados em Heliópolis"],
        log_tecnico: [
          "[SENSOR_SAUDE] j01 :: casos_febre=28 :: cluster=DETECTADO :: area=HELIOPOLIS",
          "[SENSOR_TEMP] j04 :: temp=38.4C :: ilha_calor=ATIVA :: delta=+6.1C",
        ],
        layers_ativos: { saude: [3,2,2], temperatura: [3,2,2] }
      },
      { numero: 2, titulo: "Esgoto e Lixo Detectados", duracao_min: 2,
        descricao_fase: "Inspeção detecta esgoto a céu aberto e recipientes com água parada.",
        efeitos_visiveis: ["Esgoto a céu aberto no Córrego Z4", "Larvas de Aedes detectadas"],
        log_tecnico: [
          "[SENSOR_H] j02 :: DBO=480mgL :: criadouro=ATIVO :: larvas=SUSPEITA",
          "[SENSOR_RS] j03 :: recipientes_agua=680u :: aedes=DETECTADO",
          "[SENSOR_SAUDE] j01 :: dengue_suspeita=64 :: STATUS=CRITICO",
          "[SENSOR_TEMP] j04 :: temp=40.8C :: reproducao_acelerada=SIM",
        ],
        layers_ativos: { saude: [4,3,2], temperatura: [4,3,2], agua: [3,3,2], lixo: [3,2,2] }
      },
      { numero: 3, titulo: "Ilha de Calor Acelera Vetor", duracao_min: 2,
        descricao_fase: "Calor de +10°C acelera ciclo reprodutivo do Aedes em 40%.",
        efeitos_visiveis: ["Dengue confirmada em 122 casos", "Temperatura +10°C acima da média"],
        log_tecnico: [
          "[SENSOR_SAUDE] j01 :: dengue_confirmada=122 :: STATUS=CRITICO",
          "[SENSOR_TEMP] j04 :: temp=42.9C :: ciclo_aedes_acelerado=40pct",
          "[SENSOR_H] j02 :: DBO=890mgL :: larvas_confirmadas=SIM",
          "[SENSOR_RS] j03 :: recipientes=1200u :: foco=CONFIRMADO",
        ],
        layers_ativos: { saude: [4,4,3], temperatura: [5,4,3], agua: [4,3,3], lixo: [4,3,2] }
      },
      { numero: 4, titulo: "Nebulização Emergencial", duracao_min: 2,
        descricao_fase: "Fumacê iniciado. UBS com 220 casos. Hospital do Ipiranga superlotando.",
        efeitos_visiveis: ["Operação de fumacê iniciada", "220 casos — UBS superlotada"],
        log_tecnico: [
          "[SENSOR_SAUDE] j01 :: casos=220 :: UBS=SUPERLOTADA :: transf=SIM",
          "[SENSOR_SAUDE] j05 :: internacoes=128 :: SUPERLOTADO",
          "[SENSOR_AR] j06 :: fumace=ATIVO :: inseticida_aereo=SIM",
          "[SENSOR_RS] j08 :: larvas=160/L :: foco=ALTO",
        ],
        layers_ativos: { saude: [5,4,4], temperatura: [5,5,4], agua: [4,4,3], lixo: [4,4,3], ar: [4,3,1] }
      },
      { numero: 5, titulo: "800 Casos — Colapso", duracao_min: null,
        descricao_fase: "800 casos confirmados. UBS e Hospital em colapso.",
        efeitos_visiveis: ["800 casos confirmados de dengue", "Hospital do Ipiranga em alerta máximo"],
        log_tecnico: [
          "[EMERGENCIA] heliopolis :: nivel_crise=5 :: casos_dengue=800",
          "[COLAPSO] j01 :: UBS_COLAPSO :: casos_hora=360 :: transf_continua=SIM",
          "[COLAPSO] j05 :: ALERTA_MAXIMO :: leitos=ESGOTADOS",
          "[COLAPSO] j02 :: DBO=2100mgL :: criadouro=EXPLOSAO",
          "[COLAPSO] j08 :: larvas=280/L :: STATUS=EXPLOSAO_VETORIAL",
        ],
        layers_ativos: { saude: [5,5,5], temperatura: [5,5,5], agua: [5,5,4], lixo: [5,4,4], ar: [3,2,2] }
      }
    ]
  }

]; // fim CRISES

if (typeof module !== 'undefined') module.exports = { CRISES };
```

---

## ARQUIVO: `api/relatos.js`

```javascript
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
```

---

## ARQUIVO: `sim.html` — O SIMULADOR COMPLETO

### Estrutura exata de layout (CSS Grid):

```
body {
  display: grid;
  grid-template-rows: 52px 1fr;
  grid-template-columns: 280px 1fr 340px;
  height: 100vh;
  overflow: hidden;
}

#header    { grid-column: 1 / -1; grid-row: 1; }
#left      { grid-column: 1; grid-row: 2; }
#center    { grid-column: 2; grid-row: 2; position: relative; }
#right     { grid-column: 3; grid-row: 2; }
```

### Painel ESQUERDO — 4 seções:

**1. KPI Gauges (topo) — 4 círculos SVG animados:**
- `COBERTURA` — % de layers ativados pelo aluno (0–100%)
- `SEVERIDADE` — índice médio de severidade atual (0–100)
- `FASE` — fase atual em arco (1–5 = 0–100%)
- `SINAIS` — total de relatos recebidos (contador)

Cada gauge: SVG circle com `stroke-dasharray` animado. Valor contado de 0 ao atual em 400ms. Label embaixo em `Orbitron`. Cor muda: verde < 50%, amarelo 50-80%, vermelho > 80%.

**2. Barras por Layer (meio):**
- 10 barras horizontais, uma por layer
- Altura da barra = severidade máxima atual naquele layer (0–5 → 0–100%)
- Cor = cor do layer
- Label à esquerda (ícone + nome abreviado)
- Valor numérico à direita
- Atualiza com transição `width 0.6s ease` a cada fase
- Barras de layers não ativados ficam em cinza opaco

**3. Tabela de âncoras (baixo):**
- Lista os 8 âncoras da crise atual
- Colunas: [ponto] [layer●] [valor atual] [status badge]
- Status badge: NORMAL (verde) / ATENÇÃO (amarelo) / ALERTA (laranja) / CRÍTICO (vermelho) / COLAPSO (magenta piscante)
- Rows que têm layer ativo ficam com `background: rgba(0,255,204,0.04)`
- Rows que não estão com layer ativo ficam opacas

**4. Progressão de fase (rodapé):**
- 5 bolinhas conectadas por linha
- Bolinha atual: amarelo pulsante
- Bolinhas passadas: verde sólido
- Bolinhas futuras: cinza
- Título da fase atual em texto embaixo

### Painel CENTRAL — O mapa:

**Configuração MapLibre:**
```javascript
const map = new maplibregl.Map({
  container: 'map',
  style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
  center: crisis.centro_mapa,
  zoom: crisis.zoom_inicial,
  minZoom: 8, maxZoom: 17,
  maxBounds: [[-47.2, -24.1], [-45.8, -23.0]],
  attributionControl: false
});
```

**Sobreposição hexagonal:**
Após o mapa carregar, inserir um elemento div sobre o canvas com SVG pattern hexagonal, pointer-events: none, opacidade 0.04.

**Marcadores dos âncoras:**
- Ponto circular central com cor do layer
- Tamanho muda com severidade: 10px (sev 1) → 18px (sev 5)
- Quando layer está ATIVO: opacidade 1, pulso ativo
- Quando layer está INATIVO: opacidade 0.08, sem pulso
- Pulso: `setInterval` oscila `box-shadow` entre mínimo e máximo
  - Sev 1-2: período 2200ms, glow suave
  - Sev 3: período 1400ms, glow médio
  - Sev 4-5: período 700ms, glow intenso com halo
- NO HALO separado — só o ponto oscila

**Linhas de conexão causa-efeito (aparecem ao ativar layers):**
Quando um layer é ativado, desenhar no mapa as linhas de `conexoes_causa_efeito` que conectam âncoras daquele layer com outros. Linha tracejada animada (`line-dasharray` com animação), cor do layer origem, opacidade 0.4, largura 1.5px.

**Popup ao clicar no âncora:**
```html
<div class="popup">
  <div class="popup-header">[ícone layer] [nome do layer]</div>
  <div class="popup-location">[label do âncora]</div>
  <div class="popup-description">[descricao do âncora]</div>
  <div class="popup-value">[valor da fase atual]</div>
  <div class="popup-delta">[delta da fase atual]</div>
  <div class="popup-status" style="color:[cor do status]">[status]</div>
</div>
```

**Alerta espontâneo (a cada ~55s):**
- Sorteia um âncora aleatório
- Pisca 6x rápido mesmo que o layer esteja desligado
- Adiciona entrada no chat/terminal

### Painel DIREITO — 3 seções:

**1. Cards dos sistemas primários (topo):**
4 cards da crise atual (definidos em `sistemas_primarios`). Cada card:
- Ícone grande (48px) + nome do sistema
- Status badge atual baseado na severidade do layer
- Mini barra de progresso de severidade (0–5)
- Borda cor do layer
- Quando o layer está ATIVO pelo aluno: card com background levemente iluminado

**2. Terminal de logs técnicos (meio):**
Rolagem automática. Fonte monospace pequena (0.65rem). Fundo: `#020810`.
- Cada linha começa com `[HH:MM:SS]`
- Timestamp real do sistema
- Cor por tipo: `[SENSOR_*]` = ciano, `[ALERTA_*]` = amarelo, `[COLAPSO]` = vermelho piscante, `[EMERGENCIA]` = magenta
- Cursor piscante `█` na última linha
- A cada nova fase, exibe as linhas de `log_tecnico` da fase, uma por vez com delay de 400ms entre elas
- A cada relato espontâneo, gera uma linha de log sintética

**3. Feed de relatos humanos (baixo, metade do espaço):**
- Header: "RELATOS" + contador badge
- Lista de relatos com:
  - Badge colorido da fonte (WhatsApp verde, Twitter azul, Rádio laranja, etc.)
  - Bolinha colorida do layer
  - Nome da fonte
  - Texto do relato
  - Timestamp + número da fase
- Scroll automático para o mais novo (que aparece no TOPO)
- Máximo 60 relatos mantidos em memória

### Lógica de engine de fases:

```javascript
const PHASE_DURATION_MS = 2 * 60 * 1000;
const SPONTANEOUS_INTERVAL_MS = 55 * 1000;

function startPhase(n) {
  currentPhase = n;
  updateAllUI();
  refreshMarkers();
  fetchRelatos(false);   // busca 4 relatos do Deepseek
  startCountdown();
  scheduleSpontaneous();
}

function advancePhase() {
  if (currentPhase < 5) startPhase(currentPhase + 1);
  else {
    addTerminalLine("[SISTEMA] Fase máxima atingida. Situação crítica em curso.");
    scheduleSpontaneous(); // continua relatos espontâneos na fase 5
  }
}
```

### KPIs — lógica de cálculo:

```javascript
// Cobertura: layers ativados / layers afetados pela crise
const cobertura = Math.round((activeLayers.size / crisis.layers_afetados.length) * 100);

// Severidade: média das severidades máximas dos layers ativos
const sevMediaAtiva = [...activeLayers].map(l => {
  const phaseData = crisis.fases[currentPhase - 1].layers_ativos[l];
  return phaseData ? Math.max(...phaseData) : 0;
}).reduce((a, b) => a + b, 0) / (activeLayers.size || 1);
const severidade = Math.round((sevMediaAtiva / 5) * 100);

// Sinais: contador total de relatos recebidos
// Fase: (currentPhase - 1) / 4 * 100
```

---

## ARQUIVO: `index.html` — Tela de loading

Loading screen com visual sci-fi:
- Fundo `#040d1a`
- Logo "URBAN LENS" em `Orbitron` com glow verde
- Subtítulo "SISTEMA DE MONITORAMENTO URBANO — RMSP"
- Sequência de loading com 6 etapas, barra de progresso com glow
- Sorteia crise 1–10 aleatoriamente
- Redireciona para `sim.html?crisis=N&session=XXXXXX`
- `session` = 6 caracteres alfanuméricos aleatórios (ID único da sessão do aluno)

---

## REGRAS PEDAGÓGICAS — IMPLEMENTAR RIGIDAMENTE

1. **Causa nunca revelada**: Nenhum texto na interface menciona a causa da crise. Apenas efeitos.
2. **Todos os layers começam desativados**: `activeLayers = new Set()` no boot. Zero markers visíveis.
3. **Dados aparecem progressivamente**: Ao ativar um layer, mostrar dados da fase ATUAL (não de fases futuras).
4. **Conexões causa-efeito invisíveis**: As linhas de conexão aparecem apenas quando ambos os layers envolvidos estão ativos.
5. **Relatos não nomeiam o problema**: O prompt do Deepseek instrui explicitamente a não revelar a causa.
6. **Aluno age, não assiste**: Interface não tem "solução" — tem ferramentas de investigação.

---

## CHECKLIST DE QUALIDADE — verifique antes de finalizar

- [ ] Fontes Orbitron e Share Tech Mono carregando do Google Fonts
- [ ] Scanlines e vinheta visíveis mas sutis (opacidade < 0.05)
- [ ] Todos os 10 layers têm toggle funcional
- [ ] Marcadores pulsam em velocidade proporcional à severidade
- [ ] Popup mostra dado técnico real da fase atual ao clicar no âncora
- [ ] KPI gauges animam de 0 ao valor correto
- [ ] Barras de layer atualizam com transição suave ao mudar de fase
- [ ] Terminal de logs exibe as linhas da fase com delay entre elas
- [ ] Feed de relatos cresce no topo (mais novo primeiro)
- [ ] Timer faz countdown de 2:00 → 0:00 e avança fase automaticamente
- [ ] Alerta espontâneo pisca âncora mesmo com layer desligado
- [ ] Layout não quebra com o mapa entre os dois painéis
- [ ] Popup do MapLibre com tema escuro customizado
- [ ] Variável DEEPSEEK_API_KEY lida do process.env (nunca hardcoded)
- [ ] vercel.json com rota correta para api/relatos.js

---

## DEPLOY

```bash
# Criar .env local
echo "DEEPSEEK_API_KEY=sk-SUA_CHAVE_AQUI" > .env

# Instalar CLI
npm install

# Rodar local
npx vercel dev

# Deploy produção
npx vercel --prod
```

Variável no Vercel Dashboard:
- Key: `DEEPSEEK_API_KEY`
- Value: sua chave
- Environments: Production ✓ Preview ✓ Development ✓

---

## NOTAS FINAIS PARA O CLAUDE CODE

- Priorize FIDELIDADE VISUAL à referência sci-fi: fundo escuro, néon verde/ciano, monospace, glows
- O layout de 3 colunas (esquerda/mapa/direita) é INEGOCIÁVEL — é o que transforma isso de um mapa em uma sala de controle
- Cada dado de cada âncora de cada fase está detalhado neste prompt — use-os todos
- A API do Deepseek já está configurada no Vercel do Leo — apenas referencie `/api/relatos`
- Se alguma CDN falhar, use alternativa: MapLibre pode ser `unpkg.com` ou `cdn.jsdelivr.net`
- O arquivo único `sim.html` pode ter até 2000 linhas — tudo inline é intencional e necessário

**Este prompt contém tudo. Construa o projeto completo sem lacunas.**
