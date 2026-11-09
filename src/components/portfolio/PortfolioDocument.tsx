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
  Rect,
  Font,
  StyleSheet,
} from '@react-pdf/renderer';
import type { PortfolioDocumentData, PdfImage } from '@/lib/portfolio/types';

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

const SolucaoCards = ({ cards }: { cards: PortfolioDocumentData['solucoes'] }) => {
  const rows = chunk(cards, COLS);
  let index = 0;
  return (
    <View style={{ marginTop: 18 }}>
      {rows.map((row, r) => (
        <View key={r} wrap={false} style={{ flexDirection: 'row', marginBottom: GAP }}>
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
                  minHeight: 130,
                }}
              >
                <Text style={{ color: C.white, fontSize: 11, fontWeight: 700, marginBottom: 9, lineHeight: 1.25 }}>
                  {card.titulo}
                </Text>
                {card.itens.map((item, i) => (
                  <View key={i} style={{ flexDirection: 'row', marginBottom: 3.5 }}>
                    <Text style={{ color: '#c9c6ee', fontSize: 7.5, width: 8 }}>•</Text>
                    <Text style={{ color: '#f1f0ff', fontSize: 8, lineHeight: 1.3, flex: 1 }}>{item}</Text>
                  </View>
                ))}
              </View>
            );
          })}
        </View>
      ))}
    </View>
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

const Fabricantes = ({ titulo, items }: { titulo: string; items: PortfolioDocumentData['fabricantes'] }) => {
  const rows = chunk(items, FAB_COLS);
  return (
    <View style={[s.pad, { paddingTop: 26, paddingBottom: 18 }]}>
      <View wrap={false} minPresenceAhead={90} style={{ flexDirection: 'row' }}>
        <AccentBar id="fabBar" />
        <Text style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.25, width: 300 }}>{titulo}</Text>
      </View>
      <View style={{ marginTop: 16 }}>
        {rows.map((row, r) => (
          <View key={r} wrap={false} style={{ flexDirection: 'row', marginBottom: 6 }}>
            {Array.from({ length: FAB_COLS }).map((_, c) => {
              const f = row[c];
              return (
                <View key={c} style={{ flex: 1, height: 44, alignItems: 'center', justifyContent: 'center' }}>
                  {f ? (
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
                  ) : null}
                </View>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
};

const Servicos = ({ titulo, items }: { titulo: string; items: string[] }) => {
  const per = Math.ceil(items.length / 3);
  const columns = [items.slice(0, per), items.slice(per, per * 2), items.slice(per * 2)].filter((c) => c.length > 0);
  return (
    <View style={{ backgroundColor: C.dark, paddingTop: 26, paddingBottom: 22, paddingHorizontal: 44 }}>
      <Text style={{ color: '#e9e8ee', fontSize: 14.5, fontWeight: 700, textAlign: 'center', lineHeight: 1.35 }}>{titulo}</Text>
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
          { offset: '0', color: '#151219' },
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
          {vendedor && (
            <View style={{ marginTop: 16 }}>
              <Text style={{ color: '#a9a5cc', fontSize: 7.5, letterSpacing: 0.6 }}>SEU CONTATO NA INFODIVE</Text>
              <Text style={{ color: C.white, fontSize: 13, fontWeight: 700, marginTop: 3 }}>{vendedor}</Text>
            </View>
          )}
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

// ── Documento ────────────────────────────────────────────────────────────────

export function PortfolioDocument({ data }: { data: PortfolioDocumentData }) {
  const { config, solucoes, fabricantes, servicos, logo } = data;
  const diferenciais = lines(config.diferenciais);
  const continuo = config.paginaUnica;
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

        {/* Portfólio */}
        {solucoes.length > 0 && (
          <View style={[s.pad, { paddingTop: 24, paddingBottom: 14 }]}>
            <View wrap={false} minPresenceAhead={170}>
              <Pill>{config.portfolioTitulo}</Pill>
            </View>
            <SolucaoCards cards={solucoes} />
          </View>
        )}

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

        <View wrap={false} style={{ flexGrow: continuo ? 0 : 1, marginTop: 6 }}>
          <Cta data={data} fill={!continuo} />
        </View>
      </Page>
    </Document>
  );
}
