import type { PdfImage } from './types';

const PROXY_PATH = '/api/img-proxy';

const isSameOrigin = (url: string): boolean => {
  if (url.startsWith('/') && !url.startsWith('//')) return true;
  try {
    return new URL(url).origin === window.location.origin;
  } catch {
    return false;
  }
};

const decodeImage = (objectUrl: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Falha ao decodificar imagem'));
    img.src = objectUrl;
  });

// Busca direta primeiro (Supabase e infodive.com.br liberam CORS); se falhar, usa o proxy do admin.
const fetchImageBlob = async (url: string): Promise<Blob | null> => {
  const attempts = isSameOrigin(url) ? [url] : [url, `${PROXY_PATH}?url=${encodeURIComponent(url)}`];
  for (const attempt of attempts) {
    try {
      const response = await fetch(attempt, { mode: 'cors' });
      if (!response.ok) continue;
      const blob = await response.blob();
      if (blob.type.startsWith('image/') || blob.size > 0) return blob;
    } catch {
      // tenta a próxima forma
    }
  }
  return null;
};

// Logos pensados para fundo escuro têm bastante branco; sobre papel branco sumiriam.
const mostlyLight = (ctx: CanvasRenderingContext2D, width: number, height: number): boolean => {
  try {
    const { data } = ctx.getImageData(0, 0, width, height);
    let light = 0;
    let dark = 0;
    let opaque = 0;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 128) continue;
      opaque++;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
      const spread = Math.max(r, g, b) - Math.min(r, g, b);
      if (lum > 0.82 && spread < 40) light++;
      else if (lum < 0.25 && spread < 60) dark++;
    }
    return opaque > 0 && light > dark && light / opaque > 0.15;
  } catch {
    return false;
  }
};

// Converte tipografia/elementos brancos neutros (como o texto de Red Hat e AWS) para escuro (#141413),
// preservando elementos coloridos da marca (chapéu vermelho da Red Hat, seta laranja da AWS) e o canal alpha.
const darkenLightNeutralPixels = (ctx: CanvasRenderingContext2D, width: number, height: number): void => {
  try {
    const imageData = ctx.getImageData(0, 0, width, height);
    const { data } = imageData;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] === 0) continue;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const spread = Math.max(r, g, b) - Math.min(r, g, b);
      const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
      if (spread < 40 && lum > 0.65) {
        data[i] = 20;
        data[i + 1] = 20;
        data[i + 2] = 19;
      }
    }
    ctx.putImageData(imageData, 0, 0);
  } catch {
    // fallback silencioso caso o canvas não permita leitura/escrita
  }
};

/**
 * Baixa uma imagem (SVG, WEBP, JPG, PNG…) e converte para PNG em data URL,
 * que é o formato que o gerador de PDF aceita com segurança.
 * Retorna null se não for possível carregar (o PDF segue sem a imagem).
 */
export async function loadImageAsPng(
  url: string | null | undefined,
  maxWidth = 520,
  forLightBg = false,
): Promise<PdfImage | null> {
  if (!url) return null;
  let objectUrl: string | null = null;
  try {
    const blob = await fetchImageBlob(url);
    if (!blob) return null;
    objectUrl = URL.createObjectURL(blob);

    const img = await decodeImage(objectUrl);
    const naturalW = img.naturalWidth || 300;
    const naturalH = img.naturalHeight || 150;
    // Normaliza para ~maxWidth: reduz imagens grandes e amplia SVGs pequenos (vetoriais) com nitidez.
    const scale = Math.min(3, maxWidth / naturalW);
    const width = Math.max(1, Math.round(naturalW * scale));
    const height = Math.max(1, Math.round(naturalH * scale));

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(img, 0, 0, width, height);

    const isMostlyLight = mostlyLight(ctx, width, height);
    if (forLightBg && isMostlyLight) {
      darkenLightNeutralPixels(ctx, width, height);
      return { src: canvas.toDataURL('image/png'), ratio: naturalW / naturalH, needsDarkBg: false };
    }

    return { src: canvas.toDataURL('image/png'), ratio: naturalW / naturalH, needsDarkBg: isMostlyLight };
  } catch {
    return null;
  } finally {
    if (objectUrl) URL.revokeObjectURL(objectUrl);
  }
}
