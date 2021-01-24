import {hasOne, model, property} from '@loopback/repository';
import {UserModifiableEntity} from '@sourceloop/core';
import {IAuthUser} from 'loopback4-authentication';
import {
  UserCredentials,
  UserCredentialsWithRelations,
} from './user-credentials.model';

@model({
  name: 'account',
  description: 'This is signature for user model.',
  settings: {
    postgresql: {schema: 'main', table: 'account'},
  },
})
export class User extends UserModifiableEntity implements IAuthUser {
  @property({
    type: 'string',
    id: true,
  })
  id?: string;

  @property({
    type: 'string',
    name: 'first_name',
  })
  firstName?: string;

  @property({
    type: 'string',
    name: 'last_name',
  })
  lastName?: string;

  @property({
    type: 'string',
    name: 'middle_name',
  })
  middleName?: string;

  @property({
    type: 'string',
    required: true,
  })
  username: string;

  @property({
    type: 'string',
  })
  email?: string;

  @property({
    type: 'string',
    jsonSchema: {
      pattern: `^\\+?[1-9]\\d{1,14}$`,
    },
  })
  phone?: string;

  @property({
    type: 'date',
    name: 'last_login',
    postgresql: {
      column: 'last_login',
    },
  })
  lastLogin?: Date;

  @property({
    name: 'role_id',
    type: 'string',
    description: `This field is respoinsible to track user role in the
    application`,
  })
  roleId: string;

  @hasOne(() => UserCredentials, {keyTo: 'userId'})
  credentials: UserCredentials;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  credentials: UserCredentialsWithRelations;
}

export type UserWithRelations = User & UserRelations;
