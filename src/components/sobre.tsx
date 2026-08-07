import React from 'react';
import {
  Edit,
  SimpleForm,
  TextInput,
  ArrayInput,
  SimpleFormIterator,
  NumberInput,
  BooleanInput,
  ImageInput,
  ImageField,
  required,
  useSimpleFormIteratorItem,
} from 'react-admin';
import { Box, Typography, Alert, Paper, Chip } from '@mui/material';
import { AdminHelpBanner } from './AdminHelpBanner';
import { LucideIconPickerInput } from './LucideIconPicker';

// ─── SOBRE NÚMEROS ───────────────────────────────────────────────────────────
export const SobreNumerosEdit = () => (
  <Edit title="Sobre - Números e Métricas" id="singleton" mutationMode="pessimistic">
    <SimpleForm>
      <AdminHelpBanner
        title="O que esta tela altera no site?"
        description={<>Configura a seção de <strong>Números e Estatísticas de Impacto</strong> da página <strong>Quem Somos (<code>/sobre</code>)</strong>.</>}
      />
      <TextInput source="textoDescritivo" label="Texto Descritivo Principal" multiline fullWidth />
      
      <ArrayInput source="stats" label="Métricas/Estatísticas">
        <SimpleFormIterator>
          <TextInput source="prefixo" label="Prefixo (Ex: +)" />
          <NumberInput
            source="valor"
            label="Valor Numérico Final (Resultado Exibido)"
            validate={required()}
            helperText="O número final que será exibido no cartão (Ex: 2003, 500, 20)."
          />
          <NumberInput
            source="valorInicial"
            label="Início da Contagem Animada"
            defaultValue={0}
            helperText="Número onde a animação contadora inicia ao rolar a página (Ex: 0 para contar até 500, ou 1990 para contar até 2003)."
          />
          <TextInput source="sufixo" label="Sufixo (Ex: %)" />
          <TextInput source="label" label="Rótulo (Ex: Projetos executados)" validate={required()} fullWidth />
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Edit>
);

// ─── SOBRE TIMELINE ──────────────────────────────────────────────────────────
export const SobreTimelineEdit = () => (
  <Edit title="Sobre - Linha do Tempo (História)" id="singleton" mutationMode="pessimistic">
    <SimpleForm>
      <AdminHelpBanner
        title="O que esta tela altera no site?"
        description={<>Configura a <strong>Linha do Tempo (Timeline)</strong> de conquistas e evolução na página <strong>Quem Somos (<code>/sobre</code>)</strong>.</>}
      />
      <TextInput source="eyebrow" label="Eyebrow" />
      <TextInput source="headline" label="Headline Principal" fullWidth />
      
      <ArrayInput source="marcos" label="Marcos Temporais (Linha do Tempo)">
        <SimpleFormIterator>
          <TextInput source="ano" label="Ano (Ex: 2024)" validate={required()} />
          <TextInput source="titulo" label="Título do Evento" validate={required()} fullWidth />
          <TextInput source="descricao" label="Descrição do Acontecimento" multiline fullWidth />
          <BooleanInput source="destaque" label="Destaque Visual?" />
          <NumberInput source="ordem" label="Ordem de Exibição" />
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Edit>
);

// ─── SOBRE VALORES ───────────────────────────────────────────────────────────
export const SobreValoresEdit = () => (
  <Edit title="Sobre - Missão, Visão e Valores" id="singleton" mutationMode="pessimistic">
    <SimpleForm>
      <AdminHelpBanner
        title="O que esta tela altera no site?"
        description={<>Configura os cartões de <strong>Missão, Visão e Valores Corporativos</strong> na página <strong>Quem Somos (<code>/sobre</code>)</strong>.</>}
      />
      <TextInput source="eyebrow" label="Eyebrow" />
      <TextInput source="headline" label="Headline Principal" fullWidth />
      <TextInput source="paragrafo" label="Texto de Introdução" multiline fullWidth />
      
      <ArrayInput source="valores" label="Lista de Valores">
        <SimpleFormIterator>
          <LucideIconPickerInput source="icone" label="Ícone do Valor" />
          <TextInput source="titulo" label="Título" validate={required()} />
          <TextInput source="descricao" label="Descrição" multiline validate={required()} fullWidth />
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Edit>
);

// ─── SOBRE CULTURA ───────────────────────────────────────────────────────────
// ─── SOBRE CULTURA ───────────────────────────────────────────────────────────

const normalizeFotos = (data: any) => {
  if (!data) return data;
  const fotos = Array.isArray(data.fotos) ? [...data.fotos] : [];
  
  while (fotos.length < 3) {
    fotos.push({
      imagemUrl: '',
      alt: `Foto ${fotos.length + 1} da equipe Infodive`,
      ordem: fotos.length + 1,
    });
  }

  return {
    ...data,
    fotos: fotos.slice(0, 3),
  };
};

const FOTO_SPECS = [
  {
    posicao: 'Foto 1: Esquerda (Destaque Principal)',
    proporcao: '4:5 (Vertical / De pé)',
    resolucao: '1200 × 1500 px',
    minimo: '800 × 1000 px',
    dica: 'Esta foto fica em destaque à esquerda no layout e possui maior visibilidade. Enquadre a foto na vertical (de pé) com o assunto bem centralizado.',
  },
  {
    posicao: 'Foto 2: Centro (Posição Intermediária)',
    proporcao: '3:4 (Vertical / De pé)',
    resolucao: '1200 × 1600 px',
    minimo: '900 × 1200 px',
    dica: 'Esta foto fica na coluna central com pequeno deslocamento de rolagem. Use foto na vertical com fundo corporativo/equipe.',
  },
  {
    posicao: 'Foto 3: Direita (Posição Menor)',
    proporcao: '3:4 (Vertical / De pé)',
    resolucao: '1200 × 1600 px',
    minimo: '900 × 1200 px',
    dica: 'Esta foto fecha o trio à direita. Mantenha foto vertical e pessoas bem enquadradas ao centro.',
  },
];

const validateExactThreePhotos = (value: any) => {
  if (!Array.isArray(value) || value.length !== 3) {
    return 'A galeria da Cultura deve conter EXATAMENTE 3 imagens.';
  }
  return undefined;
};

const FotoItemInfo = () => {
  const item = useSimpleFormIteratorItem();
  const index = item?.index ?? 0;
  const spec = FOTO_SPECS[index] || FOTO_SPECS[0];

  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: 'background.paper', borderRadius: 2, borderColor: 'divider' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1, flexWrap: 'wrap', gap: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          📍 {spec.posicao}
        </Typography>
        <Chip label={`Proporção: ${spec.proporcao}`} color="primary" size="small" variant="outlined" />
      </Box>

      <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
        📐 <strong>Resolução Recomendada:</strong> {spec.resolucao} &nbsp;|&nbsp; <strong>Mínimo:</strong> {spec.minimo}
      </Typography>

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
        💡 <strong>Dica de Enquadramento:</strong> {spec.dica}
      </Typography>
    </Paper>
  );
};

export const SobreCulturaEdit = () => (
  <Edit 
    title="Sobre - Cultura Organizacional" 
    id="singleton" 
    mutationMode="pessimistic"
    queryOptions={{ select: normalizeFotos }}
  >
    <SimpleForm>
      <AdminHelpBanner
        title="Galeria da Cultura Organizacional (3 Fotos Verticais Fixas)"
        description={
          <>
            Configura os textos e as <strong>3 fotos verticais da cultura</strong> na página <strong>Quem Somos (<code>/sobre</code>)</strong>.<br />
            ⚠️ <strong>Importante:</strong> O layout do site exige <strong>exatamente 3 fotos na vertical (de pé)</strong>. A adição ou remoção de fotos foi travada para manter o design e o efeito parallax intactos.
          </>
        }
      />
      <TextInput source="eyebrow" label="Eyebrow (Ex: Cultura)" />
      <TextInput source="headline" label="Headline Principal" fullWidth />
      <TextInput source="paragrafo" label="Texto sobre Cultura & Time" multiline fullWidth />

      <Alert severity="info" sx={{ width: '100%', my: 2 }}>
        <strong>Regras de Imagem:</strong> As 3 fotos DEVEM ser tiradas na <strong>vertical (de pé)</strong>. Fotos horizontais (deitadas) sofrerão cortes indesejados nas laterais. Formatos aceitos: <strong>WEBP, PNG ou JPG</strong> (máximo 1MB cada).
      </Alert>
      
      <ArrayInput 
        source="fotos" 
        label="Galeria de Fotos da Cultura (3 Posições Fixas)"
        validate={validateExactThreePhotos}
      >
        <SimpleFormIterator
          disableAdd
          disableRemove
          disableReordering
          getItemLabel={(index) => `Posição ${index + 1} de 3 — ${FOTO_SPECS[index]?.posicao ?? ''}`}
        >
          <FotoItemInfo />
          <ImageInput 
            source="imagemUrl" 
            label="Upload da Imagem Vertical (De Pé)" 
            helperText="Selecione uma imagem na vertical (de pé). Formatos: WEBP, PNG ou JPG (máx. 1MB)."
            accept={{ 'image/png': ['.png'], 'image/webp': ['.webp'], 'image/jpeg': ['.jpg', '.jpeg'] }} 
            validate={required()}
          >
            <ImageField source="src" title="title" />
          </ImageInput>
          <TextInput source="alt" label="Texto Alternativo (Alt - Acessibilidade)" validate={required()} fullWidth />
          <NumberInput source="ordem" label="Ordem de Exibição (1, 2 ou 3)" validate={required()} defaultValue={1} />
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Edit>
);
