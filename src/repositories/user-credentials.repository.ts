import {inject} from '@loopback/core';
import {DefaultSoftCrudRepository} from '@sourceloop/core';
import {PgdbDataSource} from '../datasources';
import {UserCredentials, UserCredentialsRelations} from '../models';

export class UserCredentialsRepository extends DefaultSoftCrudRepository<
  UserCredentials,
  typeof UserCredentials.prototype.id,
  UserCredentialsRelations
> {
  constructor(@inject('datasources.pgdb') dataSource: PgdbDataSource) {
    super(UserCredentials, dataSource);
  }
}
