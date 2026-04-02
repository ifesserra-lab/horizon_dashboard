import { describe, expect, it } from "vitest";
import {
    allResearchers,
    outsideIfesResearchers,
    researcherCollectionCounts,
    researchersOnly,
    studentsResearchers,
    unrecognizedResearchers,
} from "../src/lib/researcher-collections";

describe("Researcher collections", () => {
    it("keeps split canonical exports aligned with the combined dataset", () => {
        expect(researchersOnly.every((person) => person.classification === "researcher")).toBe(true);
        expect(studentsResearchers.every((person) => person.classification === "student")).toBe(true);
        expect(
            outsideIfesResearchers.every(
                (person) => person.classification === "outside_ifes",
            ),
        ).toBe(true);
        expect(unrecognizedResearchers.every((person) => person.classification === null)).toBe(true);

        expect(researcherCollectionCounts.researchers).toBe(researchersOnly.length);
        expect(researcherCollectionCounts.students).toBe(studentsResearchers.length);
        expect(researcherCollectionCounts.outsideIfes).toBe(outsideIfesResearchers.length);
        expect(researcherCollectionCounts.unrecognized).toBe(unrecognizedResearchers.length);

        expect(
            researchersOnly.length +
                studentsResearchers.length +
                outsideIfesResearchers.length +
                unrecognizedResearchers.length,
        ).toBe(allResearchers.length);
    });
});
