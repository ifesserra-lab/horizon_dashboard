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

export interface AcademicEducation {
    institution: string;
    degree: string;
    course_name: string;
    start_year: number;
    end_year: number;
    thesis_title: string;
    advisor_name: string;
    co_advisor_name: string | null;
}

export interface Article {
    id: number;
    title: string;
    year: number;
    type: string;
    doi: string | null;
    journal_conference: string;
}

export interface Researcher {
    id: number;
    name: string;
    identification_id?: string | null;
    birthday?: string | null;
    cnpq_url?: string | null;
    google_scholar_url?: string | null;
    resume?: string | null;
    citation_names?: string | null;
    initiatives: ResearcherInitiative[];
    research_groups: ResearcherGroup[];
    knowledge_areas: ResearcherKnowledgeArea[];
    academic_education: AcademicEducation[];
    articles: Article[];
}
