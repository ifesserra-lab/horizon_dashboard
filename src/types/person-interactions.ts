export type PersonInteractionGraphKind = "collaboration" | "relationship";

export type PersonInteractionClassification =
    | "student"
    | "researcher"
    | "outside_ifes"
    | null;

export type PersonInteractionClassificationKey =
    | "student"
    | "researcher"
    | "outside_ifes"
    | "null";

export type PersonInteractionRelationType =
    | "project"
    | "orientation"
    | "article"
    | "initiative"
    | "research_group"
    | "advisorship";

export interface PersonInteractionRawNode {
    id: string | number;
    name: string;
    classification?: PersonInteractionClassification;
    classification_confidence?: "low" | "medium" | "high" | null;
    campus_name?: string | null;
    degree?: number | null;
    weighted_degree?: number | null;
    was_student?: boolean;
    was_staff?: boolean;
}

export interface PersonInteractionRawEdge {
    source: string | number;
    target: string | number;
    weight?: number | null;
    project_count?: number | null;
    orientation_count?: number | null;
    article_count?: number | null;
    initiative_count?: number | null;
    research_group_count?: number | null;
    advisorship_count?: number | null;
    relation_types?: string[] | null;
}

export interface PersonInteractionRawGraphFile {
    metadata: {
        scope?: {
            type?: string;
            graph_type?: string;
            classification?: string;
        };
    };
    graph_stats: {
        nodes?: number;
        edges?: number;
        isolated_nodes?: number;
        connected_components?: number;
        largest_component_size?: number;
    };
    graph: {
        directed: boolean;
        multigraph: boolean;
        graph: Record<string, unknown>;
        nodes: PersonInteractionRawNode[];
        edges: PersonInteractionRawEdge[];
    };
}

export interface PersonInteractionNode {
    id: string;
    name: string;
    classification: PersonInteractionClassification;
    classificationKey: PersonInteractionClassificationKey;
    classificationConfidence: "low" | "medium" | "high" | null;
    campusName: string | null;
    degree: number;
    weightedDegree: number;
    wasStudent: boolean;
    wasStaff: boolean;
    isFocus: boolean;
    profileHref: string | null;
}

export interface PersonInteractionEdge {
    source: string;
    target: string;
    weight: number;
    relationTypes: PersonInteractionRelationType[];
    relationEvidenceCounts: Record<PersonInteractionRelationType, number>;
}

export interface PersonInteractionConnection {
    id: string;
    name: string;
    campusName: string | null;
    weight: number;
    relationTypes: PersonInteractionRelationType[];
    relationEvidenceCounts: Record<PersonInteractionRelationType, number>;
    profileHref: string | null;
}

export interface PersonInteractionViewModel {
    focusId: string;
    focusName: string;
    focusClassification: PersonInteractionClassification;
    graphDataSource: string;
    graphKind: PersonInteractionGraphKind;
    nodes: PersonInteractionNode[];
    edges: PersonInteractionEdge[];
    topConnections: PersonInteractionConnection[];
    stats: {
        nodeCount: number;
        edgeCount: number;
        totalWeight: number;
        strongestWeight: number;
        availableRelationTypes: PersonInteractionRelationType[];
        relationTypeCounts: Record<PersonInteractionRelationType, number>;
    };
}

export interface PersonInteractionTableRowRelation {
    type: PersonInteractionRelationType;
    count: number | null;
    namedItems: PersonInteractionNamedRelationItem[];
}

export interface PersonInteractionNamedRelationItem {
    id: string;
    name: string;
}

export interface PersonInteractionTableRow {
    key: string;
    sourceId: string;
    sourceName: string;
    sourceClassification: PersonInteractionClassification;
    sourceCampusName: string | null;
    sourceProfileHref: string | null;
    targetId: string;
    targetName: string;
    targetClassification: PersonInteractionClassification;
    targetCampusName: string | null;
    targetProfileHref: string | null;
    weight: number;
    relationKinds: number;
    totalRelationEvents: number;
    relations: PersonInteractionTableRowRelation[];
}
