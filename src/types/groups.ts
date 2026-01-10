export interface Member {
    id: number;
    name: string;
    role: string;
    lattes_url: string | null;
    emails: string[];
}

export interface KnowledgeArea {
    id: number;
    name: string;
}

export interface Organization {
    id: number;
    name: string;
}

export interface Campus {
    id: number;
    name: string;
}

export interface ResearchGroup {
    id: number;
    name: string;
    description: string | null;
    short_name: string;
    organization_id: number;
    campus_id: number;
    cnpq_url: string | null;
    site: string | null;
    organization: Organization;
    campus: Campus;
    knowledge_areas: KnowledgeArea[];
    members: Member[];
    leaders: Member[];
}
