import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export class PrismaUsersRepository {
  async findUserByEmail(email: string) {
    const userByEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    return userByEmail
  }

  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data,
    })

    return user
  }
}
