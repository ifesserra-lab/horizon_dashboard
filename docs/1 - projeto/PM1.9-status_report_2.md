# Status Report 2
**Projeto:** Horizon Dashboard
**Período:** 16/01/2026 a 30/01/2026
**Versão Relatada:** v1.6.0 (Researcher Profiles & Data Update)
| **v1.6.0** | Researcher Profiles Enhancement & Canonical Data | **Entregue** | v1.6.0 |
**Responsável:** Antigravity (Senior PM)

---

# 1. Resumo Executivo
A **v1.6.0** entregou melhorias significativas nos perfis dos pesquisadores, incluindo a exibição de papéis (Orientador/Orientando) e links para projetos relacionados. Além disso, a base de dados canônica foi atualizada para refletir as últimas integrações de dados.

---

# 2. Progresso da Sprint / Iteração
| Item | Descrição | Status | PR/Versão |
|------|-----------|--------|-----------|
| **PR #64** | Researcher Profiles Enhancement | **Entregue** | v1.6.0 |
| **Data Update** | Atualização de arquivos canonical e mart | **Entregue** | v1.6.0 |
| **US-003** | Perfil do Pesquisador (Redesign) | **Concluído** | v1.5.0 |

---

# 3. Entregáveis Técnicos
- `src/pages/researchers/index.astro`: Cards aprimorados com papéis e projetos.
- `src/pages/researchers/[id].astro`: Página de detalhes atualizada.
- `src/data/canonical/*.json`: Base de dados sincronizada.

---

# 4. Pendências e Impedimentos
| ID | Descrição | Impacto | Ação Necessária |
|----|------------|---------|-----------------|
| - | - | - | - |

---

# 5. Riscos e Mitigações
| ID | Risco | Status | Mitigação |
|----|-------|--------|-----------|
| **RISK-03** | Integridade dos dados canônicos | **Monitorado** | Monitoramento de scripts de ETL. |

---

# 6. Próximas Ações
- Implementar Visualização de Publicações (US-031).
- Refinar Dashboard de Transparência.

## 7. Aprovação
| Nome | Cargo | Data |
|------|--------|------|
| Antigravity | Senior Lead | 28/01/2026 |
