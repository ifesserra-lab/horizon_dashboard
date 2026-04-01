import { describe, expect, it } from "vitest";
import {
    buildResearcherStatsById,
    getHighestAcademicDegree,
} from "../src/lib/researchers-data";
import type { Researcher } from "../src/types/researchers";

describe("Researchers data helpers", () => {
    it("returns the highest academic degree using the expected hierarchy", () => {
        expect(
            getHighestAcademicDegree([
                {
                    institution: "Ifes",
                    degree: "Graduação",
                    course_name: "Curso A",
                    start_year: "2010",
                    end_year: "2014",
                    thesis_title: "",
                    advisor_name: "",
                    co_advisor_name: null,
                },
                {
                    institution: "Ifes",
                    degree: "Doutorado",
                    course_name: "Curso B",
                    start_year: "2015",
                    end_year: "2019",
                    thesis_title: "",
                    advisor_name: "",
                    co_advisor_name: null,
                },
            ]),
        ).toBe("Doutorado");
        expect(getHighestAcademicDegree([])).toBeNull();
    });

    it("builds researcher stats grouped by researcher id", () => {
        const researchers: Researcher[] = [
            {
                id: "1",
                name: "Pesquisador Teste",
                initiatives: [
                    {
                        id: "p1",
                        name: "Projeto 1",
                        status: "active",
                        role: "Coordenador",
                    },
                ],
                research_groups: [],
                knowledge_areas: [],
                academic_education: [],
                articles: [
                    {
                        id: "a1",
                        title: "Artigo 1",
                        year: "2024",
                        type: "journal",
                        doi: null,
                        journal_conference: "Revista Teste",
                    },
                    {
                        id: "a2",
                        title: "Artigo 2",
                        year: "2025",
                        type: "journal",
                        doi: null,
                        journal_conference: "Revista Teste",
                    },
                ],
                advisorships: [
                    {
                        id: "o1",
                        name: "Orientação 1",
                        status: "active",
                        start_year: "2024",
                        end_year: "2025",
                        type: "Mestrado",
                        initiative_type: "Pesquisa",
                        student_name: "Aluno 1",
                    },
                    {
                        id: "o2",
                        name: "Orientação 2",
                        status: "active",
                        start_year: "2024",
                        end_year: "2025",
                        type: "Mestrado",
                        initiative_type: "Pesquisa",
                        student_name: "Aluno 2",
                    },
                ],
            },
        ];

        expect(buildResearcherStatsById(researchers)).toEqual({
            "1": {
                projects: 1,
                articles: 2,
                advisorships: 2,
                advisorshipsByType: {
                    Mestrado: 2,
                },
                isSupervisor: true,
                isStudent: false,
            },
        });
    });
});
