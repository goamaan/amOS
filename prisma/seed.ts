import { createClient } from "@libsql/client"
import { PrismaLibSQL } from "@prisma/adapter-libsql"
import { PrismaClient } from "@prisma/client"

const libsql = createClient({
  url: `${process.env.TURSO_DATABASE_URL}`,
  authToken: `${process.env.TURSO_AUTH_TOKEN}`,
})

const adapter = new PrismaLibSQL(libsql)

const prisma = new PrismaClient({ adapter })

async function main() {
  await prisma.intro.deleteMany()
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.verificationToken.deleteMany()
  await prisma.user.deleteMany()
  await prisma.reaction.deleteMany()
  await prisma.comment.deleteMany()
  await prisma.post.deleteMany()
  await prisma.stackTag.deleteMany()
  await prisma.stack.deleteMany()
  await prisma.bookmarkTag.deleteMany()
  await prisma.bookmark.deleteMany()
  await prisma.question.deleteMany()
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
