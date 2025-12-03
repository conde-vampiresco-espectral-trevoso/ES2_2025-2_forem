# Testes do Service Credits::Buy

## Arquivo de Teste

`spec/services/credits/buy_spec.rb`

## Arquivo Testado

`app/services/credits/buy.rb`

## Cobertura Anterior

0%

## Descrição

Este arquivo de teste foi criado para cobrir o service `Credits::Buy`, responsável por processar a compra de itens utilizando créditos do usuário.

O service verifica se o comprador possui créditos suficientes e, em caso positivo, marca os créditos como gastos e os associa à compra.

## Lógica do Service

```ruby
module Credits
  class Buy
    def self.call(purchaser:, purchase:, cost:)
      return false unless purchaser.enough_credits?(cost)

      purchaser.credits.unspent.limit(cost).update_all(
        spent: true,
        spent_at: Time.current,
        purchase_type: purchase.class.name,
        purchase_id: purchase.id,
      )
      purchaser.save

      true
    end
  end
end
```

## Casos de Teste Implementados

### 1. Comprador com créditos suficientes

- **Teste**: Retorna true

  - Verifica que a operação é bem-sucedida

- **Teste**: Marca créditos como gastos

  - Verifica que a quantidade correta de créditos é marcada como `spent`
  - Verifica que os créditos restantes permanecem `unspent`

- **Teste**: Define o timestamp spent_at

  - Verifica que o campo `spent_at` é preenchido

- **Teste**: Associa a compra aos créditos

  - Verifica `purchase_type` (nome da classe do item comprado)
  - Verifica `purchase_id` (ID do item comprado)

- **Teste**: Gasta exatamente a quantidade de créditos do custo
  - Com 10 créditos e custo 7, verifica 7 gastos e 3 restantes

### 2. Comprador sem créditos suficientes

- **Teste**: Retorna false

  - Verifica que a operação falha quando não há créditos suficientes

- **Teste**: Não marca nenhum crédito como gasto
  - Verifica que todos os créditos permanecem `unspent`

### 3. Comprador sem nenhum crédito

- **Teste**: Retorna false
  - Usuário sem créditos não pode fazer compras

### 4. Custo zero

- **Teste**: Retorna true e não gasta créditos
  - Compras gratuitas são permitidas
  - Nenhum crédito é marcado como gasto

### 5. Créditos exatos

- **Teste**: Retorna true e gasta todos os créditos
  - Com 10 créditos e custo 10, todos são gastos

### 6. Organização como compradora

- **Teste**: Funciona com organização como purchaser
  - Organizações também podem usar o service
  - Verifica que os créditos da organização são gastos

## Setup do Teste

```ruby
let(:user) { create(:user) }
let(:article) { create(:article, user: user) }

before do
  Credit.add_to(user, 10)
end
```

## Execução

```bash
bundle exec rspec spec/services/credits/buy_spec.rb --format documentation
```

## Resultado Esperado

```
Credits::Buy
  .call
    when purchaser has enough credits
      returns true
      marks credits as spent
      sets the spent_at timestamp
      associates the purchase with the credits
      spends exactly the cost amount of credits
    when purchaser does not have enough credits
      returns false
      does not mark any credits as spent
    when purchaser has no credits
      returns false
    when cost is zero
      returns true and does not spend any credits
    when purchaser has exact amount of credits needed
      returns true and spends all credits
    with organization as purchaser
      works with organization purchaser

11 examples, 0 failures
```

## Observações

- O service é idempotente - não altera estado se a operação falhar
- Suporta tanto `User` quanto `Organization` como compradores
- Utiliza `update_all` para eficiência em operações em lote
- Os créditos são gastos na ordem de criação (FIFO) devido ao `limit(cost)`
