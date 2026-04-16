# WeFit Backend Challenge - API de Cadastro

API para cadastro de pessoas físicas e jurídicas com validação completa, CRUD, testes automatizados e deploy via Docker.

---

## 🚀 Como Rodar

```bash
git clone https://github.com/andrewermel/Desafio-Wefit.git
cd teste-backend
docker compose up
```

Pronto. A aplicação estará disponível em **http://localhost:3000**

> O Docker cuida de tudo: instala dependências, compila TypeScript, sobe o MySQL, cria as tabelas e inicia o servidor automaticamente.

### Desenvolvimento Local (sem Docker)

```bash
npm install
docker compose up mysqldb -d   # sobe apenas o MySQL
npm start                       # servidor em http://localhost:4568
```

---

## 📋 Endpoints

### `POST /cadastro` — Cadastrar pessoa (requisito do desafio)

```bash
curl -X POST http://localhost:3000/cadastro \
  -H "Content-Type: application/json" \
  -d '{
    "type": "fisica",
    "cpf": "111.444.777-35",
    "name": "João da Silva",
    "phone": "(11) 98765-4321",
    "email": "joao@example.com",
    "confirmEmail": "joao@example.com",
    "cep": "01310100",
    "street": "Avenida Paulista",
    "number": "1000",
    "city": "São Paulo",
    "neighborhood": "Bela Vista",
    "state": "SP",
    "acceptedTerms": true
  }'
```

**Resposta:** `201 Created`

```json
{ "id": 1, "message": "profile created successfully" }
```

Para pessoa jurídica, adicione `"type": "juridica"` e o campo `"cnpj"`.

### Endpoints CRUD (extras)

Além do `POST /cadastro` solicitado no desafio, implementei operações de leitura, atualização e exclusão. Não faz sentido criar um registro sem poder consultá-lo, editá-lo ou removê-lo — um CRUD completo reflete melhor um cenário real de produção.

| Método   | Rota            | Descrição          |
| -------- | --------------- | ------------------ |
| `GET`    | `/profiles`     | Listar todos       |
| `GET`    | `/profiles/:id` | Buscar por ID      |
| `PUT`    | `/profiles/:id` | Atualizar cadastro |
| `DELETE` | `/profiles/:id` | Remover cadastro   |

### `GET /ping` — Health check

```bash
curl http://localhost:3000/ping
# pong
```

---

## 🔒 Validações

| Campo                                      | Regra                                            |
| ------------------------------------------ | ------------------------------------------------ |
| `type`                                     | `"fisica"` ou `"juridica"` (obrigatório)         |
| `cpf`                                      | Validação com algoritmo de dígitos verificadores |
| `cnpj`                                     | Obrigatório se `type = "juridica"`, validado     |
| `name`                                     | Não vazio                                        |
| `email`                                    | Formato válido, único no banco                   |
| `confirmEmail`                             | Deve ser igual ao `email`                        |
| `phone`                                    | Não vazio, sanitizado                            |
| `cep`                                      | 8 dígitos                                        |
| `street`, `number`, `city`, `neighborhood` | Não vazios                                       |
| `state`                                    | 2 caracteres (ex: `"SP"`)                        |
| `acceptedTerms`                            | Deve ser `true`                                  |

### Respostas de erro

| Status | Código             | Exemplo                                   |
| ------ | ------------------ | ----------------------------------------- |
| `400`  | `VALIDATION_ERROR` | `{ "error": "invalid cpf" }`              |
| `404`  | `NOT_FOUND`        | `{ "error": "profile not found" }`        |
| `409`  | `CONFLICT`         | `{ "error": "email already registered" }` |
| `500`  | `INTERNAL_ERROR`   | `{ "error": "internal server error" }`    |

---

## 🧪 Testes

```bash
npm test                    # 131 testes unitários
npm run test:integration    # 14 testes E2E (requer MySQL)
npm run test:all            # todos os testes
npm run test:coverage       # relatório de cobertura
```

**Cobertura: 99.37%** — Validators, Services, Repositories, Controllers e Routes.

Todos os testes unitários usam mocks (sem dependência de banco). Os testes E2E rodam contra MySQL real com cleanup automático.

---

## 🏗️ Arquitetura

```
src/
├── validators/        # CPF, CNPJ, Email, CEP
├── utils/             # Sanitizer, ProfileSchema
├── repositories/      # Acesso a dados (MySQL)
├── services/          # Regras de negócio
├── controllers/       # Handlers HTTP
├── routes/            # Definição de rotas Express
├── middlewares/       # Error handler, CORS, JSON parser
└── database/          # Conexão MySQL + migrations automáticas
```

**Padrão:** Controller → Service → Repository (responsabilidades isoladas, testáveis independentemente).

---

## ⚙️ Configuração

As variáveis de ambiente já estão configuradas no `docker-compose.yml`. Para desenvolvimento local, copie o template:

```bash
cp .env.example .env
```

| Variável      | Padrão           | Descrição         |
| ------------- | ---------------- | ----------------- |
| `PORT`        | `4568`           | Porta do servidor |
| `DB_HOST`     | `localhost`      | Host do MySQL     |
| `DB_PORT`     | `3306`           | Porta do MySQL    |
| `DB_USER`     | `root`           | Usuário           |
| `DB_PASSWORD` | `senha_root_123` | Senha             |
| `DB_NAME`     | `wefit`          | Nome do banco     |

---

## 📦 Tecnologias

| Tecnologia | Uso                          |
| ---------- | ---------------------------- |
| Node.js 18 | Runtime                      |
| TypeScript | Tipagem estática             |
| Express    | Framework HTTP               |
| MySQL 5.6  | Banco de dados               |
| Jest       | Testes unitários e cobertura |
| Supertest  | Testes E2E                   |
| Docker     | Containerização              |

---

## 📺 CI/CD

[![Tests](https://github.com/andrewermel/Desafio-Wefit/actions/workflows/test.yml/badge.svg)](https://github.com/andrewermel/Desafio-Wefit/actions)

GitHub Actions roda automaticamente em cada push: testes unitários, E2E com MySQL e verificação de cobertura.
