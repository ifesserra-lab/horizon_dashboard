import type { Publication } from '../../types/publications';

export const mockPublications: Publication[] = [
    {
        id: '1',
        title: 'Deep Learning for Satellite Image Analysis',
        year: 2024,
        type: 'Article',
        venue: 'IEEE Transactions on Geoscience and Remote Sensing',
        authors: ['Karin Satie Komati', 'Student A']
    },
    {
        id: '2',
        title: 'Blockchain in Mining Supply Chain',
        year: 2023,
        type: 'Conference',
        venue: 'International Conference on Blockchain',
        authors: ['Vitor Faiçal Campana', 'Karin Satie Komati']
    },
    {
        id: '3',
        title: 'Efficient Energy Management in smart cities',
        year: 2023,
        type: 'Article',
        venue: 'Energy Reports',
        authors: ['Jefferson O. Andrade', 'Student B']
    },
    {
        id: '4',
        title: 'Neuro-evolution for Gas Optimization',
        year: 2022,
        type: 'Conference',
        venue: 'GECCO',
        authors: ['Karin Satie Komati', 'Daniel Ribeiro Trindade']
    },
    {
        id: '5',
        title: 'Conveyor Belt Monitoring with AI',
        year: 2024,
        type: 'Article',
        venue: 'Journal of Industrial Information Integration',
        authors: ['Marco Antonio De Souza Leite Cuadros']
    },
    {
        id: '6',
        title: 'Accessibility in Web Dashboards',
        year: 2025,
        type: 'Conference',
        venue: 'CHI Play',
        authors: ['Paulo Sergio dos Santos Junior', 'Antigravity']
    },
    {
        id: '7',
        title: 'Data Vis patterns for academic data',
        year: 2023,
        type: 'Book',
        venue: 'Springer',
        authors: ['Rodolfo da Silva Villaça']
    },
    {
        id: '8',
        title: 'Graph Neural Networks survey',
        year: 2024,
        type: 'Article',
        venue: 'ACM Computing Surveys',
        authors: ['Vitor Faiçal Campana']
    },
    {
        id: '9',
        title: 'Renewable Energy Case Study',
        year: 2022,
        type: 'Other',
        authors: ['Danilo De Paula E Silva']
    },
    {
        id: '10',
        title: 'Smart Campus Initiatives',
        year: 2022,
        type: 'Conference',
        venue: 'EduTech',
        authors: ['Jefferson O. Andrade']
    }
];

export const getPublicationsByResearcher = (): { name: string; count: number }[] => {
    const map = new Map<string, number>();
    mockPublications.forEach(pub => {
        pub.authors.forEach(author => {
            map.set(author, (map.get(author) || 0) + 1);
        });
    });
    return Array.from(map.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
};

export const getPublicationsEvolution = (): { year: number; count: number }[] => {
    const map = new Map<number, number>();
    mockPublications.forEach(pub => {
        map.set(pub.year, (map.get(pub.year) || 0) + 1);
    });
    const minYear = Math.min(...mockPublications.map(p => p.year));
    const maxYear = Math.max(...mockPublications.map(p => p.year));

    const result = [];
    for (let year = minYear; year <= maxYear; year++) {
        result.push({ year, count: map.get(year) || 0 });
    }
    return result;
};
