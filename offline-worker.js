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
      return this.CACHE_PREFIX + 'e9068a1b0b3f8602549e862aaecdc8c842f8df18';
    },

    // This is a list of resources that will be cached.
    RESOURCES: [
      './2015/12/28/css/index.html', // 5d68c8eab8125d2d330b1779c2bcf65ff81e4b32
      './2015/12/28/git/index.html', // 004255098fb8ba3250f24a75439f6ff0a4dcd822
      './2015/12/28/js-args/index.html', // f4c749f9b2c243210d5ad5207cba19de836cfa2e
      './2015/12/28/npm/index.html', // 826a6f4133ce7fa5f39183f90c84d4d5be9969a0
      './2015/12/28/pf/index.html', // 427f9fea29298b0632051e5032a25958281ba93c
      './2015/12/28/shell/index.html', // bd4c04766b71971866c0bd782cf2d42138c347bb
      './2015/12/28/tool/index.html', // c85defed635defadf06eeb2339effd860301b4ed
      './2016/01/09/cocoapods/index.html', // bcfff6914ffbb78e7f128cb264a987298fa89eaa
      './2016/01/09/fq/index.html', // 72ed88a4df24ec52d1be38f6e31892b84ae326f4
      './2016/01/09/ssh/index.html', // 7abb9dc1b2c91595004115b75d6ab6bd64af4626
      './2016/01/09/thin-mac/index.html', // a3c067ca2424a2361d09115e1a813334c623487c
      './2016/02/22/rbenv/index.html', // ec43da0db2c43b7984ed1a5a5308d2a70913f28c
      './2016/02/23/launchctl/index.html', // 970e3d331987080a80923f24877f15381ead9d26
      './2016/03/23/bug/index.html', // 8eb83820725535e7e510ac95711cc3c0041c73aa
      './2016/03/23/musicbox/index.html', // 47e8b0983d54a8737a3285de208d5d93d44c16cf
      './about/index.html', // 243ea42b0fec760252215f667309860b86413397
      './archives/2015/12/index.html', // 8b6d857f65bf6844386925b9455e50c76a80874a
      './archives/2015/index.html', // 8b6d857f65bf6844386925b9455e50c76a80874a
      './archives/2016/01/index.html', // a64dd087f75fda5dc097a924a4f372f8f41c445c
      './archives/2016/02/index.html', // 20ab45a919c052f4f69a72b03eab4f3d8c66e37e
      './archives/2016/03/index.html', // c7b5fc15a411751a5bfe07beff88fd09f8a53e29
      './archives/2016/index.html', // 8d76ce80696240fa9269a405757c5a04d0bdad92
      './archives/index.html', // 7dfd99c766303f8940593076cd7bc0b2ddb7d99c
      './archives/page/2/index.html', // e6a07b3251b0161ff935c7f0a43f1e758f26e66a
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
      './index.html', // 0a994c8cd0c62e3500a02930e22d6a21ce24d5db
      './js/fancybox.pack.js', // 53360764b429c212f424399384417ccc233bb3be
      './js/jquery.fancybox.js', // 92be822124e716a947bae3d676867e702933a93c
      './js/jquery.min.js', // 41b4bfbaa96be6d1440db6e78004ade1c134e276
      './js/offline-manager.js', // e2e09e000c5b64035940ae44e9c0936eb25ecd51
      './js/totop.js', // 7dbf8fcf582a4fb6eb9b2c60d6de9f9c2091ec4c
      './manifest.json', // 270bf02ff503f94ea3be22dfee960bd6ccb1e5c6
      './page/2/index.html', // 9fce0836d9db27fe2dd3f5468d909367b9bde55d
      './tags/arguments/index.html', // f9bde4f9579d873406c3bbdf57f37b6fbba3d6f8
      './tags/css/index.html', // 4cc2c3d4e7db0e08f79254266b1ee637775ab0ab
      './tags/git/index.html', // 78582301dfbb4698bc961589c56fc2837cc3525a
      './tags/iOS/index.html', // db6acc3c7488696b31ada9f78d41a17a1fae66f5
      './tags/Lantern/index.html', // 415eea0ca51e5021a5ad51e55491a4508acd888a
      './tags/launchctl/index.html', // 3f5d1b06ffb86b4cf22273860536ff942d0886e2
      './tags/mac/index.html', // 807ea57fe9a9520f5314bab933508aafd2564a12
      './tags/music/index.html', // 4332c8712aed6ebb47736ff150f70118aac48d8b
      './tags/npm/index.html', // d4eeed76476d91991f8caf93dc815036ca7f4c81
      './tags/ruby/index.html', // f3d1ff2be6ade2b1cf96f51b85d8685f64247412
      './tags/shell/index.html', // 04c3dd92da69b2994164e89523234b892f52a2a4
      './tags/ssh/index.html', // 5a491a210aa7f4a561cd5d65fa8736f439749b70
      './tags/tool/index.html', // a179fe5d4eac51d0088871e105bbd6f129c044b5
      './tags/坑/index.html', // b43333aab512a79d97291de540a7f602f1a0b5ce

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
