
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../app/generated/prisma';

// 1. Configurer le pool de connexion avec la base de données
const connectionString = "postgresql://postgres:123456@localhost:5432/pfe_db";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

// 2. Initialiser Prisma Client avec l'adapter
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Ajout des spots pour tous les parkings en cours...");

  // 3. Récupérer tous les parkings (165 parkings)
  const parkings = await prisma.parking.findMany();

  if (parkings.length === 0) {
    console.log("Aucun parking trouvé dans la base de données !");
    return;
  }

  // 4. Parcourir chaque parking et créer 20 spots pour lui
  for (const parking of parkings) {
    const spotsData = [];
    
    for (let i = 1; i <= 20; i++) { // 20 places par parking
      spotsData.push({
        spotNumber: `S-${i}`,
        isBooked: false,
        parkingId: parking.id,
      });
    }

    // Insérer les spots en une seule fois
    await prisma.spot.createMany({
      data: spotsData,
      skipDuplicates: true,
    });
  }

  console.log("Spots ajoutés avec succès pour tous les parkings ! 🚀");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });