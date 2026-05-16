(function () {
    if (document.getElementById('paris-chat-container')) return;

    const isMobile = window.innerWidth < 768;

    if (isMobile) {
        // MÒBIL: pantalla completa
        const iframe = document.createElement('iframe');
        iframe.id = 'paris-chat-container';
        iframe.src = 'https://app.autoescolaparis.com/chat-embed';
        iframe.style.cssText = `
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      border: none;
      z-index: 99999;
      background: white;
    `;
        document.body.appendChild(iframe);

    } else {
        // ORDINADOR: botó flotant + finestra
        let isOpen = false;

        // Botó flotant
        const btn = document.createElement('button');
        btn.id = 'paris-chat-btn';
        btn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="white">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
      </svg>
    `;
        btn.style.cssText = `
      position: fixed;
      bottom: 24px; right: 24px;
      width: 60px; height: 60px;
      border-radius: 50%;
      background: #1a3fdb;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 16px rgba(0,0,0,0.25);
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s;
    `;
        btn.onmouseenter = () => btn.style.transform = 'scale(1.1)';
        btn.onmouseleave = () => btn.style.transform = 'scale(1.0)';

        // Finestra flotant
        const container = document.createElement('div');
        container.id = 'paris-chat-container';
        container.style.cssText = `
      position: fixed;
      bottom: 96px; right: 24px;
      width: 380px; height: 580px;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.2);
      z-index: 99998;
      overflow: hidden;
      display: none;
      transition: opacity 0.2s;
    `;

        const iframe = document.createElement('iframe');
        iframe.src = 'https://app.autoescolaparis.com/chat-embed';
        iframe.style.cssText = `
      width: 100%; height: 100%;
      border: none;
    `;
        container.appendChild(iframe);

        btn.addEventListener('click', () => {
            isOpen = !isOpen;
            container.style.display = isOpen ? 'block' : 'none';
            btn.innerHTML = isOpen
                ? `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>`
                : `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>`;
        });

        document.body.appendChild(container);
        document.body.appendChild(btn);
    }
})();