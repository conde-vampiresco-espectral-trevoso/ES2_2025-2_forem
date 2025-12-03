import { displayErrorAlert, displaySnackbar } from '../messageUtilities';

describe('messageUtilities', () => {
  describe('displayErrorAlert', () => {
    it('dispatches error:generate custom event', () => {
      const eventHandler = jest.fn();
      document.addEventListener('error:generate', eventHandler);

      displayErrorAlert('Test error message');

      expect(eventHandler).toHaveBeenCalledTimes(1);
      expect(eventHandler.mock.calls[0][0].detail).toEqual({
        alertMsg: 'Test error message',
      });

      document.removeEventListener('error:generate', eventHandler);
    });

    it('returns true when event is dispatched successfully', () => {
      const result = displayErrorAlert('Test message');

      expect(result).toBe(true);
    });

    it('passes the alert message in the event detail', () => {
      let receivedDetail = null;
      const handler = (event) => {
        receivedDetail = event.detail;
      };
      document.addEventListener('error:generate', handler);

      displayErrorAlert('Specific error');

      expect(receivedDetail.alertMsg).toBe('Specific error');

      document.removeEventListener('error:generate', handler);
    });
  });

  describe('displaySnackbar', () => {
    it('dispatches snackbar:add custom event', () => {
      const eventHandler = jest.fn();
      document.addEventListener('snackbar:add', eventHandler);

      displaySnackbar('Test snackbar message');

      expect(eventHandler).toHaveBeenCalledTimes(1);
      expect(eventHandler.mock.calls[0][0].detail).toEqual({
        message: 'Test snackbar message',
      });

      document.removeEventListener('snackbar:add', eventHandler);
    });

    it('returns true when event is dispatched successfully', () => {
      const result = displaySnackbar('Test message');

      expect(result).toBe(true);
    });

    it('passes the message in the event detail', () => {
      let receivedDetail = null;
      const handler = (event) => {
        receivedDetail = event.detail;
      };
      document.addEventListener('snackbar:add', handler);

      displaySnackbar('Specific snackbar');

      expect(receivedDetail.message).toBe('Specific snackbar');

      document.removeEventListener('snackbar:add', handler);
    });
  });
});
