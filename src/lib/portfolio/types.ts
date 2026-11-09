// Tipos compartilhados entre a tela de seleção e o documento PDF do portfólio.

export type PortfolioConfig = {
  paginaUnica: boolean; // true = uma página longa contínua; false = páginas A4
  headline: string;
  intro: string;
  bannerTexto: string;
  portfolioTitulo: string;
  showDiferenciais: boolean;
  diferenciaisTitulo: string;
  diferenciais: string; // um por linha
  fabricantesTitulo: string;
  servicosTitulo: string;
  ctaTitulo: string;
  ctaTexto: string;
  siteUrl: string;
  vendedor: string;
  email: string;
  telefone: string;
  endereco: string;
};

export const DEFAULT_CONFIG: PortfolioConfig = {
  paginaUnica: true,
  headline: 'Soluções inteligentes para infraestrutura, cloud, segurança e modernização de TI',
  intro:
    'A Infodive IT apoia empresas na transformação e sustentação de ambientes críticos de TI com foco em performance, segurança, disponibilidade e inovação.',
  bannerTexto:
    'Com atuação consultiva e foco em resultados, a Infodive entrega soluções completas para infraestrutura de TI, virtualização, backup, segurança, cloud e modernização de ambientes corporativos.\n\nNosso compromisso é simplificar operações, aumentar eficiência e garantir ambientes mais resilientes e seguros.',
  portfolioTitulo: 'Nosso portfólio',
  showDiferenciais: true,
  diferenciaisTitulo: 'Nossos diferenciais',
  diferenciais:
    'Consultoria especializada\nAssessment de ambientes\nProjetos personalizados\nSuporte N3\nTreinamentos técnicos\nAtendimento consultivo',
  fabricantesTitulo: 'Trabalhamos com os principais fabricantes do mercado',
  servicosTitulo: 'Modernize sua infraestrutura com mais segurança, escalabilidade e controle com a Infodive',
  ctaTitulo: 'Vamos conversar sobre seu ambiente de TI?',
  ctaTexto: 'Agende uma conversa com nossos especialistas.',
  siteUrl: 'https://www.infodive.com.br',
  vendedor: '',
  email: '',
  telefone: '',
  endereco: '',
};

// ── Dados vindos da API ──────────────────────────────────────────────────────

export type SolucaoItem = {
  id: string;
  slug: string;
  titulo: string;
  subtituloCurto?: string | null;
  descricaoCurta?: string | null;
  recursosChave?: string[] | null;
  ordem?: number;
};

export type ProdutoItem = {
  id: string;
  nome: string;
  solucaoSlug?: string | null;
  solucaoTitle?: string | null;
  fabricanteNome?: string | null;
};

export type FabricanteItem = {
  id: string;
  nome: string;
  logoUrl?: string | null;
  descricaoCurta?: string | null;
  ordem?: number;
};

export type ServicoItem = {
  id: string;
  nome: string;
  descricao?: string | null;
  ordem?: number;
};

// ── Dados prontos para o documento ──────────────────────────────────────────

// ratio = largura / altura; needsDarkBg = logo com muito branco (desenhado para fundo escuro)
export type PdfImage = { src: string; ratio: number; needsDarkBg?: boolean };

export type PdfSolucaoCard = {
  titulo: string;
  itens: string[];
};

export type PdfFabricante = {
  nome: string;
  logo: PdfImage | null;
};

export type PortfolioDocumentData = {
  config: PortfolioConfig;
  solucoes: PdfSolucaoCard[];
  fabricantes: PdfFabricante[];
  servicos: string[];
  logo: PdfImage | null;
  qr: string | null;
  geradoEm: string;
};
