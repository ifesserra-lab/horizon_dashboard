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
}
