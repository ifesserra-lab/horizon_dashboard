import type { TeamMember } from "../types/projects";
import type { Researcher } from "../types/researchers";

export type ProjectTeamBucket =
    | "student"
    | "researcher"
    | "outside_ifes"
    | "unrecognized";

export interface ResolvedProjectTeamMember extends TeamMember {
    classification: Researcher["classification"] | "unknown";
    bucket: ProjectTeamBucket;
    isAlumni: boolean;
    profileHref: string | null;
    fellowships: ProjectTeamMemberFellowship[];
}

interface CanonicalProjectAdvisorshipItem {
    id: string | number;
    person_id?: string | number | null;
    person_name?: string | null;
    fellowship?: {
        id: string | number;
        name: string;
        sponsor_name?: string | null;
        value?: number | null;
    } | null;
}

export interface CanonicalProjectAdvisorshipRecord {
    id: string | number;
    advisorships?: CanonicalProjectAdvisorshipItem[] | null;
}

export interface ProjectTeamMemberFellowship {
    id: string;
    name: string;
    sponsorName: string | null;
    value: number | null;
}

const normalizeName = (value: string) =>
    value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();

const normalizeBaseUrl = (baseUrl: string) =>
    baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;

const isAlumniMember = (endDate: string | null | undefined) =>
    Boolean(endDate && endDate !== "None" && endDate !== "null");

const getBucketFromClassification = (
    classification: Researcher["classification"] | undefined,
): ProjectTeamBucket =>
    classification === "student" ||
    classification === "researcher" ||
    classification === "outside_ifes"
        ? classification
        : "unrecognized";

const getMemberFellowships = (
    member: TeamMember,
    advisorshipProject?: CanonicalProjectAdvisorshipRecord | null,
) => {
    const fellowshipMap = new Map<string, ProjectTeamMemberFellowship>();

    (advisorshipProject?.advisorships ?? []).forEach((advisorship) => {
        const matchesById =
            advisorship.person_id !== undefined &&
            advisorship.person_id !== null &&
            String(advisorship.person_id) === String(member.person_id);
        const matchesByName =
            Boolean(advisorship.person_name?.trim()) &&
            normalizeName(advisorship.person_name!) ===
                normalizeName(member.person_name);

        if ((!matchesById && !matchesByName) || !advisorship.fellowship) {
            return;
        }

        const fellowshipKey =
            advisorship.fellowship.id !== undefined &&
            advisorship.fellowship.id !== null
                ? String(advisorship.fellowship.id)
                : `${advisorship.fellowship.name}-${advisorship.fellowship.sponsor_name ?? ""}`;

        if (!fellowshipMap.has(fellowshipKey)) {
            fellowshipMap.set(fellowshipKey, {
                id: fellowshipKey,
                name: advisorship.fellowship.name,
                sponsorName: advisorship.fellowship.sponsor_name ?? null,
                value:
                    advisorship.fellowship.value !== undefined &&
                    advisorship.fellowship.value !== null
                        ? advisorship.fellowship.value
                        : null,
            });
        }
    });

    return [...fellowshipMap.values()].sort((current, next) =>
        current.name.localeCompare(next.name),
    );
};

export const resolveProjectTeamMembers = (
    team: TeamMember[] = [],
    researchers: Researcher[] = [],
    baseUrl = "/",
    advisorshipProject?: CanonicalProjectAdvisorshipRecord | null,
): ResolvedProjectTeamMember[] => {
    const normalizedBaseUrl = normalizeBaseUrl(baseUrl);
    const researchersById = new Map(
        researchers.map((researcher) => [String(researcher.id), researcher]),
    );
    const researchersByName = new Map(
        researchers.map((researcher) => [normalizeName(researcher.name), researcher]),
    );

    return [...team]
        .map((member) => {
            const matchedResearcher =
                researchersById.get(String(member.person_id)) ??
                researchersByName.get(normalizeName(member.person_name));

            return {
                ...member,
                classification: matchedResearcher
                    ? matchedResearcher.classification ?? null
                    : "unknown",
                bucket: getBucketFromClassification(
                    matchedResearcher?.classification,
                ),
                isAlumni: isAlumniMember(member.end_date),
                profileHref: matchedResearcher
                    ? `${normalizedBaseUrl}${matchedResearcher.classification === "student" ? "students" : "researchers"}/${matchedResearcher.id}`
                    : null,
                fellowships: getMemberFellowships(member, advisorshipProject),
            };
        })
        .sort((current, next) => {
            if (current.isAlumni !== next.isAlumni) {
                return Number(current.isAlumni) - Number(next.isAlumni);
            }

            return current.person_name.localeCompare(next.person_name);
        });
};
