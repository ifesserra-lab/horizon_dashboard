export type StudentInteractionGraphKind = "collaboration" | "relationship";

export type StudentInteractionClassification =
    | "student"
    | "researcher"
    | "outside_ifes"
    | null;

export type StudentInteractionClassificationKey =
    | "student"
    | "researcher"
    | "outside_ifes"
    | "null";

export type StudentInteractionRelationType =
    | "project"
    | "orientation"
    | "article"
    | "initiative"
    | "research_group"
    | "advisorship";

export interface StudentInteractionRawNode {
    id: string | number;
    name: string;
    classification?: StudentInteractionClassification;
    classification_confidence?: "low" | "medium" | "high" | null;
    campus_name?: string | null;
    degree?: number | null;
    weighted_degree?: number | null;
    was_student?: boolean;
    was_staff?: boolean;
}

export interface StudentInteractionRawEdge {
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

export interface StudentInteractionRawGraphFile {
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
        nodes: StudentInteractionRawNode[];
        edges: StudentInteractionRawEdge[];
    };
}

export interface StudentInteractionNode {
    id: string;
    name: string;
    classification: StudentInteractionClassification;
    classificationKey: StudentInteractionClassificationKey;
    classificationConfidence: "low" | "medium" | "high" | null;
    campusName: string | null;
    degree: number;
    weightedDegree: number;
    wasStudent: boolean;
    wasStaff: boolean;
    isFocus: boolean;
    profileHref: string | null;
}

export interface StudentInteractionEdge {
    source: string;
    target: string;
    weight: number;
    relationTypes: StudentInteractionRelationType[];
    relationEvidenceCounts: Record<StudentInteractionRelationType, number>;
}

export interface StudentInteractionConnection {
    id: string;
    name: string;
    campusName: string | null;
    weight: number;
    relationTypes: StudentInteractionRelationType[];
    relationEvidenceCounts: Record<StudentInteractionRelationType, number>;
    profileHref: string | null;
}

export interface StudentInteractionViewModel {
    focusId: string;
    focusName: string;
    focusClassification: StudentInteractionClassification;
    graphDataSource: string;
    graphKind: StudentInteractionGraphKind;
    nodes: StudentInteractionNode[];
    edges: StudentInteractionEdge[];
    topConnections: StudentInteractionConnection[];
    stats: {
        nodeCount: number;
        edgeCount: number;
        totalWeight: number;
        strongestWeight: number;
        availableRelationTypes: StudentInteractionRelationType[];
        relationTypeCounts: Record<StudentInteractionRelationType, number>;
    };
}

export interface StudentInteractionTableRowRelation {
    type: StudentInteractionRelationType;
    count: number | null;
    namedItems: StudentInteractionNamedRelationItem[];
}

export interface StudentInteractionNamedRelationItem {
    id: string;
    name: string;
}

export interface StudentInteractionTableRow {
    key: string;
    sourceId: string;
    sourceName: string;
    sourceClassification: StudentInteractionClassification;
    sourceCampusName: string | null;
    sourceProfileHref: string | null;
    targetId: string;
    targetName: string;
    targetClassification: StudentInteractionClassification;
    targetCampusName: string | null;
    targetProfileHref: string | null;
    weight: number;
    relationKinds: number;
    totalRelationEvents: number;
    relations: StudentInteractionTableRowRelation[];
}
