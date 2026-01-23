
import fs from 'fs';

const initiativesPath = './src/data/canonical/initiatives_canonical.json';
const groupsPath = './src/data/canonical/research_groups_canonical.json';

const initiatives = JSON.parse(fs.readFileSync(initiativesPath, 'utf8'));
const groups = JSON.parse(fs.readFileSync(groupsPath, 'utf8'));

const groupsMap = new Map(groups.map(g => [g.id, g]));

let totalProjects = 0;
let projectsWithGroup = 0;
let totalStudentsInProjects = 0;
let studentsFoundInGroup = 0;
let studentsNotFoundInGroup = 0;

console.log("Starting Analysis...\n");

initiatives.forEach(project => {
    // Only check Research Projects
    if (project.initiative_type?.name !== 'Research Project') return;

    totalProjects++;

    const groupId = project.research_group?.id;
    if (!groupId) return;

    projectsWithGroup++;
    const group = groupsMap.get(groupId);

    if (!group) {
        console.error(`Group ID ${groupId} not found for project ${project.id}`);
        return;
    }

    // Filter project team for students (heuristic: look for student-like roles or just check everyone who isn't a coordinator/researcher if role is missing)
    // Let's inspect roles first.

    project.team.forEach(member => {
        // Normalizing name for comparison
        const memberName = member.person_name.trim().toLowerCase();

        // Check if member exists in group
        const foundInGroup = group.members.some(gMember =>
            gMember.name.trim().toLowerCase() === memberName
        );

        // Heuristic for "Student":
        // In the data snippet, roles were ["Researcher", "Coordinator"].
        // If the user asks about "students", maybe they imply roles other than Leader/Researcher?
        // Or maybe strictly "Student" role?
        // Let's assume if they are in the project team, they *should* be in the group, regardless of role, 
        // but specifically flagging potential students might be useful.
        // For now, let's check ALL project members against group members, 
        // as typically all project participants should be in the group.

        if (foundInGroup) {
            studentsFoundInGroup++;
        } else {
            studentsNotFoundInGroup++;
            // Output discrepancy
            console.log(`[DISCREPANCY] Project: "${project.name.substring(0, 50)}..."`);
            console.log(`  - Group: "${group.name}"`);
            console.log(`  - Person: "${member.person_name}" (Roles: ${member.roles.join(', ')})`);
            console.log(`  - NOT FOUND in Group Members\n`);
        }
        totalStudentsInProjects++;
    });
});

console.log("Analysis Complete.");
console.log("--------------------------------------------------");
console.log(`Total Research Projects Scanned: ${totalProjects}`);
console.log(`Projects linked to a Research Group: ${projectsWithGroup}`);
console.log(`Total Team Members in these Projects: ${totalStudentsInProjects}`);
console.log(`Members FOUND in Group: ${studentsFoundInGroup}`);
console.log(`Members NOT FOUND in Group: ${studentsNotFoundInGroup}`);
console.log(`Consistency Rate: ${((studentsFoundInGroup / totalStudentsInProjects) * 100).toFixed(2)}%`);

