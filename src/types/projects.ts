export interface Project {
    id: number;
    name: string;
    status: 'active' | 'concluded' | string;
    description: string | null;
    start_date: string;
    end_date: string;
    initiative_type_id: number;
    organization_id: number | null;
    parent_id: number | null;
}
