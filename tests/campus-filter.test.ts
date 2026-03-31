import { describe, expect, it } from "vitest";
import researchersData from "../src/data/researchers_canonical.json";
import initiativesData from "../src/data/initiatives_canonical.json";
import advisorshipsData from "../src/data/advisorships_canonical.json";
import type { Researcher } from "../src/types/researchers";
import type { Project } from "../src/types/projects";
import type { ProjectAdvisorship } from "../src/types/advisorships";
import {
    buildAdvisorshipDashboard,
    buildProjectMart,
    getAdvisorshipItemCampusIds,
    getAdvisorshipProjectsByCampusId,
    getCampusIdsFromNames,
    getProjectCampusIds,
    getProjectsByCampusId,
    getRealCampuses,
    getResearcherCampusIds,
    resolveCampusId,
} from "../src/lib/tenant-data";
import {
    getAggregatedPublications,
    getCampusPublicationViews,
    getPublicationsByCampusId,
} from "../src/lib/publications-data";

const researchers = researchersData as Researcher[];
const projects = initiativesData as Project[];
const advisorshipProjects = advisorshipsData as ProjectAdvisorship[];
const campusIds = getRealCampuses().map((campus) => campus.id);

const getNonMatchingCampusId = (selectedIds: string[]) =>
    campusIds.find((campusId) => !selectedIds.includes(campusId)) || "999";

const matchesCampus = (selectedCampusId: string, itemCampusIds: string[]) =>
    !selectedCampusId || itemCampusIds.includes(selectedCampusId);

describe("Campus filter normalization", () => {
    it("normalizes id, slug, and name to the canonical campus id", () => {
        expect(resolveCampusId("6")).toBe("6");
        expect(resolveCampusId("serra")).toBe("6");
        expect(resolveCampusId("Serra")).toBe("6");
    });

    it("maps campus names from mart data to campus ids", () => {
        expect(getCampusIdsFromNames(["Serra", "Vitória", "Serra"])).toEqual([
            "6",
            "2",
        ]);
    });
});

describe("Campus predicates use campus ids", () => {
    it("filters researchers by campus id", () => {
        const researcher = researchers.find((item) =>
            getResearcherCampusIds(item).includes("6"),
        );

        expect(researcher).toBeDefined();

        const researcherCampusIds = getResearcherCampusIds(researcher!);
        expect(matchesCampus("6", researcherCampusIds)).toBe(true);
        expect(
            matchesCampus(
                getNonMatchingCampusId(researcherCampusIds),
                researcherCampusIds,
            ),
        ).toBe(false);
    });

    it("filters projects by campus id", () => {
        const project = projects.find((item) =>
            getProjectCampusIds(item).includes("6"),
        );

        expect(project).toBeDefined();

        const projectCampusIds = getProjectCampusIds(project!);
        expect(matchesCampus("6", projectCampusIds)).toBe(true);
        expect(
            matchesCampus(
                getNonMatchingCampusId(projectCampusIds),
                projectCampusIds,
            ),
        ).toBe(false);
    });

    it("filters advisorship items by campus id", () => {
        const advisorship = advisorshipProjects
            .flatMap((project) => project.advisorships || [])
            .find((item) => getAdvisorshipItemCampusIds(item).includes("6"));

        expect(advisorship).toBeDefined();

        const advisorshipCampusIds = getAdvisorshipItemCampusIds(advisorship!);
        expect(matchesCampus("6", advisorshipCampusIds)).toBe(true);
        expect(
            matchesCampus(
                getNonMatchingCampusId(advisorshipCampusIds),
                advisorshipCampusIds,
            ),
        ).toBe(false);
    });
});

describe("Campus dashboards remain keyed by id", () => {
    it("builds project summaries by campus id", () => {
        const campusProjects = getProjectsByCampusId("6");
        const mart = buildProjectMart(campusProjects);

        expect(mart.summary.total_projects).toBe(campusProjects.length);
    });

    it("builds advisorship summaries by campus id", () => {
        const campusProjects = getAdvisorshipProjectsByCampusId("6");
        const dashboard = buildAdvisorshipDashboard(campusProjects);
        const expectedTotal = campusProjects.flatMap(
            (project) => project.advisorships || [],
        ).length;

        expect(dashboard.summary.total_advisorships).toBe(expectedTotal);
    });
});

describe("Publications use the canonical article campus", () => {
    it("keeps multi-author publications linked to a single canonical campus", () => {
        const publication = getAggregatedPublications().find(
            (item) => item.internal_authors_count > 1 && item.campus_id,
        );
        const publicationId = String(publication?.id || "");
        const nonMatchingCampusId = getNonMatchingCampusId([
            publication?.campus_id || "",
        ]);

        expect(publication).toBeDefined();
        expect(publication?.internal_authors_count).toBeGreaterThan(1);
        expect(publication?.campus_id).not.toBe("");
        expect(publication?.campus_name).not.toBe("");
        expect(
            getPublicationsByCampusId(publication?.campus_id || "").some(
                (item) => String(item.id) === publicationId,
            ),
        ).toBe(true);
        expect(
            getPublicationsByCampusId(nonMatchingCampusId).some(
                (item) => String(item.id) === publicationId,
            ),
        ).toBe(false);
    });

    it("builds publication views keyed by campus id", () => {
        const campusViews = getCampusPublicationViews();

        expect(Object.keys(campusViews)).toContain("6");
        expect(campusViews["6"].summary.total_publications).toBe(
            getPublicationsByCampusId("6").length,
        );
    });
});
