import { defineMiddleware } from 'astro:middleware';
import { isAdmin } from './lib/auth';

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  const isLogin = pathname === '/admin/login';
  if (pathname.startsWith('/admin') && !isLogin && !isAdmin(context.cookies)) {
    return context.redirect('/admin/login');
  }
  if (isLogin && isAdmin(context.cookies)) {
    return context.redirect('/admin');
  }
  return next();
});
