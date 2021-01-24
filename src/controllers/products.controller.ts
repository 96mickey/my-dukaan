import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
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
import {ErrorKeys, Permissions} from '../enums';
import {Products, ProductsDTO} from '../models';
import {
  CategoryRepository,
  ProductRepository,
  StoreRepository,
} from '../repositories';

export class ProductsController {
  constructor(
    @repository(ProductRepository)
    public productRepository: ProductRepository,
    @repository(CategoryRepository)
    public categoryRepository: CategoryRepository,
    @repository(StoreRepository)
    public storeRepository: StoreRepository,
    @inject(AuthenticationBindings.CURRENT_USER)
    private readonly user: IAuthUserWithPermissions | undefined,
  ) {}

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [Permissions.CREATE_PRODUCTS]})
  @post('/products', {
    responses: {
      '200': {
        description: 'Product model instance',
        content: {'application/json': {schema: getModelSchemaRef(Products)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProductsDTO, {
            title: 'NewProduct',
          }),
        },
      },
    })
    product: Omit<ProductsDTO, 'id'>,
  ): Promise<Products> {
    if (!this.user) {
      throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
    }
    const productToCreate = new Products({...product});
    const category = await this.categoryRepository.findOne({
      where: {
        name: product.category.toLowerCase(),
      },
    });

    const storeToAttach = await this.storeRepository.findById(product.storeId);

    if (
      !storeToAttach ||
      !storeToAttach.id ||
      storeToAttach.sellerId !== this.user.id
    ) {
      throw new HttpErrors.BadRequest(ErrorKeys.IncorrectStoreDetails);
    }

    if (!category) {
      const categoryToCreate = await this.categoryRepository.create({
        name: product.category.toLowerCase(),
      });

      productToCreate.categoryId = categoryToCreate.id as string;
    } else productToCreate.categoryId = category?.id ?? '';
    delete (productToCreate as any).category;
    return this.productRepository.create(productToCreate);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [Permissions.VIEW_PRODUCTS]})
  @get('/products/count', {
    responses: {
      '200': {
        description: 'Product model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(@param.where(Products) where?: Where<Products>): Promise<Count> {
    return this.productRepository.count(where);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [Permissions.VIEW_PRODUCTS]})
  @get('/products', {
    responses: {
      '200': {
        description: 'Array of Product model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Products, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Products) filter?: Filter<Products>,
  ): Promise<Products[]> {
    return this.productRepository.find(filter);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [Permissions.UPDATE_PRODUCTS]})
  @patch('/products', {
    responses: {
      '200': {
        description: 'Product PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Products, {partial: true}),
        },
      },
    })
    product: Products,
    @param.where(Products) where?: Where<Products>,
  ): Promise<Count> {
    return this.productRepository.updateAll(product, where);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [Permissions.VIEW_PRODUCTS]})
  @get('/products/{id}', {
    responses: {
      '200': {
        description: 'Product model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Products, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Products, {exclude: 'where'})
    filter?: FilterExcludingWhere<Products>,
  ): Promise<Products> {
    return this.productRepository.findById(id, filter);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [Permissions.UPDATE_PRODUCTS]})
  @patch('/products/{id}', {
    responses: {
      '204': {
        description: 'Product PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Products, {partial: true}),
        },
      },
    })
    product: Products,
  ): Promise<void> {
    await this.productRepository.updateById(id, product);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [Permissions.UPDATE_PRODUCTS]})
  @put('/products/{id}', {
    responses: {
      '204': {
        description: 'Product PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() product: Products,
  ): Promise<void> {
    await this.productRepository.replaceById(id, product);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [Permissions.DELETE_PRODUCTS]})
  @del('/products/{id}', {
    responses: {
      '204': {
        description: 'Product DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.productRepository.deleteById(id);
  }
}
