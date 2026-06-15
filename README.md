# ControlaLab

Sistema acadêmico para gerenciamento de equipamentos laboratoriais, manutenções, agendamentos e relatórios.

O projeto foi desenvolvido para a entrega AV5. Ele possui backend em Django com endpoints JSON e frontend em React + Vite consumindo a API com sessão Django.

## Tecnologias

- Python 3.13+
- Django 6.0.5
- PostgreSQL
- React 18
- Vite
- Node.js 22 LTS
- GitHub Actions
- GitHub Pages para publicação estática do frontend

## Funcionalidades

- Login com usuário ou e-mail
- Logout
- Rotas internas protegidas no frontend
- CRUD de equipamentos
- CRUD de manutenções
- CRUD de agendamentos
- Dashboard com dados reais
- Relatórios JSON
- Estados de loading, sucesso e erro
- Busca, filtros e paginação nas telas principais

## Pré-Requisitos

- Git
- Python instalado
- PostgreSQL em execução
- Node.js 22 LTS
- npm

## Como Rodar Localmente

Clone o projeto:

```bash
git clone https://github.com/PabloSMacedo/ControlaLab.git
cd ControlaLab
```

Crie o banco PostgreSQL:

```sql
CREATE DATABASE "controlaLab";
```

Confira as credenciais do banco em `backend/config/settings.py` e ajuste para o seu ambiente local, se necessário.

Instale e rode o backend:

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py criar_usuario_teste
python manage.py runserver
```

O backend ficará em:

```text
http://127.0.0.1:8000
```

Em outro terminal, instale e rode o frontend:

```bash
cd frontend
npm install
npm run dev
```

O frontend ficará em:

```text
http://127.0.0.1:5173
```

## Credencial de Teste

Gere a credencial com:

```bash
python manage.py criar_usuario_teste
```

Use no login:

```text
Usuário: professor
Senha: ControlaLab@123
```

O comando cria ou atualiza esse usuário como administrador para facilitar a avaliação.

## Configuração da API no Frontend

Por padrão, o frontend usa:

```text
http://127.0.0.1:8000/api
```

Para apontar para outro backend, crie `frontend/.env`:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

Se o backend estiver hospedado publicamente, use a URL pública da API.

## Endpoints Principais

### Autenticação

- `POST /api/login/`
- `POST /api/logout/`

### Equipamentos

- `GET /api/equipamentos/`
- `POST /api/equipamentos/cadastrar/`
- `PUT /api/equipamentos/<id>/editar/`
- `DELETE /api/equipamentos/<id>/remover/`

### Manutenções

- `GET /api/manutencoes/`
- `POST /api/manutencoes/cadastrar/`
- `GET /api/equipamentos/<id>/manutencoes/`
- `PUT /api/manutencoes/<id>/editar/`
- `DELETE /api/manutencoes/<id>/remover/`

### Agendamentos

- `GET /api/agendamentos/`
- `POST /api/agendamentos/cadastrar/`
- `GET /api/equipamentos/<id>/agendamentos/`
- `PUT /api/agendamentos/<id>/editar/`
- `DELETE /api/agendamentos/<id>/remover/`

### Relatórios

- `GET /api/relatorios/resumo/`
- `GET /api/relatorios/equipamentos/`
- `GET /api/relatorios/manutencoes/`
- `GET /api/relatorios/agendamentos/`

## Testes Manuais no Postman

Faça login:

```json
{
  "login": "professor",
  "password": "ControlaLab@123"
}
```

Mantenha os cookies da resposta para testar os endpoints autenticados.

Testes sugeridos:

- Login por usuário válido
- Login por senha inválida
- Logout autenticado
- Cadastro, edição, listagem e remoção de equipamentos
- Cadastro, edição, listagem e remoção de manutenções
- Cadastro, edição, listagem e remoção de agendamentos
- Relatórios autenticados
- Acesso sem autenticação retornando `401`
- Campos obrigatórios retornando `400`
- IDs inexistentes retornando `404`

## Validação Local

Backend:

```bash
python backend/manage.py check
```

Frontend:

```bash
cd frontend
npm run build
```

## GitHub Actions

O projeto possui workflows para:

- Validar backend com `python backend/manage.py check`
- Validar frontend com `npm ci` e `npm run build`
- Publicar o frontend estático no GitHub Pages

O deploy do GitHub Pages publica somente o conteúdo gerado em `frontend/dist`.

## GitHub Pages

URL esperada:

```text
https://pablosmacedo.github.io/ControlaLab/
```

O GitHub Pages hospeda apenas o frontend estático. Ele não executa Django nem PostgreSQL.

Para login e CRUD funcionarem no Pages, o backend também precisa estar rodando em uma URL acessível pelo navegador e o frontend precisa apontar para essa API via `VITE_API_URL`.

Em desenvolvimento local, rode:

```text
Frontend local: http://127.0.0.1:5173
Backend local:  http://127.0.0.1:8000
```

## Critérios de Aceite AV5

- `python manage.py check` deve passar
- `npm run build` deve passar
- Login deve funcionar no frontend
- Logout deve funcionar no frontend
- Dashboard deve usar dados reais
- Equipamentos devem permitir listar, cadastrar, editar e remover
- Manutenções devem permitir listar, cadastrar, editar e remover
- Agendamentos devem permitir listar, cadastrar, editar e remover
- Relatórios devem consumir endpoints reais
- GitHub Actions devem validar backend e frontend
- GitHub Pages deve publicar o frontend
- As páginas principais não devem usar dados mockados quando existir backend correspondente
- O navegador não deve apresentar erro de CORS no uso local configurado

## Estrutura

```text
ControlaLab/
  backend/
  frontend/
  docs/
  .github/workflows/
  README.md
```

## Licença

Este projeto utiliza a licença MIT.
