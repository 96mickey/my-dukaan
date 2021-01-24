import {Model, model, property} from '@loopback/repository';

@model()
export class SignUpRequest extends Model {
  @property({
    type: 'string',
    required: true,
  })
  phone: string;

  @property({type: 'string', required: true})
  password: string;

  constructor(data?: Partial<SignUpRequest>) {
    super(data);
  }
}
