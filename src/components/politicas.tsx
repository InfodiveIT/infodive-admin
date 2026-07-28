import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  BooleanField,
  Edit,
  SimpleForm,
  TextInput,
  BooleanInput,
  EditButton,
} from 'react-admin';
import { useWatch } from 'react-hook-form';
import { Typography, Box, Paper, Divider } from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';
import VisibilityIcon from '@mui/icons-material/Visibility';

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

/** Renderiza a pré-visualização formatada do markdown no formulário admin */
const MarkdownPreview = () => {
  const conteudo = useWatch({ name: 'conteudo' }) || '';

  if (!conteudo) return null;

  const blocks = conteudo.split(/\n\s*\n/);

  return (
    <Paper sx={{ p: 3, mt: 3, mb: 3, bgcolor: 'background.paper', border: '1px solid #334155', borderRadius: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, color: 'primary.main' }}>
        <VisibilityIcon />
        <Typography variant="h6" fontWeight={700}>
          Pré-visualização Formatada (Como aparecerá no site)
        </Typography>
      </Box>
      <Divider sx={{ mb: 3 }} />

      <Box sx={{ color: 'text.primary', '& p': { mb: 2, lineHeight: 1.7 }, '& h2': { mt: 3, mb: 1.5, fontWeight: 700 }, '& h3': { mt: 2.5, mb: 1, fontWeight: 600 } }}>
        {blocks.map((block: string, idx: number) => {
          const trimmed = block.trim();
          if (!trimmed) return null;

          if (trimmed.startsWith('# ')) {
            return <Typography key={idx} variant="h4" fontWeight={700} sx={{ mt: 3, mb: 1 }}>{trimmed.replace(/^#\s+/, '')}</Typography>;
          }
          if (trimmed.startsWith('## ')) {
            return <Typography key={idx} variant="h5" fontWeight={700} sx={{ mt: 3, mb: 1, color: 'primary.light' }}>{trimmed.replace(/^##\s+/, '')}</Typography>;
          }
          if (trimmed.startsWith('### ')) {
            return <Typography key={idx} variant="h6" fontWeight={600} sx={{ mt: 2.5, mb: 1 }}>{trimmed.replace(/^###\s+/, '')}</Typography>;
          }
          if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            const items = trimmed.split('\n').map(l => l.replace(/^[-*]\s+/, ''));
            return (
              <Box component="ul" key={idx} sx={{ pl: 3, mb: 2 }}>
                {items.map((item, i) => (
                  <li key={i}><Typography variant="body1">{item.replace(/\*\*(.*?)\*\*/g, '$1')}</Typography></li>
                ))}
              </Box>
            );
          }
          return (
            <Typography key={idx} variant="body1" sx={{ mb: 2, lineHeight: 1.7 }}>
              {trimmed.replace(/\*\*(.*?)\*\*/g, '$1')}
            </Typography>
          );
        })}
      </Box>
    </Paper>
  );
};

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
        rows={14}
        fullWidth
        required
        helperText="Escreva em Markdown: use ### para títulos, - para listas e **texto** para negrito."
      />

      <MarkdownPreview />
    </SimpleForm>
  </Edit>
);
