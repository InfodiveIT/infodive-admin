import { DataProvider, Identifier, RaRecord, fetchUtils } from 'react-admin';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://infodiveit-backend-production.up.railway.app/api/v1';

const httpClient = (url: string, options: any = {}) => {
    if (!options.headers) {
        options.headers = new Headers({ Accept: 'application/json' });
    }
    const token = localStorage.getItem('token');
    if (token) {
        options.headers.set('Authorization', `Bearer ${token}`);
    }
    return fetchUtils.fetchJson(url, options);
};

// Envia um arquivo único para o backend via multipart/form-data
const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('token');
    const headers = new Headers();
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(`${apiUrl}/files/upload`, {
        method: 'POST',
        body: formData,
        headers: headers,
    });

    if (!response.ok) {
        const errorJson = await response.json().catch(() => ({}));
        throw new Error(errorJson.error || 'Erro no upload do arquivo');
    }

    const json = await response.json();
    return json.url;
};

// Varre recursivamente os campos do objeto em busca de arquivos para upload
const checkAndUploadFiles = async (data: any): Promise<any> => {
    if (!data || typeof data !== 'object') {
        return data;
    }

    if (Array.isArray(data)) {
        return Promise.all(data.map(item => checkAndUploadFiles(item)));
    }

    const processedData = { ...data };

    for (const [key, val] of Object.entries(processedData)) {
        // Formato padrão do ImageInput do React Admin para arquivo novo: { rawFile: File, src: "..." }
        if (val && typeof val === 'object' && (val as any).rawFile instanceof File) {
            try {
                processedData[key] = await uploadFile((val as any).rawFile);
            } catch (err: any) {
                console.error(`Erro ao fazer upload da imagem no campo ${key}:`, err);
                throw err;
            }
        } else if (val && typeof val === 'object' && 'src' in val && typeof (val as any).src === 'string') {
            // Se for objeto do ImageInput sem arquivo novo (apenas visualizacao), extrai a string da URL
            processedData[key] = (val as any).src;
        } else if (Array.isArray(val)) {
            const uploadedArray = await Promise.all(
                val.map(async (item) => {
                    if (item && typeof item === 'object' && (item as any).rawFile instanceof File) {
                        return await uploadFile((item as any).rawFile);
                    }
                    if (item && typeof item === 'object' && 'src' in item && typeof (item as any).src === 'string') {
                        return (item as any).src;
                    }
                    return await checkAndUploadFiles(item);
                })
            );
            processedData[key] = uploadedArray;
        } else if (typeof val === 'object' && val !== null) {
            processedData[key] = await checkAndUploadFiles(val);
        }
    }

    return processedData;
};

const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000';

const triggerRevalidation = async (resource: string) => {
    try {
        await fetch(`${frontendUrl}/api/revalidate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ resource }),
        });
    } catch {
        // Silenciosamente ignora em caso de erro na chamada de revalidação
    }
};

export type ClienteHomeAdminRecord = RaRecord<string> & {
    nome: string;
    segmento: string;
    descricaoCurta: string;
    logoUrl: string | null;
    ordem: number;
    ativo: boolean;
    createdAt?: string;
    updatedAt?: string;
};

const sanitizeClienteHomeEditorialData = (
    data: Record<string, unknown>,
    previousData?: Record<string, unknown>,
) => ({
    ...data,
    nome: typeof data.nome === 'string' ? data.nome.trim() : '',
    segmento: typeof data.segmento === 'string' ? data.segmento.trim() : '',
    descricaoCurta: typeof data.descricaoCurta === 'string' ? data.descricaoCurta.trim() : '',
    logoUrl: typeof data.logoUrl === 'string' && data.logoUrl.trim().length > 0 ? data.logoUrl.trim() : null,
    ordem: Number(data.ordem ?? previousData?.ordem ?? 1),
    ativo: data.ativo !== undefined ? Boolean(data.ativo) : true,
});

export const dataProvider: DataProvider = {
    getList: async (resource, params) => {
        const { page, perPage } = params.pagination || { page: 1, perPage: 10 };
        const { field, order } = params.sort || { field: 'id', order: 'ASC' };
        
        let url = `${apiUrl}/${resource}`;
        
        // Recursos que possuem paginação nativa no backend (Spring Data Page)
        if (resource === 'produtos' || resource === 'conteudos') {
            const queryParams = new URLSearchParams({
                page: String(page - 1),
                size: String(perPage),
                ...params.filter,
            });
            url = `${url}?${queryParams.toString()}`;
            const { json } = await httpClient(url);
            return {
                data: json.content || [],
                total: json.totalElements || 0,
            };
        } else {
            // Endpoints que retornam lista completa (List<Entity>)
            const { json } = await httpClient(url);
            let data = Array.isArray(json) ? json : [];
            
            // Filtros locais em memória
            if (params.filter && Object.keys(params.filter).length > 0) {
                data = data.filter((item: any) => {
                    return Object.entries(params.filter).every(([key, filterVal]) => {
                        if (filterVal === undefined || filterVal === null || filterVal === '') return true;
                        
                        // Busca textual abrangente (q)
                        if (key === 'q') {
                            const searchStr = String(filterVal).toLowerCase();
                            return Object.values(item).some(val => 
                                typeof val === 'string' && val.toLowerCase().includes(searchStr)
                            );
                        }
                        
                        const itemVal = item[key];
                        if (typeof itemVal === 'string') {
                            return itemVal.toLowerCase().includes(String(filterVal).toLowerCase());
                        }
                        return itemVal === filterVal;
                    });
                });
            }
            
            // Ordenação local em memória
            if (field) {
                data = [...data].sort((a: any, b: any) => {
                    const valA = a[field];
                    const valB = b[field];
                    if (valA === undefined || valA === null) return 1;
                    if (valB === undefined || valB === null) return -1;
                    
                    if (typeof valA === 'number' && typeof valB === 'number') {
                        return order === 'ASC' ? valA - valB : valB - valA;
                    }
                    
                    const strA = String(valA).toLowerCase();
                    const strB = String(valB).toLowerCase();
                    if (strA < strB) return order === 'ASC' ? -1 : 1;
                    if (strA > strB) return order === 'ASC' ? 1 : -1;
                    return 0;
                });
            }
            
            // Paginação local em memória
            const total = data.length;
            const start = (page - 1) * perPage;
            const end = start + perPage;
            const pageData = data.slice(start, end);
            
            return {
                data: pageData,
                total: total,
            };
        }
    },
    
    getOne: async (resource, params) => {
        const isSingleton = [
            'config-footer', 'config-blog', 'config-social', 'contato-info',
            'servicos-etapas', 'servicos-metodologia',
            'sobre-numeros', 'sobre-timeline', 'sobre-valores', 'sobre-cultura'
        ].includes(resource);
        
        const targetEndpoint = resource === 'config-social' ? 'config-blog/social' : resource;
        const url = isSingleton ? `${apiUrl}/${targetEndpoint}` : `${apiUrl}/${resource}/${params.id}`;
        const { json } = await httpClient(url);
        
        if (isSingleton) {
            json.id = 'singleton';
        }
        if (resource === 'paginas-hero' || resource === 'secoes-home' || resource === 'ctas') {
            json.id = params.id;
        }
        
        return { data: json };
    },
    
    getMany: async (resource, params) => {
        const url = `${apiUrl}/${resource}`;
        const { json } = await httpClient(url);
        const allData = Array.isArray(json) ? json : (json.content || []);
        const data = allData.filter((item: any) => params.ids.includes(item.id));
        return { data };
    },
    
    getManyReference: async (resource, params) => {
        const { page, perPage } = params.pagination;
        const url = `${apiUrl}/${resource}`;
        const { json } = await httpClient(url);
        const allData = Array.isArray(json) ? json : (json.content || []);
        const data = allData.filter((item: any) => item[params.target] === params.id);
        return {
            data: data.slice((page - 1) * perPage, page * perPage),
            total: data.length,
        };
    },
    
    update: async (resource, params) => {
        const isSingleton = [
            'config-footer', 'config-blog', 'config-social', 'contato-info',
            'servicos-etapas', 'servicos-metodologia',
            'sobre-numeros', 'sobre-timeline', 'sobre-valores', 'sobre-cultura'
        ].includes(resource);
        
        const targetEndpoint = resource === 'config-social' ? 'config-blog/social' : resource;
        const url = isSingleton ? `${apiUrl}/${targetEndpoint}` : `${apiUrl}/${resource}/${params.id}`;
        
        const processedData = await checkAndUploadFiles(params.data);
        const finalData = resource === 'clientes-home'
            ? sanitizeClienteHomeEditorialData(processedData, params.previousData)
            : processedData;
        
        if (resource === 'contato-info' && finalData.cardBullets) {
            finalData.cardBullets = finalData.cardBullets.map((item: any) => 
                typeof item === 'string' ? item : (item && item.text) || ''
            );
        }
        
        if (isSingleton) {
            delete finalData.id;
        }
        if (resource === 'config-social') {
            delete finalData.instagramConfigured;
            delete finalData.linkedinConfigured;
        }
        
        const { json } = await httpClient(url, {
            method: 'PUT',
            body: JSON.stringify(finalData),
        });
        
        if (isSingleton) {
            json.id = 'singleton';
        }
        if (resource === 'paginas-hero' || resource === 'secoes-home' || resource === 'ctas') {
            json.id = params.id;
        }
        triggerRevalidation(resource);
        return { data: json };
    },
    
    updateMany: async (resource, params) => {
        const responses = await Promise.all(
            params.ids.map(id =>
                httpClient(`${apiUrl}/${resource}/${id}`, {
                    method: 'PUT',
                    body: JSON.stringify(params.data),
                })
            )
        );
        triggerRevalidation(resource);
        return { data: responses.map(({ json }) => json.id) };
    },
    
    create: async (resource, params) => {
        const url = `${apiUrl}/${resource}`;
        
        const processedData = await checkAndUploadFiles(params.data);
        const finalData = resource === 'clientes-home'
            ? sanitizeClienteHomeEditorialData(processedData)
            : processedData;
        
        if (resource === 'contato-info' && finalData.cardBullets) {
            finalData.cardBullets = finalData.cardBullets.map((item: any) => 
                typeof item === 'string' ? item : (item && item.text) || ''
            );
        }
        
        const { json } = await httpClient(url, {
            method: 'POST',
            body: JSON.stringify(finalData),
        });
        triggerRevalidation(resource);
        return { data: json };
    },
    
    delete: async (resource, params) => {
        const url = `${apiUrl}/${resource}/${params.id}`;
        await httpClient(url, {
            method: 'DELETE',
        });
        triggerRevalidation(resource);
        return { data: params.previousData as any };
    },
    
    deleteMany: async (resource, params) => {
        await Promise.all(
            params.ids.map(id =>
                httpClient(`${apiUrl}/${resource}/${id}`, {
                    method: 'DELETE',
                })
            )
        );
        triggerRevalidation(resource);
        return { data: params.ids };
    },
};
