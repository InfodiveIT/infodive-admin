import { DataProvider, fetchUtils } from 'react-admin';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

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
        } else if (Array.isArray(val)) {
            const uploadedArray = await Promise.all(
                val.map(async (item) => {
                    if (item && typeof item === 'object' && (item as any).rawFile instanceof File) {
                        return await uploadFile((item as any).rawFile);
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
            // Outros recursos que retornam lista simples JSON Array
            const { json } = await httpClient(url);
            let data = Array.isArray(json) ? json : [];
            
            // Filtro client-side simples
            if (params.filter && Object.keys(params.filter).length > 0) {
                data = data.filter((item: any) => 
                    Object.entries(params.filter).every(([k, v]) => 
                        v === undefined || v === null || v === '' || 
                        String(item[k]).toLowerCase().includes(String(v).toLowerCase())
                    )
                );
            }
            
            // Ordenação client-side simples
            if (field) {
                data.sort((a: any, b: any) => {
                    const valA = a[field];
                    const valB = b[field];
                    if (valA < valB) return order === 'ASC' ? -1 : 1;
                    if (valA > valB) return order === 'ASC' ? 1 : -1;
                    return 0;
                });
            }
            
            // Paginação client-side
            const start = (page - 1) * perPage;
            const end = page * perPage;
            
            return {
                data: data.slice(start, end),
                total: data.length,
            };
        }
    },
    
    getOne: async (resource, params) => {
        const isSingleton = [
            'config-footer', 'config-blog', 'contato-info',
            'servicos-etapas', 'servicos-metodologia',
            'sobre-numeros', 'sobre-timeline', 'sobre-valores', 'sobre-cultura'
        ].includes(resource);
        
        const url = isSingleton ? `${apiUrl}/${resource}` : `${apiUrl}/${resource}/${params.id}`;
        const { json } = await httpClient(url);
        
        if (isSingleton) {
            json.id = 'singleton';
        }
        if (resource === 'paginas-hero' || resource === 'secoes-home' || resource === 'ctas') {
            json.id = params.id;
        }
        if (resource === 'contato-info' && json.cardBullets) {
            json.cardBullets = json.cardBullets.map((bullet: string) => ({ text: bullet }));
        }
        return { data: json };
    },
    
    getMany: async (resource, params) => {
        const url = `${apiUrl}/${resource}`;
        const { json } = await httpClient(url);
        const data = Array.isArray(json) ? json : (json.content || []);
        return { data: data.filter((item: any) => params.ids.includes(item.id)) };
    },
    
    getManyReference: async (resource, params) => {
        const { page, perPage } = params.pagination || { page: 1, perPage: 10 };
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
            'config-footer', 'config-blog', 'contato-info',
            'servicos-etapas', 'servicos-metodologia',
            'sobre-numeros', 'sobre-timeline', 'sobre-valores', 'sobre-cultura'
        ].includes(resource);
        
        const url = isSingleton ? `${apiUrl}/${resource}` : `${apiUrl}/${resource}/${params.id}`;
        
        // Upload de arquivos se existirem novos arquivos selecionados no formulário
        const processedData = await checkAndUploadFiles(params.data);
        
        if (resource === 'contato-info' && processedData.cardBullets) {
            processedData.cardBullets = processedData.cardBullets.map((item: any) => 
                typeof item === 'string' ? item : (item && item.text) || ''
            );
        }
        
        if (isSingleton) {
            delete processedData.id;
        }
        
        const { json } = await httpClient(url, {
            method: 'PUT',
            body: JSON.stringify(processedData),
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
        
        // Upload de arquivos se existirem no formulário
        const processedData = await checkAndUploadFiles(params.data);
        
        if (resource === 'contato-info' && processedData.cardBullets) {
            processedData.cardBullets = processedData.cardBullets.map((item: any) => 
                typeof item === 'string' ? item : (item && item.text) || ''
            );
        }
        
        const { json } = await httpClient(url, {
            method: 'POST',
            body: JSON.stringify(processedData),
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
