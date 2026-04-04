import { describe, expect, it } from "vitest";
import {
    buildStudentInteractionTableRows,
    buildStudentInteractionViewModel,
} from "../src/lib/student-interaction";
import type { StudentInteractionRawGraphFile } from "../src/types/student-graphs";

const collaborationFixture = {
    metadata: {
        scope: {
            type: "classification",
            graph_type: "collaboration",
            classification: "student",
        },
    },
    graph_stats: {},
    graph: {
        directed: false,
        multigraph: false,
        graph: {},
        nodes: [
            {
                id: 1,
                name: "Alice",
                classification: "student",
                degree: 1,
                weighted_degree: 2,
            },
            {
                id: 2,
                name: "Bruno",
                classification: "student",
                degree: 2,
                weighted_degree: 3,
                campus_name: "Serra",
            },
            {
                id: 3,
                name: "Carla",
                classification: "student",
                degree: 1,
                weighted_degree: 1,
            },
        ],
        edges: [
            {
                source: 1,
                target: 2,
                weight: 2,
                project_count: 1,
                article_count: 1,
                relation_types: ["project", "article"],
            },
            {
                source: 2,
                target: 3,
                weight: 1,
                project_count: 1,
                relation_types: ["project"],
            },
        ],
    },
} satisfies StudentInteractionRawGraphFile;

const relationshipFixture = {
    metadata: {
        scope: {
            type: "classification",
            classification: "student",
        },
    },
    graph_stats: {},
    graph: {
        directed: false,
        multigraph: false,
        graph: {},
        nodes: [
            {
                id: 7,
                name: "Daniela",
                classification: "student",
                degree: 2,
                weighted_degree: 3,
            },
            {
                id: 8,
                name: "Eduarda",
                classification: "student",
                degree: 1,
                weighted_degree: 1,
            },
            {
                id: 9,
                name: "Felipe",
                classification: "student",
                degree: 1,
                weighted_degree: 2,
            },
        ],
        edges: [
            {
                source: 7,
                target: 8,
                weight: 1,
                initiative_count: 1,
            },
            {
                source: 7,
                target: 9,
                weight: 2,
                research_group_count: 1,
                advisorship_count: 1,
            },
        ],
    },
} satisfies StudentInteractionRawGraphFile;

const isolatedFixture = {
    metadata: {
        scope: {
            type: "classification",
            graph_type: "collaboration",
            classification: "student",
        },
    },
    graph_stats: {},
    graph: {
        directed: false,
        multigraph: false,
        graph: {},
        nodes: [
            {
                id: 10,
                name: "Gabriela",
                classification: "student",
                degree: 0,
                weighted_degree: 0,
            },
        ],
        edges: [],
    },
} satisfies StudentInteractionRawGraphFile;

const canonicalProjectFixture = {
    metadata: {
        scope: {
            type: "classification",
            graph_type: "collaboration",
            classification: "student",
        },
    },
    graph_stats: {},
    graph: {
        directed: false,
        multigraph: false,
        graph: {},
        nodes: [
            {
                id: 454,
                name: "Luan Otoni de Oliveira",
                classification: "student",
                degree: 1,
                weighted_degree: 1,
            },
            {
                id: 455,
                name: "Victor Gabriel Brenner Dicberner",
                classification: "student",
                degree: 1,
                weighted_degree: 1,
            },
        ],
        edges: [
            {
                source: 454,
                target: 455,
                weight: 1,
                project_count: 1,
                relation_types: ["project"],
            },
        ],
    },
} satisfies StudentInteractionRawGraphFile;

describe("Student interaction helpers", () => {
    it("builds a direct collaboration ego graph without neighbor-to-neighbor edges", () => {
        const viewModel = buildStudentInteractionViewModel(collaborationFixture, {
            focusId: 1,
            focusName: "Alice",
            focusClassification: "student",
            graphKind: "collaboration",
            baseUrl: "/horizon_dashboard/",
        });

        expect(viewModel.nodes.map((node) => node.name)).toEqual(["Alice", "Bruno"]);
        expect(viewModel.edges).toHaveLength(1);
        expect(viewModel.edges[0]?.target).toBe("2");
        expect(viewModel.edges[0]?.weight).toBe(2);
        expect(viewModel.edges[0]?.relationTypes).toEqual(["project", "article"]);
        expect(viewModel.stats.totalWeight).toBe(2);
        expect(viewModel.stats.availableRelationTypes).toEqual([
            "project",
            "article",
        ]);
        expect(viewModel.topConnections[0]?.profileHref).toBe(
            "/horizon_dashboard/students/2",
        );
    });

    it("infers relationship relation types from evidence counters when the raw edge has no declared types", () => {
        const viewModel = buildStudentInteractionViewModel(relationshipFixture, {
            focusId: 7,
            focusName: "Daniela",
            focusClassification: "student",
            graphKind: "relationship",
        });

        expect(viewModel.edges).toHaveLength(2);
        expect(viewModel.edges[0]?.target).toBe("9");
        expect(viewModel.edges[0]?.relationTypes).toEqual([
            "research_group",
            "advisorship",
        ]);
        expect(viewModel.edges[1]?.relationTypes).toEqual(["initiative"]);
        expect(viewModel.stats.strongestWeight).toBe(2);
        expect(viewModel.stats.availableRelationTypes).toEqual([
            "initiative",
            "research_group",
            "advisorship",
        ]);
    });

    it("returns a single-node graph for isolated students", () => {
        const viewModel = buildStudentInteractionViewModel(isolatedFixture, {
            focusId: 10,
            focusName: "Gabriela",
            focusClassification: "student",
            graphKind: "collaboration",
        });

        expect(viewModel.nodes).toHaveLength(1);
        expect(viewModel.nodes[0]?.isFocus).toBe(true);
        expect(viewModel.edges).toHaveLength(0);
        expect(viewModel.stats.edgeCount).toBe(0);
        expect(viewModel.stats.availableRelationTypes).toEqual([]);
    });

    it("routes non-student connections to the researchers profile path", () => {
        const researcherFixture = {
            metadata: {
                scope: {
                    type: "classification",
                    classification: "researcher",
                },
            },
            graph_stats: {},
            graph: {
                directed: false,
                multigraph: false,
                graph: {},
                nodes: [
                    {
                        id: 20,
                        name: "Gustavo",
                        classification: "researcher",
                        degree: 1,
                        weighted_degree: 1,
                    },
                    {
                        id: 21,
                        name: "Helena",
                        classification: "outside_ifes",
                        degree: 1,
                        weighted_degree: 1,
                    },
                ],
                edges: [
                    {
                        source: 20,
                        target: 21,
                        weight: 1,
                        initiative_count: 1,
                    },
                ],
            },
        } satisfies StudentInteractionRawGraphFile;

        const viewModel = buildStudentInteractionViewModel(researcherFixture, {
            focusId: 20,
            focusName: "Gustavo",
            focusClassification: "researcher",
            graphDataSource: "researchers_only_relationship_graph",
            graphKind: "relationship",
            baseUrl: "/horizon_dashboard/",
        });

        expect(viewModel.focusClassification).toBe("researcher");
        expect(viewModel.graphDataSource).toBe(
            "researchers_only_relationship_graph",
        );
        expect(viewModel.topConnections[0]?.profileHref).toBe(
            "/horizon_dashboard/researchers/21",
        );
    });

    it("builds table rows for direct collaborations with relation counts", () => {
        const viewModel = buildStudentInteractionViewModel(collaborationFixture, {
            focusId: 1,
            focusName: "Alice",
            focusClassification: "student",
            graphKind: "collaboration",
            baseUrl: "/horizon_dashboard/",
        });
        const rows = buildStudentInteractionTableRows(viewModel);

        expect(rows).toHaveLength(1);
        expect(rows[0]).toMatchObject({
            sourceName: "Alice",
            sourceProfileHref: "/horizon_dashboard/students/1",
            targetName: "Bruno",
            targetProfileHref: "/horizon_dashboard/students/2",
            weight: 2,
            totalRelationEvents: 2,
            relationKinds: 2,
            relations: [
                { type: "project", count: 1 },
                { type: "article", count: 1 },
            ],
        });
    });

    it("builds table rows for relationship graphs with inferred evidence counters", () => {
        const viewModel = buildStudentInteractionViewModel(relationshipFixture, {
            focusId: 7,
            focusName: "Daniela",
            focusClassification: "student",
            graphKind: "relationship",
            baseUrl: "/horizon_dashboard/",
        });
        const rows = buildStudentInteractionTableRows(viewModel);

        expect(rows).toHaveLength(2);
        expect(rows[0]).toMatchObject({
            sourceName: "Daniela",
            targetName: "Felipe",
            weight: 2,
            totalRelationEvents: 2,
            relations: [
                { type: "research_group", count: 1 },
                { type: "advisorship", count: 1 },
            ],
        });
        expect(rows[1]).toMatchObject({
            targetName: "Eduarda",
            weight: 1,
            totalRelationEvents: 1,
            relations: [{ type: "initiative", count: 1 }],
        });
    });

    it("enriches project relations with canonical project names when available", () => {
        const viewModel = buildStudentInteractionViewModel(canonicalProjectFixture, {
            focusId: 454,
            focusName: "Luan Otoni de Oliveira",
            focusClassification: "student",
            graphKind: "collaboration",
            baseUrl: "/horizon_dashboard/",
        });
        const rows = buildStudentInteractionTableRows(viewModel);

        expect(rows).toHaveLength(1);
        expect(rows[0]?.relations[0]?.type).toBe("project");
        expect(rows[0]?.relations[0]?.namedItems.length).toBeGreaterThan(0);
        expect(rows[0]?.relations[0]?.namedItems[0]?.name).toContain(
            "A necessidade de metodologias",
        );
    });
});
