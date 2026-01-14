import { describe, it, expect } from 'vitest';

// Mock data
const projects = [
    {
        "id": 1,
        "name": "Project Alpha",
        "status": "active",
        "start_date": "2022-08-01T00:00:00",
        "end_date": "2026-12-31T00:00:00",
    },
    {
        "id": 2,
        "name": "Project Beta",
        "status": "concluded",
        "start_date": "2022-08-01T00:00:00",
        "end_date": "2023-12-31T00:00:00",
    },
    {
        "id": 3,
        "name": "Gamma Research",
        "status": "active",
        "start_date": "2023-08-01T00:00:00",
        "end_date": "2026-12-31T00:00:00",
    }
];

function filterProjects(projects: any[], query: string, status: string) {
    return projects.filter(p => {
        const matchesQuery = p.name.toLowerCase().includes(query.toLowerCase());
        const matchesStatus = status === 'all' || p.status === status;
        return matchesQuery && matchesStatus;
    });
}

describe('Project Filtering Logic', () => {
    it('should filter projects by name', () => {
        const result = filterProjects(projects, 'Alpha', 'all');
        expect(result).toHaveLength(1);
        expect(result[0].name).toBe('Project Alpha');
    });

    it('should filter projects by status', () => {
        const activeResults = filterProjects(projects, '', 'active');
        expect(activeResults).toHaveLength(2);

        const concludedResults = filterProjects(projects, '', 'concluded');
        expect(concludedResults).toHaveLength(1);
        expect(concludedResults[0].name).toBe('Project Beta');
    });

    it('should filter by name and status combined', () => {
        const result = filterProjects(projects, 'Gamma', 'active');
        expect(result).toHaveLength(1);
        expect(result[0].name).toBe('Gamma Research');
    });

    it('should return all projects when query is empty and status is all', () => {
        const result = filterProjects(projects, '', 'all');
        expect(result).toHaveLength(3);
    });
});
