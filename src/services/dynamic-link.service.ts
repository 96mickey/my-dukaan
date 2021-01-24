import {BindingScope, Getter, inject, injectable} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {IAuthUserWithPermissions} from '@sourceloop/core';
import {AuthenticationBindings, AuthErrorKeys} from 'loopback4-authentication';
import {DynamicLinkProviderBindings} from '../providers/keys';
import {
  DynamicLinkMessage,
  DynamicLinkProviderConfig,
  UrlParams,
} from '../providers/types';

const fetch = require('request-promise');

@injectable({scope: BindingScope.TRANSIENT})
export class DeepLinkService {
  constructor(
    @inject(DynamicLinkProviderBindings.config, {optional: true})
    private readonly config: DynamicLinkProviderConfig,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    protected readonly getCurrentUser: Getter<
      IAuthUserWithPermissions | undefined
    >,
  ) {
    if (!config || !config.apiKey || !config.googleDynamicLinkUri) {
      // This won't be a run time error, hence sent as string
      throw new HttpErrors.ExpectationFailed(
        'Dynamic link config not provided !',
      );
    }
  }

  async create(message: DynamicLinkMessage) {
    try {
      let longDynamicLink = `${
        message.domainUriPrefix
      }?link=${encodeURIComponent(message.link)}&apn=${
        message.androidInfo.androidPackageName
      }`;

      if (message.sd) {
        longDynamicLink += `&sd=${message.sd}`;
      }

      if (message.st) {
        longDynamicLink += `&st=${message.st}`;
      }

      if (message.si) {
        longDynamicLink += `&si=${message.si}`;
      }

      // send http request from here
      return fetch({
        uri: this.config.googleDynamicLinkUri + this.config.apiKey,
        method: 'POST',
        json: true,
        body: {
          longDynamicLink,
          suffix: {
            option: 'UNGUESSABLE',
          },
        },
      });
    } catch (err) {
      console.log(err); // NOSONAR
      throw new HttpErrors.InternalServerError(AuthErrorKeys.UnknownError);
    }
  }

  async prepareDeepLinkData(param: UrlParams) {
    let dynamicDeepUrl = process.env.SERVER_URL;
    Object.entries(param).forEach((item, index) => {
      if (index) {
        dynamicDeepUrl += `&${item[0]}=${item[1]}`;
      } else {
        dynamicDeepUrl += `?${item[0]}=${item[1]}`;
      }
    });
    return {
      domainUriPrefix: process.env.FIREBASE_DYNAMIC_LINK_PREFIX ?? '',
      link: dynamicDeepUrl ?? '',
      androidInfo: {
        androidPackageName: process.env.ANDROID_PACKAGE_NAME ?? '',
      },
      iosInfo: {
        iosBundleId: '',
      },
    };
  }
}
