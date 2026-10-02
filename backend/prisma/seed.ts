import { PrismaClient } from '@prisma/client'
import argon2 from 'argon2'

const prisma = new PrismaClient()

async function main() {
  const adminPasswordHash = await argon2.hash(process.env.ADMIN_PASSWORD ?? 'ChangeMeStrongly!')

  await prisma.adminUser.upsert({
    where: { email: process.env.ADMIN_EMAIL ?? 'admin@securecheck.local' },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL ?? 'admin@securecheck.local',
      passwordHash: adminPasswordHash,
      role: 'admin',
    },
  })

  const tips = [
    'Use Long Passwords',
    'Avoid Password Reuse',
    'Use a Password Manager',
    'Enable Multi-Factor Authentication',
    'Avoid Predictable Patterns',
    'Never Share Passwords',
  ]

  for (const tip of tips) {
    await prisma.securityTip.upsert({
      where: { id: tip.toLowerCase().replace(/\s+/g, '-') },
      update: {},
      create: {
        id: tip.toLowerCase().replace(/\s+/g, '-'),
        title: tip,
        description: 'Important password hygiene advice to reduce account risk.',
        category: 'passwords',
        priority: 'medium',
        isPublished: true,
      },
    })
  }
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
