# Testes do AdminModal (Admin)

## Arquivo de Teste

`app/javascript/admin/__tests__/adminModal.test.js`

## Arquivo Testado

`app/javascript/admin/adminModal.js`

## Cobertura Anterior

0%

## Descrição

Este arquivo de teste foi criado para cobrir a função `adminModal`, responsável por criar e exibir modais dinâmicos no painel de administração do Forem. Os modais são usados para confirmar ações, exibir detalhes ou solicitar informações adicionais.

## Função Testada

### adminModal

```javascript
export const adminModal = function ({
  title,
  body,
  leftBtnText,
  rightBtnText,
  leftBtnAction,
  rightBtnAction,
  leftBtnClasses,
  rightBtnClasses,
}) {
  // Cria e exibe um modal dinâmico com os parâmetros fornecidos
};
```

## Casos de Teste Implementados

### Criação do Modal

- **Teste**: Cria elemento modal no documento

  - Verifica que um elemento com id 'admin-modal' é criado no DOM
  - Usa `document.querySelector` para encontrar o modal

- **Teste**: Define título do modal corretamente

  - Verifica que o título 'Test Modal Title' aparece no modal
  - Usa `textContent` para verificar o conteúdo

- **Teste**: Define corpo do modal corretamente
  - Verifica que o conteúdo 'Test modal body content' aparece no modal
  - O corpo pode conter HTML ou texto simples

### Botões do Modal

- **Teste**: Cria botão esquerdo com texto correto

  - Verifica que botão com texto 'Cancel' existe
  - Usa seletor combinado para encontrar o botão específico

- **Teste**: Cria botão direito com texto correto

  - Verifica que botão com texto 'Confirm' existe
  - O botão direito geralmente é a ação principal

- **Teste**: Aplica classes CSS ao botão esquerdo

  - Verifica que classe 'crayons-btn--secondary' é aplicada
  - Classes permitem estilização customizada

- **Teste**: Aplica classes CSS ao botão direito
  - Verifica que classe 'crayons-btn--danger' é aplicada
  - Útil para destacar ações destrutivas

### Ações dos Botões

- **Teste**: Executa ação do botão esquerdo quando clicado

  - Cria callback mock com `jest.fn()`
  - Simula click no botão esquerdo
  - Verifica que callback foi chamado

- **Teste**: Executa ação do botão direito quando clicado
  - Cria callback mock com `jest.fn()`
  - Simula click no botão direito
  - Verifica que callback foi chamado

### Comportamento de Substituição

- **Teste**: Substitui modal existente ao criar novo
  - Cria dois modais consecutivos
  - Verifica que apenas um modal existe no DOM
  - Evita acúmulo de elementos no documento

## Estrutura do Teste

```javascript
import { adminModal } from '../adminModal';

describe('adminModal', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    const modal = document.getElementById('admin-modal');
    if (modal) modal.remove();
  });

  it('creates modal element', () => {
    adminModal({
      title: 'Test Title',
      body: 'Test body',
      // ... outros parâmetros
    });
    expect(document.querySelector('#admin-modal')).not.toBeNull();
  });
});
```

## Parâmetros Testados

| Parâmetro         | Descrição                           | Exemplo                  |
| ----------------- | ----------------------------------- | ------------------------ |
| `title`           | Título exibido no cabeçalho         | 'Confirmar Ação'         |
| `body`            | Conteúdo principal do modal         | 'Deseja continuar?'      |
| `leftBtnText`     | Texto do botão esquerdo             | 'Cancelar'               |
| `rightBtnText`    | Texto do botão direito              | 'Confirmar'              |
| `leftBtnAction`   | Função executada ao clicar esquerdo | `() => closeModal()`     |
| `rightBtnAction`  | Função executada ao clicar direito  | `() => submitForm()`     |
| `leftBtnClasses`  | Classes CSS do botão esquerdo       | 'crayons-btn--secondary' |
| `rightBtnClasses` | Classes CSS do botão direito        | 'crayons-btn--danger'    |

## Execução

```bash
yarn jest app/javascript/admin/__tests__/adminModal.test.js
```

## Resultado Esperado

```
adminModal
  ✓ creates a modal element in the document
  ✓ sets the modal title correctly
  ✓ sets the modal body correctly
  ✓ creates left button with correct text
  ✓ creates right button with correct text
  ✓ applies left button classes
  ✓ applies right button classes
  ✓ calls left button action when clicked
  ✓ calls right button action when clicked
  ✓ replaces existing modal when creating a new one

10 tests passed
```

## Casos de Uso Comuns

### Confirmação de Exclusão

```javascript
adminModal({
  title: 'Confirmar Exclusão',
  body: 'Esta ação não pode ser desfeita.',
  leftBtnText: 'Cancelar',
  rightBtnText: 'Excluir',
  leftBtnAction: closeModal,
  rightBtnAction: deleteItem,
  leftBtnClasses: 'crayons-btn--secondary',
  rightBtnClasses: 'crayons-btn--danger',
});
```

### Confirmação de Ação

```javascript
adminModal({
  title: 'Publicar Artigo',
  body: 'O artigo será visível publicamente.',
  leftBtnText: 'Cancelar',
  rightBtnText: 'Publicar',
  leftBtnAction: closeModal,
  rightBtnAction: publishArticle,
  leftBtnClasses: 'crayons-btn--secondary',
  rightBtnClasses: 'crayons-btn--primary',
});
```

## Importância

O `adminModal` é um componente essencial para:

1. **UX do Administrador**: Fornece feedback visual consistente
2. **Confirmação de Ações**: Previne ações acidentais destrutivas
3. **Flexibilidade**: Altamente configurável via parâmetros
4. **Reutilização**: Um único componente para múltiplos casos de uso

## Observações

- O modal é inserido diretamente no `document.body`
- Apenas um modal pode existir por vez (substituição automática)
- Os callbacks podem ser funções síncronas ou assíncronas
- O componente segue o design system "Crayons" do Forem
