/**
 * Cloudinary URL'lerine mobil uyumlu dönüşümler ekler (w, c_limit, f_auto, q_auto).
 * Cloudinary dışı URL'leri olduğu gibi döndürür.
 */
export function optimizeMobileImageUrl(
  url: string | null | undefined,
  width = 800
): string | null {
  if (!url || typeof url !== 'string') return null;
  if (!url.includes('res.cloudinary.com')) return url;

  const marker = '/upload/';
  const idx = url.indexOf(marker);
  if (idx === -1) return url;

  const after = url.slice(idx + marker.length);
  if (after.startsWith('v') && /^v[0-9]+\//.test(after)) {
    return url;
  }

  const transform = `w_${width},c_limit,f_auto,q_auto`;
  if (after.includes(transform)) return url;

  return `${url.slice(0, idx + marker.length)}${transform}/${after}`;
}

export function optimizeMobileImageUrls(
  urls: string[],
  width?: number
): string[] {
  return urls
    .map((u) => optimizeMobileImageUrl(u, width))
    .filter((u): u is string => u !== null);
}
