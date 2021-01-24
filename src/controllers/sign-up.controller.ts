import {inject} from '@loopback/context';
import {repository} from '@loopback/repository';
import {
  get,
  HttpErrors,
  post,
  Request,
  requestBody,
  RestBindings,
} from '@loopback/rest';
import {CONTENT_TYPE, ErrorCodes, STATUS_CODE} from '@sourceloop/core';
import * as jwt from 'jsonwebtoken';
import {
  authenticate,
  AuthenticationBindings,
  AuthErrorKeys,
  STRATEGY,
} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {RoleType} from '../enums';
import {AuthUser, SignUpRequest, TokenResponse, User} from '../models';
import {RoleRepository, UserRepository} from '../repositories';

export class SignUpController {
  constructor(
    @inject(RestBindings.Http.REQUEST) private readonly req: Request,
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(RoleRepository)
    public roleRepository: RoleRepository,
    @inject(AuthenticationBindings.CURRENT_USER)
    private readonly user: AuthUser | undefined,
  ) {}

  @authorize({permissions: ['*']})
  @post('/sign-up', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: {'x-ts-type': TokenResponse}}},
      },
    },
  })
  async create(@requestBody() user: SignUpRequest): Promise<TokenResponse> {
    // this needs to be via model validation
    const e164RegEx = /^\+?[1-9]\d{1,14}$/;
    if (user.phone && !e164RegEx.test(user.phone)) {
      throw new HttpErrors.BadRequest('Phone number invalid.');
    }
    // check for duplicate phone
    const userToCheck = await this.userRepository.findOne({
      where: {
        phone: user.phone,
      },
    });

    if (userToCheck?.id) {
      return this.createJWT(userToCheck);
    }

    const userToRegister = new User();
    // only normal user could be added from thi api
    // hence only role type user is permitted via this api
    const role = await this.roleRepository.findOne({
      where: {
        roleKey: RoleType.Seller,
      },
    });
    if (!role || !role.id) {
      throw new HttpErrors.NotFound('Role information is missing.');
    }

    userToRegister.roleId = role.id;

    userToRegister.phone = user.phone;
    userToRegister.username = user.phone;

    const response = await this.userRepository.create(
      userToRegister,
      undefined,
      user.password,
    );

    return this.createJWT(response);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: ['*']})
  @get('/auth/me', {
    description: 'To get the user details',
    responses: {
      [STATUS_CODE.OK]: {
        description: 'User Object',
        content: {
          [CONTENT_TYPE.JSON]: AuthUser,
        },
      },
      ...ErrorCodes,
    },
  })
  async me(): Promise<AuthUser | undefined> {
    if (!this.user) {
      throw new HttpErrors.Unauthorized(AuthErrorKeys.TokenInvalid);
    }
    return new AuthUser(this.user);
  }

  private async createJWT(payload: User): Promise<TokenResponse> {
    try {
      const accessToken = jwt.sign(
        payload.toJSON(),
        process.env.JWT_SECRET as string,
        {
          expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRATION),
          issuer: process.env.JWT_ISSUER,
        },
      );

      /**
       * refresh token goes into redis and is helful to generate access token
       * once it is expired. This is saved in redis and from there it is used
       * while refreshing token
       */

      return new TokenResponse({accessToken});
    } catch (error) {
      throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
    }
  }
}
