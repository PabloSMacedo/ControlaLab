# ControlaLab

## Descrição

O ControlaLab é um sistema para gerenciamento de equipamentos laboratoriais e controle de manutenções preventivas e corretivas.

O objetivo é substituir controles manuais realizados em planilhas, centralizando informações sobre equipamentos, históricos de manutenção e agendamentos.

---

## Integrantes

- Pablo Macedo
- Elionai
- Eduardo
- Elisa
- Camile

---

## Tecnologias Utilizadas

### Backend
- Python 3.14.5
- Django 6.0.5
- Psycopg 3.3.4

### Frontend
- React
- Axios

### Banco de Dados
- PostgreSQL 17+

### Versionamento
- Git
- GitHub

---

## Funcionalidades

### RF01 - Login e Controle de Acesso
Permitir autenticação e gerenciamento de usuários.

### RF02 - Cadastro de Equipamentos
Permitir cadastro e consulta dos equipamentos laboratoriais.

### RF03 - Registro de Manutenções
Permitir registro de manutenções preventivas e corretivas.

### RF04 - Agendamento de Manutenções
Permitir planejamento e acompanhamento das manutenções.

### RF05 - Relatórios
Gerar relatórios de equipamentos e histórico de manutenções.


---

## Pré-requisitos

Instalar os seguintes softwares:

| Software   | Versão Recomendada |
| ---------- | ------------------ |
| Python     | 3.14.5             |
| PostgreSQL | 17+                |
| Git        | 2.54+              |
| Node.js    | 22 LTS             |
| npm        | 10+                |

---

## Clonando o Projeto

`git clone <URL_DO_REPOSITORIO>`

`cd ControlaLab`

---

## Configuração do Banco de Dados

Criar o banco PostgreSQL:

`CREATE DATABASE controlaLab;`

Configurar as credenciais no arquivo `backend/config/settings.py`.

Exemplo:

`DATABASES = {`
`    'default': {`
`        'ENGINE': 'django.db.backends.postgresql',`
`        'NAME': 'controlaLab',`
`        'USER': 'postgres',`
`        'PASSWORD': 'sua_senha',`
`        'HOST': 'localhost',`
`        'PORT': '5432',`
`    }`
`}`

---

## Instalação do Backend

`cd backend`

`pip install -r requirements.txt`

---

## Criação das Tabelas

`python manage.py makemigrations`

`python manage.py migrate`

---

## Criação do Usuário Administrador

`python manage.py createsuperuser`

---

## Credencial de Teste para Avaliação

Para criar ou atualizar uma credencial de teste para o professor, execute:

`python manage.py criar_usuario_teste`

Credencial gerada:

Usuário: `professor`

Senha: `ControlaLab@123`

Acesso ao painel administrativo: `http://127.0.0.1:8000/admin`

---

## Execução do Backend

`python manage.py runserver`

A aplicação estará disponível em: `http://127.0.0.1:8000`

Painel administrativo: `http://127.0.0.1:8000/admin`

---

## Instalação do Frontend

`cd frontend`

`npm install`

---

## Execução do Frontend

`npm run dev`

---

## Dependências Python

- asgiref==3.11.1
- Django==6.0.5
- psycopg==3.3.4
- psycopg-binary==3.3.4
- sqlparse==0.5.5
- tzdata==2026.2

---

## Estratégia de Versionamento

O projeto utiliza Git Flow simplificado.

- `main`: versões estáveis.
- `develop`: integração das funcionalidades.
- `feature/*`: desenvolvimento de novas funcionalidades.

As alterações passam por revisão antes da integração à branch principal.

---

## Estrutura do Projeto

ControlaLab/
- backend/
- frontend/
- docs/
- .github/
- README.md
- LICENSE

---

## Licença

Este projeto utiliza a licença MIT.
