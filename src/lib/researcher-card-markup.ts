import { buildSearchIndex } from "./search";
import { getHighestAcademicDegree, type ResearcherStats } from "./researchers-data";
import type { Researcher } from "../types/researchers";

export interface ResearcherCardView {
    id: string;
    name: string;
    initial: string;
    searchIndex: string;
    campusIds: string[];
    campusNames: string[];
    highestDegree: string | null;
    identificationLabel: string | null;
    citationName: string | null;
    knowledgeAreaNames: string[];
    projects: number;
    articles: number;
    advisorships: number;
    advisorshipsTooltip: string;
    isSupervisor: boolean;
    isStudent: boolean;
    cnpqUrl: string | null;
    scholarUrl: string | null;
    profileHref: string;
}

const MAX_VISIBLE_CAMPUSES = 2;
const MAX_VISIBLE_KNOWLEDGE_AREAS = 3;

const escapeHtml = (value: string | number | null | undefined) =>
    String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

const renderCampusPills = (campusNames: string[]) => {
    if (!campusNames.length) {
        return "";
    }

    const visibleCampusNames = campusNames.slice(0, MAX_VISIBLE_CAMPUSES);
    const hiddenCampusCount = Math.max(
        0,
        campusNames.length - visibleCampusNames.length,
    );

    return `
        <div
            class="flex flex-wrap justify-center gap-2 mb-3 w-full px-4"
            title="${escapeHtml(campusNames.join(", "))}"
        >
            ${visibleCampusNames
                .map(
                    (campusName) => `
                        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-premium-accent/8 border border-premium-accent/15 text-[10px] font-bold text-premium-accent leading-none">
                            <span class="w-1.5 h-1.5 rounded-full bg-premium-accent shrink-0"></span>
                            ${escapeHtml(campusName)}
                        </span>
                    `,
                )
                .join("")}
            ${
                hiddenCampusCount > 0
                    ? `<span class="inline-flex items-center px-2.5 py-1 rounded-full bg-premium-accent/8 border border-premium-accent/15 text-[10px] font-bold text-premium-accent leading-none">+${hiddenCampusCount}</span>`
                    : ""
            }
        </div>
    `;
};

const renderKnowledgeAreaPills = (knowledgeAreaNames: string[]) => {
    const visibleAreas = knowledgeAreaNames.slice(0, MAX_VISIBLE_KNOWLEDGE_AREAS);
    const hiddenAreaCount = Math.max(
        0,
        knowledgeAreaNames.length - visibleAreas.length,
    );

    return `
        <div class="flex flex-wrap justify-center gap-2 mb-4 w-full">
            ${visibleAreas
                .map(
                    (areaName) => `
                        <span class="px-2 py-0.5 rounded-md bg-[var(--tag-bg)] text-[10px] font-bold text-text-secondary border border-outline truncate max-w-[120px]">
                            ${escapeHtml(areaName)}
                        </span>
                    `,
                )
                .join("")}
            ${
                hiddenAreaCount > 0
                    ? `<span class="px-2 py-0.5 rounded-md bg-[var(--tag-bg)] text-[10px] font-bold text-text-secondary">+${hiddenAreaCount}</span>`
                    : ""
            }
        </div>
    `;
};

const renderExternalLinks = (card: ResearcherCardView) => {
    const links: string[] = [];

    if (card.cnpqUrl) {
        links.push(`
            <a
                href="${escapeHtml(card.cnpqUrl)}"
                target="_blank"
                class="text-text-secondary hover:text-premium-accent transition-colors p-1"
                title="Lattes"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect width="4" height="12" x="2" y="9" />
                    <circle cx="4" cy="4" r="2" />
                </svg>
            </a>
        `);
    }

    if (card.scholarUrl) {
        links.push(`
            <a
                href="${escapeHtml(card.scholarUrl)}"
                target="_blank"
                class="text-text-secondary hover:text-premium-purple transition-colors p-1"
                title="Google Scholar"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                    <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
            </a>
        `);
    }

    return links.join("");
};

export const buildResearcherCardView = ({
    researcher,
    stats,
    baseUrl,
    campusIds = [],
    campusNames = [],
    profileHref = `${baseUrl}${researcher.classification === "student" ? "students" : "researchers"}/${researcher.id}`,
}: {
    researcher: Researcher;
    stats: ResearcherStats;
    baseUrl: string;
    campusIds?: string[];
    campusNames?: string[];
    profileHref?: string;
}): ResearcherCardView => ({
    id: String(researcher.id),
    name: researcher.name,
    initial: researcher.name.trim().charAt(0) || "?",
    searchIndex: buildSearchIndex([researcher.name]),
    campusIds,
    campusNames,
    highestDegree: getHighestAcademicDegree(researcher.academic_education),
    identificationLabel: researcher.identification_id
        ? `${researcher.identification_id.split("@")[0]}...`
        : null,
    citationName:
        researcher.citation_names && researcher.citation_names !== "None"
            ? researcher.citation_names.split(";")[0]
            : null,
    knowledgeAreaNames: researcher.knowledge_areas.map((area) => area.name),
    projects: stats.projects,
    articles: stats.articles,
    advisorships: stats.advisorships,
    advisorshipsTooltip: Object.entries(stats.advisorshipsByType || {})
        .map(([type, count]) => `${type}: ${count}`)
        .join("\n"),
    isSupervisor: stats.isSupervisor,
    isStudent: stats.isStudent,
    cnpqUrl: researcher.cnpq_url || null,
    scholarUrl:
        researcher.google_scholar_url && researcher.google_scholar_url !== "None"
            ? researcher.google_scholar_url
            : null,
    profileHref,
});

export const renderResearcherCardMarkup = (card: ResearcherCardView) => `
    <article
        class="researcher-card glass-card p-6 hover:border-premium-accent/40 hover:bg-premium-accent/[0.02] transition-all flex flex-col items-center text-center group"
        data-name="${escapeHtml(card.name.toLowerCase())}"
        data-search="${escapeHtml(card.searchIndex)}"
        data-campus-ids="${escapeHtml(card.campusIds.join("|"))}"
    >
        <div
            class="w-24 h-24 rounded-full bg-gradient-to-br from-premium-accent/20 to-premium-purple/20 border-2 border-outline flex items-center justify-center text-premium-accent font-bold text-2xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-premium-accent/5"
        >
            ${escapeHtml(card.initial)}
        </div>

        <h3
            class="text-lg font-bold text-text-main mb-1 leading-tight group-hover:text-premium-accent transition-colors"
        >
            ${escapeHtml(card.name)}
        </h3>

        ${
            card.highestDegree
                ? `<p class="text-[10px] font-bold uppercase tracking-wider text-premium-purple bg-premium-purple/5 px-2 py-0.5 rounded-full mb-2">${escapeHtml(card.highestDegree)}</p>`
                : ""
        }

        ${renderCampusPills(card.campusNames)}

        ${
            card.identificationLabel
                ? `
                    <p class="text-xs text-text-secondary mb-4 flex items-center justify-center gap-1.5 opacity-80">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="w-3.5 h-3.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <rect width="20" height="16" x="2" y="4" rx="2" />
                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                        </svg>
                        ${escapeHtml(card.identificationLabel)}
                    </p>
                `
                : ""
        }

        ${
            card.citationName
                ? `
                    <p
                        class="text-[9px] text-text-secondary italic mb-4 opacity-70 truncate max-w-full px-4"
                        title="${escapeHtml(card.citationName)}"
                    >
                        ${escapeHtml(card.citationName)}
                    </p>
                `
                : ""
        }

        ${renderKnowledgeAreaPills(card.knowledgeAreaNames)}

        <div class="flex items-center gap-4 mb-6">
            <div class="flex flex-col items-center">
                <span class="text-xs font-bold text-text-main">
                    ${card.projects}
                </span>
                <span
                    class="text-[8px] uppercase tracking-wider text-text-secondary font-bold"
                >
                    Projetos
                </span>
            </div>
            <div class="w-px h-6 bg-outline"></div>
            <div class="flex flex-col items-center">
                <span class="text-xs font-bold text-text-main">
                    ${card.articles}
                </span>
                <span
                    class="text-[8px] uppercase tracking-wider text-text-secondary font-bold"
                >
                    Artigos
                </span>
            </div>
            <div class="w-px h-6 bg-outline"></div>
            <div
                class="flex flex-col items-center cursor-help"
                title="${escapeHtml(card.advisorshipsTooltip)}"
            >
                <span class="text-xs font-bold text-text-main">
                    ${card.advisorships}
                </span>
                <span
                    class="text-[8px] uppercase tracking-wider text-text-secondary font-bold"
                >
                    Orientações
                </span>
            </div>
            ${
                card.isSupervisor || card.isStudent
                    ? `
                        <div class="w-px h-6 bg-outline"></div>
                        <div class="flex gap-1">
                            ${
                                card.isSupervisor
                                    ? `
                                        <div
                                            title="Orientador"
                                            class="w-4 h-4 rounded-full bg-premium-accent/10 flex items-center justify-center text-premium-accent"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                class="w-2.5 h-2.5"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                stroke-width="3"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            >
                                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                                <circle cx="9" cy="7" r="4" />
                                            </svg>
                                        </div>
                                    `
                                    : ""
                            }
                            ${
                                card.isStudent
                                    ? `
                                        <div
                                            title="Orientando"
                                            class="w-4 h-4 rounded-full bg-premium-purple/10 flex items-center justify-center text-premium-purple"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                class="w-2.5 h-2.5"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                stroke-width="3"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            >
                                                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                                                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                                            </svg>
                                        </div>
                                    `
                                    : ""
                            }
                        </div>
                    `
                    : ""
            }
        </div>

        <div
            class="mt-auto pt-4 border-t border-outline w-full flex flex-col gap-3"
        >
            <div class="flex justify-between items-center w-full">
                <div class="flex gap-2">
                    ${renderExternalLinks(card)}
                </div>
            </div>
            <a
                href="${escapeHtml(card.profileHref)}"
                class="text-xs font-bold text-premium-accent flex items-center justify-center gap-1 hover:translate-x-1 transition-transform focus:ring-2 focus:ring-premium-accent rounded py-2 border border-premium-accent/20 hover:bg-premium-accent/5"
            >
                Ver perfil completo
                <svg
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                </svg>
            </a>
        </div>
    </article>
`;
