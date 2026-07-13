import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  Edit,
  SimpleForm,
  TextInput,
  required,
} from 'react-admin';
import { AdminHelpAside, AdminHelpBanner } from './AdminHelpBanner';

// ─── PÁGINAS HERO (HEROES POR PÁGINA) ────────────────────────────────────────
export const PaginaHeroList = () => (
  <List title="Banners Hero das Páginas" aside={
    <AdminHelpAside
      title="Onde estes Banners são exibidos?"
      description={<>Banners principais de topo (1ª Seção) de cada página interna do site (ex: <code>/solucoes</code>, <code>/produtos</code>, <code>/servicos</code>, <code>/blog</code>, <code>/sobre</code>).<br /><br />Altera o título principal, subtítulo e os textos destacados no topo de cada página.</>}
    />
  }>
    <Datagrid rowClick="edit">
      <TextField source="id" label="Página" />
      <TextField source="eyebrow" label="Eyebrow" />
      <TextField source="headline" label="Headline" />
    </Datagrid>
  </List>
);

export const PaginaHeroEdit = () => (
  <Edit title="Editar Banner Hero da Página">
    <SimpleForm>
      <AdminHelpBanner
        title="O que esta tela altera no site?"
        description="Esta tela altera o Banner Principal do topo (Hero) da página selecionada. Altere o Eyebrow, o Título Principal (Headline) e o trecho destacado em azul vibrante."
      />
      <TextInput source="id" disabled label="Página" />
      <TextInput source="eyebrow" label="Eyebrow (Texto Pequeno Superior)" />
      <TextInput source="headline" label="Headline (Título Principal)" fullWidth />
      <TextInput source="headlineDestaque" label="Texto Destacado (Efeito Azul/Brilho)" helperText="Selecione o trecho exato do título que deve receber o efeito azul e brilhoso de missão crítica." fullWidth />
      <TextInput source="subtitulo" label="Subtítulo (Parágrafo)" multiline fullWidth />
      <TextInput source="tagline" label="Tagline (Selo de Destaque)" />
    </SimpleForm>
  </Edit>
);

// ─── CTAS POR PÁGINA ─────────────────────────────────────────────────────────
export const CtaList = () => (
  <List title="Blocos CTA (Call to Action)" aside={
    <AdminHelpAside
      title="Onde estes CTAs são exibidos?"
      description={<>Blocos de chamada final para ação ("Fale com um Especialista").<br /><br />Exibidos no rodapé/final de cada página interna do site para conversão de leads.</>}
    />
  }>
    <Datagrid rowClick="edit">
      <TextField source="id" label="Página" />
      <TextField source="titulo" label="Título" />
      <TextField source="ctaTexto" label="Texto do Botão" />
    </Datagrid>
  </List>
);

export const CtaEdit = () => (
  <Edit title="Editar Bloco CTA">
    <SimpleForm>
      <AdminHelpBanner
        title="O que este bloco altera no site?"
        description="Este bloco de Call to Action é exibido próximo ao rodapé da página para incentivar o visitante a entrar em contato com um especialista."
      />
      <TextInput source="id" disabled label="Página" />
      <TextInput source="titulo" validate={required()} label="Título do Bloco" fullWidth />
      <TextInput source="subtitulo" label="Subtítulo / Descrição" multiline fullWidth />
      <TextInput source="ctaTexto" label="Texto do Botão (CTA)" />
    </SimpleForm>
  </Edit>
);
