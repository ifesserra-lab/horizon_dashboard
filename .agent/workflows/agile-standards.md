---
description: Enforce Agile & Project Management Standards for tasks
---

Follow this workflow ensuring all work adheres to "The Band Project" standards.

## 1. Project Governance (Senior PM Oversight)
This section enforces the **mandatory** maintenance of the Project Management (PM) documentation layer located in `docs/1 - projeto/`.
> [!IMPORTANT]
> **MANDATORY AND NON-NEGOTIABLE**: The following documents MUST be fully populated and approved by the Product Owner/Stakeholder **BEFORE** any development begins.

- **PM1.0 SOW (`PM1.0-sow.md`)**: Scope baseline and Statement of Work.
- **PM1.1 Mission (`PM1.1-mission_statement.md`)**: Strategic alignment.
- **PM1.2-1.8 Project Plan (`PM1.2-1.8-project_plan.md`)**: Master plan including WBS, Schedule, Resources, Communication, Risk, and Acceptance Criteria.
- **PM1.3 Release Plan (`PM1.3-release_plan.md`)**: High-level roadmap defining Releases.

**Ongoing Maintenance:**
- **PM1.9 Status Reports (`PM1.9-status_report_X.md`)**: Bi-weekly progress tracking mandatory for every sprint/iteration.
- **PM1.10 Closure (`PM1.10-Project_closure_report.md`)**: End-of-project formalities.

## 2. System Identification (Senior Analyst/Designer)
This section enforces the **mandatory** analysis phase before implementation, located in `docs/2 - implementacao/`.
> [!IMPORTANT]
> **MANDATORY AND NON-NEGOTIABLE**: The following documents MUST be fully populated and approved **BEFORE** any implementation.

- **SI.1 Requirements (`SI1-2 - identification/SI1-Requisitos.md`)**: Functional and Non-functional requirements, Stakeholders.
- **SI.2 Analysis (`SI1-2 - identification/SI2-Analise.md`)**: Domain understanding, User Flows, BPMN, Conceptual Model.
- **SI.3 Product Backlog (`SI3 - initiation/SI.3-product_backlog_initiation.md`)**: User Stories, Prioritization, Acceptance Criteria.
- **SI.3 Design (`SI3 - inception/diagramas/SI.3-design.md`)**: Software Architecture, Component Diagram, Data Model (Schema), API Contracts, **Data Visualization Mapping**, and **UX Wireframes**.

**Agent Responsibility (Multidisciplinary Interview):**
- **Senior Analyst**: The Agent **MUST** act as a **Senior Analyst**, questioning the User to gather necessary data and populate missing/incomplete documents.
- **Senior Data Analyst**: The Agent **MUST** behave as an expert analyst, validating the source data (`groups.json`, APIs), defining academic KPIs (h-index, citation counts, outreach impact), and ensuring data integrity across different dimensions (Research, Extension, Postgrad).
- **Senior UX Designer**: The Agent **MUST** act as a Senior UX Designer, ensuring high-end aesthetics, accessibility (WCAG), and tailored information hierarchy for local personas:
    *   **Students**: Navigation for group discovery.
    *   **Professors**: Data entry/validation and peer visibility.
    *   **Managers**: Macro-level monitoring and KPI dashboards.
    *   **Companies**: High-level impact and partnership opportunities.
- **NO Implementation** is allowed until these artifacts are populated.

## 3. Branching Strategy (GitFlow)
- **main**: Stable production branch. Restricted.
- **developing**: Integration branch for new work. Branched from `main`.
- **features**: Feature/Bugfix branches. Fork/Branch from `developing`.
    - Format: `feat/<name>`, `bugfix/issue-<id>`, `fix/<name>`.

## 4. Iteration Cadence & Reporting
- **Frequency**: 2 weeks.
- **Cadence**: 2 interactions per month.
    - **First Interaction**: Starts on the 1st day of the month.
    - **Second Interaction**: Starts on the 15th day of the month (Mean).
- **Status Reporting (MANDATORY)**:
    - **Trigger 1**: A new Status Report (`docs/1 - projeto/PM1.9-status_report_X.md`) MUST be generated at the start/end of each interaction.
    - **Trigger 2**: The Status Report MUST be updated **IMMEDIATELY** after a release is delivered, incorporating GitHub data (issues closed, PRs merged, exact version released).

## 5. Definition of Ready (DoR) Check
Before moving a task to "In Progress":
- [ ] **Project Initiation Check**:
    - [ ] Confirm `PM1.0`, `PM1.1`, `PM1.2-1.8`, and `PM1.3` in `docs/1 - projeto/` are fully populated and approved.
- [ ] **SI Artifacts Check**:
    - [ ] Confirm `SI.1`, `SI.2`, `SI.3 Backlog` and **`SI.3 Design`** in `docs/2 - implementacao/` are fully populated and approved.
- [ ] **Documentation First**:
    - [ ] Update `docs/*.md` (e.g., `requirements.md`, `sdd.md`) before creating the issue.
    - [ ] **Reference**: Description MUST link to docs (e.g., "Implement Req 1.1 as detailed in `SI1-Requisitos.md`").
- [ ] **Design Assessment (Mandatory)**:
    - [ ] **Data Integrity Check**: The **Data Analyst** MUST verify if the proposed data structures support the required KPIs and visualization goals.
    - [ ] **Persona Alignment**: The **UX Designer** MUST confirm if the UI targets the specific needs of the stakeholders (Managers vs. Researchers).
    - [ ] **Accessibility Check**: Confirm strict adherence to **WCAG 2.1 AA** standards (contrast, semantic HTML, keyboard nav). **MANDATORY AND NON-NEGOTIABLE**.
    - [ ] **Question the User**: The Designer/Analyst MUST question the user about architectural or visualization decisions if `SI.3 Design` is ambiguous.
    - [ ] **Mobile First Check**: The **UX Designer** MUST confirm if the UI follows "Mobile First" principles, starting the design from the smallest screen size and progressively enhancing for larger ones.
- [ ] **Structure Check**: Confirm implementation matches `src` folder structure defined in `SI.3 Design`.
- [ ] **Hierarchy Check**: Confirm strict hierarchy: `Epic -> User Story -> Task`.
- [ ] **Alignment Check**: ensure the Issue/User Story is aligned with **PM1.3 Release Plan**, **PM1.2 Scope** and **SI.1 Requirements**.
- [ ] **Milestone Mapping**: The Issue MUST be assigned to a GitHub Milestone that corresponds directly to a Release defined in `PM1.3 Release Plan`.
- [ ] **Governance**: Ensure work is associated with "The Band Project" ecosystem.
- [ ] **readiness**:
    - [ ] Clear Objective defined?
    - [ ] Acceptance Criteria defined?
    - [ ] Technical Plan ready?
- [ ] **GitHub Issue**:
    - [ ] **Draft**: Provide technical proposal/text to the user.
    - [ ] **Approval**: Mandatory user approval before proceeding.
    - [ ] **Create**: Create the issue on GitHub ONLY after approval.
        - [ ] **Fields Requirement (MANDATORY AND NON-NEGOTIABLE)**:
            - [ ] **Label**: Must be set (epic, us, task).
            - [ ] **Type**: Must be set (feature, bug, task).
            - [ ] **Milestone**: Must be set.
            - [ ] **Project**: Must be set to "The Band Project".
            - [ ] **Assignee**: Must be set to the logged-in user.
    - [ ] **Start**: Begin programming ONLY after issue creation. **MANDATORY AND NON-NEGOTIABLE**.

## 6. Artifact Maintenance
Maintain the following artifacts throughout the lifecycle:
- [ ] `docs/1 - projeto/*.md`: **MANDATORY**. Keep PM documents updated as described in Section 1.
- [ ] `docs/2 - implementacao/**/*.md`: **MANDATORY**. Keep SI documents (`SI.1`, `SI.2`, `SI.3 Backlog`, `SI.3 Design`) updated as described in Section 2.
- [ ] `task.md`: For detailed task tracking.
- [ ] `implementation_plan.md`: For technical planning and review.
    - [ ] **Test Plan**: MUST list all test cases based on requirements. **MANDATORY AND NON-NEGOTIABLE**.
- [ ] `docs/backlog.md`: Must include **Releases** section with:
    - PR Number & Link
    - Description
    - Commit SHA & Link
- [ ] **Synchronization (MANDATORY)**:
    - [ ] **Trigger**: Any update to `docs/2 - implementacao/SI3 - initiation/SI.3-product_backlog_initiation.md`.
    - [ ] **Action**: You MUST immediately update:
        - [ ] `task.md` (Operational tasks).
        - [ ] `docs/backlog.md` (Release status).
        - [ ] `PM1.3 Release Plan` (only if Milestones/Dates change).


## 7. Implementation Standards
- [ ] **TDD**: Implement the test cases defined in the plan BEFORE the implementation code. **MANDATORY AND NON-NEGOTIABLE**.
- [ ] **Style**: Code must pass `black`, `flake8`, `isort`.
- [ ] **Business Logic**: All business rules requirements must be satisfied and verified.
- [ ] **Observability**: **MANDATORY**. All critical actions and state changes MUST be logged (Info/Error) with context.
- [ ] **Design Patterns**: Apply the **Strategy Pattern** when multiple algorithms or behaviors are required for a specific task to ensure extensibility and reduce code duplication.
- [ ] **Mobile First**: All UI components and layouts MUST be designed and implemented starting from the smallest screen size (Mobile) and progressively enhanced for larger screens using `min-width` media queries. Ad-hoc desktop-first styles (using `max-width`) are discouraged.
- [ ] **WCAG Compliance**: All UI components MUST be strictly compliant with **WCAG 2.1 Level AA** standards. This includes semantic HTML, keyboard navigation, and color contrast. **MANDATORY AND NON-NEGOTIABLE**.

## 8. Pull Request Standards
- [ ] **Process**:
    - [ ] Create PR from feature branch targeting `developing`.
    - [ ] **Template**: Use `.github/pull_request_template.md`.
- [ ] **Content Requirements**:
    - [ ] **Related Issues**: List linked issues (e.g., `Closes #1`).
    - [ ] **Modifications**: Detailed list of technical changes.
    - [ ] **How to Test**: Clear steps for verification.


## 9. Release Strategy (Automated CD)
- [ ] **Promotion**: `developing` -> `main`.
- [ ] **Trigger**: All tests passed on `developing`.
- [ ] **Milestone Association**: Every Release defined in `PM1.3` MUST have a corresponding GitHub Milestone.
- [ ] **Process**:
    - [ ] Open Pull Request from `developing` to `main`.
    - [ ] Title Format: `release: <description>`.
    - [ ] No direct commits to `main` allowed.
    - [ ] **Versioning (Tag-Triggered Deployment)**:
        - [ ] **MUST** create a new version (git tag) matches the release.
        - [ ] **DO NOT** run build/publish commands locally.
        - [ ] **Action**: Push the tag `vX.Y.Z` to `origin`.
        - [ ] **Automation**: The CI/CD Pipeline (`.github/workflows/deploy.yml`) MUST detect the tag and trigger production deployment.
    - [ ] **Post-Release**:
        - [ ] Verify functionality in Production environment.
        - [ ] Update `PM1.9 Status Report`.

## 10. Merge Standards (Strict CI)
- [ ] **Calculated Risk**: PR can be merged ONLY if:
    - [ ] **CI Pipeline (GitHub Actions)** is GREEN (All tests passed).
    - [ ] **Code Coverage** meets the defined threshold (e.g., 80%).
    - [ ] **No Conflicts** with the base branch.
- [ ] **Automation**: Enable "Auto-merge" if available, allowing the platform to merge once checks pass.
- [ ] **Cleanup**: 
    - [ ] **Remote**: Delete the feature/bugfix branch from GitHub immediately.
    - [ ] **Local**: Delete `git branch -d feature/...` to maintain hygiene.

## 11. Definition of Done (DoD)
- [ ] **Verification**:
    - [ ] **Pipeline Success**: CI/CD pipeline passed on the PR.
    - [ ] Test suite passing locally.
    - [ ] Linting checks passing.
- [ ] **Documentation**:
    - [ ] Update Google-style docstrings.
    - [ ] Update relevant `docs/*.md` files.
    - [ ] **PM Updates**: Check if `PM1.3 Release Plan` or `PM1.9 Status Report` needs updates.
    - [ ] Update/Create `walkthrough.md`.
- [ ] **Closure**:
    - [ ] Close related GitHub Issues.
    - [ ] Update hierarchical status in `docs/backlog.md`.
    - [ ] **Cleanup**: Confirm that all related feature/fix/bug branches (remote and local) have been deleted.
    - [ ] **Versioning**: Tag the release and update `latest` tag (see Section 7) after Feature/Fix/Bug closure.

## 12. Tooling Standards (Platform Engineering)
- [ ] **GitHub Interaction**:
    - [ ] **MUST USE** GitHub MCP Tools (`github-mcp-server`) for:
        - Creating/Merging Pull Requests.
        - Creating/Updating Issues.
        - Managing Branches (Remote).
        - Releases.
    - [ ] **AVOID** `git` CLI commands where MCP alternatives exist.
    - [ ] **GitHub CLI (`gh`) Usage**:
        - [ ] **Initial Setup (MANDATORY)**: Check/Create labels (`epic`, `us`, `task`).
        - [ ] **Release Milestones**: Use `gh` or `gh api` to create milestones defined in `PM1.3`.
    - [ ] **Legacy Git**: Use `git` CLI only for local workspace synchronization.
- [ ] **CI/CD Configuration**:
    - [ ] **Workflows**: Maintain `.github/workflows/*.yml` as Code.
    - [ ] **Secrets**: NEVER commit secrets. Use GitHub Secrets.
    - [ ] **Runners**: Use standard Ubuntu runners unless specific hardware is required.

## 13. Pipeline Governance (Platform Engineering)
> [!IMPORTANT]
> **Pipeline as Code**: All build, test, and deploy logic MUST be defined in YAML. No manual steps in the console.

- [ ] **Immutability**:
    - Build once, deploy many. The artifact generated in `developing` must be the EXACT same one pushed to `production`.
- [ ] **Fast Feedback**:
    - CI pipelines must complete < 5 minutes to ensure developer velocity.
- [ ] **Security**:
    - Dependency Scanning (e.g., Dependabot) must be enabled.
    - No hardcoded credentials in code.
