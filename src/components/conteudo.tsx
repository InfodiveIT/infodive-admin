import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  BooleanField,
  NumberField,
  DateField,
  Edit,
  Create,
  SimpleForm,
  TextInput,
  BooleanInput,
  NumberInput,
  SelectInput,
  DateInput,
  ReferenceInput,
  ImageInput,
  ImageField,
  required,
  useInput,
} from 'react-admin';
import { AdminHelpAside } from './AdminHelpBanner';

// ─── CONTEÚDOS (ARTIGOS / BLOG) ──────────────────────────────────────────────
export const ConteudoList = () => (
  <List sort={{ field: 'createdAt', order: 'DESC' }} aside={
    <AdminHelpAside
      title="Onde estes Artigos são exibidos?"
      description={<>Artigos técnicos, whitepapers e postagens do <strong>Blog (<code>/blog</code>)</strong>.<br /><br />Geram as páginas individuais de cada post (<code>/blog/[slug]</code>).</>}
    />
  }>
    <Datagrid rowClick="edit">
      <TextField source="titulo" label="Título" />
      <TextField source="tipo" label="Tipo" />
      <DateField source="publicadoEm" label="Publicado Em" />
      <BooleanField source="destaque" label="Destaque Home" />
      <BooleanField source="ativo" label="Ativo" />
    </Datagrid>
  </List>
);

import { useWatch } from 'react-hook-form';

function getYouTubeEmbedUrl(url?: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return `https://www.youtube-nocookie.com/embed/${match[2]}`;
  }
  if (url.includes('youtube.com/embed/')) return url;
  return null;
}

type ArtigoBlocoSimples =
  | { tipo: 'paragrafo'; texto: string }
  | { tipo: 'subtitulo'; texto: string; nivel: number }
  | { tipo: 'lista'; itens: string[]; ordenada: boolean }
  | { tipo: 'citacao'; texto: string }
  | { tipo: 'divisor' }
  | { tipo: 'tabela'; headers: string[]; rows: string[][] };

function parseInlineAdmin(text: string): React.ReactNode[] {
  if (!text) return [];
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  const parts = text.split(regex);
  return parts.map((part, index) => {
    if (!part) return null;
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return <strong key={index} style={{ fontWeight: 700, color: '#0F172A' }}>{parseInlineAdmin(part.slice(2, -2))}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
      return <em key={index}>{parseInlineAdmin(part.slice(1, -1))}</em>;
    }
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return <code key={index} style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: 4, fontFamily: 'monospace', color: '#0E66FF', fontSize: '0.85em' }}>{part.slice(1, -1)}</code>;
    }
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return <a key={index} href={linkMatch[2]} target="_blank" rel="noopener noreferrer" style={{ color: '#0E66FF', textDecoration: 'underline' }}>{linkMatch[1]}</a>;
    }
    return part;
  });
}

function parseMarkdownPreview(text?: string): ArtigoBlocoSimples[] {
  if (!text || !text.trim()) return [];

  const rawBlocks = text.split(/\n\s*\n/);
  const blocos: ArtigoBlocoSimples[] = [];

  for (const rawBlock of rawBlocks) {
    const trimmed = rawBlock.trim();
    if (!trimmed) continue;

    // Divisor ---
    if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
      blocos.push({ tipo: 'divisor' });
      continue;
    }

    // Título # / ## / ###
    if (trimmed.startsWith('#')) {
      const match = trimmed.match(/^(#+)\s*(.*)/);
      if (match) {
        const nivel = Math.min(match[1].length, 4);
        blocos.push({ tipo: 'subtitulo', texto: match[2].trim(), nivel });
        continue;
      }
    }

    // Citação >
    if (trimmed.startsWith('>')) {
      blocos.push({
        tipo: 'citacao',
        texto: trimmed.replace(/^>\s*/gm, '').trim(),
      });
      continue;
    }

    // Tabela |
    if (trimmed.includes('|') && trimmed.split('\n').some(l => l.includes('|'))) {
      const lines = trimmed.split('\n').map(l => l.trim()).filter(Boolean);
      const tableLines = lines.filter(l => !/^\|?\s*:?-+:?\s*(?:\|\s*:?-+:?\s*)*\|?$/.test(l));
      if (tableLines.length > 0) {
        const rows = tableLines.map(line => line.replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => c.trim()));
        blocos.push({
          tipo: 'tabela',
          headers: rows[0],
          rows: rows.slice(1),
        });
        continue;
      }
    }

    // Listas
    const lines = trimmed.split('\n');
    const isUnordered = lines.every(l => l.trim().startsWith('- ') || l.trim().startsWith('* '));
    if (isUnordered) {
      blocos.push({
        tipo: 'lista',
        ordenada: false,
        itens: lines.map(l => l.trim().replace(/^[-*]\s+/, '')),
      });
      continue;
    }

    const isOrdered = lines.every(l => /^\d+\.\s+/.test(l.trim()));
    if (isOrdered) {
      blocos.push({
        tipo: 'lista',
        ordenada: true,
        itens: lines.map(l => l.trim().replace(/^\d+\.\s+/, '')),
      });
      continue;
    }

    // Parágrafo
    blocos.push({
      tipo: 'paragrafo',
      texto: trimmed,
    });
  }

  return blocos;
}

export const MarkdownContentInput: React.FC<{ source: string; label?: string }> = ({ source, label = 'Corpo do Conteúdo (Markdown)' }) => {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useInput({ source });

  const [activeTab, setActiveTab] = React.useState<'edit' | 'preview'>('edit');
  const textValue = typeof value === 'string' ? value : (value ? JSON.stringify(value) : '');

  const insertSnippet = (snippet: string) => {
    const newVal = textValue ? `${textValue}\n\n${snippet}` : snippet;
    onChange(newVal);
  };

  const parsedBlocos = parseMarkdownPreview(textValue);

  return (
    <div style={{ width: '100%', marginBottom: 24, fontFamily: 'sans-serif' }}>
      <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: 8, color: '#e0e0e0' }}>
        {label}
      </label>

      {/* Bar de Ferramentas & Abas */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '10px 14px', background: '#1e1e2d', border: '1px solid #323248', borderRadius: '8px 8px 0 0' }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: '#888', marginRight: 4 }}>Inserir:</span>
          <button
            type="button"
            onClick={() => insertSnippet('## Visibilidade antes de controle')}
            style={{ padding: '4px 10px', fontSize: '0.78rem', background: '#2b2b40', color: '#7aa9ff', border: '1px solid #3f3f5c', borderRadius: 4, cursor: 'pointer' }}
          >
            + Subtítulo (##)
          </button>
          <button
            type="button"
            onClick={() => insertSnippet('- Item de auditoria 1\n- Item de auditoria 2\n- Item de auditoria 3')}
            style={{ padding: '4px 10px', fontSize: '0.78rem', background: '#2b2b40', color: '#7aa9ff', border: '1px solid #3f3f5c', borderRadius: 4, cursor: 'pointer' }}
          >
            + Lista (-)
          </button>
          <button
            type="button"
            onClick={() => insertSnippet('> Conformidade não é um projeto com data de término — é um processo contínuo.')}
            style={{ padding: '4px 10px', fontSize: '0.78rem', background: '#2b2b40', color: '#7aa9ff', border: '1px solid #3f3f5c', borderRadius: 4, cursor: 'pointer' }}
          >
            + Citação (&gt;)
          </button>
        </div>

        <div style={{ display: 'flex', background: '#151521', borderRadius: 6, padding: 3, marginLeft: 'auto' }}>
          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            style={{
              padding: '5px 14px',
              fontSize: '0.78rem',
              fontWeight: 600,
              border: 0,
              borderRadius: 4,
              cursor: 'pointer',
              background: activeTab === 'edit' ? '#0E66FF' : 'transparent',
              color: activeTab === 'edit' ? '#fff' : '#888',
            }}
          >
            ✏️ Escrever (Markdown)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            style={{
              padding: '5px 14px',
              fontSize: '0.78rem',
              fontWeight: 600,
              border: 0,
              borderRadius: 4,
              cursor: 'pointer',
              background: activeTab === 'preview' ? '#0E66FF' : 'transparent',
              color: activeTab === 'preview' ? '#fff' : '#888',
            }}
          >
            👁️ Pré-visualizar Artigo
          </button>
        </div>
      </div>

      {/* Editor / Preview Area */}
      {activeTab === 'edit' ? (
        <textarea
          value={textValue}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Escreva o artigo em Markdown simples...\n\nProteger dados sensíveis deixou de ser uma preocupação restrita ao time de segurança.\n\n## Visibilidade antes de controle\nNão se protege o que não se enxerga...\n\n- Auditoria independente do DBA\n- Alertas em tempo real\n\n> Conformidade é um processo contínuo.`}
          style={{
            width: '100%',
            minHeight: '420px',
            padding: '16px',
            fontSize: '0.95rem',
            lineHeight: '1.6',
            fontFamily: 'Consolas, Monaco, "Fira Code", monospace',
            background: '#151521',
            color: '#f0f0f5',
            border: '1px solid #323248',
            borderTop: 0,
            borderRadius: '0 0 8px 8px',
            resize: 'vertical',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      ) : (
        <div style={{
          width: '100%',
          minHeight: '420px',
          padding: '24px',
          background: '#ffffff',
          color: '#0F172A',
          border: '1px solid #e0e0e0',
          borderTop: 0,
          borderRadius: '0 0 8px 8px',
          boxSizing: 'border-box',
          overflowY: 'auto',
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0E66FF', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 20 }}>
            PRÉ-VISUALIZAÇÃO EM TEMPO REAL NO BLOG
          </div>
          {parsedBlocos.length === 0 ? (
            <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>Nenhum texto informado. Alterne para "Escrever (Markdown)" para digitar.</p>
          ) : (
            parsedBlocos.map((bloco, idx) => {
              if (bloco.tipo === 'subtitulo') {
                return (
                  <h2 key={idx} style={{ marginTop: 28, marginBottom: 12, fontSize: bloco.nivel === 1 ? '1.8rem' : bloco.nivel === 2 ? '1.4rem' : '1.2rem', fontWeight: 700, color: '#0F172A', borderBottom: bloco.nivel === 2 ? '1px solid #e2e8f0' : 'none', paddingBottom: 6 }}>
                    {parseInlineAdmin(bloco.texto)}
                  </h2>
                );
              }
              if (bloco.tipo === 'divisor') {
                return <hr key={idx} style={{ margin: '32px 0', border: 0, borderTop: '1px solid #cbd5e1' }} />;
              }
              if (bloco.tipo === 'citacao') {
                return (
                  <blockquote key={idx} style={{ borderLeft: '4px solid #0E66FF', background: '#f8fafc', padding: '16px 20px', borderRadius: '0 8px 8px 0', margin: '24px 0', fontSize: '1.05rem', fontWeight: 500, fontStyle: 'italic', color: '#1E293B' }}>
                    {parseInlineAdmin(bloco.texto)}
                  </blockquote>
                );
              }
              if (bloco.tipo === 'tabela') {
                return (
                  <div key={idx} style={{ margin: '24px 0', overflowX: 'auto', borderRadius: 8, border: '1px solid #cbd5e1' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                      <thead style={{ background: '#f1f5f9' }}>
                        <tr>
                          {bloco.headers.map((h, i) => (
                            <th key={i} style={{ padding: '10px 14px', fontWeight: 700, borderBottom: '1px solid #cbd5e1', borderRight: '1px solid #cbd5e1', color: '#0F172A' }}>
                              {parseInlineAdmin(h)}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {bloco.rows.map((row, rIdx) => (
                          <tr key={rIdx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} style={{ padding: '10px 14px', borderRight: '1px solid #e2e8f0', color: '#334155' }}>
                                {parseInlineAdmin(cell)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              }
              if (bloco.tipo === 'lista') {
                const ListTag = bloco.ordenada ? 'ol' : 'ul';
                return (
                  <ListTag key={idx} style={{ paddingLeft: 24, margin: '16px 0', lineHeight: 1.7, color: '#334155' }}>
                    {bloco.itens.map((item, i) => (
                      <li key={i} style={{ marginBottom: 6 }}>
                        {parseInlineAdmin(item)}
                      </li>
                    ))}
                  </ListTag>
                );
              }
              return (
                <p key={idx} style={{ marginBottom: 16, lineHeight: 1.7, color: '#334155', fontSize: '1.02rem' }}>
                  {bloco.texto.split('\n').map((line, lIdx) => (
                    <React.Fragment key={lIdx}>
                      {parseInlineAdmin(line)}
                      {lIdx < bloco.texto.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </p>
              );
            })
          )}
        </div>
      )}

      {/* Dicas de sintaxe */}
      <div style={{ marginTop: 8, fontSize: '0.8rem', color: '#94a3b8', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <span>💡 <code>## Subtítulo</code> para subtítulos</span>
        <span>💡 <code>- Item</code> para listas</span>
        <span>💡 <code>&gt; Citação</code> para frases destacadas</span>
        <span>💡 Linha em branco separa parágrafos</span>
      </div>

      {error && <span style={{ color: '#f87171', fontSize: '0.8rem', marginTop: 4, display: 'block' }}>{error.message}</span>}
    </div>
  );
};

const MediaAndLinkFields = () => {
  const tipo = useWatch({ name: 'tipo' });
  const urlExterna = useWatch({ name: 'urlExterna' });
  const embedUrl = getYouTubeEmbedUrl(urlExterna);

  if (tipo === 'VIDEO') {
    return (
      <div style={{ width: '100%', marginBottom: 16 }}>
        <TextInput
          source="urlExterna"
          label="Link do Vídeo do YouTube (Ex: https://www.youtube.com/watch?v=...)"
          helperText="Cole a URL do vídeo do YouTube para que seja reproduzido automaticamente na página."
          fullWidth
          validate={required()}
        />
        {embedUrl ? (
          <div style={{ marginTop: 12, marginBottom: 16, borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.15)', maxWidth: 640, aspectRatio: '16/9' }}>
            <iframe
              src={embedUrl}
              title="Pré-visualização do vídeo"
              style={{ width: '100%', height: '100%', border: 0 }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          urlExterna && (
            <div style={{ marginTop: 8, marginBottom: 16, color: '#ff6b6b', fontSize: '0.85rem' }}>
              URL de vídeo do YouTube inválida ou não reconhecida.
            </div>
          )
        )}
      </div>
    );
  }

  return (
    <>
      <TextInput
        source="urlExterna"
        label="Link Externo / Saiba Mais (Opcional)"
        helperText="Se preenchido, exibirá um bloco 'Saiba mais sobre esse conteúdo aqui: (link)' no final do artigo."
        fullWidth
      />

      <ImageInput 
        source="imagemUrl" 
        label="Imagem do Banner do Artigo (Recomendado: 1200x675px - 16:9)" 
        helperText="Tamanho recomendado: 1200x675px (Proporção 16:9 Widescreen). Formatos aceitos: WEBP ou PNG. Máximo: 1MB."
        accept={{ 'image/png': ['.png'], 'image/webp': ['.webp'] }}
      >
        <ImageField source="src" title="title" />
      </ImageInput>
    </>
  );
};

export const ConteudoEdit = () => (
  <Edit title="Editar Conteúdo" mutationMode="pessimistic">
    <SimpleForm>
      <TextInput source="titulo" validate={required()} label="Título" fullWidth />
      <TextInput source="slug" validate={required()} label="Slug" />
      
      <SelectInput
        source="tipo"
        label="Tipo de Conteúdo"
        choices={[
          { id: 'ARTIGO', name: 'Artigo' },
          { id: 'WHITEPAPER', name: 'Whitepaper' },
          { id: 'CASE', name: 'Case de Sucesso' },
          { id: 'DATASHEET', name: 'Datasheet' },
          { id: 'VIDEO', name: 'Vídeo' },
        ]}
        validate={required()}
      />

      <TextInput source="descricao" label="Descrição / Resumo" multiline fullWidth />
      
      <TextInput source="autor" label="Autor (Ex: Equipe Infodive)" />
      <TextInput source="tempoLeitura" label="Tempo de Leitura (Ex: 5 min de leitura)" />
      
      <MarkdownContentInput source="conteudo" label="Corpo do Conteúdo (Markdown com Pré-visualização)" />

      <DateInput source="publicadoEm" label="Data de Publicação" />
      
      <ReferenceInput source="produtoId" reference="produtos" label="Produto Relacionado (Opcional)">
        <SelectInput optionText="nome" />
      </ReferenceInput>

      <BooleanInput source="destaque" label="Destaque na Página Inicial (Home)" defaultValue={false} />
      <BooleanInput source="ativo" label="Ativo" />

      <MediaAndLinkFields />
    </SimpleForm>
  </Edit>
);

export const ConteudoCreate = () => (
  <Create title="Criar Conteúdo">
    <SimpleForm>
      <TextInput source="titulo" validate={required()} label="Título" fullWidth />
      <TextInput source="slug" validate={required()} label="Slug" />
      
      <SelectInput
        source="tipo"
        label="Tipo de Conteúdo"
        choices={[
          { id: 'ARTIGO', name: 'Artigo' },
          { id: 'WHITEPAPER', name: 'Whitepaper' },
          { id: 'CASE', name: 'Case de Sucesso' },
          { id: 'DATASHEET', name: 'Datasheet' },
          { id: 'VIDEO', name: 'Vídeo' },
        ]}
        validate={required()}
        defaultValue="ARTIGO"
      />

      <TextInput source="descricao" label="Descrição / Resumo" multiline fullWidth />
      
      <TextInput source="autor" defaultValue="Equipe Infodive" label="Autor" />
      <TextInput source="tempoLeitura" label="Tempo de Leitura" />
      
      <MarkdownContentInput source="conteudo" label="Corpo do Conteúdo (Markdown com Pré-visualização)" />

      <DateInput source="publicadoEm" label="Data de Publicação" defaultValue={new Date()} />
      
      <ReferenceInput source="produtoId" reference="produtos" label="Produto Relacionado (Opcional)">
        <SelectInput optionText="nome" />
      </ReferenceInput>

      <BooleanInput source="destaque" label="Destaque na Página Inicial (Home)" defaultValue={false} />
      <BooleanInput source="ativo" defaultValue={true} label="Ativo" />

      <MediaAndLinkFields />
    </SimpleForm>
  </Create>
);

// ─── CASES DE SUCESSO ────────────────────────────────────────────────────────
export const CaseList = () => (
  <List sort={{ field: 'ordem', order: 'ASC' }} aside={
    <AdminHelpAside
      title="Onde estes Cases são exibidos?"
      description={<>Histórias reais e depoimentos de clientes satisfeitos.<br /><br />Alimentam a seção de <strong>Cases & Depoimentos na Home (<code>/</code>)</strong>.</>}
    />
  }>
    <Datagrid rowClick="edit">
      <NumberField source="ordem" label="#" />
      <TextField source="cliente" label="Cliente" />
      <TextField source="segmento" label="Segmento" />
      <TextField source="titulo" label="Título" />
      <TextField source="metrica" label="Métrica" />
      <BooleanField source="ativo" label="Ativo" />
    </Datagrid>
  </List>
);

export const CaseEdit = () => (
  <Edit title="Editar Case de Sucesso" mutationMode="pessimistic">
    <SimpleForm>
      {/* ─── Identificação ─── */}
      <TextInput source="cliente" validate={required()} label="Nome do Cliente" />
      <TextInput source="segmento" validate={required()} label="Segmento / Setor" />
      <NumberInput source="ordem" label="Ordem de exibição" />
      <BooleanInput source="ativo" label="Publicado (visível no site)" defaultValue={true} />

      {/* ─── Conteúdo principal ─── */}
      <TextInput source="titulo" validate={required()} label="Título do Projeto" fullWidth />
      <TextInput source="desafio" validate={required()} label="O Desafio" multiline fullWidth />
      <TextInput source="resultado" validate={required()} label="A Solução / Resultado" multiline fullWidth />
      <TextInput source="metrica" label="Métrica Chave (ex: 35% Economia, 99.99% Uptime)" fullWidth />

      {/* ─── Depoimento ─── */}
      <TextInput source="depoimento" label="Depoimento do Cliente" multiline fullWidth />
      <TextInput source="autor" label="Nome do Autor" />
      <TextInput source="cargo" label="Cargo do Autor" />

      {/* ─── Imagem ─── */}
      <ImageInput 
        source="imagemUrl" 
        label="Banner Vertical do Case (Recomendado: 800x1000px - 4:5 Vertical)" 
        helperText="Tamanho recomendado: 800x1000px (Proporção Vertical 4:5) ou 600x750px. Formatos aceitos: WEBP, PNG ou JPG. Máximo: 2MB."
        accept={{ 'image/png': ['.png'], 'image/webp': ['.webp'], 'image/jpeg': ['.jpg', '.jpeg'], 'image/svg+xml': ['.svg'] }}
      >
        <ImageField source="src" title="title" />
      </ImageInput>
    </SimpleForm>
  </Edit>
);

export const CaseCreate = () => (
  <Create title="Criar Case de Sucesso">
    <SimpleForm>
      {/* ─── Identificação ─── */}
      <TextInput source="cliente" validate={required()} label="Nome do Cliente" />
      <TextInput source="segmento" validate={required()} label="Segmento / Setor" />
      <NumberInput source="ordem" defaultValue={1} label="Ordem de exibição" />
      <BooleanInput source="ativo" label="Publicado (visível no site)" defaultValue={true} />

      {/* ─── Conteúdo principal ─── */}
      <TextInput source="titulo" validate={required()} label="Título do Projeto" fullWidth />
      <TextInput source="desafio" validate={required()} label="O Desafio" multiline fullWidth />
      <TextInput source="resultado" validate={required()} label="A Solução / Resultado" multiline fullWidth />
      <TextInput source="metrica" label="Métrica Chave (ex: 35% Economia, 99.99% Uptime)" fullWidth />

      {/* ─── Depoimento ─── */}
      <TextInput source="depoimento" label="Depoimento do Cliente" multiline fullWidth />
      <TextInput source="autor" label="Nome do Autor" />
      <TextInput source="cargo" label="Cargo do Autor" />

      {/* ─── Imagem ─── */}
      <ImageInput 
        source="imagemUrl" 
        label="Banner Vertical do Case (Recomendado: 800x1000px - 4:5 Vertical)" 
        helperText="Tamanho recomendado: 800x1000px (Proporção Vertical 4:5) ou 600x750px. Formatos aceitos: WEBP, PNG ou JPG. Máximo: 2MB."
        accept={{ 'image/png': ['.png'], 'image/webp': ['.webp'], 'image/jpeg': ['.jpg', '.jpeg'], 'image/svg+xml': ['.svg'] }}
      >
        <ImageField source="src" title="title" />
      </ImageInput>
    </SimpleForm>
  </Create>
);
