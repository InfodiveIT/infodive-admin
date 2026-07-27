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
      <DateField source="publicadoEm" label="Publicado Em" />
      <BooleanField source="destaque" label="Destaque Home" />
      <BooleanField source="ativo" label="Ativo" />
    </Datagrid>
  </List>
);

import { useWatch } from 'react-hook-form';

function getYouTubeEmbedUrl(url?: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return `https://www.youtube-nocookie.com/embed/${match[2]}`;
  }
  if (url.includes('youtube.com/embed/')) return url;
  return null;
}

const MediaAndLinkFields = () => {
  const tipo = useWatch({ name: 'tipo' });
  const urlExterna = useWatch({ name: 'urlExterna' });
  const embedUrl = getYouTubeEmbedUrl(urlExterna);

  if (tipo === 'VIDEO') {
    return (
      <div style={{ width: '100%', marginBottom: 16 }}>
        <TextInput
          source="urlExterna"
          label="Link do Vídeo do YouTube (Ex: https://www.youtube.com/watch?v=...)"
          helperText="Cole a URL do vídeo do YouTube para que seja reproduzido automaticamente na página."
          fullWidth
          validate={required()}
        />
        {embedUrl ? (
          <div style={{ marginTop: 12, marginBottom: 16, borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.15)', maxWidth: 640, aspectRatio: '16/9' }}>
            <iframe
              src={embedUrl}
              title="Pré-visualização do vídeo"
              style={{ width: '100%', height: '100%', border: 0 }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          urlExterna && (
            <div style={{ marginTop: 8, marginBottom: 16, color: '#ff6b6b', fontSize: '0.85rem' }}>
              URL de vídeo do YouTube inválida ou não reconhecida.
            </div>
          )
        )}
      </div>
    );
  }

  return (
    <>
      <TextInput
        source="urlExterna"
        label="Link Externo / Saiba Mais (Opcional)"
        helperText="Se preenchido, exibirá um bloco 'Saiba mais sobre esse conteúdo aqui: (link)' no final do artigo."
        fullWidth
      />

      <ImageInput 
        source="imagemUrl" 
        label="Imagem do Banner do Artigo (Recomendado: 1200x675px - 16:9)" 
        helperText="Tamanho recomendado: 1200x675px (Proporção 16:9 Widescreen). Formatos aceitos: WEBP ou PNG. Máximo: 1MB."
        accept={{ 'image/png': ['.png'], 'image/webp': ['.webp'] }}
      >
        <ImageField source="src" title="title" />
      </ImageInput>
    </>
  );
};

export const ConteudoEdit = () => (
  <Edit title="Editar Conteúdo" mutationMode="pessimistic">
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
        ]}
        validate={required()}
      />

      <TextInput source="descricao" label="Descrição / Resumo" multiline fullWidth />
      
      <TextInput source="autor" label="Autor (Ex: Equipe Infodive)" />
      <TextInput source="tempoLeitura" label="Tempo de Leitura (Ex: 5 min de leitura)" />
      
      <TextInput source="conteudo" label="Corpo do Conteúdo (Markdown / Rich Text)" multiline fullWidth />

      <DateInput source="publicadoEm" label="Data de Publicação" />
      
      <ReferenceInput source="produtoId" reference="produtos" label="Produto Relacionado (Opcional)">
        <SelectInput optionText="nome" />
      </ReferenceInput>

      <BooleanInput source="destaque" label="Destaque na Página Inicial (Home)" defaultValue={false} />
      <BooleanInput source="ativo" label="Ativo" />

      <MediaAndLinkFields />
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
        ]}
        validate={required()}
        defaultValue="ARTIGO"
      />

      <TextInput source="descricao" label="Descrição / Resumo" multiline fullWidth />
      
      <TextInput source="autor" defaultValue="Equipe Infodive" label="Autor" />
      <TextInput source="tempoLeitura" label="Tempo de Leitura" />
      
      <TextInput source="conteudo" label="Corpo do Conteúdo (Markdown / Rich Text)" multiline fullWidth />

      <DateInput source="publicadoEm" label="Data de Publicação" defaultValue={new Date()} />
      
      <ReferenceInput source="produtoId" reference="produtos" label="Produto Relacionado (Opcional)">
        <SelectInput optionText="nome" />
      </ReferenceInput>

      <BooleanInput source="destaque" label="Destaque na Página Inicial (Home)" defaultValue={false} />
      <BooleanInput source="ativo" defaultValue={true} label="Ativo" />

      <MediaAndLinkFields />
    </SimpleForm>
  </Create>
);

// ─── CASES DE SUCESSO ────────────────────────────────────────────────────────
export const CaseList = () => (
  <List sort={{ field: 'ordem', order: 'ASC' }} aside={
    <AdminHelpAside
      title="Onde estes Cases são exibidos?"
      description={<>Histórias reais e depoimentos de clientes satisfeitos.<br /><br />Alimentam a seção de <strong>Cases & Depoimentos na Home (<code>/</code>)</strong>.</>}
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
  <Edit title="Editar Case de Sucesso" mutationMode="pessimistic">
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
      <ImageInput 
        source="imagemUrl" 
        label="Banner Vertical do Case (Recomendado: 800x1000px - 4:5 Vertical)" 
        helperText="Tamanho recomendado: 800x1000px (Proporção Vertical 4:5) ou 600x750px. Formatos aceitos: WEBP, PNG ou JPG. Máximo: 2MB."
        accept={{ 'image/png': ['.png'], 'image/webp': ['.webp'], 'image/jpeg': ['.jpg', '.jpeg'], 'image/svg+xml': ['.svg'] }}
      >
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
      <ImageInput 
        source="imagemUrl" 
        label="Banner Vertical do Case (Recomendado: 800x1000px - 4:5 Vertical)" 
        helperText="Tamanho recomendado: 800x1000px (Proporção Vertical 4:5) ou 600x750px. Formatos aceitos: WEBP, PNG ou JPG. Máximo: 2MB."
        accept={{ 'image/png': ['.png'], 'image/webp': ['.webp'], 'image/jpeg': ['.jpg', '.jpeg'], 'image/svg+xml': ['.svg'] }}
      >
        <ImageField source="src" title="title" />
      </ImageInput>
    </SimpleForm>
  </Create>
);
