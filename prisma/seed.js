const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const bcrypt = require("bcrypt");

require("dotenv/config");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  // 1. Create admin user
  const passwordHash = await bcrypt.hash("Admin@123", 12);
  const admin = await prisma.admin.upsert({
    where: { username: "admin" },
    update: { passwordHash },
    create: {
      username: "admin",
      passwordHash,
    },
  });
  console.log("Admin created:", admin.username);

  // 2. Create occasion: Eid Al-Fitr 1446
  const occasion = await prisma.occasion.upsert({
    where: { slug: "eid-alfitr-1446" },
    update: {},
    create: {
      name: "عيد الفطر المبارك ١٤٤٦",
      slug: "eid-alfitr-1446",
      startDate: new Date("2025-03-28"),
      endDate: new Date("2025-04-05"),
      isActive: true,
    },
  });
  console.log("Occasion created:", occasion.name);

  // 3. Create the 5 existing templates
  const templates = [
    {
      imagePath: "/bg1.jpg",
      nameX: 0,
      nameY: 950,
      deptX: 0,
      deptY: 990,
      fontSize: 36,
      fontColor: "#f98500",
      order: 0,
    },
    {
      imagePath: "/bg2.jpg",
      nameX: 0,
      nameY: 50,
      deptX: 0,
      deptY: 90,
      fontSize: 36,
      fontColor: "#f98500",
      order: 1,
    },
    {
      imagePath: "/bg3.jpg",
      nameX: 260,
      nameY: 700,
      deptX: 260,
      deptY: 740,
      fontSize: 36,
      fontColor: "#f98500",
      order: 2,
    },
    {
      imagePath: "/bg4.jpg",
      nameX: 260,
      nameY: 700,
      deptX: 260,
      deptY: 740,
      fontSize: 36,
      fontColor: "#f98500",
      order: 3,
    },
    {
      imagePath: "/bg5.jpg",
      nameX: 0,
      nameY: 700,
      deptX: 0,
      deptY: 740,
      fontSize: 36,
      fontColor: "#f98500",
      order: 4,
    },
  ];

  for (const t of templates) {
    await prisma.template.create({
      data: {
        occasionId: occasion.id,
        ...t,
        fontFamily: "Alexandria",
        isActive: true,
      },
    });
  }
  console.log(`${templates.length} templates created for ${occasion.name}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
