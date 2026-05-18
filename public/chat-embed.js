(function () {
  if (document.getElementById('paris-chat-container')) return;

  const isMobile = window.innerWidth < 768;

  if (isMobile) {
    let isOpen = false;

    const btn = document.createElement('button');
    btn.id = 'paris-chat-btn';
    btn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="white" style="flex-shrink:0">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
      </svg>
      <span style="font-family:sans-serif; font-size:14px; font-weight:600; color:white; white-space:nowrap;">
        Parla amb París
      </span>
    `;
    btn.style.cssText = `
      position: fixed;
      bottom: 24px; right: 24px;
      height: 52px;
      padding: 0 20px;
      border-radius: 999px;
      background: #f97316;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 16px rgba(0,0,0,0.25);
      z-index: 99999;
      display: flex;
      align-items: center;
      gap: 10px;
    `;

    const container = document.createElement('div');
    container.id = 'paris-chat-container';
    container.style.cssText = `
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      z-index: 99998;
      display: none;
      background: white;
    `;

    const iframe = document.createElement('iframe');
    iframe.src = 'https://app.autoescolaparis.com/chat-embed';
    iframe.style.cssText = `width: 100%; height: 100%; border: none;`;
    container.appendChild(iframe);

    btn.addEventListener('click', () => {
      isOpen = !isOpen;
      container.style.display = isOpen ? 'block' : 'none';

      if (isOpen) {
        btn.style.top = 'auto';
        btn.style.bottom = '80px';
        btn.style.right = '12px';
        btn.style.height = '40px';
        btn.style.padding = '0 14px';
        btn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white" style="flex-shrink:0"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
    <span style="font-family:sans-serif; font-size:13px; font-weight:600; color:white;">Tancar</span>`;
      } else {
        btn.style.top = 'auto';
        btn.style.bottom = '24px';
        btn.style.right = '24px';
        btn.style.height = '52px';
        btn.style.padding = '0 20px';
        btn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="white" style="flex-shrink:0"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
          <span style="font-family:sans-serif; font-size:14px; font-weight:600; color:white; white-space:nowrap;">Parla amb París</span>`;
      }
    });

    document.body.appendChild(container);
    document.body.appendChild(btn);

  } else {
    let isOpen = false;

    const btn = document.createElement('button');
    btn.id = 'paris-chat-btn';
    btn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="white" style="flex-shrink:0">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
      </svg>
      <span style="font-family:sans-serif; font-size:14px; font-weight:600; color:white; white-space:nowrap;">
        Parla amb París
      </span>
    `;
    btn.style.cssText = `
      position: fixed;
      bottom: 24px; right: 24px;
      height: 52px;
      padding: 0 20px;
      border-radius: 999px;
      background: #f97316;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 16px rgba(0,0,0,0.25);
      z-index: 99999;
      display: flex;
      align-items: center;
      gap: 10px;
      transition: background 0.2s;
    `;
    btn.onmouseenter = () => btn.style.background = '#ea6c0a';
    btn.onmouseleave = () => btn.style.background = '#f97316';

    const container = document.createElement('div');
    container.id = 'paris-chat-container';
    container.style.cssText = `
      position: fixed;
      bottom: 88px; right: 24px;
      width: 380px; height: 580px;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.2);
      z-index: 99998;
      overflow: hidden;
      display: none;
    `;

    const iframe = document.createElement('iframe');
    iframe.src = 'https://app.autoescolaparis.com/chat-embed';
    iframe.style.cssText = `width: 100%; height: 100%; border: none;`;
    container.appendChild(iframe);

    btn.addEventListener('click', () => {
      isOpen = !isOpen;
      container.style.display = isOpen ? 'block' : 'none';
      btn.innerHTML = isOpen
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="white" style="flex-shrink:0"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
           <span style="font-family:sans-serif; font-size:14px; font-weight:600; color:white;">Tancar</span>`
        : `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="white" style="flex-shrink:0"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
           <span style="font-family:sans-serif; font-size:14px; font-weight:600; color:white; white-space:nowrap;">Parla amb París</span>`;
    });

    document.body.appendChild(container);
    document.body.appendChild(btn);
  }
})();