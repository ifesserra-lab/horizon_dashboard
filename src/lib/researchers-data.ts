import type { Researcher } from "../types/researchers";

export interface ResearcherStats {
    projects: number;
    articles: number;
    advisorships: number;
    advisorshipsByType: Record<string, number>;
    isSupervisor: boolean;
    isStudent: boolean;
}

const degreeHierarchy: Record<string, number> = {
    Doutorado: 4,
    Mestrado: 3,
    Especialização: 2,
    Graduação: 1,
};

export const getHighestAcademicDegree = (
    education: Researcher["academic_education"],
) => {
    if (!education.length) {
        return null;
    }

    return [...education].sort(
        (current, next) =>
            (degreeHierarchy[next.degree] || 0) -
            (degreeHierarchy[current.degree] || 0),
    )[0].degree;
};

export const buildResearcherStatsById = (
    researchers: Researcher[],
): Record<string, ResearcherStats> =>
    researchers.reduce<Record<string, ResearcherStats>>((acc, researcher) => {
        const advisorships = researcher.advisorships || [];
        const advisorshipsByType = advisorships.reduce<Record<string, number>>(
            (types, advisorship) => {
                const type = advisorship.type || "Other";
                types[type] = (types[type] || 0) + 1;
                return types;
            },
            {},
        );

        acc[researcher.id] = {
            projects: researcher.initiatives.length,
            articles: researcher.articles.length,
            advisorships: advisorships.length,
            advisorshipsByType,
            isSupervisor: advisorships.length > 0,
            isStudent:
                researcher.classification === "student" ||
                researcher.was_student === true,
        };

        return acc;
    }, {});
