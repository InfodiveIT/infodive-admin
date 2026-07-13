import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  BooleanField,
  DateField,
  Show,
  SimpleShowLayout,
} from 'react-admin';
import { AdminHelpAside } from './AdminHelpBanner';

// ─── LEADS (SOMENTE LEITURA) ──────────────────────────────────────────────────
export const LeadList = () => (
  <List sort={{ field: 'createdAt', order: 'DESC' }} title="Contatos / Leads Recebidos" exporter={false} aside={
    <AdminHelpAside
      title="Origem dos Leads"
      description={<>Leads corporativos capturados diretamente através dos botões <strong>CTA ("Fale com um Especialista")</strong> e formulários do site.</>}
    />
  }>
    <Datagrid rowClick="show" bulkActionButtons={false}>
      <TextField source="nomeCompleto" label="Nome" />
      <TextField source="email" label="E-mail" />
      <TextField source="empresa" label="Empresa" />
      <TextField source="cargo" label="Cargo" />
      <DateField source="createdAt" label="Data de Envio" showTime />
      <BooleanField source="consentimentoLgpd" label="LGPD?" />
    </Datagrid>
  </List>
);

export const LeadShow = () => (
  <Show title="Detalhe do Lead">
    <SimpleShowLayout>
      <TextField source="nomeCompleto" label="Nome Completo" />
      <TextField source="email" label="E-mail" />
      <TextField source="telefone" label="Telefone" />
      <TextField source="empresa" label="Empresa" />
      <TextField source="cargo" label="Cargo" />
      <TextField source="mensagem" label="Mensagem Enviada" sx={{ whiteSpace: 'pre-wrap' }} />
      <BooleanField source="consentimentoLgpd" label="Consentimento LGPD" />
      <DateField source="createdAt" label="Criado Em" showTime />
    </SimpleShowLayout>
  </Show>
);
