import { expect, describe, it } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUserCase } from './authenticate'
import { hashSync } from 'bcryptjs'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

describe('Authenticate Use Case', () => {
  it('should be able to authenticate', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const authenticateUseCase = new AuthenticateUserCase(usersRepository)

    await usersRepository.create({
      name: 'Jonh Doe',
      email: 'jonhdoe@example.com',
      password_hash: hashSync('123456', 6),
    })

    const { user } = await authenticateUseCase.execute({
      email: 'jonhdoe@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should be able to authenticate with wrong email', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const authenticateUseCase = new AuthenticateUserCase(usersRepository)

    await expect(() =>
      authenticateUseCase.execute({
        email: 'jonhdoe@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should be able to authenticate with wrong password', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const authenticateUseCase = new AuthenticateUserCase(usersRepository)

    await usersRepository.create({
      name: 'Jonh Doe',
      email: 'jonhdoe@example.com',
      password_hash: hashSync('123456', 6),
    })

    await expect(() =>
      authenticateUseCase.execute({
        email: 'jonhdoe@example.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
