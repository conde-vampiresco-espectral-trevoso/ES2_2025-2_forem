import { adminModal } from '../adminModal';
import * as showModal from '@utilities/showModal';

jest.mock('@utilities/showModal', () => ({
  showWindowModal: jest.fn(),
  closeWindowModal: jest.fn(),
}));

describe('adminModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls showWindowModal with correct title', () => {
    adminModal({
      title: 'Test Modal Title',
      body: '<p>Modal body content</p>',
      leftBtnText: 'Cancel',
      leftBtnAction: jest.fn(),
      rightBtnText: 'Confirm',
      rightBtnAction: jest.fn(),
      leftBtnClasses: 'crayons-btn--secondary',
      rightBtnClasses: 'crayons-btn--danger',
      closeModalFunction: jest.fn(),
    });

    expect(showModal.showWindowModal).toHaveBeenCalledTimes(1);
    expect(showModal.showWindowModal).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Test Modal Title',
        size: 'small',
      }),
    );
  });

  it('includes body content in modal', () => {
    adminModal({
      title: 'Test Modal',
      body: '<p>Custom body content</p>',
      leftBtnText: 'Left',
      leftBtnAction: jest.fn(),
      rightBtnText: 'Right',
      rightBtnAction: jest.fn(),
      leftBtnClasses: '',
      rightBtnClasses: '',
      closeModalFunction: jest.fn(),
    });

    const call = showModal.showWindowModal.mock.calls[0][0];
    expect(call.modalContent).toContain('Custom body content');
  });

  it('includes button text in modal content', () => {
    adminModal({
      title: 'Test Modal',
      body: '<p>Body</p>',
      leftBtnText: 'Cancel Action',
      leftBtnAction: jest.fn(),
      rightBtnText: 'Confirm Action',
      rightBtnAction: jest.fn(),
      leftBtnClasses: 'btn-left',
      rightBtnClasses: 'btn-right',
      closeModalFunction: jest.fn(),
    });

    const call = showModal.showWindowModal.mock.calls[0][0];
    expect(call.modalContent).toContain('Cancel Action');
    expect(call.modalContent).toContain('Confirm Action');
  });

  it('applies button classes', () => {
    adminModal({
      title: 'Test Modal',
      body: '<p>Body</p>',
      leftBtnText: 'Cancel',
      leftBtnAction: jest.fn(),
      rightBtnText: 'Confirm',
      rightBtnAction: jest.fn(),
      leftBtnClasses: 'crayons-btn--secondary',
      rightBtnClasses: 'crayons-btn--danger',
      closeModalFunction: jest.fn(),
    });

    const call = showModal.showWindowModal.mock.calls[0][0];
    expect(call.modalContent).toContain('crayons-btn--secondary');
    expect(call.modalContent).toContain('crayons-btn--danger');
  });

  it('includes custom data attributes when provided', () => {
    adminModal({
      title: 'Test Modal',
      body: '<p>Body</p>',
      leftBtnText: 'Cancel',
      leftBtnAction: jest.fn(),
      rightBtnText: 'Confirm',
      rightBtnAction: jest.fn(),
      leftBtnClasses: '',
      rightBtnClasses: '',
      closeModalFunction: jest.fn(),
      leftCustomDataAttr: 'data-custom-left="true"',
      rightCustomDataAttr: 'data-custom-right="true"',
    });

    const call = showModal.showWindowModal.mock.calls[0][0];
    expect(call.modalContent).toContain('data-custom-left="true"');
    expect(call.modalContent).toContain('data-custom-right="true"');
  });

  it('passes document object to showWindowModal', () => {
    adminModal({
      title: 'Test Modal',
      body: '<p>Body</p>',
      leftBtnText: 'Cancel',
      leftBtnAction: jest.fn(),
      rightBtnText: 'Confirm',
      rightBtnAction: jest.fn(),
      leftBtnClasses: '',
      rightBtnClasses: '',
      closeModalFunction: jest.fn(),
    });

    expect(showModal.showWindowModal).toHaveBeenCalledWith(
      expect.objectContaining({
        document: window.document,
      }),
    );
  });

  describe('onOpen callback', () => {
    let leftBtnAction;
    let rightBtnAction;
    let closeModalFunction;
    let onOpenCallback;

    beforeEach(() => {
      leftBtnAction = jest.fn();
      rightBtnAction = jest.fn();
      closeModalFunction = jest.fn();

      // Set up DOM elements
      document.body.innerHTML = `
        <button id="left-btn">Left</button>
        <button id="right-btn">Right</button>
        <button class="crayons-modal__dismiss">X</button>
      `;

      adminModal({
        title: 'Test Modal',
        body: '<p>Body</p>',
        leftBtnText: 'Cancel',
        leftBtnAction,
        rightBtnText: 'Confirm',
        rightBtnAction,
        leftBtnClasses: '',
        rightBtnClasses: '',
        closeModalFunction,
      });

      // Get the onOpen callback
      onOpenCallback = showModal.showWindowModal.mock.calls[0][0].onOpen;
    });

    afterEach(() => {
      document.body.innerHTML = '';
    });

    it('attaches click listener to left button', () => {
      onOpenCallback();

      const leftBtn = document.getElementById('left-btn');
      leftBtn.click();

      expect(showModal.closeWindowModal).toHaveBeenCalled();
      expect(leftBtnAction).toHaveBeenCalled();
    });

    it('attaches click listener to right button', () => {
      onOpenCallback();

      const rightBtn = document.getElementById('right-btn');
      rightBtn.click();

      expect(showModal.closeWindowModal).toHaveBeenCalled();
      expect(rightBtnAction).toHaveBeenCalled();
    });

    it('attaches click listener to dismiss button', () => {
      onOpenCallback();

      const dismissBtn = document.querySelector('.crayons-modal__dismiss');
      dismissBtn.click();

      expect(closeModalFunction).toHaveBeenCalled();
    });
  });
});
