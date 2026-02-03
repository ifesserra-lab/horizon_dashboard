# Product Backlog – Sprints (Horizon Dashboard)
**Última atualização:** 16/01/2026  
**Responsável (PO):** Paulo Jr.  
**Versão do Documento:** 2.0  

---

# 1. Visão Geral

Este Product Backlog reúne todas as **User Stories (US)** executadas em sprints para o Horizon Dashboard, servindo como base para:

- Planejamento de Releases (PM1.3)  
- Planejamento de Sprints  
- Geração de Tasks no Sprint Backlog  
- Rastreabilidade ISO 29110 (SI.1 → SI.3)  
- Automação de criação de issues no GitHub Projects  

Cada US contém **título, prioridade, critérios de aceitação, notas técnicas, origem SI.1–SI.3, e os metadados necessários para rastreabilidade**.

---

# 2. Convenções

| Campo | Descrição |
|-------|-----------|
| `ID` | Identificador único (US-001) |
| `Título` | Nome curto da funcionalidade |
| `Milestone` | Release (R1) |
| `Prioridade` | Alta / Média / Baixa / Crítica |
| `Tamanho` | Pontos (estimativa inicial) |
| `Origem` | SI.1 (Requisitos) / SI.2 (Processos) / SI.3 (Design) |
| `Descrição` | Contexto e objetivo da US |
| `Critérios de Aceitação` | Lista testável |
| `Dependencies` | Dependências técnicas ou funcionais |
| `Notas Técnicas` | Restrições, ADRs, módulos afetados |
| `Tags` | tipo:us, area:backend, area:frontend etc. |
| `GitHub Issue` | Link para issue no GitHub |
| `Status` | Pendente / In Progress / Done |
| `Versão` | Versão de entrega (v1.x.x) |

---

# 3. Sprints Executados

## Sprint 1 - Portal de Grupos (v1.0.0 - v1.1.x)

**Período**: 10/01/2026 - 14/01/2026  
**Objetivo**: Lançamento do R1 - Portal de Grupos de Pesquisa

### User Stories Concluídas

- **US-001**: Dashboard Home (v1.0.0)
- **US-002**: Catálogo de Grupos (v1.0.0)
- **US-003**: Detalhes do Grupo (v1.0.0)
- **US-006**: Dashboard de Áreas de Conhecimento (v1.0.6)
- **US-012**: Top 10 Research Lines (v1.0.6)
- **US-015**: Separação de Membros (v1.0.10)
- **US-019**: Recursos de Acessibilidade Básica (v1.1.1)
- **US-020**: Magnificação de Texto (v1.1.2)
- **US-018**: Equipe nos Detalhes do Projeto (v1.1.0)

---

## Sprint 2 - Acessibilidade Avançada (v1.3.0)

**Período**: 15/01/2026 - 16/01/2026  
**Objetivo**: Implementar painel de acessibilidade completo com conformidade WCAG 2.1 AA

### US-030 – Painel de Acessibilidade Completo
**GitHub Issue**: [#56](https://github.com/ifesserra-lab/horizon_dashboard/issues/56)

```yaml
id: US-030
milestone: R1
prioridade: Crítica
tamanho: 8
origem:
  - RF-27 (SI1_requisitos)
  - RNF-02 (SI1_requisitos - WCAG 2.1 AA)
  - RF-11 (SI1_requisitos - Accessibility)
tags:
  - type:feature
  - area:frontend
  - component:accessibility
  - wcag:aa
dependencias:
  - US-019 (Acessibilidade Básica)
  - US-020 (Text Scaling)
modulos_afetados:
  - src/components/AccessibilityToggle.astro
  - src/styles/global.css
  - src/layouts/Layout.astro
  - tests/accessibility.test.ts
status: Done
versao: v1.3.0
pull_requests:
  - "#57: feat: Enhanced Accessibility Panel"
  - "#58: release: v1.3.0"
```

#### Descrição  
Implementar painel de acessibilidade completo que consolida e expande os recursos existentes (US-019 e US-020) em uma interface unificada seguindo o design fornecido. O painel oferece controle granular sobre tema, contraste, tipografia e opções avançadas de acessibilidade, garantindo conformidade estrita com WCAG 2.1 Nível AA.

#### Contexto
Esta user story evolui os recursos básicos de acessibilidade implementados anteriormente (high-contrast, grayscale, text scaling) para um sistema completo e profissional que atende todos os critérios WCAG 2.1 AA e oferece uma experiência personalizada para usuários com necessidades especiais.

#### Critérios de Aceitação

**Tema (Seletor de 3 opções)**:
- [x] Implementar botão "Claro" (Light mode)
- [x] Implementar botão "Escuro" (Dark mode)
- [x] Implementar botão "Auto" (segue preferência do sistema via `prefers-color-scheme`)
- [x] Exibir ícones apropriados para cada modo (sol, lua, monitor)
- [x] Indicar visualmente o tema ativo com borda/background diferenciado

**Contraste (3 níveis)**:
- [x] "Normal" - contraste padrão atual (≥4.5:1)
- [x] "Alto" - evolução do high-contrast existente (≥7:1)
- [x] "Máximo" - contraste extremo para WCAG AAA (≥21:1, preto puro #000 / branco puro #FFF)
- [x] Remover modo "Escala de Cinza" (não presente no novo design)
- [x] Indicar visualmente o nível ativo

**Tamanho da Fonte (4 níveis)**:
- [x] "Pequena" (87.5% - novo)
- [x] "Normal" (100% - renomear de "Base")
- [x] "Grande" (125% - renomear de "Lg")
- [x] "Extra" (175% - expandir de 150%)
- [x] Exibir exemplos visuais de tamanho (A, A+, etc.)

**Opções Adicionais (Toggles)**:
- [x] **Reduzir Movimento**:
    - Toggle switch funcional
    - Descrição: "Minimiza animações e transições"
    - Aplicar classe `:root.reduce-motion` que desabilita animações
- [x] **Indicadores de Foco**:
    - Toggle switch funcional
    - Descrição: "Destaca elementos focados"
    - Aplicar classe `:root.enhanced-focus` com outline mais visível (4px)
- [x] **Otimizar para Leitor de Tela**:
    - Toggle switch funcional
    - Descrição: "Melhora compatibilidade com leitores de tela"
    - Aplicar classe `:root.screen-reader-optimized` que otimiza markup

**Restaurar Padrões**:
- [x] Botão "Restaurar Padrões" no final do painel
- [x] Ao clicar, resetar todas as configurações para valores default
- [x] Fornecer feedback visual (animação de scale) de reset bem-sucedido

**Persistência e Performance**:
- [x] Todas as configurações persistidas em `localStorage`
- [x] Estado carregado antes do primeiro render (evitar FOUC)
- [x] Classes aplicadas no `:root` para efeito global

**UI/UX**:
- [x] Painel visualmente idêntico ao design fornecido
- [x] Header "Acessibilidade" com botão de fechar (×)
- [x] Seções claramente delimitadas com títulos
- [x] Botões de toggle com feedback visual claro (ativo/inativo)
- [x] Design responsivo (mobile-first)
- [x] Acessível via teclado (Tab, Enter, ESC)
- [x] Conformidade WCAG 2.1 AA no próprio painel

**Testes**:
- [x] Testes unitários para lógica de toggle e persistência (22 testes)
- [x] Testes de integração para carregamento de preferências
- [x] Build sem erros (87 páginas geradas)
- [x] Validação manual com navegação por teclado

#### Notas Técnicas

**Abordagem TDD**:
- Implementação seguiu Test-Driven Development
- 22 testes criados antes da implementação
- 100% dos testes passando

**Mudanças Técnicas**:
1. **AccessibilityToggle.astro**: Refatoração completa (220 → 430 linhas)
2. **global.css**: 
   - Novo sistema de contraste (`.contrast-high`, `.contrast-maximum`)
   - Nova escala de fonte (`.text-scale-sm`, expansão `.text-scale-xl`)
   - Classes de acessibilidade (`.reduce-motion`, `.enhanced-focus`, `.screen-reader-optimized`)
3. **Layout.astro**:
   - Suporte a tema "auto" com detecção de `prefers-color-scheme`
   - Migração automática de configurações legadas
   - Carregamento de 6 novas preferências

**Backward Compatibility**:
- Migração automática: `high-contrast: true` → `contrast: 'high'`
- Manutenção de `theme` key para compatibilidade
- Validação de localStorage keys existentes

**Padrões de Acessibilidade**:
- ARIA landmarks: `role="dialog"`, `aria-label`, `aria-expanded`
- Navegação por teclado: Tab, Enter, Space, ESC
- Focus management: auto-focus no primeiro elemento
- Contraste de cores: validado para AA/AAA
- Semantic HTML: uso correto de `<button>`, `<label>`, `<input type="checkbox">`

**Performance**:
- Classes aplicadas via JavaScript inline no `<head>` (zero FOUC)
- LocalStorage lido síncronamente antes do render
- CSS variables para mudanças instantâneas de tema/contraste

---

# 4. Backlog Refinado - Sprint 2

| ID | Título | Milestone | Tamanho | Prioridade | Status | Versão | Issue |
|----|--------|-----------|---------|------------|--------|--------|-------|
| **US-030** | Painel de Acessibilidade Completo | R1 | 8 | Crítica | **Done** | v1.3.0 | [#56](https://github.com/ifesserra-lab/horizon_dashboard/issues/56) |
| **US-040** | Refatoração de Dados do Perfil de Pesquisador | R2 | 5 | Alta | **Done** | v1.8.0 | - |

**Velocity**: 13 pontos  
**Testes**: 26/26 passing (100%)  
**Build**: ✅ Successful  
**Deployment**: ✅ Automated via tag v1.8.0

---

# 5. Definition of Done (Sprint 2)

### Verificação Técnica
- [x] **Pipeline Success**: CI/CD pipeline passed
- [x] Test suite passing (26/26 tests, 100%)
- [x] Build successful (87 páginas estáticas)
- [x] Linting checks passing

### Documentação
- [x] Código documentado (JSDoc inline)
- [x] `docs/2 - implementacao/SI1-2 - identification/SI1-Requisitos.md` atualizado (RF-27)
- [x] `docs/2 - implementacao/SI3 - initiation/SI.3-product_backlog_initiation.md` atualizado (US-030)
- [x] `docs/backlog.md` atualizado (v1.3.0 com PR/Issue links)
- [x] `walkthrough.md` criado com prova de trabalho
- [x] `README.md` atualizado com features e WCAG compliance

### Closure
- [x] Issue #56 fechado com confirmação de entrega
- [x] PRs merged (#57 → developing, #58 → main)
- [x] Branches deletados (feat/enhanced-accessibility-panel, feat/projects-dashboard)
- [x] Tag v1.3.0 criado e pushed
- [x] Deploy automático executado via GitHub Actions

### Conformidade WCAG 2.1 AA
- [x] Contraste de cores ≥4.5:1 (AA) ou ≥7:1 (AAA)
- [x] Navegação por teclado completa
- [x] ARIA landmarks e labels
- [x] Semantic HTML
- [x] Focus indicators visíveis
- [x] Compatibilidade com leitores de tela
- [x] Suporte a reduce-motion

---

# 6. Preparação para Sprint Planning (Sprint 3)

Cada US deve estar **pronta para entrar na Sprint** se:

## DoR – Definition of Ready
- [ ] US tem descrição clara  
- [ ] Critérios de aceitação testáveis  
- [ ] Impactos e dependências conhecidos  
- [ ] Tamanho estimado  
- [ ] Tags definidas  
- [ ] Impactos SI.1 → SI.3 identificados
- [ ] GitHub Issue criado com labels/milestone
- [ ] Design/wireframes aprovados (se aplicável)

---

# 7. Métricas - Sprint 2

### Planejamento vs Execução
- **Planejado**: 8 pontos (US-030)
- **Entregue**: 8 pontos (US-030)
- **Velocity**: 100%

### Qualidade
- **Testes**: 26/26 passing (22 novos + 4 regressão)
- **Coverage**: Acessibilidade 100% coberta
- **Build Time**: < 2 segundos
- **WCAG Score**: AA compliant

### Deployment
- **Time to Production**: < 2 horas (aprovação → deploy)
- **Rollback**: Não necessário
- **Hotfixes**: 0

### Retrospectiva
**O que funcionou bem**:
- ✅ Abordagem TDD acelerou desenvolvimento
- ✅ Design fornecido facilitou implementação
- ✅ Automação de deploy eliminou erros manuais

**O que pode melhorar**:
- 🔄 Migração de configurações legadas poderia ser mais explícita para usuários
- 🔄 Documentação de WCAG poderia ter mais exemplos visuais

**Ações para próximo sprint**:
- 📋 Adicionar tooltips explicativos em opções de acessibilidade
- 📋 Criar guia visual de conformidade WCAG no README

---

# 8. Rastreabilidade ISO 29110

| Artefato | Referência | Status |
|----------|------------|--------|
| **SI.1 Requisitos** | RF-27, RF-11, RNF-02 | ✅ Atualizado |
| **SI.2 Análise** | Fluxo de Acessibilidade | ✅ Documentado |
| **SI.3 Product Backlog** | US-030 | ✅ Done |
| **SI.3 Design** | Wireframe fornecido | ✅ Implementado |
| **SI.4 Testes** | 22 unit tests | ✅ Passing |
| **PM1.3 Release Plan** | R1 - Knowledge Areas Expansion | ✅ Entregue |
| **PM1.9 Status Report** | Report #2 (16/01/2026) | ⏳ A atualizar |

---

# 9. Links e Referências

### GitHub
- **Issue**: [#56 - US-030: Painel de Acessibilidade Completo](https://github.com/ifesserra-lab/horizon_dashboard/issues/56)
- **PR Development**: [#57](https://github.com/ifesserra-lab/horizon_dashboard/pull/57)
- **PR Release**: [#58](https://github.com/ifesserra-lab/horizon_dashboard/pull/58)
- **Tag**: [v1.3.0](https://github.com/ifesserra-lab/horizon_dashboard/releases/tag/v1.3.0)
- **Commit**: [74652ef](https://github.com/ifesserra-lab/horizon_dashboard/commit/74652ef)

### Documentação
- **Walkthrough**: `/brain/walkthrough.md`
- **Implementation Plan**: `/brain/implementation_plan.md`
- **Task Tracking**: `/brain/task.md`

### Produção
- **Site**: [https://ifesserra-lab.github.io/horizon_dashboard/](https://ifesserra-lab.github.io/horizon_dashboard/)

---

**Última atualização**: 16/01/2026 22:44 BRT  
**Próxima Sprint Planning**: A definir
