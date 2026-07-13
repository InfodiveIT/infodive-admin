import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  BooleanField,
  NumberField,
  DateField,
  Edit,
  Create,
  SimpleForm,
  TextInput,
  BooleanInput,
  NumberInput,
  SelectInput,
  DateInput,
  ReferenceInput,
  ImageInput,
  ImageField,
  required,
} from 'react-admin';
import { AdminHelpAside } from './AdminHelpBanner';

// ─── CONTEÚDOS (ARTIGOS / BLOG) ──────────────────────────────────────────────
export const ConteudoList = () => (
  <List sort={{ field: 'createdAt', order: 'DESC' }} aside={
    <AdminHelpAside
      title="Onde estes Artigos são exibidos?"
      description={<>Artigos técnicos, whitepapers e postagens do <strong>Blog (<code>/blog</code>)</strong>.<br /><br />Geram as páginas individuais de cada post (<code>/blog/[slug]</code>).</>}
    />
  }>
    <Datagrid rowClick="edit">
      <TextField source="titulo" label="Título" />
      <TextField source="tipo" label="Tipo" />
      <TextField source="origem" label="Origem" />
      <DateField source="publicadoEm" label="Publicado Em" />
      <BooleanField source="destaque" label="Destaque Home" />
      <BooleanField source="ativo" label="Ativo" />
    </Datagrid>
  </List>
);

export const ConteudoEdit = () => (
  <Edit title="Editar Conteúdo">
    <SimpleForm>
      <TextInput source="titulo" validate={required()} label="Título" fullWidth />
      <TextInput source="slug" validate={required()} label="Slug" />
      
      <SelectInput
        source="tipo"
        label="Tipo de Conteúdo"
        choices={[
          { id: 'ARTIGO', name: 'Artigo' },
          { id: 'WHITEPAPER', name: 'Whitepaper' },
          { id: 'CASE', name: 'Case de Sucesso' },
          { id: 'DATASHEET', name: 'Datasheet' },
          { id: 'VIDEO', name: 'Vídeo' },
          { id: 'POST_SOCIAL', name: 'Post de Rede Social' },
        ]}
        validate={required()}
      />

      <SelectInput
        source="origem"
        label="Origem do Conteúdo"
        choices={[
          { id: 'INTERNO', name: 'Blog Interno Infodive' },
          { id: 'INSTAGRAM', name: 'Instagram' },
          { id: 'LINKEDIN', name: 'LinkedIn' },
        ]}
        validate={required()}
      />

      <TextInput source="descricao" label="Descrição / Resumo" multiline fullWidth />
      
      <TextInput source="autor" label="Autor (Ex: Equipe Infodive)" />
      <TextInput source="tempoLeitura" label="Tempo de Leitura (Ex: 5 min de leitura)" />
      
      <TextInput source="conteudo" label="Corpo do Conteúdo (Markdown / Rich Text)" multiline fullWidth />

      <TextInput source="urlExterna" label="URL Externa (Opcional, para Posts / Vídeos)" fullWidth />
      <TextInput source="socialPostId" label="ID do Post Social (Opcional, para Instagram Embed)" />

      <DateInput source="publicadoEm" label="Data de Publicação" />
      
      <ReferenceInput source="categoriaId" reference="categorias" label="Solução Relacionada (Opcional)">
        <SelectInput optionText="nome" />
      </ReferenceInput>

      <ReferenceInput source="fabricanteId" reference="fabricantes" label="Fabricante Relacionado (Opcional)">
        <SelectInput optionText="nome" />
      </ReferenceInput>

      <ReferenceInput source="produtoId" reference="produtos" label="Produto Relacionado (Opcional)">
        <SelectInput optionText="nome" />
      </ReferenceInput>

      <BooleanInput source="destaque" label="Destaque na Página Inicial (Home)" defaultValue={false} />
      <BooleanInput source="ativo" label="Ativo" />

      <ImageInput source="imagemUrl" label="Imagem de Banner (PNG, WEBP)" accept={{ 'image/png': ['.png'], 'image/webp': ['.webp'] }}>
        <ImageField source="src" title="title" />
      </ImageInput>
    </SimpleForm>
  </Edit>
);

export const ConteudoCreate = () => (
  <Create title="Criar Conteúdo">
    <SimpleForm>
      <TextInput source="titulo" validate={required()} label="Título" fullWidth />
      <TextInput source="slug" validate={required()} label="Slug" />
      
      <SelectInput
        source="tipo"
        label="Tipo de Conteúdo"
        choices={[
          { id: 'ARTIGO', name: 'Artigo' },
          { id: 'WHITEPAPER', name: 'Whitepaper' },
          { id: 'CASE', name: 'Case de Sucesso' },
          { id: 'DATASHEET', name: 'Datasheet' },
          { id: 'VIDEO', name: 'Vídeo' },
          { id: 'POST_SOCIAL', name: 'Post de Rede Social' },
        ]}
        validate={required()}
        defaultValue="ARTIGO"
      />

      <SelectInput
        source="origem"
        label="Origem do Conteúdo"
        choices={[
          { id: 'INTERNO', name: 'Blog Interno Infodive' },
          { id: 'INSTAGRAM', name: 'Instagram' },
          { id: 'LINKEDIN', name: 'LinkedIn' },
        ]}
        validate={required()}
        defaultValue="INTERNO"
      />

      <TextInput source="descricao" label="Descrição / Resumo" multiline fullWidth />
      
      <TextInput source="autor" defaultValue="Equipe Infodive" label="Autor" />
      <TextInput source="tempoLeitura" label="Tempo de Leitura" />
      
      <TextInput source="conteudo" label="Corpo do Conteúdo (Markdown / Rich Text)" multiline fullWidth />

      <TextInput source="urlExterna" label="URL Externa (Opcional)" fullWidth />
      <TextInput source="socialPostId" label="ID do Post Social (Opcional)" />

      <DateInput source="publicadoEm" label="Data de Publicação" defaultValue={new Date()} />
      
      <ReferenceInput source="categoriaId" reference="categorias" label="Solução Relacionada (Opcional)">
        <SelectInput optionText="nome" />
      </ReferenceInput>

      <ReferenceInput source="fabricanteId" reference="fabricantes" label="Fabricante Relacionado (Opcional)">
        <SelectInput optionText="nome" />
      </ReferenceInput>

      <ReferenceInput source="produtoId" reference="produtos" label="Produto Relacionado (Opcional)">
        <SelectInput optionText="nome" />
      </ReferenceInput>

      <BooleanInput source="destaque" label="Destaque na Página Inicial (Home)" defaultValue={false} />
      <BooleanInput source="ativo" defaultValue={true} label="Ativo" />

      <ImageInput source="imagemUrl" label="Imagem de Banner (PNG, WEBP)" accept={{ 'image/png': ['.png'], 'image/webp': ['.webp'] }}>
        <ImageField source="src" title="title" />
      </ImageInput>
    </SimpleForm>
  </Create>
);

// ─── CASES DE SUCESSO ────────────────────────────────────────────────────────
export const CaseList = () => (
  <List sort={{ field: 'ordem', order: 'ASC' }} aside={
    <AdminHelpAside
      title="Onde estes Cases são exibidos?"
      description={<>Histórias reais e depoimentos de clientes satisfeitos.<br /><br />Alimentam a seção de <strong>Cases & Depoimentos na Home (<code>/</code>)</strong> e as listagens no <strong>Blog</strong>.</>}
    />
  }>
    <Datagrid rowClick="edit">
      <NumberField source="ordem" label="#" />
      <TextField source="cliente" label="Cliente" />
      <TextField source="segmento" label="Segmento" />
      <TextField source="titulo" label="Título" />
      <TextField source="metrica" label="Métrica" />
      <BooleanField source="ativo" label="Ativo" />
    </Datagrid>
  </List>
);

export const CaseEdit = () => (
  <Edit title="Editar Case de Sucesso">
    <SimpleForm>
      {/* ─── Identificação ─── */}
      <TextInput source="cliente" validate={required()} label="Nome do Cliente" />
      <TextInput source="segmento" validate={required()} label="Segmento / Setor" />
      <NumberInput source="ordem" label="Ordem de exibição" />
      <BooleanInput source="ativo" label="Publicado (visível no site)" defaultValue={true} />

      {/* ─── Conteúdo principal ─── */}
      <TextInput source="titulo" validate={required()} label="Título do Projeto" fullWidth />
      <TextInput source="desafio" validate={required()} label="O Desafio" multiline fullWidth />
      <TextInput source="resultado" validate={required()} label="A Solução / Resultado" multiline fullWidth />
      <TextInput source="metrica" label="Métrica Chave (ex: 35% Economia, 99.99% Uptime)" fullWidth />

      {/* ─── Depoimento ─── */}
      <TextInput source="depoimento" label="Depoimento do Cliente" multiline fullWidth />
      <TextInput source="autor" label="Nome do Autor" />
      <TextInput source="cargo" label="Cargo do Autor" />

      {/* ─── Imagem ─── */}
      <ImageInput source="imagemUrl" label="Imagem Representativa (PNG, WEBP, SVG)" accept={{ 'image/png': ['.png'], 'image/webp': ['.webp'], 'image/svg+xml': ['.svg'] }}>
        <ImageField source="src" title="title" />
      </ImageInput>
    </SimpleForm>
  </Edit>
);

export const CaseCreate = () => (
  <Create title="Criar Case de Sucesso">
    <SimpleForm>
      {/* ─── Identificação ─── */}
      <TextInput source="cliente" validate={required()} label="Nome do Cliente" />
      <TextInput source="segmento" validate={required()} label="Segmento / Setor" />
      <NumberInput source="ordem" defaultValue={1} label="Ordem de exibição" />
      <BooleanInput source="ativo" label="Publicado (visível no site)" defaultValue={true} />

      {/* ─── Conteúdo principal ─── */}
      <TextInput source="titulo" validate={required()} label="Título do Projeto" fullWidth />
      <TextInput source="desafio" validate={required()} label="O Desafio" multiline fullWidth />
      <TextInput source="resultado" validate={required()} label="A Solução / Resultado" multiline fullWidth />
      <TextInput source="metrica" label="Métrica Chave (ex: 35% Economia, 99.99% Uptime)" fullWidth />

      {/* ─── Depoimento ─── */}
      <TextInput source="depoimento" label="Depoimento do Cliente" multiline fullWidth />
      <TextInput source="autor" label="Nome do Autor" />
      <TextInput source="cargo" label="Cargo do Autor" />

      {/* ─── Imagem ─── */}
      <ImageInput source="imagemUrl" label="Imagem Representativa (PNG, WEBP, SVG)" accept={{ 'image/png': ['.png'], 'image/webp': ['.webp'], 'image/svg+xml': ['.svg'] }}>
        <ImageField source="src" title="title" />
      </ImageInput>
    </SimpleForm>
  </Create>
);
