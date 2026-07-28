import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  BooleanField,
  DateField,
  Edit,
  SimpleForm,
  TextInput,
  BooleanInput,
  EditButton,
} from 'react-admin';
import { Typography, Box, Paper, Chip } from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';

export const PoliticaList = () => (
  <Box sx={{ p: 2 }}>
    <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)', color: '#fff', borderRadius: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <GavelIcon sx={{ fontSize: 36, color: '#818cf8' }} />
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Gerenciamento de Políticas do Site
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.5 }}>
            Edite e gerencie o conteúdo da Política de Privacidade, Termos de Uso e Política de Cookies do portal Infodive IT.
          </Typography>
        </Box>
      </Box>
    </Paper>

    <List title="Políticas" actions={false} perPage={25}>
      <Datagrid rowClick="edit" bulkActionButtons={false}>
        <TextField source="titulo" label="Título da Política" sx={{ fontWeight: 600 }} />
        <TextField source="slug" label="Identificador (Slug)" />
        <TextField source="subtitulo" label="Categoria / Subtítulo" />
        <TextField source="ultimaAtualizacao" label="Última Atualização" />
        <BooleanField source="ativo" label="Ativo" />
        <EditButton label="Editar Conteúdo" />
      </Datagrid>
    </List>
  </Box>
);

export const PoliticaEdit = () => (
  <Edit title="Editar Política do Site">
    <SimpleForm>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
        Informações da Política
      </Typography>
      <TextInput source="titulo" label="Título da Política" fullWidth required />
      <TextInput source="subtitulo" label="Subtítulo / Eyebrow" fullWidth />
      <TextInput source="slug" label="Slug / Identificador de Rota" fullWidth required helperText="Ex: politica-de-privacidade, termos-de-uso, politica-de-cookies" />
      <TextInput source="ultimaAtualizacao" label="Data de Última Atualização (Texto)" fullWidth helperText="Ex: 28 de Julho de 2026" />
      <BooleanInput source="ativo" label="Ativo no Site" defaultValue={true} />

      <Typography variant="h6" fontWeight={700} sx={{ mt: 3, mb: 1 }}>
        Conteúdo Completo da Política (Texto / Markdown)
      </Typography>
      <TextInput
        source="conteudo"
        label="Texto da Política"
        multiline
        rows={16}
        fullWidth
        required
        helperText="Suporta formatação com títulos, listas e parágrafos."
      />
    </SimpleForm>
  </Edit>
);
