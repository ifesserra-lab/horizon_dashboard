export interface Publication {
    id: string;
    title: string;
    year: number;
    type: 'Article' | 'Conference' | 'Book' | 'Chapter' | 'Other';
    venue?: string;
    authors: string[];
}

export interface ResearcherPublicationMetrics {
    researcherName: string;
    publicationCount: number;
}

export interface AnnualPublicationMetrics {
    year: number;
    count: number;
}
