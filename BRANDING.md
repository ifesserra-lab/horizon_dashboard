# Horizon — Guia de marca

Portal de pesquisa, extensão e pós-graduação do **Ifes**.

> Documento canônico da identidade do **Horizon**. Versão visual (fontes
> embutidas, abre no navegador): [`docs/brand/horizon-brand-guide.html`](docs/brand/horizon-brand-guide.html).
> Os tokens de cor/fonte vivem em [`src/styles/global.css`](src/styles/global.css);
> a direção de UI em [`DESIGN.md`](DESIGN.md).
>
> ⚠️ **AJUSTAR:** os hex e a fonte abaixo são estimativas fundamentadas, **não
> oficiais**. Confirmar no manual de identidade do Ifes antes de tratar como final.

---

## 1. A marca

**Horizon** é a plataforma pública que reúne, em um só lugar, a produção de
pesquisa, extensão e pós‑graduação do **Ifes**: grupos, pessoas, projetos,
publicações, fomento e orientações.

- **Nome do produto:** `Horizon` — sempre com inicial maiúscula. Nunca `HORIZON`
  em caixa‑alta corrida nem `horizon`.
- **Instituição:** `Ifes` — Instituto Federal do Espírito Santo. Grafia **`Ifes`**
  (não `IFES`) no texto corrido.
- **Relação entre os nomes:** Horizon é a marca do portal; o Ifes é a instituição
  que o mantém. Quando a marca aparecer sozinha, associe‑a ao Ifes na primeira
  menção — *"Horizon, portal de pesquisa do Ifes"*.

**Frase de efeito:** *Um horizonte para a pesquisa do **Ifes**.*
(Trocadilho com o nome Horizon. Não usar "toda a pesquisa" — não há como
confirmar cobertura total.)

## 2. Assinatura

Marca símbolo (o "H" em quadrado verde‑escuro) + logotipo "Horizon". Nas peças
institucionais, acompanha o nome do Ifes.

- **Área de proteção:** espaço livre ao redor da assinatura igual à altura do "H".
- **Tamanho mínimo:** símbolo ≥ 24 px de altura; logotipo legível a partir de
  96 px de largura.
- **Sigla no símbolo:** texto **sempre branco** sobre o verde‑escuro. Nunca fundo
  amarelo com texto branco.

## 3. Faixa institucional

Elemento gráfico da Rede Federal: quatro barras verticais, usadas como tira fina
no topo das páginas.

- **Ordem:** amarelo · verde · vermelho · azul.
- ⚠️ **AJUSTAR:** confirmar ordem e proporção das cores no manual do Ifes.

## 4. Cor

Verde institucional sobre off‑white. O verde primário preenche; o verde‑escuro
carrega texto e títulos (passa no contraste **WCAG AA**). As cores da faixa
entram como apoio.

| Cor            | Hex (claro) | Hex (escuro) | Uso                                        |
| -------------- | ----------- | ------------ | ------------------------------------------ |
| Verde primário | `#009640`   | `#12B24A`    | Preenchimentos, gráficos, símbolo          |
| Verde escuro   | `#006B3F`   | `#1BA94C`    | Texto, títulos, links (AA)                 |
| Amarelo faixa  | `#FDB913`   | `#FFC73A`    | Destaque pontual (pico, marcador)          |
| Vermelho faixa | `#E30613`   | `#FF5A4D`    | Faixa, alerta                              |
| Azul faixa     | `#0072BC`   | `#3BA0E0`    | Faixa, 4ª série de gráfico                 |
| Tinta (texto)  | `#1A2B22`   | `#EAF1EC`    | Texto principal                            |
| Fundo          | `#F5F7F5`   | `#0E1512`    | Base                                       |
| Superfície     | `#FFFFFF`   | `#16201B`    | Cards                                      |
| Borda          | `#E1E7E2`   | `rgba(255,255,255,.12)` | Linhas/bordas                   |

- **Contraste:** branco sobre amarelo **reprova**. Se precisar de texto sobre o
  amarelo, use o verde‑escuro.
- Cor nunca é o único indicador de estado — mantenha ícone/rótulo junto.
- Suporta 3 níveis de contraste (normal/alto/máximo) e modo escuro — ver
  `global.css`.
- ⚠️ **AJUSTAR:** hex são estimativas — confirmar no manual do Ifes.

## 5. Tipografia

- **Ubuntu** (fonte digital da Rede Federal) para títulos e texto.
- **Ubuntu Mono** para números, rótulos de KPI e ticks de eixo.
- Pesos **400 / 500 / 700**. **Nunca 600** (o navegador arredonda e fica
  inconsistente).
- Self‑hosted em [`public/fonts/`](public/fonts/) (@font-face montado no Layout
  respeitando o base path). Sem chamada a CDN externa.
- ⚠️ **AJUSTAR:** confirmar com a comunicação do Ifes se Ubuntu é a fonte oficial.

## 6. Voz e tom

Português do Brasil, registro institucional‑sóbrio de portal público. Nomeie a
coisa pelo que ela é. Números falam sozinhos. Caixa‑baixa (só a 1ª letra
maiúscula, exceto nomes próprios).

| Não                                    | Sim                                                    |
| -------------------------------------- | ----------------------------------------------------- |
| Panorama vivo da produção científica   | Publicações por ano                                   |
| Eleve sua pesquisa a outro patamar     | Filtrar por campus                                    |
| Impressionantes 2.298 publicações      | 2.298 publicações                                     |
| Ops, não encontramos nada :(           | Nenhum projeto neste campus. Troque o filtro acima.   |

**Proibido:** adjetivos de marketing (poderoso, premium, inteligente, insights),
verbos de palco (eleve, desbloqueie, potencialize, transforme), emoji em
títulos/labels, metáforas decorativas, Title Case em português.

**Teste de cada frase:** se caberia num slide de venda de SaaS, reescreva.

## 7. Aplicação

**Faça**

- Sigla branca sobre o quadrado verde‑escuro.
- Verde‑escuro para texto e links; verde primário para preenchimentos.
- Amarelo só como destaque pontual (pico, marcador).
- Associe "Horizon" ao "Ifes" na primeira menção.
- Ubuntu 400/500/700; Ubuntu Mono para números.

**Evite**

- Texto branco sobre fundo amarelo.
- Peso 600.
- Title Case em português nos títulos de interface.
- Adjetivos de marketing e verbos de palco.
- Distorcer, girar ou recolorir o símbolo.

---

*Proposta de design. Itens marcados **AJUSTAR** pendem de confirmação no manual
de identidade do Ifes.*
