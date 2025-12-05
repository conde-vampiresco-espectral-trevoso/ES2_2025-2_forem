import { Controller } from '@hotwired/stimulus';

/**
 * Manages the "Back to Top" button functionality.
 * Shows/hides the button based on scroll position and provides smooth scrolling.
 */
export class ScrollToTopController extends Controller {
  static values = {
    threshold: { type: Number, default: 300 }
  };

  /**
   * Initialize the controller when it connects to the DOM.
   */
  connect() {
    this.toggle();
  }

  /**
   * Toggle button visibility based on scroll position.
   * Shows button when user scrolls past the threshold (default 300px).
   */
  toggle() {
    const scrollPosition = window.scrollY || window.pageYOffset;
    
    if (scrollPosition > this.thresholdValue) {
      this.element.classList.remove('hidden');
      this.element.classList.add('visible');
    } else {
      this.element.classList.remove('visible');
      this.element.classList.add('hidden');
    }
  }

  /**
   * Scroll smoothly to the top of the page.
   */
  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}

/**
 * Default export for compatibility with Stimulus controller loading.
 */
export default ScrollToTopController;
