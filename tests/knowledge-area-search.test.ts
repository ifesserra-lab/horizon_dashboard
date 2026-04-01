import { describe, expect, it } from "vitest";
import { getKnowledgeAreasView } from "../src/lib/tenant-data";
import { buildSearchIndex, normalizeSearchText } from "../src/lib/search";

const matchesAreaQuery = (query: string) =>
    getKnowledgeAreasView().some((area) =>
        buildSearchIndex([
            area.area_name,
            ...area.campuses,
            ...area.groups.map((group) => group.name),
        ]).includes(normalizeSearchText(query)),
    );

describe("Knowledge area search normalization", () => {
    it("matches area names even when the query omits accents", () => {
        expect(matchesAreaQuery("educacao")).toBe(true);
        expect(matchesAreaQuery("mecanica")).toBe(true);
    });

    it("matches campus and group names without requiring accents", () => {
        expect(matchesAreaQuery("vitoria")).toBe(true);
        expect(matchesAreaQuery("popularizacao")).toBe(true);
    });
});
