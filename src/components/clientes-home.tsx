import React, { useCallback, useContext, useMemo, useRef, useState } from 'react';
import {
  Button as RaButton,
  Confirm,
  Create,
  CreateButton,
  Datagrid,
  Edit,
  EditButton,
  FormDataConsumer,
  ImageField,
  ImageInput,
  List,
  NumberField,
  NumberInput,
  SaveButton,
  SimpleForm,
  TextField,
  TextInput,
  Toolbar,
  TopToolbar,
  maxLength,
  minValue,
  required,
  useDataProvider,
  useListContext,
  useNotify,
  useRecordContext,
} from 'react-admin';
import {
  Alert,
  Box,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import ArchiveIcon from '@mui/icons-material/Archive';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloudOffIcon from '@mui/icons-material/CloudOff';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import PublishIcon from '@mui/icons-material/Publish';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import UnpublishedIcon from '@mui/icons-material/Unpublished';
import VerifiedIcon from '@mui/icons-material/Verified';
import {
  ClienteHomeAdminRecord,
  ClientesHomeDataProvider,
} from '@/lib/dataProvider';
import { AdminHelpAside, AdminHelpBanner } from './AdminHelpBanner';

const CLIENTES_HOME_RESOURCE = 'clientes-home';
const MIN_CLIENTES_PUBLICADOS = 6;
const MAX_CLIENTES_PUBLICADOS = 12;

const getErrorMessage = (error: unknown, fallback: string) => {
  if (!error || typeof error !== 'object') return fallback;

  const candidate = error as {
    message?: unknown;
    body?: { message?: unknown; error?: unknown };
  };
  const bodyMessage = candidate.body?.message ?? candidate.body?.error;

  if (typeof bodyMessage === 'string' && bodyMessage.trim()) return bodyMessage;
  if (typeof candidate.message === 'string' && candidate.message.trim()) return candidate.message;
  return fallback;
};

const normalizeUrl = (value: unknown) =>
  typeof value === 'string' ? value.trim() : '';

const validateHttpsUrl = (value: unknown) => {
  const normalized = normalizeUrl(value);
  if (!normalized) return undefined;

  try {
    const url = new URL(normalized);
    if (url.protocol !== 'https:') return 'Use uma URL HTTPS.';
    if (url.username || url.password) return 'A URL não pode conter credenciais.';
    return undefined;
  } catch {
    return 'Informe uma URL válida.';
  }
};

const isLogoValidated = (record?: Partial<ClienteHomeAdminRecord> | null) =>
  Boolean(
    record?.logoUrl
      && record.logoSha256
      && record.logoBytes
      && record.logoBytes > 0
      && (record.logoMimeType === 'image/png' || record.logoMimeType === 'image/webp'),
  );

const isPublishable = (record: ClienteHomeAdminRecord) =>
  record.aprovado && !record.arquivado && isLogoValidated(record);

const sortByOrder = (records: ClienteHomeAdminRecord[]) =>
  [...records].sort((left, right) => {
    const orderDifference = Number(left.ordem) - Number(right.ordem);
    if (orderDifference !== 0) return orderDifference;
    return left.slug.localeCompare(right.slug, 'pt-BR');
  });

const formatBytes = (bytes?: number | null) => {
  if (!bytes || bytes < 1) return '—';
  return `${(bytes / 1024).toFixed(1)} KB`;
};

const ValidatedLogo = ({
  record,
  width = 112,
  height = 48,
}: {
  record: Partial<ClienteHomeAdminRecord>;
  width?: number;
  height?: number;
}) => {
  const [failed, setFailed] = useState(false);
  const logoUrl = normalizeUrl(record.logoUrl);

  React.useEffect(() => setFailed(false), [logoUrl]);

  if (!logoUrl || !isLogoValidated(record) || failed) {
    return (
      <Box
        width={width}
        height={height}
        display="flex"
        alignItems="center"
        justifyContent="center"
        border="1px dashed"
        borderColor="divider"
        borderRadius={1.5}
        color="text.secondary"
        aria-label={failed ? 'Falha ao carregar a logo validada' : 'Logo ainda não validada'}
      >
        <Typography variant="caption" textAlign="center" px={1}>
          {failed ? 'Falha na imagem' : 'Sem preview'}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      component="img"
      src={logoUrl}
      alt={`Logo de ${record.nome || 'cliente'}`}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      sx={{
        display: 'block',
        width,
        height,
        objectFit: 'contain',
        borderRadius: 1.5,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: '#ffffff',
        p: 0.75,
      }}
    />
  );
};

const ClienteLogoField = ({ label: _label }: { label?: string }) => {
  const record = useRecordContext<ClienteHomeAdminRecord>();
  if (!record) return null;
  return <ValidatedLogo record={record} />;
};

const ClienteStatusField = ({ label: _label }: { label?: string }) => {
  const record = useRecordContext<ClienteHomeAdminRecord>();
  if (!record) return null;

  return (
    <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap" minWidth={210}>
      {record.arquivado ? (
        <Chip label="Arquivado" size="small" color="default" variant="outlined" />
      ) : (
        <Chip label="Disponível" size="small" color="info" variant="outlined" />
      )}
      <Chip
        label={record.aprovado ? 'Aprovado' : 'Não aprovado'}
        size="small"
        color={record.aprovado ? 'success' : 'warning'}
        variant={record.aprovado ? 'filled' : 'outlined'}
      />
      {record.ativo && (
        <Chip label="Publicado" size="small" color="primary" variant="filled" />
      )}
    </Stack>
  );
};

const ClienteLogoValidationField = ({ label: _label }: { label?: string }) => {
  const record = useRecordContext<ClienteHomeAdminRecord>();
  if (!record) return null;

  if (isLogoValidated(record)) {
    return (
      <Stack spacing={0.25} minWidth={120}>
        <Chip icon={<VerifiedIcon />} label="Validada" size="small" color="success" />
        <Typography variant="caption" color="text.secondary">
          {record.logoMimeType?.replace('image/', '').toUpperCase()} · {formatBytes(record.logoBytes)}
        </Typography>
      </Stack>
    );
  }

  return (
    <Chip
      icon={<CloudOffIcon />}
      label={record.logoUrl ? 'Aguardando validação' : 'URL não informada'}
      size="small"
      color={record.logoUrl ? 'warning' : 'default'}
      variant="outlined"
    />
  );
};

type OperationContextValue = {
  busy: boolean;
  run: (operation: () => Promise<void>) => Promise<void>;
};

const OperationContext = React.createContext<OperationContextValue>({
  busy: false,
  run: async operation => operation(),
});

const OperationProvider = ({ children }: { children: React.ReactNode }) => {
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);

  const run = useCallback(async (operation: () => Promise<void>) => {
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    try {
      await operation();
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  }, []);

  return (
    <OperationContext.Provider value={{ busy, run }}>
      {children}
    </OperationContext.Provider>
  );
};

const ClienteOrderActionsField = ({ label: _label }: { label?: string }) => {
  const record = useRecordContext<ClienteHomeAdminRecord>();
  const { data = [], refetch } = useListContext<ClienteHomeAdminRecord>();
  const dataProvider = useDataProvider<ClientesHomeDataProvider>();
  const notify = useNotify();
  const { busy, run } = useContext(OperationContext);

  const orderedRecords = useMemo(() => sortByOrder(data), [data]);
  if (!record) return null;

  const currentIndex = orderedRecords.findIndex(item => item.id === record.id);

  const move = (direction: -1 | 1) => {
    const destinationIndex = currentIndex + direction;
    if (currentIndex < 0 || destinationIndex < 0 || destinationIndex >= orderedRecords.length) return;

    void run(async () => {
      const reordered = [...orderedRecords];
      [reordered[currentIndex], reordered[destinationIndex]] = [
        reordered[destinationIndex],
        reordered[currentIndex],
      ];

      try {
        await dataProvider.reordenarClientesHome(reordered.map(item => item.id));
        await refetch();
        notify('Ordem salva para todos os clientes.', { type: 'success' });
      } catch (error) {
        notify(getErrorMessage(error, 'Não foi possível reordenar os clientes.'), { type: 'error' });
      }
    });
  };

  return (
    <Stack direction="row" spacing={0.25}>
      <Tooltip title="Mover uma posição para cima">
        <span>
          <IconButton
            size="small"
            disabled={busy || currentIndex <= 0}
            onClick={event => {
              event.stopPropagation();
              move(-1);
            }}
            aria-label={`Mover ${record.nome} para cima`}
          >
            <ArrowUpwardIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Mover uma posição para baixo">
        <span>
          <IconButton
            size="small"
            disabled={busy || currentIndex < 0 || currentIndex >= orderedRecords.length - 1}
            onClick={event => {
              event.stopPropagation();
              move(1);
            }}
            aria-label={`Mover ${record.nome} para baixo`}
          >
            <ArrowDownwardIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
    </Stack>
  );
};

type ConfirmableClienteAction = 'aprovar' | 'revogar' | 'arquivar' | 'desarquivar';

const ClienteRowActionsField = ({ label: _label }: { label?: string }) => {
  const record = useRecordContext<ClienteHomeAdminRecord>();
  const { refetch } = useListContext<ClienteHomeAdminRecord>();
  const dataProvider = useDataProvider<ClientesHomeDataProvider>();
  const notify = useNotify();
  const { busy, run } = useContext(OperationContext);
  const [pendingAction, setPendingAction] = useState<ConfirmableClienteAction | null>(null);

  if (!record) return null;

  const handleValidate = () => {
    void run(async () => {
      try {
        await dataProvider.validarLogoClienteHome(record.id);
        await refetch();
        notify(`Logo de ${record.nome} validada com sucesso.`, { type: 'success' });
      } catch (error) {
        notify(getErrorMessage(error, 'A logo não passou pela validação de segurança.'), { type: 'error' });
      }
    });
  };

  const handleConfirmedAction = () => {
    if (!pendingAction) return;
    const action = pendingAction;

    void run(async () => {
      try {
        if (action === 'aprovar' || action === 'revogar') {
          const aprovado = action === 'aprovar';
          await dataProvider.definirAprovacaoClienteHome(record.id, aprovado);
          notify(aprovado ? 'Cliente aprovado.' : 'Aprovação revogada.', { type: 'success' });
        } else {
          const arquivado = action === 'arquivar';
          await dataProvider.definirArquivamentoClienteHome(record.id, arquivado);
          notify(arquivado ? 'Cliente arquivado e despublicado.' : 'Cliente desarquivado como inativo.', {
            type: 'success',
          });
        }
        setPendingAction(null);
        await refetch();
      } catch (error) {
        notify(getErrorMessage(error, 'Não foi possível alterar o cliente.'), { type: 'error' });
      }
    });
  };

  const approvalDisabled = busy || record.arquivado || (!record.aprovado && !isLogoValidated(record));
  const confirmationContent: Record<ConfirmableClienteAction, string> = {
    aprovar: `Aprovar ${record.nome} para que possa entrar em uma publicação?`,
    revogar: `Revogar a aprovação de ${record.nome}? O cliente deixará de aparecer no endpoint público.`,
    arquivar: `Arquivar ${record.nome}? O registro ficará inativo e será removido da publicação atual.`,
    desarquivar: `Desarquivar ${record.nome}? O registro voltará como inativo e continuará exigindo publicação explícita.`,
  };

  return (
    <>
      <Stack direction="row" spacing={0.25}>
        <Tooltip title={record.logoUrl ? 'Validar URL e conteúdo da logo' : 'Informe e salve uma URL antes'}>
          <span>
            <IconButton
              size="small"
              color="info"
              disabled={busy || !record.logoUrl || record.arquivado}
              onClick={event => {
                event.stopPropagation();
                handleValidate();
              }}
              aria-label={`Validar logo de ${record.nome}`}
            >
              <FactCheckIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip
          title={
            approvalDisabled && !record.aprovado && !isLogoValidated(record)
              ? 'Valide a logo antes de aprovar'
              : record.aprovado
                ? 'Revogar aprovação'
                : 'Aprovar cliente'
          }
        >
          <span>
            <IconButton
              size="small"
              color={record.aprovado ? 'warning' : 'success'}
              disabled={approvalDisabled}
              onClick={event => {
                event.stopPropagation();
                setPendingAction(record.aprovado ? 'revogar' : 'aprovar');
              }}
              aria-label={`${record.aprovado ? 'Revogar aprovação de' : 'Aprovar'} ${record.nome}`}
            >
              {record.aprovado ? <UnpublishedIcon fontSize="small" /> : <CheckCircleIcon fontSize="small" />}
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title={record.arquivado ? 'Desarquivar cliente' : 'Arquivar cliente'}>
          <span>
            <IconButton
              size="small"
              color={record.arquivado ? 'primary' : 'default'}
              disabled={busy}
              onClick={event => {
                event.stopPropagation();
                setPendingAction(record.arquivado ? 'desarquivar' : 'arquivar');
              }}
              aria-label={`${record.arquivado ? 'Desarquivar' : 'Arquivar'} ${record.nome}`}
            >
              {record.arquivado ? <UnarchiveIcon fontSize="small" /> : <ArchiveIcon fontSize="small" />}
            </IconButton>
          </span>
        </Tooltip>
        <EditButton label="Editar" />
      </Stack>

      <Confirm
        isOpen={pendingAction !== null}
        loading={busy}
        title="Confirmar alteração"
        content={pendingAction ? confirmationContent[pendingAction] : ''}
        confirm="Confirmar"
        cancel="Cancelar"
        confirmColor={pendingAction === 'arquivar' || pendingAction === 'revogar' ? 'warning' : 'primary'}
        onConfirm={handleConfirmedAction}
        onClose={() => {
          if (!busy) setPendingAction(null);
        }}
      />
    </>
  );
};

const ClientesPublicationBulkActions = () => {
  const { selectedIds, onUnselectItems, refetch } = useListContext<ClienteHomeAdminRecord>();
  const dataProvider = useDataProvider<ClientesHomeDataProvider>();
  const notify = useNotify();
  const { busy, run } = useContext(OperationContext);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const selectionCount = selectedIds.length;
  const validSelection = selectionCount >= MIN_CLIENTES_PUBLICADOS
    && selectionCount <= MAX_CLIENTES_PUBLICADOS;

  const handlePublish = () => {
    void run(async () => {
      try {
        await dataProvider.publicarClientesHome(selectedIds);
        onUnselectItems();
        setConfirmOpen(false);
        await refetch();
        notify(`${selectionCount} clientes publicados em uma única operação.`, { type: 'success' });
      } catch (error) {
        notify(getErrorMessage(error, 'Não foi possível publicar a seleção.'), { type: 'error' });
      }
    });
  };

  return (
    <>
      <Tooltip
        title={
          validSelection
            ? 'Substituir o conjunto publicado por esta seleção'
            : `Selecione de ${MIN_CLIENTES_PUBLICADOS} a ${MAX_CLIENTES_PUBLICADOS} clientes aprovados`
        }
      >
        <span>
          <RaButton
            label={`Publicar seleção (${selectionCount})`}
            disabled={busy || !validSelection}
            onClick={() => setConfirmOpen(true)}
          >
            <PublishIcon />
          </RaButton>
        </span>
      </Tooltip>
      <Confirm
        isOpen={confirmOpen}
        loading={busy}
        title="Publicar clientes selecionados"
        content={`Esta operação substituirá atomicamente o conjunto atual pelos ${selectionCount} clientes selecionados.`}
        confirm="Publicar seleção"
        cancel="Cancelar"
        onConfirm={handlePublish}
        onClose={() => {
          if (!busy) setConfirmOpen(false);
        }}
      />
    </>
  );
};

const ClientesHomeGrid = () => (
  <OperationProvider>
    <Datagrid
      rowClick={false}
      bulkActionButtons={<ClientesPublicationBulkActions />}
      isRowSelectable={record => isPublishable(record as ClienteHomeAdminRecord)}
      rowSx={record => ({ opacity: record.arquivado ? 0.58 : 1 })}
    >
      <ClienteLogoField label="Logo" />
      <NumberField source="ordem" label="#" />
      <TextField source="nome" label="Cliente" />
      <TextField source="segmento" label="Setor" />
      <ClienteLogoValidationField label="Logo" />
      <ClienteStatusField label="Estado" />
      <ClienteOrderActionsField label="Ordem" />
      <ClienteRowActionsField label="Ações" />
    </Datagrid>
  </OperationProvider>
);

const ClientesHomeListActions = () => {
  const { data = [], refetch } = useListContext<ClienteHomeAdminRecord>();
  const dataProvider = useDataProvider<ClientesHomeDataProvider>();
  const notify = useNotify();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const activeCount = data.filter(record => record.ativo).length;

  const handleUnpublish = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await dataProvider.publicarClientesHome([]);
      setConfirmOpen(false);
      await refetch();
      notify('Todos os clientes foram despublicados. Os rascunhos foram preservados.', { type: 'success' });
    } catch (error) {
      notify(getErrorMessage(error, 'Não foi possível despublicar os clientes.'), { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <TopToolbar>
      <CreateButton label="Novo rascunho" />
      <Tooltip title={activeCount ? 'Remover todos os clientes da Home sem excluir rascunhos' : 'Nenhum cliente publicado'}>
        <span>
          <RaButton
            label={`Despublicar todos${activeCount ? ` (${activeCount})` : ''}`}
            disabled={loading || activeCount === 0}
            onClick={() => setConfirmOpen(true)}
          >
            <UnpublishedIcon />
          </RaButton>
        </span>
      </Tooltip>
      <Confirm
        isOpen={confirmOpen}
        loading={loading}
        title="Despublicar todos os clientes"
        content="A seção deixará de receber clientes pelo endpoint público. Nenhum rascunho ou logo será excluído."
        confirm="Despublicar todos"
        cancel="Cancelar"
        confirmColor="warning"
        onConfirm={handleUnpublish}
        onClose={() => {
          if (!loading) setConfirmOpen(false);
        }}
      />
    </TopToolbar>
  );
};

export const ClienteHomeList = () => (
  <List
    title="Clientes da Home"
    sort={{ field: 'ordem', order: 'ASC' }}
    perPage={1000}
    pagination={false}
    exporter={false}
    actions={<ClientesHomeListActions />}
    aside={
      <AdminHelpAside
        title="Publicação segura de clientes"
        description={
          <>
            Faça o upload manual no Supabase, cole a URL HTTPS, salve e valide a logo. Depois aprove os registros e selecione de <strong>6 a 12</strong> clientes para publicar.<br /><br />
            A publicação substitui o conjunto inteiro em uma única operação. Arquivar nunca exclui o histórico.
          </>
        }
      />
    }
  >
    <Alert severity="info" sx={{ mb: 2 }}>
      As caixas de seleção ficam disponíveis somente para clientes aprovados, não arquivados e com logo validada. Use os botões de seta para salvar a ordem completa atomicamente.
    </Alert>
    <ClientesHomeGrid />
  </List>
);

const ClienteHomeEditToolbar = () => (
  <Toolbar>
    <SaveButton />
  </Toolbar>
);

const ClienteLogoFormPreview = () => {
  const persistedRecord = useRecordContext<ClienteHomeAdminRecord>();

  return (
    <FormDataConsumer>
      {({ formData }) => {
        const currentUrl = normalizeUrl(formData?.logoUrl);
        const persistedUrl = normalizeUrl(persistedRecord?.logoUrl);
        const canPreview = Boolean(
          persistedRecord
            && currentUrl
            && currentUrl === persistedUrl
            && isLogoValidated(persistedRecord),
        );

        if (canPreview && persistedRecord) {
          return (
            <Box mb={2}>
              <Typography variant="subtitle2" gutterBottom>Preview da logo validada</Typography>
              <ValidatedLogo record={persistedRecord} width={240} height={90} />
              <Typography variant="caption" color="text.secondary">
                {persistedRecord.logoMimeType} · {formatBytes(persistedRecord.logoBytes)}
              </Typography>
            </Box>
          );
        }

        return currentUrl ? (
          <Alert severity="warning" sx={{ mb: 2, width: '100%' }}>
            Salve a URL e use “Validar logo” na lista. O preview só é carregado após a validação segura do backend.
          </Alert>
        ) : (
          <Alert severity="info" sx={{ mb: 2, width: '100%' }}>
            A logo é opcional no rascunho, mas precisa ser informada e validada antes da aprovação.
          </Alert>
        );
      }}
    </FormDataConsumer>
  );
};

const clienteHomeFormFields = (
  <>
    <TextInput
      source="nome"
      label="Nome da marca"
      validate={[required(), maxLength(120)]}
      fullWidth
    />
    <TextInput
      source="segmento"
      label="Setor"
      validate={[required(), maxLength(80)]}
      fullWidth
    />
    <TextInput
      source="descricaoCurta"
      label="Descrição curta"
      validate={[required(), maxLength(220)]}
      multiline
      rows={3}
      fullWidth
      helperText="Máximo de 220 caracteres."
    />
    <ImageInput
      source="logoUrl"
      label="Logo da Marca (PNG ou WebP com fundo transparente)"
      helperText="Formatos aceitos: PNG ou WEBP transparente (máx. 150 KB). O arquivo será enviado diretamente para o Supabase Storage."
      accept={{ 'image/png': ['.png'], 'image/webp': ['.webp'] }}
    >
      <ImageField source="src" title="title" />
    </ImageInput>
  </>
);

export const ClienteHomeEdit = () => (
  <Edit title="Editar cliente da Home" mutationMode="pessimistic">
    <SimpleForm toolbar={<ClienteHomeEditToolbar />}>
      <AdminHelpBanner
        title="Upload de logo"
        description="Selecione o arquivo da logo (PNG ou WebP transparente) direto do seu computador. O painel faz o upload automático no Supabase. Depois de salvar, clique no botão 'Validar logo' na lista para habilitar a aprovação e publicação."
      />
      <TextInput
        source="slug"
        label="Slug (gerado automaticamente)"
        disabled
        fullWidth
        helperText="Identificador imutável e somente leitura."
      />
      <NumberInput source="ordem" label="Ordem atual" disabled />
      {clienteHomeFormFields}
      <ClienteLogoFormPreview />
    </SimpleForm>
  </Edit>
);

export const ClienteHomeCreate = () => (
  <Create title="Criar rascunho de cliente">
    <SimpleForm>
      <AdminHelpBanner
        title="Novo rascunho"
        description="O slug será gerado pelo backend. O registro nasce inativo e não aprovado. Selecione a logo da empresa (PNG ou WebP) e clique em salvar."
      />
      {clienteHomeFormFields}
      <NumberInput
        source="ordem"
        label="Ordem inicial"
        defaultValue={1}
        validate={[required(), minValue(1)]}
      />
      <Alert severity="info" sx={{ width: '100%' }}>
        Após criar, use as setas da lista para normalizar a ordem e valide a logo para publicar.
      </Alert>
    </SimpleForm>
  </Create>
);
