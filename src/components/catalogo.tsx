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
  <List sort={{ field: 'ordem', order: 'ASC' }} perPage={50} aside={
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

const SolucaoFormFields = () => (
  <div style={{ width: '100%' }}>
    {/* PARTE 1 — CARD DA SOLUÇÃO */}
    <div style={{
      marginBottom: '2rem',
      padding: '1.5rem',
      backgroundColor: '#1e293b',
      borderRadius: '0.75rem',
      border: '1px solid #334155'
    }}>
      <h3 style={{ margin: '0 0 0.5rem 0', color: '#f8fafc', fontSize: '1.05rem', fontWeight: 700 }}>
        📌 PARTE 1 — CARD DA SOLUÇÃO (Exibido nas listagens de soluções)
      </h3>
      <p style={{ margin: '0 0 1.25rem 0', color: '#94a3b8', fontSize: '0.85rem' }}>
        Defina os dados exibidos no Card da Solução na vitrine de soluções.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <TextInput source="nome" validate={required()} label="Título / Nome da Solução" fullWidth />
        <TextInput source="slug" validate={required()} label="Slug URL (Ex: infraestrutura)" fullWidth />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <TextInput source="icone" label="Ícone Lucide (Ex: server, lock, cloud, shield)" helperText="Nome do ícone Lucide React sem prefixo" fullWidth />
        <ReferenceInput source="categoriaId" reference="categorias" label="Categoria Associada (Tag)">
          <SelectInput optionText="nome" validate={required()} fullWidth />
        </ReferenceInput>
      </div>

      <TextInput source="subtituloCurto" label="Subtítulo Curto (Exibido no Card em azul)" fullWidth />
      <TextInput source="descricaoCurta" label="Descrição Curta do Card" multiline fullWidth />

      <div style={{ marginTop: '1.25rem', marginBottom: '1.25rem' }}>
        <h4 style={{ margin: '0 0 0.5rem 0', color: '#e2e8f0', fontSize: '0.95rem', fontWeight: 600 }}>
          🔹 Recursos Chave (Exibidos como bullet points no Card)
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <TextInput source="recursoChave1" label="Recurso Chave 1 (Ex: Servidores Dedicados)" fullWidth />
          <TextInput source="recursoChave2" label="Recurso Chave 2 (Ex: Arquitetura Enterprise)" fullWidth />
          <TextInput source="recursoChave3" label="Recurso Chave 3 (Ex: Suporte 24/7 Especializado)" fullWidth />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem', marginTop: '0.5rem' }}>
        <NumberInput source="ordem" defaultValue={1} label="Ordem de Exibição" />
        <BooleanInput source="ativo" defaultValue={true} label="Ativo no Site?" />
      </div>
    </div>

    {/* PARTE 2 — PÁGINA DETALHADA DA SOLUÇÃO */}
    <div style={{
      marginBottom: '1.5rem',
      padding: '1.5rem',
      backgroundColor: '#1e293b',
      borderRadius: '0.75rem',
      border: '1px solid #334155'
    }}>
      <h3 style={{ margin: '0 0 0.5rem 0', color: '#f8fafc', fontSize: '1.05rem', fontWeight: 700 }}>
        📄 PARTE 2 — PÁGINA DETALHADA DA SOLUÇÃO (/solucoes/[slug])
      </h3>
      <p style={{ margin: '0 0 1.25rem 0', color: '#94a3b8', fontSize: '0.85rem' }}>
        Conteúdo expandido exibido na página dedicada da Solução. <em>Nota: Título e Subtítulo da página são mantidos iguais aos definidos na Parte 1.</em>
      </p>

      <TextInput source="descricaoCompleta" label="Descrição Completa (Visão Geral / Overview da Solução)" multiline rows={4} fullWidth />

      <ImageInput source="imagemUrl" label="Foto / Imagem Representativa da Solução (PNG, WEBP)" accept={{ 'image/png': ['.png'], 'image/webp': ['.webp'] }}>
        <ImageField source="src" title="title" />
      </ImageInput>

      <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
        <h4 style={{ margin: '0 0 0.25rem 0', color: '#e2e8f0', fontSize: '0.95rem', fontWeight: 600 }}>
          💡 Capacidades Técnicas & Recursos
        </h4>
        <p style={{ margin: '0 0 0.75rem 0', color: '#94a3b8', fontSize: '0.8rem' }}>
          No Card da Solução, os títulos serão listados sob <strong>RECURSOS CHAVE</strong>. Na página detalhada, serão exibidos como cards em <strong>Capacidades Técnicas</strong> com a descrição completa.
        </p>

        <ArrayInput source="features" label="Recursos e Capacidades Técnicas">
          <SimpleFormIterator>
            <TextInput source="titulo" label="Título do Recurso" validate={required()} fullWidth />
            <TextInput source="descricao" label="Descrição Detalhada do Recurso" multiline fullWidth />
          </SimpleFormIterator>
        </ArrayInput>
      </div>

      <div style={{
        marginTop: '1.5rem',
        padding: '1.25rem',
        backgroundColor: '#0f172a',
        borderRadius: '0.5rem',
        border: '1px solid #334155'
      }}>
        <h4 style={{ margin: '0 0 0.5rem 0', color: '#e2e8f0', fontSize: '0.95rem', fontWeight: 600 }}>
          🤝 Bloco de Parcerias e Fabricantes Homologados
        </h4>

        <TextInput source="fabricantesTitulo" label="Título do Bloco (Ex: Parcerias e Fabricantes Homologados)" fullWidth />
        <TextInput source="fabricantesDescricao" label="Descrição do Bloco de Parceiros" multiline fullWidth />

        <ReferenceArrayInput source="fabricanteIds" reference="fabricantes" label="Fabricantes Homologados">
          <SelectArrayInput optionText="nome" helperText="Selecione quais fabricantes cadastrados no sistema são parceiros homologados nesta solução." fullWidth />
        </ReferenceArrayInput>
      </div>
    </div>
  </div>
);

export const SolucaoEdit = () => (
  <Edit title="Editar Solução">
    <SimpleForm>
      <SolucaoFormFields />
    </SimpleForm>
  </Edit>
);

export const SolucaoCreate = () => (
  <Create title="Criar Solução">
    <SimpleForm>
      <SolucaoFormFields />
    </SimpleForm>
  </Create>
);

// ─── CATEGORIAS (TAGS) ────────────────────────────────────────────────────────
export const CategoriaList = () => (
  <List sort={{ field: 'ordem', order: 'ASC' }} perPage={50} aside={
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
  <List sort={{ field: 'ordem', order: 'ASC' }} perPage={50} aside={
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

const ProdutoFormFields = () => (
  <div style={{ width: '100%' }}>
    {/* PARTE 1 — IDENTIFICAÇÃO E CLASSIFICAÇÃO */}
    <div style={{
      marginBottom: '2rem',
      padding: '1.5rem',
      backgroundColor: '#1e293b',
      borderRadius: '0.75rem',
      border: '1px solid #334155'
    }}>
      <h3 style={{ margin: '0 0 0.5rem 0', color: '#f8fafc', fontSize: '1.05rem', fontWeight: 700 }}>
        🏷️ PARTE 1 — IDENTIFICAÇÃO E CLASSIFICAÇÃO DO PRODUTO (Hero & Vitrine)
      </h3>
      <p style={{ margin: '0 0 1.25rem 0', color: '#94a3b8', fontSize: '0.85rem' }}>
        Configure o nome, fabricante, categoria e o resumo exibido no topo da página do produto e nos cards do catálogo.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <TextInput source="nome" validate={required()} label="Nome do Produto (Ex: IBM Guardium, Red Hat OpenShift)" fullWidth />
        <TextInput source="slug" validate={required()} label="Slug URL (Ex: ibm-guardium)" fullWidth />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
        <ReferenceInput source="fabricanteId" reference="fabricantes" label="Fabricante Homologado">
          <SelectInput optionText="nome" validate={required()} fullWidth helperText="Fabricante que desenvolve o produto (ex: IBM, Lenovo)" />
        </ReferenceInput>

        <ReferenceInput source="categoriaId" reference="categorias" label="Categoria Principal (Tag)">
          <SelectInput optionText="nome" validate={required()} fullWidth helperText="Tag de categoria principal (ex: Segurança)" />
        </ReferenceInput>

        <TextInput source="subcategoria" label="Subcategoria (Tag Secundária)" fullWidth helperText="Ex: Segurança de Dados, Armazenamento Flash" />
      </div>

      <ReferenceInput source="solucaoId" reference="solucoes" label="Solução Relacionada (Opcional)">
        <SelectInput optionText="nome" fullWidth helperText="Vincula este produto a uma Solução Corporativa da Infodive" />
      </ReferenceInput>

      <TextInput source="linkOficial" label="Link Oficial do Produto (Ex: https://www.ibm.com/guardium)" fullWidth helperText="Link de destino do botão 'Ver produto' exibido no card da página do produto." />

      <TextInput source="descricaoCurta" label="Descrição Curta / Resumo do Hero" multiline rows={2} fullWidth helperText="Exibida em destaque no topo da página do produto e nos cards de produtos relacionados." />

      <div style={{ display: 'flex', gap: '2rem', marginTop: '0.5rem' }}>
        <BooleanInput source="destaque" defaultValue={false} label="Destaque no Catálogo?" />
        <BooleanInput source="ativo" defaultValue={true} label="Ativo no Site?" />
      </div>
    </div>

    {/* PARTE 2 — CONTEÚDO EXPANDIDO E ABAS DA PÁGINA */}
    <div style={{
      marginBottom: '2rem',
      padding: '1.5rem',
      backgroundColor: '#1e293b',
      borderRadius: '0.75rem',
      border: '1px solid #334155'
    }}>
      <h3 style={{ margin: '0 0 0.5rem 0', color: '#f8fafc', fontSize: '1.05rem', fontWeight: 700 }}>
        📄 PARTE 2 — CONTEÚDO DA PÁGINA DETALHADA (/produtos/[slug])
      </h3>
      <p style={{ margin: '0 0 1.25rem 0', color: '#94a3b8', fontSize: '0.85rem' }}>
        Conteúdo completo exibido nas abas <strong>Visão geral</strong>, <strong>Diferenciais</strong> e <strong>Casos de uso</strong> da página do produto.
      </p>

      <TextInput source="descricaoCompleta" label="Aba 1: Visão Geral / Descrição Completa" multiline rows={4} fullWidth helperText="Texto detalhado da 1ª aba da página do produto." />

      <ImageInput source="imagemUrl" label="Foto / Imagem Representativa do Produto (PNG, WEBP)" accept={{ 'image/png': ['.png'], 'image/webp': ['.webp'] }}>
        <ImageField source="src" title="title" />
      </ImageInput>

      <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
        <h4 style={{ margin: '0 0 0.25rem 0', color: '#e2e8f0', fontSize: '0.95rem', fontWeight: 600 }}>
          ✨ Aba 2: Diferenciais do Produto
        </h4>
        <p style={{ margin: '0 0 0.75rem 0', color: '#94a3b8', fontSize: '0.8rem' }}>
          Adicione os pontos fortes e recursos exclusivos deste produto.
        </p>

        <ArrayInput source="diferenciais" label="Lista de Diferenciais">
          <SimpleFormIterator>
            <TextInput source="titulo" label="Título do Diferencial" validate={required()} fullWidth />
            <TextInput source="descricao" label="Descrição do Diferencial" multiline fullWidth />
          </SimpleFormIterator>
        </ArrayInput>
      </div>

      <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
        <h4 style={{ margin: '0 0 0.25rem 0', color: '#e2e8f0', fontSize: '0.95rem', fontWeight: 600 }}>
          🎯 Aba 3: Casos de Uso do Produto
        </h4>
        <p style={{ margin: '0 0 0.75rem 0', color: '#94a3b8', fontSize: '0.8rem' }}>
          Adicione cenários reais de aplicação deste produto em empresas B2B.
        </p>

        <ArrayInput source="casosDeUso" label="Lista de Casos de Uso">
          <SimpleFormIterator>
            <TextInput source="titulo" label="Título do Caso de Uso" validate={required()} fullWidth />
            <TextInput source="descricao" label="Descrição do Caso de Uso" multiline fullWidth />
          </SimpleFormIterator>
        </ArrayInput>
      </div>

      <div style={{
        marginTop: '1.5rem',
        padding: '1.25rem',
        backgroundColor: '#0f172a',
        borderRadius: '0.5rem',
        border: '1px solid #334155'
      }}>
        <h4 style={{ margin: '0 0 0.5rem 0', color: '#e2e8f0', fontSize: '0.95rem', fontWeight: 600 }}>
          ⚙️ Serviços Profissionais Vinculados
        </h4>
        <ReferenceArrayInput source="servicoIds" reference="servicos" label="Serviços Profissionais Prestados para este Produto">
          <SelectArrayInput optionText="nome" helperText="Selecione quais serviços profissionais da Infodive (ex: Sustentação 24/7, Implementação, DRaaS) estão vinculados a este produto." fullWidth />
        </ReferenceArrayInput>
      </div>
    </div>
  </div>
);

export const ProdutoEdit = () => (
  <Edit title="Editar Produto">
    <SimpleForm>
      <ProdutoFormFields />
    </SimpleForm>
  </Edit>
);

export const ProdutoCreate = () => (
  <Create title="Cadastrar Produto">
    <SimpleForm>
      <ProdutoFormFields />
    </SimpleForm>
  </Create>
);
