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
      return this.CACHE_PREFIX + '74d34515c3acaac58249fa1cba453e9bb64464e5';
    },

    // This is a list of resources that will be cached.
    RESOURCES: [
      './2015/12/28/css/index.html', // 1ebe87b61a0ef82bb1536d92ef8f50ba6a91d6f3
      './2015/12/28/git/index.html', // 1ec531a30c7ed10f14bcfb6f5bfa88bd558b9ecf
      './2015/12/28/js-args/index.html', // 1e6b4b4b95ea2f3c99ea9b5182fd87b6ccfc446c
      './2015/12/28/npm/index.html', // ae6b3230f738cec0b6f7d1527e007f79e60548ce
      './2015/12/28/pf/index.html', // 42d4a27cb3466f7de7f77f130224052ecd172902
      './2015/12/28/shell/index.html', // 1c3c76c4d3132930a8d2412ba62e56f7b0726e5f
      './2015/12/28/tool/index.html', // b4ba643b61a8b861de10e14f445913eb3cfa661a
      './2016/01/09/cocoapods/index.html', // 59c35336a992d4502ed2c0ce5f4a90e0ae3e97d0
      './2016/01/09/fq/index.html', // c3f10507c98e22fde9cf78c15ade3bdacfc3b11d
      './2016/01/09/ssh/index.html', // 5306dc9ca21678d6dbdda42fbbc019c7b3a7cbdd
      './2016/01/09/thin-mac/index.html', // e597e48f3e0cc97074df2304ab02ac260fcb6425
      './2016/02/22/rbenv/index.html', // 85b43ae7f8b6b522c37c3f7f8321cbeff3f0dc7b
      './2016/02/23/launchctl/index.html', // ff91926c992114deb1c615a635624f93f599ebeb
      './2016/03/23/bug/index.html', // 68d5f661700d64cb85dcd374ba38472c16aa5ea2
      './2016/03/23/musicbox/index.html', // 34d1b8c8699809dbbeadba20f4060f9d3ad31570
      './about/index.html', // d7ca7c7011aa741c9bc171e0efaf5e57da454c6b
      './archives/2015/12/index.html', // 502181f672d70f7c855f378a4135a1e37e4f85b5
      './archives/2015/index.html', // 502181f672d70f7c855f378a4135a1e37e4f85b5
      './archives/2016/01/index.html', // 65925d73ebfa253d16142ff447b411fb832cd95a
      './archives/2016/02/index.html', // 6878b4c6a40b4ff30568e4e67abfe587b538b2fb
      './archives/2016/03/index.html', // 08183cc4ca43f7a5a9a029fbe8d81f962c2e8694
      './archives/2016/index.html', // 3b93b87b7650dd9d553afeb72531025087dabd01
      './archives/index.html', // 518ad9bbffcf1f806c3aa48e0e1333c45d4a1bc8
      './archives/page/2/index.html', // fef50b216df8f071e8ffb6ba0641799b2261089c
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
      './index.html', // 7d5750bdda0ccc4f2116b1488fac9cb8230c9652
      './js/fancybox.pack.js', // 53360764b429c212f424399384417ccc233bb3be
      './js/jquery.fancybox.js', // 92be822124e716a947bae3d676867e702933a93c
      './js/jquery.min.js', // 41b4bfbaa96be6d1440db6e78004ade1c134e276
      './js/offline-manager.js', // 98d7e46a68a95af01e87f786eecd8679a4a7213f
      './js/totop.js', // 7dbf8fcf582a4fb6eb9b2c60d6de9f9c2091ec4c
      './manifest.json', // 424f998c36c00d28f3fa8fa68e83f5652b34f3cc
      './page/2/index.html', // 9f5dce7ff586eaa15277cd47285f32edb651f784
      './tags/arguments/index.html', // 94f8e6b46c240d3cd35d417af07301cbfdf640ab
      './tags/css/index.html', // 9569bb8cc9dfa7ff2c795bd73b424f90ce8c7fbc
      './tags/git/index.html', // 78ce810bc79338aa4b764bc5aa6bd1264fdd4e2a
      './tags/iOS/index.html', // 2e7b1e02ebb2c26dbdf3261134ea0851efe7b853
      './tags/Lantern/index.html', // d1b67028176250f7c3e3d2c17273dcdbd21fc58b
      './tags/launchctl/index.html', // fbe2f46f91bdf1476272f68a60d97498fcd3a6a4
      './tags/mac/index.html', // 85f0861853377939a510969e02db1eb541c8566f
      './tags/music/index.html', // 9d9a036b280907b16c22feede6e6bb7d7b80a771
      './tags/npm/index.html', // 179df9760969d366afada0fcc7049ec4d9ca7397
      './tags/ruby/index.html', // c17a7bcb86be2c113c28bd63fff723ebefee89bb
      './tags/shell/index.html', // d78ac84e22c30526f9a761a542f2261dad8d2323
      './tags/ssh/index.html', // 1948989ae7ba19352a2163f6456744c43bb0be94
      './tags/tool/index.html', // 67f2faf442fc3f30838e440c90f10478c250fce9
      './tags/坑/index.html', // 27f4587b221f2b237feb0d50817567947bdde5b2

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
