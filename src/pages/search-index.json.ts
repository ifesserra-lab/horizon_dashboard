// Build-time search index. Astro emits this as /search-index.json (under the
// site base). It ships only the fields needed to search and render result
// cards — never the 20 MB canonical files — so the home search stays fully
// client-side on GitHub Pages (no backend).

import researchers from "../data/researchers_canonical.json";
import students from "../data/students_canonical.json";
import groups from "../data/research_groups_canonical.json";
import initiatives from "../data/initiatives_canonical.json";
import articles from "../data/articles_canonical.json";

export const prerender = true;

type Entry = Record<string, unknown>;

const names = (list: any): string[] =>
    Array.isArray(list)
        ? list.map((x) => x?.name).filter((n): n is string => Boolean(n))
        : [];

function personEntry(p: any, type: "pesquisador" | "aluno"): Entry {
    const areas = names(p.knowledge_areas).slice(0, 6);
    const grp = names(p.research_groups).slice(0, 4);
    return {
        i: String(p.id),
        t: type,
        n: p.name ?? "",
        c: p.campus?.name ?? null,
        a: areas,
        g: grp,
        na: Array.isArray(p.articles) ? p.articles.length : 0,
        ni: Array.isArray(p.initiatives) ? p.initiatives.length : 0,
    };
}

function groupEntry(g: any): Entry {
    return {
        i: String(g.id),
        t: "grupo",
        n: g.name?.trim() ?? "",
        c: g.campus?.name ?? null,
        a: names(g.knowledge_areas).slice(0, 8),
        l: names(g.leaders).slice(0, 3),
        nm: Array.isArray(g.members) ? g.members.length : 0,
    };
}

function initiativeEntry(i: any): Entry {
    return {
        i: String(i.id),
        t: "projeto",
        n: i.name?.trim() ?? "",
        c: i.campus?.name ?? null,
        a: names(i.knowledge_areas).slice(0, 6),
        st: i.status ?? null,
        team: names(i.team).slice(0, 6),
    };
}

function articleEntry(a: any): Entry {
    return {
        i: String(a.id),
        t: "publicacao",
        n: a.title ?? "",
        v: a.journal_conference ?? null,
        y: a.year ?? null,
        pt: a.type ?? null,
    };
}

export function GET() {
    const entries: Entry[] = [
        ...(researchers as any[]).map((p) => personEntry(p, "pesquisador")),
        ...(students as any[]).map((p) => personEntry(p, "aluno")),
        ...(groups as any[]).map(groupEntry),
        ...(initiatives as any[]).map(initiativeEntry),
        ...(articles as any[]).map(articleEntry),
    ];

    return new Response(JSON.stringify(entries), {
        headers: { "content-type": "application/json; charset=utf-8" },
    });
}
