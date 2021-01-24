import {model, property} from '@loopback/repository';
import {UserModifiableEntity} from '@sourceloop/core';

@model({
  name: 'store',
  settings: {postgresql: {schema: 'main', table: 'store'}},
})
export class Store extends UserModifiableEntity {
  @property({
    type: 'string',
    id: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
  })
  description: string;

  @property({
    type: 'string',
  })
  link: string;

  @property({
    name: 'seller_id',
    type: 'string',
    description: `This field is respoinsible to track user role in the
    application`,
  })
  sellerId?: string;

  constructor(data?: Partial<Store>) {
    super(data);
  }
}
