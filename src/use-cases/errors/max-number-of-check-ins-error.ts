export class MaxNumberOfCheckInsErrors extends Error {
  constructor() {
    super('Max number of check-ins reached.')
  }
}
