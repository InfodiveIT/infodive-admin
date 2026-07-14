import React from 'react';
import {
  Edit,
  SimpleForm,
  TextInput,
  ArrayInput,
  SimpleFormIterator,
  NumberInput,
  BooleanInput,
  ImageInput,
  ImageField,
  required,
} from 'react-admin';
import { AdminHelpBanner } from './AdminHelpBanner';

// ─── SOBRE NÚMEROS ───────────────────────────────────────────────────────────
export const SobreNumerosEdit = () => (
  <Edit title="Sobre - Números e Métricas" id="singleton">
    <SimpleForm>
      <AdminHelpBanner
        title="O que esta tela altera no site?"
        description={<>Configura a seção de <strong>Números e Estatísticas de Impacto</strong> da página <strong>Quem Somos (<code>/sobre</code>)</strong>.</>}
      />
      <TextInput source="textoDescritivo" label="Texto Descritivo Principal" multiline fullWidth />
      
      <ArrayInput source="stats" label="Métricas/Estatísticas">
        <SimpleFormIterator>
          <TextInput source="prefixo" label="Prefixo (Ex: +)" />
          <NumberInput
            source="valor"
            label="Valor Numérico Final (Resultado Exibido)"
            validate={required()}
            helperText="O número final que será exibido no cartão (Ex: 2003, 500, 20)."
          />
          <NumberInput
            source="valorInicial"
            label="Início da Contagem Animada"
            defaultValue={0}
            helperText="Número onde a animação contadora inicia ao rolar a página (Ex: 0 para contar até 500, ou 1990 para contar até 2003)."
          />
          <TextInput source="sufixo" label="Sufixo (Ex: %)" />
          <TextInput source="label" label="Rótulo (Ex: Projetos executados)" validate={required()} fullWidth />
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Edit>
);

// ─── SOBRE TIMELINE ──────────────────────────────────────────────────────────
export const SobreTimelineEdit = () => (
  <Edit title="Sobre - Linha do Tempo (História)" id="singleton">
    <SimpleForm>
      <AdminHelpBanner
        title="O que esta tela altera no site?"
        description={<>Configura a <strong>Linha do Tempo (Timeline)</strong> de conquistas e evolução na página <strong>Quem Somos (<code>/sobre</code>)</strong>.</>}
      />
      <TextInput source="eyebrow" label="Eyebrow" />
      <TextInput source="headline" label="Headline Principal" fullWidth />
      
      <ArrayInput source="marcos" label="Marcos Temporais (Linha do Tempo)">
        <SimpleFormIterator>
          <TextInput source="ano" label="Ano (Ex: 2024)" validate={required()} />
          <TextInput source="titulo" label="Título do Evento" validate={required()} fullWidth />
          <TextInput source="descricao" label="Descrição do Acontecimento" multiline fullWidth />
          <BooleanInput source="destaque" label="Destaque Visual?" />
          <NumberInput source="ordem" label="Ordem de Exibição" />
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Edit>
);

// ─── SOBRE VALORES ───────────────────────────────────────────────────────────
export const SobreValoresEdit = () => (
  <Edit title="Sobre - Missão, Visão e Valores" id="singleton">
    <SimpleForm>
      <AdminHelpBanner
        title="O que esta tela altera no site?"
        description={<>Configura os cartões de <strong>Missão, Visão e Valores Corporativos</strong> na página <strong>Quem Somos (<code>/sobre</code>)</strong>.</>}
      />
      <TextInput source="eyebrow" label="Eyebrow" />
      <TextInput source="headline" label="Headline Principal" fullWidth />
      <TextInput source="paragrafo" label="Texto de Introdução" multiline fullWidth />
      
      <ArrayInput source="valores" label="Lista de Valores">
        <SimpleFormIterator>
          <TextInput source="icone" label="Ícone Lucide (Ex: shield, users)" />
          <TextInput source="titulo" label="Título" validate={required()} />
          <TextInput source="descricao" label="Descrição" multiline validate={required()} fullWidth />
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Edit>
);

// ─── SOBRE CULTURA ───────────────────────────────────────────────────────────
export const SobreCulturaEdit = () => (
  <Edit title="Sobre - Cultura Organizacional" id="singleton">
    <SimpleForm>
      <AdminHelpBanner
        title="O que esta tela altera no site?"
        description={<>Configura a <strong>Galeria de Fotos da Cultura Organizacional</strong> e o time na página <strong>Quem Somos (<code>/sobre</code>)</strong>.</>}
      />
      <TextInput source="eyebrow" label="Eyebrow" />
      <TextInput source="headline" label="Headline Principal" fullWidth />
      <TextInput source="paragrafo" label="Texto sobre Cultura & Time" multiline fullWidth />
      
      <ArrayInput source="fotos" label="Fotos da Galeria de Cultura">
        <SimpleFormIterator>
          <ImageInput source="imagemUrl" label="Carregar Foto (PNG, WEBP)" accept={{ 'image/png': ['.png'], 'image/webp': ['.webp'] }} validate={required()}>
            <ImageField source="src" title="title" />
          </ImageInput>
          <TextInput source="alt" label="Texto Alternativo (Alt - Acessibilidade)" />
          <NumberInput source="ordem" label="Ordem de Exibição" />
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Edit>
);
