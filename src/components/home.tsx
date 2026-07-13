import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  NumberField,
  Edit,
  Create,
  SimpleForm,
  TextInput,
  NumberInput,
  ImageInput,
  ImageField,
  required,
  FormDataConsumer,
  Toolbar,
  SaveButton,
  TopToolbar,
  ListButton,
} from 'react-admin';
import { AdminHelpAside } from './AdminHelpBanner';

// ─── HOME HERO CAROUSEL ──────────────────────────────────────────────────────
export const HeroCarouselList = () => (
  <List sort={{ field: 'ordem', order: 'ASC' }} title="Carrossel Hero (Home)" aside={
    <AdminHelpAside
      title="Onde este carrossel é exibido?"
      description={<>Banners rotativos em background na 1ª Seção (Hero do topo) da página <strong>Home (<code>/</code>)</strong>.</>}
    />
  }>
    <Datagrid rowClick="edit">
      <NumberField source="ordem" label="Ordem" />
      <TextField source="imagemUrl" label="URL da Imagem" />
    </Datagrid>
  </List>
);

export const HeroCarouselEdit = () => (
  <Edit title="Editar Banner do Carrossel">
    <SimpleForm>
      <NumberInput source="ordem" validate={required()} label="Ordem" />
      <ImageInput source="imagemUrl" label="Imagem do Banner (PNG, WEBP)" accept={{ 'image/png': ['.png'], 'image/webp': ['.webp'] }}>
        <ImageField source="src" title="title" />
      </ImageInput>
    </SimpleForm>
  </Edit>
);

export const HeroCarouselCreate = () => (
  <Create title="Adicionar Banner ao Carrossel">
    <SimpleForm>
      <NumberInput source="ordem" validate={required()} defaultValue={1} label="Ordem" />
      <ImageInput source="imagemUrl" label="Imagem do Banner (PNG, WEBP)" accept={{ 'image/png': ['.png'], 'image/webp': ['.webp'] }}>
        <ImageField source="src" title="title" />
      </ImageInput>
    </SimpleForm>
  </Create>
);

// ─── HOME SOLUÇÕES BENTO ─────────────────────────────────────────────────────
export const HomeSolucoesBentoList = () => (
  <List sort={{ field: 'ordem', order: 'ASC' }} title="Bento Grid de Soluções (Home)" aside={
    <AdminHelpAside
      title="Onde o Bento Grid é exibido?"
      description={<>Grade de destaques (Bento Grid) da 2ª Seção da página <strong>Home (<code>/</code>)</strong>.<br /><br />Configura os destaques visuais de Infraestrutura, Segurança, IA e Nuvem.</>}
    />
  }>
    <Datagrid rowClick="edit" bulkActionButtons={false}>
      <TextField source="nome" label="Nome" />
      <TextField source="icone" label="Ícone" />
      <NumberField source="ordem" label="Ordem" />
    </Datagrid>
  </List>
);

const BentoEditToolbar = (props: any) => (
  <Toolbar {...props}>
    <SaveButton />
  </Toolbar>
);

export const HomeSolucoesBentoEdit = () => (
  <Edit title="Editar Item do Bento Grid">
    <SimpleForm toolbar={<BentoEditToolbar />}>
      <TextInput source="nome" validate={required()} label="Nome da Solução" />
      <TextInput source="descricao" label="Descrição" multiline fullWidth />
      <TextInput source="icone" label="Ícone Lucide" />
      <NumberInput source="ordem" label="Ordem" />
      <FormDataConsumer>
        {({ formData, ...rest }) => 
          Number(formData.ordem) === 1 ? (
            <TextInput 
              source="textoCarrossel" 
              label="Cards do Carrossel (Um por linha: 'ícone | título | descrição')" 
              multiline 
              fullWidth 
              {...rest} 
            />
          ) : null
        }
      </FormDataConsumer>
      <FormDataConsumer>
        {({ formData, ...rest }) => 
          Number(formData.ordem) === 3 ? (
            <ImageInput 
              source="imagemIaUrl" 
              label="Ilustração IA (PNG, WEBP)" 
              accept={{ 'image/png': ['.png'], 'image/webp': ['.webp'] }}
              {...rest}
            >
              <ImageField source="src" title="title" />
            </ImageInput>
          ) : null
        }
      </FormDataConsumer>
    </SimpleForm>
  </Edit>
);

export const HomeSolucoesBentoCreate = () => (
  <Create title="Criar Item no Bento Grid">
    <SimpleForm>
      <TextInput source="nome" validate={required()} label="Nome da Solução" />
      <TextInput source="descricao" label="Descrição" multiline fullWidth />
      <TextInput source="icone" label="Ícone Lucide" />
      <NumberInput source="ordem" defaultValue={1} label="Ordem" />
      <FormDataConsumer>
        {({ formData, ...rest }) => 
          Number(formData.ordem) === 1 ? (
            <TextInput 
              source="textoCarrossel" 
              label="Cards do Carrossel (Um por linha: 'ícone | título | descrição')" 
              multiline 
              fullWidth 
              {...rest} 
            />
          ) : null
        }
      </FormDataConsumer>
      <FormDataConsumer>
        {({ formData, ...rest }) => 
          Number(formData.ordem) === 3 ? (
            <ImageInput 
              source="imagemIaUrl" 
              label="Ilustração IA (PNG, WEBP)" 
              accept={{ 'image/png': ['.png'], 'image/webp': ['.webp'] }}
              {...rest}
            >
              <ImageField source="src" title="title" />
            </ImageInput>
          ) : null
        }
      </FormDataConsumer>
    </SimpleForm>
  </Create>
);

// ─── HOME SEGURANÇA MARQUEE ──────────────────────────────────────────────────
export const HomeSegurancaMarqueeList = () => (
  <List sort={{ field: 'ordem', order: 'ASC' }} title="Marquee de Segurança (Home)" aside={
    <AdminHelpAside
      title="Onde o Marquee é exibido?"
      description={<>Letreiro deslizante continuo (Marquee) de pilares de cibersegurança exibido na <strong>Home (<code>/</code>)</strong>.</>}
    />
  }>
    <Datagrid rowClick="edit">
      <TextField source="titulo" label="Título" />
      <NumberField source="ordem" label="Ordem" />
    </Datagrid>
  </List>
);

export const HomeSegurancaMarqueeEdit = () => (
  <Edit title="Editar Elemento do Marquee">
    <SimpleForm>
      <TextInput source="titulo" validate={required()} label="Título" />
      <TextInput source="corpo" label="Texto Principal" multiline fullWidth />
      <TextInput source="icone" label="Ícone Lucide" />
      <NumberInput source="ordem" label="Ordem" />
    </SimpleForm>
  </Edit>
);

export const HomeSegurancaMarqueeCreate = () => (
  <Create title="Criar Elemento no Marquee">
    <SimpleForm>
      <TextInput source="titulo" validate={required()} label="Título" />
      <TextInput source="corpo" label="Texto Principal" multiline fullWidth />
      <TextInput source="icone" label="Ícone Lucide" />
      <NumberInput source="ordem" defaultValue={1} label="Ordem" />
    </SimpleForm>
  </Create>
);

// ─── HOME PROBLEMAS ──────────────────────────────────────────────────────────
export const HomeProblemasList = () => (
  <List sort={{ field: 'ordem', order: 'ASC' }} title="Problemas Comuns (Home)" aside={
    <AdminHelpAside
      title="Onde os Problemas Comuns são exibidos?"
      description={<>Seção "Problemas Comuns Enfrentados" da página <strong>Home (<code>/</code>)</strong>.<br /><br />Aponta gargalos reais das empresas (ex: Ransomware, Downtime) e qual solução Infodive resolve o problema.</>}
    />
  }>
    <Datagrid rowClick="edit">
      <TextField source="titulo" label="Título" />
      <TextField source="solucaoIndicada" label="Solução Indicada" />
      <NumberField source="ordem" label="Ordem" />
    </Datagrid>
  </List>
);

export const HomeProblemasEdit = () => (
  <Edit title="Editar Problema Comum">
    <SimpleForm>
      <TextInput source="titulo" validate={required()} label="Problema / Gargalo" fullWidth />
      <TextInput source="descricao" label="Descrição da Dor" multiline fullWidth />
      <TextInput source="solucaoIndicada" label="Solução Indicada (Texto)" />
      <TextInput source="href" label="Link de Destino (Ex: /solucoes/seguranca)" />
      <NumberInput source="ordem" label="Ordem" />
    </SimpleForm>
  </Edit>
);

export const HomeProblemasCreate = () => (
  <Create title="Registrar Problema Comum">
    <SimpleForm>
      <TextInput source="titulo" validate={required()} label="Problema / Gargalo" fullWidth />
      <TextInput source="descricao" label="Descrição da Dor" multiline fullWidth />
      <TextInput source="solucaoIndicada" label="Solução Indicada (Texto)" />
      <TextInput source="href" label="Link de Destino" />
      <NumberInput source="ordem" defaultValue={1} label="Ordem" />
    </SimpleForm>
  </Create>
);

// ─── HOME TRUST STATS ────────────────────────────────────────────────────────
export const HomeTrustStatsList = () => (
  <List sort={{ field: 'ordem', order: 'ASC' }} title="Estatísticas de Confiança (Home)" aside={
    <AdminHelpAside
      title="Onde as Métricas são exibidas?"
      description={<>Contadores numéricos animados de prova social na <strong>Home (<code>/</code>)</strong>.<br /><br />(ex: <em>+150 Clientes Atendidos, 99.9% de SLA</em>).</>}
    />
  }>
    <Datagrid rowClick="edit" bulkActionButtons={false}>
      <TextField source="eyebrow" label="Categoria" />
      <TextField source="prefixo" label="Prefixo" />
      <NumberField source="valor" label="Valor" />
      <TextField source="sufixo" label="Sufixo" />
      <TextField source="titulo" label="Título" />
      <NumberField source="ordem" label="#" />
    </Datagrid>
  </List>
);

const EditToolbarWithoutDelete = (props: any) => (
  <Toolbar {...props}>
    <SaveButton />
  </Toolbar>
);

const EditActionsWithoutDelete = () => (
  <TopToolbar>
    <ListButton />
  </TopToolbar>
);

export const HomeTrustStatsEdit = () => (
  <Edit title="Editar Estatística" actions={<EditActionsWithoutDelete />}>
    <SimpleForm toolbar={<EditToolbarWithoutDelete />}>
      <TextInput source="eyebrow" label="Categoria (Eyebrow)" validate={required()} />
      <TextInput source="prefixo" label="Prefixo (Ex: +)" />
      <NumberInput source="valor" validate={required()} label="Valor Numérico" />
      <TextInput source="sufixo" label="Sufixo (Ex: %)" />
      <TextInput source="titulo" validate={required()} label="Título (Ex: Clientes atendidos)" fullWidth />
      <TextInput source="descricao" label="Descrição detalhada" multiline fullWidth />
      <NumberInput source="valorInicial" label="Valor Inicial da Animação" />
      <NumberInput source="ordem" label="Ordem de exibição" />
    </SimpleForm>
  </Edit>
);

export const HomeTrustStatsCreate = () => (
  <Create title="Criar Estatística">
    <SimpleForm>
      <TextInput source="titulo" validate={required()} label="Título" />
      <TextInput source="eyebrow" label="Eyebrow" />
      <TextInput source="prefixo" label="Prefixo" />
      <NumberInput source="valor" validate={required()} label="Valor Numérico" />
      <NumberInput source="valorInicial" defaultValue={0} label="Valor Inicial" />
      <TextInput source="sufixo" label="Sufixo" />
      <TextInput source="descricao" label="Descrição detalhada" multiline fullWidth />
      <NumberInput source="ordem" defaultValue={1} label="Ordem" />
    </SimpleForm>
  </Create>
);

// ─── HOME SEÇÕES (TÍTULOS / EYEBROWS) ───────────────────────────────────────
export const SecaoHomeList = () => (
  <List title="Títulos de Seções (Home)" aside={
    <AdminHelpAside
      title="Onde estes Títulos são exibidos?"
      description={<>Títulos e cabeçalhos de cada seção da página <strong>Home (<code>/</code>)</strong>.<br /><br />Permite alterar os textos chamativos e as palavras em destaque azul de cada bloco da Home.</>}
    />
  }>
    <Datagrid rowClick="edit">
      <TextField source="id" label="Código da Seção" />
      <TextField source="eyebrow" label="Eyebrow" />
      <TextField source="headline" label="Headline" />
    </Datagrid>
  </List>
);

export const SecaoHomeEdit = () => (
  <Edit title="Editar Título de Seção">
    <SimpleForm>
      <TextInput source="id" disabled label="Código da Seção" />
      <TextInput source="eyebrow" label="Eyebrow (Texto pequeno superior)" />
      <TextInput source="headline" label="Headline (Título Principal)" fullWidth />
      <TextInput source="headlineDestaque" label="Texto Destacado (Cor Azul)" helperText="Digite a palavra ou frase exata do título que deve ficar em azul." fullWidth />
      <TextInput source="subtitulo" label="Subtítulo / Parágrafo descritivo" multiline fullWidth />
      
      <FormDataConsumer>
        {({ formData }) => {
          if (formData && (formData.secao === 'problemas' || formData.id === 'problemas')) {
            return (
              <>
                <TextInput source="boxTitulo" label="Título da Caixa de Destaque (Suporte)" fullWidth />
                <TextInput source="boxDescricao" label="Descrição da Caixa de Destaque (Suporte)" multiline fullWidth />
              </>
            );
          }
          return null;
        }}
      </FormDataConsumer>
    </SimpleForm>
  </Edit>
);

// ─── FAQ ─────────────────────────────────────────────────────────────────────
export const FaqList = () => (
  <List sort={{ field: 'ordem', order: 'ASC' }} title="Perguntas Frequentes (FAQ)" aside={
    <AdminHelpAside
      title="Onde o FAQ é exibido?"
      description={<>Perguntas e Respostas Frequentes exibidas na seção de FAQ da <strong>Home (<code>/</code>)</strong>.</>}
    />
  }>
    <Datagrid rowClick="edit">
      <TextField source="pergunta" label="Pergunta" />
      <NumberField source="ordem" label="Ordem" />
    </Datagrid>
  </List>
);

export const FaqEdit = () => (
  <Edit title="Editar FAQ">
    <SimpleForm>
      <TextInput source="pergunta" validate={required()} label="Pergunta" fullWidth />
      <TextInput source="resposta" validate={required()} label="Resposta" multiline fullWidth />
      <NumberInput source="ordem" label="Ordem" />
    </SimpleForm>
  </Edit>
);

export const FaqCreate = () => (
  <Create title="Criar FAQ">
    <SimpleForm>
      <TextInput source="pergunta" validate={required()} label="Pergunta" fullWidth />
      <TextInput source="resposta" validate={required()} label="Resposta" multiline fullWidth />
      <NumberInput source="ordem" defaultValue={1} label="Ordem" />
    </SimpleForm>
  </Create>
);
