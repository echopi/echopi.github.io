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
      return this.CACHE_PREFIX + 'e0f88ebc11c3c6c68b6347314212150e6dd7585a';
    },

    // This is a list of resources that will be cached.
    RESOURCES: [
      './2015/12/28/css/index.html', // c8c354beae6f436384415ff9f1bf26e6585c5314
      './2015/12/28/git/index.html', // 1e5ab7098934b4550091c384b9b1a14c18db63cd
      './2015/12/28/js-args/index.html', // 8f3354fae9ddb6b452e72b3a70dadad47136ade0
      './2015/12/28/npm/index.html', // da20e0db9e488cafc3bf5adb30e1f147d1aa4a3c
      './2015/12/28/pf/index.html', // 582cb7aa7d2888f688a427c8c3aa3f61f4ac276c
      './2015/12/28/shell/index.html', // cdc6aacd9ca9f81b9fa6c5a9e5cfb8e6029a28eb
      './2015/12/28/tool/index.html', // ed3cfb0beb9c2671af796d69d7dec5d7ec23ef6f
      './2016/01/09/cocoapods/index.html', // 07c2be22f459ec4e0e0900ba066e4b74fc293dd7
      './2016/01/09/fq/index.html', // c7a87a1e084f734744e73ce34e374f14ee3664ed
      './2016/01/09/ssh/index.html', // 80d33c7ef178f48efd9115c5175d38389c5790de
      './2016/01/09/thin-mac/index.html', // 88eb966f58a75e358bcefcabdd002ccade03b8e5
      './2016/02/22/rbenv/index.html', // 098e59c3da133dd694b6d11a82b267ce6fa648e7
      './2016/02/23/launchctl/index.html', // bdbcad2c30c428f6b43bedb43a8e42b0166da1ce
      './2016/03/23/bug/index.html', // 18b45f9c69b85de4fd420f6705c7b26cf768166b
      './2016/03/23/musicbox/index.html', // f94dde711479892c4fe86cd71b1cb67ce167d15f
      './about/index.html', // ad27c1c8a1bf5bfbff7ac249310bb79e7848fb47
      './archives/2015/12/index.html', // 110a02e02f8f0a481e90a1210fe7f00c38b0c4ae
      './archives/2015/index.html', // 110a02e02f8f0a481e90a1210fe7f00c38b0c4ae
      './archives/2016/01/index.html', // f69553f56d9ead130bbf62cdf7d821932723d9af
      './archives/2016/02/index.html', // 658ab84e26d72745542362717106bf0815890eba
      './archives/2016/03/index.html', // f3d72ef0887244b093d35ad09af629e659b1c700
      './archives/2016/index.html', // 98c4b434b2ea113bcd43fad33cf5b7f85c2392bf
      './archives/index.html', // fc4b7c348769ced2da718edc235593292395cae8
      './archives/page/2/index.html', // 1ced99038279cb2e2860e634eb206aecd965e992
      './browserconfig.xml', // 27feeade966f930e0d1f4123f561c8b89c70f1a0
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
      './img/favicon-16x16.png', // 54467420cc1aa88101ac357665b1e51cd9ed24e6
      './img/favicon-32x32.png', // 28c4a14fea054949e829d36b29d8c0629d41874b
      './img/favicon-96x96.png', // 9d7769f59f535147427724a9db6e6b2ef9ce5d65
      './img/favicon.ico', // 8b4de12f004f4bf1be26244f30aa6662ea15c153
      './img/mstile-144x144.png', // 3954e8d5670436118b08f88939ca81b7a810811e
      './img/mstile-150x150.png', // 37a5c6e63806fcf8a3697ebc14a5ee6615413b54
      './img/mstile-310x150.png', // 302c81b3a535fd9f370006c5bd79bacda6dd5562
      './img/mstile-310x310.png', // 28fd6392ee8127147785de2c4e8f9d3ac2313f5e
      './img/mstile-70x70.png', // 8abc8295f6936a04adcbe9c1d990df5996d5f27a
      './img/safari-pinned-tab.svg', // 6adec484bff4145b7ef698b041e87fa63123a9d6
      './index.html', // dd4297b419ebb4574ecbdbb94b85b188e8b9fa63
      './js/fancybox.pack.js', // 53360764b429c212f424399384417ccc233bb3be
      './js/jquery.fancybox.js', // 92be822124e716a947bae3d676867e702933a93c
      './js/jquery.min.js', // 41b4bfbaa96be6d1440db6e78004ade1c134e276
      './js/offline-manager.js', // e2e09e000c5b64035940ae44e9c0936eb25ecd51
      './js/totop.js', // 7dbf8fcf582a4fb6eb9b2c60d6de9f9c2091ec4c
      './manifest.json', // 424f998c36c00d28f3fa8fa68e83f5652b34f3cc
      './page/2/index.html', // 2e180135986ae0c064a733860bbb33310131dcbe
      './tags/arguments/index.html', // c9c71088d803049372ee11fbae0b3d422c4d72d6
      './tags/css/index.html', // 9423c94fd0b4d6ad74f5736d546b27272c988b01
      './tags/git/index.html', // f915b793a057bcba3aa1c42551411a545af7dba5
      './tags/iOS/index.html', // 09295fdd9a328d1b6e0a761198d93127cc9793bb
      './tags/Lantern/index.html', // fc211b2ae9963efba7820d4f14facb08224b9ee2
      './tags/launchctl/index.html', // 3125d33cc0cfc89b94f2f069a9572d535b6d634c
      './tags/mac/index.html', // 4b0ea14dcdb63f26bc0ce17e552ca8000ca8e327
      './tags/music/index.html', // 443a10d6c34a0317f5d08059a4f52c663a8afc07
      './tags/npm/index.html', // 0b192c029723e0882a168eb26c7c1c8f3c1cf6c1
      './tags/ruby/index.html', // def44a8ec1491f2228638cb2cdeb7b2281331195
      './tags/shell/index.html', // 0845c3e6e3a017b5eeff0fca1cb5e3e350101874
      './tags/ssh/index.html', // f29ff5cf2bbd327ce8932d7e2db55aaf4f641e99
      './tags/tool/index.html', // 6577d321ce5ebf6bb291af628885055e37302eba
      './tags/坑/index.html', // 7ca533d509a349417fb7c0bdc4dad16bf0b62b63

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
