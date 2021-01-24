import {Provider} from '@loopback/context';
import {verify} from 'jsonwebtoken';
import {VerifyFunction} from 'loopback4-authentication';
import {AuthUser} from '../models/auth-user.model';

export class BearerTokenVerifyProvider
  implements Provider<VerifyFunction.BearerFn> {
  constructor() {}

  value(): VerifyFunction.BearerFn {
    return async token => {
      /**
       * There should be a check here to check for logged out tokens.
       * This could be done using redis (or any in memory db,
       * so this operation is fast).
       * For now verifier function will only check for valid token.
       */
      const user = verify(token, process.env.JWT_SECRET as string, {
        issuer: process.env.JWT_ISSUER,
      }) as AuthUser;
      return user;
    };
  }
}
