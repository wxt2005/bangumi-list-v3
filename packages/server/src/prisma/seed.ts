import { PrismaClient } from '@prisma/client';
import userModel, { UserRole } from '../models/user.model';

const prisma = new PrismaClient();

async function main() {
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) return;
  await userModel.addUser(
    {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    },
    UserRole.ADMIN
  );

  console.log(`Admin user ${ADMIN_EMAIL} created.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
