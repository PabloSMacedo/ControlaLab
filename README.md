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

## Tecnologias

### Backend

- Python 3.13
- Django
- Django REST Framework

### Frontend

- React
- Axios

### Banco de Dados

- PostgreSQL

### Versionamento

- Git
- GitHub

---

## Funcionalidades

### RF01

Login e controle de acesso

### RF02

Cadastro de equipamentos

### RF03

Registro de manutenções

### RF04

Agendamento de manutenções

### RF05

Relatórios

---

## Pré-requisitos

- Python 3.13+
- Node.js 22+
- PostgreSQL 17+
- Git

---

## Instalação Backend

```bash
cd backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt
```

---

## Instalação Frontend

```bash
cd frontend

npm install
```

---

## Execução Backend

```bash
python manage.py runserver
```

---

## Execução Frontend

```bash
npm run dev
```

---

## Credenciais de Teste

Administrador

Email:
admin@controlalab.com

Senha:
123456

Usuário

Email:
usuario@controlalab.com

Senha:
123456

---

## Estratégia de Versionamento

O projeto utiliza Git Flow simplificado.

A branch main contém versões estáveis.

A branch develop concentra integrações.

As branches feature são utilizadas para desenvolvimento de novas funcionalidades.

Todos os integrantes realizam commits individuais, garantindo rastreabilidade e integridade do histórico.

As alterações passam por revisão antes da integração à branch principal.

---

## Estrutura do Projeto

backend/

frontend/

docs/

---

## Licença

MIT