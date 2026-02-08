/**
 * Global IndexedDB storage utility for DailyCoder tools.
 * Usage:
 *   await DCStore.init();
 *   await DCStore.set('json-formatter', 'tab-1', { name: 'My JSON', content: '{}' });
 *   const item = await DCStore.get('json-formatter', 'tab-1');
 *   const all = await DCStore.getAll('json-formatter');
 *   await DCStore.remove('json-formatter', 'tab-1');
 *   await DCStore.clear('json-formatter');
 */
var DCStore = (function() {
  var DB_NAME = 'dc_tools_db';
  var DB_VERSION = 1;
  var STORE_NAME = 'items';
  var db = null;

  function open() {
    return new Promise(function(resolve, reject) {
      if (db) return resolve(db);
      var req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = function(e) {
        var d = e.target.result;
        if (!d.objectStoreNames.contains(STORE_NAME)) {
          var store = d.createObjectStore(STORE_NAME, { keyPath: ['tool', 'id'] });
          store.createIndex('tool', 'tool', { unique: false });
        }
      };
      req.onsuccess = function(e) { db = e.target.result; resolve(db); };
      req.onerror = function(e) { reject(e.target.error); };
    });
  }

  function tx(mode) {
    return db.transaction(STORE_NAME, mode).objectStore(STORE_NAME);
  }

  function promisify(req) {
    return new Promise(function(resolve, reject) {
      req.onsuccess = function() { resolve(req.result); };
      req.onerror = function() { reject(req.error); };
    });
  }

  return {
    init: function() { return open(); },

    set: function(tool, id, data) {
      return open().then(function() {
        var item = Object.assign({}, data, { tool: tool, id: id, updatedAt: Date.now() });
        return promisify(tx('readwrite').put(item));
      });
    },

    get: function(tool, id) {
      return open().then(function() {
        return promisify(tx('readonly').get([tool, id]));
      });
    },

    getAll: function(tool) {
      return open().then(function() {
        var idx = tx('readonly').index('tool');
        return promisify(idx.getAll(tool));
      });
    },

    remove: function(tool, id) {
      return open().then(function() {
        return promisify(tx('readwrite').delete([tool, id]));
      });
    },

    clear: function(tool) {
      return open().then(function() {
        return DCStore.getAll(tool).then(function(items) {
          var store = tx('readwrite');
          items.forEach(function(item) { store.delete([item.tool, item.id]); });
        });
      });
    }
  };
})();
