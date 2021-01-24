import {BindingKey} from '@loopback/core';
import {DynamicLinkProviderInterface} from './providers/types';

export namespace DynamicLinkBindings {
  export const DynamicLinkProvider = BindingKey.create<DynamicLinkProviderInterface>(
    'sf.dynamic.link.provider',
  );
}
