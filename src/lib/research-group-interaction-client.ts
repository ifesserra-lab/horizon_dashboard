import { normalizeSearchText } from "./search";
import type {
    ResearchGroupInteractionClassificationKey,
    ResearchGroupInteractionEdge,
    ResearchGroupInteractionMode,
    ResearchGroupInteractionNode,
    ResearchGroupInteractionRelationType,
    ResearchGroupInteractionViewModel,
} from "../types/groups";

interface InitializeResearchGroupInteractionGraphOptions {
    root: HTMLElement;
    graphData: ResearchGroupInteractionViewModel;
}

interface Point {
    x: number;
    y: number;
}

const RELATION_TYPE_ORDER: ResearchGroupInteractionRelationType[] = [
    "project",
    "article",
    "orientation",
    "initiative",
    "advisorship",
    "research_group",
];

const CLASSIFICATION_ORDER: ResearchGroupInteractionClassificationKey[] = [
    "student",
    "researcher",
    "outside_ifes",
    "null",
];

const RELATION_TYPE_LABELS: Record<
    ResearchGroupInteractionRelationType,
    string
> = {
    project: "Projeto",
    article: "Artigo",
    orientation: "Orientação",
    initiative: "Iniciativa",
    advisorship: "Orientação",
    research_group: "Grupo de pesquisa",
};

const CLASSIFICATION_LABELS: Record<
    ResearchGroupInteractionClassificationKey,
    string
> = {
    student: "Estudante",
    researcher: "Pesquisador",
    outside_ifes: "Externo ao Ifes",
    null: "Sem classificação",
};

const CLASSIFICATION_COLORS: Record<
    ResearchGroupInteractionClassificationKey,
    string
> = {
    student: "#8b5cf6",
    researcher: "#38bdf8",
    outside_ifes: "#f59e0b",
    null: "#94a3b8",
};

const MIN_SCALE = 0.25;
const MAX_SCALE = 3;
const EDGE_LABEL_DENSE_LIMIT = 40;
const NODE_LABEL_MAX_LENGTH = 26;
const EDGE_LABEL_MAX_LENGTH = 32;

const clamp = (value: number, min: number, max: number) =>
    Math.min(max, Math.max(min, value));

const escapeHtml = (value: string) =>
    value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

const hexToRgba = (hex: string, alpha: number) => {
    const normalized = hex.replace("#", "");
    const intValue = Number.parseInt(normalized, 16);
    const r = (intValue >> 16) & 255;
    const g = (intValue >> 8) & 255;
    const b = intValue & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const truncateLabel = (value: string, maxLength: number) =>
    value.length > maxLength ? `${value.slice(0, maxLength - 1)}…` : value;

const drawRoundedRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
) => {
    const safeRadius = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + safeRadius, y);
    ctx.lineTo(x + width - safeRadius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + safeRadius);
    ctx.lineTo(x + width, y + height - safeRadius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - safeRadius, y + height);
    ctx.lineTo(x + safeRadius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - safeRadius);
    ctx.lineTo(x, y + safeRadius);
    ctx.quadraticCurveTo(x, y, x + safeRadius, y);
    ctx.closePath();
};

const sortNodes = (
    left: ResearchGroupInteractionNode,
    right: ResearchGroupInteractionNode,
) =>
    right.weightedDegree - left.weightedDegree ||
    left.name.localeCompare(right.name, "pt-BR");

const getRelationColor = (edge: ResearchGroupInteractionEdge) => {
    if (edge.relationTypes.length > 1) {
        return "#7c3aed";
    }

    if (edge.relationTypes.includes("project")) {
        return "#0f766e";
    }

    if (edge.relationTypes.includes("article")) {
        return "#2563eb";
    }

    if (
        edge.relationTypes.includes("orientation") ||
        edge.relationTypes.includes("advisorship")
    ) {
        return "#d97706";
    }

    if (
        edge.relationTypes.includes("initiative") &&
        edge.relationTypes.includes("advisorship")
    ) {
        return "#7c3aed";
    }

    if (edge.relationTypes.includes("initiative")) {
        return "#059669";
    }

    if (edge.relationTypes.includes("advisorship")) {
        return "#d97706";
    }

    return "#475569";
};

const getEdgeLabel = (edge: ResearchGroupInteractionEdge) =>
    RELATION_TYPE_ORDER.filter((relationType) =>
        edge.relationTypes.includes(relationType),
    )
        .map((relationType) => RELATION_TYPE_LABELS[relationType])
        .join(" + ");

const createConcentricLayout = (nodes: ResearchGroupInteractionNode[]) => {
    const positions = new Map<string, Point>();
    if (nodes.length === 0) return positions;

    const members = nodes.filter((node) => node.isGroupMember).sort(sortNodes);
    const neighbors = nodes.filter((node) => !node.isGroupMember).sort(sortNodes);

    let furthestRadius = 0;

    const placeBucket = (
        bucket: ResearchGroupInteractionNode[],
        startRadius: number,
        minSpacing: number,
        ringGap: number,
        allowCenter = false,
    ) => {
        if (bucket.length === 0) return;

        if (allowCenter && bucket.length === 1 && positions.size === 0) {
            positions.set(bucket[0].id, { x: 0, y: 0 });
            return;
        }

        let radius = startRadius;
        let placed = 0;

        while (placed < bucket.length) {
            const circumference = Math.max(2 * Math.PI * radius, minSpacing);
            const capacity = Math.max(6, Math.floor(circumference / minSpacing));
            const count = Math.min(capacity, bucket.length - placed);

            for (let index = 0; index < count; index += 1) {
                const angle = -Math.PI / 2 + (index / count) * Math.PI * 2;
                positions.set(bucket[placed + index].id, {
                    x: Math.cos(angle) * radius,
                    y: Math.sin(angle) * radius,
                });
            }

            placed += count;
            furthestRadius = Math.max(furthestRadius, radius);
            radius += ringGap;
        }
    };

    if (members.length === 1) {
        positions.set(members[0].id, { x: 0, y: 0 });
    } else {
        placeBucket(members, 74, 34, 56);
    }

    const outerStart = furthestRadius === 0 ? 144 : furthestRadius + 92;
    placeBucket(neighbors, outerStart, 30, 44);

    const unplaced = nodes.filter((node) => !positions.has(node.id));
    placeBucket(unplaced, furthestRadius + 104, 30, 44, positions.size === 0);

    return positions;
};

const toggleChipState = (button: HTMLButtonElement, isActive: boolean) => {
    button.classList.toggle("border-premium-accent/25", isActive);
    button.classList.toggle("bg-premium-accent/[0.10]", isActive);
    button.classList.toggle("text-text-main", isActive);
    button.classList.toggle("shadow-[0_0_0_1px_rgba(56,189,248,0.18)]", isActive);
    button.classList.toggle("border-border-main", !isActive);
    button.classList.toggle("bg-white/[0.03]", !isActive);
    button.classList.toggle("text-text-secondary", !isActive);
    button.setAttribute("aria-pressed", String(isActive));
};

export const initializeResearchGroupInteractionGraph = ({
    root,
    graphData,
}: InitializeResearchGroupInteractionGraphOptions) => {
    if (root.dataset.initialized === "true") return;
    root.dataset.initialized = "true";

    const canvas = root.querySelector<HTMLCanvasElement>("[data-graph-canvas]");
    const tooltip = root.querySelector<HTMLElement>("[data-hover-tooltip]");
    const searchInput =
        root.querySelector<HTMLInputElement>("[data-search-input]");
    const searchResetButton = root.querySelector<HTMLButtonElement>(
        "[data-search-reset]",
    );
    const resetFiltersButton = root.querySelector<HTMLButtonElement>(
        "[data-reset-filters]",
    );
    const recenterButton = root.querySelector<HTMLButtonElement>(
        "[data-recenter-graph]",
    );
    const emptyState = root.querySelector<HTMLElement>("[data-canvas-empty]");
    const emptyTitle =
        root.querySelector<HTMLElement>("[data-empty-title]");
    const emptyBody =
        root.querySelector<HTMLElement>("[data-empty-body]");
    const modeButtons = Array.from(
        root.querySelectorAll<HTMLButtonElement>("[data-mode-button]"),
    );
    const relationButtons = Array.from(
        root.querySelectorAll<HTMLButtonElement>("[data-relation-filter]"),
    );
    const classificationButtons = Array.from(
        root.querySelectorAll<HTMLButtonElement>(
            "[data-classification-filter]",
        ),
    );

    const visibleNodeCount = root.querySelector<HTMLElement>(
        "[data-summary-visible-nodes]",
    );
    const visibleEdgeCount = root.querySelector<HTMLElement>(
        "[data-summary-visible-edges]",
    );
    const modeLabel = root.querySelector<HTMLElement>("[data-summary-mode]");
    const relationSummary = root.querySelector<HTMLElement>(
        "[data-summary-relations]",
    );
    const denseIndicator = root.querySelector<HTMLElement>(
        "[data-dense-indicator]",
    );
    const distributionLabels = Object.fromEntries(
        CLASSIFICATION_ORDER.map((classification) => [
            classification,
            root.querySelector<HTMLElement>(
                `[data-classification-count="${classification}"]`,
            ),
        ]),
    ) as Record<ResearchGroupInteractionClassificationKey, HTMLElement | null>;

    const selectionEmpty = root.querySelector<HTMLElement>("[data-selection-empty]");
    const selectionPanel = root.querySelector<HTMLElement>("[data-selection-panel]");
    const selectionName = root.querySelector<HTMLElement>("[data-selection-name]");
    const selectionMeta = root.querySelector<HTMLElement>("[data-selection-meta]");
    const selectionBadges = root.querySelector<HTMLElement>(
        "[data-selection-badges]",
    );
    const selectionCampus = root.querySelector<HTMLElement>(
        "[data-selection-campus]",
    );
    const selectionWeightedDegree = root.querySelector<HTMLElement>(
        "[data-selection-weighted-degree]",
    );
    const selectionConnections = root.querySelector<HTMLElement>(
        "[data-selection-connections]",
    );
    const selectionRelations = root.querySelector<HTMLElement>(
        "[data-selection-relations]",
    );
    const selectionLink =
        root.querySelector<HTMLAnchorElement>("[data-selection-link]");

    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const viewport = {
        width: 0,
        height: 0,
        dpr: window.devicePixelRatio || 1,
    };

    const transform = {
        x: 0,
        y: 0,
        scale: 1,
    };

    let currentMode: ResearchGroupInteractionMode = graphData.defaultMode;
    let activeRelationTypes = new Set<ResearchGroupInteractionRelationType>(
        graphData.modes[currentMode].defaultRelationTypes,
    );
    let activeClassifications = new Set<
        ResearchGroupInteractionClassificationKey
    >(CLASSIFICATION_ORDER);
    let query = "";
    let selectedNodeId: string | null = null;
    let hoveredNodeId: string | null = null;
    let filteredNodes: ResearchGroupInteractionNode[] = [];
    let filteredEdges: ResearchGroupInteractionEdge[] = [];
    let renderableEdges: ResearchGroupInteractionEdge[] = [];
    let positions = new Map<string, Point>();
    let nodeRadiusMap = new Map<string, number>();
    let layoutSignature = "";
    let denseMode = false;

    const dragState = {
        active: false,
        moved: false,
        lastX: 0,
        lastY: 0,
    };

    const getNodeRadius = (nodeId: string) => nodeRadiusMap.get(nodeId) ?? 11;

    const buildNodeRadiusMap = (nodes: ResearchGroupInteractionNode[]) => {
        const radiusMap = new Map<string, number>();
        if (nodes.length === 0) return radiusMap;

        const minWeightedDegree = Math.min(
            ...nodes.map((node) => node.weightedDegree),
        );
        const maxWeightedDegree = Math.max(
            ...nodes.map((node) => node.weightedDegree),
        );

        nodes.forEach((node) => {
            const normalized =
                maxWeightedDegree === minWeightedDegree
                    ? 0.5
                    : (node.weightedDegree - minWeightedDegree) /
                      (maxWeightedDegree - minWeightedDegree);

            const baseRadius = node.isGroupMember ? 11.5 : 8.5;
            radiusMap.set(node.id, baseRadius + normalized * 7);
        });

        return radiusMap;
    };

    const worldToScreen = (point: Point): Point => ({
        x: point.x * transform.scale + transform.x,
        y: point.y * transform.scale + transform.y,
    });

    const screenToWorld = (point: Point): Point => ({
        x: (point.x - transform.x) / transform.scale,
        y: (point.y - transform.y) / transform.scale,
    });

    const getCanvasPoint = (event: PointerEvent | WheelEvent) => {
        const rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };
    };

    const fitView = () => {
        if (filteredNodes.length === 0 || viewport.width === 0 || viewport.height === 0) {
            return;
        }

        let minX = Number.POSITIVE_INFINITY;
        let minY = Number.POSITIVE_INFINITY;
        let maxX = Number.NEGATIVE_INFINITY;
        let maxY = Number.NEGATIVE_INFINITY;

        filteredNodes.forEach((node) => {
            const position = positions.get(node.id);
            if (!position) return;
            const radius = getNodeRadius(node.id) + 18;

            minX = Math.min(minX, position.x - radius);
            minY = Math.min(minY, position.y - radius);
            maxX = Math.max(maxX, position.x + radius);
            maxY = Math.max(maxY, position.y + radius);
        });

        if (!Number.isFinite(minX) || !Number.isFinite(minY)) return;

        const width = Math.max(maxX - minX, 180);
        const height = Math.max(maxY - minY, 180);
        const margin = 20;
        const scale = Math.min(
            (viewport.width - margin) / width,
            (viewport.height - margin) / height,
        );

        transform.scale = clamp(scale * 1.06, MIN_SCALE, MAX_SCALE);
        transform.x = viewport.width / 2 - ((minX + maxX) / 2) * transform.scale;
        transform.y =
            viewport.height / 2 - ((minY + maxY) / 2) * transform.scale;
    };

    const getNodeById = (nodeId: string | null) =>
        nodeId ? filteredNodes.find((node) => node.id === nodeId) ?? null : null;

    const getVisibleNeighborIds = (nodeId: string) => {
        const neighbors = new Set<string>([nodeId]);

        filteredEdges.forEach((edge) => {
            if (edge.source === nodeId || edge.target === nodeId) {
                neighbors.add(edge.source);
                neighbors.add(edge.target);
            }
        });

        return neighbors;
    };

    const updateButtons = () => {
        modeButtons.forEach((button) => {
            toggleChipState(button, button.dataset.mode === currentMode);
        });

        relationButtons.forEach((button) => {
            const relationType =
                button.dataset.relation as ResearchGroupInteractionRelationType;
            toggleChipState(button, activeRelationTypes.has(relationType));
        });

        classificationButtons.forEach((button) => {
            const classification =
                button.dataset.classification as ResearchGroupInteractionClassificationKey;
            toggleChipState(button, activeClassifications.has(classification));
        });

        if (searchResetButton) {
            searchResetButton.classList.toggle("hidden", query.length === 0);
        }
    };

    const updateSummary = () => {
        const classificationCounts = {
            student: 0,
            researcher: 0,
            outside_ifes: 0,
            null: 0,
        } as Record<ResearchGroupInteractionClassificationKey, number>;

        filteredNodes.forEach((node) => {
            classificationCounts[node.classificationKey] += 1;
        });

        if (visibleNodeCount) {
            visibleNodeCount.textContent = String(filteredNodes.length);
        }

        if (visibleEdgeCount) {
            visibleEdgeCount.textContent = String(filteredEdges.length);
        }

        if (modeLabel) {
            modeLabel.textContent =
                currentMode === "members"
                    ? "Somente membros"
                    : "Membros + vizinhos de orientação";
        }

        if (relationSummary) {
            relationSummary.textContent =
                activeRelationTypes.size > 0
                    ? RELATION_TYPE_ORDER.filter((type) =>
                          activeRelationTypes.has(type),
                      )
                          .map((type) => RELATION_TYPE_LABELS[type])
                          .join(" • ")
                    : "Nenhum tipo selecionado";
        }

        CLASSIFICATION_ORDER.forEach((classification) => {
            const target = distributionLabels[classification];
            if (target) {
                target.textContent = String(classificationCounts[classification]);
            }
        });

        if (denseIndicator) {
            if (denseMode) {
                denseIndicator.textContent = selectedNodeId
                    ? "Modo denso ativo: exibindo a ego-network do nó selecionado."
                    : "Modo denso ativo: selecione um nó para revelar as arestas filtradas.";
                denseIndicator.classList.remove("hidden");
            } else {
                denseIndicator.classList.add("hidden");
            }
        }
    };

    const updateSelectionPanel = () => {
        const selectedNode = getNodeById(selectedNodeId);

        if (!selectedNode) {
            selectionEmpty?.classList.remove("hidden");
            selectionPanel?.classList.add("hidden");
            return;
        }

        selectionEmpty?.classList.add("hidden");
        selectionPanel?.classList.remove("hidden");

        const adjacentEdges = filteredEdges.filter(
            (edge) =>
                edge.source === selectedNode.id || edge.target === selectedNode.id,
        );
        const relationTypes = RELATION_TYPE_ORDER.filter((relationType) =>
            adjacentEdges.some((edge) => edge.relationTypes.includes(relationType)),
        );

        if (selectionName) {
            selectionName.textContent = selectedNode.name;
        }

        if (selectionMeta) {
            selectionMeta.textContent = CLASSIFICATION_LABELS[selectedNode.classificationKey];
        }

        if (selectionBadges) {
            const badges: string[] = [];

            if (selectedNode.isGroupMember) {
                badges.push(
                    '<span class="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-sky-700">Membro do grupo</span>',
                );
            }

            if (selectedNode.isAdvisorshipNeighbor && !selectedNode.isGroupMember) {
                badges.push(
                    '<span class="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-amber-700">Vizinho via orientação</span>',
                );
            }

            if (selectedNode.wasStudent) {
                badges.push(
                    '<span class="inline-flex items-center rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-violet-700">Já foi estudante</span>',
                );
            }

            if (selectedNode.wasStaff) {
                badges.push(
                    '<span class="inline-flex items-center rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-cyan-700">Atuação staff</span>',
                );
            }

            selectionBadges.innerHTML = badges.join("");
        }

        if (selectionCampus) {
            selectionCampus.textContent = selectedNode.campusName || "Não informado";
        }

        if (selectionWeightedDegree) {
            selectionWeightedDegree.textContent = String(
                selectedNode.weightedDegree,
            );
        }

        if (selectionConnections) {
            selectionConnections.textContent = String(adjacentEdges.length);
        }

        if (selectionRelations) {
            selectionRelations.textContent =
                relationTypes.length > 0
                    ? relationTypes
                          .map((relationType) => RELATION_TYPE_LABELS[relationType])
                          .join(", ")
                    : "Sem relações visíveis";
        }

        if (selectionLink) {
            if (selectedNode.profileHref) {
                selectionLink.href = selectedNode.profileHref;
                selectionLink.classList.remove("hidden");
            } else {
                selectionLink.classList.add("hidden");
            }
        }
    };

    const updateEmptyState = () => {
        if (!emptyState || !emptyTitle || !emptyBody) return;

        let empty = false;
        let title = "";
        let body = "";

        if (filteredNodes.length === 0) {
            empty = true;
            title = "Nenhuma pessoa encontrada";
            body =
                "Ajuste a busca ou reative classificações para voltar a enxergar o grafo.";
        } else if (filteredNodes.length === 1) {
            empty = true;
            title = "Interação insuficiente";
            body =
                "O filtro atual deixou apenas uma pessoa visível. Amplie o recorte para ver conexões.";
        } else if (activeRelationTypes.size === 0) {
            empty = true;
            title = "Selecione um tipo de relação";
            body =
                "Ative pelo menos uma relação para desenhar as conexões entre os participantes.";
        } else if (!denseMode && filteredEdges.length === 0) {
            empty = true;
            title = "Sem arestas neste recorte";
            body =
                "Os filtros atuais mantiveram pessoas visíveis, mas sem relações compartilhadas.";
        }

        emptyState.classList.toggle("hidden", !empty);
        emptyState.classList.toggle("flex", empty);
        if (empty) {
            emptyTitle.textContent = title;
            emptyBody.textContent = body;
        }
    };

    const drawTooltip = () => {
        if (!tooltip) return;

        const hoveredNode = getNodeById(hoveredNodeId);
        if (!hoveredNode) {
            tooltip.classList.add("hidden");
            return;
        }

        const position = positions.get(hoveredNode.id);
        if (!position) {
            tooltip.classList.add("hidden");
            return;
        }

        const screenPoint = worldToScreen(position);
        tooltip.classList.remove("hidden");
        tooltip.style.left = `${screenPoint.x + 14}px`;
        tooltip.style.top = `${screenPoint.y - 12}px`;
        tooltip.innerHTML = `
            <div class="font-bold text-text-main">${escapeHtml(hoveredNode.name)}</div>
            <div class="text-[10px] uppercase tracking-[0.14em] text-text-secondary">${escapeHtml(
                CLASSIFICATION_LABELS[hoveredNode.classificationKey],
            )}</div>
        `;
    };

    const draw = () => {
        context.setTransform(viewport.dpr, 0, 0, viewport.dpr, 0, 0);
        context.clearRect(0, 0, viewport.width, viewport.height);

        const backgroundGradient = context.createLinearGradient(0, 0, 0, viewport.height);
        backgroundGradient.addColorStop(0, "rgba(255, 255, 255, 1)");
        backgroundGradient.addColorStop(0.55, "rgba(248, 250, 252, 0.995)");
        backgroundGradient.addColorStop(1, "rgba(255, 255, 255, 1)");
        context.fillStyle = backgroundGradient;
        context.fillRect(0, 0, viewport.width, viewport.height);

        const accentGlow = context.createRadialGradient(
            viewport.width * 0.22,
            viewport.height * 0.18,
            24,
            viewport.width * 0.22,
            viewport.height * 0.18,
            viewport.width * 0.56,
        );
        accentGlow.addColorStop(0, "rgba(125, 211, 252, 0.12)");
        accentGlow.addColorStop(0.5, "rgba(191, 219, 254, 0.07)");
        accentGlow.addColorStop(1, "rgba(255, 255, 255, 0)");
        context.fillStyle = accentGlow;
        context.fillRect(0, 0, viewport.width, viewport.height);

        context.save();
        context.translate(transform.x, transform.y);
        context.scale(transform.scale, transform.scale);

        const selectedNeighbors = selectedNodeId
            ? getVisibleNeighborIds(selectedNodeId)
            : new Set<string>();

        renderableEdges.forEach((edge) => {
            const sourcePosition = positions.get(edge.source);
            const targetPosition = positions.get(edge.target);
            if (!sourcePosition || !targetPosition) return;

            const touchesSelection =
                selectedNodeId != null &&
                (edge.source === selectedNodeId || edge.target === selectedNodeId);
            const lineAlpha = selectedNodeId
                ? touchesSelection
                    ? 0.92
                    : 0.15
                : Math.min(0.82, 0.22 + edge.weight * 0.07);

            context.beginPath();
            context.moveTo(sourcePosition.x, sourcePosition.y);
            context.lineTo(targetPosition.x, targetPosition.y);
            context.lineWidth = 0.9 + Math.min(edge.weight, 6) * 0.35;
            context.strokeStyle = hexToRgba(getRelationColor(edge), lineAlpha);
            context.stroke();
        });

        const nodeDrawOrder = [...filteredNodes].sort((left, right) => {
            if (left.id === selectedNodeId) return 1;
            if (right.id === selectedNodeId) return -1;
            if (left.id === hoveredNodeId) return 1;
            if (right.id === hoveredNodeId) return -1;
            return 0;
        });

        nodeDrawOrder.forEach((node) => {
            const position = positions.get(node.id);
            if (!position) return;

            const radius = getNodeRadius(node.id);
            const isSelected = node.id === selectedNodeId;
            const isHovered = node.id === hoveredNodeId;
            const isHighlighted =
                selectedNeighbors.size === 0 || selectedNeighbors.has(node.id);
            const opacity = selectedNodeId && !isHighlighted ? 0.18 : 1;

            if (isSelected || isHovered) {
                context.beginPath();
                context.arc(position.x, position.y, radius + 6, 0, Math.PI * 2);
                context.fillStyle = isSelected
                    ? "rgba(59,130,246,0.18)"
                    : "rgba(125,211,252,0.16)";
                context.fill();
            }

            if (node.isAdvisorshipNeighbor && !node.isGroupMember) {
                context.beginPath();
                context.arc(position.x, position.y, radius + 3, 0, Math.PI * 2);
                context.strokeStyle = hexToRgba("#f59e0b", opacity);
                context.lineWidth = 1.8;
                context.stroke();
            }

            context.beginPath();
            context.arc(position.x, position.y, radius, 0, Math.PI * 2);
            context.fillStyle = hexToRgba(
                CLASSIFICATION_COLORS[node.classificationKey],
                opacity,
            );
            context.fill();

            context.beginPath();
            context.arc(position.x, position.y, radius, 0, Math.PI * 2);
            context.strokeStyle = node.isGroupMember
                ? hexToRgba("#2563eb", opacity)
                : hexToRgba("#94a3b8", opacity);
            context.lineWidth = node.isGroupMember ? 2.1 : 1.2;
            context.stroke();
        });

        context.restore();

        const shouldDrawAllEdgeLabels = renderableEdges.length <= EDGE_LABEL_DENSE_LIMIT;
        const edgeLabelsToDraw = renderableEdges.filter((edge) => {
            if (shouldDrawAllEdgeLabels) return true;
            if (!selectedNodeId) return false;
            return edge.source === selectedNodeId || edge.target === selectedNodeId;
        });

        if (edgeLabelsToDraw.length > 0) {
            const fontSize =
                edgeLabelsToDraw.length > 24 || filteredNodes.length > 48 ? 10 : 11;
            context.font = `600 ${fontSize}px Outfit, ui-sans-serif, system-ui, sans-serif`;
            context.textAlign = "center";
            context.textBaseline = "middle";

            edgeLabelsToDraw.forEach((edge) => {
                const sourcePosition = positions.get(edge.source);
                const targetPosition = positions.get(edge.target);
                if (!sourcePosition || !targetPosition) return;

                const label = truncateLabel(getEdgeLabel(edge), EDGE_LABEL_MAX_LENGTH);
                const sourceScreenPoint = worldToScreen(sourcePosition);
                const targetScreenPoint = worldToScreen(targetPosition);
                const centerX = (sourceScreenPoint.x + targetScreenPoint.x) / 2;
                const centerY = (sourceScreenPoint.y + targetScreenPoint.y) / 2;
                const touchesSelection =
                    selectedNodeId != null &&
                    (edge.source === selectedNodeId || edge.target === selectedNodeId);
                const opacity = selectedNodeId ? (touchesSelection ? 0.96 : 0.26) : 0.88;
                const textMetrics = context.measureText(label);
                const boxWidth = textMetrics.width + 12;
                const boxHeight = fontSize + 8;

                drawRoundedRect(
                    context,
                    centerX - boxWidth / 2,
                    centerY - boxHeight / 2,
                    boxWidth,
                    boxHeight,
                    9,
                );
                context.fillStyle = hexToRgba("#ffffff", opacity);
                context.fill();
                context.strokeStyle = hexToRgba(getRelationColor(edge), opacity);
                context.lineWidth = 1;
                context.stroke();
                context.fillStyle = hexToRgba(getRelationColor(edge), opacity);
                context.fillText(label, centerX, centerY + 0.5);
            });
        }

        if (filteredNodes.length > 0) {
            const fontSize = filteredNodes.length > 70 ? 10 : 11;
            context.font = `600 ${fontSize}px Outfit, ui-sans-serif, system-ui, sans-serif`;
            context.textAlign = "center";
            context.textBaseline = "middle";

            filteredNodes.forEach((node) => {
                const position = positions.get(node.id);
                if (!position) return;

                const screenPoint = worldToScreen(position);
                const screenRadius = getNodeRadius(node.id) * transform.scale;
                const isSelected = node.id === selectedNodeId;
                const isHovered = node.id === hoveredNodeId;
                const isHighlighted =
                    selectedNodeId == null ||
                    node.id === selectedNodeId ||
                    selectedNeighbors.has(node.id);
                const opacity = selectedNodeId && !isHighlighted ? 0.32 : 0.96;
                const label = truncateLabel(node.name, NODE_LABEL_MAX_LENGTH);
                const textMetrics = context.measureText(label);
                const boxWidth = textMetrics.width + 12;
                const boxHeight = fontSize + 8;
                const labelY = screenPoint.y + screenRadius + boxHeight / 2 + 8;

                drawRoundedRect(
                    context,
                    screenPoint.x - boxWidth / 2,
                    labelY - boxHeight / 2,
                    boxWidth,
                    boxHeight,
                    9,
                );
                context.fillStyle = isSelected || isHovered
                    ? hexToRgba("#eff6ff", opacity)
                    : hexToRgba("#ffffff", opacity);
                context.fill();
                context.strokeStyle = isSelected || isHovered
                    ? hexToRgba("#60a5fa", opacity)
                    : hexToRgba("#cbd5e1", opacity);
                context.lineWidth = isSelected || isHovered ? 1.2 : 1;
                context.stroke();
                context.fillStyle = hexToRgba("#0f172a", opacity);
                context.fillText(label, screenPoint.x, labelY + 0.5);
            });
        }

        drawTooltip();
    };

    const applyFilters = ({ refit = true }: { refit?: boolean } = {}) => {
        const scopedNodeIds = new Set(graphData.modes[currentMode].nodeIds);
        filteredNodes = graphData.nodes.filter(
            (node) =>
                scopedNodeIds.has(node.id) &&
                activeClassifications.has(node.classificationKey) &&
                (!query || node.searchText.includes(query)),
        );

        const visibleNodeIds = new Set(filteredNodes.map((node) => node.id));
        filteredEdges = graphData.edges.filter(
            (edge) =>
                visibleNodeIds.has(edge.source) &&
                visibleNodeIds.has(edge.target) &&
                edge.relationTypes.some((relationType) =>
                    activeRelationTypes.has(relationType),
                ),
        );

        denseMode = filteredEdges.length > graphData.denseEdgeThreshold;

        if (
            selectedNodeId &&
            !filteredNodes.some((node) => node.id === selectedNodeId)
        ) {
            selectedNodeId = null;
        }

        if (hoveredNodeId && !filteredNodes.some((node) => node.id === hoveredNodeId)) {
            hoveredNodeId = null;
        }

        if (denseMode) {
            if (selectedNodeId) {
                renderableEdges = filteredEdges.filter(
                    (edge) =>
                        edge.source === selectedNodeId ||
                        edge.target === selectedNodeId,
                );
            } else {
                renderableEdges = [];
            }
        } else {
            renderableEdges = filteredEdges;
        }

        const nextLayoutSignature = filteredNodes.map((node) => node.id).join("|");
        if (nextLayoutSignature !== layoutSignature) {
            layoutSignature = nextLayoutSignature;
            positions = createConcentricLayout(filteredNodes);
            nodeRadiusMap = buildNodeRadiusMap(filteredNodes);
            if (refit) {
                fitView();
            }
        } else if (refit) {
            nodeRadiusMap = buildNodeRadiusMap(filteredNodes);
            fitView();
        }

        updateButtons();
        updateSummary();
        updateSelectionPanel();
        updateEmptyState();
        draw();
    };

    const findNodeAtPoint = (point: Point) => {
        const worldPoint = screenToWorld(point);

        for (let index = filteredNodes.length - 1; index >= 0; index -= 1) {
            const node = filteredNodes[index];
            const position = positions.get(node.id);
            if (!position) continue;

            const radius = getNodeRadius(node.id) + 3 / transform.scale;
            const deltaX = worldPoint.x - position.x;
            const deltaY = worldPoint.y - position.y;

            if (deltaX * deltaX + deltaY * deltaY <= radius * radius) {
                return node;
            }
        }

        return null;
    };

    const resizeCanvas = () => {
        const rect = canvas.getBoundingClientRect();
        viewport.width = rect.width;
        viewport.height = rect.height;
        viewport.dpr = window.devicePixelRatio || 1;
        canvas.width = Math.round(rect.width * viewport.dpr);
        canvas.height = Math.round(rect.height * viewport.dpr);
        applyFilters({ refit: true });
    };

    modeButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const nextMode =
                (button.dataset.mode as ResearchGroupInteractionMode) ??
                graphData.defaultMode;
            currentMode = nextMode;
            activeRelationTypes = new Set(
                graphData.modes[currentMode].defaultRelationTypes,
            );
            selectedNodeId = null;
            hoveredNodeId = null;
            applyFilters({ refit: true });
        });
    });

    relationButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const relationType =
                button.dataset.relation as ResearchGroupInteractionRelationType;
            if (!relationType) return;

            if (activeRelationTypes.has(relationType)) {
                activeRelationTypes.delete(relationType);
            } else {
                activeRelationTypes.add(relationType);
            }

            applyFilters({ refit: false });
        });
    });

    classificationButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const classification =
                button.dataset.classification as ResearchGroupInteractionClassificationKey;
            if (!classification) return;

            if (activeClassifications.has(classification)) {
                activeClassifications.delete(classification);
            } else {
                activeClassifications.add(classification);
            }

            applyFilters({ refit: false });
        });
    });

    searchInput?.addEventListener("input", () => {
        query = normalizeSearchText(searchInput.value);
        applyFilters({ refit: true });
    });

    searchResetButton?.addEventListener("click", () => {
        if (searchInput) {
            searchInput.value = "";
        }
        query = "";
        applyFilters({ refit: true });
        searchInput?.focus();
    });

    resetFiltersButton?.addEventListener("click", () => {
        currentMode = graphData.defaultMode;
        activeRelationTypes = new Set(graphData.modes[currentMode].defaultRelationTypes);
        activeClassifications = new Set(CLASSIFICATION_ORDER);
        selectedNodeId = null;
        hoveredNodeId = null;
        query = "";
        if (searchInput) {
            searchInput.value = "";
        }
        applyFilters({ refit: true });
    });

    recenterButton?.addEventListener("click", () => {
        fitView();
        draw();
    });

    canvas.addEventListener("wheel", (event) => {
        event.preventDefault();

        const pointer = getCanvasPoint(event);
        const worldPointer = screenToWorld(pointer);
        const zoomFactor = event.deltaY < 0 ? 1.08 : 0.92;
        const nextScale = clamp(transform.scale * zoomFactor, MIN_SCALE, MAX_SCALE);

        transform.scale = nextScale;
        transform.x = pointer.x - worldPointer.x * transform.scale;
        transform.y = pointer.y - worldPointer.y * transform.scale;
        draw();
    });

    canvas.addEventListener("pointerdown", (event) => {
        dragState.active = true;
        dragState.moved = false;
        dragState.lastX = event.clientX;
        dragState.lastY = event.clientY;
        canvas.setPointerCapture(event.pointerId);
    });

    canvas.addEventListener("pointermove", (event) => {
        if (dragState.active) {
            const deltaX = event.clientX - dragState.lastX;
            const deltaY = event.clientY - dragState.lastY;
            if (Math.abs(deltaX) > 1 || Math.abs(deltaY) > 1) {
                dragState.moved = true;
            }

            transform.x += deltaX;
            transform.y += deltaY;
            dragState.lastX = event.clientX;
            dragState.lastY = event.clientY;

            draw();
            return;
        }

        const hoveredNode = findNodeAtPoint(getCanvasPoint(event));
        const nextHoveredNodeId = hoveredNode?.id ?? null;
        if (nextHoveredNodeId !== hoveredNodeId) {
            hoveredNodeId = nextHoveredNodeId;
            draw();
        }
    });

    canvas.addEventListener("pointerup", (event) => {
        const pointer = getCanvasPoint(event);

        if (!dragState.moved) {
            const clickedNode = findNodeAtPoint(pointer);
            selectedNodeId =
                clickedNode?.id === selectedNodeId ? null : clickedNode?.id ?? null;
            applyFilters({ refit: false });
        }

        dragState.active = false;
        dragState.moved = false;
        canvas.releasePointerCapture(event.pointerId);
    });

    canvas.addEventListener("pointerleave", () => {
        if (!dragState.active) {
            hoveredNodeId = null;
            draw();
        }
    });

    const resizeObserver = new ResizeObserver(() => {
        resizeCanvas();
    });

    resizeObserver.observe(canvas);
    resizeCanvas();
};
