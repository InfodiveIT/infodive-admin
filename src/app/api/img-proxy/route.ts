import { NextRequest, NextResponse } from 'next/server';

// Proxy de imagens usado pelo gerador de portfólio PDF.
// O navegador não consegue ler (via canvas) imagens de outro domínio sem CORS,
// então o painel pede a imagem aqui e o servidor a busca. Só hosts conhecidos.

export const dynamic = 'force-dynamic';

const MAX_BYTES = 8 * 1024 * 1024;
const MAX_REDIRECTS = 3;

const isAllowedHost = (hostname: string): boolean => {
  const host = hostname.toLowerCase();
  return (
    host === 'infodive.com.br' ||
    host.endsWith('.infodive.com.br') ||
    host.endsWith('.supabase.co') ||
    host.endsWith('.railway.app') ||
    host === 'localhost' ||
    host === '127.0.0.1'
  );
};

const parseAllowed = (raw: string): URL | null => {
  try {
    const url = new URL(raw);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
    if (url.protocol === 'http:' && url.hostname !== 'localhost' && url.hostname !== '127.0.0.1') return null;
    return isAllowedHost(url.hostname) ? url : null;
  } catch {
    return null;
  }
};

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get('url');
  const initial = raw ? parseAllowed(raw) : null;
  if (!initial) {
    return NextResponse.json({ error: 'URL de imagem não permitida' }, { status: 400 });
  }

  // Segue redirecionamentos manualmente, revalidando o host a cada salto
  // (infodive.com.br redireciona para www.infodive.com.br).
  let target: URL = initial;
  let response: Response | null = null;
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    response = await fetch(target, { redirect: 'manual', cache: 'no-store' }).catch(() => null);
    if (!response) break;
    if (response.status >= 300 && response.status < 400) {
      const location: string | null = response.headers.get('location');
      const next: URL | null = location ? parseAllowed(new URL(location, target).toString()) : null;
      if (!next) {
        response = null;
        break;
      }
      target = next;
      continue;
    }
    break;
  }

  if (!response || !response.ok) {
    return NextResponse.json({ error: 'Não foi possível carregar a imagem' }, { status: 502 });
  }

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.startsWith('image/')) {
    return NextResponse.json({ error: 'O arquivo não é uma imagem' }, { status: 415 });
  }

  const buffer = await response.arrayBuffer();
  if (buffer.byteLength > MAX_BYTES) {
    return NextResponse.json({ error: 'Imagem grande demais' }, { status: 413 });
  }

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'private, max-age=3600',
    },
  });
}
