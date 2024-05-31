export class RegisterOwnerCommand {
  constructor(
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly ownername: string,
    public readonly email: string,
    public readonly phoneNumber: string,
    public readonly city: string,
    public readonly description: string,
  ) {}

  static from(data: {
    firstName: string
    lastName: string
    ownername: string
    email: string
    phoneNumber: string
    city: string
    description: string
  }): RegisterOwnerCommand {
    return new RegisterOwnerCommand(
      data.firstName,
      data.lastName,
      data.ownername,
      data.email,
      data.phoneNumber,
      data.city,
      data.description,
    )
  }
}
