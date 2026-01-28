export interface Fellowship {
    id: number;
    name: string;
    description: string | null;
    value: number;
    sponsor_name: string;
}

export interface AdvisorshipItem {
    id: number;
    name: string;
    status: string;
    description: string | null;
    start_date: string | null;
    end_date: string | null;
    student_id: number;
    student_name: string;
    supervisor_id: number;
    supervisor_name: string;
    fellowship: Fellowship | null;
}

export interface TeamMember {
    name: string;
    role: string;
}

export interface ProjectAdvisorship {
    id: number;
    name: string;
    status: string;
    description: string | null;
    start_date: string | null;
    end_date: string | null;
    advisorships: AdvisorshipItem[];
    team: TeamMember[];
}
