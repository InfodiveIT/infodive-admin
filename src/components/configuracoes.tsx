import React, { useState } from 'react';
import {
  Edit,
  SimpleForm,
  TextInput,
  ArrayInput,
  SimpleFormIterator,
  required,
  useNotify,
  useRefresh,
  Button,
} from 'react-admin';
import SyncIcon from '@mui/icons-material/Sync';
import { AdminHelpBanner } from './AdminHelpBanner';

const SyncSocialPostsButton = () => {
  const notify = useNotify();
  const refresh = useRefresh();
  const [loading, setLoading] = useState(false);

  const handleSync = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://infodiveit-backend-production.up.railway.app/api/v1';
      const res = await fetch(`${apiUrl}/social-posts/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: Erro ao comunicar com o servidor.`);
      }

      const data = await res.json();
      notify(`Sucesso: ${data.message} (${data.totalSynced || 0} posts sincronizados)`, { type: 'success' });
      refresh();
    } catch (err: any) {
      notify(`Erro ao sincronizar: ${err.message}`, { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: 16, marginBottom: 24, padding: 16, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.02)' }}>
      <h4 style={{ margin: 0, marginBottom: 8, color: '#38bdf8', fontWeight: 600 }}>
        🔄 Sincronização Manual com Redes Sociais
      </h4>
      <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 12 }}>
        Clique no botão abaixo para disparar imediatamente a busca dos posts mais recentes nas contas oficiais do Instagram e LinkedIn.
      </p>
      <Button
        label={loading ? 'Sincronizando...' : 'Sincronizar Redes Sociais Agora'}
        onClick={handleSync}
        disabled={loading}
        variant="contained"
        color="primary"
        startIcon={<SyncIcon />}
      />
    </div>
  );
};

// ─── CONFIGURAÇÕES DE FOOTER ─────────────────────────────────────────────────
export const ConfigFooterEdit = () => (
  <Edit title="Configurações do Footer" id="singleton">
    <SimpleForm>
      <AdminHelpBanner
        title="O que esta tela altera no site?"
        description="Altera as informações institucionais, Links de Redes Sociais e Selos de Certificação (NOC/Cloud) no Rodapé (Footer) global do site."
      />
      <TextInput source="nomeLegal" label="Razão Social / Nome Legal" validate={required()} fullWidth />
      <TextInput source="descricaoEmpresa" label="Descrição da Empresa no Rodapé" multiline fullWidth />
      <TextInput source="badgeNoc" label="Texto do Selo NOC 24/7" fullWidth />
      <TextInput source="badgeCloud" label="Texto do Selo Cloud Integrada" fullWidth />

      <TextInput source="urlLinkedin" label="Link do LinkedIn" fullWidth />
      <TextInput source="urlInstagram" label="Link do Instagram" fullWidth />
      <TextInput source="urlFacebook" label="Link do Facebook" fullWidth />
    </SimpleForm>
  </Edit>
);

// ─── CONFIGURAÇÕES DO BLOG (EDITORES & BLOGGERS) ────────────────────────────
export const ConfigBlogEdit = () => (
  <Edit title="Configurações do Blog (Textos & Links)" id="singleton">
    <SimpleForm>
      <AdminHelpBanner
        title="O que esta tela altera no site?"
        description={<>Altera os títulos institucionais, cabeçalhos e links sociais exibidos na página do <strong>Blog (<code>/blog</code>)</strong>.</>}
      />
      <TextInput source="artigosEyebrow" label="Blog - Eyebrow dos Artigos" fullWidth />
      <TextInput source="artigosHeadline" label="Blog - Headline dos Artigos" fullWidth />

      <TextInput source="socialEyebrow" label="Redes Sociais - Eyebrow" fullWidth />
      <TextInput source="socialHeadline" label="Redes Sociais - Headline" fullWidth />
      <TextInput source="socialDescricao" label="Redes Sociais - Descrição" multiline fullWidth />

      <TextInput source="urlInstagram" label="Link Oficial do Instagram" fullWidth />
      <TextInput source="urlLinkedin" label="Link Oficial do LinkedIn" fullWidth />
    </SimpleForm>
  </Edit>
);

// ─── TOKENS DE API DE REDES SOCIAIS (EXCLUSIVO ADMINISTRADORES) ──────────────
export const ConfigSocialTokensEdit = () => (
  <Edit title="Tokens de API de Redes Sociais (Exclusivo Admin)" id="singleton">
    <SimpleForm>
      <AdminHelpBanner
        title="Gestão de Credenciais e Tokens da API Meta/LinkedIn"
        description="Esta tela armazena os tokens confidenciais de acesso do Instagram Graph API e LinkedIn API. Apenas Administradores do sistema possuem permissão para visualizar e atualizar estas chaves."
      />
      <h3 style={{ marginTop: 16, marginBottom: 8, color: '#a855f7', fontWeight: 600 }}>
        🔑 Tokens de API para Busca Automática (Instagram & LinkedIn)
      </h3>
      <TextInput
        source="instagramAccessToken"
        label="Instagram Graph API - Access Token de Longa Duração"
        helperText="Obtenha no Meta for Developers. Token com permissão instagram_basic e instagram_manage_insights"
        multiline
        fullWidth
      />
      <TextInput
        source="instagramAccountId"
        label="Instagram Business Account ID"
        helperText="ID da conta profissional do Instagram conectada à Página da empresa"
        fullWidth
      />

      <TextInput
        source="linkedinAccessToken"
        label="LinkedIn API - Access Token (OAuth 2.0)"
        helperText="Token de acesso concedido pela Organização no LinkedIn Developer Portal"
        multiline
        fullWidth
      />
      <TextInput
        source="linkedinOrganizationId"
        label="LinkedIn Organization ID"
        helperText="ID numérico ou URN da organização no LinkedIn (ex: urn:li:organization:12345678)"
        fullWidth
      />

      <SyncSocialPostsButton />
    </SimpleForm>
  </Edit>
);

// ─── INFORMAÇÕES DE CONTATO ──────────────────────────────────────────────────
export const ContatoInfoEdit = () => (
  <Edit title="Informações de Contato da Home" id="singleton">
    <SimpleForm>
      <AdminHelpBanner
        title="O que esta tela altera na Home?"
        description="Gerencie 100% dos textos do bloco de Contato da Home: o lado esquerdo (título, e-mail, telefone, endereço, horário) e o card flutuante do lado direito (título, descrição, lista de benefícios e botão de ação)."
      />

      <h3 style={{ marginTop: 24, marginBottom: 8, color: '#4f46e5', fontWeight: 600 }}>
        📌 Bloco Esquerdo — Informações Principais de Contato
      </h3>
      <TextInput source="eyebrow" label="Eyebrow (Ex: CONTATO)" helperText="Texto pequeno no topo" fullWidth />
      <TextInput source="headline" label="Título Principal (Headline)" placeholder="Pronto para evoluir a TI da sua empresa?" fullWidth />
      <TextInput source="headlineDestaque" label="Texto em Destaque no Título (Azul/Roxo)" placeholder="TI da sua empresa" helperText="Trecho dentro do Título Principal que receberá a cor azul/roxa de destaque" fullWidth />
      <TextInput source="subtitulo" label="Subtítulo / Descrição" placeholder="Conecte-se com nossos consultores seniores..." multiline rows={3} fullWidth />

      <TextInput source="email" label="E-mail de Contato" placeholder="contato@infodive.com.br" validate={required()} fullWidth />
      <TextInput source="telefone" label="Telefone Comercial" placeholder="+55 (51) 3330-0444" fullWidth />
      <TextInput source="endereco" label="Endereço Físico Completo" placeholder="Av. Cristóvão Colombo, 3000 - Sala 704 | Floresta, Porto Alegre - RS" multiline fullWidth />

      <TextInput source="horarioComercial" label="Horário de Atendimento Comercial" placeholder="Seg a Sex, 9h às 18h" fullWidth />
      <TextInput source="horarioNoc" label="Horário de Atendimento NOC / Suporte Crítico" placeholder="Suporte Crítico NOC: 24/7" fullWidth />

      <h3 style={{ marginTop: 32, marginBottom: 8, color: '#06b6d4', fontWeight: 600 }}>
        💬 Bloco Direito — Card Flutuante de Ajuda Imediata
      </h3>
      <TextInput source="cardTitulo" label="Título do Card" placeholder="Precisa de ajuda imediata?" fullWidth />
      <TextInput source="cardDescricao" label="Descrição do Card" placeholder="Fale com nossos engenheiros e receba uma análise rápida..." multiline rows={2} fullWidth />
      <TextInput source="cardCtaTexto" label="Texto do Botão (CTA)" placeholder="Falar com Especialista" fullWidth />
      <TextInput source="cardStatus" label="Indicador de Status (Rodapé do Card)" placeholder="Especialistas online no momento" fullWidth />

      <ArrayInput source="cardBullets" label="Lista de Benefícios / Ticks do Card">
        <SimpleFormIterator>
          <TextInput source="text" label="Benefício / Vantagem" fullWidth />
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Edit>
);
