// js/main.js — entry point loader untuk SI-PEDAS
// Hanya api.js dan main.js dipanggil di index.html.
// Modul di-load berdasarkan prioritas: critical untuk UI/state, deferred untuk peta
(function(){
  /* Modul CRITICAL (needed for immediate UI) */
  var criticalModules = [
    'js/modules/ui/state.js',
    'js/modules/ui/device.js',
    'js/modules/ui/viewmode.js',
    'js/modules/ui/util.js',
    'js/modules/ui/sidebar.js',
    'js/modules/ui/login.js'
  ];
  
  /* Modul STANDARD (dapat di-defer sedikit) */
  var standardModules = [
    'js/modules/ui/foto-thumb.js',
    'js/modules/ui/gallery.js',
    'js/modules/ui/dashboard.js',
    'js/modules/ui/ptk.js',
    'js/modules/ui/satlinmas.js',
    'js/modules/ui/pagination.js',
    'js/modules/laporan/rekap.js',
    'js/modules/laporan/pdf-single.js',
    'js/modules/laporan/kolektif.js',
    'js/modules/laporan/edit.js',
    'js/modules/laporan/confirm.js',
    'js/modules/laporan/input.js'
  ];
  
  /* Modul PETA (lazy load setelah login) */
  var petaModules = [
    'js/modules/peta/core.js',
    'js/modules/peta/load.js',
    'js/modules/peta/photo.js',
    'js/modules/peta/modal.js',
    'js/modules/peta/measure.js',
    'js/modules/peta/progress.js',
    'js/modules/peta/legend.js',
    'js/modules/peta/chk.js'
  ];

  var loadedModules = {};
  
  function loadSequential(moduleList, callback) {
    var i = 0;
    function loadNext() {
      if (i >= moduleList.length) {
        if (callback) callback();
        return;
      }
      var modulePath = moduleList[i++];
      if (loadedModules[modulePath]) {
        loadNext();
        return;
      }
      
      var script = document.createElement('script');
      script.src = modulePath;
      script.async = false;
      script.onload = function() {
        loadedModules[modulePath] = true;
        loadNext();
      };
      script.onerror = function(){
        console.error('Gagal memuat modul:', modulePath);
        loadNext();
      };
      document.head.appendChild(script);
    }
    loadNext();
  }
  
  /* Load critical modules terlebih dahulu */
  loadSequential(criticalModules, function() {
    /* Setelah critical loaded, langsung load standard dan peta di background */
    var allRemaining = standardModules.concat(petaModules);
    /* Defer dengan timeout kecil agar UI responsive */
    setTimeout(function() {
      loadSequential(allRemaining);
    }, 100);
  });
  
  /* Also expose lazy loader untuk on-demand loading */
  window._loadPetaModules = function(callback) {
    loadSequential(petaModules, callback);
  };
})();