# Status Report 5
**Projeto:** Horizon Dashboard
**Período:** 06/02/2026
**Versão Relatada:** v2.1.0-draft (Advisorship Chart Segmentation)

| Versão | Descrição | Status | PR/Versão |
|--------|-----------|--------|-----------|
| **v2.1.0** | Segmentação do gráfico de orientações por tipo | **Em Planejamento** | - |

**Responsável:** Antigravity (Senior PM)

---

# 1. Resumo Executivo
Esta iteração foca na melhoria da visualização das orientações acadêmicas no perfil do pesquisador. O objetivo é permitir que o usuário identifique rapidamente a distribuição dos tipos de orientação (Mestrado, Iniciação Científica, etc.) ao longo do tempo através de um gráfico segmentado.

---

# 2. Progresso da Sprint / Iteração
| Item | Descrição | Status | PR/Versão |
|------|-----------|--------|-----------|
| **RF-46** | Segmentação do gráfico de orientações por tipo | **Entregue** | v2.1.0 |
| **RF-47** | Exibição de valores nas barras do gráfico | **Entregue** | v2.1.0 |
| **RF-48** | Busca e Scroll Infinito nos Projetos | **Entregue** | v2.1.0 |

---

# 3. Entregáveis Técnicos (Previstos)
- `src/components/researchers/ResearcherProfileDashboard.astro`: Atualização da lógica de agregação de dados.
- `src/components/shared/StackedBarChart.astro`: Novo componente ou atualização do `BarChart.astro` para suportar séries múltiplas.

---

# 4. Pendências e Impedimentos
| ID | Descrição | Impacto | Ação Necessária |
|----|------------|---------|-----------------|
| - | Consistência dos dados de "Type" nas orientações | Baixo | Validar se os tipos estão vindo corretamente do arquivo canônico (atualmente muitos constam como "None"). |

---

# 5. Riscos e Mitigações
| ID | Risco | Status | Mitigação |
|----|-------|--------|-----------|
| **RISK-06** | Dados "None" no gráfico | **Identificado** | Implementar agrupamento de tipos desconhecidos como "Outros" ou "Não Informado". |

---

# 6. Próximas Ações
- Finalizar Plano de Implementação.
- Implementar componente de gráfico segmentado.
- Validar com dados reais.

## 7. Aprovação
| Nome | Cargo | Data |
|------|--------|------|
| Antigravity | Senior Lead | 06/02/2026 |
