import React, { useState } from 'react';
import {
  List,
  Datagrid,
  TextField,
  DateField,
  FunctionField,
  TopToolbar,
  useRefresh,
  useNotify,
} from 'react-admin';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField as MuiTextField,
  MenuItem,
  Chip,
  Box,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import KeyIcon from '@mui/icons-material/Key';
import BlockIcon from '@mui/icons-material/Block';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { AdminHelpAside } from './AdminHelpBanner';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://infodiveit-backend-production.up.railway.app/api/v1';

const getTokenHeader = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const ListActions = ({ onOpenCreate }: { onOpenCreate: () => void }) => (
  <TopToolbar>
    <Button
      variant="contained"
      color="primary"
      startIcon={<AddIcon />}
      onClick={onOpenCreate}
      sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
    >
      Gerar Novo Token de Acesso
    </Button>
  </TopToolbar>
);

const ParceiroTokenEmpty = ({ onOpenCreate }: { onOpenCreate: () => void }) => (
  <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    py={8}
    px={2}
    textAlign="center"
  >
    <KeyIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2, opacity: 0.8 }} />
    <Typography variant="h6" fontWeight={700} gutterBottom>
      Nenhum token de agência gerado ainda
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 450, mb: 3 }}>
      Gere chaves de API com prazo de expiração para parceiros e agências de marketing criarem e gerenciarem os conteúdos do blog com segurança.
    </Typography>
    <Button
      variant="contained"
      color="primary"
      startIcon={<AddIcon />}
      onClick={onOpenCreate}
      sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 3, py: 1.2 }}
    >
      Gerar Primeiro Token de Acesso
    </Button>
  </Box>
);

export const ParceiroTokenList = () => {
  const [openCreate, setOpenCreate] = useState(false);
  const [openTokenModal, setOpenTokenModal] = useState(false);
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Form State
  const [nomeAgencia, setNomeAgencia] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('ROLE_BLOGGER');
  const [diasValidade, setDiasValidade] = useState<number | ''>(30);
  const [loading, setLoading] = useState(false);

  const refresh = useRefresh();
  const notify = useNotify();

  const handleCreateToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/tokens-agencia`, {
        method: 'POST',
        headers: getTokenHeader(),
        body: JSON.stringify({
          nomeAgencia,
          email,
          role,
          diasValidade: diasValidade === '' ? null : Number(diasValidade),
        }),
      });

      if (!res.ok) {
        throw new Error('Erro ao gerar token');
      }

      const data = await res.json();
      setGeneratedToken(data.token);
      setOpenCreate(false);
      setOpenTokenModal(true);
      setNomeAgencia('');
      setEmail('');
      setDiasValidade(30);
      refresh();
      notify('Token de parceiro gerado com sucesso!', { type: 'success' });
    } catch (err: any) {
      notify(err.message || 'Falha ao criar token', { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleRevogar = async (id: string) => {
    if (!window.confirm('Deseja realmente revogar este token? O acesso da agência será interrompido imediatamente.')) {
      return;
    }
    try {
      const res = await fetch(`${apiUrl}/tokens-agencia/${id}/revogar`, {
        method: 'PATCH',
        headers: getTokenHeader(),
      });
      if (res.ok) {
        notify('Token revogado com sucesso!', { type: 'success' });
        refresh();
      }
    } catch {
      notify('Erro ao revogar token', { type: 'error' });
    }
  };

  const handleRenovar = async (id: string) => {
    try {
      const res = await fetch(`${apiUrl}/tokens-agencia/${id}/renovar?dias=30`, {
        method: 'PATCH',
        headers: getTokenHeader(),
      });
      if (res.ok) {
        notify('Token renovado por +30 dias!', { type: 'success' });
        refresh();
      }
    } catch {
      notify('Erro ao renovar token', { type: 'error' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Deseja excluir este registro de token?')) {
      return;
    }
    try {
      const res = await fetch(`${apiUrl}/tokens-agencia/${id}`, {
        method: 'DELETE',
        headers: getTokenHeader(),
      });
      if (res.ok) {
        notify('Registro excluído!', { type: 'info' });
        refresh();
      }
    } catch {
      notify('Erro ao excluir token', { type: 'error' });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <>
      <List
        title="Gestão de Tokens & Acessos de Agência"
        actions={<ListActions onOpenCreate={() => setOpenCreate(true)} />}
        empty={<ParceiroTokenEmpty onOpenCreate={() => setOpenCreate(true)} />}
        aside={
          <AdminHelpAside
            title="Acessos de Agências e Parceiros"
            description={
              <>
                Gere chaves de API seguras com <b>data de expiração</b> para agências de marketing ou parceiros externos.
                <br /><br />
                Tokens com perfil <b>BLOGGER</b> possuem acesso exclusivo para criar e editar publicações de blog e mídias sem acessar configurações do sistema.
              </>
            }
          />
        }
      >
        <Datagrid rowClick={false}>
          <TextField source="nomeAgencia" label="Agência / Usuário" />
          <TextField source="email" label="E-mail de Contato" />
          
          <FunctionField
            label="Perfil"
            render={(record: any) => (
              <Chip
                label={record.role === 'ROLE_ADMIN' ? 'Admin Total' : 'Blogger (Conteúdo)'}
                size="small"
                color={record.role === 'ROLE_ADMIN' ? 'secondary' : 'default'}
                variant="outlined"
              />
            )}
          />

          <FunctionField
            label="Status"
            render={(record: any) => {
              if (!record.ativo) {
                return <Chip label="Revogado" size="small" color="error" variant="filled" />;
              }
              if (record.expirado) {
                return <Chip label="Expirado" size="small" color="warning" variant="filled" />;
              }
              return <Chip label="Ativo" size="small" color="success" variant="filled" />;
            }}
          />

          <DateField source="expiraEm" label="Expira em" showTime emptyText="Sem expiração" />

          <FunctionField
            label="Chave / Token"
            render={(record: any) => (
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                  {record.token ? `${record.token.slice(0, 18)}...` : '-'}
                </Typography>
                <Tooltip title="Copiar Token">
                  <IconButton size="small" onClick={() => copyToClipboard(record.token)}>
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          />

          <FunctionField
            label="Ações"
            render={(record: any) => (
              <Box display="flex" gap={1}>
                {record.ativo && (
                  <Tooltip title="Revogar Acesso">
                    <IconButton size="small" color="error" onClick={() => handleRevogar(record.id)}>
                      <BlockIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title="Renovar por +30 dias">
                  <IconButton size="small" color="primary" onClick={() => handleRenovar(record.id)}>
                    <AutorenewIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Excluir">
                  <IconButton size="small" color="default" onClick={() => handleDelete(record.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          />
        </Datagrid>
      </List>

      {/* Modal de Criação de Token */}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleCreateToken}>
          <DialogTitle display="flex" alignItems="center" gap={1}>
            <KeyIcon color="primary" />
            Gerar Novo Token de Acesso para Agência
          </DialogTitle>
          <DialogContent dividers>
            <Box display="flex" flexDirection="column" gap={2.5} pt={1}>
              <MuiTextField
                label="Nome da Agência ou Pessoa"
                placeholder="Ex: Agência Digital X / João Silva"
                fullWidth
                required
                value={nomeAgencia}
                onChange={(e) => setNomeAgencia(e.target.value)}
              />
              <MuiTextField
                label="E-mail de Contato"
                placeholder="Ex: contato@agencia.com"
                type="email"
                fullWidth
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <MuiTextField
                select
                label="Perfil de Permissão"
                fullWidth
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <MenuItem value="ROLE_BLOGGER">Blogger (Apenas Criar/Editar Posts de Blog e Mídias)</MenuItem>
                <MenuItem value="ROLE_ADMIN">Admin Total (Acesso Completo ao Painel)</MenuItem>
              </MuiTextField>
              <MuiTextField
                select
                label="Validade do Token"
                fullWidth
                value={diasValidade}
                onChange={(e) => setDiasValidade(e.target.value === '' ? '' : Number(e.target.value))}
              >
                <MenuItem value={15}>15 dias</MenuItem>
                <MenuItem value={30}>30 dias (Recomendado)</MenuItem>
                <MenuItem value={90}>90 dias (3 meses)</MenuItem>
                <MenuItem value={365}>1 ano</MenuItem>
                <MenuItem value={''}>Sem expiração (Permanente)</MenuItem>
              </MuiTextField>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpenCreate(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={loading}>
              {loading ? 'Gerando...' : 'Gerar Chave de Acesso'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Modal com Token Gerado */}
      <Dialog open={openTokenModal} onClose={() => setOpenTokenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle display="flex" alignItems="center" gap={1}>
          <CheckCircleIcon color="success" />
          Token de Acesso Gerado com Sucesso!
        </DialogTitle>
        <DialogContent dividers>
          <Box display="flex" flexDirection="column" gap={2} pt={1}>
            <Typography variant="body2" color="text.secondary">
              Copie o token abaixo e envie para a agência. Ele funcionará enviando o cabeçalho HTTP:
              <br />
              <code>Authorization: Bearer infodive_pat_...</code>
            </Typography>
            <Box
              p={2}
              bgcolor="action.hover"
              borderRadius={2}
              border="1px solid"
              borderColor="divider"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="subtitle2" sx={{ fontFamily: 'monospace', wordBreak: 'break-all', fontWeight: 700, color: 'primary.main' }}>
                {generatedToken}
              </Typography>
              {generatedToken && (
                <Button
                  size="small"
                  variant={copied ? 'contained' : 'outlined'}
                  color={copied ? 'success' : 'primary'}
                  startIcon={copied ? <CheckCircleIcon /> : <ContentCopyIcon />}
                  onClick={() => copyToClipboard(generatedToken)}
                  sx={{ ml: 2, flexShrink: 0 }}
                >
                  {copied ? 'Copiado!' : 'Copiar'}
                </Button>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button variant="contained" color="primary" onClick={() => setOpenTokenModal(false)}>
            Concluído
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
