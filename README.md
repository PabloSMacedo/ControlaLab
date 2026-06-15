# ControlaLab

Sistema acadêmico para gerenciamento de equipamentos laboratoriais, manutenções, agendamentos e relatórios.

O projeto possui backend em Django com views simples retornando JSON e frontend em React + Vite consumindo a API com sessão Django.

## Tecnologias

- Python 3.13+
- Django 6.0.5
- PostgreSQL
- React 18
- Vite
- Node.js 22 LTS
- GitHub Actions
- GitHub Pages para publicação estática do frontend

## Pré-requisitos

- Python instalado
- PostgreSQL em execução
- Node.js 22 LTS
- npm
- Git

## Configuração do Banco

Crie o banco PostgreSQL local:

```sql
CREATE DATABASE "controlaLab";
```

Configure usuário, senha, host e porta em `backend/config/settings.py` conforme o seu ambiente local. Não publique senhas reais no README, no frontend ou em issues.

## Rodar o Backend

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

O backend ficará disponível em:

```text
http://127.0.0.1:8000
```

Use o usuário criado no `createsuperuser` para acessar o sistema. Informe e-mail no cadastro do usuário se quiser testar login por e-mail.

## Rodar o Frontend

```bash
cd frontend
npm install
npm run dev
```

O frontend local usa por padrão:

```text
http://127.0.0.1:8000/api
```

Para apontar para outra API, crie um `.env` dentro de `frontend`:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

## Funcionalidades da AV5

- Login com usuário ou e-mail
- Logout com limpeza da sessão local
- Rotas internas protegidas no frontend
- CRUD de equipamentos
- CRUD de manutenções
- CRUD de agendamentos
- Dashboard com dados reais
- Relatórios JSON com resumo, equipamentos, manutenções e agendamentos
- Tratamento de loading, sucesso e erro nas telas principais

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

1. Faça `POST /api/login/` com:

```json
{
  "login": "seu_usuario_ou_email",
  "password": "sua_senha"
}
```

2. Mantenha os cookies da resposta para testar endpoints autenticados.
3. Teste campos obrigatórios vazios.
4. Teste IDs inexistentes em edição, remoção e listagens por equipamento.
5. Teste `POST /api/logout/` com e sem sessão.
6. Teste os quatro endpoints de relatórios autenticado e sem autenticação.

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

- Validar o backend com `python backend/manage.py check`
- Validar o frontend com `npm ci` e `npm run build`
- Publicar o frontend estático no GitHub Pages

Os workflows rodam em `push` e `pull_request` para `main` e `develop`, exceto o deploy do Pages, que publica a partir da `main` ou por execução manual.

## GitHub Pages

O GitHub Pages hospeda somente o frontend estático gerado em `frontend/dist`.

Ele não executa o backend Django. Em ambiente Pages, se a API local não estiver disponível, o frontend exibe uma mensagem amigável orientando a executar o backend localmente.

O Vite usa base de produção:

```text
/ControlaLab/
```

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
