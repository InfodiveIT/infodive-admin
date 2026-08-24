import React from 'react';
import {
  BooleanField,
  BooleanInput,
  Create,
  Datagrid,
  DeleteButton,
  Edit,
  EditButton,
  FunctionField,
  ImageField,
  ImageInput,
  List,
  NumberField,
  NumberInput,
  SimpleForm,
  TextField,
  TextInput,
  maxLength,
  minValue,
  required,
} from 'react-admin';
import { Box, Typography } from '@mui/material';
import { AdminHelpAside } from './AdminHelpBanner';
import { ClienteHomeAdminRecord } from '@/lib/dataProvider';

// ─── PREVIEW DA LOGO NA LISTA ─────────────────────────────────────────────
const LogoPreviewCell = () => (
  <FunctionField<ClienteHomeAdminRecord>
    label="Logo"
    render={(record) => {
      if (!record?.logoUrl) {
        return (
          <Box
            sx={{
              width: 80,
              height: 36,
              bgcolor: 'action.hover',
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px dashed',
              borderColor: 'divider',
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Sem logo
            </Typography>
          </Box>
        );
      }

      return (
        <Box
          sx={{
            width: 90,
            height: 40,
            bgcolor: '#0f172a',
            p: 0.5,
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid #334155',
          }}
        >
          <img
            src={record.logoUrl}
            alt={record.nome}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
            }}
            loading="lazy"
          />
        </Box>
      );
    }}
  />
);

// ─── CAMPOS DO FORMULÁRIO ───────────────────────────────────────────────────
const clienteHomeFormFields = (
  <>
    <TextInput
      source="nome"
      label="Nome da Marca / Cliente"
      validate={[required(), maxLength(120)]}
      fullWidth
    />
    <TextInput
      source="segmento"
      label="Setor / Segmento"
      validate={[required(), maxLength(80)]}
      fullWidth
    />
    <TextInput
      source="descricaoCurta"
      label="Descrição Curta (Hover)"
      validate={[required(), maxLength(220)]}
      multiline
      rows={3}
      fullWidth
      helperText="Máximo de 220 caracteres. Exibida no tooltip interativo ao passar o mouse sobre a logo."
    />
    <ImageInput
      source="logoUrl"
      label="Logo da Marca (PNG ou WebP transparente)"
      helperText="Formatos aceitos: PNG ou WEBP transparente (fundo transparente). O upload é realizado automaticamente para o Supabase Storage."
      accept={{ 'image/png': ['.png'], 'image/webp': ['.webp'] }}
    >
      <ImageField source="src" title="title" />
    </ImageInput>
    <NumberInput
      source="ordem"
      label="Ordem de Exibição"
      defaultValue={1}
      validate={[required(), minValue(1)]}
    />
    <BooleanInput
      source="ativo"
      label="Ativo (Exibir na Home)"
      defaultValue={true}
    />
  </>
);

// ─── LISTA DE CLIENTES DA HOME ──────────────────────────────────────────────
export const ClienteHomeList = () => (
  <List
    sort={{ field: 'ordem', order: 'ASC' }}
    title="Clientes da Home"
    aside={
      <AdminHelpAside
        title="Onde estes clientes aparecem?"
        description={
          <>
            Na seção <strong>Clientes</strong> da Home Page (<code>/</code>), na rede de conexões com feixes de luz animados e tooltips institucionais.
          </>
        }
      />
    }
  >
    <Datagrid rowClick="edit">
      <LogoPreviewCell />
      <TextField source="nome" label="Marca" />
      <TextField source="segmento" label="Setor" />
      <TextField source="descricaoCurta" label="Descrição Curta" />
      <NumberField source="ordem" label="Ordem" />
      <BooleanField source="ativo" label="Ativo" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

// ─── EDITAR CLIENTE DA HOME ─────────────────────────────────────────────────
export const ClienteHomeEdit = () => (
  <Edit title="Editar Cliente da Home" mutationMode="pessimistic">
    <SimpleForm>
      {clienteHomeFormFields}
    </SimpleForm>
  </Edit>
);

// ─── CRIAR CLIENTE DA HOME ──────────────────────────────────────────────────
export const ClienteHomeCreate = () => (
  <Create title="Adicionar Cliente à Home">
    <SimpleForm>
      {clienteHomeFormFields}
    </SimpleForm>
  </Create>
);
