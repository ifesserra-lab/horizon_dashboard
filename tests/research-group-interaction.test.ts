import { describe, expect, it } from "vitest";
import group8Graph from "../src/data/research_group_relationship_graphs/research_group_8_relationship_graph.json";
import group216Graph from "../src/data/research_group_relationship_graphs/research_group_216_relationship_graph.json";
import {
    GROUP_INTERACTION_DENSE_EDGE_THRESHOLD,
    buildResearchGroupRelationshipTableRows,
    buildResearchGroupInteractionViewModel,
    resolveResearchGroupInteractionProfileHref,
} from "../src/lib/research-group-interaction";
import type { ResearchGroupInteractionRawGraphFile } from "../src/types/groups";

const denseGraphFixture = (() => {
    const nodes = Array.from({ length: 60 }, (_, index) => ({
        id: index + 1,
        name: `Researcher ${index + 1}`,
        classification: "researcher" as const,
        weighted_degree: 59,
        degree: 59,
        was_staff: true,
    }));

    const edges = [] as ResearchGroupInteractionRawGraphFile["graph"]["edges"];

    for (let sourceIndex = 0; sourceIndex < nodes.length; sourceIndex += 1) {
        for (
            let targetIndex = sourceIndex + 1;
            targetIndex < nodes.length;
            targetIndex += 1
        ) {
            edges.push({
                source: nodes[sourceIndex].id,
                target: nodes[targetIndex].id,
                weight: 1,
                research_group_count: 1,
                relation_types: ["research_group"],
            });
        }
    }

    return {
        metadata: {
            relation_types: {
                research_group: "Shared group membership.",
            },
            scope: {
                type: "research_group",
                graph_type: "relationship",
                research_group: {
                    id: 9999,
                    name: "Dense Group",
                    member_count: 60,
                },
            },
        },
        graph_stats: {
            nodes: nodes.length,
            edges: edges.length,
            isolated_nodes: 0,
            connected_components: 1,
            largest_component_size: nodes.length,
            relation_event_totals: {
                research_group: edges.length,
            },
            edge_relation_presence: {
                research_group: edges.length,
            },
            classification_distribution: {
                researcher: nodes.length,
            },
        },
        graph: {
            directed: false,
            multigraph: false,
            graph: {},
            nodes,
            edges,
        },
    } satisfies ResearchGroupInteractionRawGraphFile;
})();

const relationshipTableFixture = {
    metadata: {
        relation_types: {
            project: "Shared projects",
            article: "Shared articles",
            orientation: "Shared orientations",
        },
        scope: {
            type: "research_group",
            graph_type: "relationship",
            research_group: {
                id: 1234,
                name: "Table Group",
                member_count: 3,
            },
        },
    },
    graph_stats: {
        nodes: 3,
        edges: 2,
        isolated_nodes: 0,
        connected_components: 1,
        largest_component_size: 3,
    },
    graph: {
        directed: false,
        multigraph: false,
        graph: {},
        nodes: [
            {
                id: 1,
                name: "Bruno",
                classification: "researcher" as const,
                campus_name: "Vitoria",
                degree: 2,
                weighted_degree: 4,
            },
            {
                id: 2,
                name: "Alice",
                classification: "student" as const,
                campus_name: "Serra",
                degree: 1,
                weighted_degree: 3,
            },
            {
                id: 3,
                name: "Carlos",
                classification: "outside_ifes" as const,
                degree: 1,
                weighted_degree: 1,
            },
        ],
        edges: [
            {
                source: 1,
                target: 2,
                weight: 3,
                project_count: 2,
                article_count: 1,
                relation_types: ["project", "article"],
            },
            {
                source: 1,
                target: 3,
                weight: 1,
                orientation_count: 1,
                relation_types: ["orientation"],
            },
        ],
    },
} satisfies ResearchGroupInteractionRawGraphFile;

const canonicalRelationshipTableFixture = {
    metadata: {
        relation_types: {
            project: "Shared projects",
        },
        scope: {
            type: "research_group",
            graph_type: "relationship",
            research_group: {
                id: 5678,
                name: "Canonical Table Group",
                member_count: 2,
            },
        },
    },
    graph_stats: {
        nodes: 2,
        edges: 1,
        isolated_nodes: 0,
        connected_components: 1,
        largest_component_size: 2,
    },
    graph: {
        directed: false,
        multigraph: false,
        graph: {},
        nodes: [
            {
                id: 454,
                name: "Luan Otoni de Oliveira",
                classification: "student" as const,
            },
            {
                id: 455,
                name: "Aluno Exemplo",
                classification: "student" as const,
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
} satisfies ResearchGroupInteractionRawGraphFile;

describe("Research group interaction helpers", () => {
    it("infers member-only mode from current exports when member flags are absent", () => {
        const viewModel = buildResearchGroupInteractionViewModel(
            group8Graph as ResearchGroupInteractionRawGraphFile,
            {
                baseUrl: "/horizon_dashboard/",
            },
        );

        expect(viewModel.defaultMode).toBe("members");
        expect(viewModel.hasExpandedMode).toBe(false);
        expect(viewModel.modes.members.nodeCount).toBe(21);
        expect(viewModel.modes.members.defaultRelationTypes).toEqual([
            "project",
            "article",
            "orientation",
        ]);
        expect(viewModel.modes.members.defaultVisibleEdgeCount).toBe(0);
        expect(viewModel.nodes.every((node) => node.isGroupMember)).toBe(true);

        const studentNode = viewModel.nodes.find(
            (node) => node.classification === "student",
        );
        const researcherNode = viewModel.nodes.find(
            (node) => node.classification === "researcher",
        );

        expect(studentNode?.profileHref).toBe(
            `/horizon_dashboard/students/${studentNode?.id}`,
        );
        expect(researcherNode?.profileHref).toBe(
            `/horizon_dashboard/researchers/${researcherNode?.id}`,
        );
    });

    it("parses project-based collaboration edges from the current group exports", () => {
        const viewModel = buildResearchGroupInteractionViewModel(
            group216Graph as ResearchGroupInteractionRawGraphFile,
            {
                baseUrl: "/horizon_dashboard/",
            },
        );

        expect(viewModel.hasExpandedMode).toBe(false);
        expect(viewModel.modes.members.nodeCount).toBe(60);
        expect(viewModel.modes.members.defaultRelationTypes).toEqual(["project"]);
        expect(viewModel.modes.members.defaultVisibleEdgeCount).toBe(28);
        expect(viewModel.modes.members.relationTypeCounts.project).toBe(28);
        expect(
            viewModel.edges.every((edge) => edge.relationTypes.includes("project")),
        ).toBe(true);
        expect(
            viewModel.nodes.find((node) => node.id === "561")?.profileHref,
        ).toBe("/horizon_dashboard/researchers/561");
    });

    it("activates dense mode when the default filtered graph is too large", () => {
        const viewModel = buildResearchGroupInteractionViewModel(
            denseGraphFixture,
        );

        expect(viewModel.modes.members.defaultRelationTypes).toEqual([
            "research_group",
        ]);
        expect(viewModel.modes.members.defaultVisibleEdgeCount).toBeGreaterThan(
            GROUP_INTERACTION_DENSE_EDGE_THRESHOLD,
        );
        expect(viewModel.modes.members.usesDenseModeByDefault).toBe(true);
    });

    it("routes null classifications to the researcher profile path", () => {
        expect(
            resolveResearchGroupInteractionProfileHref(
                {
                    id: 99,
                    classification: null,
                },
                "/horizon_dashboard/",
            ),
        ).toBe("/horizon_dashboard/researchers/99");
    });

    it("builds table rows for person-to-person relations in alphabetical order", () => {
        const viewModel = buildResearchGroupInteractionViewModel(
            relationshipTableFixture,
            {
                baseUrl: "/horizon_dashboard/",
            },
        );
        const rows = buildResearchGroupRelationshipTableRows(viewModel);

        expect(rows).toHaveLength(2);
        expect(rows[0]).toMatchObject({
            sourceName: "Alice",
            sourceProfileHref: "/horizon_dashboard/students/2",
            targetName: "Bruno",
            targetProfileHref: "/horizon_dashboard/researchers/1",
            weight: 3,
            totalRelationEvents: 3,
            relationKinds: 2,
            relations: [
                { type: "project", count: 2 },
                { type: "article", count: 1 },
            ],
        });
        expect(rows[1]).toMatchObject({
            sourceName: "Bruno",
            targetName: "Carlos",
            weight: 1,
            totalRelationEvents: 1,
            relations: [{ type: "orientation", count: 1 }],
        });
    });

    it("enriches group table relations with canonical item names when available", () => {
        const viewModel = buildResearchGroupInteractionViewModel(
            canonicalRelationshipTableFixture,
            {
                baseUrl: "/horizon_dashboard/",
            },
        );
        const rows = buildResearchGroupRelationshipTableRows(viewModel);

        expect(rows).toHaveLength(1);
        expect(rows[0]?.relations[0]).toMatchObject({
            type: "project",
            count: 1,
        });
        expect(rows[0]?.relations[0]?.namedItems[0]?.name).toContain(
            "A necessidade de metodologias",
        );
    });
});
