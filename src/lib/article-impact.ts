// Impacto por artigo (OpenAlex, casado por DOI). Gerado no ETL/enriquecimento;
// arquivo em src/data/articles_impact.json. Degrada bem se ausente.
import impact from "../data/articles_impact.json";

export interface ArticleImpact {
    openalex_id?: string;
    cited_by_count?: number | null;
    fwci?: number | null;
    oa_status?: string | null;
    is_oa?: boolean;
    oa_url?: string | null;
    topic?: string | null;
    type?: string | null;
    is_retracted?: boolean;
}

const items: Record<string, ArticleImpact> =
    ((impact as any)?.items as Record<string, ArticleImpact>) ?? {};

export const articlesImpactMeta: { generated_at?: string; matched?: number } =
    (impact as any)?.meta ?? {};

export function getArticleImpact(id: string | number): ArticleImpact | null {
    return items[String(id)] ?? null;
}

const OA_LABEL: Record<string, string> = {
    gold: "Acesso aberto (gold)",
    green: "Acesso aberto (green)",
    hybrid: "Acesso aberto (hybrid)",
    bronze: "Acesso aberto (bronze)",
    diamond: "Acesso aberto (diamond)",
    closed: "Acesso fechado",
};

export const oaLabel = (status?: string | null): string =>
    (status && OA_LABEL[status]) || (status ? `Acesso ${status}` : "");
