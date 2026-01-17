# Horizon - Portal de Pesquisa, Extensão e Pós-Graduação

![Status](https://img.shields.io/badge/status-live-success) ![Version](https://img.shields.io/badge/version-v1.3.0-blue) ![WCAG](https://img.shields.io/badge/WCAG-2.1%20AA-green)

**Horizon** é um dashboard acadêmico de última geração projetado para visualizar, monitorar e gerenciar dados de grupos de pesquisa, projetos de pesquisa e extensão. Construído com rigorosa aderência aos padrões Agile e princípios premium de UX, fornece uma plataforma centralizada para rastreamento de outputs de pesquisa, dinâmicas de liderança e impacto institucional.

🔗 **Site em Produção:** **[https://ifesserra-lab.github.io/horizon_dashboard/](https://ifesserra-lab.github.io/horizon_dashboard/)**

---

## ✨ Principais Funcionalidades

### 🎯 Portal de Grupos de Pesquisa
- **Catálogo Completo**: Listagem de todos os grupos de pesquisa da instituição
- **Busca Inteligente**: Filtro em tempo real por nome, campus, área de conhecimento e líder
- **Detalhamento**: Visualização completa de cada grupo com membros (atuais e egressos), linhas de pesquisa e informações de contato
- **Avatars Dinâmicos**: Siglas dos grupos exibidas em avatars coloridos

### 📊 Portal de Projetos
- **Catálogo de Projetos**: Listagem de projetos de pesquisa e extensão
- **Busca e Filtros**: Filtro por nome e status (ativo/concluído)
- **Detalhamento**: Visualização de equipe, período de execução, status e descrição completa
- **Equipes Completas**: Coordenadores, pesquisadores e estudantes vinculados a cada projeto

### 📈 Analytics e Visualizações
- **Dashboard de Áreas de Conhecimento**: Top 10 Áreas mais produtivas
- **Evolução Temporal**: Gráficos de evolução de projetos (iniciados/concluídos)
- **Distribuição de Grupos**: Visualização da distribuição de grupos por grande área
- **KPIs Institucionais**: Métricas de impacto e produção acadêmica

### ♿ Acessibilidade Completa (v1.3.0)
**Conformidade WCAG 2.1 Nível AA Certificada**

#### Temas e Contraste
- **Tema Automático**: Detecta preferência do sistema (`prefers-color-scheme`)
- **Tema Light/Dark**: Alternância manual entre modos claro e escuro
- **3 Níveis de Contraste**:
  - Normal: Contraste padrão (≥4.5:1)
  - Alto: Contraste aprimorado (≥7:1)
  - **Máximo**: Contraste extremo WCAG AAA (≥21:1, #000/#FFF)

#### Tipografia Adaptável
- **4 Níveis de Fonte**:
  - Pequena (87.5%)
  - Normal (100%)
  - Grande (125%)
  - Extra (175%)

#### Opções Avançadas
- **Reduzir Movimento**: Desabilita animações e transições para usuários sensíveis a movimento
- **Indicadores de Foco Aprimorados**: Outline de 4px em elementos focados para navegação por teclado
- **Otimização para Leitores de Tela**: Markup otimizado para compatibilidade com NVDA, JAWS, VoiceOver
- **Restaurar Padrões**: Reset instantâneo de todas configurações

#### Navegação por Teclado
- **Tab/Shift+Tab**: Navegação completa entre elementos
- **Enter/Space**: Ativação de controles
- **ESC**: Fechamento de modais e painéis
- **Landmarks ARIA**: Estrutura semântica completa

### 🎨 Design Premium
- **Glassmorphism**: Efeitos modernos de vidro translúcido com gradientes vibrantes
- **Mobile First**: Design responsivo partindo de mobile para desktop
- **Tipografia**: Google Font "Outfit" para melhor legibilidade
- **Animações Suaves**: Transições e micro-interações para melhor UX
- **Dark Mode Nativo**: Construído desde o início com tema escuro sofisticado

### 🔄 CI/CD e Deploy
- **Deploy Automático**: Zero-touch deployment para GitHub Pages via GitHub Actions
- **Versionamento Semântico**: Tags automáticas com cada release
- **Base Path Dinâmico**: Suporte para hospedagem em subdiretórios
- **Build Otimizado**: 87 páginas estáticas geradas com SSG

---

## 🎓 Conformidade WCAG 2.1 AA

O Horizon Dashboard foi desenvolvido com **conformidade estrita ao WCAG 2.1 Nível AA**, garantindo que a plataforma seja acessível a todos os usuários, incluindo aqueles com necessidades especiais.

### Critérios Atendidos

#### ✅ Perceptível
- **Contraste de Cores**: Razão mínima de 4.5:1 (Normal), 7:1 (Alto), 21:1 (Máximo)
- **Alternativas Textuais**: Todos elementos não-textuais possuem alternativas
- **Adaptabilidade**: Conteúdo adaptável a diferentes modos de apresentação
- **Distinguível**: Cores não são o único meio visual de transmitir informação

#### ✅ Operável
- **Navegação por Teclado**: Todas funcionalidades acessíveis via teclado
- **Tempo Suficiente**: Sem limites de tempo para interação
- **Prevenção de Convulsões**: Controle de animações via "Reduzir Movimento"
- **Navegável**: Múltiplas formas de localizar conteúdo (busca, navegação, breadcrumbs)

#### ✅ Compreensível
- **Legível**: Linguagem clara e objetiva em português
- **Previsível**: Componentes funcionam de forma consistente
- **Assistência de Entrada**: Labels descritivos em todos os formulários

#### ✅ Robusto
- **Compatível**: Markup compatível com tecnologias assistivas
- **Nome, Função, Valor**: Todos componentes UI possuem ARIA apropriado

### Ferramentas de Validação
- ✅ Lighthouse Accessibility Score > 95
- ✅ Testado com NVDA (Windows)
- ✅ Testado com VoiceOver (macOS/iOS)
- ✅ Validação de HTML semântico

---

## 🛠️ Stack Tecnológica

- **Framework**: [Astro 4.0](https://astro.build/) (Static Site Generation)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + CSS Variables customizadas
- **Charts**: [Apache ECharts](https://echarts.apache.org/)
- **Icons**: Lucide React / Heroicons
- **Testing**: [Vitest](https://vitest.dev/) + jsdom
- **Deployment**: GitHub Actions + GitHub Pages
- **Process**: Agile (Scrum/Kanban) com governança estrita de projeto

---

## 📂 Estrutura do Projeto

```text
/
├── public/                 # Assets estáticos
├── src/
│   ├── components/         # Componentes UI reutilizáveis
│   │   ├── AccessibilityToggle.astro   # Painel de acessibilidade
│   │   ├── Breadcrumbs.astro           # Navegação estrutural
│   │   ├── GroupCard.astro             # Card de grupo
│   │   └── Search.astro                # Busca inteligente
│   ├── layouts/            # Layouts globais
│   │   └── Layout.astro    # Layout base com header/sidebar
│   ├── pages/              # Rotas da aplicação
│   │   ├── groups/         # Portal de Grupos
│   │   ├── projects/       # Portal de Projetos
│   │   ├── knowledge-areas/# Dashboard de Áreas
│   │   └── index.astro     # Home Dashboard
│   ├── styles/             # Estilos globais
│   │   └── global.css      # CSS variables e utils
│   └── data/               # Fontes de dados JSON canônicas
├── tests/                  # Suite de testes
│   ├── accessibility.test.ts  # Testes de acessibilidade
│   └── projects.test.ts       # Testes de lógica
├── docs/                   # Documentação do projeto
│   ├── 1 - projeto/        # PM (Governance, Plans, Status)
│   └── 2 - implementacao/  # SI (Requirements, Architecture, Design)
└── astro.config.mjs        # Configuração Astro
```

---

## ⚡ Começando

### Pré-requisitos
- Node.js v18+
- npm ou pnpm

### Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/ifesserra-lab/horizon_dashboard.git
   cd horizon_dashboard
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Execute o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```
   Acesse em `http://localhost:4321/horizon_dashboard/`

4. **Build para produção**
   ```bash
   npm run build
   ```

5. **Execute os testes**
   ```bash
   npm test
   ```

---

## 📚 Documentação

A documentação detalhada do projeto é mantida na pasta `docs/`:

### Governança de Projeto
- **`docs/1 - projeto/`**: Planos, Governança e Relatórios de Status
  - `PM1.0-sow.md`: Escopo e Statement of Work
  - `PM1.1-mission_statement.md`: Missão estratégica
  - `PM1.2-1.8-project_plan.md`: Plano mestre (WBS, Schedule, Recursos)
  - `PM1.3-release_plan.md`: Roadmap de releases
  - `PM1.9-status_report_*.md`: Relatórios bi-semanais
  - `PM1.10-Project_closure_report.md`: Formalidades de encerramento

### Implementação
- **`docs/2 - implementacao/`**: Requisitos, Arquitetura e Especificações
  - `SI1-Requisitos.md`: Requisitos funcionais e não-funcionais
  - `SI2-Analise.md`: Entendimento do domínio, fluxos, modelo conceitual
  - `SI.3-product_backlog_initiation.md`: User Stories, Priorização, Critérios
  - `SI.3-design.md`: Arquitetura de software, diagramas, contratos de API

### Backlog
- **`docs/backlog.md`**: Backlog geral do projeto com releases e itens de trabalho

---

## 🧪 Testes

O projeto possui uma suite abrangente de testes:

```bash
# Executar todos os testes
npm test

# Executar em modo watch
npm test -- --watch

# Executar com coverage
npm test -- --coverage
```

**Coverage Atual**: 26 testes passando (100%)
- 22 testes de acessibilidade
- 4 testes de lógica de negócio

---

## 🤝 Contribuindo

Este projeto segue um workflow **GitFlow** rigoroso:

1. **Fork e Clone**: Fork o repositório e clone localmente
2. **Branch**: Crie uma feature branch a partir de `developing`
   ```bash
   git checkout developing
   git pull origin developing
   git checkout -b feat/minha-funcionalidade
   ```
3. **Develop**: Faça suas alterações seguindo os padrões do projeto
4. **Test**: Execute os testes e garanta que todos passam
5. **Commit**: Faça commits seguindo [Conventional Commits](https://www.conventionalcommits.org/)
   ```bash
   git commit -m "feat: adiciona nova funcionalidade X"
   ```
6. **Push**: Envie para seu fork
   ```bash
   git push origin feat/minha-funcionalidade
   ```
7. **Pull Request**: Abra um PR para `developing` via GitHub
8. **Review**: Aguarde review e aprovação
9. **Merge**: Deploy automático para `main` após merge

### Padrões de Código
- ✅ ESLint + Prettier configurados
- ✅ Conventional Commits obrigatórios
- ✅ TDD (Test-Driven Development)
- ✅ WCAG 2.1 AA compliance em todos componentes UI
- ✅ Mobile First em todos layouts

---

## 📊 Releases

| Versão | Data | Descrição | Links |
|--------|------|-----------|-------|
| **v1.3.0** | 16/01/2026 | Enhanced Accessibility Panel | [PR #58](https://github.com/ifesserra-lab/horizon_dashboard/pull/58), [#56](https://github.com/ifesserra-lab/horizon_dashboard/issues/56) |
| **v1.2.2** | 16/01/2026 | Bugfix: Home Chart Hover Clipping | [PR #50](https://github.com/ifesserra-lab/horizon_dashboard/pull/50) |
| **v1.2.0** | 16/01/2026 | Feature: Visual Standards & Analytics | [PR #48](https://github.com/ifesserra-lab/horizon_dashboard/pull/48) |
| **v1.1.0** | 14/01/2026 | Feature: Project Team & Sidebar | [PR #40](https://github.com/ifesserra-lab/horizon_dashboard/pull/40) |
| **v1.0.0** | 10/01/2026 | R1 - Portal de Grupos (Lançamento) | - |

Veja o [CHANGELOG completo](docs/backlog.md) para histórico detalhado.

---

## 📜 Licença

Este projeto está sob licença conforme definido pela instituição.

---

## 👥 Time

Desenvolvido com ❤️ pela equipe do **Projeto Horizon** seguindo rigorosos padrões de governança Agile e excelência técnica.

### Links Úteis
- 🌐 [Site em Produção](https://ifesserra-lab.github.io/horizon_dashboard/)
- 📘 [Documentação Completa](docs/)
- 🐛 [Reportar Bug](https://github.com/ifesserra-lab/horizon_dashboard/issues/new?labels=bug)
- 💡 [Sugerir Feature](https://github.com/ifesserra-lab/horizon_dashboard/issues/new?labels=feature)

---

<p align="center">
  <strong>Horizon Dashboard</strong> - Plataforma central para explorar o horizonte de pesquisa, extensão e pós-graduação institucional.
</p>
