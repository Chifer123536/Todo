export class AxiosCustomError extends Error {
  constructor(
    public statusCode: number,
    public message: string
  ) {
    super(message)
    Object.setPrototypeOf(this, new.target.prototype)
  }
}
