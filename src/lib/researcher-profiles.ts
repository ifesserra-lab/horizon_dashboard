import type { Researcher, ResearcherInitiative } from "../types/researchers";

interface CanonicalInitiativeType {
    id: string | number;
    name: string;
}

interface CanonicalInitiativeTeamMember {
    person_id?: string | number | null;
    person_name?: string | null;
    roles?: string[] | null;
}

export interface CanonicalInitiativeRecord {
    id: string | number;
    name?: string;
    start_date?: string | null;
    end_date?: string | null;
    initiative_type?: CanonicalInitiativeType | null;
    team?: CanonicalInitiativeTeamMember[] | null;
}

type StudentAdvisorSource =
    | "initiative_team"
    | "fellowship_supervision"
    | "academic_education";

export interface StudentAdvisor {
    id: string;
    name: string;
    relatedInitiatives: Array<{
        id: string;
        name: string;
        startDate: string | null;
        endDate: string | null;
    }>;
    sources: StudentAdvisorSource[];
}

interface CanonicalAdvisorshipCampus {
    id: string | number;
    name: string;
}

interface CanonicalAdvisorshipFellowship {
    id: string | number;
    name: string;
    description?: string | null;
    value?: number | null;
    sponsor_name?: string | null;
}

interface CanonicalAdvisorshipItemRecord {
    id: string | number;
    name: string;
    status?: string | null;
    description?: string | null;
    start_date?: string | null;
    end_date?: string | null;
    person_id?: string | number | null;
    person_name?: string | null;
    supervisor_id?: string | number | null;
    supervisor_name?: string | null;
    campus?: CanonicalAdvisorshipCampus | null;
    fellowship?: CanonicalAdvisorshipFellowship | null;
}

export interface CanonicalAdvisorshipProjectRecord {
    id: string | number;
    name: string;
    advisorships?: CanonicalAdvisorshipItemRecord[] | null;
}

export interface StudentFellowship {
    id: string;
    name: string;
    status: string | null;
    description: string | null;
    startDate: string | null;
    endDate: string | null;
    projectId: string;
    projectName: string;
    projectStartDate: string | null;
    projectEndDate: string | null;
    supervisorId: string | null;
    supervisorName: string | null;
    campusName: string | null;
    fellowship: {
        id: string;
        name: string;
        description: string | null;
        value: number | null;
        sponsorName: string | null;
    };
}

const advisorRoles = new Set(["Coordinator", "Supervisor"]);

const normalizeName = (value: string) =>
    value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();

const isFilledName = (value: string | null | undefined) => {
    const normalizedValue = value?.trim();
    return Boolean(normalizedValue && normalizedValue !== "None");
};

const getInitiativeById = (initiatives: CanonicalInitiativeRecord[]) =>
    new Map(
        initiatives.map((initiative) => [String(initiative.id), initiative]),
    );

const parseSortableDate = (value: string | null | undefined) => {
    if (!value) return 0;
    return new Date(value.replace(" ", "T")).getTime();
};

export const enrichResearcherInitiatives = (
    researcher: Researcher,
    canonicalInitiatives: CanonicalInitiativeRecord[],
): ResearcherInitiative[] => {
    const initiativesById = getInitiativeById(canonicalInitiatives);

    return researcher.initiatives.map((initiative) => {
        const fullInitiative = initiativesById.get(String(initiative.id));
        const hasCanonicalStartDate = Object.prototype.hasOwnProperty.call(
            fullInitiative ?? {},
            "start_date",
        );
        const hasCanonicalEndDate = Object.prototype.hasOwnProperty.call(
            fullInitiative ?? {},
            "end_date",
        );

        return {
            ...initiative,
            start_date: hasCanonicalStartDate
                ? fullInitiative?.start_date
                : initiative.start_date,
            end_date: hasCanonicalEndDate
                ? fullInitiative?.end_date
                : initiative.end_date,
            initiative_type:
                fullInitiative?.initiative_type ?? initiative.initiative_type,
        };
    });
};

export const getStudentAdvisors = (
    researcher: Researcher,
    canonicalInitiatives: CanonicalInitiativeRecord[],
    canonicalAdvisorshipProjects: CanonicalAdvisorshipProjectRecord[] = [],
): StudentAdvisor[] => {
    const initiativesById = getInitiativeById(canonicalInitiatives);
    const advisorsById = new Map<string, StudentAdvisor>();

    const appendAdvisor = ({
        advisorId,
        advisorName,
        source,
        relatedInitiative,
    }: {
        advisorId: string;
        advisorName: string;
        source: StudentAdvisorSource;
        relatedInitiative?:
            | {
                  id: string;
                  name: string;
                  startDate: string | null;
                  endDate: string | null;
              }
            | undefined;
    }) => {
        const existingAdvisorByName = [...advisorsById.values()].find(
            (advisor) => normalizeName(advisor.name) === normalizeName(advisorName),
        );
        const stableAdvisorId = existingAdvisorByName?.id ?? advisorId;
        const existingAdvisor = existingAdvisorByName ??
            advisorsById.get(stableAdvisorId) ?? {
                id: stableAdvisorId,
                name: advisorName,
                relatedInitiatives: [],
                sources: [],
            };

        if (!existingAdvisor.sources.includes(source)) {
            existingAdvisor.sources.push(source);
        }

        if (
            relatedInitiative &&
            !existingAdvisor.relatedInitiatives.some(
                (initiative) => initiative.id === relatedInitiative.id,
            )
        ) {
            existingAdvisor.relatedInitiatives.push(relatedInitiative);
        }

        advisorsById.set(stableAdvisorId, existingAdvisor);
    };

    researcher.initiatives.forEach((initiativeRef) => {
        const fullInitiative = initiativesById.get(String(initiativeRef.id));

        (fullInitiative?.team ?? []).forEach((member) => {
            const memberRoles = member.roles ?? [];
            if (!memberRoles.some((role) => advisorRoles.has(role))) {
                return;
            }

            if (!isFilledName(member.person_name)) {
                return;
            }

            appendAdvisor({
                advisorId: String(member.person_id ?? member.person_name),
                advisorName: member.person_name!.trim(),
                source: "initiative_team",
                relatedInitiative: {
                    id: String(fullInitiative.id),
                    name:
                        fullInitiative.name ||
                        initiativeRef.name ||
                        "Iniciativa sem nome",
                    startDate: fullInitiative?.start_date ?? null,
                    endDate: fullInitiative?.end_date ?? null,
                },
            });
        });
    });

    canonicalAdvisorshipProjects.forEach((project) => {
        (project.advisorships ?? []).forEach((advisorship) => {
            const matchesById =
                advisorship.person_id !== undefined &&
                advisorship.person_id !== null &&
                String(advisorship.person_id) === String(researcher.id);
            const matchesByName =
                isFilledName(advisorship.person_name) &&
                normalizeName(advisorship.person_name!) ===
                    normalizeName(researcher.name);

            if (!matchesById && !matchesByName) {
                return;
            }

            if (!advisorship.fellowship || !isFilledName(advisorship.supervisor_name)) {
                return;
            }

            appendAdvisor({
                advisorId: String(
                    advisorship.supervisor_id ?? advisorship.supervisor_name,
                ),
                advisorName: advisorship.supervisor_name!.trim(),
                source: "fellowship_supervision",
                relatedInitiative: {
                    id: String(project.id),
                    name: project.name || advisorship.name,
                    startDate:
                        initiativesById.get(String(project.id))?.start_date ?? null,
                    endDate:
                        initiativesById.get(String(project.id))?.end_date ?? null,
                },
            });
        });
    });

    researcher.academic_education.forEach((education, index) => {
        if (isFilledName(education.advisor_name)) {
            appendAdvisor({
                advisorId: `education-advisor-${index}-${education.advisor_name.trim()}`,
                advisorName: education.advisor_name.trim(),
                source: "academic_education",
            });
        }

        if (isFilledName(education.co_advisor_name)) {
            appendAdvisor({
                advisorId: `education-co-advisor-${index}-${education.co_advisor_name!.trim()}`,
                advisorName: education.co_advisor_name!.trim(),
                source: "academic_education",
            });
        }
    });

    return [...advisorsById.values()]
        .map((advisor) => ({
            ...advisor,
            relatedInitiatives: [...advisor.relatedInitiatives].sort((a, b) =>
                a.name.localeCompare(b.name),
            ),
            sources: [...advisor.sources].sort(),
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
};

export const getStudentFellowships = (
    researcher: Researcher,
    canonicalAdvisorshipProjects: CanonicalAdvisorshipProjectRecord[],
    canonicalInitiatives: CanonicalInitiativeRecord[] = [],
): StudentFellowship[] => {
    const initiativesById = getInitiativeById(canonicalInitiatives);
    const fellowshipsById = new Map<string, StudentFellowship>();

    canonicalAdvisorshipProjects.forEach((project) => {
        (project.advisorships ?? []).forEach((advisorship) => {
            const matchesById =
                advisorship.person_id !== undefined &&
                advisorship.person_id !== null &&
                String(advisorship.person_id) === String(researcher.id);
            const matchesByName =
                isFilledName(advisorship.person_name) &&
                normalizeName(advisorship.person_name!) ===
                    normalizeName(researcher.name);

            if (!matchesById && !matchesByName) {
                return;
            }

            if (!advisorship.fellowship) {
                return;
            }

            const canonicalProject = initiativesById.get(String(project.id));

            fellowshipsById.set(String(advisorship.id), {
                id: String(advisorship.id),
                name: advisorship.name,
                status: advisorship.status ?? null,
                description: advisorship.description ?? null,
                startDate: advisorship.start_date ?? null,
                endDate: advisorship.end_date ?? null,
                projectId: String(project.id),
                projectName: project.name,
                projectStartDate: canonicalProject?.start_date ?? null,
                projectEndDate: canonicalProject?.end_date ?? null,
                supervisorId:
                    advisorship.supervisor_id !== undefined &&
                    advisorship.supervisor_id !== null
                        ? String(advisorship.supervisor_id)
                        : null,
                supervisorName: advisorship.supervisor_name ?? null,
                campusName: advisorship.campus?.name ?? null,
                fellowship: {
                    id: String(advisorship.fellowship.id),
                    name: advisorship.fellowship.name,
                    description: advisorship.fellowship.description ?? null,
                    value:
                        advisorship.fellowship.value !== undefined &&
                        advisorship.fellowship.value !== null
                            ? advisorship.fellowship.value
                            : null,
                    sponsorName: advisorship.fellowship.sponsor_name ?? null,
                },
            });
        });
    });

    return [...fellowshipsById.values()].sort((current, next) => {
        const currentActive = current.status?.toLowerCase() === "active";
        const nextActive = next.status?.toLowerCase() === "active";
        if (currentActive && !nextActive) return -1;
        if (!currentActive && nextActive) return 1;

        return (
            parseSortableDate(next.startDate) - parseSortableDate(current.startDate)
        );
    });
};
