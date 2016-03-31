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
      return this.CACHE_PREFIX + 'e13c1218f113efc3ac54aec09475719673b67d51';
    },

    // This is a list of resources that will be cached.
    RESOURCES: [
      './2015/12/28/css/index.html', // 24987f698029810882c5652787b071b16acd97fe
      './2015/12/28/git/index.html', // 84c733259e2ec2f1756c24d87f220f6cd995f2ab
      './2015/12/28/js-args/index.html', // b4cf67e8c6f063740758a87596a4735d7874ae96
      './2015/12/28/npm/index.html', // 7fa2e17209e3a95a7cde70809068ce321d476429
      './2015/12/28/pf/index.html', // e45d087a6df86661a051b0f5479afd69904c5d5d
      './2015/12/28/shell/index.html', // 98a9ceeb8f0e99e595b4fdf9c56c1d9e329e552c
      './2015/12/28/tool/index.html', // 329ed9e8e751b0c1974d9beb99f408c6bd5fdfb7
      './2016/01/09/cocoapods/index.html', // 68c318c401bc6f604981d30bc74f395575db5f36
      './2016/01/09/fq/index.html', // 99a47955a4a92009fdb8f72a60b6fab74433b6db
      './2016/01/09/ssh/index.html', // e95fa289ea1e9510ecbc00008dfbe13ed63f44a8
      './2016/01/09/thin-mac/index.html', // d7b2dc7f8071c7db31edac78f7472d7233373c91
      './2016/02/22/rbenv/index.html', // 09569c4cb6b77c8c057b90506ef42ec8ed92284d
      './2016/02/23/launchctl/index.html', // 6b1231ea1c8c7198cb4b7c81249b8de38fdb49ce
      './2016/03/23/bug/index.html', // 747616b8fda9037c4e835d12193a8fefead14bf8
      './2016/03/23/musicbox/index.html', // 22944ea2b5db9e7162f9745dd148324d715120fe
      './about/index.html', // a8de9be75d7fe7a7c9dd6fbdf9b2b00d36104f67
      './archives/2015/12/index.html', // 799308a6a70c70ffc2fe60742f948f67d432e339
      './archives/2015/index.html', // 799308a6a70c70ffc2fe60742f948f67d432e339
      './archives/2016/01/index.html', // 421ad521f422206a750e1abeb82bb59b681e5f63
      './archives/2016/02/index.html', // 47a65dae9978008a722a83f12c0e41df12d8cb46
      './archives/2016/03/index.html', // 6c6cb8104ace5b233b647842a0a6e33f7e54578f
      './archives/2016/index.html', // ce6babdd491b965421b04ec0c07ee795133229d2
      './archives/index.html', // 615614f2cccf456413ee9f592ba504424bc47a18
      './archives/page/2/index.html', // 16f39ecdbcb36b9e2e5da44d087ce83813b6967e
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
      './index.html', // 88b3f6962733d22994e14f2194a4a925f81f2bcc
      './js/fancybox.pack.js', // 53360764b429c212f424399384417ccc233bb3be
      './js/jquery.fancybox.js', // 92be822124e716a947bae3d676867e702933a93c
      './js/jquery.min.js', // 41b4bfbaa96be6d1440db6e78004ade1c134e276
      './js/offline-manager.js', // e2e09e000c5b64035940ae44e9c0936eb25ecd51
      './js/totop.js', // 7dbf8fcf582a4fb6eb9b2c60d6de9f9c2091ec4c
      './manifest.json', // 424f998c36c00d28f3fa8fa68e83f5652b34f3cc
      './page/2/index.html', // 3f0b540b5a3cc56a598b779e3747325b582ed5c9
      './tags/arguments/index.html', // 52cfb26db847726405aae6c11c77e901fbbb0945
      './tags/css/index.html', // 5d758fb1d08ac741432e644ddb2f3dd13f9b5dba
      './tags/git/index.html', // a353a2831d3330ee50a4881202a1d6d7f0d4f605
      './tags/iOS/index.html', // 4ad0c2ac16fa74ea4fed42687249652ee945a5f0
      './tags/Lantern/index.html', // fc80a7532c952a0e4b5a85f40c2d635c81fc25d5
      './tags/launchctl/index.html', // ce0470bd80095027c494fc08521028a65670dd10
      './tags/mac/index.html', // 27d0fcb9e03d464bf753902420ff5266287f96c3
      './tags/music/index.html', // a9088de4638b9454bc1521345679023b83341107
      './tags/npm/index.html', // 6ca94b28b50afd323ff1d08e86579c7a55d64d2f
      './tags/ruby/index.html', // c6b1c0d906c52441075012c46f632e71638559e4
      './tags/shell/index.html', // f636026ab7cb3cbfdd37ea3f234587cb341b0e38
      './tags/ssh/index.html', // 92efa8f006be45af28bafbd195db512bb7361742
      './tags/tool/index.html', // c6f349966c20baa04b314a6b53ca4831e8358170
      './tags/坑/index.html', // a7d7583a724f15ad4589b8f414e9d8940aaece50

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
