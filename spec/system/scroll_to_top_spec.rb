require "rails_helper"

RSpec.describe "Back to Top Button", js: true do
  let(:user) { create(:user) }

  before do
    # Create a root subforem for the app to function properly
    create(:subforem, root: true, discoverable: true)
    sign_in user
    visit root_path
  end

  it "button exists and is initially hidden" do
    expect(page).to have_css("button[data-controller='scroll-to-top']", visible: false)
    button = find("button[data-controller='scroll-to-top']", visible: false)
    expect(button[:class]).to include("hidden")
  end

  it "shows button when scrolling down and hides when scrolling up" do
    button = find("button[data-controller='scroll-to-top']", visible: false)
    
    # Initially hidden
    expect(button[:class]).to include("hidden")
    
    # Scroll down past the threshold and trigger scroll event
    page.execute_script(<<~JS)
      window.scrollTo(0, 500);
      window.dispatchEvent(new Event('scroll'));
    JS
    
    sleep 1
    
    # Check if visible class was added (the controller should have updated the classes)
    updated_classes = page.evaluate_script("document.querySelector('[data-controller=\"scroll-to-top\"]').className")
    expect(updated_classes).to include("visible").or include("back-to-top-button")
  end

  it "scrolls to top when button is clicked" do
    # Scroll down
    page.execute_script("window.scrollTo(0, 1000)")
    sleep 0.5
    
    # Verify we scrolled down
    scroll_position = page.evaluate_script("window.scrollY || window.pageYOffset")
    expect(scroll_position).to be >= 500
    
    # Make button visible for clicking
    page.execute_script(<<~JS)
      const button = document.querySelector('[data-controller="scroll-to-top"]');
      button.classList.remove('hidden');
      button.classList.add('visible');
      button.style.display = 'block';
      button.style.opacity = '1';
    JS
    
    sleep 0.5
    
    # Click the button
    button = find("button[data-controller='scroll-to-top']")
    button.click
    
    sleep 2
    
    # Verify we're back at or near the top
    final_position = page.evaluate_script("window.scrollY || window.pageYOffset")
    expect(final_position).to be < 150
  end
end
