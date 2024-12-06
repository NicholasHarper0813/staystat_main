import { Response } from 'express';

export const setCookie = (
  res: Response,
  name: string,
  value: string,
  cookieOptions: Record<string, any> = {},
) => {
  res.cookie(name, value, {
    ...cookieOptions,
  });
};

export function clearCookie(res: Response, name: string) {
  res.clearCookie(name);
}
