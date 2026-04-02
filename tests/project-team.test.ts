import { describe, expect, it } from "vitest";
import { resolveProjectTeamMembers } from "../src/lib/project-team";
import type { TeamMember } from "../src/types/projects";
import type { Researcher } from "../src/types/researchers";

describe("Project team helpers", () => {
    it("prioritizes student classification over project role labels", () => {
        const team: TeamMember[] = [
            {
                person_id: 516,
                person_name: "Pablo France Salarolli",
                roles: ["Researcher"],
                start_date: "2023-09-01T00:00:00",
                end_date: null,
            },
            {
                person_id: 122,
                person_name: "Marco Antonio De Souza Leite Cuadros",
                roles: ["Coordinator"],
                start_date: "2023-09-01T00:00:00",
                end_date: null,
            },
        ];

        const researchers: Researcher[] = [
            {
                id: "516",
                name: "Pablo France Salarolli",
                classification: "student",
                initiatives: [],
                research_groups: [],
                knowledge_areas: [],
                academic_education: [],
                articles: [],
                advisorships: [],
            },
            {
                id: "122",
                name: "Marco Antonio De Souza Leite Cuadros",
                classification: "researcher",
                initiatives: [],
                research_groups: [],
                knowledge_areas: [],
                academic_education: [],
                articles: [],
                advisorships: [],
            },
        ];

        expect(resolveProjectTeamMembers(team, researchers, "/horizon_dashboard/")).toEqual([
            {
                person_id: 122,
                person_name: "Marco Antonio De Souza Leite Cuadros",
                roles: ["Coordinator"],
                start_date: "2023-09-01T00:00:00",
                end_date: null,
                classification: "researcher",
                bucket: "researcher",
                isAlumni: false,
                profileHref:
                    "/horizon_dashboard/researchers/122",
                fellowships: [],
            },
            {
                person_id: 516,
                person_name: "Pablo France Salarolli",
                roles: ["Researcher"],
                start_date: "2023-09-01T00:00:00",
                end_date: null,
                classification: "student",
                bucket: "student",
                isAlumni: false,
                profileHref:
                    "/horizon_dashboard/students/516",
                fellowships: [],
            },
        ]);
    });

    it("puts unknown or null classifications in the unrecognized bucket", () => {
        const team: TeamMember[] = [
            {
                person_id: 9999,
                person_name: "Pessoa Externa",
                roles: ["Student"],
                start_date: "2024-01-01T00:00:00",
                end_date: "2024-12-31T00:00:00",
            },
            {
                person_id: 10000,
                person_name: "Participante Sem Papel Conhecido",
                roles: ["Collaborator"],
                start_date: "2024-01-01T00:00:00",
                end_date: null,
            },
            {
                person_id: 10001,
                person_name: "Pessoa Sem Classificacao",
                roles: ["Researcher"],
                start_date: "2024-01-01T00:00:00",
                end_date: null,
            },
        ];

        const researchers: Researcher[] = [
            {
                id: "10001",
                name: "Pessoa Sem Classificacao",
                classification: null,
                initiatives: [],
                research_groups: [],
                knowledge_areas: [],
                academic_education: [],
                articles: [],
                advisorships: [],
            },
        ];

        expect(resolveProjectTeamMembers(team, researchers)).toEqual([
            {
                person_id: 10000,
                person_name: "Participante Sem Papel Conhecido",
                roles: ["Collaborator"],
                start_date: "2024-01-01T00:00:00",
                end_date: null,
                classification: "unknown",
                bucket: "unrecognized",
                isAlumni: false,
                profileHref: null,
                fellowships: [],
            },
            {
                person_id: 10001,
                person_name: "Pessoa Sem Classificacao",
                roles: ["Researcher"],
                start_date: "2024-01-01T00:00:00",
                end_date: null,
                classification: null,
                bucket: "unrecognized",
                isAlumni: false,
                profileHref: "/researchers/10001",
                fellowships: [],
            },
            {
                person_id: 9999,
                person_name: "Pessoa Externa",
                roles: ["Student"],
                start_date: "2024-01-01T00:00:00",
                end_date: "2024-12-31T00:00:00",
                classification: "unknown",
                bucket: "unrecognized",
                isAlumni: true,
                profileHref: null,
                fellowships: [],
            },
        ]);
    });

    it("attaches fellowship information to the matching project member", () => {
        const team: TeamMember[] = [
            {
                person_id: 516,
                person_name: "Pablo France Salarolli",
                roles: ["Researcher"],
                start_date: "2023-09-01T00:00:00",
                end_date: null,
            },
        ];

        const researchers: Researcher[] = [
            {
                id: "516",
                name: "Pablo France Salarolli",
                classification: "student",
                initiatives: [],
                research_groups: [],
                knowledge_areas: [],
                academic_education: [],
                articles: [],
                advisorships: [],
            },
        ];

        expect(
            resolveProjectTeamMembers(team, researchers, "/horizon_dashboard/", {
                id: "8",
                advisorships: [
                    {
                        id: "510",
                        person_id: 516,
                        person_name: "Pablo France Salarolli",
                        fellowship: {
                            id: 5,
                            name: "PIBIC",
                            sponsor_name: "CNPq",
                            value: 400,
                        },
                    },
                    {
                        id: "511",
                        person_id: 516,
                        person_name: "Pablo France Salarolli",
                        fellowship: {
                            id: 5,
                            name: "PIBIC",
                            sponsor_name: "CNPq",
                            value: 400,
                        },
                    },
                ],
            }),
        ).toEqual([
            {
                person_id: 516,
                person_name: "Pablo France Salarolli",
                roles: ["Researcher"],
                start_date: "2023-09-01T00:00:00",
                end_date: null,
                classification: "student",
                bucket: "student",
                isAlumni: false,
                profileHref: "/horizon_dashboard/students/516",
                fellowships: [
                    {
                        id: "5",
                        name: "PIBIC",
                        sponsorName: "CNPq",
                        value: 400,
                    },
                ],
            },
        ]);
    });
});
