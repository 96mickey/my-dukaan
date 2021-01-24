import {inject} from '@loopback/core';
import {DefaultSoftCrudRepository} from '@sourceloop/core';
import {PgdbDataSource} from '../datasources';
import {AuthClient} from '../models';

export class AuthClientRepository extends DefaultSoftCrudRepository<
  AuthClient,
  typeof AuthClient.prototype.id
> {
  constructor(@inject('datasources.pgdb') dataSource: PgdbDataSource) {
    super(AuthClient, dataSource);
  }
}
