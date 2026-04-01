export interface CampusFilterChangeDetail {
    campusId?: string | null;
    campus?: string | null;
}

export const getCampusFilterValue = (
    source:
        | string
        | null
        | undefined
        | CampusFilterChangeDetail
        | CustomEvent<CampusFilterChangeDetail>,
) => {
    if (typeof source === "string") {
        return source.trim();
    }

    if (!source) {
        return "";
    }

    const detail =
        typeof source === "object" && "detail" in source ? source.detail : source;

    return String(detail?.campusId || detail?.campus || "").trim();
};

export const splitPipeValues = (value: string | null | undefined): string[] =>
    String(value ?? "")
        .split("|")
        .map((item) => item.trim())
        .filter(Boolean);

export const updateCampusViews = (
    selector: string,
    selectedCampusId: string,
) => {
    document.querySelectorAll(selector).forEach((node) => {
        const viewCampus = node.getAttribute("data-campus-view") || "";
        node.classList.toggle("hidden", viewCampus !== selectedCampusId);
    });
};
