export const normalizeSearchText = (
    value: string | number | null | undefined,
) =>
    String(value ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();

export const buildSearchIndex = (
    values: Array<string | number | null | undefined>,
) =>
    normalizeSearchText(
        values
            .filter((value) => String(value ?? "").trim() !== "")
            .join(" | "),
    );
