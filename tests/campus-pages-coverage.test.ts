import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const readFile = (relativePath: string) =>
    fs.readFileSync(path.join(rootDir, relativePath), "utf-8");

const allPages = [
    "src/pages/index.astro",
    "src/pages/projects/index.astro",
    "src/pages/projects/[id].astro",
    "src/pages/researchers/index.astro",
    "src/pages/researchers/[id].astro",
    "src/pages/groups/index.astro",
    "src/pages/groups/[id].astro",
    "src/pages/knowledge-areas/index.astro",
    "src/pages/advisorships/index.astro",
    "src/pages/advisorships/[id].astro",
    "src/pages/publications/index.astro",
    "src/pages/download/index.astro",
];

const campusAwarePages = [
    "src/pages/index.astro",
    "src/pages/projects/index.astro",
    "src/pages/researchers/index.astro",
    "src/pages/groups/index.astro",
    "src/pages/knowledge-areas/index.astro",
    "src/pages/advisorships/index.astro",
    "src/pages/publications/index.astro",
];

describe("Campus coverage across pages", () => {
    it("keeps every page on the shared Layout", () => {
        allPages.forEach((pagePath) => {
            const source = readFile(pagePath);
            expect(source).toContain('import Layout from');
            expect(source).toContain("<Layout");
        });
    });

    it("uses campus ids on every campus-aware page", () => {
        campusAwarePages.forEach((pagePath) => {
            const source = readFile(pagePath);
            expect(source).toContain("preferred-campus");
            expect(source).toMatch(/campusId|campusIds|data-campus-id/);
        });
    });

    it("does not leave deprecated slug-based campus attributes in pages", () => {
        allPages.forEach((pagePath) => {
            const source = readFile(pagePath);
            expect(source).not.toContain("data-campus-slug=");
            expect(source).not.toContain("data-campus-slugs=");
            expect(source).not.toContain("currentCampusSlug");
        });
    });
});
