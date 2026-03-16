// ============================================
// SERVICE WORKER - APP DE SERVIÇO PWA
// ============================================

const CACHE_NAME = 'app-servico-v1';
const urlsToCache = [
  '/appservico/',
  '/appservico/index.html',
  '/appservico/painel_plataforma.html',
  '/appservico/painel_servicos.html',
  '/appservico/os_cliente.html',
  '/appservico/firebase-config.js',
  '/appservico/manifest.json',
  'https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js',
  'https://www.gstatic.com/firebasejs/9.22.0/firebase-storage-compat.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Instalação do Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Interceptar requisições
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - retorna resposta do cache
        if (response) {
          return response;
        }

        // Clone da requisição
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(response => {
          // Verifica se recebeu resposta válida
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone da resposta
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
  );
});

// Ativação e limpeza de caches antigos
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Sincronização em segundo plano (para quando estiver offline)
self.addEventListener('sync', event => {
  if (event.tag === 'sync-OS') {
    event.waitUntil(sincronizarOSOffline());
  }
});

// Função para sincronizar OS criadas offline
async function sincronizarOSOffline() {
  try {
    const cache = await caches.open('offline-os');
    const keys = await cache.keys();
    
    for (const request of keys) {
      const response = await cache.match(request);
      const osData = await response.json();
      
      // Enviar para o Firebase
      const fetchResponse = await fetch('/api/criar-os', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(osData)
      });
      
      if (fetchResponse.ok) {
        await cache.delete(request);
      }
    }
  } catch (error) {
    console.error('Erro na sincronização:', error);
  }
}

// Notificações push
self.addEventListener('push', event => {
  const options = {
    body: event.data.text(),
    icon: '/appservico/assets/icon-192x192.png',
    badge: '/appservico/assets/icon-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'abrir',
        title: 'Abrir'
      },
      {
        action: 'fechar',
        title: 'Fechar'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('APP de Serviço', options)
  );
});

// Clique na notificação
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'abrir') {
    event.waitUntil(
      clients.openWindow('/appservico/painel_servicos.html')
    );
  }
});