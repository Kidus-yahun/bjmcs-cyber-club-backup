import { PrismaClient } from '@prisma/client';
import { scryptSync, randomBytes } from 'crypto';

const db = new PrismaClient();

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derivedKey}`;
}

async function main() {
  console.log("=== BJMCS Cyber Club Admin Setup ===");
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || 'System Administrator';

  if (!email || !password) {
    console.error("Error: ADMIN_EMAIL and ADMIN_PASSWORD environment variables are required.");
    console.error("Usage: ADMIN_EMAIL='admin@example.com' ADMIN_PASSWORD='SuperSecretPassword123' node scripts/create-admin.mjs");
    process.exit(1);
  }

  try {
    const existingUser = await db.adminUser.findUnique({ where: { email } });
    if (existingUser) {
      console.error(`Error: Admin user with email '${email}' already exists.`);
      process.exit(1);
    }

    await db.adminUser.create({
      data: {
        email,
        name,
        passwordHash: hashPassword(password),
      }
    });

    console.log(`Successfully provisioned admin user: ${email}`);
  } catch (error) {
    console.error("Failed to provision admin user:", error);
    process.exit(1);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
