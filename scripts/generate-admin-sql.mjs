import { scryptSync, randomBytes } from 'crypto';

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derivedKey}`;
}

const email = "admin@bgmcs.com";
const name = "System Administrator";
const password = process.env.ADMIN_PASSWORD;

if (!password) {
  console.error("Error: Please set the ADMIN_PASSWORD environment variable.");
  process.exit(1);
}

const hashed = hashPassword(password);
const id = `cuid_${randomBytes(4).toString('hex')}`; // simple unique ID
const now = new Date().toISOString();

const sql = `
INSERT INTO "AdminUser" (id, email, name, "passwordHash", "createdAt", "updatedAt")
VALUES ('${id}', '${email}', '${name}', '${hashed}', '${now}', '${now}');
`;

console.log("\n=== EXECUTE THIS SQL IN SUPABASE DASHBOARD ===\n");
console.log(sql);
console.log("===============================================\n");
