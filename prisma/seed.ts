import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const cat = await prisma.category.upsert({
    where: { slug: 'utilities' },
    update: {},
    create: { name: 'Utilities', slug: 'utilities' }
  })

  await prisma.software.upsert({
    where: { slug: 'phonkers' },
    update: {},
    create: {
      name: 'Phonkers',
      slug: 'phonkers',
      description:
        'Discover, stream, and enjoy the best phonk tracks from around the world. Built with passion for the phonk community.',
      version: '1.0.0',
      platform: ['ios', 'android'],
      price: 0,
      imageUrl:
        'https://res.cloudinary.com/dxfnw5mkl/image/upload/v1757636950/dark_phonkers_logo_neymgg.png',
      downloadUrl: 'https://example.com/phonkers.apk',
      featured: true,
      categoryId: cat.id,
      webUrl: 'https://phonkers-pwa-web.netlify.app/',
      tags: ['music', 'phonk'],
      repoUrl: null
    }
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
