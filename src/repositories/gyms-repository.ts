import { Gym, Prisma } from '@prisma/client'

export interface GymsRepository {
  findGymById(id: string): Promise<Gym | null>
  create(data: Prisma.GymCreateInput): Promise<Gym>
}
