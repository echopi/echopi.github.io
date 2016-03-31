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
      return this.CACHE_PREFIX + 'b5220dce1d8dc7370541be7f849e6351bd531e92';
    },

    // This is a list of resources that will be cached.
    RESOURCES: [
      './2015/12/28/css/index.html', // 402f0a8b9e218c7c509609cb9436e3a8f2bff96c
      './2015/12/28/git/index.html', // dac4fdf004ff7488e711186a5141c4409f3fd109
      './2015/12/28/js-args/index.html', // 3996e2de1414a80d0da158407abb059a886edb80
      './2015/12/28/npm/index.html', // ee590adc4424c3e4b1740bc0a4cea40f689b5474
      './2015/12/28/pf/index.html', // bbc96dc630cd50eca9f809293b66f7ce4a9dbc66
      './2015/12/28/shell/index.html', // 5a0c7c5348ae81816d9bb73b9cd33cb9d93a84bc
      './2015/12/28/tool/index.html', // 2f85b75b5d99fa48ba3ffa95fea1c11a95cc5e77
      './2016/01/09/cocoapods/index.html', // 806c4fc61ac7e20f8eed32f53d49c72509370545
      './2016/01/09/fq/index.html', // 5bfb9e4bd35469e172c06e426b601c45fc12d24c
      './2016/01/09/ssh/index.html', // 15cef26cc91d0acf0f869e44e2a8f87cdb0ceaa2
      './2016/01/09/thin-mac/index.html', // cc3a3d5e1209207b1832ca1dcd4a59eb5a2d86d3
      './2016/02/22/rbenv/index.html', // d5170f192b9b7cf5f2646a01563f65144ce81fd7
      './2016/02/23/launchctl/index.html', // c842e5a08483b0738993266d03b60e7fba74c12c
      './2016/03/23/bug/index.html', // 8dd38698fcdba94be206f7e2c34eaf276ff1734e
      './2016/03/23/musicbox/index.html', // 1c2c5bb7afd3017d68c7afb7ffe52e35a3e00cf2
      './about/index.html', // 32261b9f02be34ceb22a00f3dd9a06f48c7377e7
      './archives/2015/12/index.html', // 6a61f961732ceb6acc811c7e722b47ca72dfa5a4
      './archives/2015/index.html', // 6a61f961732ceb6acc811c7e722b47ca72dfa5a4
      './archives/2016/01/index.html', // bff7271c5141cd593af929078935a629a8331982
      './archives/2016/02/index.html', // 5d6954ec9f55282077c2793466446995df259e4e
      './archives/2016/03/index.html', // 208c260ab2d414ade8fa8c4053087b7b5b6e4b02
      './archives/2016/index.html', // 53f9a22ecfb1b1c030cf16aadad22bd6d8bd9a71
      './archives/index.html', // 0998cad16d0997f9977fecea3de49d9313c30e93
      './archives/page/2/index.html', // 4778724b708a4f932d4f5a8b9e24d3ba23d2c145
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
      './index.html', // af72d9b33467353ac3db3dcf13d5797e7a2848ce
      './js/fancybox.pack.js', // 53360764b429c212f424399384417ccc233bb3be
      './js/jquery.fancybox.js', // 92be822124e716a947bae3d676867e702933a93c
      './js/jquery.min.js', // 41b4bfbaa96be6d1440db6e78004ade1c134e276
      './js/offline-manager.js', // e2e09e000c5b64035940ae44e9c0936eb25ecd51
      './js/totop.js', // 7dbf8fcf582a4fb6eb9b2c60d6de9f9c2091ec4c
      './manifest.json', // 270bf02ff503f94ea3be22dfee960bd6ccb1e5c6
      './page/2/index.html', // 63563db600a9edaebd9ec1096439d8bedd52e184
      './tags/arguments/index.html', // 280add0b8e043dc2a5b1ec1678d91930f01064ea
      './tags/css/index.html', // 674079b76e6c0b800f9d38b36014c79c7ba285d7
      './tags/git/index.html', // 0569e977a5e8145707ddf5d1fccc0c84bb7a44cb
      './tags/iOS/index.html', // c8b334f20a5fbf845cf35e8d8e11225eef787aa8
      './tags/Lantern/index.html', // 10b214f3778402f6a63a89ae3ee1100c74f5a686
      './tags/launchctl/index.html', // 002c85b6d17ae4eeb8bb1d52f01d2f8641685861
      './tags/mac/index.html', // 09b619c13db60eab9abdda6d580d76fdd30e0ce8
      './tags/music/index.html', // c06265ff786f375a59f1ecd1ffae37bc2c902510
      './tags/npm/index.html', // eb2f18addee6a93329272c2c986dbcc261336734
      './tags/ruby/index.html', // d12677bb78161e3a8e93161f19a205aa15ba7006
      './tags/shell/index.html', // 9efdbc97bbbfce00fbce443f982ed87b09216c41
      './tags/ssh/index.html', // 5510ff053d4050fcdb1b342d357133fa989a57c0
      './tags/tool/index.html', // 5d24fa35c4550ca3e58e5ad6a75b2061c5b7acc8
      './tags/坑/index.html', // bfcbdc87d6d9e6cbc76001e043d0a77bd1cf4322

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
