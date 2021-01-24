import {model, property} from '@loopback/repository';
import {UserModifiableEntity} from '@sourceloop/core';

@model({
  name: 'products',
  settings: {postgresql: {schema: 'main', table: 'products'}},
})
export class Products extends UserModifiableEntity {
  @property({
    type: 'string',
    id: true,
    generated: true,
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
  description?: string;

  @property({
    type: 'string',
    required: true,
    name: 'category_id',
  })
  categoryId: string;

  @property({
    type: 'string',
    required: true,
    name: 'store_id',
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
    name: 'sale_price',
  })
  salePrice: number;

  constructor(data?: Partial<Products>) {
    super(data);
  }
}

export interface ProductsRelations {
  // describe navigational properties here
}

export type ProductsWithRelations = Products & ProductsRelations;
