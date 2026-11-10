import React from 'react';
import { Title } from 'react-admin';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DownloadIcon from '@mui/icons-material/Download';
import {
  DEFAULT_CONFIG,
  type FabricanteItem,
  type PdfFabricante,
  type PdfProdutoCard,
  type PdfProdutoDestaque,
  type PdfTituloDescricao,
  type PdfSolucaoCard,
  type PortfolioConfig,
  type PortfolioDocumentData,
  type ProdutoItem,
  type ServicoItem,
  type SolucaoItem,
} from '@/lib/portfolio/types';
import { loadImageAsPng } from '@/lib/portfolio/images';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://infodiveit-backend-production.up.railway.app/api/v1';
const STORAGE_KEY = 'infodive-portfolio-pdf-v1';

type Selection = {
  solucoes: string[];
  produtos: string[];
  fabricantes: string[];
  servicos: string[];
};

type Catalog = {
  solucoes: SolucaoItem[];
  produtos: ProdutoItem[];
  fabricantes: FabricanteItem[];
  servicos: ServicoItem[];
};

const authFetch = async (path: string) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const response = await fetch(`${apiUrl}${path}`, {
    headers: { Accept: 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });
  if (!response.ok) throw new Error(`Falha ao carregar ${path} (${response.status})`);
  return response.json();
};

// Produtos vêm paginados (máx. 100 por página)
const fetchAllProdutos = async (): Promise<ProdutoItem[]> => {
  const all: ProdutoItem[] = [];
  for (let page = 0; page < 50; page++) {
    const json = await authFetch(`/produtos?page=${page}&size=100`);
    const content: ProdutoItem[] = json.content || [];
    all.push(...content);
    if (json.last || content.length === 0) break;
  }
  return all;
};

const readStored = (): { selection?: Selection; config?: Partial<PortfolioConfig> } => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const writeStored = (selection: Selection, config: PortfolioConfig) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ selection, config }));
  } catch {
    // armazenamento indisponível: segue sem persistir
  }
};

const normalize = (value: string) => value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const sortByOrdem = <T extends { ordem?: number }>(items: T[]): T[] =>
  [...items].sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0));

// ── Lista de checkboxes com busca ────────────────────────────────────────────

type Option = { id: string; label: string; hint?: string; logoUrl?: string | null; group?: string };

const OptionList = ({
  options,
  selected,
  onToggle,
  onToggleMany,
  grouped,
}: {
  options: Option[];
  selected: string[];
  onToggle: (id: string) => void;
  onToggleMany: (ids: string[], checked: boolean) => void;
  grouped?: boolean;
}) => {
  const [query, setQuery] = React.useState('');
  const filtered = React.useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return options;
    return options.filter((o) => normalize(`${o.label} ${o.hint ?? ''} ${o.group ?? ''}`).includes(q));
  }, [options, query]);

  const selectedSet = React.useMemo(() => new Set(selected), [selected]);
  const filteredIds = filtered.map((o) => o.id);
  const allFilteredSelected = filteredIds.length > 0 && filteredIds.every((id) => selectedSet.has(id));

  const renderOption = (o: Option) => (
    <FormControlLabel
      key={o.id}
      sx={{ display: 'flex', mx: 0, py: 0.25 }}
      control={<Checkbox size="small" checked={selectedSet.has(o.id)} onChange={() => onToggle(o.id)} />}
      label={
        <Stack direction="row" spacing={1.25} alignItems="center">
          {o.logoUrl !== undefined && (
            <Box
              sx={{
                width: 34,
                height: 22,
                bgcolor: '#fff',
                borderRadius: 0.75,
                border: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {o.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={o.logoUrl} alt="" style={{ maxWidth: 30, maxHeight: 18, objectFit: 'contain' }} />
              ) : null}
            </Box>
          )}
          <Box>
            <Typography variant="body2">{o.label}</Typography>
            {o.hint && (
              <Typography variant="caption" color="text.secondary">
                {o.hint}
              </Typography>
            )}
          </Box>
        </Stack>
      }
    />
  );

  let body: React.ReactNode;
  if (grouped) {
    const groups = new Map<string, Option[]>();
    filtered.forEach((o) => {
      const key = o.group || 'Sem solução';
      groups.set(key, [...(groups.get(key) ?? []), o]);
    });
    body = Array.from(groups.entries()).map(([group, items]) => {
      const ids = items.map((i) => i.id);
      const count = ids.filter((id) => selectedSet.has(id)).length;
      return (
        <Box key={group} sx={{ mb: 1.5 }}>
          <FormControlLabel
            sx={{ mx: 0 }}
            control={
              <Checkbox
                size="small"
                checked={count === ids.length}
                indeterminate={count > 0 && count < ids.length}
                onChange={(e) => onToggleMany(ids, e.target.checked)}
              />
            }
            label={
              <Typography variant="subtitle2" color="primary">
                {group} <Typography component="span" variant="caption" color="text.secondary">({items.length})</Typography>
              </Typography>
            }
          />
          <Box sx={{ pl: 3 }}>{items.map(renderOption)}</Box>
        </Box>
      );
    });
  } else {
    body = filtered.map(renderOption);
  }

  return (
    <Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mb: 1.5 }} alignItems={{ sm: 'center' }}>
        <TextField
          size="small"
          placeholder="Buscar…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          sx={{ flex: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
        <Button size="small" onClick={() => onToggleMany(filteredIds, !allFilteredSelected)} disabled={filtered.length === 0}>
          {allFilteredSelected ? 'Desmarcar todos' : query ? 'Marcar resultados' : 'Marcar todos'}
        </Button>
      </Stack>
      <Box sx={{ maxHeight: 380, overflowY: 'auto', pr: 1 }}>
        {filtered.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
            Nada encontrado.
          </Typography>
        ) : (
          body
        )}
      </Box>
    </Box>
  );
};

// ── Página ───────────────────────────────────────────────────────────────────

const field = (
  config: PortfolioConfig,
  setConfig: React.Dispatch<React.SetStateAction<PortfolioConfig>>,
  key: keyof PortfolioConfig,
  label: string,
  opts: { multiline?: boolean; rows?: number; helper?: string } = {},
) => (
  <TextField
    key={key}
    label={label}
    size="small"
    fullWidth
    multiline={opts.multiline}
    minRows={opts.rows}
    helperText={opts.helper}
    value={config[key] as string}
    onChange={(e) => setConfig((prev) => ({ ...prev, [key]: e.target.value }))}
  />
);

export const PortfolioPdfPage = () => {
  const [catalog, setCatalog] = React.useState<Catalog | null>(null);
  const [loadError, setLoadError] = React.useState<string | null>(null);
  const [selection, setSelection] = React.useState<Selection>({ solucoes: [], produtos: [], fabricantes: [], servicos: [] });
  const [config, setConfig] = React.useState<PortfolioConfig>(DEFAULT_CONFIG);
  const [tab, setTab] = React.useState(0);
  const [generating, setGenerating] = React.useState(false);
  const [genError, setGenError] = React.useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = React.useState<string | null>(null);
  const [fileName, setFileName] = React.useState('portfolio-infodive.pdf');
  const hydrated = React.useRef(false);

  // Carrega catálogo + contato e restaura a última seleção
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [solucoes, produtos, fabricantes, servicos, contato] = await Promise.all([
          authFetch('/solucoes') as Promise<SolucaoItem[]>,
          fetchAllProdutos(),
          authFetch('/fabricantes') as Promise<FabricanteItem[]>,
          authFetch('/servicos') as Promise<ServicoItem[]>,
          authFetch('/contato-info').catch(() => null),
        ]);
        if (cancelled) return;

        const cat: Catalog = {
          solucoes: sortByOrdem(solucoes),
          produtos,
          fabricantes: sortByOrdem(fabricantes),
          servicos: sortByOrdem(servicos),
        };
        setCatalog(cat);

        const stored = readStored();
        const valid = (ids: string[] | undefined, universe: { id: string }[]) => {
          const set = new Set(universe.map((u) => u.id));
          return (ids ?? []).filter((id) => set.has(id));
        };
        setSelection(
          stored.selection
            ? {
                solucoes: valid(stored.selection.solucoes, cat.solucoes),
                produtos: valid(stored.selection.produtos, cat.produtos),
                fabricantes: valid(stored.selection.fabricantes, cat.fabricantes),
                servicos: valid(stored.selection.servicos, cat.servicos),
              }
            : {
                solucoes: cat.solucoes.map((x) => x.id),
                produtos: [],
                fabricantes: cat.fabricantes.map((x) => x.id),
                servicos: cat.servicos.map((x) => x.id),
              },
        );
        setConfig({
          ...DEFAULT_CONFIG,
          email: contato?.email ?? '',
          telefone: contato?.telefone ?? '',
          endereco: contato?.endereco ?? '',
          ...stored.config,
          // título antigo padrão → novo padrão
          ...(stored.config?.portfolioTitulo === 'Nosso portfólio' ? { portfolioTitulo: DEFAULT_CONFIG.portfolioTitulo } : {}),
        });
        hydrated.current = true;
      } catch (err: any) {
        if (!cancelled) setLoadError(err?.message || 'Não foi possível carregar o catálogo.');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Persiste escolhas no navegador
  React.useEffect(() => {
    if (hydrated.current) writeStored(selection, config);
  }, [selection, config]);

  // Libera blob anterior
  React.useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  const solucaoBySlug = React.useMemo(() => new Map((catalog?.solucoes ?? []).map((s) => [s.slug, s])), [catalog]);
  const produtoById = React.useMemo(() => new Map((catalog?.produtos ?? []).map((p) => [p.id, p])), [catalog]);

  const toggleIn = (key: keyof Selection, id: string) =>
    setSelection((prev) => ({
      ...prev,
      [key]: prev[key].includes(id) ? prev[key].filter((x) => x !== id) : [...prev[key], id],
    }));

  // Soluções e produtos são seções independentes no PDF: marcar um não mexe no outro.
  const setProdutos = (ids: string[], checked: boolean) =>
    setSelection((prev) => {
      const set = new Set(prev.produtos);
      ids.forEach((id) => (checked ? set.add(id) : set.delete(id)));
      return { ...prev, produtos: Array.from(set) };
    });

  const setSolucoes = (ids: string[], checked: boolean) =>
    setSelection((prev) => {
      const set = new Set(prev.solucoes);
      ids.forEach((id) => (checked ? set.add(id) : set.delete(id)));
      return { ...prev, solucoes: Array.from(set) };
    });

  const setMany = (key: 'fabricantes' | 'servicos') => (ids: string[], checked: boolean) =>
    setSelection((prev) => {
      const set = new Set(prev[key]);
      ids.forEach((id) => (checked ? set.add(id) : set.delete(id)));
      return { ...prev, [key]: Array.from(set) };
    });

  const generate = async () => {
    if (!catalog) return;
    setGenerating(true);
    setGenError(null);
    try {
      const [{ pdf }, doc, QRCode] = await Promise.all([
        import('@react-pdf/renderer'),
        import('./portfolio/PortfolioDocument'),
        import('qrcode'),
      ]);
      doc.registerPortfolioFonts(`${window.location.origin}/fonts`);

      // Links para o site (produto → página do produto; fabricante → catálogo filtrado)
      const site = (config.siteUrl || DEFAULT_CONFIG.siteUrl).trim().replace(/\/+$/, '');
      const produtoHref = (slug?: string | null) => (slug ? `${site}/produtos/${encodeURIComponent(slug)}` : null);
      const fabricanteHref = (slug?: string | null) => (slug ? `${site}/produtos?fabricante=${encodeURIComponent(slug)}` : null);

      // Seção "Nossas soluções": título + descrição curta de cada solução
      const selSol = new Set(selection.solucoes);
      const selProd = new Set(selection.produtos);
      const cards: PdfSolucaoCard[] = catalog.solucoes
        .filter((s) => selSol.has(s.id))
        .map((s) => ({ titulo: s.titulo, descricao: s.subtituloCurto || s.descricaoCurta || null }));

      // Seção "Nossos produtos" (com 2+ produtos; com 1 só, ele vira a seção completa "Conheça o …")
      const produtosSel = selection.produtos.length >= 2 ? catalog.produtos.filter((p) => selProd.has(p.id)) : [];
      const logoUrls = Array.from(new Set(produtosSel.map((p) => p.fabricanteLogoUrl).filter((u): u is string => Boolean(u))));
      const logosCarregados = await Promise.all(logoUrls.map((u) => loadImageAsPng(u, 360, true)));
      const logoPorUrl = new Map(logoUrls.map((u, i) => [u, logosCarregados[i]]));
      const produtosCards: PdfProdutoCard[] = produtosSel.map((p) => ({
        nome: p.nome,
        fabricante: p.fabricanteNome ?? null,
        solucao: p.solucaoTitle ?? null,
        descricao: p.descricaoCurta ?? null,
        logo: p.fabricanteLogoUrl ? logoPorUrl.get(p.fabricanteLogoUrl) ?? null : null,
        href: produtoHref(p.slug),
      }));

      // Imagens (SVG/WEBP → PNG) em paralelo
      const selFab = new Set(selection.fabricantes);
      const fabricantesSel = catalog.fabricantes.filter((f) => selFab.has(f.id));
      const [logo, fabLogos, qrDataUrl] = await Promise.all([
        loadImageAsPng('/logo-infodive.png', 800),
        Promise.all(fabricantesSel.map((f) => loadImageAsPng(f.logoUrl, 420, true))),
        QRCode.toDataURL(config.siteUrl || DEFAULT_CONFIG.siteUrl, { margin: 0, width: 320, errorCorrectionLevel: 'M' }),
      ]);
      const fabricantes: PdfFabricante[] = fabricantesSel.map((f, i) => ({ nome: f.nome, logo: fabLogos[i], href: fabricanteHref(f.slug) }));

      // Regra: exatamente 1 produto selecionado → seção completa do produto
      let produtoDestaque: PdfProdutoDestaque | null = null;
      if (selection.produtos.length === 1) {
        const resumo = produtoById.get(selection.produtos[0]);
        if (resumo) {
          const det = await authFetch(`/produtos/${encodeURIComponent(resumo.slug || resumo.id)}`);
          const pares = (items: unknown): PdfTituloDescricao[] =>
            (Array.isArray(items) ? items : [])
              .map((x: any) => ({ titulo: String(x?.titulo ?? x?.title ?? '').trim(), descricao: String(x?.descricao ?? x?.description ?? '').trim() }))
              .filter((x) => x.titulo || x.descricao);
          const [imagem, fabricanteLogo] = await Promise.all([
            loadImageAsPng(det.imagemUrl, 900),
            loadImageAsPng(det.fabricanteLogoUrl, 360, true),
          ]);
          produtoDestaque = {
            nome: det.nome,
            subcategoria: det.subcategoria ?? null,
            solucao: det.solucaoNome ?? resumo.solucaoTitle ?? null,
            descricaoCurta: det.descricaoCurta ?? null,
            descricaoCompleta: det.descricaoCompleta ?? null,
            diferenciais: pares(det.diferenciais),
            casosDeUso: pares(det.casosDeUso),
            fabricanteNome: det.fabricanteNome ?? null,
            fabricanteLogo,
            imagem,
            linkOficial: det.linkOficial ?? null,
            servicosEyebrow: det.servicosEyebrow ?? null,
            servicosTitulo: det.servicosTitulo ?? null,
            servicosDescricao: det.servicosDescricao ?? null,
            href: produtoHref(det.slug ?? resumo.slug),
            fabricanteHref: fabricanteHref(det.fabricanteSlug ?? resumo.fabricanteSlug),
            servicos: (Array.isArray(det.servicos) ? det.servicos : [])
              .map((s: any) => ({ nome: String(s?.nome ?? ''), icone: s?.icone ? String(s.icone) : null }))
              .filter((s: { nome: string }) => s.nome),
          };
        }
      }

      const selServ = new Set(selection.servicos);
      const servicos = catalog.servicos.filter((s) => selServ.has(s.id)).map((s) => s.nome);

      const now = new Date();
      const data: PortfolioDocumentData = {
        config,
        produtoDestaque,
        solucoes: cards,
        produtos: produtosCards,
        fabricantes,
        servicos,
        logo,
        qr: qrDataUrl,
        geradoEm: now.toLocaleDateString('pt-BR'),
      };

      const blob = await pdf(doc.PortfolioDocument({ data })).toBlob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      setFileName(`portfolio-infodive-${now.toISOString().slice(0, 10)}.pdf`);
    } catch (err: any) {
      console.error('Erro ao gerar portfólio PDF:', err);
      setGenError(err?.message || 'Não foi possível gerar o PDF.');
    } finally {
      setGenerating(false);
    }
  };

  const total = selection.solucoes.length + selection.fabricantes.length + selection.servicos.length;

  const tabs = catalog
    ? [
        { label: 'Soluções', count: selection.solucoes.length },
        { label: 'Produtos', count: selection.produtos.length },
        { label: 'Fabricantes', count: selection.fabricantes.length },
        { label: 'Serviços', count: selection.servicos.length },
      ]
    : [];

  return (
    <Box sx={{ p: { xs: 1, md: 2 } }}>
      <Title title="Portfólio PDF" />
      <Typography variant="h5" sx={{ mb: 0.5 }}>
        Gerador de Portfólio (PDF)
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 760 }}>
        Escolha o que deve aparecer e gere um portfólio institucional em PDF, no padrão visual do folder da Infodive. Os
        dados vêm do catálogo do site, então o PDF sempre sai atualizado.
      </Typography>

      {loadError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {loadError}
        </Alert>
      )}

      {!catalog && !loadError && (
        <Stack direction="row" spacing={2} alignItems="center" sx={{ py: 6 }}>
          <CircularProgress size={22} />
          <Typography variant="body2">Carregando catálogo…</Typography>
        </Stack>
      )}

      {catalog && (
        <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 3fr) minmax(0, 2fr)' } }}>
          {/* Seleção */}
          <Card>
            <CardContent>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                1. O que entra no portfólio
              </Typography>
              <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" sx={{ mb: 2 }}>
                {tabs.map((t) => (
                  <Tab
                    key={t.label}
                    label={
                      <Stack direction="row" spacing={1} alignItems="center">
                        <span>{t.label}</span>
                        <Chip size="small" label={t.count} color={t.count > 0 ? 'primary' : 'default'} />
                      </Stack>
                    }
                  />
                ))}
              </Tabs>

              {tab === 0 && (
                <>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    Cada solução marcada vira um card na seção “Nossas soluções”, com o nome e uma descrição curta.
                  </Alert>
                  <OptionList
                    options={catalog.solucoes.map((s) => ({ id: s.id, label: s.titulo, hint: s.subtituloCurto ?? undefined }))}
                    selected={selection.solucoes}
                    onToggle={(id) => setSolucoes([id], !selection.solucoes.includes(id))}
                    onToggleMany={setSolucoes}
                  />
                </>
              )}
              {tab === 1 && (
                <>
                  <Alert severity={selection.produtos.length === 1 ? 'success' : 'info'} sx={{ mb: 2 }}>
                    {selection.produtos.length === 1
                      ? `Produto em destaque: “${produtoById.get(selection.produtos[0])?.nome ?? ''}” ganha uma seção completa no PDF (visão geral, diferenciais, casos de uso, serviços e fabricante).`
                      : 'Com 2 ou mais produtos, eles aparecem na seção “Nossos produtos” (com o logo do fabricante). Marque apenas 1 para ele ganhar uma seção completa.'}
                  </Alert>
                  <OptionList
                    grouped
                    options={catalog.produtos.map((p) => ({
                      id: p.id,
                      label: p.nome,
                      hint: p.fabricanteNome ?? undefined,
                      group: p.solucaoTitle ?? undefined,
                    }))}
                    selected={selection.produtos}
                    onToggle={(id) => setProdutos([id], !selection.produtos.includes(id))}
                    onToggleMany={setProdutos}
                  />
                </>
              )}
              {tab === 2 && (
                <OptionList
                  options={catalog.fabricantes.map((f) => ({
                    id: f.id,
                    label: f.nome,
                    hint: f.descricaoCurta ?? undefined,
                    logoUrl: f.logoUrl ?? null,
                  }))}
                  selected={selection.fabricantes}
                  onToggle={(id) => toggleIn('fabricantes', id)}
                  onToggleMany={setMany('fabricantes')}
                />
              )}
              {tab === 3 && (
                <OptionList
                  options={catalog.servicos.map((s) => ({ id: s.id, label: s.nome }))}
                  selected={selection.servicos}
                  onToggle={(id) => toggleIn('servicos', id)}
                  onToggleMany={setMany('servicos')}
                />
              )}
            </CardContent>
          </Card>

          {/* Textos + gerar */}
          <Stack spacing={3}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  2. Textos do documento
                </Typography>
                <Stack spacing={2}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={config.paginaUnica}
                        onChange={(e) => setConfig((prev) => ({ ...prev, paginaUnica: e.target.checked }))}
                      />
                    }
                    label={config.paginaUnica ? 'Página única contínua (ideal para tela)' : 'Dividido em páginas A4 (ideal para imprimir)'}
                  />
                  {field(config, setConfig, 'headline', 'Título da capa', { multiline: true, rows: 2 })}
                  {field(config, setConfig, 'intro', 'Texto de abertura', { multiline: true, rows: 3 })}
                  {field(config, setConfig, 'bannerTexto', 'Texto do banner', {
                    multiline: true,
                    rows: 5,
                    helper: 'Separe parágrafos com uma linha em branco.',
                  })}
                  {field(config, setConfig, 'portfolioTitulo', 'Título da seção de soluções')}
                  {field(config, setConfig, 'produtosTitulo', 'Título da seção de produtos')}
                  <FormControlLabel
                    control={
                      <Switch
                        checked={config.showDiferenciais}
                        onChange={(e) => setConfig((prev) => ({ ...prev, showDiferenciais: e.target.checked }))}
                      />
                    }
                    label="Mostrar “Nossos diferenciais”"
                  />
                  {config.showDiferenciais && (
                    <>
                      {field(config, setConfig, 'diferenciaisTitulo', 'Título dos diferenciais')}
                      {field(config, setConfig, 'diferenciais', 'Diferenciais', {
                        multiline: true,
                        rows: 6,
                        helper: 'Um por linha.',
                      })}
                    </>
                  )}
                  {field(config, setConfig, 'fabricantesTitulo', 'Título da seção de fabricantes')}
                  {field(config, setConfig, 'servicosTitulo', 'Título da seção de serviços', { multiline: true, rows: 2 })}
                  {field(config, setConfig, 'ctaTitulo', 'Chamada final (título)')}
                  {field(config, setConfig, 'ctaTexto', 'Chamada final (texto)')}
                  {field(config, setConfig, 'siteUrl', 'Endereço do site (QR Code)')}
                  {field(config, setConfig, 'vendedor', 'Nome do vendedor', {
                    helper: 'Aparece na chamada final (“Fale com …”), acima do e-mail e telefone.',
                  })}
                  {field(config, setConfig, 'email', 'E-mail de contato')}
                  {field(config, setConfig, 'telefone', 'Telefone')}
                  {field(config, setConfig, 'endereco', 'Endereço')}
                  <Button size="small" color="inherit" onClick={() => setConfig((prev) => ({ ...DEFAULT_CONFIG, paginaUnica: prev.paginaUnica, vendedor: prev.vendedor, email: prev.email, telefone: prev.telefone, endereco: prev.endereco }))}>
                    Restaurar textos padrão
                  </Button>
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="subtitle1" sx={{ mb: 1.5 }}>
                  3. Gerar
                </Typography>
                <Stack spacing={1.5}>
                  <Typography variant="body2" color="text.secondary">
                    {selection.solucoes.length} soluções · {selection.produtos.length} produtos ·{' '}
                    {selection.fabricantes.length} fabricantes · {selection.servicos.length} serviços
                  </Typography>
                  {total === 0 && <Alert severity="warning">Marque pelo menos uma solução, fabricante ou serviço.</Alert>}
                  {genError && <Alert severity="error">{genError}</Alert>}
                  <Stack direction="row" spacing={1.5}>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={generating ? <CircularProgress size={18} color="inherit" /> : <PictureAsPdfIcon />}
                      onClick={generate}
                      disabled={generating || total === 0}
                    >
                      {generating ? 'Gerando…' : pdfUrl ? 'Gerar novamente' : 'Gerar PDF'}
                    </Button>
                    {pdfUrl && (
                      <Button variant="outlined" size="large" startIcon={<DownloadIcon />} component="a" href={pdfUrl} download={fileName}>
                        Baixar
                      </Button>
                    )}
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Box>
      )}

      {pdfUrl && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" sx={{ mb: 1.5 }}>
              Pré-visualização
            </Typography>
            <Box
              component="iframe"
              title="Pré-visualização do portfólio"
              src={pdfUrl}
              sx={{ width: '100%', height: { xs: 520, md: 820 }, border: '1px solid', borderColor: 'divider', borderRadius: 2, bgcolor: '#fff' }}
            />
          </CardContent>
        </Card>
      )}
    </Box>
  );
};
