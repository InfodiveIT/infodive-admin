import React from 'react';
import { Admin, Resource, defaultTheme, Layout, Menu } from 'react-admin';
import { Navigate } from 'react-router-dom';
import { createTheme } from '@mui/material/styles';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ChevronRight from '@mui/icons-material/ChevronRight';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { dataProvider } from '@/lib/dataProvider';
import { authProvider } from '@/lib/authProvider';

// Custom Premium light theme
const myLightTheme = createTheme({
  ...defaultTheme,
  palette: {
    mode: 'light',
    primary: { main: '#4f46e5' }, // Indigo 600
    secondary: { main: '#06b6d4' }, // Cyan 500
    background: {
      default: '#f8fafc', // Slate 50
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a', // Slate 900
      secondary: '#475569', // Slate 600
    },
  },
  typography: {
    fontFamily: 'var(--font-geist-sans), Inter, Roboto, Arial, sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid #e2e8f0', // slate-200
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
          borderRadius: 16,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        colorSecondary: {
          backgroundColor: '#ffffff',
          color: '#0f172a',
          borderBottom: '1px solid #e2e8f0',
        },
      },
    },
  },
});

// Custom Premium dark theme (Default)
const myDarkTheme = createTheme({
  ...defaultTheme,
  palette: {
    mode: 'dark',
    primary: { main: '#818cf8' }, // Indigo 400
    secondary: { main: '#22d3ee' }, // Cyan 400
    background: {
      default: '#0b0f19', // Deep Rich Blue-Black
      paper: '#111827', // Slate 900
    },
    text: {
      primary: '#f8fafc', // Slate 50
      secondary: '#94a3b8', // Slate 400
    },
  },
  typography: {
    fontFamily: 'var(--font-geist-sans), Inter, Roboto, Arial, sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid #1f2937', // slate-800
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.2), 0 2px 4px -2px rgb(0 0 0 / 0.2)',
          borderRadius: 16,
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        colorSecondary: {
          backgroundColor: '#111827',
          color: '#f8fafc',
          borderBottom: '1px solid #1f2937',
          backgroundImage: 'none',
        },
      },
    },
  },
});

// Icons
import CategoryIcon from '@mui/icons-material/Category';
import InventoryIcon from '@mui/icons-material/Inventory';
import BusinessIcon from '@mui/icons-material/Business';
import BuildIcon from '@mui/icons-material/Build';
import BookIcon from '@mui/icons-material/Book';
import StarIcon from '@mui/icons-material/Star';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CampaignIcon from '@mui/icons-material/Campaign';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import BarChartIcon from '@mui/icons-material/BarChart';
import LabelIcon from '@mui/icons-material/Label';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import PageviewIcon from '@mui/icons-material/Pageview';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import SettingsIcon from '@mui/icons-material/Settings';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import InfoIcon from '@mui/icons-material/Info';
import TimelineIcon from '@mui/icons-material/Timeline';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import PeopleIcon from '@mui/icons-material/People';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';

// Custom Views
import {
  CategoriaList,
  CategoriaEdit,
  CategoriaCreate,
  SolucaoList,
  SolucaoEdit,
  SolucaoCreate,
  ProdutoList,
  ProdutoEdit,
  ProdutoCreate,
  FabricanteList,
  FabricanteEdit,
  FabricanteCreate,
  ServicoList,
  ServicoEdit,
  ServicoCreate,
} from './catalogo';

import {
  ConteudoList,
  ConteudoEdit,
  ConteudoCreate,
  CaseList,
  CaseEdit,
  CaseCreate,
} from './conteudo';

import {
  HeroCarouselList,
  HeroCarouselEdit,
  HeroCarouselCreate,
  HomeSolucoesBentoList,
  HomeSolucoesBentoEdit,
  HomeSolucoesBentoCreate,
  HomeProblemasList,
  HomeProblemasEdit,
  HomeProblemasCreate,
  HomeTrustStatsList,
  HomeTrustStatsEdit,
  HomeTrustStatsCreate,
  SecaoHomeList,
  SecaoHomeEdit,
  FaqList,
  FaqEdit,
  FaqCreate,
} from './home';

import {
  PaginaHeroList,
  PaginaHeroEdit,
  CtaList,
  CtaEdit,
} from './paginas';

import {
  ConfigFooterEdit,
  ConfigBlogEdit,
  ContatoInfoEdit,
} from './configuracoes';

import {
  SobreNumerosEdit,
  SobreTimelineEdit,
  SobreValoresEdit,
  SobreCulturaEdit,
} from './sobre';

import {
  ServicosEtapasEdit,
  ServicosMetodologiaEdit,
} from './servicos';

import {
  LeadList,
  LeadShow,
} from './leads';

import {
  AdminAutorizadoList,
  AdminAutorizadoEdit,
  AdminAutorizadoCreate,
} from './admins';

// Custom collapsible sidebar menu
const MyMenu = () => {
  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>({
    catalogo: false,
    home: false,
    homeHero: false,
    homeBento: false,
    homeProdutos: false,
    homeProblemas: false,
    homeTrust: false,
    homeTrustStats: false,
    homeFaq: false,
    paginasSolucoes: false,
    paginasProdutos: false,
    paginasServicos: false,
    paginasBlog: false,
    paginasSobre: false,
    config: false,
    admins: false,
  });

  const toggleGroup = (group: string) => {
    setOpenGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

  return (
    <Menu sx={{
      paddingTop: 2,
      '& .MuiMenuItem-root': {
        borderRadius: '8px',
        margin: '2px 8px',
        padding: '8px 12px',
        fontSize: '0.875rem',
      },
    }}>
      <Menu.DashboardItem />

      {/* 1. Catálogo */}
      <ListItemButton onClick={() => toggleGroup('catalogo')} sx={{ borderRadius: '8px', margin: '4px 8px' }}>
        <ListItemIcon sx={{ minWidth: 40 }}><CategoryIcon /></ListItemIcon>
        <ListItemText primary="Catálogo" />
        {openGroups.catalogo ? <ExpandMore /> : <ChevronRight />}
      </ListItemButton>
      <Collapse in={openGroups.catalogo} timeout="auto" unmountOnExit>
        <List component="div" disablePadding sx={{ pl: 1 }}>
          <Menu.Item to="/categorias" primaryText="Categorias" leftIcon={<LabelIcon />} />
          <Menu.Item to="/solucoes" primaryText="Soluções" leftIcon={<CategoryIcon />} />
          <Menu.Item to="/produtos" primaryText="Produtos" leftIcon={<InventoryIcon />} />
          <Menu.Item to="/fabricantes" primaryText="Fabricantes" leftIcon={<BusinessIcon />} />
          <Menu.Item to="/servicos" primaryText="Serviços" leftIcon={<BuildIcon />} />
        </List>
      </Collapse>

      {/* 2. Página Home */}
      <ListItemButton onClick={() => toggleGroup('home')} sx={{ borderRadius: '8px', margin: '4px 8px' }}>
        <ListItemIcon sx={{ minWidth: 40 }}><DashboardIcon /></ListItemIcon>
        <ListItemText primary="Página Home" />
        {openGroups.home ? <ExpandMore /> : <ChevronRight />}
      </ListItemButton>
      <Collapse in={openGroups.home} timeout="auto" unmountOnExit>
        <List component="div" disablePadding sx={{ pl: 1 }}>
          
          {/* Subgrupo: 1ª Seção (Hero) */}
          <ListItemButton onClick={() => toggleGroup('homeHero')} sx={{ borderRadius: '8px', margin: '2px 8px', pl: 2 }}>
            <ListItemIcon sx={{ minWidth: 32 }}><ViewCarouselIcon sx={{ fontSize: '1.2rem' }} /></ListItemIcon>
            <ListItemText primary="1. Hero (Primeira Seção)" primaryTypographyProps={{ fontSize: '0.82rem', fontWeight: 500 }} />
            {openGroups.homeHero ? <ExpandMore /> : <ChevronRight />}
          </ListItemButton>
          <Collapse in={openGroups.homeHero} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ pl: 3 }}>
              <Menu.Item to="/paginas-hero/home" primaryText="Editar Textos" leftIcon={<LabelIcon sx={{ fontSize: '1rem' }} />} />
              <Menu.Item to="/fabricantes" primaryText="Logos Fabricantes" leftIcon={<BusinessIcon sx={{ fontSize: '1rem' }} />} />
              <Menu.Item to="/hero-carousel" primaryText="Carrossel de Slides" leftIcon={<ViewCarouselIcon sx={{ fontSize: '1rem' }} />} />
            </List>
          </Collapse>

          {/* Subgrupo: Bento Grid (Soluções) */}
          <ListItemButton onClick={() => toggleGroup('homeBento')} sx={{ borderRadius: '8px', margin: '2px 8px', pl: 2 }}>
            <ListItemIcon sx={{ minWidth: 32 }}><CategoryIcon sx={{ fontSize: '1.2rem' }} /></ListItemIcon>
            <ListItemText primary="2. Bento Grid (Soluções)" primaryTypographyProps={{ fontSize: '0.82rem', fontWeight: 500 }} />
            {openGroups.homeBento ? <ExpandMore /> : <ChevronRight />}
          </ListItemButton>
          <Collapse in={openGroups.homeBento} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ pl: 3 }}>
              <Menu.Item to="/secoes-home/solucoes" primaryText="Editar Título" leftIcon={<LabelIcon sx={{ fontSize: '1rem' }} />} />
              <Menu.Item to="/home-solucoes-bento" primaryText="Itens do Bento Grid" leftIcon={<DashboardIcon sx={{ fontSize: '1rem' }} />} />
            </List>
          </Collapse>

          {/* Subgrupo: 3. Produtos Destaque */}
          <ListItemButton onClick={() => toggleGroup('homeProdutos')} sx={{ borderRadius: '8px', margin: '2px 8px', pl: 2 }}>
            <ListItemIcon sx={{ minWidth: 32 }}><InventoryIcon sx={{ fontSize: '1.2rem' }} /></ListItemIcon>
            <ListItemText primary="3. Produtos Destaque" primaryTypographyProps={{ fontSize: '0.82rem', fontWeight: 500 }} />
            {openGroups.homeProdutos ? <ExpandMore /> : <ChevronRight />}
          </ListItemButton>
          <Collapse in={openGroups.homeProdutos} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ pl: 3 }}>
              <Menu.Item to="/secoes-home/produtos" primaryText="Editar Título" leftIcon={<LabelIcon sx={{ fontSize: '1rem' }} />} />
            </List>
          </Collapse>

          {/* Subgrupo: 4. Problemas Comuns */}
          <ListItemButton onClick={() => toggleGroup('homeProblemas')} sx={{ borderRadius: '8px', margin: '2px 8px', pl: 2 }}>
            <ListItemIcon sx={{ minWidth: 32 }}><ReportProblemIcon sx={{ fontSize: '1.2rem' }} /></ListItemIcon>
            <ListItemText primary="4. Problemas Comuns" primaryTypographyProps={{ fontSize: '0.82rem', fontWeight: 500 }} />
            {openGroups.homeProblemas ? <ExpandMore /> : <ChevronRight />}
          </ListItemButton>
          <Collapse in={openGroups.homeProblemas} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ pl: 3 }}>
              <Menu.Item to="/secoes-home/problemas" primaryText="Editar Título" leftIcon={<LabelIcon sx={{ fontSize: '1rem' }} />} />
              <Menu.Item to="/home-problemas" primaryText="Lista de Problemas" leftIcon={<ReportProblemIcon sx={{ fontSize: '1rem' }} />} />
            </List>
          </Collapse>

          {/* Subgrupo: 5. Cases & Depoimentos */}
          <ListItemButton onClick={() => toggleGroup('homeTrust')} sx={{ borderRadius: '8px', margin: '2px 8px', pl: 2 }}>
            <ListItemIcon sx={{ minWidth: 32 }}><StarIcon sx={{ fontSize: '1.2rem' }} /></ListItemIcon>
            <ListItemText primary="5. Cases & Depoimentos" primaryTypographyProps={{ fontSize: '0.82rem', fontWeight: 500 }} />
            {openGroups.homeTrust ? <ExpandMore /> : <ChevronRight />}
          </ListItemButton>
          <Collapse in={openGroups.homeTrust} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ pl: 3 }}>
              <Menu.Item to="/secoes-home/cases" primaryText="Editar Título" leftIcon={<LabelIcon sx={{ fontSize: '1rem' }} />} />
              <Menu.Item to="/cases" primaryText="Gerenciar Cases" leftIcon={<StarIcon sx={{ fontSize: '1rem' }} />} />
            </List>
          </Collapse>

          {/* Subgrupo: 6. Métricas & Estatísticas */}
          <ListItemButton onClick={() => toggleGroup('homeTrustStats')} sx={{ borderRadius: '8px', margin: '2px 8px', pl: 2 }}>
            <ListItemIcon sx={{ minWidth: 32 }}><BarChartIcon sx={{ fontSize: '1.2rem' }} /></ListItemIcon>
            <ListItemText primary="6. Métricas & Estatísticas" primaryTypographyProps={{ fontSize: '0.82rem', fontWeight: 500 }} />
            {openGroups.homeTrustStats ? <ExpandMore /> : <ChevronRight />}
          </ListItemButton>
          <Collapse in={openGroups.homeTrustStats} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ pl: 3 }}>
              <Menu.Item to="/home-trust-stats" primaryText="Estatísticas" leftIcon={<BarChartIcon sx={{ fontSize: '1rem' }} />} />
            </List>
          </Collapse>

          {/* Subgrupo: 7. Perguntas (FAQ) */}
          <ListItemButton onClick={() => toggleGroup('homeFaq')} sx={{ borderRadius: '8px', margin: '2px 8px', pl: 2 }}>
            <ListItemIcon sx={{ minWidth: 32 }}><QuestionAnswerIcon sx={{ fontSize: '1.2rem' }} /></ListItemIcon>
            <ListItemText primary="7. Perguntas (FAQ)" primaryTypographyProps={{ fontSize: '0.82rem', fontWeight: 500 }} />
            {openGroups.homeFaq ? <ExpandMore /> : <ChevronRight />}
          </ListItemButton>
          <Collapse in={openGroups.homeFaq} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ pl: 3 }}>
              <Menu.Item to="/faq" primaryText="Lista de FAQ" leftIcon={<QuestionAnswerIcon sx={{ fontSize: '1rem' }} />} />
            </List>
          </Collapse>

        </List>
      </Collapse>

      {/* 3. Página Soluções */}
      <ListItemButton onClick={() => toggleGroup('paginasSolucoes')} sx={{ borderRadius: '8px', margin: '4px 8px' }}>
        <ListItemIcon sx={{ minWidth: 40 }}><CategoryIcon /></ListItemIcon>
        <ListItemText primary="Página Soluções" />
        {openGroups.paginasSolucoes ? <ExpandMore /> : <ChevronRight />}
      </ListItemButton>
      <Collapse in={openGroups.paginasSolucoes} timeout="auto" unmountOnExit>
        <List component="div" disablePadding sx={{ pl: 1 }}>
          <Menu.Item to="/paginas-hero/solucoes" primaryText="Hero da Página" leftIcon={<PageviewIcon />} />
          <Menu.Item to="/ctas/solucoes" primaryText="Bloco CTA" leftIcon={<TouchAppIcon />} />
        </List>
      </Collapse>

      {/* 4. Página Produtos */}
      <ListItemButton onClick={() => toggleGroup('paginasProdutos')} sx={{ borderRadius: '8px', margin: '4px 8px' }}>
        <ListItemIcon sx={{ minWidth: 40 }}><InventoryIcon /></ListItemIcon>
        <ListItemText primary="Página Produtos" />
        {openGroups.paginasProdutos ? <ExpandMore /> : <ChevronRight />}
      </ListItemButton>
      <Collapse in={openGroups.paginasProdutos} timeout="auto" unmountOnExit>
        <List component="div" disablePadding sx={{ pl: 1 }}>
          <Menu.Item to="/paginas-hero/produtos" primaryText="Hero da Página" leftIcon={<PageviewIcon />} />
          <Menu.Item to="/ctas/produtos" primaryText="Bloco CTA" leftIcon={<TouchAppIcon />} />
        </List>
      </Collapse>

      {/* 5. Página Serviços */}
      <ListItemButton onClick={() => toggleGroup('paginasServicos')} sx={{ borderRadius: '8px', margin: '4px 8px' }}>
        <ListItemIcon sx={{ minWidth: 40 }}><BuildIcon /></ListItemIcon>
        <ListItemText primary="Página Serviços" />
        {openGroups.paginasServicos ? <ExpandMore /> : <ChevronRight />}
      </ListItemButton>
      <Collapse in={openGroups.paginasServicos} timeout="auto" unmountOnExit>
        <List component="div" disablePadding sx={{ pl: 1 }}>
          <Menu.Item to="/paginas-hero/servicos" primaryText="Hero da Página" leftIcon={<PageviewIcon />} />
          <Menu.Item to="/servicos-etapas" primaryText="Etapas" leftIcon={<TimelineIcon />} />
          <Menu.Item to="/servicos-metodologia" primaryText="Metodologia" leftIcon={<BuildIcon />} />
          <Menu.Item to="/ctas/servicos" primaryText="Bloco CTA" leftIcon={<TouchAppIcon />} />
        </List>
      </Collapse>

      {/* 6. Página Blog */}
      <ListItemButton onClick={() => toggleGroup('paginasBlog')} sx={{ borderRadius: '8px', margin: '4px 8px' }}>
        <ListItemIcon sx={{ minWidth: 40 }}><BookIcon /></ListItemIcon>
        <ListItemText primary="Página Blog" />
        {openGroups.paginasBlog ? <ExpandMore /> : <ChevronRight />}
      </ListItemButton>
      <Collapse in={openGroups.paginasBlog} timeout="auto" unmountOnExit>
        <List component="div" disablePadding sx={{ pl: 1 }}>
          <Menu.Item to="/paginas-hero/blog" primaryText="Hero do Blog" leftIcon={<PageviewIcon />} />
          <Menu.Item to="/config-blog" primaryText="Textos & Redes Sociais" leftIcon={<SettingsIcon />} />
          <Menu.Item to="/conteudos" primaryText="Artigos / Postagens" leftIcon={<BookIcon />} />
          <Menu.Item to="/cases" primaryText="Cases de Sucesso" leftIcon={<StarIcon />} />
        </List>
      </Collapse>

      {/* 7. Página Quem Somos */}
      <ListItemButton onClick={() => toggleGroup('paginasSobre')} sx={{ borderRadius: '8px', margin: '4px 8px' }}>
        <ListItemIcon sx={{ minWidth: 40 }}><InfoIcon /></ListItemIcon>
        <ListItemText primary="Página Quem Somos" />
        {openGroups.paginasSobre ? <ExpandMore /> : <ChevronRight />}
      </ListItemButton>
      <Collapse in={openGroups.paginasSobre} timeout="auto" unmountOnExit>
        <List component="div" disablePadding sx={{ pl: 1 }}>
          <Menu.Item to="/paginas-hero/sobre" primaryText="Hero da Página" leftIcon={<PageviewIcon />} />
          <Menu.Item to="/sobre-numeros" primaryText="Números & Estatísticas" leftIcon={<InfoIcon />} />
          <Menu.Item to="/sobre-timeline" primaryText="Timeline / História" leftIcon={<TimelineIcon />} />
          <Menu.Item to="/sobre-valores" primaryText="Valores Corporativos" leftIcon={<InfoIcon />} />
          <Menu.Item to="/sobre-cultura" primaryText="Fotos da Cultura" leftIcon={<CameraAltIcon />} />
          <Menu.Item to="/ctas/sobre" primaryText="Bloco CTA" leftIcon={<TouchAppIcon />} />
        </List>
      </Collapse>

      {/* 8. Configurações Gerais */}
      <ListItemButton onClick={() => toggleGroup('config')} sx={{ borderRadius: '8px', margin: '4px 8px' }}>
        <ListItemIcon sx={{ minWidth: 40 }}><SettingsIcon /></ListItemIcon>
        <ListItemText primary="Configurações Gerais" />
        {openGroups.config ? <ExpandMore /> : <ChevronRight />}
      </ListItemButton>
      <Collapse in={openGroups.config} timeout="auto" unmountOnExit>
        <List component="div" disablePadding sx={{ pl: 1 }}>
          <Menu.Item to="/config-footer" primaryText="Footer / Rodapé" leftIcon={<SettingsIcon />} />
          <Menu.Item to="/contato-info" primaryText="Informações de Contato" leftIcon={<ContactPhoneIcon />} />
        </List>
      </Collapse>

      {/* 9. Auditoria & Admins */}
      <ListItemButton onClick={() => toggleGroup('admins')} sx={{ borderRadius: '8px', margin: '4px 8px' }}>
        <ListItemIcon sx={{ minWidth: 40 }}><PeopleIcon /></ListItemIcon>
        <ListItemText primary="Auditoria & Admins" />
        {openGroups.admins ? <ExpandMore /> : <ChevronRight />}
      </ListItemButton>
      <Collapse in={openGroups.admins} timeout="auto" unmountOnExit>
        <List component="div" disablePadding sx={{ pl: 1 }}>
          <Menu.Item to="/leads" primaryText="Leads Recebidos" leftIcon={<PeopleIcon />} />
          <Menu.Item to="/admins-autorizados" primaryText="Allowlist Admins" leftIcon={<SupervisorAccountIcon />} />
        </List>
      </Collapse>
    </Menu>
  );
};

// Custom Layout utilizing the custom collapsible menu
const MyLayout = (props: any) => <Layout {...props} menu={MyMenu} />;

// Helper component for direct redirecting of singleton pages
const SingletonRedirect = ({ to }: { to: string }) => (
  <Navigate to={to} replace />
);

export default function AdminApp() {
  return (
    <Admin
      dataProvider={dataProvider}
      authProvider={authProvider}
      title="Infodive IT — Painel Administrativo"
      theme={myLightTheme}
      darkTheme={myDarkTheme}
      defaultTheme="dark"
      layout={MyLayout}
    >
      {/* ─── 1. CATÁLOGO ────────────────────────────────────────────────────── */}
      <Resource
        name="categorias"
        options={{ label: 'Categorias' }}
        list={CategoriaList}
        edit={CategoriaEdit}
        create={CategoriaCreate}
        icon={LabelIcon}
      />
      <Resource
        name="solucoes"
        options={{ label: 'Soluções' }}
        list={SolucaoList}
        edit={SolucaoEdit}
        create={SolucaoCreate}
        icon={CategoryIcon}
      />
      <Resource
        name="produtos"
        options={{ label: 'Produtos' }}
        list={ProdutoList}
        edit={ProdutoEdit}
        create={ProdutoCreate}
        icon={InventoryIcon}
      />
      <Resource
        name="fabricantes"
        options={{ label: 'Fabricantes' }}
        list={FabricanteList}
        edit={FabricanteEdit}
        create={FabricanteCreate}
        icon={BusinessIcon}
      />
      <Resource
        name="servicos"
        options={{ label: 'Serviços' }}
        list={ServicoList}
        edit={ServicoEdit}
        create={ServicoCreate}
        icon={BuildIcon}
      />

      {/* ─── 2. CONTEÚDO ───────────────────────────────────────────────────── */}
      <Resource
        name="conteudos"
        options={{ label: 'Artigos / Blog' }}
        list={ConteudoList}
        edit={ConteudoEdit}
        create={ConteudoCreate}
        icon={BookIcon}
      />
      <Resource
        name="cases"
        options={{ label: 'Cases' }}
        list={CaseList}
        edit={CaseEdit}
        create={CaseCreate}
        icon={StarIcon}
      />

      {/* ─── 3. HOME ───────────────────────────────────────────────────────── */}
      <Resource
        name="hero-carousel"
        options={{ label: 'Home - Carrossel' }}
        list={HeroCarouselList}
        edit={HeroCarouselEdit}
        create={HeroCarouselCreate}
        icon={ViewCarouselIcon}
      />
      <Resource
        name="home-solucoes-bento"
        options={{ label: 'Home - Bento Grid' }}
        list={HomeSolucoesBentoList}
        edit={HomeSolucoesBentoEdit}
        icon={DashboardIcon}
      />

      <Resource
        name="home-problemas"
        options={{ label: 'Home - Problemas' }}
        list={HomeProblemasList}
        edit={HomeProblemasEdit}
        create={HomeProblemasCreate}
        icon={ReportProblemIcon}
      />
      <Resource
        name="home-trust-stats"
        options={{ label: 'Home - Trust Stats' }}
        list={HomeTrustStatsList}
        edit={HomeTrustStatsEdit}
        icon={BarChartIcon}
      />
      <Resource
        name="secoes-home"
        options={{ label: 'Home - Títulos Seções' }}
        list={SecaoHomeList}
        edit={SecaoHomeEdit}
        icon={LabelIcon}
      />
      <Resource
        name="faq"
        options={{ label: 'Home - FAQ' }}
        list={FaqList}
        edit={FaqEdit}
        create={FaqCreate}
        icon={QuestionAnswerIcon}
      />

      {/* ─── 4. PÁGINAS ────────────────────────────────────────────────────── */}
      <Resource
        name="paginas-hero"
        options={{ label: 'Páginas - Heroes' }}
        list={PaginaHeroList}
        edit={PaginaHeroEdit}
        icon={PageviewIcon}
      />
      <Resource
        name="ctas"
        options={{ label: 'Páginas - CTAs' }}
        list={CtaList}
        edit={CtaEdit}
        icon={TouchAppIcon}
      />

      {/* ─── 5. CONFIGURAÇÕES ──────────────────────────────────────────────── */}
      <Resource
        name="config-footer"
        options={{ label: 'Config - Footer' }}
        list={() => <SingletonRedirect to="/config-footer/singleton" />}
        edit={ConfigFooterEdit}
        icon={SettingsIcon}
      />
      <Resource
        name="config-blog"
        options={{ label: 'Config - Blog' }}
        list={() => <SingletonRedirect to="/config-blog/singleton" />}
        edit={ConfigBlogEdit}
        icon={SettingsIcon}
      />
      <Resource
        name="contato-info"
        options={{ label: 'Config - Contato' }}
        list={() => <SingletonRedirect to="/contato-info/singleton" />}
        edit={ContatoInfoEdit}
        icon={ContactPhoneIcon}
      />

      {/* ─── 6. SOBRE ──────────────────────────────────────────────────────── */}
      <Resource
        name="sobre-numeros"
        options={{ label: 'Sobre - Números' }}
        list={() => <SingletonRedirect to="/sobre-numeros/singleton" />}
        edit={SobreNumerosEdit}
        icon={InfoIcon}
      />
      <Resource
        name="sobre-timeline"
        options={{ label: 'Sobre - Timeline' }}
        list={() => <SingletonRedirect to="/sobre-timeline/singleton" />}
        edit={SobreTimelineEdit}
        icon={TimelineIcon}
      />
      <Resource
        name="sobre-valores"
        options={{ label: 'Sobre - Valores' }}
        list={() => <SingletonRedirect to="/sobre-valores/singleton" />}
        edit={SobreValoresEdit}
        icon={InfoIcon}
      />
      <Resource
        name="sobre-cultura"
        options={{ label: 'Sobre - Cultura' }}
        list={() => <SingletonRedirect to="/sobre-cultura/singleton" />}
        edit={SobreCulturaEdit}
        icon={CameraAltIcon}
      />

      {/* ─── 7. SERVIÇOS ────────────────────────────────────────────────────── */}
      <Resource
        name="servicos-etapas"
        options={{ label: 'Serviços - Etapas' }}
        list={() => <SingletonRedirect to="/servicos-etapas/singleton" />}
        edit={ServicosEtapasEdit}
        icon={TimelineIcon}
      />
      <Resource
        name="servicos-metodologia"
        options={{ label: 'Serviços - Metodologia' }}
        list={() => <SingletonRedirect to="/servicos-metodologia/singleton" />}
        edit={ServicosMetodologiaEdit}
        icon={BuildIcon}
      />

      {/* ─── 8. LEADS (SOMENTE LEITURA) ─────────────────────────────────────── */}
      <Resource
        name="leads"
        options={{ label: 'Leads Recebidos' }}
        list={LeadList}
        show={LeadShow}
        icon={PeopleIcon}
      />

      {/* ─── 9. ADMINS ──────────────────────────────────────────────────────── */}
      <Resource
        name="admins-autorizados"
        options={{ label: 'Allowlist Admins' }}
        list={AdminAutorizadoList}
        edit={AdminAutorizadoEdit}
        create={AdminAutorizadoCreate}
        icon={SupervisorAccountIcon}
      />
    </Admin>
  );
}
