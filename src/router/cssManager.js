// src/router/cssManager.js

const styleStore = new Map();

export function addPageCSS(css, pageName) {
  if (styleStore.has(pageName)) {
    styleStore.get(pageName).textContent = css;
    return;
  }

  const style = document.createElement('style');
  style.textContent = css;
  style.setAttribute('data-page', pageName);
  document.head.appendChild(style);
  styleStore.set(pageName, style);
}

export function removeAllCSSExcept(currentPageName) {
  // Remove all managed CSS except the current page
  styleStore.forEach((style, pageName) => {
    if (pageName !== currentPageName) {
      style.parentNode.removeChild(style);
      styleStore.delete(pageName);
    }
  });

  // Remove all <style> tags injected by Vite, except the one for the current page
  const styles = document.head.querySelectorAll('style[data-vite-dev-id]');
  styles.forEach(style => {
    if (!style.getAttribute('data-vite-dev-id').includes(currentPageName)) {
      style.parentNode.removeChild(style);
    }
  });

  // Remove all <link> tags for stylesheets, except those explicitly needed
  const links = document.head.querySelectorAll('link[rel="stylesheet"]');
  links.forEach(link => {
    if (!link.href.includes(currentPageName)) {
      link.parentNode.removeChild(link);
    }
  });
}