export interface DynamicLinkProviderInterface {
  create(
    message: DynamicLinkMessage,
  ): Promise<{shortLink: string; previewLink: string}>;
  prepareDeepLinkData(params: UrlParams): Promise<DynamicLinkMessage>;
}

export type DynamicLinkProviderConfig = {
  apiKey: string;
  googleDynamicLinkUri: string;
};

/**
 * Data required to create dynamic link
 *  - domainUriPrefix : default uri that was configured and verified on firebase
 *  - link : link you want to send
 *  - androidInfo : object containing app package name in key androidPackageName
 *  - iosInfo : object containing app package name in key iosBundleId (optional)
 *  - suffix : object with key options set as UNGUESSABLE (avoids being guessed)
 */
export type DynamicLinkMessage = {
  domainUriPrefix: string;
  link: string;
  androidInfo: {
    androidPackageName: string;
  };
  iosInfo?: {
    iosBundleId: string;
  };
  st?: string; // title
  sd?: string; // description
  si?: string; // icon url
};

export type UrlParams = {
  [key: string]: string | number;
};
