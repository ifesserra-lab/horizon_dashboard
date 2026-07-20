export interface TeamMember {
    person_id: number;
    person_name: string;
    roles: string[];
    start_date: string;
    end_date: string | null;
}

export interface InitiativeType {
    id: number;
    name: string;
    description: string | null;
}

export interface ProjectScheduleItem {
    atividade: string | null;
    inicio: string | null;
    fim: string | null;
}

export interface ProjectObjectives {
    geral?: string | null;
    especificos?: string[];
}

export interface ProjectEnrichment {
    source: string;
    project_code: string | null;
    match_strategy: string;
    needs_review: boolean;
    objetivos: ProjectObjectives;
    cronograma: ProjectScheduleItem[];
    linha_pesquisa: string | null;
    palavras_chave: string[];
    area_conhecimento: string | null;
    extracted_at: string | null;
    extraction_model: string | null;
    source_file: string | null;
}

export interface Project {
    id: number;
    name: string;
    status: 'active' | 'concluded' | string;
    description: string | null;
    start_date: string;
    end_date: string;
    initiative_type_id: number;
    initiative_type?: InitiativeType;
    organization_id: number | null;
    parent_id: number | null;
    research_group?: {
        id: number;
        name: string;
    } | null;
    team?: TeamMember[];
    enrichment?: ProjectEnrichment | null;
}
