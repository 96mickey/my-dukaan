import {model, property} from '@loopback/repository';
import {UserModifiableEntity} from '@sourceloop/core';

@model()
export class ProductsDTO extends UserModifiableEntity {
  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
  })
  description?: string;

  @property({
    type: 'string',
    required: true,
  })
  category: string;

  @property({
    type: 'string',
    required: true,
  })
  storeId: string;

  @property({
    type: 'number',
    required: true,
  })
  mrp: number;

  @property({
    type: 'number',
    required: true,
  })
  salePrice: number;

  constructor(data?: Partial<ProductsDTO>) {
    super(data);
  }
}
