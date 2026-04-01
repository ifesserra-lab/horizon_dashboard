import { beforeEach, describe, expect, it } from "vitest";
import {
    getCampusFilterValue,
    splitPipeValues,
    updateCampusViews,
} from "../src/lib/campus-ui";

describe("Campus UI helpers", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    it("reads the selected campus from strings, details, and custom events", () => {
        expect(getCampusFilterValue("6")).toBe("6");
        expect(getCampusFilterValue({ campusId: "2" })).toBe("2");
        expect(getCampusFilterValue({ campus: "3" })).toBe("3");
        expect(
            getCampusFilterValue(
                new CustomEvent("campus-filter-change", {
                    detail: { campusId: "4" },
                }),
            ),
        ).toBe("4");
    });

    it("splits pipe-separated dataset values and ignores empty items", () => {
        expect(splitPipeValues("1|2|| 3 ")).toEqual(["1", "2", "3"]);
        expect(splitPipeValues("")).toEqual([]);
        expect(splitPipeValues(null)).toEqual([]);
    });

    it("toggles campus views based on the active campus id", () => {
        document.body.innerHTML = `
            <div id="views">
                <section data-campus-view=""></section>
                <section data-campus-view="1" class="hidden"></section>
                <section data-campus-view="2"></section>
            </div>
        `;

        updateCampusViews("#views [data-campus-view]", "1");

        const allView = document.querySelector('[data-campus-view=""]');
        const campusOneView = document.querySelector('[data-campus-view="1"]');
        const campusTwoView = document.querySelector('[data-campus-view="2"]');

        expect(allView?.classList.contains("hidden")).toBe(true);
        expect(campusOneView?.classList.contains("hidden")).toBe(false);
        expect(campusTwoView?.classList.contains("hidden")).toBe(true);
    });
});
