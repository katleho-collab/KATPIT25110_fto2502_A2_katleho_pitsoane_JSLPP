/**
 * @module Sidebar
 * @description Manages the sidebar toggle and theme switching in the Kanban app.
 */

/**
 * Updates the logo based on the current theme.
 * @function
 * @param {HTMLElement} logo - The logo image element.
 */
export function updateLogo(logo) {
  const isDarkMode = document.body.classList.contains('dark-mode');
  logo.src = isDarkMode ? './assets/logo-dark.svg' : './assets/logo-light.svg';
}

/**
 * Toggles between light and dark mode.
 * @function
 * @param {Event} event - The change event from the theme toggle.
 * @param {HTMLElement} logo - The logo image element.
 */
export function toggleTheme(event, logo) {
  if (event.target.checked) {
    document.body.classList.add('dark-mode');
    localStorage.setItem('theme', 'dark');
  } else {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('theme', 'light');
  }
  updateLogo(logo);
}

/**
 * Toggles the sidebar visibility.
 * @function
 * @param {HTMLElement} sidebar - The sidebar element.
 * @param {HTMLElement} layout - The main layout element.
 * @param {HTMLElement} hideSidebarBtn - The button to hide the sidebar.
 * @param {HTMLElement} showSidebarBtn - The button to show the sidebar.
 * @param {HTMLElement} closeSidebarMobileBtn - The mobile close button.
 */
export function toggleSidebar(sidebar, layout, hideSidebarBtn, showSidebarBtn, closeSidebarMobileBtn) {
  sidebar.classList.toggle('hide-sidebar-active');
  layout.classList.toggle('hide-sidebar-active');
  const isHidden = sidebar.classList.contains('hide-sidebar-active');

  hideSidebarBtn.style.display = isHidden ? 'none' : 'flex';
  showSidebarBtn.style.display = isHidden ? 'block' : 'none';
  if (closeSidebarMobileBtn) closeSidebarMobileBtn.style.display = isHidden ? 'none' : 'block';

  if (isHidden) {
    showSidebarBtn.style.display = 'block';
  } else {
    showSidebarBtn.style.display = 'none';
  }
}