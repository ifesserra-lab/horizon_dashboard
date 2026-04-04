import { buildSearchIndex } from "./search";
import { getPersonPairNamedRelationItems } from "./person-relation-details";
import type {
    ResearchGroupInteractionClassification,
    ResearchGroupInteractionClassificationKey,
    ResearchGroupInteractionEdge,
    ResearchGroupInteractionMode,
    ResearchGroupInteractionModeSummary,
    ResearchGroupInteractionNode,
    ResearchGroupInteractionRawEdge,
    ResearchGroupInteractionRawGraphFile,
    ResearchGroupInteractionRawNode,
    ResearchGroupInteractionRelationType,
    ResearchGroupInteractionTableRow,
    ResearchGroupInteractionTableRowRelation,
    ResearchGroupInteractionViewModel,
} from "../types/groups";

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

export const GROUP_INTERACTION_DENSE_EDGE_THRESHOLD = 1500;

const createClassificationCounter = (): Record<
    ResearchGroupInteractionClassificationKey,
    number
> => ({
    student: 0,
    researcher: 0,
    outside_ifes: 0,
    null: 0,
});

const createRelationCounter = (): Record<
    ResearchGroupInteractionRelationType,
    number
> => ({
    project: 0,
    article: 0,
    orientation: 0,
    initiative: 0,
    advisorship: 0,
    research_group: 0,
});

const normalizeBaseUrl = (baseUrl = "/") => {
    const normalized = baseUrl.trim() || "/";
    return normalized.endsWith("/") ? normalized : `${normalized}/`;
};

export const toResearchGroupInteractionClassificationKey = (
    classification: ResearchGroupInteractionClassification,
): ResearchGroupInteractionClassificationKey => classification ?? "null";

export const resolveResearchGroupInteractionProfileHref = (
    person: {
        id: string | number;
        classification: ResearchGroupInteractionClassification;
    },
    baseUrl = "/",
) => {
    const personId = String(person.id ?? "").trim();
    if (!personId) return null;

    const prefix =
        person.classification === "student" ? "students" : "researchers";

    return `${normalizeBaseUrl(baseUrl)}${prefix}/${personId}`;
};

const normalizeRelationTypes = (
    edge: ResearchGroupInteractionRawEdge,
): ResearchGroupInteractionRelationType[] => {
    const declaredTypes = Array.isArray(edge.relation_types)
        ? RELATION_TYPE_ORDER.filter((type) => edge.relation_types?.includes(type))
        : [];

    if (declaredTypes.length > 0) {
        return declaredTypes;
    }

    return RELATION_TYPE_ORDER.filter((type) => {
        switch (type) {
            case "project":
                return Number(edge.project_count ?? 0) > 0;
            case "article":
                return Number(edge.article_count ?? 0) > 0;
            case "orientation":
                return Number(edge.orientation_count ?? 0) > 0;
            case "initiative":
                return Number(edge.initiative_count ?? 0) > 0;
            case "advisorship":
                return Number(edge.advisorship_count ?? 0) > 0;
            case "research_group":
                return Number(edge.research_group_count ?? 0) > 0;
            default:
                return false;
        }
    });
};

const normalizeNode = (
    node: ResearchGroupInteractionRawNode,
    baseUrl: string,
    defaultGroupMember = false,
): ResearchGroupInteractionNode => {
    const classification = node.classification ?? null;
    const isGroupMember =
        typeof node.is_group_member === "boolean"
            ? node.is_group_member
            : defaultGroupMember;

    return {
        id: String(node.id),
        name: node.name ?? "Pessoa sem nome",
        classification,
        classificationKey:
            toResearchGroupInteractionClassificationKey(classification),
        classificationConfidence: node.classification_confidence ?? null,
        campusName: node.campus_name ?? null,
        degree: Number(node.degree ?? 0),
        weightedDegree: Number(node.weighted_degree ?? 0),
        isGroupMember,
        isAdvisorshipNeighbor: node.is_advisorship_neighbor === true,
        wasStudent: node.was_student === true,
        wasStaff: node.was_staff === true,
        searchText: buildSearchIndex([
            node.name,
            classification,
            node.campus_name,
            isGroupMember ? "membro do grupo" : null,
            node.is_advisorship_neighbor ? "vizinho de orientação" : null,
        ]),
        profileHref: resolveResearchGroupInteractionProfileHref(
            {
                id: node.id,
                classification,
            },
            baseUrl,
        ),
    };
};

const normalizeEdge = (
    edge: ResearchGroupInteractionRawEdge,
): ResearchGroupInteractionEdge => ({
    source: String(edge.source),
    target: String(edge.target),
    weight: Number(edge.weight ?? 0),
    projectCount: Number(edge.project_count ?? 0),
    articleCount: Number(edge.article_count ?? 0),
    orientationCount: Number(edge.orientation_count ?? 0),
    initiativeCount: Number(edge.initiative_count ?? 0),
    researchGroupCount: Number(edge.research_group_count ?? 0),
    advisorshipCount: Number(edge.advisorship_count ?? 0),
    relationTypes: normalizeRelationTypes(edge),
});

const getRelationCountForEdgeType = (
    edge: ResearchGroupInteractionEdge,
    type: ResearchGroupInteractionRelationType,
) => {
    switch (type) {
        case "project":
            return edge.projectCount;
        case "article":
            return edge.articleCount;
        case "orientation":
            return edge.orientationCount;
        case "initiative":
            return edge.initiativeCount;
        case "research_group":
            return edge.researchGroupCount;
        case "advisorship":
            return edge.advisorshipCount;
        default:
            return 0;
    }
};

const comparePeopleForTable = (
    left: { id: string; name: string },
    right: { id: string; name: string },
) => {
    const nameComparison = left.name.localeCompare(right.name, "pt-BR");

    if (nameComparison !== 0) {
        return nameComparison;
    }

    return left.id.localeCompare(right.id, "pt-BR");
};

const buildTableRelations = (
    edge: ResearchGroupInteractionEdge,
    sourceId: string,
    targetId: string,
): ResearchGroupInteractionTableRowRelation[] =>
    RELATION_TYPE_ORDER.filter((type) => edge.relationTypes.includes(type)).map(
        (type) => {
            const count = getRelationCountForEdgeType(edge, type);

            return {
                type,
                count: count > 0 ? count : null,
                namedItems: getPersonPairNamedRelationItems(
                    sourceId,
                    targetId,
                    type,
                ),
            };
        },
    );

const buildDefaultRelationTypes = (
    relationTypeCounts: Record<ResearchGroupInteractionRelationType, number>,
    availableRelationTypes: ResearchGroupInteractionRelationType[],
) => {
    const activeInteractionTypes = RELATION_TYPE_ORDER.filter(
        (type) =>
            type !== "research_group" && relationTypeCounts[type] > 0,
    );

    if (activeInteractionTypes.length > 0) {
        return activeInteractionTypes;
    }

    if (relationTypeCounts.research_group > 0) {
        return ["research_group"];
    }

    return availableRelationTypes;
};

const buildModeSummary = (
    mode: ResearchGroupInteractionMode,
    nodeIds: string[],
    nodes: ResearchGroupInteractionNode[],
    edges: ResearchGroupInteractionEdge[],
    declaredRelationTypes: ResearchGroupInteractionRelationType[],
): ResearchGroupInteractionModeSummary => {
    const nodeIdSet = new Set(nodeIds);
    const scopedNodes = nodes.filter((node) => nodeIdSet.has(node.id));
    const scopedEdges = edges.filter(
        (edge) => nodeIdSet.has(edge.source) && nodeIdSet.has(edge.target),
    );

    const classificationCounts = createClassificationCounter();
    const relationTypeCounts = createRelationCounter();

    scopedNodes.forEach((node) => {
        classificationCounts[node.classificationKey] += 1;
    });

    scopedEdges.forEach((edge) => {
        edge.relationTypes.forEach((relationType) => {
            relationTypeCounts[relationType] += 1;
        });
    });

    const availableRelationTypesWithEdges = RELATION_TYPE_ORDER.filter(
        (type) => relationTypeCounts[type] > 0,
    );
    const availableRelationTypes =
        availableRelationTypesWithEdges.length > 0
            ? availableRelationTypesWithEdges
            : declaredRelationTypes;
    const defaultRelationTypes = buildDefaultRelationTypes(
        relationTypeCounts,
        availableRelationTypes,
    );
    const defaultVisibleEdgeCount = scopedEdges.filter((edge) =>
        edge.relationTypes.some((relationType) =>
            defaultRelationTypes.includes(relationType),
        ),
    ).length;

    return {
        mode,
        nodeIds,
        nodeCount: scopedNodes.length,
        edgeCount: scopedEdges.length,
        classificationCounts,
        relationTypeCounts,
        availableRelationTypes,
        defaultRelationTypes,
        defaultVisibleEdgeCount,
        usesDenseModeByDefault:
            defaultVisibleEdgeCount > GROUP_INTERACTION_DENSE_EDGE_THRESHOLD,
    };
};

interface BuildResearchGroupInteractionOptions {
    groupId?: string | number;
    groupName?: string;
    baseUrl?: string;
}

export const buildResearchGroupInteractionViewModel = (
    rawGraph: ResearchGroupInteractionRawGraphFile,
    options: BuildResearchGroupInteractionOptions = {},
): ResearchGroupInteractionViewModel => {
    const baseUrl = normalizeBaseUrl(options.baseUrl);
    const hasExplicitMemberFlags = rawGraph.graph.nodes.some(
        (node) => typeof node.is_group_member === "boolean",
    );
    const defaultGroupMember = !hasExplicitMemberFlags;
    const declaredRelationTypes = RELATION_TYPE_ORDER.filter((type) =>
        Object.prototype.hasOwnProperty.call(
            rawGraph.metadata.relation_types ?? {},
            type,
        ),
    );
    const nodes = rawGraph.graph.nodes.map((node) =>
        normalizeNode(node, baseUrl, defaultGroupMember),
    );
    const nodeIdSet = new Set(nodes.map((node) => node.id));
    const edges = rawGraph.graph.edges
        .map(normalizeEdge)
        .filter(
            (edge) => nodeIdSet.has(edge.source) && nodeIdSet.has(edge.target),
        );

    const memberNodeIds = nodes
        .filter((node) => node.isGroupMember)
        .map((node) => node.id);
    const expandedNodeIds = nodes.map((node) => node.id);

    const members = buildModeSummary(
        "members",
        memberNodeIds,
        nodes,
        edges,
        declaredRelationTypes,
    );
    const expanded = buildModeSummary(
        "expanded",
        expandedNodeIds,
        nodes,
        edges,
        declaredRelationTypes,
    );

    return {
        groupId: String(
            options.groupId ?? rawGraph.metadata.scope.research_group.id,
        ),
        groupName:
            options.groupName ?? rawGraph.metadata.scope.research_group.name,
        denseEdgeThreshold: GROUP_INTERACTION_DENSE_EDGE_THRESHOLD,
        defaultMode: "members",
        hasExpandedMode: expanded.nodeCount > members.nodeCount,
        nodes,
        edges,
        stats: {
            nodes: Number(rawGraph.graph_stats.nodes ?? nodes.length),
            edges: Number(rawGraph.graph_stats.edges ?? edges.length),
            isolatedNodes: Number(rawGraph.graph_stats.isolated_nodes ?? 0),
            connectedComponents: Number(
                rawGraph.graph_stats.connected_components ?? 0,
            ),
            largestComponentSize: Number(
                rawGraph.graph_stats.largest_component_size ?? nodes.length,
            ),
        },
        modes: {
            members,
            expanded,
        },
    };
};

export const buildResearchGroupRelationshipTableRows = (
    viewModel: ResearchGroupInteractionViewModel,
): ResearchGroupInteractionTableRow[] => {
    const nodesById = new Map(viewModel.nodes.map((node) => [node.id, node]));

    return viewModel.edges
        .map((edge) => {
            const sourceNode = nodesById.get(edge.source);
            const targetNode = nodesById.get(edge.target);

            if (!sourceNode || !targetNode) {
                return null;
            }

            const [leftNode, rightNode] =
                comparePeopleForTable(sourceNode, targetNode) <= 0
                    ? [sourceNode, targetNode]
                    : [targetNode, sourceNode];
            const relations = buildTableRelations(
                edge,
                leftNode.id,
                rightNode.id,
            );
            const explicitRelationEvents = relations.reduce(
                (total, relation) => total + (relation.count ?? 0),
                0,
            );

            return {
                key: `${leftNode.id}:${rightNode.id}`,
                sourceId: leftNode.id,
                sourceName: leftNode.name,
                sourceClassification: leftNode.classification,
                sourceCampusName: leftNode.campusName,
                sourceProfileHref: leftNode.profileHref,
                targetId: rightNode.id,
                targetName: rightNode.name,
                targetClassification: rightNode.classification,
                targetCampusName: rightNode.campusName,
                targetProfileHref: rightNode.profileHref,
                weight: edge.weight,
                relationKinds: relations.length,
                totalRelationEvents:
                    explicitRelationEvents > 0
                        ? explicitRelationEvents
                        : edge.weight,
                relations,
            };
        })
        .filter((row): row is ResearchGroupInteractionTableRow => row !== null)
        .sort((left, right) => {
            if (right.weight !== left.weight) {
                return right.weight - left.weight;
            }

            if (right.totalRelationEvents !== left.totalRelationEvents) {
                return right.totalRelationEvents - left.totalRelationEvents;
            }

            if (right.relationKinds !== left.relationKinds) {
                return right.relationKinds - left.relationKinds;
            }

            const sourceComparison = left.sourceName.localeCompare(
                right.sourceName,
                "pt-BR",
            );

            if (sourceComparison !== 0) {
                return sourceComparison;
            }

            return left.targetName.localeCompare(right.targetName, "pt-BR");
        });
};
