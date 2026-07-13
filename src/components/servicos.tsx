import React from 'react';
import {
  Edit,
  SimpleForm,
  TextInput,
  ArrayInput,
  SimpleFormIterator,
  NumberInput,
  required,
} from 'react-admin';
import { AdminHelpBanner } from './AdminHelpBanner';

// ─── SERVIÇOS ETAPAS ─────────────────────────────────────────────────────────
export const ServicosEtapasEdit = () => (
  <Edit title="Serviços - Etapas (Ciclo de Vida)" id="singleton">
    <SimpleForm>
      <AdminHelpBanner
        title="O que esta tela altera no site?"
        description={<>Configura o <strong>Ciclo de Vida de Serviços (Etapas de Atendimento)</strong> na página <strong>Serviços (<code>/servicos</code>)</strong>.</>}
      />
      <TextInput source="eyebrow" label="Eyebrow" />
      <TextInput source="headline" label="Headline Principal" fullWidth />
      <TextInput source="subtitulo" label="Subtítulo / Introdução" multiline fullWidth />
      
      <ArrayInput source="etapas" label="Etapas do Ciclo de Serviços">
        <SimpleFormIterator>
          <TextInput source="titulo" label="Título da Etapa" validate={required()} />
          <TextInput source="descricao" label="Descrição" multiline validate={required()} fullWidth />
          <TextInput source="icone" label="Ícone Lucide (Ex: settings, shield)" />
          <NumberInput source="ordem" label="Ordem de Exibição" />
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Edit>
);

// ─── SERVIÇOS METODOLOGIA ────────────────────────────────────────────────────
export const ServicosMetodologiaEdit = () => (
  <Edit title="Serviços - Metodologia e Pilares" id="singleton">
    <SimpleForm>
      <AdminHelpBanner
        title="O que esta tela altera no site?"
        description={<>Configura a <strong>Metodologia de Entrega, Métricas de Atendimento e Pilares Operacionais</strong> na página <strong>Serviços (<code>/servicos</code>)</strong>.</>}
      />
      <TextInput source="eyebrow" label="Eyebrow" />
      <TextInput source="headline" label="Headline Principal" fullWidth />
      <TextInput source="paragrafo" label="Parágrafo Metodológico" multiline fullWidth />
      
      <ArrayInput source="metricas" label="Métricas de Resultados">
        <SimpleFormIterator>
          <TextInput source="prefixo" label="Prefixo (Ex: <)" />
          <NumberInput source="valor" label="Valor" validate={required()} />
          <TextInput source="sufixo" label="Sufixo (Ex: min)" />
          <TextInput source="label" label="Rótulo / Label (Ex: Tempo de Resposta)" validate={required()} fullWidth />
        </SimpleFormIterator>
      </ArrayInput>

      <ArrayInput source="pilares" label="Pilares Metodológicos">
        <SimpleFormIterator>
          <TextInput source="icone" label="Ícone Lucide" />
          <TextInput source="titulo" label="Título do Pilar" validate={required()} />
          <TextInput source="descricao" label="Descrição" multiline validate={required()} fullWidth />
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Edit>
);
