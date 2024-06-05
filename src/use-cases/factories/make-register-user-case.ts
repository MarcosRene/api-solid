import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { RegisterUserCase } from '../register'

export function makeRegisterUserCase() {
  const usersRepository = new PrismaUsersRepository()
  const registerUseCase = new RegisterUserCase(usersRepository)

  return registerUseCase
}
