import { render, waitFor } from '@testing-library/preact';
import { Snackbar, addSnackbarItem } from '../Snackbar';

describe('<Snackbar />', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should render hidden when no snacks are present', () => {
    const { container } = render(<Snackbar />);

    expect(container.querySelector('.hidden')).toBeTruthy();
    expect(container.querySelector('.crayons-snackbar')).toBeFalsy();
  });

  it('should show snackbar when item is added', async () => {
    const { container } = render(<Snackbar pollingTime={100} lifespan={5} />);

    addSnackbarItem({ message: 'Test message' });

    // Advance timers to trigger polling
    jest.advanceTimersByTime(150);

    await waitFor(() => {
      expect(container.querySelector('.crayons-snackbar')).toBeTruthy();
      expect(container.textContent).toContain('Test message');
    });
  });

  it('should show multiple snackbar items', async () => {
    const { container } = render(<Snackbar pollingTime={100} lifespan={5} />);

    addSnackbarItem({ message: 'First message' });
    addSnackbarItem({ message: 'Second message' });

    jest.advanceTimersByTime(150);

    await waitFor(() => {
      expect(container.textContent).toContain('First message');
      expect(container.textContent).toContain('Second message');
    });
  });

  it('should limit to maximum 3 snackbar items', async () => {
    const { container } = render(<Snackbar pollingTime={100} lifespan={5} />);

    addSnackbarItem({ message: 'Message 1' });
    addSnackbarItem({ message: 'Message 2' });
    addSnackbarItem({ message: 'Message 3' });
    addSnackbarItem({ message: 'Message 4' });

    jest.advanceTimersByTime(150);

    await waitFor(() => {
      const items = container.querySelectorAll('[role="alert"]');
      expect(items.length).toBeLessThanOrEqual(3);
    });
  });

  it('should add snackbar item with lifespan property', async () => {
    const { container } = render(<Snackbar pollingTime={100} lifespan={5} />);

    addSnackbarItem({ message: 'Message with lifespan' });

    jest.advanceTimersByTime(150);

    await waitFor(() => {
      expect(container.textContent).toContain('Message with lifespan');
    });
  });

  it('should add close button when addCloseButton is true', async () => {
    const { getByText } = render(<Snackbar pollingTime={100} lifespan={5} />);

    addSnackbarItem({ message: 'Closeable message', addCloseButton: true });

    jest.advanceTimersByTime(150);

    await waitFor(() => {
      expect(getByText('Dismiss')).toBeTruthy();
    });
  });

  it('should handle snackbar with actions', async () => {
    const handler = jest.fn();
    const { getByText } = render(<Snackbar pollingTime={100} lifespan={5} />);

    addSnackbarItem({
      message: 'Action message',
      actions: [{ text: 'Undo', handler }],
    });

    jest.advanceTimersByTime(150);

    await waitFor(() => {
      const undoButton = getByText('Undo');
      expect(undoButton).toBeTruthy();
    });
  });

  it('should use default props', () => {
    const { container } = render(<Snackbar />);

    // Just verify component renders without errors
    expect(container).toBeTruthy();
  });
});

describe('addSnackbarItem', () => {
  it('should initialize actions array if not provided', () => {
    const item = { message: 'Test' };
    addSnackbarItem(item);

    expect(item.actions).toEqual([]);
  });

  it('should preserve existing actions array', () => {
    const handler = jest.fn();
    const item = { message: 'Test', actions: [{ text: 'Action', handler }] };
    addSnackbarItem(item);

    expect(item.actions).toHaveLength(1);
    expect(item.actions[0].text).toBe('Action');
  });
});
