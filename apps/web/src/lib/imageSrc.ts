/**
 * `next/image` solo optimiza hosts declarados en `next.config.mjs`
 * (`res.cloudinary.com`) y rutas del propio sitio. Como el admin puede pegar
 * cualquier link en el CMS, los demás hosts se sirven sin optimizar en vez de
 * tirar un error en runtime.
 */
export function isOptimizableImage(src: string): boolean {
  return src.startsWith('/') || /^https:\/\/res\.cloudinary\.com\//.test(src);
}
