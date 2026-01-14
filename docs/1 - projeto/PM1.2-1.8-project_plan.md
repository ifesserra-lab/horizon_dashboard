# Project Plan
**Projeto:** Horizon Dashboard
**Data:** 06/01/2026
**Autor:** Antigravity (Senior PM)
**Versão:** 1.0

---

# 1. Escopo e WBS (PM1.2)
A estrutura analítica do projeto (EAP/WBS) foca na entrega progressiva da interface de visualização:

1.  **Fundação e Visualização de Grupos** (Mês 1)
    1.1. Setup do Projeto (Astro + Tailwind + Linter).
    1.2. Design System (Tipografia, Cores, Componentes Básicos).
    1.3. Página de Listagem de Grupos (Busca e Filtros).
    1.4. Página de Detalhes do Grupo (Metadados e Membros).
2.  **Visualização de Pesquisadores** (Mês 2)
    2.1. Perfil do Pesquisador (Integração Lattes).
    2.2. Lista de Produções Bibliográficas.
    2.3. Visualização de Rede de Co-autoria.
3.  **Transparência e Fomento** (Mês 3)
    3.1. Dashboard de Editais e Fomentos (FAPES).
    3.2. Visualização de Execução Financeira de Projetos.
    3.3. Gráficos de Distribuição de Bolsas.
4.  **Métricas e Consolidação** (Mês 4)
    4.1. Exibição de Métricas de Impacto (Google Scholar).
    4.2. Otimização SEO e Performance (Lighthouse).
    4.3. Documentação de Usuário e Encerramento.

---

# 2. Cronograma Macro (PM1.3)
| Marco | Descrição | Data Estimada |
|-------|-----------|---------------|
| **Start** | Início do Projeto | 06/01/2026 |
| **R1** | Entrega R1 (Portal de Grupos) | 06/02/2026 |
| **R2** | Entrega R2 (Perfis Lattes) | 06/03/2026 |
| **R3** | Entrega R3 (Dashboards Financeiros) | 06/04/2026 |
| **R4** | Entrega Final (Métricas + SEO) | 06/05/2026 |

**Ritmo de Trabalho**:
- Sprints quinzenais (2 s/mês).
- Checagem de status no dia 1 e 15 de cada mês.

---

# 3. Recursos (PM1.4)
- **Equipe Técnica**: 1 Desenvolvedor Fullstack (User).
- **Stakeholders**: Gestão do Campus, Alunos, Pesquisadores.
- **Tecnologia**: **Astro**, **Tailwind CSS**, **Arquivos JSON**.

---

# 4. Plano de Gerenciamento de Riscos (PM1.7)
| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| Baixa Performance (LCP > 2.5s) | Alto | Otimização de Imagens (WebP), Lazy Loading e SSG. |
| Inconsistência Design System | Médio | Uso estrito de variaveis CSS e Componentes reutilizáveis. |
| Acessibilidade Insuficiente | Alto | Testes manuais com leitores de tela e validação WCAG. |
| Dados Incompletos (JSON) | Médio | Fallbacks de UI (Skeleton Loaders/Empty States) elegantes. |

---

# 5. Critérios de Aceite (PM1.8)
- **Performance**: Pontuação Lighthouse > 90 em Performance, SEO e Acessibilidade.
- **Responsividade**: Layout funcional em Mobile (320px+), Tablet e Desktop.
- **Acessibilidade**: Navegação via teclado e contraste de cores adequado (WCAG AA).
- **Integração**: Dados refletem com precisão o estado dos arquivos JSON canônicos.
- **Código**: Clean Code, Componentização eficiente e sem erros de lint (`eslint`, `prettier`).
