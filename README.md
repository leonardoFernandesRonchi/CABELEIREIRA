# Sistema de Agendamento - API

## 📌 Descrição

API REST desenvolvida para gerenciamento de agendamentos.

O sistema permite que usuários realizem agendamentos, acompanhem seus horários e que administradores possam gerenciar todos os agendamentos, alterando status, datas e visualizando os usuários vinculados.

---

# 🚀 Tecnologias utilizadas

## Backend

- Node.js
- Express
- TypeScript
- Sequelize ORM
- MySQL
- JWT para autenticação
- bcrypt para criptografia de senhas

## Frontend

- React
- TypeScript
- TailwindCSS
- Axios

---

# ⚙️ Instalação

## Pré-requisitos

Antes de iniciar, certifique-se de possuir instalado:

- Node.js
- MySQL
- Git

---

## Clonar o projeto

```bash
git clone https://github.com/seu-usuario/agendamento-api.git

cd Cabeleireira
```

---

# Backend

Acesse a pasta do backend:

```bash
cd backend
```

Instale as dependências:

```bash
npm install
```

---

## Configuração do ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
PORT=3000

DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_NAME=seu_banco
DATABASE_USER=seu_usuario
DATABASE_PASSWORD=

JWT_SECRET=jwt_secret
```

---

## Criando o banco de dados

Execute no MySQL:

```sql
CREATE DATABASE Cabeleireira;
```

---

## Executando migrations

```bash
npx sequelize-cli db:migrate
```

---

## Executando Seed / Criando usuário admin@admin.com com senha admin

```bash
npx sequelize-cli db:seed:all
```



---
## Executando o projeto


```bash
npm run dev
```

API disponível em:

```
http://localhost:3001
```

---

# 🗄️ Modelagem do Banco de Dados

## Diagrama entidade relacionamento


```
                         USERS
------------------------------------------------
id
name
email
password
role
created_at
updated_at
------------------------------------------------
                         |
                         |
                         | 1:N
                         |
                         |
                    SCHEDULINGS
------------------------------------------------
id
user_id
date_time
total_duration_minutes
status
created_at
updated_at
------------------------------------------------
                         |
                         |
                         | N:N
                         |
                         |
              SCHEDULING_SERVICES
------------------------------------------------
id
scheduling_id
service_id
created_at
updated_at
------------------------------------------------
                         |
                         |
                         | N:1
                         |
                         |
                     SERVICES
------------------------------------------------
id
name
description
price
createdAt
updatedAt
------------------------------------------------
```


---


# 🔐 Autenticação

A API utiliza autenticação através de JWT.

Após realizar login, o usuário recebe um token:

```json
{
    "token": "jwt_token"
}
```

Nas próximas requisições autenticadas deve ser enviado:

```
Authorization: Bearer TOKEN
```

---

# 📚 Documentação dos Endpoints

URL base:

```
http://localhost:3000/api
```

---

# 👤 Usuários

## Criar usuário

### POST

```
/api/users
```

### Body

```json
{
    "name": "Leonardo",
    "email": "leonardo@email.com",
    "password": "123456"
}
```

### Response

Status:

```
201 Created
```

```json
{
    "id": 1,
    "name": "Leonardo",
    "email": "leonardo@email.com"
}
```

---

# Login

## Realizar login

### POST

```
/api/signin
```

### Body

```json
{
    "email": "leonardo@email.com",
    "password": "123456"
}
```

### Response

```json
{
    "user": {
        "id": 1,
        "name": "Leonardo",
        "role": "user"
    }
}
```

## Realizar logout

```
/api/logout
```



## Informações do usuário logado

```
/api/me
```
---

# 🏪 Criação de serviços (apenas admin)
### Post
```
/api/services
```
## Body
```
{
  "name": "Corte Masculino",
  "description": "Corte tradicional masculino com acabamento.",
  "price": 35.00
}
```
```

## Response
{
	"id": 1,
	"name": "Corte Masculino",
	"description": "Corte tradicional masculino com acabamento.",
	"price": 35,
	"updatedAt": "2026-07-11T16:57:35.018Z",
	"createdAt": "2026-07-11T16:57:35.018Z"
}
```

# Atualizar um serviço
### PUT
```
/api/services/serviceId
```

## Body
```
{
  "name": "Corte Masculino",
  "description": "Corte tradicional masculino com acabamento.",
  "price": 45.52,
}
```
## Response
```

{
	"id": 1,
	"name": "Corte Masculino",
	"description": "Corte tradicional masculino com acabamento.",
	"price": 45.52,
	"durationMinutes": 40,
	"createdAt": "2026-07-11T14:47:30.000Z",
	"updatedAt": "2026-07-11T14:48:05.486Z"
}
```



#  Listar todos serviços
### Get
```
/api/services/serviceId
```

# Apagar um serviço
### Delete
```
/api/services/serviceId
```


# 📅 Agendamentos

## Criar agendamento

Usuário autenticado.

### POST

```
/schedulings
```

### Body

```json
{
    "dateTime": "2026-07-15 14:00"
}
```

### Response

```json
{
    "id": 10,
    "dateTime": "2026-07-15 14:00",
    "status": "pending"
}
```

---

# Listar meus agendamentos

Retorna apenas os agendamentos do usuário autenticado.

### GET

```
/schedulings/my
```

### Response

```json
[
    {
        "id":10,
        "dateTime":"2026-07-15 14:00",
        "status":"confirmed"
    }
]
```

---

# Listar todos os agendamentos

Apenas administradores.

### GET

```
/schedulings
```

### Response

```json
[
    {
        "id":10,
        "user":{
            "name":"Leonardo"
        },
        "dateTime":"2026-07-15 14:00",
        "status":"pending"
    }
]
```

---

# Atualizar agendamento

Apenas administradores.

### PUT

```
/schedulings/:schedulingId
```

### Body

```json
{
    "dateTime":"2026-07-15 15:00",
    "status":"confirmed"
}
```

### Response

```json
{
    "message":"Agendamento atualizado com sucesso"
}
```

---

# Cancelar agendamento

### DELETE

```
/schedulings/:id
```

### Response

```json
{
    "message":"Agendamento cancelado"
}
```

#SchedulingService

### Post
```

/api/schedulingServices
```

# Body
```

{
  "schedulingId": 1,
	"serviceId": 1
}
```


# Response
```

{
	"schedulingId": 1,
	"serviceId": 1,
	"updatedAt": "2026-07-11T16:58:08.062Z",
	"createdAt": "2026-07-11T16:58:08.062Z"
}
```

### Delete
```

http://localhost:3001/api/schedulingServices/1
```

```

{
	"message": "Serviço removido do agendamento com sucesso"
}
```

---

# 🔒 Regras de negócio

## Usuário comum

Pode:

- Criar agendamento
- Visualizar seus próprios horários
- Cancelar seus próprios agendamentos


Não pode:

- Alterar agendamentos de outros usuários
- Confirmar agendamentos


---

## Administrador

Pode:

- Visualizar todos os usuários
- Visualizar todos os agendamentos
- Confirmar agendamentos
- Alterar datas
- Cancelar qualquer agendamento

---


