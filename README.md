# SentriX

## Sistema de Monitorização e Segurança de Veículos

O **SentriX** é um sistema de monitorização e segurança de veículos desenvolvido no âmbito da Prova de Aptidão Profissional (PAP).

O projeto tem como objetivo permitir ao proprietário acompanhar e gerir os seus veículos através de uma aplicação, enquanto um dispositivo instalado no veículo poderá recolher e transmitir informações relacionadas com a sua localização.

Este repositório contém o código-fonte do backend do projeto SentriX.

---

## Objetivo do Backend

O backend é responsável por funcionar como a camada intermédia entre a aplicação, a base de dados e, futuramente, o dispositivo instalado no veículo.

Entre as suas responsabilidades encontram-se:

- Gestão de utilizadores;
- Autenticação de utilizadores;
- Proteção de rotas através de tokens JWT;
- Gestão dos veículos pertencentes aos utilizadores;
- Criação de veículos;
- Consulta de veículos;
- Atualização de veículos;
- Eliminação de veículos;
- Validação da propriedade dos veículos;
- Comunicação com a base de dados PostgreSQL.

---

## Tecnologias utilizadas

| Tecnologia | Utilização |
|---|---|
| Node.js | Ambiente de execução |
| TypeScript | Linguagem de programação |
| Express | Desenvolvimento da API REST |
| PostgreSQL | Sistema de gestão da base de dados |
| Prisma | ORM e acesso à base de dados |
| JWT | Autenticação e autorização |
| bcrypt | Proteção das palavras-passe |
| Git | Controlo de versões |
| GitHub | Repositório e disponibilização do código-fonte |

---

## Arquitetura

O backend segue uma organização por camadas:

    Cliente
       │
       ▼
    Routes
       │
       ▼
    Controllers
       │
       ▼
    Services
       │
       ▼
    Repositories
       │
       ▼
    Prisma
       │
       ▼
    PostgreSQL

### Routes

Responsáveis por definir os endpoints disponíveis na API.

### Controllers

Recebem os pedidos HTTP e devolvem as respostas ao cliente.

### Services

Contêm a lógica principal das funcionalidades.

### Repositories

Responsáveis pelo acesso aos dados através do Prisma.

### Prisma

Funciona como camada de comunicação entre a aplicação e a base de dados PostgreSQL.

---

## Estrutura do projeto

    backend/
    │
    ├── prisma/
    │   ├── migrations/
    │   └── schema.prisma
    │
    ├── src/
    │   ├── controllers/
    │   │   ├── auth.controller.ts
    │   │   └── vehicle.controller.ts
    │   │
    │   ├── lib/
    │   │   ├── jwt.ts
    │   │   └── prisma.ts
    │   │
    │   ├── middlewares/
    │   │   └── auth.middleware.ts
    │   │
    │   ├── repositories/
    │   │   ├── user.repository.ts
    │   │   └── vehicle.repository.ts
    │   │
    │   ├── routes/
    │   │   ├── auth.routes.ts
    │   │   └── vehicle.routes.ts
    │   │
    │   ├── services/
    │   │   ├── user.service.ts
    │   │   └── vehicle.service.ts
    │   │
    │   ├── types/
    │   │   └── express.d.ts
    │   │
    │   ├── app.ts
    │   └── server.ts
    │
    ├── .env.example
    ├── .gitignore
    ├── package.json
    ├── package-lock.json
    ├── prisma7.config.ts
    ├── tsconfig.json
    └── README.md

---

## Funcionalidades implementadas

### Autenticação

O sistema possui mecanismos para:

- Registo de utilizadores;
- Login;
- Geração de token JWT;
- Validação do token;
- Consulta dos dados do utilizador autenticado;
- Proteção de endpoints através de middleware de autenticação.

### Gestão de veículos

Cada veículo está associado a um utilizador.

As operações atualmente implementadas incluem:

- Criar veículo;
- Listar veículos do utilizador autenticado;
- Obter um veículo específico;
- Atualizar um veículo;
- Eliminar um veículo.

O sistema verifica também se o veículo pertence ao utilizador autenticado antes de permitir operações sobre o mesmo.

---

## Base de dados

O projeto utiliza **PostgreSQL** como sistema de gestão de base de dados.

O Prisma é utilizado como ORM para definir os modelos e realizar as operações sobre a base de dados.

Atualmente existem os seguintes modelos principais:

    User
    Vehicle
    Device

### Relações

Um utilizador pode possuir vários veículos:

    User 1 ─────── N Vehicle

Um veículo pode estar associado a um dispositivo:

    Vehicle 1 ─────── 1 Device

A estrutura da base de dados encontra-se definida em:

    prisma/schema.prisma

As alterações estruturais da base de dados são controladas através das migrations do Prisma.

---

## Configuração do ambiente

Por motivos de segurança, as variáveis de ambiente não são incluídas diretamente no repositório.

O projeto utiliza um ficheiro:

    .env

que contém informações de configuração como:

    DATABASE_URL
    JWT_SECRET

O ficheiro `.env` está excluído do controlo de versões através do `.gitignore`.

Para configurar o projeto localmente, deve ser criado um ficheiro `.env` baseado no:

    .env.example

---

## Instalação

### 1. Clonar o repositório

    git clone https://github.com/monizalexandre658-crypto/sentrix-pap.git

### 2. Entrar na pasta do projeto

    cd sentrix-pap

### 3. Instalar as dependências

    npm install

### 4. Criar o ficheiro `.env`

Criar um ficheiro `.env` na raiz do projeto.

Adicionar as variáveis necessárias:

    DATABASE_URL=colocar_aqui_a_ligacao_da_base_de_dados
    JWT_SECRET=colocar_aqui_uma_chave_secreta

Os valores reais não devem ser publicados no GitHub.

---

## Base de dados

Depois de configurar o PostgreSQL e a variável `DATABASE_URL`, as migrations do projeto podem ser aplicadas através do Prisma:

    npx prisma migrate deploy

Caso seja necessário gerar novamente o cliente Prisma:

    npx prisma generate

---

## Executar o projeto

Para iniciar o servidor:

    npx tsx src/server.ts

Quando o servidor estiver em execução, a API fica disponível localmente em:

    http://localhost:3000

---

## Verificação do código

Antes de executar ou entregar uma versão do projeto, pode ser realizada a verificação do TypeScript através de:

    npx tsc --noEmit

Se não forem apresentados erros, a verificação de tipos foi concluída com sucesso.

---

## Testes da API

Durante o desenvolvimento, a API foi testada através de pedidos HTTP aos endpoints implementados.

Foram realizados testes relacionados com:

- Registo;
- Login;
- Autenticação através de JWT;
- Consulta do utilizador autenticado;
- Criação de veículos;
- Listagem de veículos;
- Consulta de um veículo;
- Atualização de veículos;
- Eliminação de veículos;
- Validação de veículos inexistentes;
- Validação da associação entre utilizador e veículo.

---

## Segurança

O projeto não disponibiliza publicamente informações sensíveis.

O ficheiro `.env` é excluído do Git através do `.gitignore`.

As palavras-passe dos utilizadores não são armazenadas diretamente como texto simples, sendo utilizado um mecanismo de hash através do bcrypt.

A autenticação da API utiliza tokens JWT.

---

## Estado atual

O backend encontra-se em desenvolvimento no âmbito da PAP.

As funcionalidades de autenticação e gestão de veículos encontram-se implementadas e testadas.

Funcionalidades relacionadas com o dispositivo físico, localização GPS em tempo real, comunicação com o ESP32 e restantes componentes do sistema SentriX serão integradas progressivamente.

---

## Próximas etapas

Entre as próximas fases de desenvolvimento encontram-se:

- Integração com o dispositivo ESP32;
- Recolha de localização GPS;
- Comunicação entre o dispositivo e o backend;
- Endpoint para localização do veículo;
- Atualização da localização em tempo real;
- Integração com a aplicação do utilizador;
- Sistema de alertas;
- Funcionalidades de segurança e deteção de situações de furto;
- Integração das restantes componentes do sistema SentriX.

---

## Projeto PAP

**Projeto:** SentriX

**Tipo:** Prova de Aptidão Profissional (PAP)

**Área:** Gestão e Programação de Equipamentos Informáticos

**Repositório GitHub:**

https://github.com/monizalexandre658-crypto/sentrix-pap