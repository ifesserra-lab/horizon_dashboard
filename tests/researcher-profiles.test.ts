import { describe, expect, it } from "vitest";
import type { Researcher } from "../src/types/researchers";
import {
    enrichResearcherInitiatives,
    getStudentAdvisors,
    getStudentFellowships,
    type CanonicalAdvisorshipProjectRecord,
    type CanonicalInitiativeRecord,
} from "../src/lib/researcher-profiles";

describe("Researcher profile helpers", () => {
    it("enriches researcher initiatives with canonical dates and types", () => {
        const researcher: Researcher = {
            id: "500",
            name: "Estudante Teste",
            classification: "student",
            initiatives: [
                {
                    id: "568",
                    name: "Orientação Teste",
                    status: "active",
                    role: "Student",
                },
            ],
            research_groups: [],
            knowledge_areas: [],
            academic_education: [],
            articles: [],
            advisorships: [],
        };
        const canonicalInitiatives: CanonicalInitiativeRecord[] = [
            {
                id: 568,
                name: "Orientação Teste",
                start_date: "2024-09-01T00:00:00",
                end_date: null,
                initiative_type: {
                    id: 2,
                    name: "Advisorship",
                },
            },
        ];

        expect(
            enrichResearcherInitiatives(researcher, canonicalInitiatives),
        ).toEqual([
            {
                id: "568",
                name: "Orientação Teste",
                status: "active",
                role: "Student",
                start_date: "2024-09-01T00:00:00",
                end_date: null,
                initiative_type: {
                    id: 2,
                    name: "Advisorship",
                },
            },
        ]);
    });

    it("derives student advisors from advisorship initiatives and academic education", () => {
        const researcher: Researcher = {
            id: "500",
            name: "Estudante Teste",
            classification: "student",
            initiatives: [
                {
                    id: "568",
                    name: "Orientação Teste",
                    status: "active",
                    role: "Student",
                },
            ],
            research_groups: [],
            knowledge_areas: [],
            academic_education: [
                {
                    institution: "Ifes",
                    degree: "Graduação",
                    course_name: "Engenharia",
                    start_year: "2021",
                    end_year: "",
                    thesis_title: "",
                    advisor_name: "Ana Orientadora",
                    co_advisor_name: "Bruno Coorientador",
                },
            ],
            articles: [],
            advisorships: [],
        };

        const canonicalInitiatives: CanonicalInitiativeRecord[] = [
            {
                id: 568,
                name: "Orientação Teste",
                start_date: "2024-09-01T00:00:00",
                end_date: null,
                initiative_type: {
                    id: 2,
                    name: "Advisorship",
                },
                team: [
                    {
                        person_id: 10,
                        person_name: "Ana Orientadora",
                        roles: ["Coordinator"],
                    },
                    {
                        person_id: 500,
                        person_name: "Estudante Teste",
                        roles: ["Student"],
                    },
                ],
            },
        ];

        expect(getStudentAdvisors(researcher, canonicalInitiatives)).toEqual([
            {
                id: "10",
                name: "Ana Orientadora",
                relatedInitiatives: [
                    {
                        id: "568",
                        name: "Orientação Teste",
                        startDate: "2024-09-01T00:00:00",
                        endDate: null,
                    },
                ],
                sources: ["academic_education", "initiative_team"],
            },
            {
                id: "education-co-advisor-0-Bruno Coorientador",
                name: "Bruno Coorientador",
                relatedInitiatives: [],
                sources: ["academic_education"],
            },
        ]);
    });

    it("includes project coordinators and fellowship supervisors in student advisors", () => {
        const researcher: Researcher = {
            id: "500",
            name: "Estudante Teste",
            classification: "student",
            initiatives: [
                {
                    id: "12",
                    name: "Projeto de Pesquisa Teste",
                    status: "active",
                    role: "Student",
                },
                {
                    id: "568",
                    name: "Bolsa Teste",
                    status: "active",
                    role: "Student",
                },
            ],
            research_groups: [],
            knowledge_areas: [],
            academic_education: [],
            articles: [],
            advisorships: [],
        };

        const canonicalInitiatives: CanonicalInitiativeRecord[] = [
            {
                id: 12,
                name: "Projeto de Pesquisa Teste",
                start_date: "2024-01-01T00:00:00",
                end_date: "2024-12-31T00:00:00",
                initiative_type: {
                    id: 1,
                    name: "Research Project",
                },
                team: [
                    {
                        person_id: 10,
                        person_name: "Ana Orientadora",
                        roles: ["Coordinator"],
                    },
                    {
                        person_id: 500,
                        person_name: "Estudante Teste",
                        roles: ["Student"],
                    },
                ],
            },
        ];

        const canonicalAdvisorshipProjects: CanonicalAdvisorshipProjectRecord[] = [
            {
                id: 12,
                name: "Projeto de Pesquisa Teste",
                advisorships: [
                    {
                        id: 568,
                        name: "Bolsa Teste",
                        person_id: 500,
                        person_name: "Estudante Teste",
                        supervisor_id: 10,
                        supervisor_name: "Ana Orientadora",
                        fellowship: {
                            id: 5,
                            name: "PIBIC",
                        },
                    },
                ],
            },
        ];

        expect(
            getStudentAdvisors(
                researcher,
                canonicalInitiatives,
                canonicalAdvisorshipProjects,
            ),
        ).toEqual([
            {
                id: "10",
                name: "Ana Orientadora",
                relatedInitiatives: [
                    {
                        id: "12",
                        name: "Projeto de Pesquisa Teste",
                        startDate: "2024-01-01T00:00:00",
                        endDate: "2024-12-31T00:00:00",
                    },
                ],
                sources: ["fellowship_supervision", "initiative_team"],
            },
        ]);
    });

    it("derives fellowships received by the student from canonical advisorships", () => {
        const researcher: Researcher = {
            id: "500",
            name: "Estudante Teste",
            classification: "student",
            initiatives: [],
            research_groups: [],
            knowledge_areas: [],
            academic_education: [],
            articles: [],
            advisorships: [],
        };

        const canonicalAdvisorshipProjects: CanonicalAdvisorshipProjectRecord[] = [
            {
                id: 12,
                name: "Projeto de Pesquisa Teste",
                advisorships: [
                    {
                        id: 568,
                        name: "Bolsa Teste",
                        status: "Active",
                        description: "Programa: Pibic",
                        start_date: "2025-09-01 00:00:00.000000",
                        end_date: "2026-08-31 00:00:00.000000",
                        person_id: 500,
                        person_name: "Estudante Teste",
                        supervisor_id: 10,
                        supervisor_name: "Ana Orientadora",
                        campus: {
                            id: 6,
                            name: "Serra",
                        },
                        fellowship: {
                            id: 5,
                            name: "PIBIC",
                            description: "Programa: Pibic",
                            value: 400,
                            sponsor_name: "Fapes",
                        },
                    },
                    {
                        id: 999,
                        name: "Sem bolsa",
                        status: "Concluded",
                        person_id: 500,
                        person_name: "Estudante Teste",
                        supervisor_id: 11,
                        supervisor_name: "Outro Orientador",
                        fellowship: null,
                    },
                ],
            },
        ];

        const canonicalInitiatives: CanonicalInitiativeRecord[] = [
            {
                id: 12,
                name: "Projeto de Pesquisa Teste",
                start_date: "2024-01-01T00:00:00",
                end_date: "2024-12-31T00:00:00",
            },
        ];

        expect(
            getStudentFellowships(
                researcher,
                canonicalAdvisorshipProjects,
                canonicalInitiatives,
            ),
        ).toEqual([
            {
                id: "568",
                name: "Bolsa Teste",
                status: "Active",
                description: "Programa: Pibic",
                startDate: "2025-09-01 00:00:00.000000",
                endDate: "2026-08-31 00:00:00.000000",
                projectId: "12",
                projectName: "Projeto de Pesquisa Teste",
                projectStartDate: "2024-01-01T00:00:00",
                projectEndDate: "2024-12-31T00:00:00",
                supervisorId: "10",
                supervisorName: "Ana Orientadora",
                campusName: "Serra",
                fellowship: {
                    id: "5",
                    name: "PIBIC",
                    description: "Programa: Pibic",
                    value: 400,
                    sponsorName: "Fapes",
                },
            },
        ]);
    });
});
