export interface Member {
    id: string;
    name: string;
    role: string;
    lattes_url: string | null;
    emails: string[];
    start_date: string;
    end_date: string | null;
}

export interface KnowledgeArea {
    id: string;
    name: string;
}

export interface Organization {
    id: string;
    name: string;
}

export interface Campus {
    id: string;
    name: string;
}

export interface ResearchGroup {
    id: string;
    name: string;
    description: string | null;
    short_name: string | null;
    organization_id: string;
    campus_id: string;
    cnpq_url: string | null;
    site: string | null;
    organization: Organization;
    campus: Campus;
    knowledge_areas: KnowledgeArea[];
    members: Member[];
    leaders: Member[];
}
