import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterBuilder,
  FilterExcludingWhere,
  repository,
  Where,
  WhereBuilder,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  patch,
  post,
  put,
  requestBody,
} from '@loopback/rest';
import {IAuthUserWithPermissions} from '@sourceloop/core';
import {
  authenticate,
  AuthenticationBindings,
  AuthErrorKeys,
  STRATEGY,
} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {ErrorKeys, PageRef, Permissions} from '../enums';
import {Store} from '../models';
import {DynamicLinkProviderInterface} from '../providers/types';
import {StoreRepository} from '../repositories';

export class StoreController {
  constructor(
    @repository(StoreRepository)
    public storeRepository: StoreRepository,
    @inject(AuthenticationBindings.CURRENT_USER)
    private readonly user: IAuthUserWithPermissions | undefined,
    @inject('services.DeepLinkService')
    public dynamicLinkProvider: DynamicLinkProviderInterface,
  ) {}

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [Permissions.CREATE_STORE]})
  @post('/stores', {
    responses: {
      '200': {
        description: 'Store model instance',
        content: {'application/json': {schema: getModelSchemaRef(Store)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Store, {
            title: 'NewStore',
            exclude: ['id'],
          }),
        },
      },
    })
    store: Omit<Store, 'id'>,
  ): Promise<{id: string; link: string}> {
    if (!this.user) {
      throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
    }
    store.sellerId = this.user.id;

    const createdStore = await this.storeRepository.create(store);

    const dynamicLinkData = await this.dynamicLinkProvider.prepareDeepLinkData({
      pageRef: PageRef.STORE,
      creator: this.user.id ?? '',
      objectRef: createdStore.id as string,
    });

    const dynamicLink = await this.dynamicLinkProvider.create({
      ...dynamicLinkData,
      sd: store.description,
      st: store.name,
      si: 'https://homepages.cae.wisc.edu/~ece533/images/airplane.png',
    });

    await this.storeRepository.updateById(createdStore.id, {
      link: dynamicLink.previewLink,
    });

    return {
      id: createdStore.id ?? '',
      link: dynamicLink.previewLink,
    };
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [Permissions.VIEW_STORE]})
  @get('/stores/count', {
    responses: {
      '200': {
        description: 'Store model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(@param.where(Store) where?: Where<Store>): Promise<Count> {
    if (!this.user) {
      throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
    }
    return this.storeRepository.count(
      this._createWhereBuilder(this.user, where).build(),
    );
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [Permissions.VIEW_STORE]})
  @get('/stores', {
    responses: {
      '200': {
        description: 'Array of Store model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Store, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(@param.filter(Store) filter?: Filter<Store>): Promise<Store[]> {
    if (!this.user) {
      throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
    }
    return this.storeRepository.find(
      this._createFilterBuilder(this.user, filter).build(),
    );
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [Permissions.UPDATE_STORE]})
  @patch('/stores', {
    responses: {
      '200': {
        description: 'Store PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Store, {partial: true}),
        },
      },
    })
    store: Store,
    @param.where(Store) where?: Where<Store>,
  ): Promise<Count> {
    if (!this.user) {
      throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
    }
    return this.storeRepository.updateAll(
      store,
      this._createWhereBuilder(this.user, where).build(),
    );
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [Permissions.UPDATE_STORE]})
  @get('/stores/{id}', {
    responses: {
      '200': {
        description: 'Store model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Store, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Store, {exclude: 'where'})
    filter?: FilterExcludingWhere<Store>,
  ): Promise<Store> {
    if (!this.user) {
      throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
    }
    return this.storeRepository.findById(
      id,
      this._createFilterBuilder(this.user, filter).build(),
    );
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [Permissions.UPDATE_STORE]})
  @patch('/stores/{id}', {
    responses: {
      '204': {
        description: 'Store PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Store, {partial: true}),
        },
      },
    })
    store: Store,
  ): Promise<void> {
    if (!this.user) {
      throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
    }
    const storeToUpdate = await this.storeRepository.findById(id);
    if (!storeToUpdate || storeToUpdate.sellerId !== this.user.id) {
      throw new HttpErrors.BadRequest('Store information is not correct!');
    }
    await this.storeRepository.updateById(id, store);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [Permissions.UPDATE_STORE]})
  @put('/stores/{id}', {
    responses: {
      '204': {
        description: 'Store PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() store: Store,
  ): Promise<void> {
    if (!this.user) {
      throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
    }
    const storeToUpdate = await this.storeRepository.findById(id);
    if (!storeToUpdate || storeToUpdate.sellerId !== this.user.id) {
      throw new HttpErrors.BadRequest(ErrorKeys.IncorrectStoreInfo);
    }
    await this.storeRepository.replaceById(id, store);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [Permissions.DELETE_STORE]})
  @del('/stores/{id}', {
    responses: {
      '204': {
        description: 'Store DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    if (!this.user) {
      throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
    }
    const storeToUpdate = await this.storeRepository.findById(id);
    if (!storeToUpdate || storeToUpdate.sellerId !== this.user.id) {
      throw new HttpErrors.BadRequest(ErrorKeys.IncorrectStoreInfo);
    }
    await this.storeRepository.deleteById(id);
  }

  private _createFilterBuilder(
    currentUser: IAuthUserWithPermissions,
    filter: Filter<Store> = {},
  ) {
    const filterBuilder = new FilterBuilder(filter);
    if (filter) {
      const whereBuilder = new WhereBuilder(filter.where);
      whereBuilder.and([
        {
          sellerId: currentUser.id as string,
        },
      ]);
      filterBuilder.where(whereBuilder.build());
    }
    return filterBuilder;
  }

  private _createWhereBuilder(
    currentUser: IAuthUserWithPermissions,
    where: Where<Store> = {},
  ) {
    const whereBuilder = new WhereBuilder(where);
    whereBuilder.and([
      {
        sellerId: currentUser.id as string,
      },
    ]);
    return whereBuilder;
  }
}
