import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  DateField,
  Edit,
  Create,
  SimpleForm,
  TextInput,
  required,
  email,
} from 'react-admin';
import { AdminHelpAside } from './AdminHelpBanner';

// ─── ADMINS ALLOWLIST ────────────────────────────────────────────────────────
export const AdminAutorizadoList = () => (
  <List title="Allowlist de Administradores" aside={
    <AdminHelpAside
      title="Permissões de Acesso"
      description={<>Lista de e-mails corporativos autorizados a realizar login e gerenciar este Painel Administrativo.</>}
    />
  }>
    <Datagrid rowClick="edit">
      <TextField source="email" label="E-mail Autorizado" />
      <DateField source="createdAt" label="Autorizado em" showTime />
      <DateField source="updatedAt" label="Última atualização" showTime />
    </Datagrid>
  </List>
);

export const AdminAutorizadoEdit = () => (
  <Edit title="Editar E-mail Autorizado">
    <SimpleForm>
      <TextInput source="email" validate={[required(), email()]} label="E-mail" fullWidth />
    </SimpleForm>
  </Edit>
);

export const AdminAutorizadoCreate = () => (
  <Create title="Autorizar Novo E-mail">
    <SimpleForm>
      <TextInput source="email" validate={[required(), email()]} label="E-mail" fullWidth />
    </SimpleForm>
  </Create>
);
