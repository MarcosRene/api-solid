import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxNumberOfCheckInsErrors } from './errors/max-number-of-check-ins-error'
import { MaxDistanceErrors } from './errors/max-distance-error'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let checkInUseCase: CheckInUseCase

describe('Check-in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    checkInUseCase = new CheckInUseCase(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-01',
      title: 'JavaScript Gym',
      description: '',
      phone: '',
      latitude: -5.1427004,
      longitude: -38.0933249,
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await checkInUseCase.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -5.1427004,
      userLongitude: -38.0933249,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2024, 5, 6, 12, 0, 0))

    await checkInUseCase.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -5.1427004,
      userLongitude: -38.0933249,
    })

    await expect(() =>
      checkInUseCase.execute({
        userId: 'user-01',
        gymId: 'gym-01',
        userLatitude: -5.1427004,
        userLongitude: -38.0933249,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsErrors)
  })

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2024, 5, 6, 12, 0, 0))

    await checkInUseCase.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -5.1427004,
      userLongitude: -38.0933249,
    })

    vi.setSystemTime(new Date(2024, 5, 7, 12, 0, 0))

    const { checkIn } = await checkInUseCase.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -5.1427004,
      userLongitude: -38.0933249,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should no be able to check in on distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'JavaScript Gym',
      description: '',
      phone: '',
      latitude: new Decimal(-5.1350184),
      longitude: new Decimal(-38.0907588),
    })

    await expect(
      checkInUseCase.execute({
        userId: 'user-01',
        gymId: 'gym-02',
        userLatitude: -5.1427004,
        userLongitude: -38.0933249,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceErrors)
  })
})
