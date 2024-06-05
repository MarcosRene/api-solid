import { expect, describe, it } from 'vitest'
import { RegisterUserCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadExistsError } from './errors/user-already-exists-error'

describe('Register Use Case', () => {
  it('should be able to register', async () => {
    const registerUseCase = new RegisterUserCase(new InMemoryUsersRepository())

    const { user } = await registerUseCase.execute({
      name: 'Jonh Doe',
      email: 'jonhdoe@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const registerUseCase = new RegisterUserCase(new InMemoryUsersRepository())

    const { user } = await registerUseCase.execute({
      name: 'Jonh Doe',
      email: 'jonhdoe@example.com',
      password: '123456',
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email email twice', async () => {
    const registerUseCase = new RegisterUserCase(new InMemoryUsersRepository())

    const email = 'jonhdoe@example.com'

    await registerUseCase.execute({
      name: 'Jonh Doe',
      email,
      password: '123456',
    })

    await expect(() =>
      registerUseCase.execute({
        name: 'Jonh Doe',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadExistsError)
  })
})
