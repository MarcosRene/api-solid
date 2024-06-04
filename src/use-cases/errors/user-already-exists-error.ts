export class UserAlreadExistsError extends Error {
  constructor() {
    super('E-mail already exists.')
  }
}
