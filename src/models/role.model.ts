import {model, property} from '@loopback/repository';
import {BaseEntity} from '@sourceloop/core';
import {RoleType} from '../enums';

@model({
  name: 'roles',
  settings: {postgresql: {schema: 'main', table: 'roles'}},
})
export class Role extends BaseEntity {
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
    type: 'array',
    itemType: 'string',
  })
  permissions: string[];

  @property({
    type: 'number',
    name: 'role_key',
  })
  roleKey: RoleType;

  constructor(data?: Partial<Role>) {
    super(data);
  }
}

export interface RoleRelations {
  // describe navigational properties here
}

export type RoleWithRelations = Role;
