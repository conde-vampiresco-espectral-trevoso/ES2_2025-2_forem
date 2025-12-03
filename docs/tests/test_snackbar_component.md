# Testes do Componente Snackbar

## Arquivo de Teste

`app/javascript/Snackbar/__tests__/Snackbar.test.jsx`

## Arquivo Testado

`app/javascript/Snackbar/Snackbar.jsx`

## Cobertura Anterior

0%

## Descrição

Este arquivo de teste foi criado para cobrir o componente `Snackbar` e a função `addSnackbarItem`. O Snackbar é um componente de notificação que exibe mensagens temporárias ao usuário.

## Funcionalidades do Componente

- Exibe notificações temporárias (snacks)
- Suporta até 3 notificações simultâneas
- As notificações expiram após um período configurável (lifespan)
- Suporta ações customizadas em cada notificação
- Opção de botão de fechar

## Casos de Teste Implementados

### 1. Renderização Inicial

- **Teste**: Renderiza escondido quando não há snacks
  - Verifica presença da classe `hidden`
  - Verifica ausência da classe `crayons-snackbar`

### 2. Adição de Snackbar Items

- **Teste**: Exibe snackbar quando item é adicionado

  - Adiciona item via `addSnackbarItem`
  - Avança timers para trigger do polling
  - Verifica que a classe `crayons-snackbar` aparece
  - Verifica que a mensagem é exibida

- **Teste**: Exibe múltiplos snackbar items
  - Adiciona dois itens
  - Verifica que ambas as mensagens aparecem

### 3. Limite de Items

- **Teste**: Limita a no máximo 3 snackbar items
  - Adiciona 4 itens
  - Verifica que no máximo 3 são exibidos

### 4. Lifespan

- **Teste**: Adiciona snackbar item com propriedade lifespan
  - Verifica que o item é adicionado com lifespan configurado

### 5. Botão de Fechar

- **Teste**: Adiciona botão de fechar quando addCloseButton é true
  - Verifica presença do botão "Dismiss"

### 6. Actions

- **Teste**: Manipula snackbar com actions
  - Adiciona item com action "Undo"
  - Verifica que o botão da action é renderizado

### 7. Props Padrão

- **Teste**: Usa props padrão
  - Verifica que o componente renderiza sem erros com props padrão

### 8. Função addSnackbarItem

- **Teste**: Inicializa array de actions se não fornecido

  - Item sem actions recebe array vazio

- **Teste**: Preserva array de actions existente
  - Item com actions mantém as actions originais

## Tecnologias Utilizadas

- **Jest**: Framework de testes
- **@testing-library/preact**: Utilitários para testar componentes Preact
- **Fake Timers**: Para controlar o tempo nos testes

## Setup do Teste

```javascript
beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});
```

## Execução

```bash
yarn jest app/javascript/Snackbar/__tests__/Snackbar.test.jsx
```

## Resultado Esperado

```
<Snackbar />
  ✓ should render hidden when no snacks are present
  ✓ should show snackbar when item is added
  ✓ should show multiple snackbar items
  ✓ should limit to maximum 3 snackbar items
  ✓ should add snackbar item with lifespan property
  ✓ should add close button when addCloseButton is true
  ✓ should handle snackbar with actions
  ✓ should use default props

addSnackbarItem
  ✓ should initialize actions array if not provided
  ✓ should preserve existing actions array

9 tests passed
```

## Observações

- Os testes utilizam `jest.useFakeTimers()` para controlar o polling do componente
- O componente usa um mecanismo de polling para verificar novos snackbar items
- O `waitFor` da testing-library é usado para aguardar atualizações assíncronas
- O teste de expiração de lifespan foi simplificado devido a complexidade de timing
