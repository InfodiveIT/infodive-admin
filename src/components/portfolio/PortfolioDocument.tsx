import React from 'react';
import {
  Document,
  Page,
  View,
  Text,
  Image,
  Svg,
  Defs,
  LinearGradient,
  Stop,
  Path,
  Polyline,
  Line,
  Ellipse,
  Circle,
  Link,
  Rect,
  Font,
  StyleSheet,
} from '@react-pdf/renderer';
import { iconFor, type IconNode } from '@/lib/portfolio/icons';
import type { PortfolioDocumentData, PdfImage, PdfProdutoDestaque, PdfTituloDescricao } from '@/lib/portfolio/types';

// ── Marca (extraída do folder impresso) ──────────────────────────────────────
const C = {
  ink: '#141413',
  body: '#3d3d46',
  muted: '#6b6b76',
  white: '#ffffff',
  dark: '#1c1a1b',
  red: '#d62a35',
  coral: '#e8505b',
  indigo: '#3b37bd',
  navy: '#26195c',
  deep: '#241c6b',
  blue: '#0E66FF',
};

const CARD_COLORS = [C.navy, C.indigo, C.red, C.deep];

let fontsRegistered = false;
export function registerPortfolioFonts(baseUrl: string) {
  if (fontsRegistered) return;
  fontsRegistered = true;
  const base = baseUrl.replace(/\/$/, '');
  Font.register({
    family: 'IBMPlex',
    fonts: [
      { src: `${base}/ibm-plex-sans-latin-400-normal.woff`, fontWeight: 400 },
      { src: `${base}/ibm-plex-sans-latin-500-normal.woff`, fontWeight: 500 },
      { src: `${base}/ibm-plex-sans-latin-600-normal.woff`, fontWeight: 600 },
      { src: `${base}/ibm-plex-sans-latin-700-normal.woff`, fontWeight: 700 },
    ],
  });
  // Evita quebra de palavras com hífen automático (pt-BR fica estranho)
  Font.registerHyphenationCallback((word) => [word]);
}

const s = StyleSheet.create({
  page: { fontFamily: 'IBMPlex', fontSize: 9, color: C.ink, backgroundColor: C.white, flexDirection: 'column' },
  pad: { paddingHorizontal: 36 },
});

// ── Primitivos ───────────────────────────────────────────────────────────────

type GradStop = { offset: string; color: string };

const Gradient = ({
  id,
  stops,
  x2 = '1',
  y2 = '0',
}: {
  id: string;
  stops: GradStop[];
  x2?: string;
  y2?: string;
}) => (
  <Svg
    viewBox="0 0 100 100"
    preserveAspectRatio="none"
    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
  >
    <Defs>
      <LinearGradient id={id} x1="0" y1="0" x2={x2} y2={y2}>
        {stops.map((st, i) => (
          <Stop key={i} offset={st.offset} stopColor={st.color} />
        ))}
      </LinearGradient>
    </Defs>
    <Rect x="0" y="0" width="100" height="100" fill={`url(#${id})`} />
  </Svg>
);

const BRAND_BAR: GradStop[] = [
  { offset: '0', color: C.red },
  { offset: '0.5', color: '#8a3fa8' },
  { offset: '1', color: C.indigo },
];

const AccentBar = ({ id }: { id: string }) => (
  <View style={{ width: 4, borderRadius: 2, marginRight: 14, overflow: 'hidden' }}>
    <Gradient id={id} stops={BRAND_BAR} x2="0" y2="1" />
  </View>
);

const Pill = ({ children, light, center }: { children: string; light?: boolean; center?: boolean }) => (
  <View
    style={{
      alignSelf: center ? 'center' : 'flex-start',
      borderWidth: 1,
      borderColor: light ? '#6f66a8' : '#9d8fd6',
      borderRadius: 24,
      paddingVertical: 7,
      paddingHorizontal: 24,
    }}
  >
    <Text style={{ fontSize: 15, fontWeight: 700, color: light ? C.white : C.ink }}>{children}</Text>
  </View>
);

const Contain = ({ img, width, height }: { img: PdfImage; width: number; height: number }) => {
  // Mantém proporção dentro da caixa width x height
  let w = width;
  let h = width / img.ratio;
  if (h > height) {
    h = height;
    w = height * img.ratio;
  }
  return <Image src={img.src} style={{ width: w, height: h }} />;
};

// Envolve o conteúdo num link clicável do PDF quando houver endereço
const MaybeLink = ({ href, style, children }: { href?: string | null; style?: any; children: React.ReactNode }) =>
  href ? (
    <Link src={href} style={{ textDecoration: 'none', ...(style || {}) }}>
      {children}
    </Link>
  ) : (
    <View style={style}>{children}</View>
  );

const chunk = <T,>(arr: T[], size: number): T[][] => {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

const lines = (text: string): string[] =>
  text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

// ── Seções ───────────────────────────────────────────────────────────────────

const COLS = 4;
const GAP = 10;
const CONTENT_WIDTH = 595.28 - 72; // A4 menos margens laterais
const CARD_WIDTH = (CONTENT_WIDTH - GAP * (COLS - 1)) / COLS;
const FAB_COLS = 5;

const SolucaoCards = ({ cards, header }: { cards: PortfolioDocumentData['solucoes']; header: React.ReactNode }) => {
  const rows = chunk(cards, COLS);
  let index = 0;
  // Cada linha é um bloco direto da página (o react-pdf espreme linhas quando um contêiner
  // quebrável começa no pé da página). A 1ª linha leva junto o título "Nosso portfólio".
  return (
    <>
      {rows.map((row, r) => (
        <View
          key={r}
          wrap={false}
          style={{ flexShrink: 0, paddingHorizontal: 36, paddingTop: r === 0 ? 24 : 0, paddingBottom: r === rows.length - 1 ? 14 : 0 }}
        >
          {r === 0 ? <View style={{ marginBottom: 18 }}>{header}</View> : null}
          <View style={{ flexDirection: 'row', marginBottom: GAP, flexShrink: 0 }}>
          {Array.from({ length: COLS }).map((_, c) => {
            const card = row[c];
            if (!card) return null;
            const color = CARD_COLORS[index++ % CARD_COLORS.length];
            return (
              <View
                key={c}
                style={{
                  width: CARD_WIDTH,
                  marginRight: c < COLS - 1 ? GAP : 0,
                  backgroundColor: color,
                  borderRadius: 14,
                  paddingVertical: 14,
                  paddingHorizontal: 12,
                  minHeight: 118,
                }}
              >
                <Text style={{ color: C.white, fontSize: 11, fontWeight: 700, lineHeight: 1.25 }}>{card.titulo}</Text>
                <View style={{ width: 18, height: 2, borderRadius: 1, backgroundColor: 'rgba(255,255,255,0.45)', marginTop: 9, marginBottom: 8 }} />
                {card.descricao ? (
                  <Text style={{ color: '#e9e7fb', fontSize: 8, lineHeight: 1.45 }}>{card.descricao}</Text>
                ) : null}
              </View>
            );
          })}
          </View>
        </View>
      ))}
    </>
  );
};

const Diferenciais = ({ titulo, itens }: { titulo: string; itens: string[] }) => {
  const half = Math.ceil(itens.length / 2);
  const columns = [itens.slice(0, half), itens.slice(half)];
  return (
    <View style={{ backgroundColor: C.dark, paddingTop: 20, paddingBottom: 22, paddingHorizontal: 36, alignItems: 'center' }}>
      <Pill light center>{titulo}</Pill>
      <View style={{ flexDirection: 'row', marginTop: 16, alignSelf: 'stretch', justifyContent: 'center' }}>
        {columns.map((col, i) => (
          <View key={i} style={{ flex: 1, paddingLeft: i === 0 ? 70 : 30 }}>
            {col.map((item, j) => (
              <View key={j} style={{ flexDirection: 'row', marginBottom: 6, alignItems: 'center' }}>
                <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: C.coral, marginRight: 9 }} />
                <Text style={{ color: C.white, fontSize: 11.5, fontWeight: 400 }}>{item}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

const FabRow = ({ row }: { row: PortfolioDocumentData['fabricantes'] }) => (
  <View style={{ flexDirection: 'row', marginBottom: 6 }}>
    {Array.from({ length: FAB_COLS }).map((_, c) => {
      const f = row[c];
      return (
        <View key={c} style={{ flex: 1, height: 44, alignItems: 'center', justifyContent: 'center' }}>
          {f ? (
            <MaybeLink href={f.href}>
            <View
              style={{
                width: 88,
                height: 40,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: f.logo?.needsDarkBg ? C.dark : '#e7e6ee',
                backgroundColor: f.logo?.needsDarkBg ? C.dark : C.white,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 8,
              }}
            >
              {f.logo ? (
                <Contain img={f.logo} width={70} height={26} />
              ) : (
                <Text style={{ fontSize: 8.5, fontWeight: 600, color: C.body, textAlign: 'center' }}>{f.nome}</Text>
              )}
            </View>
            </MaybeLink>
          ) : null}
        </View>
      );
    })}
  </View>
);

const Fabricantes = ({ titulo, items }: { titulo: string; items: PortfolioDocumentData['fabricantes'] }) => {
  const rows = chunk(items, FAB_COLS);
  return (
    <>
      {rows.map((row, r) => (
        <View key={r} wrap={false} style={[s.pad, { flexShrink: 0, paddingTop: r === 0 ? 26 : 0, paddingBottom: r === rows.length - 1 ? 18 : 0 }]}>
          {r === 0 ? (
            <View style={{ flexDirection: 'row', marginBottom: 16 }}>
              <AccentBar id="fabBar" />
              <Text style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.25, width: 300 }}>{titulo}</Text>
            </View>
          ) : null}
          <FabRow row={row} />
        </View>
      ))}
    </>
  );
};

const Servicos = ({ titulo, items }: { titulo: string; items: string[] }) => {
  const per = Math.ceil(items.length / 3);
  const columns = [items.slice(0, per), items.slice(per, per * 2), items.slice(per * 2)].filter((c) => c.length > 0);
  return (
    <View style={{ backgroundColor: C.dark, paddingTop: 26, paddingBottom: 22, paddingHorizontal: 44 }}>
      <Pill light center>Nossos serviços</Pill>
      <Text style={{ color: '#d4d3dc', fontSize: 11, textAlign: 'center', lineHeight: 1.4, marginTop: 12, paddingHorizontal: 30 }}>{titulo}</Text>
      <View style={{ flexDirection: 'row', marginTop: 18 }}>
        {columns.map((col, i) => (
          <View key={i} style={{ flex: 1, paddingRight: 10 }}>
            {col.map((item, j) => (
              <View key={j} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <View style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: j % 2 === 0 ? C.coral : '#7b6df0', marginRight: 10 }} />
                <Text style={{ color: '#d4d3dc', fontSize: 9.5, flex: 1 }}>{item}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

const Cta = ({ data, fill }: { data: PortfolioDocumentData; fill: boolean }) => {
  const { config, qr, logo } = data;
  const contatos = [config.email, config.telefone, config.endereco].filter(Boolean);
  const vendedor = config.vendedor.trim();
  return (
    <View style={{ flexGrow: fill ? 1 : 0, justifyContent: 'center', paddingTop: fill ? 24 : 34, paddingBottom: fill ? 18 : 28, paddingHorizontal: 40 }}>
      <Gradient
        id="ctaBg"
        stops={[
          { offset: '0', color: C.dark },
          { offset: '0.45', color: '#2a2275' },
          { offset: '0.8', color: '#5a2a7a' },
          { offset: '1', color: '#b8353f' },
        ]}
        x2="1"
        y2="1"
      />
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flex: 1, paddingRight: 24 }}>
          <Text style={{ color: C.white, fontSize: 18, fontWeight: 700, lineHeight: 1.25 }}>{config.ctaTitulo}</Text>
          <Text style={{ color: '#cfcce6', fontSize: 10, marginTop: 8, lineHeight: 1.4 }}>{config.ctaTexto}</Text>
          {vendedor ? (
            <View style={{ marginTop: 16 }}>
              <Text style={{ color: '#a9a5cc', fontSize: 7.5, letterSpacing: 0.6 }}>SEU CONTATO NA INFODIVE</Text>
              <Text style={{ color: C.white, fontSize: 13, fontWeight: 700, marginTop: 3 }}>{vendedor}</Text>
            </View>
          ) : null}
          {contatos.length > 0 && (
            <View style={{ marginTop: vendedor ? 8 : 16 }}>
              {contatos.map((c, i) => (
                <Text key={i} style={{ color: C.white, fontSize: 9.5, marginBottom: 3 }}>
                  {c}
                </Text>
              ))}
            </View>
          )}
        </View>
        {qr && (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ backgroundColor: C.white, borderRadius: 8, padding: 7 }}>
              <Image src={qr} style={{ width: 84, height: 84 }} />
            </View>
            <View style={{ marginLeft: 12 }}>
              <Text style={{ color: C.white, fontSize: 12, lineHeight: 1.3 }}>Acesse</Text>
              <Text style={{ color: C.white, fontSize: 12, lineHeight: 1.3 }}>nosso</Text>
              <Text style={{ color: C.white, fontSize: 12, lineHeight: 1.3 }}>site</Text>
            </View>
          </View>
        )}
      </View>
      <View style={{ marginTop: 18, alignItems: 'center' }}>
        {logo ? (
          <Contain img={logo} width={150} height={38} />
        ) : (
          <Text style={{ color: C.white, fontSize: 26, fontWeight: 600 }}>Infodive IT</Text>
        )}
        <Text style={{ color: '#a9a5cc', fontSize: 7.5, marginTop: 10 }}>
          {data.config.siteUrl.replace(/^https?:\/\//, '')} · Documento gerado em {data.geradoEm}
        </Text>
      </View>
    </View>
  );
};


// ── Produto em destaque (mesma linguagem da página de produto do site) ──────

const SITE = {
  hero: '#050507',
  brand: '#0E66FF',
  brandTint: '#E4EAFF',
  ink950: '#141413',
  ink600: '#55555c',
  ink500: '#7B7B7B',
  ink300: '#BFBFBF',
  ink200: '#D8D8D8',
  ink50: '#FAFAFA',
};

const LucideIcon = ({ node, size, color, strokeWidth = 1.75 }: { node: IconNode; size: number; color: string; strokeWidth?: number }) => (
  <Svg viewBox="0 0 24 24" style={{ width: size, height: size }}>
    {node.map(([tag, a], i) => {
      const common = { stroke: color, strokeWidth, fill: a.fill === 'currentColor' ? color : 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
      if (tag === 'path') return <Path key={i} d={a.d} {...common} />;
      if (tag === 'circle') return <Circle key={i} cx={a.cx} cy={a.cy} r={a.r} {...common} />;
      if (tag === 'rect') return <Rect key={i} x={a.x ?? '0'} y={a.y ?? '0'} width={a.width} height={a.height} rx={a.rx} ry={a.ry} {...common} />;
      if (tag === 'line') return <Line key={i} x1={a.x1} y1={a.y1} x2={a.x2} y2={a.y2} {...common} />;
      if (tag === 'polyline') return <Polyline key={i} points={a.points} {...common} />;
      return null;
    })}
  </Svg>
);

const Eyebrow = ({ children, center }: { children: string; center?: boolean }) => (
  <Text
    style={{
      color: SITE.brand,
      fontSize: 7.5,
      fontWeight: 600,
      letterSpacing: 1.8,
      textAlign: center ? 'center' : 'left',
      marginBottom: 6,
    }}
  >
    {children.toUpperCase()}
  </Text>
);

const SectionTitle = ({ children, center }: { children: string; center?: boolean }) => (
  <Text style={{ color: SITE.ink950, fontSize: 16, fontWeight: 700, textAlign: center ? 'center' : 'left', lineHeight: 1.25 }}>
    {children}
  </Text>
);

const CheckBadge = () => (
  <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: SITE.brandTint, alignItems: 'center', justifyContent: 'center', marginRight: 8, marginTop: 1 }}>
    <Svg viewBox="0 0 24 24" style={{ width: 8, height: 8 }}>
      <Polyline points="4,12.5 9.5,18 20,6.5" stroke={SITE.brand} strokeWidth={3.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  </View>
);

const LogoChip = ({ img, nome, width, height, dark }: { img: PdfImage | null; nome: string | null; width: number; height: number; dark?: boolean }) => {
  const onDark = img?.needsDarkBg ?? false;
  return (
    <View
      style={{
        width,
        height,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: onDark ? (dark ? '#2a2a2e' : SITE.ink950) : dark ? '#2a2a2e' : SITE.ink200,
        backgroundColor: onDark ? SITE.ink950 : SITE.ink50,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
      }}
    >
      {img ? (
        <Contain img={img} width={width - 20} height={height - 16} />
      ) : (
        <Text style={{ fontSize: 9, fontWeight: 700, color: SITE.ink950 }}>{nome ?? ''}</Text>
      )}
    </View>
  );
};

const CARD3_GAP = 10;
const CARD3_WIDTH = (CONTENT_WIDTH - CARD3_GAP * 2) / 3;

const InfoCardRow = ({ row, check }: { row: PdfTituloDescricao[]; check?: boolean }) => (
  <View style={{ flexDirection: 'row', marginBottom: CARD3_GAP }}>
    {row.map((item, c) => (
      <View
        key={c}
        style={{
          width: CARD3_WIDTH,
          marginRight: c < 2 ? CARD3_GAP : 0,
          backgroundColor: C.white,
          borderWidth: 1,
          borderColor: SITE.ink200,
          borderRadius: 10,
          padding: 12,
          flexDirection: 'row',
        }}
      >
        {check ? <CheckBadge /> : null}
        <View style={{ flex: 1 }}>
          {item.titulo ? <Text style={{ fontSize: 9.5, fontWeight: 700, color: SITE.ink950, marginBottom: 4 }}>{item.titulo}</Text> : null}
          {item.descricao ? <Text style={{ fontSize: 8.5, color: SITE.ink500, lineHeight: 1.45 }}>{item.descricao}</Text> : null}
        </View>
      </View>
    ))}
  </View>
);

// Bloco de topo da área clara do produto. A seção do produto é feita de vários blocos irmãos
// (não um contêiner grande) porque o react-pdf posiciona mal o conteúdo seguinte quando um
// contêiner com fundo é dividido entre páginas. Blocos com o mesmo fundo se emendam sem costura.
const LightBlock = ({ children, top = 0, bottom = 0 }: { children: React.ReactNode; top?: number; bottom?: number }) => (
  <View wrap={false} style={{ backgroundColor: SITE.ink50, paddingHorizontal: 36, paddingTop: top, paddingBottom: bottom, flexShrink: 0 }}>
    {children}
  </View>
);

// O cabeçalho vai junto com a 1ª linha de cards: um título nunca fica sozinho no pé da página.
const InfoCards = ({ header, items, check }: { header: React.ReactNode; items: PdfTituloDescricao[]; check?: boolean }) => {
  const rows = chunk(items, 3);
  return (
    <>
      <LightBlock top={4}>
        {header}
        <View style={{ marginTop: 10 }}>{rows[0] ? <InfoCardRow row={rows[0]} check={check} /> : null}</View>
      </LightBlock>
      {rows.slice(1).map((row, r) => (
        <LightBlock key={r}>
          <InfoCardRow row={row} check={check} />
        </LightBlock>
      ))}
      <LightBlock bottom={12}>{null}</LightBlock>
    </>
  );
};

const FichaTecnica = ({ p }: { p: PdfProdutoDestaque }) => {
  const campos = [
    { label: 'Fabricante', value: p.fabricanteNome, icon: 'building-2' },
    { label: 'Solução', value: p.solucao, icon: 'layers' },
    { label: 'Subcategoria', value: p.subcategoria, icon: 'tag' },
  ].filter((c) => c.value);
  if (campos.length === 0) return null;
  return (
    <View style={{ marginTop: 8, borderWidth: 1, borderColor: SITE.ink200, borderRadius: 12, backgroundColor: C.white, overflow: 'hidden' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: SITE.ink50, borderBottomWidth: 1, borderBottomColor: '#e6e6e6', paddingHorizontal: 14, paddingVertical: 8 }}>
        <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: SITE.brand, marginRight: 7 }} />
        <Text style={{ fontSize: 6.5, fontWeight: 600, letterSpacing: 2, color: SITE.ink500 }}>FICHA TÉCNICA</Text>
      </View>
      <View style={{ flexDirection: 'row' }}>
        {campos.map((c, i) => (
          <View
            key={c.label}
            style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12, borderLeftWidth: i > 0 ? 1 : 0, borderLeftColor: '#e6e6e6' }}
          >
            <View style={{ width: 24, height: 24, borderRadius: 7, backgroundColor: '#EEF3FF', marginRight: 9, alignItems: 'center', justifyContent: 'center' }}>
              <LucideIcon node={iconFor(c.icon)} size={12} color={SITE.brand} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 7, color: SITE.ink500 }}>{c.label}</Text>
              <Text style={{ fontSize: 9.5, fontWeight: 600, color: SITE.ink950, marginTop: 1.5 }}>{c.value}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

// Diagrama estático "produto → serviços" (versão impressa do AnimatedBeam do site)
const ServicosDiagrama = ({ p }: { p: PdfProdutoDestaque }) => {
  const servicos = p.servicos.slice(0, 6);
  if (servicos.length === 0) return null;
  const W = CONTENT_WIDTH;
  const CHIP_H = 26;
  const CHIP_GAP = 8;
  const CHIP_W = 170;
  const PAD = 18;
  const listH = servicos.length * CHIP_H + (servicos.length - 1) * CHIP_GAP;
  const H = Math.max(listH, 64) + PAD * 2;
  const NODE = 58;
  const nodeX = 96;
  const nodeY = (H - NODE) / 2;
  const chipX = W - 96 - CHIP_W;
  const top0 = (H - listH) / 2;
  const fromX = nodeX + NODE;
  const fromY = H / 2;
  return (
    <View style={{ marginTop: 14, width: W, height: H, borderWidth: 1, borderColor: SITE.ink200, borderRadius: 14, backgroundColor: C.white }}>
      <Svg style={{ position: 'absolute', top: 0, left: 0, width: W, height: H }} viewBox={`0 0 ${W} ${H}`}>
        {servicos.map((_, i) => {
          const toY = top0 + i * (CHIP_H + CHIP_GAP) + CHIP_H / 2;
          const midX = (fromX + chipX) / 2;
          const d = `M ${fromX} ${fromY} C ${midX} ${fromY}, ${midX} ${toY}, ${chipX} ${toY}`;
          return (
            <React.Fragment key={i}>
              <Path d={d} stroke={SITE.ink200} strokeWidth={1.4} fill="none" />
              <Path d={d} stroke={SITE.brand} strokeOpacity={0.45} strokeWidth={1} strokeDasharray="3 4" fill="none" />
            </React.Fragment>
          );
        })}
      </Svg>
      <View style={{ position: 'absolute', left: nodeX, top: nodeY, width: NODE, height: NODE, borderRadius: 14, borderWidth: 1, borderColor: SITE.ink200, backgroundColor: p.fabricanteLogo?.needsDarkBg ? SITE.ink950 : C.white, alignItems: 'center', justifyContent: 'center' }}>
        {p.fabricanteLogo ? (
          <Contain img={p.fabricanteLogo} width={42} height={26} />
        ) : (
          <Text style={{ fontSize: 7, fontWeight: 700, color: SITE.ink950 }}>{p.fabricanteNome ?? ''}</Text>
        )}
      </View>
      {servicos.map(({ nome, icone }, i) => (
        <View
          key={nome}
          style={{
            position: 'absolute',
            left: chipX,
            top: top0 + i * (CHIP_H + CHIP_GAP),
            width: CHIP_W,
            height: CHIP_H,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: SITE.ink200,
            backgroundColor: C.white,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 7,
          }}
        >
          <View style={{ width: 16, height: 16, borderRadius: 5, backgroundColor: '#EEF3FF', alignItems: 'center', justifyContent: 'center', marginRight: 7 }}>
            <LucideIcon node={iconFor(icone)} size={10} color={SITE.brand} />
          </View>
          <Text style={{ fontSize: 8.5, fontWeight: 600, color: '#2b2b2e' }}>{nome}</Text>
        </View>
      ))}
    </View>
  );
};

const HeroGrid = ({ width, height }: { width: number; height: number }) => {
  const step = 28;
  const cols = Math.ceil(width / step);
  const rows = Math.ceil(height / step);
  // Brilho azul do topo (como o blur do site): elipses concêntricas com opacidade baixa
  const glow = Array.from({ length: 9 }).map((_, i) => 1 - i / 9);
  return (
    <Svg style={{ position: 'absolute', top: 0, left: 0, width, height }} viewBox={`0 0 ${width} ${height}`}>
      {glow.map((k, i) => (
        <Ellipse key={`g${i}`} cx={width / 2} cy={-20} rx={width * 0.5 * k} ry={height * 0.75 * k} fill={SITE.brand} fillOpacity={0.022} />
      ))}
      {Array.from({ length: cols + 1 }).map((_, i) => (
        <Line key={`v${i}`} x1={i * step} y1={0} x2={i * step} y2={height} stroke="#ffffff" strokeOpacity={0.035} strokeWidth={0.6} />
      ))}
      {Array.from({ length: rows + 1 }).map((_, i) => (
        <Line key={`h${i}`} x1={0} y1={i * step} x2={width} y2={i * step} stroke="#ffffff" strokeOpacity={0.035} strokeWidth={0.6} />
      ))}
    </Svg>
  );
};

const PAGE_W = 595.28;

const ProdutoDestaque = ({ p, contatoHref }: { p: PdfProdutoDestaque; contatoHref: string | null }) => {
  const visao = p.descricaoCompleta?.trim();
  return (
    <>
      {/* Hero escuro */}
      <View wrap={false} style={{ backgroundColor: SITE.hero, paddingHorizontal: 36, paddingTop: 30, paddingBottom: 30, overflow: 'hidden', minHeight: 250 }}>
        <HeroGrid width={PAGE_W} height={300} />
        <View style={{ marginBottom: 18 }}>
          <Pill light center>{`Conheça o ${p.nome}`}</Pill>
        </View>
        <Text style={{ color: '#8f8f96', fontSize: 7.5, letterSpacing: 0.4, marginBottom: 12 }}>
          {['Produtos', p.solucao, p.nome].filter(Boolean).join('  /  ')}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ flex: 1, paddingRight: 22 }}>
            <MaybeLink href={p.href}>
              <Text style={{ color: C.white, fontSize: 25, fontWeight: 700, lineHeight: 1.15, marginBottom: 10 }}>{p.nome}</Text>
            </MaybeLink>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 }}>
              {p.solucao ? (
                <Text style={{ fontSize: 7.5, fontWeight: 600, color: '#cfe0ff', backgroundColor: '#0E2A66', borderRadius: 10, paddingVertical: 3, paddingHorizontal: 8, marginRight: 6, marginBottom: 4 }}>
                  {p.solucao}
                </Text>
              ) : null}
              {p.subcategoria ? (
                <Text style={{ fontSize: 7.5, color: SITE.ink300, borderWidth: 1, borderColor: '#35353b', borderRadius: 10, paddingVertical: 2.5, paddingHorizontal: 8, marginBottom: 4 }}>
                  {p.subcategoria}
                </Text>
              ) : null}
            </View>
            {p.descricaoCurta ? (
              <Text style={{ color: SITE.ink300, fontSize: 10.5, lineHeight: 1.5, marginBottom: 14 }}>{p.descricaoCurta}</Text>
            ) : null}
            <View style={{ flexDirection: 'row' }}>
              {contatoHref ? (
                <Link src={contatoHref} style={{ textDecoration: 'none', marginRight: 8 }}>
                  <View style={{ backgroundColor: SITE.brand, borderRadius: 8, paddingVertical: 7, paddingHorizontal: 14 }}>
                    <Text style={{ color: C.white, fontSize: 8.5, fontWeight: 700 }}>Falar com um especialista</Text>
                  </View>
                </Link>
              ) : null}
              {p.href ? (
                <Link src={p.href} style={{ textDecoration: 'none' }}>
                  <View style={{ borderWidth: 1, borderColor: '#3a3a42', borderRadius: 8, paddingVertical: 6, paddingHorizontal: 14 }}>
                    <Text style={{ color: C.white, fontSize: 8.5, fontWeight: 700 }}>Ver no site</Text>
                  </View>
                </Link>
              ) : null}
            </View>
          </View>
          {p.imagem ? (
            <View style={{ width: 210, height: 140, borderRadius: 16, borderWidth: 1, borderColor: '#24242a', overflow: 'hidden', backgroundColor: '#0c0c10' }}>
              <Image src={p.imagem.src} style={{ width: 210, height: 140, objectFit: 'cover' }} />
            </View>
          ) : null}
        </View>
      </View>

      {/* Conteúdo claro: blocos irmãos com o mesmo fundo (ver LightBlock) */}
      {visao ? (
        <LightBlock top={26} bottom={20}>
          <Eyebrow>Visão geral</Eyebrow>
          <Text style={{ fontSize: 10, color: SITE.ink600, lineHeight: 1.6 }}>{visao}</Text>
        </LightBlock>
      ) : (
        <LightBlock top={26}>{null}</LightBlock>
      )}

      {p.diferenciais.length > 0 ? (
        <InfoCards
          items={p.diferenciais}
          header={
            <>
              <Eyebrow>Diferenciais</Eyebrow>
              <SectionTitle>{`Por que ${p.nome}`}</SectionTitle>
            </>
          }
        />
      ) : null}

      {p.casosDeUso.length > 0 ? (
        <InfoCards
          items={p.casosDeUso}
          check
          header={
            <>
              <Eyebrow>Casos de uso</Eyebrow>
              <SectionTitle>Onde ele resolve</SectionTitle>
            </>
          }
        />
      ) : null}

      <LightBlock>
        <FichaTecnica p={p} />
      </LightBlock>

      {p.servicos.length > 0 ? (
        <LightBlock top={26}>
          <Eyebrow center>{p.servicosEyebrow || 'Mais que um produto'}</Eyebrow>
          <SectionTitle center>{p.servicosTitulo || 'Integra com nossos serviços'}</SectionTitle>
          <Text style={{ fontSize: 9, color: SITE.ink500, lineHeight: 1.5, textAlign: 'center', marginTop: 6, paddingHorizontal: 60 }}>
            {p.servicosDescricao ||
              `Não entregamos só a licença: projetamos, implantamos e sustentamos o ${p.nome} dentro do seu ambiente, de ponta a ponta.`}
          </Text>
          <ServicosDiagrama p={p} />
        </LightBlock>
      ) : null}

      {p.fabricanteNome ? (
        <LightBlock top={18}>
          <View style={{ borderWidth: 1, borderColor: SITE.ink200, borderRadius: 14, backgroundColor: C.white, padding: 16, flexDirection: 'row', alignItems: 'center' }}>
            <LogoChip img={p.fabricanteLogo} nome={p.fabricanteNome} width={92} height={40} />
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={{ fontSize: 11.5, fontWeight: 700, color: SITE.ink950, marginBottom: 3 }}>{p.fabricanteNome}</Text>
              <Text style={{ fontSize: 8.5, color: SITE.ink500, lineHeight: 1.45 }}>
                {`Parceiro homologado Infodive. Projetamos, implantamos e sustentamos as soluções ${p.fabricanteNome} no seu ambiente.`}
              </Text>
            </View>
            {p.fabricanteHref ? (
              <Link src={p.fabricanteHref} style={{ textDecoration: 'none', marginLeft: 12 }}>
                <Text style={{ fontSize: 8.5, fontWeight: 700, color: SITE.brand }}>{`Ver produtos ${p.fabricanteNome}`}</Text>
              </Link>
            ) : null}
          </View>
        </LightBlock>
      ) : null}
      <LightBlock bottom={26}>{null}</LightBlock>
    </>
  );
};

// ── Nossos produtos (2+ produtos marcados) ──────────────────────────────────

const ProdutoCard = ({ p }: { p: PortfolioDocumentData['produtos'][number] }) => (
  <View
    style={{
      width: CARD3_WIDTH,
      backgroundColor: C.white,
      borderWidth: 1,
      borderColor: SITE.ink200,
      borderRadius: 12,
      padding: 12,
      minHeight: 128,
      flexGrow: 1,
    }}
  >
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
      <View
        style={{
          height: 30,
          width: 74,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: p.logo?.needsDarkBg ? SITE.ink950 : '#ececf1',
          backgroundColor: p.logo?.needsDarkBg ? SITE.ink950 : SITE.ink50,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 8,
        }}
      >
        {p.logo ? (
          <Contain img={p.logo} width={58} height={18} />
        ) : (
          <Text style={{ fontSize: 7.5, fontWeight: 700, color: SITE.ink950 }}>{p.fabricante ?? ''}</Text>
        )}
      </View>
      <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: SITE.brand }} />
    </View>
    {p.solucao ? (
      <Text style={{ fontSize: 6.5, fontWeight: 600, letterSpacing: 1, color: SITE.brand, marginBottom: 3 }}>{p.solucao.toUpperCase()}</Text>
    ) : null}
    <Text style={{ fontSize: 11, fontWeight: 700, color: SITE.ink950, lineHeight: 1.25 }}>{p.nome}</Text>
    {p.descricao ? <Text style={{ fontSize: 8, color: SITE.ink500, lineHeight: 1.45, marginTop: 5 }}>{p.descricao}</Text> : null}
    {p.href ? (
      <View style={{ flexGrow: 1, justifyContent: 'flex-end' }}>
        <Text style={{ fontSize: 7.5, fontWeight: 700, color: SITE.brand, marginTop: 8 }}>Ver no site</Text>
      </View>
    ) : null}
  </View>
);

// Mesma estratégia das outras seções: cada linha é um bloco direto da página; a 1ª leva o título.
const ProdutosSection = ({ titulo, items }: { titulo: string; items: PortfolioDocumentData['produtos'] }) => {
  const rows = chunk(items, 3);
  return (
    <>
      {rows.map((row, r) => (
        <View
          key={r}
          wrap={false}
          style={{ flexShrink: 0, backgroundColor: SITE.ink50, paddingHorizontal: 36, paddingTop: r === 0 ? 26 : 0, paddingBottom: r === rows.length - 1 ? 26 : 0 }}
        >
          {r === 0 ? (
            <View style={{ marginBottom: 18 }}>
              <Pill>{titulo}</Pill>
            </View>
          ) : null}
          <View style={{ flexDirection: 'row', marginBottom: CARD3_GAP }}>
            {row.map((p, c) => (
              <MaybeLink key={c} href={p.href} style={{ marginRight: c < 2 ? CARD3_GAP : 0, flexDirection: 'column' }}>
                <ProdutoCard p={p} />
              </MaybeLink>
            ))}
          </View>
        </View>
      ))}
    </>
  );
};

// ── Documento ────────────────────────────────────────────────────────────────

export function PortfolioDocument({ data }: { data: PortfolioDocumentData }) {
  const { config, solucoes, produtos, fabricantes, servicos, logo, produtoDestaque } = data;
  const diferenciais = lines(config.diferenciais);
  const continuo = config.paginaUnica;
  const contatoHref = config.email ? `mailto:${config.email}` : config.siteUrl || null;
  const bannerParagraphs = config.bannerTexto.split(/\n\s*\n/).map((p) => p.replace(/\n/g, ' ').trim()).filter(Boolean);

  return (
    <Document title="Portfólio Infodive IT" author="Infodive IT" subject="Portfólio empresarial">
      {/* Conteúdo contínuo: as seções são blocos inteiros que passam para a próxima página quando não cabem */}
      <Page size={continuo ? ({ width: 595.28 } as any) : 'A4'} style={s.page} wrap={!continuo}>
        <View wrap={false} style={[s.pad, { paddingTop: 32, flexDirection: 'row' }]}>
          <AccentBar id="heroBar" />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 21, fontWeight: 700, lineHeight: 1.2 }}>{config.headline}</Text>
            <Text style={{ fontSize: 10.5, color: C.body, marginTop: 12, lineHeight: 1.45, width: 380 }}>{config.intro}</Text>
          </View>
        </View>

        {/* Banner com logo */}
        <View wrap={false} style={{ marginTop: 20, paddingVertical: 24, paddingHorizontal: 36, flexDirection: 'row', alignItems: 'center' }}>
          <Gradient
            id="bannerBg"
            stops={[
              { offset: '0', color: '#e8505b' },
              { offset: '0.4', color: '#14101d' },
              { offset: '0.75', color: '#1c1580' },
              { offset: '1', color: '#4136d6' },
            ]}
            x2="1"
            y2="0.25"
          />
          <View style={{ width: 210, marginRight: 26 }}>
            {logo ? <Contain img={logo} width={210} height={56} /> : <Text style={{ color: C.white, fontSize: 30, fontWeight: 600 }}>Infodive IT</Text>}
          </View>
          <View style={{ flex: 1 }}>
            {bannerParagraphs.map((p, i) => (
              <Text key={i} style={{ color: '#f3f2fb', fontSize: 9, lineHeight: 1.45, marginBottom: i < bannerParagraphs.length - 1 ? 9 : 0 }}>
                {p}
              </Text>
            ))}
          </View>
        </View>

        {produtoDestaque ? <ProdutoDestaque p={produtoDestaque} contatoHref={contatoHref} /> : null}

        {/* Portfólio */}
        {solucoes.length > 0 ? <SolucaoCards cards={solucoes} header={<Pill>{config.portfolioTitulo}</Pill>} /> : null}

        {produtos.length > 0 ? <ProdutosSection titulo={config.produtosTitulo} items={produtos} /> : null}

        {config.showDiferenciais && diferenciais.length > 0 && (
          <View wrap={false}>
            <Diferenciais titulo={config.diferenciaisTitulo} itens={diferenciais} />
          </View>
        )}

        {fabricantes.length > 0 && <Fabricantes titulo={config.fabricantesTitulo} items={fabricantes} />}

        {servicos.length > 0 && (
          <View wrap={false}>
            <Servicos titulo={config.servicosTitulo} items={servicos} />
          </View>
        )}

        <View wrap={false} style={{ flexGrow: continuo ? 0 : 1, marginTop: -1 }}>
          <Cta data={data} fill={!continuo} />
        </View>
      </Page>
    </Document>
  );
}
