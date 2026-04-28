'use client';

import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // No mostrar si ja està instal·lada com a PWA
    if (window.matchMedia('(display-mode: standalone)').matches) return;

    // No mostrar si l'usuari ja ho ha vist
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) return;

    // Detectar iOS
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    setIsIOS(ios);

    // Mostrar banner sempre (per iOS i per Android sense event)
    setShowBanner(true);

    // Capturar event de Chrome Android si disponible
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      // Chrome Android: instal·lació directa
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowBanner(false);
        localStorage.setItem('pwa-install-dismissed', 'true');
      }
      setDeferredPrompt(null);
    }
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
      background: 'linear-gradient(135deg, #1d4ed8, #4f46e5)',
      boxShadow: '0 -4px 24px rgba(0,0,0,0.25)',
      borderRadius: '16px 16px 0 0',
      padding: '16px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
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
          {deferredPrompt && (
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
          )}
        </div>
      </div>

      {/* Instruccions manuals si no hi ha event (iOS o Chrome sense event) */}
      {!deferredPrompt && (
        <div style={{
          marginTop: 12,
          padding: '10px 12px',
          background: 'rgba(255,255,255,0.15)',
          borderRadius: 10,
          color: 'white',
          fontSize: 13,
        }}>
          {isIOS ? (
            <p style={{ margin: 0 }}>
              Toca <strong>Compartir</strong> (⬆️) i després <strong>&quot;Afegir a la pantalla d&apos;inici&quot;</strong>
            </p>
          ) : (
            <p style={{ margin: 0 }}>
              Toca els <strong>tres puntets</strong> (⋮) i després <strong>&quot;Afegir a la pantalla d&apos;inici&quot;</strong>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
