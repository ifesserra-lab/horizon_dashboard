import { describe, expect, it } from "vitest";
import groupsData from "../src/data/research_groups_canonical.json";
import researchersData from "../src/data/researchers_canonical.json";
import projectsData from "../src/data/initiatives_canonical.json";
import advisorshipsData from "../src/data/advisorships_canonical.json";
import { getAggregatedPublications } from "../src/lib/publications-data";
import { buildSearchIndex, normalizeSearchText } from "../src/lib/search";

const matchesSearch = (
    values: Array<string | number | null | undefined>,
    query: string,
) => buildSearchIndex(values).includes(normalizeSearchText(query));

describe("Site-wide search normalization", () => {
    it("matches group search fields without requiring accents", () => {
        const groups = groupsData as any[];

        expect(
            groups.some((group) =>
                matchesSearch(
                    [
                        group.name,
                        group.campus?.name,
                        ...(group.knowledge_areas || []).map((area: any) => area.name),
                        ...(group.leaders || []).map((leader: any) => leader.name),
                    ],
                    "vitoria",
                ),
            ),
        ).toBe(true);
    });

    it("matches researcher names without requiring accents", () => {
        const researchers = researchersData as any[];

        expect(
            researchers.some((researcher) =>
                matchesSearch([researcher.name], "rogerio"),
            ),
        ).toBe(true);
    });

    it("matches project titles and member names without requiring accents", () => {
        const projects = projectsData as any[];

        expect(
            projects.some((project) =>
                matchesSearch(
                    [
                        project.name,
                        project.status,
                        ...(project.team || []).map(
                            (member: any) => member.person_name || member.name,
                        ),
                    ],
                    "paulo sergio",
                ),
            ),
        ).toBe(true);

        expect(
            projects.some((project) =>
                matchesSearch(
                    [
                        project.name,
                        project.status,
                        ...(project.team || []).map(
                            (member: any) => member.person_name || member.name,
                        ),
                    ],
                    "otimizacao",
                ),
            ),
        ).toBe(true);
    });

    it("matches publication search fields without requiring accents", () => {
        const publications = getAggregatedPublications();

        expect(
            publications.some((publication) =>
                matchesSearch(
                    [
                        publication.title,
                        publication.journal_conference,
                        ...publication.author_names,
                    ],
                    "eficiencia energetica",
                ),
            ),
        ).toBe(true);

        expect(
            publications.some((publication) =>
                matchesSearch(
                    [
                        publication.title,
                        publication.journal_conference,
                        ...publication.author_names,
                    ],
                    "revista ifes ciencia",
                ),
            ),
        ).toBe(true);
    });

    it("matches advisorship search fields without requiring accents", () => {
        const advisorships = (advisorshipsData as any[]).flatMap((project) =>
            (project.advisorships || []).map((advisorship: any) => ({
                ...advisorship,
                projectName: project.name,
            })),
        );

        expect(
            advisorships.some((advisorship) =>
                matchesSearch(
                    [
                        advisorship.student_name,
                        advisorship.supervisor_name,
                        advisorship.projectName,
                        advisorship.name,
                        advisorship.type,
                    ],
                    "pre-classificacao",
                ),
            ),
        ).toBe(true);
    });
});
