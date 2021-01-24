import {Getter, inject} from '@loopback/core';
import {
  DefaultUserModifyCrudRepository,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  IAuthUserWithPermissions,
} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {PgdbDataSource} from '../datasources';
import {Store} from '../models';

export class StoreRepository extends DefaultUserModifyCrudRepository<
  Store,
  typeof Store.prototype.id
> {
  constructor(
    @inject('datasources.pgdb') dataSource: PgdbDataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    protected readonly getCurrentUser: Getter<
      IAuthUserWithPermissions | undefined
    >,
  ) {
    super(Store, dataSource, getCurrentUser);
  }
}
