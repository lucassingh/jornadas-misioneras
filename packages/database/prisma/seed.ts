import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL;

async function main() {
  if (!ADMIN_EMAIL) {
    console.log('Sin SEED_ADMIN_EMAIL definido - seed omitido.');
    console.log('Agregá SEED_ADMIN_EMAIL=tu@email.com en packages/database/.env y volvé a correr.');
    return;
  }

  const user = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } });

  if (!user) {
    console.log(`Usuario "${ADMIN_EMAIL}" no encontrado.`);
    console.log('Registrate primero en la app y después volvé a correr el seed.');
    return;
  }

  if (user.role === 'ADMIN') {
    console.log(`${ADMIN_EMAIL} ya es ADMIN.`);
    return;
  }

  await prisma.user.update({
    where: { email: ADMIN_EMAIL },
    data: { role: 'ADMIN' },
  });

  console.log(`${ADMIN_EMAIL} promovido a ADMIN.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
