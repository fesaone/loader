// loader.js
(function() {
  let activeRequests = 0;
  let isOffline = false;
  const loaderElement = document.createElement('div');
  loaderElement.className = 'loader-overlay';
  loaderElement.innerHTML = `
    <div class="loader-content">
      <div class="loader-spinner"></div>
      <p class="loader-text">Loading...</p>
    </div>
  `;
  document.body.appendChild(loaderElement);
  const loaderTextElement = loaderElement.querySelector('.loader-text');
  function updateLoader() {
    if (isOffline) {
      loaderTextElement.textContent = 'Connection Lost...';
      loaderElement.classList.add('active');
    } else if (activeRequests > 0) {
      loaderTextElement.textContent = 'Loading...';
      loaderElement.classList.add('active');
    } else {
      loaderElement.classList.remove('active');
    }
  }
  function startLoading() {
    activeRequests++;
    updateLoader();
  }
  function stopLoading() {
    activeRequests = Math.max(0, activeRequests - 1);
    updateLoader();
  }
  startLoading();
  window.addEventListener('load', () => {
    stopLoading();
  });
  const originalFetch = window.fetch;
  window.fetch = async (...args) => {
    startLoading();
    try {
      const response = await originalFetch(...args);
      return response;
    } catch (error) {
      throw error;
    } finally {
      stopLoading();
    }
  };
  window.addEventListener('online', () => {
    isOffline = false;
    updateLoader();
  });
  window.addEventListener('offline', () => {
    isOffline = true;
    updateLoader();
  });
})();
