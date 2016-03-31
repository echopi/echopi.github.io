/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */


(function (self) {
  'use strict';

  // On install, cache resources and skip waiting so the worker won't
  // wait for clients to be closed before becoming active.
  self.addEventListener('install', event =>
    event.waitUntil(
      oghliner.cacheResources()
      .then(() => self.skipWaiting())
    )
  );

  // On activation, delete old caches and start controlling the clients
  // without waiting for them to reload.
  self.addEventListener('activate', event =>
    event.waitUntil(
      oghliner.clearOtherCaches()
      .then(() => self.clients.claim())
    )
  );

  // Retrieves the request following oghliner strategy.
  self.addEventListener('fetch', event => {
    if (event.request.method === 'GET') {
      event.respondWith(oghliner.get(event.request));
    } else {
      event.respondWith(self.fetch(event.request));
    }
  });

  var oghliner = self.oghliner = {

    // This is the unique prefix for all the caches controlled by this worker.
    CACHE_PREFIX: 'offline-cache:echopi/echopi.github.io:' + (self.registration ? self.registration.scope : '') + ':',

    // This is the unique name for the cache controlled by this version of the worker.
    get CACHE_NAME() {
      return this.CACHE_PREFIX + '6815843b4065f579fcc42ecfdb927a15a593bfc7';
    },

    // This is a list of resources that will be cached.
    RESOURCES: [
      './2015/12/28/css/index.html', // 35a7135f0c3223b9e443196a04dfee22c48f2031
      './2015/12/28/git/index.html', // f5ac1aaa84b2dec8f7dc5d63535f24fd680b1937
      './2015/12/28/js-args/index.html', // 8ca2603ec7f5699644eadac2882ce49f05c6f7d7
      './2015/12/28/npm/index.html', // 7118763ba2a3b5bbe0415bc043ad33169538664b
      './2015/12/28/pf/index.html', // e3f0aa4da93d2a1fcced9b7aa8175876b7c82c40
      './2015/12/28/shell/index.html', // 56aebc9b73ab37df34eb39da22d7b83272bbdd72
      './2015/12/28/tool/index.html', // 2bd7f2c2fa467905f489391fc6507f9eadc16570
      './2016/01/09/cocoapods/index.html', // f7012a3d4df0030fd16ebe7229ac5516f31d8a38
      './2016/01/09/fq/index.html', // 519083d352009cf1b7f142e685d2914f7d2203a6
      './2016/01/09/ssh/index.html', // 54387352e8d1abf34ed80f89c542ea20187528e6
      './2016/01/09/thin-mac/index.html', // 7fccbe28adf361b6c7364d341e7caf1b2a1c6d73
      './2016/02/22/rbenv/index.html', // 06d0eebfa220dbb4148b1f0d5d0ff176af4caff6
      './2016/02/23/launchctl/index.html', // 10e53253df52c4dc0f34901bc0f0bf89beda6a66
      './2016/03/23/bug/index.html', // 5d1f99fc3df5f0ad570812eb4d31783c75c988c4
      './2016/03/23/musicbox/index.html', // 3c4e1173e984cbf5342fe82a0fb64d60d571a55b
      './about/index.html', // bc429d857e027527c6f3230df48a03b486541592
      './archives/2015/12/index.html', // 2c38c2faaaa5ecf77853b1f99be8835cb24c43ef
      './archives/2015/index.html', // 2c38c2faaaa5ecf77853b1f99be8835cb24c43ef
      './archives/2016/01/index.html', // a926669c5130049d39968cd2860f6cbe9a930508
      './archives/2016/02/index.html', // 587c59e287633cc83cef3e46ca7fe160e182e569
      './archives/2016/03/index.html', // 918b3342ebb0e94361e636893193edd54d72c9b0
      './archives/2016/index.html', // 63ffa5ca7a1744cd3c87213897aec893e09c460d
      './archives/index.html', // bf03a36f3329921e3f71129aa5d8df391181626f
      './archives/page/2/index.html', // ce8514a309bae67b963e79d22101e33461ac180c
      './CNAME', // 9700936a278d2eb505fa49c247db88bcecabb638
      './css/grids-responsive-min.css', // 703826508193cbe21f2745d3e837256e224eb512
      './css/jquery.fancybox.css', // 3e5850dfd0ac87fe34a5c680d50f300536542bae
      './css/normalize.css', // 02fe53286d071637534d5aa2c57c76c168c0d521
      './css/pure-min.css', // 8cf7ea3e9e00e752de63fbc443e9300366327cd9
      './css/style.css', // 48ecd1bba65e8ea28b90994205b9bfd02fe9e21a
      './fancybox/blank.gif', // 2daeaa8b5f19f0bc209d976c02bd6acb51b00b0a
      './fancybox/fancybox_overlay.png', // b3a4ee645ba494f52840ef8412015ba0f465dbe0
      './fancybox/fancybox_sprite.png', // 17df19f97628e77be09c352bf27425faea248251
      './fancybox/fancybox_sprite@2x.png', // 30c58913f327e28f466a00f4c1ac8001b560aed8
      './fonts/icomoon.eot', // 6d4fddd9bae85803d2cf483700e9e46b630dfc63
      './fonts/icomoon.svg', // 54679013c08696615e3f83e2cf86bf02e17f1deb
      './fonts/icomoon.ttf', // 42fbffaef5b1224ce8d8349a5c7c3d7f7ecbb8ae
      './fonts/icomoon.woff', // 5f0e31266d6dd7a6d459d583599287e9539f1da8
      './img/android-chrome-144x144.png', // a2a7b9c724d242735c4ef9a16521b9a060571339
      './img/android-chrome-192x192.png', // ae723d92ab494487101f77fe712a22bd3107b865
      './img/android-chrome-36x36.png', // 0f82a7e85d85c966653a443028830aeeb4f23892
      './img/android-chrome-48x48.png', // 4ae5f010aa1ad11711e86d5533fb1ee33b4a0ba5
      './img/android-chrome-72x72.png', // a731a44f5cbb46a89f4f99460f1dc723a8e5bde3
      './img/android-chrome-96x96.png', // d7d83514cf55d3677656d6a681972de35db31a54
      './img/apple-touch-icon-114x114.png', // 1ca6c44db7f5e1f1055612648467ffb67a6b00ef
      './img/apple-touch-icon-120x120.png', // 7022ab4f56bf2bb7d25848e119e31c3590986919
      './img/apple-touch-icon-144x144.png', // 4355df7ad1c36e6f6a283929e1cca76b4d1ffdba
      './img/apple-touch-icon-152x152.png', // a1e63ee74c656ddceeb6e48212230eef6113104b
      './img/apple-touch-icon-180x180.png', // 084b6d2c47544192800f708a92f78fed946c41fc
      './img/apple-touch-icon-57x57.png', // 39525e42ac6ccb309677664e22931a47a8a56682
      './img/apple-touch-icon-60x60.png', // dd0476a3d817793554d762334bf8e295bc4a9b52
      './img/apple-touch-icon-72x72.png', // 67a9a437db4fbf21ece5033caf5a0cde73ed9b28
      './img/apple-touch-icon-76x76.png', // 9d80edf3d7948a6007f9bfb93edec1ae9fcf6991
      './img/apple-touch-icon-precomposed.png', // 156952b708c3902534f41a607cce7a381fdb3e5d
      './img/apple-touch-icon.png', // 084b6d2c47544192800f708a92f78fed946c41fc
      './img/browserconfig.xml', // 8dfe7747b598b79f4613c06b9875b3bc85f9b35c
      './img/favicon-16x16.png', // 54467420cc1aa88101ac357665b1e51cd9ed24e6
      './img/favicon-32x32.png', // 28c4a14fea054949e829d36b29d8c0629d41874b
      './img/favicon-96x96.png', // 9d7769f59f535147427724a9db6e6b2ef9ce5d65
      './img/favicon.ico', // 8b4de12f004f4bf1be26244f30aa6662ea15c153
      './img/manifest.json', // 3991f1e1383955c34c14cf0ed4794163e36969b7
      './img/mstile-144x144.png', // 3954e8d5670436118b08f88939ca81b7a810811e
      './img/mstile-150x150.png', // 37a5c6e63806fcf8a3697ebc14a5ee6615413b54
      './img/mstile-310x150.png', // 302c81b3a535fd9f370006c5bd79bacda6dd5562
      './img/mstile-310x310.png', // 28fd6392ee8127147785de2c4e8f9d3ac2313f5e
      './img/mstile-70x70.png', // 8abc8295f6936a04adcbe9c1d990df5996d5f27a
      './img/safari-pinned-tab.svg', // 6adec484bff4145b7ef698b041e87fa63123a9d6
      './index.html', // 50b5a21839cce9941b4781f245bc5e583a51b0fd
      './js/fancybox.pack.js', // 53360764b429c212f424399384417ccc233bb3be
      './js/jquery.fancybox.js', // 92be822124e716a947bae3d676867e702933a93c
      './js/jquery.min.js', // 41b4bfbaa96be6d1440db6e78004ade1c134e276
      './js/offline-manager.js', // e2e09e000c5b64035940ae44e9c0936eb25ecd51
      './js/totop.js', // 7dbf8fcf582a4fb6eb9b2c60d6de9f9c2091ec4c
      './manifest.json', // 270bf02ff503f94ea3be22dfee960bd6ccb1e5c6
      './page/2/index.html', // 73fe56637631d958c086188c58b1194c8dd68688
      './tags/arguments/index.html', // 698b6ea7a746cb04f9d41483c9896a47b73244ba
      './tags/css/index.html', // f16df876e4b5e6206c75695a0142aded566a3b97
      './tags/git/index.html', // 893027471aaca0e254f8fe05c5c2f523d0a2ed7a
      './tags/iOS/index.html', // 578e3f342a54047fcace76fc173786e9b2c505b0
      './tags/Lantern/index.html', // 6d56702da0a6e785c0f0824cca4a111d5b0cb0e4
      './tags/launchctl/index.html', // 05396273a3ad286b36a5f7d0a2bcdfe51f95b82b
      './tags/mac/index.html', // 53d247b2dda5776e5ca7818682bce3d89d6f2ad5
      './tags/music/index.html', // 64e5b57083686b83941f472fc117408f5b482680
      './tags/npm/index.html', // 50da133f89ff53d8e9ab7affd58f7c2a16d9194f
      './tags/ruby/index.html', // c25474c0492325e65ddeb1db9fe2b8d51467dd89
      './tags/shell/index.html', // 95c97b82e0ee86e3168f97e2c283417f4c9e76df
      './tags/ssh/index.html', // ed7e4b00230bdfbbc9377bbda8623bb105667376
      './tags/tool/index.html', // e155f0811bf959e0d3d3ed035307083bced12c33
      './tags/坑/index.html', // ed660a3d7a20df5f792801751e4d5dce8aa8ddad

    ],

    // Adds the resources to the cache controlled by this worker.
    cacheResources: function () {
      var now = Date.now();
      var baseUrl = self.location;
      return this.prepareCache()
      .then(cache => Promise.all(this.RESOURCES.map(resource => {
        // Bust the request to get a fresh response
        var url = new URL(resource, baseUrl);
        var bustParameter = (url.search ? '&' : '') + '__bust=' + now;
        var bustedUrl = new URL(url.toString());
        bustedUrl.search += bustParameter;

        // But cache the response for the original request
        var requestConfig = { credentials: 'same-origin' };
        var originalRequest = new Request(url.toString(), requestConfig);
        var bustedRequest = new Request(bustedUrl.toString(), requestConfig);
        return fetch(bustedRequest)
        .then(response => {
          if (response.ok) {
            return cache.put(originalRequest, response);
          }
          console.error('Error fetching ' + url + ', status was ' + response.status);
        });
      })));
    },

    // Remove the offline caches not controlled by this worker.
    clearOtherCaches: function () {
      var outOfDate = cacheName => cacheName.startsWith(this.CACHE_PREFIX) && cacheName !== this.CACHE_NAME;

      return self.caches.keys()
      .then(cacheNames => Promise.all(
        cacheNames
        .filter(outOfDate)
        .map(cacheName => self.caches.delete(cacheName))
      ));
    },

    // Get a response from the current offline cache or from the network.
    get: function (request) {
      return this.openCache()
      .then(cache => cache.match(() => this.extendToIndex(request)))
      .then(response => {
        if (response) {
          return response;
        }
        return self.fetch(request);
      });
    },

    // Make requests to directories become requests to index.html
    extendToIndex: function (request) {
      var url = new URL(request.url, self.location);
      var path = url.pathname;
      if (path[path.length - 1] !== '/') {
        return request;
      }
      url.pathname += 'index.html';
      return new Request(url.toString(), request);
    },

    // Prepare the cache for installation, deleting it before if it already exists.
    prepareCache: function () {
      return self.caches.delete(this.CACHE_NAME)
      .then(() => this.openCache());
    },

    // Open and cache the offline cache promise to improve the performance when
    // serving from the offline-cache.
    openCache: function () {
      if (!this._cache) {
        this._cache = self.caches.open(this.CACHE_NAME);
      }
      return this._cache;
    }

  };
}(self));
