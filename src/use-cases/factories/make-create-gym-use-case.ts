import { CreateGymUserCase } from '../create-gym'
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'

export function makeCreateGymUseCase() {
  const gymsRepository = new PrismaGymsRepository()
  const useCase = new CreateGymUserCase(gymsRepository)

  return useCase
}
