import { httpApi } from './http.api';

export interface LoginResponseDto {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshResponseDto extends LoginResponseDto {}

export function getAnonymousToken(): Promise<LoginResponseDto> {
  return httpApi.post<LoginResponseDto>('auth/anonymous').then(({ data }) => data);
}
