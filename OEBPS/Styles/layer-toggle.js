(function () {
  'use strict';

  var STORAGE_KEY = 'gwgz-layer-visibility';
  var NS = 'http://www.w3.org/1999/xhtml';

  var LAYERS = [
    { key: 'zhu', label: '夾注', hideClass: 'hide-zhu' },
    { key: 'translation', label: '翻譯', hideClass: 'hide-translation' },
    { key: 'ping', label: '總評', hideClass: 'hide-ping' }
  ];

  function createEl(tag) {
    if (document.createElementNS) {
      return document.createElementNS(NS, tag);
    }
    return document.createElement(tag);
  }

  function defaultState() {
    return { zhu: true, translation: true, ping: true, vertical: false };
  }

  function loadState() {
    var state = defaultState();
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return state;
      }
      var saved = JSON.parse(raw);
      var keys = ['zhu', 'translation', 'ping', 'vertical'];
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (typeof saved[key] === 'boolean') {
          state[key] = saved[key];
        }
      }
    } catch (e) {}
    return state;
  }

  function saveState(state) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {}
  }

  function applyState(state) {
    var body = document.body;
    var root = document.documentElement;
    if (!body || !body.classList) {
      return;
    }
    for (var i = 0; i < LAYERS.length; i++) {
      var layer = LAYERS[i];
      body.classList.toggle(layer.hideClass, !state[layer.key]);
    }
    var isVertical = !!state.vertical;
    body.classList.toggle('vertical-rl', isVertical);
    if (root && root.classList) {
      root.classList.toggle('vertical-rl', isVertical);
    }
  }

  function updateLayerButton(btn, visible) {
    var label = btn.getAttribute('data-label') || '';
    btn.setAttribute('aria-pressed', visible ? 'true' : 'false');
    btn.className = visible ? 'layer-toggle is-on' : 'layer-toggle is-off';
    btn.title = (visible ? '隱藏' : '顯示') + label;
  }

  function updateVerticalButton(btn, vertical) {
    var label = vertical ? '橫排' : '豎排';
    btn.setAttribute('aria-pressed', vertical ? 'true' : 'false');
    btn.setAttribute('data-label', label);
    btn.className = 'layer-toggle is-off';
    btn.title = '切換為' + label;
    while (btn.firstChild) {
      btn.removeChild(btn.firstChild);
    }
    btn.appendChild(document.createTextNode(label));
  }

  function isCatalogPage() {
    return !!(document.body && document.body.id === 'calibre_generated_inline_toc');
  }

  function getHeading() {
    var chapter = document.getElementById('chapter');
    if (!chapter) {
      var chapters = document.getElementsByClassName('chapter');
      chapter = chapters.length ? chapters[0] : null;
    }
    if (chapter) {
      var h1s = chapter.getElementsByTagName('h1');
      if (h1s.length) {
        return h1s[0];
      }
    }
    if (isCatalogPage()) {
      var i;
      var nodes = document.body.childNodes;
      for (i = 0; i < nodes.length; i++) {
        if (nodes[i].nodeType === 1 && nodes[i].tagName && nodes[i].tagName.toLowerCase() === 'h2') {
          return nodes[i];
        }
      }
    }
    return null;
  }

  function unwrapRail(toolbar) {
    var rails = document.getElementsByClassName('title-rail');
    if (!rails.length) {
      return;
    }
    var rail = rails[0];
    var parent = rail.parentNode;
    var child;
    while (rail.firstChild) {
      child = rail.firstChild;
      if (child === toolbar || (child.className && (' ' + child.className + ' ').indexOf(' layer-toolbar ') !== -1)) {
        rail.removeChild(child);
      } else {
        parent.insertBefore(child, rail);
      }
    }
    parent.removeChild(rail);
  }

  function placeToolbar(toolbar, vertical) {
    unwrapRail(toolbar);
    if (vertical) {
      var heading = getHeading();
      if (heading && heading.parentNode) {
        var rail = createEl('div');
        rail.className = 'title-rail';
        heading.parentNode.insertBefore(rail, heading);
        rail.appendChild(heading);
        rail.appendChild(toolbar);
        return;
      }
    }
    document.body.appendChild(toolbar);
  }

  function createToolbar(state, onVerticalToggle) {
    var catalog = isCatalogPage();
    var toolbar = createEl('div');
    toolbar.className = 'layer-toolbar';
    toolbar.setAttribute('role', 'toolbar');
    toolbar.setAttribute('aria-label', catalog ? '豎排' : '夾注、翻譯、總評、豎排');

    if (!catalog) {
      for (var i = 0; i < LAYERS.length; i++) {
        (function (layer) {
          var btn = createEl('button');
          btn.setAttribute('type', 'button');
          btn.setAttribute('data-layer', layer.key);
          btn.setAttribute('data-label', layer.label);
          btn.appendChild(document.createTextNode(layer.label));
          updateLayerButton(btn, state[layer.key]);
          btn.onclick = function () {
            state[layer.key] = !state[layer.key];
            applyState(state);
            saveState(state);
            updateLayerButton(btn, state[layer.key]);
          };
          toolbar.appendChild(btn);
        })(LAYERS[i]);
      }

      var sep = createEl('span');
      sep.className = 'layer-toolbar-sep';
      sep.setAttribute('aria-hidden', 'true');
      toolbar.appendChild(sep);
    }

    var vbtn = createEl('button');
    vbtn.setAttribute('type', 'button');
    vbtn.setAttribute('data-layer', 'vertical');
    vbtn.setAttribute('data-label', '豎排');
    vbtn.appendChild(document.createTextNode('豎排'));
    updateVerticalButton(vbtn, state.vertical);
    vbtn.onclick = function () {
      state.vertical = !state.vertical;
      applyState(state);
      saveState(state);
      updateVerticalButton(vbtn, state.vertical);
      if (onVerticalToggle) {
        onVerticalToggle(state.vertical);
      }
    };
    toolbar.appendChild(vbtn);

    return toolbar;
  }

  function init() {
    if (!document.body || document.getElementsByClassName('layer-toolbar').length) {
      return;
    }

    var state = loadState();
    applyState(state);
    document.body.classList.add('has-layer-toolbar');
    if (isCatalogPage()) {
      document.body.classList.add('is-catalog');
    }

    var toolbar = createToolbar(state, function (vertical) {
      placeToolbar(toolbar, vertical);
    });
    placeToolbar(toolbar, state.vertical);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, false);
  } else {
    init();
  }
})();
