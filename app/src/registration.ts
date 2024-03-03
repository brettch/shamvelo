import { RefreshTokenResponse, Strava, default as strava1 } from 'strava-v3';

// Work around a problem with TypeScript types. The default export implements the Strava
// interface but the types say it only has a 'default' attribute which in turn implements
// the Strava interface.
const strava2: unknown = strava1;
const strava: Strava = strava2 as Strava;

export type Token = Pick<RefreshTokenResponse, "access_token" | "refresh_token" | "expires_at" | "expires_in" >;

export interface TokenWithId extends Token {
  id: number,
}

export interface TokenAccess {
  get: (id: number) => Promise<TokenWithId>,
  refresh: (token: TokenWithId) => Promise<TokenWithId>,
}

export interface Registration {
  getOAuthRequestAccessUrl: () => string,
  registerUser: (authorizationCode: string) => Promise<number>;
}

export interface API {
  tokenAccess: TokenAccess,
  registration: Registration,
}

export function start(getToken: (id: number) => Promise<TokenWithId>, saveToken: (token: TokenWithId) => Promise<void>, getIdForToken: (token: Token) => Promise<number>): API {
  return {
    tokenAccess: {
      get: getToken,
      refresh: refreshToken,
    },
    registration: {
      getOAuthRequestAccessUrl,
      registerUser,
    },
  };

  async function registerUser(authorizationCode: string): Promise<number> {
    console.log('Getting OAuth token using authorization code ' + authorizationCode);
    const rawToken = await strava.oauth.getToken(authorizationCode) as RefreshTokenResponse;
    const slimToken = pickTokenFields(rawToken);
    const id = await getIdForToken(slimToken);
    const tokenWithId = {
      ...slimToken,
      id,
    };
    await saveToken(tokenWithId);
    return id;
  }

  async function refreshToken(existingToken: TokenWithId): Promise<TokenWithId> {
    const rawToken = await strava.oauth.refreshToken(existingToken.refresh_token);
    const slimToken = pickTokenFields(rawToken);
    const updatedTokenWithId = {
      ...slimToken,
      id: existingToken.id,
    };
    await saveToken(updatedTokenWithId);
    return updatedTokenWithId;
  }
}

function getOAuthRequestAccessUrl(): string {
  console.log('Generating OAuth request access URL');
  // Force the type to any and then string. The types say the method returns a Promise which is incorrect.
  const accessUrl: unknown = strava.oauth.getRequestAccessURL({
    scope : ['read', 'activity:read']
  });
  const accessUrlString = accessUrl as string;
  console.log('Access URL: ' + accessUrlString);
  return accessUrlString;
}

function pickTokenFields(token: RefreshTokenResponse): Token {
  return {
    access_token: token.access_token,
    refresh_token: token.refresh_token,
    expires_at: token.expires_at,
    expires_in: token.expires_in,
  };
}
