import {inject} from '@loopback/core';
import {DefaultSoftCrudRepository} from '@sourceloop/core';
import {PgdbDataSource} from '../datasources';
import {Role} from '../models';

export class RoleRepository extends DefaultSoftCrudRepository<
  Role,
  typeof Role.prototype.id
> {
  constructor(@inject('datasources.pgdb') dataSource: PgdbDataSource) {
    super(Role, dataSource);
  }
}
