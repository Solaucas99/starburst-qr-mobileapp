export interface CognitoLoginResponse {
  ChallengeName?: string;
  Session?: string;
  ChallengeParameters?: Record<string, string>;
  AuthenticationResult?: AuthenticationResultType;
}

export interface AuthenticationResultType {
  AccessToken?: string;
  ExpiresIn?: number;
  TokenType?: string;
  RefreshToken?: string;
  IdToken?: string;
  NewDeviceMetadata?: unknown;
}

export interface CognitoGetUserResponse {
  data: {
    Username: string;
    UserAttributes: {Name: string; Value: string}[];
    MFAOptions?: unknown;
    PreferredMfaSetting?: unknown;
    UserMFASettingList?: unknown;
  };
}
