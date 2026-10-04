import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting development reset...');

  try {
    // We run in a transaction to ensure all or nothing
    await prisma.$transaction(async (tx) => {
      // 1. Delete all Applications. 
      // Due to onDelete: Cascade on the Student model and Project model, 
      // this automatically deletes:
      // - Students
      // - Projects
      // - Attendances
      // - Submissions & Scores
      // - Messages
      // - FaydaIdentities
      // - AcademicRecords
      // - Individual TaskAssignments
      // - Individual AnnouncementTargets
      // - Individual LearningMaterialTargets
      console.log('Deleting all applications and cascading student data...');
      const deletedApps = await tx.application.deleteMany();
      console.log(`Deleted ${deletedApps.count} applications and all associated student records.`);

      // 2. Delete Audit Logs related to students/applications to clean up history
      const deletedLogs = await tx.auditLog.deleteMany({
        where: {
          OR: [
            { action: { in: ['ASSIGN_GROUP'] } }, // Student assignment actions
            { target: { contains: 'Student' } },
            { target: { contains: 'Application' } }
          ]
        }
      });
      console.log(`Cleared ${deletedLogs.count} student-related audit logs.`);
    });
    
    console.log('Reset complete! All student and test data has been removed safely.');
  } catch (error) {
    console.error('Error during reset:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
