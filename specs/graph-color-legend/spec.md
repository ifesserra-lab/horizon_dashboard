# Especificação Técnica: Legendas de Cores para Grafos (Graph Color Legends)

Esta especificação descreve a implementação de legendas de cores interativas para os grafos do Horizon Dashboard, abrangendo o grafo ego-centrado de pesquisadores/estudantes e o grafo de rede de grupos de pesquisa.

---

## 1. Objetivo e Visão Geral

Atualmente, o dashboard apresenta grafos altamente interativos que utilizam cores para diferenciar tipos de conexões (relações) e perfis acadêmicos (estudantes, pesquisadores, etc.). No entanto, as informações sobre o significado dessas cores estão dispersas em textos estáticos ou são implícitas.

A proposta é implementar uma legenda de cores unificada, elegante e interativa na forma de um **painel flutuante e colapsável** no canto inferior esquerdo do contêiner do grafo. Isso garantirá fácil acesso à informação sem prejudicar a área visual útil para navegação, pan e zoom do usuário.

---

## 2. Análise do Código Atual e Esquemas de Cores

### 2.1. Grafo de Interação do Pesquisador
Localizado em: [PersonInteractionGraph.astro](file:///home/rafael/horizon_dashboard_h/src/components/researchers/PersonInteractionGraph.astro)

O grafo de pesquisador é desenhado via **SVG**. Suas cores representam os tipos de relacionamento (arestas/vínculos) e diferenciam o nó de foco dos nós periféricos.

*   **Esquema de Cores das Arestas/Vínculos** (baseado em `relationColors` no Astro frontmatter):
    *   **Projeto (`project`)**: `#0f766e` (Teal 700)
    *   **Orientação (`orientation` ou `advisorship`)**: `#d97706` (Amber 600)
    *   **Artigo (`article`)**: `#0284c7` (Sky 600)
    *   **Iniciativa (`initiative`)**: `#0891b2` (Cyan 600)
    *   **Grupo de Pesquisa (`research_group`)**: `#475569` (Slate 600)
    *   **Combinação de múltiplos vínculos**: `#7c3aed` (Violet 600) (retornado por `getRelationColor`)
    *   **Vínculo padrão/neutro**: `#94a3b8` (Slate 400)
*   **Estilo Visual dos Nós**:
    *   **Nó Central (Foco)**: Preenchimento com gradiente radial (`#f8fafc` a `#38bdf8`) e borda escura `#0f172a` (espessura 3.5).
    *   **Nós Periféricos**: Preenchimento branco (`#ffffff`) e borda colorida combinando com a cor do relacionamento dominante (`position.stroke`, espessura 2.5).

### 2.2. Grafo de Interação de Grupo de Pesquisa
Localizado em: [ResearchGroupInteractionGraph.astro](file:///home/rafael/horizon_dashboard_h/src/components/groups/ResearchGroupInteractionGraph.astro)

O grafo de grupo de pesquisa é desenhado em um **HTML5 Canvas** via Javascript. Suas cores representam a classificação acadêmica dos nós, seus papéis no grupo e os tipos de relações.

*   **Esquema de Cores dos Nós (Classificação)** (baseado em `CLASSIFICATION_COLORS` no script):
    *   **Pesquisador (`researcher`)**: `#38bdf8` (Sky 400)
    *   **Estudante (`student`)**: `#8b5cf6` (Violet 500)
    *   **Externo ao Ifes (`outside_ifes`)**: `#f59e0b` (Amber 500)
    *   **Sem Classificação (`null`)**: `#94a3b8` (Slate 400)
*   **Papéis dos Nós (Bordas e Detalhes)**:
    *   **Membro do Grupo**: Borda Azul (`#2563eb`), largura 2.1.
    *   **Não-Membro**: Borda Slate (`#94a3b8`), largura 1.2.
    *   **Vizinho via Orientação (não-membro)**: Adiciona um anel externo extra na cor Amber (`#f59e0b`), largura 1.8, à distância de `radius + 3`.
*   **Esquema de Cores das Arestas/Vínculos** (função `getRelationColor` no script):
    *   **Combinação de múltiplos vínculos**: `#7c3aed` (Violet 600)
    *   **Projeto (`project`)**: `#0f766e` (Teal 700)
    *   **Artigo (`article`)**: `#2563eb` (Blue 600) *[Discrepância: `#0284c7` no grafo de pesquisador]*
    *   **Orientação (`orientation` ou `advisorship`)**: `#d97706` (Amber 600)
    *   **Iniciativa (`initiative`)**: `#059669` (Emerald 600) *[Discrepância: `#0891b2` no grafo de pesquisador]*
    *   **Vínculo padrão/neutro**: `#475569` (Slate 600)

> [!NOTE]
> Identificamos pequenas discrepâncias de cores para os vínculos de **Artigo** e **Iniciativa** entre os dois arquivos. Como parte da implementação, propõe-se harmonizar essas cores para garantir consistência visual no sistema ou garantir que o componente de legenda possa receber esquemas de cores mapeados sob demanda via props.

---

## 3. Proposta de UI/UX

A legenda será apresentada como um painel flutuante posicionado sobre o grafo:

1.  **Posicionamento Estratégico**:
    *   Fixada no canto inferior esquerdo (`absolute bottom-4 left-4`) do contêiner do grafo.
    *   Evita colisões com o botão de "Resetar zoom" (localizado no canto inferior direito) e com os toggles de filtros (localizados no topo do contêiner).
2.  **Mecanismo de Colapso (Toggle)**:
    *   O painel iniciará expandido por padrão em telas grandes para dar contexto de leitura imediato.
    *   Haverá um botão do tipo toggle (ex: ícone de informação `i` ou seta `chevron`) que encolherá o painel para um estado minimizado.
    *   Quando minimizado, o componente exibirá apenas um pequeno botão flutuante redondo escrito "Legenda" ou com o ícone de informação.
    *   A propriedade `pointer-events-none` será aplicada ao contêiner de ancoragem, enquanto a legenda terá `pointer-events-auto` para que o clique na legenda funcione, mas o usuário ainda consiga interagir com o grafo nas áreas livres ao redor.
3.  **Estética Premium (Glassmorphic Card)**:
    *   Fundo semi-transparente com efeito de desfoque: `backdrop-blur-md bg-page-bg/85 border border-outline`.
    *   Cantos arredondados (`rounded-2xl`) e sombra elegante (`shadow-xl shadow-slate-900/5`).
    *   Tipografia utilizando a fonte `Outfit` para cabeçalhos e textos de alta legibilidade.
    *   Em telas de celulares (`max-width: 640px`), o painel será exibido **colapsado por padrão** para priorizar o espaço de visualização do grafo.

---

## 4. Arquitetura de Componentes

Para evitar duplicação de lógica e HTML, criaremos um único componente reutilizável em:
`src/components/graphs/GraphLegend.astro`

### 4.1. Estrutura de Props
O componente será parametrizado de forma que possa servir tanto para o Grafo de Pesquisador quanto para o Grafo de Grupo:

```typescript
export interface LegendItem {
  label: string;
  type: 'dot' | 'node' | 'line';
  color?: string;        // Cor de preenchimento (ex: nó ou círculo)
  strokeColor?: string;  // Cor da borda
  secondaryIndicator?: 'ring' | 'double'; // Ex: indicador de vizinho de orientação
}

export interface LegendSection {
  title: string;
  items: LegendItem[];
}

export interface Props {
  sections: LegendSection[];
}
```

### 4.2. Renderização de Elementos Visuais
A legenda desenhará marcadores visuais correspondentes às representações reais no SVG e no Canvas:
*   `type: 'dot'`: Renderiza um círculo preenchido simples (ex: cores de arestas ou tipos de conexões).
*   `type: 'node'`: Renderiza a simulação de um nó de grafo (círculo com preenchimento, borda colorida e opcionalmente uma borda extra/anel para representar vizinho de orientação).
*   `type: 'line'`: Renderiza um traço colorido (representando a aresta física no grafo).

---

## 5. Acessibilidade (a11y)

Garantiremos que a legenda seja acessível a todos os usuários, incluindo os que utilizam leitores de tela:

1.  **Semântica HTML**:
    *   O contêiner usará a tag `<aside>` ou uma `div` com `role="region"` acompanhada de `aria-label="Legenda do Grafo"`.
2.  **Estado do Botão (Toggle)**:
    *   O botão de colapso terá `aria-expanded="true"` quando aberto e `aria-expanded="false"` quando fechado.
    *   O painel de conteúdo terá um `id` único e o botão terá `aria-controls="[id-do-conteudo]"`.
    *   O botão terá um rótulo acessível via `aria-label="Minimizar legenda"` ou `aria-label="Expandir legenda"`.
3.  **Leitura de Cores**:
    *   Os marcadores visuais coloridos receberão `aria-hidden="true"`, pois são apenas decorativos.
    *   O texto explicativo de cada item representará o seu significado de forma completa.
    *   Opcionalmente, incluiremos uma explicação para leitores de tela usando a classe utilitária de acessibilidade `sr-only` detalhando o formato visual (ex: `Preenchimento roxo com borda azul representa Estudante Membro`).

---

## 6. Plano de Tarefas (Task List)

- [ ] **Fase 1: Criação do Componente Comum**
    - [ ] Criar o arquivo [GraphLegend.astro](file:///home/rafael/horizon_dashboard_h/src/components/graphs/GraphLegend.astro).
    - [ ] Definir a interface de propriedades (`Props`, `LegendSection`, `LegendItem`).
    - [ ] Escrever o markup HTML com as classes de estilização premium (glassmorphism, transições suaves).
    - [ ] Adicionar acessibilidade (ARIA tags, controle de estado, suporte a teclado).
    - [ ] Implementar o script cliente (`<script>`) para gerenciar o estado colapsado/expandido com suporte a transição de opacidade/altura.
- [ ] **Fase 2: Integração no Grafo do Pesquisador**
    - [ ] Importar `GraphLegend` no [PersonInteractionGraph.astro](file:///home/rafael/horizon_dashboard_h/src/components/researchers/PersonInteractionGraph.astro).
    - [ ] Mapear as seções da legenda:
        -   **Vínculos (Arestas)**: Projetos (Teal), Artigos (Sky), Orientação (Amber), Iniciativa (Cyan), Grupo de Pesquisa (Slate), Conexões Múltiplas (Violet).
        -   **Nós**: Nó Central (Degradê Azul, Borda Escura), Nós Conectados (Fundo Branco, Borda Colorida).
    - [ ] Adicionar o componente ao contêiner `relative` do SVG no canto inferior esquerdo.
- [ ] **Fase 3: Integração no Grafo do Grupo de Pesquisa**
    - [ ] Importar `GraphLegend` no [ResearchGroupInteractionGraph.astro](file:///home/rafael/horizon_dashboard_h/src/components/groups/ResearchGroupInteractionGraph.astro).
    - [ ] Mapear as seções da legenda:
        -   **Classificação Acadêmica (Nós)**: Pesquisadores (Sky), Estudantes (Violet), Externos (Amber), Não Classificados (Slate).
        -   **Papel no Grupo (Bordas)**: Membro do Grupo (Borda azul espessa), Não-Membro (Borda cinza fina), Vizinho de Orientação (Borda cinza com anel externo laranja).
        -   **Vínculos (Arestas)**: Projeto (Teal), Artigo (Blue), Orientação/Advisorship (Amber), Iniciativa (Emerald), Conexões Múltiplas (Violet).
    - [ ] Adicionar o componente ao contêiner do Canvas no canto inferior esquerdo.
- [ ] **Fase 4: Harmonização Visual e Testes**
    - [ ] Resolver discrepâncias de cores nas arestas para garantir uniformidade visual entre os dois grafos (ex: unificar as cores dos vínculos de Artigo e Iniciativa, ou manter o mapeamento explícito e independente bem documentado).
    - [ ] Testar em resoluções móveis (mobile) garantindo que a legenda inicie colapsada e que o pan/zoom do grafo continue operacional sem cliques acidentais.
    - [ ] Validar conformidade de acessibilidade (foco de teclado, contraste das cores, leitores de tela).
