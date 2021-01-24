import {BindingKey} from '@loopback/core';
import {DynamicLinkProviderConfig} from './types';

export namespace DynamicLinkProviderBindings {
  export const config = BindingKey.create<DynamicLinkProviderConfig>(
    'sf.dynamic.link.provider.config',
  );
}
