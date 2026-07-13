import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  BooleanField,
  NumberField,
  Edit,
  Create,
  SimpleForm,
  TextInput,
  BooleanInput,
  NumberInput,
  ArrayInput,
  SimpleFormIterator,
  ReferenceInput,
  SelectInput,
  ReferenceArrayInput,
  SelectArrayInput,
  ImageInput,
  ImageField,
  ReferenceField,
  required,
} from 'react-admin';
import { AdminHelpAside } from './AdminHelpBanner';

// ─── SOLUÇÕES ──────────────────────────────────────────────────────────────
export const SolucaoList = () => (
  <List sort={{ field: 'ordem', order: 'ASC' }} aside={
    <AdminHelpAside
      title="Onde este catálogo é exibido?"
      description={<>Grandes Soluções Corporativas da Infodive.<br /><br />Alimentam os cards do <strong>Bento Grid na Home</strong>, os itens no menu dropdown da <strong>Navbar</strong> e a listagem completa na página <code>/solucoes</code>.</>}
    />
  }>
    <Datagrid rowClick="edit">
      <TextField source="nome" label="Nome" />
      <TextField source="slug" label="Slug" />
      <TextField source="icone" label="Ícone" />
      <ReferenceField source="categoriaId" reference="categorias" label="Categoria">
        <TextField source="nome" />
      </ReferenceField>
      <NumberField source="ordem" label="Ordem" />
      <BooleanField source="ativo" label="Ativo" />
    </Datagrid>
  </List>
);

export const SolucaoEdit = () => (
  <Edit title="Editar Solução">
    <SimpleForm>
      <TextInput source="nome" validate={required()} label="Nome" />
      <TextInput source="slug" validate={required()} label="Slug (Ex: infraestrutura)" />
      <TextInput source="icone" label="Ícone Lucide (Ex: server, lock)" />
      
      <ReferenceInput source="categoriaId" reference="categorias" label="Categoria Associada (Tag)">
        <SelectInput optionText="nome" validate={required()} />
      </ReferenceInput>

      <TextInput source="subtituloCurto" label="Subtítulo Curto" fullWidth />
      <TextInput source="descricaoCurta" label="Descrição Curta" multiline fullWidth />
      <TextInput source="descricaoCompleta" label="Descrição Completa" multiline fullWidth />
      <NumberInput source="ordem" label="Ordem" />
      <BooleanInput source="ativo" label="Ativo" />
      
      <ImageInput source="imagemUrl" label="Imagem Representativa (PNG, WEBP)" accept={{ 'image/png': ['.png'], 'image/webp': ['.webp'] }}>
        <ImageField source="src" title="title" />
      </ImageInput>

      <TextInput source="fabricantesTitulo" label="Título do Bloco de Parceiros" fullWidth />
      <TextInput source="fabricantesDescricao" label="Descrição do Bloco de Parceiros" multiline fullWidth />

      <ArrayInput source="features" label="Recursos Principais">
        <SimpleFormIterator>
          <TextInput source="titulo" label="Título" validate={required()} />
          <TextInput source="descricao" label="Descrição" multiline validate={required()} />
          <TextInput source="tag" label="Tag (Ex: Hardware, Rede)" />
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Edit>
);

export const SolucaoCreate = () => (
  <Create title="Criar Solução">
    <SimpleForm>
      <TextInput source="nome" validate={required()} label="Nome" />
      <TextInput source="slug" validate={required()} label="Slug" />
      <TextInput source="icone" label="Ícone Lucide" />

      <ReferenceInput source="categoriaId" reference="categorias" label="Categoria Associada (Tag)">
        <SelectInput optionText="nome" validate={required()} />
      </ReferenceInput>

      <TextInput source="subtituloCurto" label="Subtítulo Curto" fullWidth />
      <TextInput source="descricaoCurta" label="Descrição Curta" multiline fullWidth />
      <TextInput source="descricaoCompleta" label="Descrição Completa" multiline fullWidth />
      <NumberInput source="ordem" defaultValue={1} label="Ordem" />
      <BooleanInput source="ativo" defaultValue={true} label="Ativo" />
      
      <ImageInput source="imagemUrl" label="Imagem Representativa (PNG, WEBP)" accept={{ 'image/png': ['.png'], 'image/webp': ['.webp'] }}>
        <ImageField source="src" title="title" />
      </ImageInput>

      <TextInput source="fabricantesTitulo" label="Título do Bloco de Parceiros" fullWidth />
      <TextInput source="fabricantesDescricao" label="Descrição do Bloco de Parceiros" multiline fullWidth />

      <ArrayInput source="features" label="Recursos Principais">
        <SimpleFormIterator>
          <TextInput source="titulo" label="Título" validate={required()} />
          <TextInput source="descricao" label="Descrição" multiline validate={required()} />
          <TextInput source="tag" label="Tag" />
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Create>
);

// ─── CATEGORIAS (TAGS) ────────────────────────────────────────────────────────
export const CategoriaList = () => (
  <List sort={{ field: 'ordem', order: 'ASC' }} aside={
    <AdminHelpAside
      title="Onde estas Categorias são exibidas?"
      description={<>Categorias dos pilares corporativos (ex: <em>Segurança, Infraestrutura, Cloud</em>).<br /><br />Definem as opções no dropdown da <strong>Navbar</strong> e as abas de filtro na página <code>/solucoes</code>.</>}
    />
  }>
    <Datagrid rowClick="edit">
      <TextField source="nome" label="Nome" />
      <TextField source="slug" label="Slug" />
      <NumberField source="ordem" label="Ordem" />
      <BooleanField source="ativo" label="Ativo" />
    </Datagrid>
  </List>
);

export const CategoriaEdit = () => (
  <Edit title="Editar Categoria">
    <SimpleForm>
      <TextInput source="nome" validate={required()} label="Nome" />
      <TextInput source="slug" validate={required()} label="Slug" disabled />
      <NumberInput source="ordem" label="Ordem" />
      <BooleanInput source="ativo" label="Ativo" />
    </SimpleForm>
  </Edit>
);

export const CategoriaCreate = () => (
  <Create title="Criar Categoria">
    <SimpleForm>
      <TextInput source="nome" validate={required()} label="Nome" />
      <TextInput source="slug" validate={required()} label="Slug" />
      <NumberInput source="ordem" defaultValue={1} label="Ordem" />
      <BooleanInput source="ativo" defaultValue={true} label="Ativo" />
    </SimpleForm>
  </Create>
);

// ─── FABRICANTES ─────────────────────────────────────────────────────────────
export const FabricanteList = () => (
  <List sort={{ field: 'ordem', order: 'ASC' }} aside={
    <AdminHelpAside
      title="Onde estes Fabricantes são exibidos?"
      description={<>Parceiros tecnológicos globais (ex: <em>IBM, Red Hat, Veeam</em>).<br /><br />Exibidos na barra de logos de parceiros na <strong>Home</strong> e vinculados aos produtos cadastrados.</>}
    />
  }>
    <Datagrid rowClick="edit">
      <TextField source="nome" label="Nome" />
      <TextField source="slug" label="Slug" />
      <TextField source="siteOficial" label="Site Oficial" />
      <BooleanField source="destaque" label="Destaque" />
      <BooleanField source="ativo" label="Ativo" />
    </Datagrid>
  </List>
);

export const FabricanteEdit = () => (
  <Edit title="Editar Fabricante">
    <SimpleForm>
      <TextInput source="nome" validate={required()} label="Nome" />
      <TextInput source="slug" validate={required()} label="Slug (Ex: ibm)" />
      <TextInput source="siteOficial" label="Site Oficial" fullWidth />
      <TextInput source="descricao" label="Descrição Completa" multiline fullWidth />
      <TextInput source="descricaoCurta" label="Descrição Curta" multiline fullWidth />
      <NumberInput source="ordem" label="Ordem de Exibição" />
      <BooleanInput source="destaque" label="Parceiro Destaque?" />
      <BooleanInput source="ativo" label="Ativo" />
      
      <ImageInput source="logoUrl" label="Logo do Fabricante (SVG, PNG)" accept={{ 'image/svg+xml': ['.svg'], 'image/png': ['.png'] }}>
        <ImageField source="src" title="title" />
      </ImageInput>
    </SimpleForm>
  </Edit>
);

export const FabricanteCreate = () => (
  <Create title="Cadastrar Fabricante">
    <SimpleForm>
      <TextInput source="nome" validate={required()} label="Nome" />
      <TextInput source="slug" validate={required()} label="Slug" />
      <TextInput source="siteOficial" label="Site Oficial" fullWidth />
      <TextInput source="descricao" label="Descrição Completa" multiline fullWidth />
      <TextInput source="descricaoCurta" label="Descrição Curta" multiline fullWidth />
      <NumberInput source="ordem" defaultValue={1} label="Ordem de Exibição" />
      <BooleanInput source="destaque" defaultValue={false} label="Parceiro Destaque?" />
      <BooleanInput source="ativo" defaultValue={true} label="Ativo" />
      
      <ImageInput source="logoUrl" label="Logo do Fabricante (SVG, PNG)" accept={{ 'image/svg+xml': ['.svg'], 'image/png': ['.png'] }}>
        <ImageField source="src" title="title" />
      </ImageInput>
    </SimpleForm>
  </Create>
);

// ─── SERVIÇOS ────────────────────────────────────────────────────────────────
export const ServicoList = () => (
  <List sort={{ field: 'ordem', order: 'ASC' }} aside={
    <AdminHelpAside
      title="Onde estes Serviços são exibidos?"
      description={<>Serviços Profissionais e Especializados (ex: <em>Implementação, Sustentação 24/7, Conformidade</em>).<br /><br />Eles são associados a cada <strong>Produto</strong> e exibidos na página detalhada do produto (<code>/produtos/[slug]</code>).</>}
    />
  }>
    <Datagrid rowClick="edit">
      <TextField source="nome" label="Nome" />
      <TextField source="slug" label="Slug" />
      <TextField source="icone" label="Ícone" />
      <NumberField source="ordem" label="Ordem" />
      <BooleanField source="ativo" label="Ativo" />
    </Datagrid>
  </List>
);

export const ServicoEdit = () => (
  <Edit title="Editar Serviço Profissional">
    <SimpleForm>
      <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: 0, marginBottom: '1rem', lineHeight: 1.4 }}>
        ℹ️ Os serviços profissionais cadastrados aqui (ex: <em>Implementação, Sustentação 24/7, DRaaS</em>) são vinculados aos <strong>Produtos</strong> e exibidos na página detalhada de cada produto no site.
      </p>
      <TextInput source="nome" validate={required()} label="Nome do Serviço" />
      <TextInput source="slug" validate={required()} label="Slug (Ex: sustentacao)" />
      <TextInput source="icone" label="Ícone Lucide (Ex: wrench, headphones)" />
      <TextInput source="descricao" label="Descrição" multiline fullWidth />
      <NumberInput source="ordem" label="Ordem" />
      <BooleanInput source="ativo" label="Ativo" />
    </SimpleForm>
  </Edit>
);

export const ServicoCreate = () => (
  <Create title="Cadastrar Serviço Profissional">
    <SimpleForm>
      <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: 0, marginBottom: '1rem', lineHeight: 1.4 }}>
        ℹ️ Os serviços profissionais cadastrados aqui (ex: <em>Implementação, Sustentação 24/7, DRaaS</em>) são vinculados aos <strong>Produtos</strong> e exibidos na página detalhada de cada produto no site.
      </p>
      <TextInput source="nome" validate={required()} label="Nome do Serviço" />
      <TextInput source="slug" validate={required()} label="Slug" />
      <TextInput source="icone" label="Ícone Lucide" />
      <TextInput source="descricao" label="Descrição" multiline fullWidth />
      <NumberInput source="ordem" defaultValue={1} label="Ordem" />
      <BooleanInput source="ativo" defaultValue={true} label="Ativo" />
    </SimpleForm>
  </Create>
);

// ─── PRODUTOS ────────────────────────────────────────────────────────────────
export const ProdutoList = () => (
  <List sort={{ field: 'nome', order: 'ASC' }} aside={
    <AdminHelpAside
      title="Onde este catálogo é exibido?"
      description={<>Catálogo completo de Softwares e Plataformas (ex: <em>IBM Guardium, Red Hat OpenShift, Veeam</em>).<br /><br />Alimentam a listagem na página <code>/produtos</code> e geram as páginas individuais de cada produto (<code>/produtos/[slug]</code>).</>}
    />
  }>
    <Datagrid rowClick="edit">
      <TextField source="nome" label="Nome" />
      <TextField source="slug" label="Slug" />
      <TextField source="fabricanteNome" label="Fabricante" />
      <TextField source="categoriaTitle" label="Categoria" />
      <BooleanField source="destaque" label="Destaque" />
      <BooleanField source="ativo" label="Ativo" />
    </Datagrid>
  </List>
);

export const ProdutoEdit = () => (
  <Edit title="Editar Produto">
    <SimpleForm>
      <TextInput source="nome" validate={required()} label="Nome" />
      <TextInput source="slug" validate={required()} label="Slug (Ex: ibm-guardium)" />
      <TextInput source="subcategoria" label="Subcategoria (Ex: Segurança de Dados)" />
      
      <ReferenceInput source="categoriaId" reference="categorias" label="Categoria (Tag)">
        <SelectInput optionText="nome" validate={required()} />
      </ReferenceInput>

      <ReferenceInput source="solucaoId" reference="solucoes" label="Solução Relacionada">
        <SelectInput optionText="nome" />
      </ReferenceInput>

      <ReferenceInput source="fabricanteId" reference="fabricantes" label="Fabricante">
        <SelectInput optionText="nome" validate={required()} />
      </ReferenceInput>

      <TextInput source="descricaoCurta" label="Descrição Curta" multiline fullWidth />
      <TextInput source="descricaoCompleta" label="Descrição Completa (Visão Geral)" multiline fullWidth />
      
      <BooleanInput source="destaque" label="Destaque no Catálogo?" />
      <BooleanInput source="ativo" label="Ativo?" />

      <ImageInput source="imagemUrl" label="Imagem Representativa do Produto (PNG, WEBP)" accept={{ 'image/png': ['.png'], 'image/webp': ['.webp'] }}>
        <ImageField source="src" title="title" />
      </ImageInput>

      <ReferenceArrayInput source="servicoIds" reference="servicos" label="Serviços Profissionais Relacionados (Exibidos na página do produto)">
        <SelectArrayInput optionText="nome" helperText="Selecione os serviços profissionais da Infodive (ex: Sustentação 24/7, Implementação) prestados para este produto." />
      </ReferenceArrayInput>

      <ArrayInput source="diferenciais" label="Diferenciais do Produto">
        <SimpleFormIterator>
          <TextInput source="titulo" label="Título" validate={required()} />
          <TextInput source="descricao" label="Descrição" multiline validate={required()} />
        </SimpleFormIterator>
      </ArrayInput>

      <ArrayInput source="casosDeUso" label="Casos de Uso do Produto">
        <SimpleFormIterator>
          <TextInput source="titulo" label="Título" validate={required()} />
          <TextInput source="descricao" label="Descrição" multiline validate={required()} />
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Edit>
);

export const ProdutoCreate = () => (
  <Create title="Cadastrar Produto">
    <SimpleForm>
      <TextInput source="nome" validate={required()} label="Nome" />
      <TextInput source="slug" validate={required()} label="Slug" />
      <TextInput source="subcategoria" label="Subcategoria" />
      
      <ReferenceInput source="categoriaId" reference="categorias" label="Categoria (Tag)">
        <SelectInput optionText="nome" validate={required()} />
      </ReferenceInput>

      <ReferenceInput source="solucaoId" reference="solucoes" label="Solução Relacionada">
        <SelectInput optionText="nome" />
      </ReferenceInput>

      <ReferenceInput source="fabricanteId" reference="fabricantes" label="Fabricante">
        <SelectInput optionText="nome" validate={required()} />
      </ReferenceInput>

      <TextInput source="descricaoCurta" label="Descrição Curta" multiline fullWidth />
      <TextInput source="descricaoCompleta" label="Descrição Completa (Visão Geral)" multiline fullWidth />
      
      <BooleanInput source="destaque" defaultValue={false} label="Destaque no Catálogo?" />
      <BooleanInput source="ativo" defaultValue={true} label="Ativo?" />

      <ImageInput source="imagemUrl" label="Imagem Representativa do Produto (PNG, WEBP)" accept={{ 'image/png': ['.png'], 'image/webp': ['.webp'] }}>
        <ImageField source="src" title="title" />
      </ImageInput>

      <ReferenceArrayInput source="servicoIds" reference="servicos" label="Serviços Profissionais Relacionados (Exibidos na página do produto)">
        <SelectArrayInput optionText="nome" helperText="Selecione os serviços profissionais da Infodive (ex: Sustentação 24/7, Implementação) prestados para este produto." />
      </ReferenceArrayInput>

      <ArrayInput source="diferenciais" label="Diferenciais do Produto">
        <SimpleFormIterator>
          <TextInput source="titulo" label="Título" validate={required()} />
          <TextInput source="descricao" label="Descrição" multiline validate={required()} />
        </SimpleFormIterator>
      </ArrayInput>

      <ArrayInput source="casosDeUso" label="Casos de Uso do Produto">
        <SimpleFormIterator>
          <TextInput source="titulo" label="Título" validate={required()} />
          <TextInput source="descricao" label="Descrição" multiline validate={required()} />
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Create>
);
