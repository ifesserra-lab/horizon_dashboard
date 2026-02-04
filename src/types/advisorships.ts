export interface Fellowship {
    id: string;
    name: string;
    description: string | null;
    value: number;
    sponsor_name: string;
}

export interface AdvisorshipItem {
    id: string;
    name: string;
    status: string;
    description: string | null;
    start_date: string | null;
    end_date: string | null;
    student_id: string;
    student_name: string;
    supervisor_id: string;
    supervisor_name: string;
    fellowship: Fellowship | null;
}

export interface TeamMember {
    name: string;
    role: string;
}

export interface ProjectAdvisorship {
    id: string;
    name: string;
    status: string;
    description: string | null;
    start_date: string | null;
    end_date: string | null;
    advisorships: AdvisorshipItem[];
    team: TeamMember[];
}
