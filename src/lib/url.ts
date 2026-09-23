function basePath() {
  return import.meta.env.BASE_URL.replace(/\/$/, '');
}

export function withBase(path: string) {
  if (!path || /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(path)) return path;
  const suffix = path.startsWith('/') ? path : `/${path}`;
  return `${basePath()}${suffix}`;
}

export function withoutBase(pathname: string) {
  const base = basePath();
  if (!base) return pathname || '/';
  if (pathname === base) return '/';
  if (pathname.startsWith(`${base}/`)) return pathname.slice(base.length);
  return pathname || '/';
}
