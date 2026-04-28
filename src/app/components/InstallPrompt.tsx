'use client';

import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // No mostrar si ja està instal·lada
    if (window.matchMedia('(display-mode: standalone)').matches) return;

    // No mostrar si l'usuari ja ho ha vist
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (!showBanner) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 9999,
      padding: '16px',
      background: 'linear-gradient(135deg, #1d4ed8, #4f46e5)',
      boxShadow: '0 -4px 24px rgba(0,0,0,0.2)',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      borderRadius: '16px 16px 0 0',
    }}>
      {/* Logo */}
      <img
        src="/icons/icon-192x192.png"
        alt="Autoescola Paris"
        style={{ width: 52, height: 52, borderRadius: 12, flexShrink: 0 }}
      />

      {/* Text */}
      <div style={{ flex: 1, color: 'white' }}>
        <p style={{ margin: 0, fontWeight: 700, fontSize: 15 }}>
          Instal·la l&apos;app gratuïtament
        </p>
        <p style={{ margin: 0, fontSize: 12, opacity: 0.85 }}>
          Accés ràpid des de la pantalla d&apos;inici
        </p>
      </div>

      {/* Botons */}
      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        <button
          onClick={handleDismiss}
          style={{
            background: 'rgba(255,255,255,0.15)',
            border: 'none',
            color: 'white',
            padding: '8px 12px',
            borderRadius: 8,
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          Ara no
        </button>
        <button
          onClick={handleInstall}
          style={{
            background: 'white',
            border: 'none',
            color: '#1d4ed8',
            padding: '8px 16px',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Instal·lar
        </button>
      </div>
    </div>
  );
}
