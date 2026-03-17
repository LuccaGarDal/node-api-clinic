# Sistema de Agendamento Clínico

## Descrição do Projeto

Sistema web desenvolvido para gerenciamento de consultas clínicas, permitindo cadastro e login de usuários, agendamento de consultas e visualização de consultas agendadas.

O sistema possui dois perfis principais:

- **Paciente**: pode agendar consultas e visualizar suas consultas.
- **Secretário(a)**: pode visualizar o painel administrativo com todas as consultas dos pacientes.

---

## Funcionalidades Principais

- Cadastro de usuários  
- Login com autenticação JWT  
- Agendamento de consultas  
- Consulta automática de CEP  
- Previsão do clima para o dia da consulta  
- Painel administrativo  
- Controle de acesso por perfil de usuário  

---

## Tecnologias Utilizadas

### Backend
- Node.js  
- Express  
- MongoDB  
- JWT  
- Axios
- Prisma
- Cors
- Zod  

### Frontend
- Vue.js  
- Vue Router  
- Axios  

### APIs Externas
- ViaCEP  
- OpenWeatherMap

---

## Estrutura do Projeto

### Backend
- Rotas organizadas por responsabilidade  
- Controllers para autenticação e consultas 
- Middleware de autenticação JWT  

### Frontend
- Rotas protegidas por perfil  
- Componentes separados por páginas  
- Formulários reativos  

---

## Funcionalidades Implementadas conforme os requisitos da avaliação

### Planejamento do Projeto
- Definição das funcionalidades principais  
- Estruturação das telas do sistema  

### Configuração do Backend
- Endpoint de login  
- Endpoint de cadastro  
- Endpoint de agendamento  
- Endpoint de exibição de consultas

### Implementação de Autenticação JWT
- Middleware de autenticação  
- Proteção de rotas autenticadas  

### Integração com APIs externas
- ViaCEP para preenchimento automático do endereço  
- OpenWeatherMap para previsão no dia da consulta  

### Criação do Frontend
- Formulários reativos de login, cadastro e agendamento  
- Painel administrativo  
- Lista de consultas  

---

## Deploy

### Frontend
https://node-api-clinic.vercel.app/

### Backend
https://node-api-clinic.onrender.com/

---

## Repositório GitHub

https://github.com/LuccaGarDal/node-api-clinic

---

## Como executar localmente

### Backend

```bash
cd backend
npm install
npm run dev
```
Backend disponível em: http://localhost:5000

### Frontend

```bash
cd frontend
npm install
npm run dev
```
Frontend disponível em: http://localhost:5173

## Estrutura do projeto

backend/
frontend/
README.md

## Autor

Lucca Garcia
