import { Loading } from '@app/components/Loading/Loading';
import { useAppDispatch, useAppSelector } from '@app/hooks/storeHooks';
import { doLogin } from '@app/store/slices/authSlice/authSlice';
import { WithChildrenProps } from '@app/types/commonTypes';
import React, { useEffect } from 'react';

export const RequireAuth: React.FC<WithChildrenProps> = ({ children }) => {
  const token = useAppSelector((state) => state.auth.accessToken);
  const dispatch = useAppDispatch();

  const isLoading = token === null;

  useEffect(() => {
    if (!token) {
      dispatch(doLogin());
    }
  }, [token]);

  if (isLoading) {
    return <Loading />;
  }

  return children;
};
