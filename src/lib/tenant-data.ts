import campusesCanonical from "../data/canonical/campuses_canonical.json";
import groupsCanonical from "../data/canonical/research_groups_canonical.json";
import researchersCanonical from "../data/canonical/researchers_canonical.json";
import initiativesCanonical from "../data/canonical/initiatives_canonical.json";
import advisorshipsCanonical from "../data/canonical/advisorships_canonical.json";
import knowledgeAreasMart from "../data/mart/knowledge_areas_mart.json";
import type { ResearchGroup } from "../types/groups";
import type { Researcher } from "../types/researchers";
import type { Project } from "../types/projects";
import type { AdvisorshipItem, ProjectAdvisorship } from "../types/advisorships";

export interface CampusRecord {
    id: string;
    name: string;
    slug: string;
}

const slugify = (value: string) =>
    value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

const normalizeComparable = (value: string | number | null | undefined) =>
    String(value ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();

const campuses = (campusesCanonical as { id: string; name: string }[]).map(
    (campus) => ({
        ...campus,
        slug: slugify(campus.name),
    }),
);

const groups = groupsCanonical as ResearchGroup[];
const researchers = researchersCanonical as Researcher[];
const projects = initiativesCanonical as any[];
const advisorshipProjects = advisorshipsCanonical as unknown as ProjectAdvisorship[];
const areas = knowledgeAreasMart as any[];
const researcherById = new Map(
    researchers.map((researcher) => [String(researcher.id), researcher]),
);
const researcherByNormalizedName = new Map(
    researchers.map((researcher) => [
        normalizeComparable(researcher.name),
        researcher,
    ]),
);
const researcherCampusSlugsById = new Map<string, string[]>();
const advisorshipCampusSlugCache = new Map<string, string[]>();

export const getRealCampuses = (): CampusRecord[] => campuses;

export const getRealCampusBySlug = (slug: string): CampusRecord | undefined =>
    campuses.find((campus) => campus.slug === slug);

const findResearcherByReference = ({
    id,
    name,
}: {
    id?: string | number | null;
    name?: string | null;
}) => {
    const normalizedName = normalizeComparable(name);

    if (id != null && id !== "") {
        const byId = researcherById.get(String(id));
        if (byId) return byId;
    }

    if (!normalizedName) {
        return undefined;
    }

    return researcherByNormalizedName.get(normalizedName);
};

export const getGroupsByCampusSlug = (slug: string): ResearchGroup[] => {
    const campus = getRealCampusBySlug(slug);
    if (!campus) return [];
    return groups.filter((group) => String(group.campus_id) === String(campus.id));
};

export const getResearchersByCampusSlug = (slug: string): Researcher[] => {
    const campusGroups = getGroupsByCampusSlug(slug);
    if (campusGroups.length === 0) return [];

    const campusGroupIds = new Set(campusGroups.map((group) => String(group.id)));
    return researchers.filter((researcher) =>
        (researcher.research_groups || []).some((group) =>
            campusGroupIds.has(String(group.id)),
        ),
    );
};

export const getProjectsByCampusSlug = (slug: string): Project[] => {
    const campusGroups = getGroupsByCampusSlug(slug);
    const campusResearchers = getResearchersByCampusSlug(slug);

    if (campusGroups.length === 0) return [];

    const campusGroupIds = new Set(campusGroups.map((group) => String(group.id)));
    const campusResearcherIds = new Set(
        campusResearchers.map((researcher) => String(researcher.id)),
    );
    const campusResearcherNames = new Set(
        campusResearchers.map((researcher) =>
            normalizeComparable(researcher.name),
        ),
    );

    return (projects as Project[]).filter((project: any) => {
        const byGroup =
            project.research_group &&
            project.research_group !== "None" &&
            campusGroupIds.has(String(project.research_group.id));

        const byTeam = (project.team || []).some((member: any) => {
            const memberId = String(member.person_id || member.id || "");
            const memberName = normalizeComparable(
                member.person_name || member.name || "",
            );
            return (
                campusResearcherIds.has(memberId) ||
                campusResearcherNames.has(memberName)
            );
        });

        return byGroup || byTeam;
    });
};

export const getAdvisorshipItemCampusSlugs = (
    advisorship: AdvisorshipItem,
): string[] => {
    const cacheKey = String(
        advisorship.id ||
            `${advisorship.supervisor_id}:${advisorship.student_id}:${advisorship.supervisor_name}:${advisorship.student_name}`,
    );
    const cached = advisorshipCampusSlugCache.get(cacheKey);

    if (cached) {
        return cached;
    }

    const matched = new Set<string>();

    [
        findResearcherByReference({
            id: advisorship.supervisor_id,
            name: advisorship.supervisor_name,
        }),
        findResearcherByReference({
            id: advisorship.student_id,
            name: advisorship.student_name,
        }),
    ]
        .filter(Boolean)
        .forEach((researcher) => {
            getResearcherCampusSlugs(researcher as Researcher).forEach((campusSlug) =>
                matched.add(campusSlug),
            );
        });

    const campusSlugs = [...matched];
    advisorshipCampusSlugCache.set(cacheKey, campusSlugs);
    return campusSlugs;
};

export const getAdvisorshipProjectsByCampusSlug = (
    slug: string,
): ProjectAdvisorship[] => {
    return advisorshipProjects
        .map((project) => {
            const advisorships = (project.advisorships || []).filter((advisorship) =>
                getAdvisorshipItemCampusSlugs(advisorship).includes(slug),
            );

            if (advisorships.length === 0) {
                return null;
            }

            return {
                ...project,
                advisorships,
            };
        })
        .filter(Boolean) as ProjectAdvisorship[];
};

export const getKnowledgeAreasByCampusSlug = (slug: string) => {
    const campus = getRealCampusBySlug(slug);
    if (!campus) return [];
    return areas.filter((area) =>
        (area.campuses || []).includes(campus.name),
    );
};

export const getResearcherCampusSlugs = (researcher: Researcher): string[] => {
    const cacheKey = String(researcher.id);
    const cached = researcherCampusSlugsById.get(cacheKey);

    if (cached) {
        return cached;
    }

    const campusGroupIds = new Set(
        (researcher.research_groups || []).map((group) => String(group.id)),
    );
    const matchedCampuses = groups
        .filter((group) => campusGroupIds.has(String(group.id)))
        .map((group) => slugify(group.campus.name));
    const campusSlugs = [...new Set(matchedCampuses)];
    researcherCampusSlugsById.set(cacheKey, campusSlugs);
    return campusSlugs;
};

export const getProjectCampusSlugs = (project: any): string[] => {
    const matched = new Set<string>();

    if (project.research_group && project.research_group !== "None") {
        const group = groups.find(
            (item) => String(item.id) === String(project.research_group.id),
        );
        if (group) matched.add(slugify(group.campus.name));
    }

    (project.team || []).forEach((member: any) => {
        const researcher = findResearcherByReference({
            id: member.person_id || member.id,
            name: member.person_name || member.name,
        });
        if (!researcher) return;
        getResearcherCampusSlugs(researcher).forEach((slug) => matched.add(slug));
    });

    return [...matched];
};

export const getAdvisorshipCampusSlugs = (project: ProjectAdvisorship): string[] => {
    const matched = new Set<string>();

    (project.advisorships || []).forEach((advisorship) => {
        getAdvisorshipItemCampusSlugs(advisorship).forEach((slug) =>
            matched.add(slug),
        );
    });

    return [...matched];
};

export const buildProjectMart = (projectList: any[]) => {
    const totalProjects = projectList.length;
    const activeProjects = projectList.filter(
        (project) => String(project.status).toLowerCase() === "active",
    ).length;

    const researcherSet = new Set<string>();
    const studentSet = new Set<string>();
    const participantSet = new Set<string>();
    const years = new Set<number>();
    const knowledgeAreaCounts: Record<string, number> = {};

    projectList.forEach((project) => {
        const startYear = project.start_date
            ? new Date(project.start_date).getFullYear()
            : null;
        const endYear =
            project.end_date && project.end_date !== "None"
                ? new Date(project.end_date).getFullYear()
                : null;

        if (startYear) years.add(startYear);
        if (endYear) years.add(endYear);

        (project.team || []).forEach((member: any) => {
            const name = String(member.person_name || member.name || "");
            if (!name) return;
            participantSet.add(name);
            const roles = member.roles || [member.role].filter(Boolean);
            if (roles.some((role: string) => /student/i.test(role))) {
                studentSet.add(name);
            } else {
                researcherSet.add(name);
            }
        });

        (project.knowledge_areas || []).forEach((area: any) => {
            const name = area.name || area.area_name;
            if (!name) return;
            knowledgeAreaCounts[name] = (knowledgeAreaCounts[name] || 0) + 1;
        });
    });

    const yearList = [...years].sort((a, b) => a - b);
    const evolution = yearList.map((year) => ({
        year,
        start: projectList.filter(
            (project) =>
                project.start_date &&
                new Date(project.start_date).getFullYear() === year,
        ).length,
        end: projectList.filter(
            (project) =>
                project.end_date &&
                project.end_date !== "None" &&
                new Date(project.end_date).getFullYear() === year,
        ).length,
        researchers: researcherSet.size,
        students: studentSet.size,
    }));

    return {
        summary: {
            total_projects: totalProjects,
            active_projects: activeProjects,
            total_participants: participantSet.size,
        },
        team_composition: {
            researchers: researcherSet.size,
            students: studentSet.size,
        },
        evolution,
        knowledge_areas: Object.entries(knowledgeAreaCounts).map(
            ([name, count]) => ({
                name,
                count,
            }),
        ),
    };
};

export const buildAdvisorshipDashboard = (projectList: ProjectAdvisorship[]) => {
    const allAdvisorships = projectList
        .flatMap((project) =>
            (project.advisorships || []).map((advisorship) => ({
                ...advisorship,
                projectName: project.name,
            })),
        )
        .filter(Boolean);

    const uniqueFellowships = [
        ...new Set(
            allAdvisorships
                .map((item) => item.fellowship?.name)
                .filter(Boolean) as string[],
        ),
    ].sort();

    const uniqueStudents = new Set(
        allAdvisorships.map((item) => item.student_id),
    ).size;
    const uniqueSupervisors = new Set(
        allAdvisorships.map((item) => item.supervisor_id),
    ).size;
    const activeAdvisorships = allAdvisorships.filter(
        (item) => item.status?.toLowerCase() === "active",
    ).length;
    const concludedAdvisorships = allAdvisorships.filter(
        (item) => item.status?.toLowerCase() === "concluded",
    ).length;
    const fellowshipsCount = allAdvisorships.filter(
        (item) => item.fellowship && item.fellowship.name,
    ).length;

    const summary = {
        total_advisorships: allAdvisorships.length,
        active_advisorships: activeAdvisorships,
        concluded_advisorships: concludedAdvisorships,
        total_fellowships: fellowshipsCount,
        unique_students: uniqueStudents,
        unique_supervisors: uniqueSupervisors,
    };

    const statusColors = {
        active: "var(--color-premium-accent, #38bdf8)",
        concluded: "var(--color-text-muted, #94a3b8)",
        unknown: "#f59e0b",
    };

    const statusCounts = allAdvisorships.reduce((acc: any, curr) => {
        const status = (curr.status || "unknown").toLowerCase();
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {});

    const statusDistribution = Object.entries(statusCounts).map(
        ([label, value]) => ({
            label: label.charAt(0).toUpperCase() + label.slice(1),
            value: value as number,
            color: statusColors[label as keyof typeof statusColors] || "#e2e8f0",
        }),
    );

    const fellowshipCounts = allAdvisorships
        .filter((item) => item.fellowship)
        .reduce((acc: any, curr) => {
            const name = curr.fellowship?.name || "Outras";
            acc[name] = (acc[name] || 0) + 1;
            return acc;
        }, {});

    const fellowshipColors = [
        "#0ea5e9",
        "#8b5cf6",
        "#ec4899",
        "#f59e0b",
        "#10b981",
        "#6366f1",
    ];

    const fellowshipDistribution = Object.entries(fellowshipCounts)
        .sort((a: any, b: any) => b[1] - a[1])
        .map(([label, value], index) => ({
            label,
            value: value as number,
            color: fellowshipColors[index % fellowshipColors.length],
        }));

    const supervisorCounts = allAdvisorships.reduce((acc: any, curr) => {
        const name = curr.supervisor_name;
        if (!name || name === "None") return acc;
        acc[name] = (acc[name] || 0) + 1;
        return acc;
    }, {});

    const topSupervisors = Object.entries(supervisorCounts)
        .sort((a: any, b: any) => b[1] - a[1])
        .slice(0, 10)
        .map(([name, count]) => ({
            name: name as string,
            count: count as number,
        }));

    const minYearCalculated = Math.min(
        ...allAdvisorships
            .map((item) =>
                item.start_date ? new Date(item.start_date).getFullYear() : 9999,
            )
            .filter((year) => year !== 9999),
    );
    const currentYear = new Date().getFullYear();
    const startYearLimit = currentYear - 9;
    const minYear = Math.max(minYearCalculated || currentYear, startYearLimit);
    const yearRange = Array.from(
        { length: currentYear - minYear + 1 },
        (_, index) => minYear + index,
    );

    const fellowshipEvolution = uniqueFellowships.map((fellowship, index) => ({
        label: fellowship,
        color: fellowshipColors[index % fellowshipColors.length],
        data: yearRange.map((year) => {
            const value = allAdvisorships.filter((item) => {
                if (item.fellowship?.name !== fellowship) return false;
                if (!item.start_date) return false;
                const start = new Date(item.start_date).getFullYear();
                const end = item.end_date
                    ? new Date(item.end_date).getFullYear()
                    : currentYear;
                return year >= start && year <= end;
            }).length;
            return { year, value };
        }),
    }));

    const fellowshipFinancialEvolution = uniqueFellowships.map(
        (fellowship, index) => ({
            label: fellowship,
            color: fellowshipColors[index % fellowshipColors.length],
            data: yearRange.map((year) => {
                const value = allAdvisorships
                    .filter((item) => {
                        if (item.fellowship?.name !== fellowship) return false;
                        if (!item.start_date) return false;
                        const start = new Date(item.start_date).getFullYear();
                        const end = item.end_date
                            ? new Date(item.end_date).getFullYear()
                            : currentYear;
                        return year >= start && year <= end;
                    })
                    .reduce(
                        (acc, curr) =>
                            acc + parseFloat(String(curr.fellowship?.value || "0")),
                        0,
                    );
                return { year, value };
            }),
        }),
    );

    return {
        summary,
        analytics: {
            status_distribution: statusDistribution,
            fellowship_distribution: fellowshipDistribution,
            fellowship_evolution: fellowshipEvolution,
            fellowship_financial_evolution: fellowshipFinancialEvolution,
            top_supervisors: topSupervisors,
        },
    };
};
