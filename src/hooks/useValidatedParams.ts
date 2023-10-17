import { Page } from '@app/router/Page';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export function useValidatedParams(paramNames: string[]): Record<string, number | undefined> {
  const params = useParams<Record<string, string>>();
  const navigate = useNavigate();

  const [validatedParams, setValidatedParams] = useState<Record<string, number | undefined>>({});

  useEffect(() => {
    const parsedParams: Record<string, number | undefined> = {};

    for (const name of paramNames) {
      const value = params[name] ? Number(params[name]) : undefined;
      if (params[name] && value != null && isNaN(value)) {
        navigate(Page.error404, { replace: true });
        return;
      }
      parsedParams[name] = value;
    }

    setValidatedParams(parsedParams);
  }, [params, navigate, ...paramNames]);

  return validatedParams;
}
