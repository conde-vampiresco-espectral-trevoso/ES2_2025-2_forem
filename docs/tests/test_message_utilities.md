# Testes das Utilitárias de Mensagem (Admin)

## Arquivo de Teste

`app/javascript/admin/__tests__/messageUtilities.test.js`

## Arquivo Testado

`app/javascript/admin/messageUtilities.js`

## Cobertura Anterior

0%

## Descrição

Este arquivo de teste foi criado para cobrir as funções utilitárias de mensagem usadas no painel de administração do Forem. Estas funções disparam eventos customizados para exibir alertas de erro e snackbars.

## Funções Testadas

### displayErrorAlert

```javascript
export const displayErrorAlert = function (alertMsg) {
  return document.dispatchEvent(
    new CustomEvent('error:generate', {
      detail: { alertMsg },
    }),
  );
};
```

### displaySnackbar

```javascript
export const displaySnackbar = function (message) {
  return document.dispatchEvent(
    new CustomEvent('snackbar:add', {
      detail: { message },
    }),
  );
};
```

## Casos de Teste Implementados

### displayErrorAlert

- **Teste**: Dispara evento customizado error:generate

  - Adiciona event listener para 'error:generate'
  - Chama `displayErrorAlert('Test error message')`
  - Verifica que o handler foi chamado uma vez
  - Verifica que o detail contém `alertMsg` correto

- **Teste**: Retorna true quando evento é disparado com sucesso

  - Verifica que a função retorna `true`

- **Teste**: Passa a mensagem de alerta no detail do evento
  - Captura o detail recebido
  - Verifica que `alertMsg` contém a mensagem específica

### displaySnackbar

- **Teste**: Dispara evento customizado snackbar:add

  - Adiciona event listener para 'snackbar:add'
  - Chama `displaySnackbar('Test snackbar message')`
  - Verifica que o handler foi chamado uma vez
  - Verifica que o detail contém `message` correto

- **Teste**: Retorna true quando evento é disparado com sucesso

  - Verifica que a função retorna `true`

- **Teste**: Passa a mensagem no detail do evento
  - Captura o detail recebido
  - Verifica que `message` contém a mensagem específica

## Padrão de Teste Utilizado

```javascript
it('dispatches custom event', () => {
  const eventHandler = jest.fn();
  document.addEventListener('event-name', eventHandler);

  functionToTest('message');

  expect(eventHandler).toHaveBeenCalledTimes(1);
  expect(eventHandler.mock.calls[0][0].detail).toEqual({
    key: 'message',
  });

  document.removeEventListener('event-name', eventHandler);
});
```

## Importância

Estas funções são fundamentais para o sistema de feedback do usuário no painel administrativo:

1. **displayErrorAlert**: Usado para exibir erros críticos que requerem atenção do administrador
2. **displaySnackbar**: Usado para feedback não-intrusivo de operações bem-sucedidas

## Execução

```bash
yarn jest app/javascript/admin/__tests__/messageUtilities.test.js
```

## Resultado Esperado

```
messageUtilities
  displayErrorAlert
    ✓ dispatches error:generate custom event
    ✓ returns true when event is dispatched successfully
    ✓ passes the alert message in the event detail

  displaySnackbar
    ✓ dispatches snackbar:add custom event
    ✓ returns true when event is dispatched successfully
    ✓ passes the message in the event detail

6 tests passed
```

## Observações

- Os testes removem os event listeners após cada teste para evitar vazamento de memória
- O `document.dispatchEvent` retorna `true` quando o evento é despachado com sucesso
- Estes eventos são capturados por outros componentes que renderizam o feedback visual
