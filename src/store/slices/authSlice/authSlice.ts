import { RefreshResponseDto, getAnonymousToken } from '@app/api/auth.api';
import {
  readAccessToken,
  readRefreshToken,
  persistAccessToken,
  persistRefreshToken,
} from '@app/services/localStorage.service';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export interface AuthSlice {
  accessToken: string | null;
  refreshToken: string | null;
}

const initialState: AuthSlice = {
  accessToken: readAccessToken(),
  refreshToken: readRefreshToken(),
};

export const doLogin = createAsyncThunk('auth/doLogin', async () => {
  const res = await getAnonymousToken();
  persistAccessToken(res.accessToken);
  persistRefreshToken(res.refreshToken);

  return res;
});

export const updateTokens = createAsyncThunk('auth/updateTokens', async (tokens: RefreshResponseDto) => {
  persistAccessToken(tokens.accessToken);
  persistRefreshToken(tokens.refreshToken);

  return tokens;
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(updateTokens.fulfilled, (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    });

    builder.addCase(doLogin.fulfilled, (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    });
  },
});
