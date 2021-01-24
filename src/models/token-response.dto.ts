import {Model, model, property} from '@loopback/repository';

@model()
export class TokenResponse extends Model {
  @property({
    type: 'string',
    description: `This token holds the user information and also acts as
    authentication mechanism for stateless architecture.`,
    required: true,
  })
  accessToken: string;

  constructor(data?: Partial<TokenResponse>) {
    super(data);
  }
}
