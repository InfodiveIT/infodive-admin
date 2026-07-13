import React from 'react';
import {
  Edit,
  SimpleForm,
  TextInput,
  ArrayInput,
  SimpleFormIterator,
  required,
} from 'react-admin';
import { AdminHelpBanner } from './AdminHelpBanner';

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

// ─── CONFIGURAÇÕES DO BLOG ───────────────────────────────────────────────────
export const ConfigBlogEdit = () => (
  <Edit title="Configurações do Blog" id="singleton">
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

// ─── INFORMAÇÕES DE CONTATO ──────────────────────────────────────────────────
export const ContatoInfoEdit = () => (
  <Edit title="Informações de Contato" id="singleton">
    <SimpleForm>
      <AdminHelpBanner
        title="O que esta tela altera no site?"
        description="Altera os dados de e-mail, telefones, endereço físico, horários de operação do NOC e cartões de status exibidos nas seções de Contato do site."
      />
      <TextInput source="eyebrow" label="Contato - Eyebrow da Página" />
      <TextInput source="headline" label="Contato - Headline Principal" fullWidth />
      <TextInput source="subtitulo" label="Contato - Subtítulo / Descrição" multiline fullWidth />
      
      <TextInput source="email" label="E-mail de Contato Principal" validate={required()} />
      <TextInput source="telefone" label="Telefone Comercial" />
      <TextInput source="endereco" label="Endereço Físico" fullWidth />
      
      <TextInput source="horarioComercial" label="Horário de Atendimento Comercial" />
      <TextInput source="horarioNoc" label="Horário de Operação do NOC (Suporte)" />

      <TextInput source="cardTitulo" label="Card de Status - Título" />
      <TextInput source="cardDescricao" label="Card de Status - Descrição" multiline fullWidth />
      <TextInput source="cardCtaTexto" label="Card de Status - Texto do Botão (CTA)" />
      <TextInput source="cardStatus" label="Card de Status - Indicador (Ex: Operando Normalmente)" />

      <ArrayInput source="cardBullets" label="Bullets de Vantagens do Card">
        <SimpleFormIterator>
          <TextInput source="text" label="Bullet" fullWidth />
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Edit>
);
