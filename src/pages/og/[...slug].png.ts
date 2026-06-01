import type { APIRoute } from 'astro';
import { getOgEntries, renderOgPng, type OgEntry } from '../../utils/og';

export function getStaticPaths() {
  return getOgEntries().map((entry) => ({
    params: { slug: entry.slug },
    props: { entry },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const entry = props.entry as OgEntry;
  const png = await renderOgPng(entry);
  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
