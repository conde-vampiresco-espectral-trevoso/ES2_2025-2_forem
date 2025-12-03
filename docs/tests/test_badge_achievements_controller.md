# Testes do Badge Achievements Controller

## Arquivo de Teste

`spec/requests/api/v0/badge_achievements_spec.rb`

## Arquivo Testado

`app/controllers/api/v0/badge_achievements_controller.rb`

## Cobertura Anterior

0%

## Descrição

Este arquivo de teste foi criado para cobrir o controller `Api::V0::BadgeAchievementsController`, que gerencia as conquistas de badges dos usuários através da API v0.

O controller utiliza o concern `Api::BadgeAchievementsController` que implementa as ações CRUD para badges achievements.

## Casos de Teste Implementados

### 1. GET /api/badge_achievements (Index)

#### Contexto: Usuário admin com API key

- **Teste**: Retorna lista de badge achievements

  - Verifica status HTTP 200
  - Verifica que a resposta é um Array

- **Teste**: Retorna badge achievements ordenados por created_at desc
  - Cria achievement mais antigo
  - Verifica que o mais recente vem primeiro

#### Contexto: Usuário não-admin

- **Teste**: Retorna unauthorized (401)
  - Usuário comum não pode acessar o endpoint

#### Contexto: Sem autenticação

- **Teste**: Retorna unauthorized (401)
  - Requisição sem API key é rejeitada

### 2. GET /api/badge_achievements/:id (Show)

#### Contexto: Usuário admin com API key

- **Teste**: Retorna o badge achievement específico

  - Verifica status HTTP 200
  - Verifica que o ID corresponde ao solicitado

- **Teste**: Retorna 404 para badge achievement inexistente
  - Tenta buscar ID que não existe
  - Verifica status HTTP 404

### 3. POST /api/badge_achievements (Create)

#### Contexto: Usuário admin com API key

- **Teste**: Cria um novo badge achievement

  - Verifica que o count aumenta em 1
  - Verifica status HTTP 201 (Created)

- **Teste**: Retorna erros para parâmetros inválidos
  - Envia user_id e badge_id como nil
  - Verifica status HTTP 422 (Unprocessable Entity)
  - Verifica que a resposta contém chave "errors"

### 4. DELETE /api/badge_achievements/:id (Destroy)

#### Contexto: Usuário admin com API key

- **Teste**: Deleta o badge achievement
  - Verifica que o count diminui em 1
  - Verifica status HTTP 204 (No Content)

## Factories Utilizadas

```ruby
let!(:admin) { create(:user, :admin) }
let!(:user) { create(:user) }
let!(:badge) { create(:badge) }
let!(:badge_achievement) { create(:badge_achievement, user: user, badge: badge) }
let!(:api_secret) { create(:api_secret, user: admin) }
```

## Execução

```bash
bundle exec rspec spec/requests/api/v0/badge_achievements_spec.rb --format documentation
```

## Resultado Esperado

```
Api::V0::BadgeAchievementsController
  GET /api/badge_achievements
    when user is an admin with API key
      returns a list of badge achievements
      returns badge achievements ordered by created_at desc
    when user is not an admin
      returns unauthorized
    when no authentication provided
      returns unauthorized
  GET /api/badge_achievements/:id
    when user is an admin with API key
      returns the badge achievement
      returns 404 for non-existent badge achievement
  POST /api/badge_achievements
    when user is an admin with API key
      creates a new badge achievement
      returns errors for invalid params
  DELETE /api/badge_achievements/:id
    when user is an admin with API key
      deletes the badge achievement

9 examples, 0 failures
```

## Observações

- O endpoint requer autenticação via API key
- Apenas administradores têm acesso (verificado pelo `require_admin`)
- O controller segue o padrão RESTful da API v0 do Forem
