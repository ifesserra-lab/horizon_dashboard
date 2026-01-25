export interface ResearcherInitiative {
    id: number;
    name: string;
    status: string;
    role: string;
}

export interface ResearcherGroup {
    id: number;
    name: string;
}

export interface ResearcherKnowledgeArea {
    id: number;
    name: string;
}

export interface Researcher {
    id: number;
    name: string;
    identification_id?: string;
    birthday?: string | null;
    cnpq_url?: string | null;
    google_scholar_url?: string | null;
    initiatives: ResearcherInitiative[];
    research_groups: ResearcherGroup[];
    knowledge_areas: ResearcherKnowledgeArea[];
}
