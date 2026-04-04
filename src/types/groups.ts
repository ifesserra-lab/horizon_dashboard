export interface Member {
    id: string;
    name: string;
    role: string;
    lattes_url: string | null;
    emails: string[];
    start_date: string;
    end_date: string | null;
}

export interface KnowledgeArea {
    id: string;
    name: string;
}

export interface Organization {
    id: string;
    name: string;
}

export interface Campus {
    id: string;
    name: string;
}

export interface ResearchGroup {
    id: string;
    name: string;
    description: string | null;
    short_name: string | null;
    organization_id: string;
    campus_id: string;
    cnpq_url: string | null;
    site: string | null;
    organization: Organization;
    campus: Campus;
    knowledge_areas: KnowledgeArea[];
    members: Member[];
    leaders: Member[];
}

export type ResearchGroupInteractionRelationType =
    | "project"
    | "article"
    | "orientation"
    | "initiative"
    | "research_group"
    | "advisorship";

export type ResearchGroupInteractionMode = "members" | "expanded";

export type ResearchGroupInteractionClassification =
    | "student"
    | "researcher"
    | "outside_ifes"
    | null;

export type ResearchGroupInteractionClassificationKey =
    | "student"
    | "researcher"
    | "outside_ifes"
    | "null";

export interface ResearchGroupInteractionRawNode {
    id: string | number;
    name: string;
    classification?: ResearchGroupInteractionClassification;
    classification_confidence?: "low" | "medium" | "high" | null;
    campus_name?: string | null;
    degree?: number | null;
    weighted_degree?: number | null;
    is_group_member?: boolean;
    is_advisorship_neighbor?: boolean;
    was_student?: boolean;
    was_staff?: boolean;
}

export interface ResearchGroupInteractionRawEdge {
    source: string | number;
    target: string | number;
    weight?: number | null;
    project_count?: number | null;
    article_count?: number | null;
    orientation_count?: number | null;
    initiative_count?: number | null;
    research_group_count?: number | null;
    advisorship_count?: number | null;
    relation_types?: string[] | null;
}

export interface ResearchGroupInteractionRawGraphFile {
    metadata: {
        relation_types?: Record<string, string> | null;
        scope: {
            type: string;
            graph_type?: string;
            research_group: {
                id: string | number;
                name: string;
                short_name?: string | null;
                member_count?: number;
                expanded_node_count?: number;
                advisorship_neighbor_count?: number;
            };
        };
    };
    graph_stats: {
        nodes?: number;
        edges?: number;
        isolated_nodes?: number;
        connected_components?: number;
        largest_component_size?: number;
        relation_event_totals?: Partial<
            Record<ResearchGroupInteractionRelationType, number>
        >;
        edge_relation_presence?: Partial<
            Record<ResearchGroupInteractionRelationType, number>
        >;
        classification_distribution?: Partial<
            Record<Exclude<ResearchGroupInteractionClassification, null>, number>
        >;
        top_people_by_weighted_degree?: Array<{
            id: string | number;
            name: string;
            classification: ResearchGroupInteractionClassification;
            weighted_degree: number;
            degree: number;
        }>;
    };
    graph: {
        directed: boolean;
        multigraph: boolean;
        graph: Record<string, unknown>;
        nodes: ResearchGroupInteractionRawNode[];
        edges: ResearchGroupInteractionRawEdge[];
    };
}

export interface ResearchGroupInteractionNode {
    id: string;
    name: string;
    classification: ResearchGroupInteractionClassification;
    classificationKey: ResearchGroupInteractionClassificationKey;
    classificationConfidence: "low" | "medium" | "high" | null;
    campusName: string | null;
    degree: number;
    weightedDegree: number;
    isGroupMember: boolean;
    isAdvisorshipNeighbor: boolean;
    wasStudent: boolean;
    wasStaff: boolean;
    searchText: string;
    profileHref: string | null;
}

export interface ResearchGroupInteractionEdge {
    source: string;
    target: string;
    weight: number;
    projectCount: number;
    articleCount: number;
    orientationCount: number;
    initiativeCount: number;
    researchGroupCount: number;
    advisorshipCount: number;
    relationTypes: ResearchGroupInteractionRelationType[];
}

export interface ResearchGroupInteractionModeSummary {
    mode: ResearchGroupInteractionMode;
    nodeIds: string[];
    nodeCount: number;
    edgeCount: number;
    classificationCounts: Record<ResearchGroupInteractionClassificationKey, number>;
    relationTypeCounts: Record<ResearchGroupInteractionRelationType, number>;
    availableRelationTypes: ResearchGroupInteractionRelationType[];
    defaultRelationTypes: ResearchGroupInteractionRelationType[];
    defaultVisibleEdgeCount: number;
    usesDenseModeByDefault: boolean;
}

export interface ResearchGroupInteractionViewModel {
    groupId: string;
    groupName: string;
    denseEdgeThreshold: number;
    defaultMode: ResearchGroupInteractionMode;
    hasExpandedMode: boolean;
    nodes: ResearchGroupInteractionNode[];
    edges: ResearchGroupInteractionEdge[];
    stats: {
        nodes: number;
        edges: number;
        isolatedNodes: number;
        connectedComponents: number;
        largestComponentSize: number;
    };
    modes: Record<
        ResearchGroupInteractionMode,
        ResearchGroupInteractionModeSummary
    >;
}

export interface ResearchGroupInteractionTableRowRelation {
    type: ResearchGroupInteractionRelationType;
    count: number | null;
    namedItems: ResearchGroupInteractionNamedRelationItem[];
}

export interface ResearchGroupInteractionNamedRelationItem {
    id: string;
    name: string;
}

export interface ResearchGroupInteractionTableRow {
    key: string;
    sourceId: string;
    sourceName: string;
    sourceClassification: ResearchGroupInteractionClassification;
    sourceCampusName: string | null;
    sourceProfileHref: string | null;
    targetId: string;
    targetName: string;
    targetClassification: ResearchGroupInteractionClassification;
    targetCampusName: string | null;
    targetProfileHref: string | null;
    weight: number;
    relationKinds: number;
    totalRelationEvents: number;
    relations: ResearchGroupInteractionTableRowRelation[];
}
