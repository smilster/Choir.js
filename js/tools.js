/**
 * ```
 * cumulativ sum of one dimensional array
 * ```
 * @param array
 * @returns {*}
 */







function createFlexGrow() {
    const spacer = document.createElement('div');
    spacer.style = 'flex-grow: 1';
    return spacer;
}





function listAllEventListeners() {
    const allElements = Array.prototype.slice.call(document.querySelectorAll('*'));
    allElements.push(document);
    // allElements.push(window);
    // allElements.push(document.getElementById('clefTooltip1'));

    const types = [];

    for (let ev in window) {
        if (/^on/.test(ev)) types[types.length] = ev;
    }

    let elements = [];
    for (let i = 0; i < allElements.length; i++) {
        const currentElement = allElements[i];
        for (let j = 0; j < types.length; j++) {
            if (typeof currentElement[types[j]] === 'function') {
                elements.push({
                    "node": currentElement,
                    "type": types[j],
                    "func": currentElement[types[j]].toString(),
                });
            }
        }
    }

    return elements.sort(function (a, b) {
        return a.type.localeCompare(b.type);
    });
}


(function() {
  const eventListeners = [];

  // Keep a reference to the original methods
  const origAddEventListener = EventTarget.prototype.addEventListener;
  const origRemoveEventListener = EventTarget.prototype.removeEventListener;

  EventTarget.prototype.addEventListener = function(type, listener, options) {
    eventListeners.push({
      target: this,
      type,
      listener,
      options
    });
    origAddEventListener.call(this, type, listener, options);
  };

  EventTarget.prototype.removeEventListener = function(type, listener, options) {
    for (let i = 0; i < eventListeners.length; i++) {
      const e = eventListeners[i];
      if (e.target === this && e.type === type && e.listener === listener) {
        eventListeners.splice(i, 1);
        break;
      }
    }
    origRemoveEventListener.call(this, type, listener, options);
  };

  // Expose a global function to list them
  window.listAllEventListeners = function() {
    return eventListeners.map(e => ({
      node: e.target,
      type: e.type,
      listener: e.listener.toString(),
      options: e.options
    }));
  };
})();




// Automatically dispose Bootstrap components when their elements are removed
document.addEventListener('DOMContentLoaded', function () {
  (function () {
    const components = [
      'Button', 'Collapse', 'Dropdown', 'Modal', 'Popover', 'Tab', 'Tooltip'
    ];

    function disposeBootstrapInstances(node) {
      if (node.nodeType !== 1) return;
      for (const comp of components) {
        const instance = bootstrap[comp]?.getInstance(node);
        if (instance) instance.dispose();
      }
      node.querySelectorAll('*').forEach(child => {
        for (const comp of components) {
          const instance = bootstrap[comp]?.getInstance(child);
          if (instance) instance.dispose();
        }
      });
    }

    const observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        mutation.removedNodes.forEach(node => disposeBootstrapInstances(node));
      }
    });

    // ✅ Now safe — DOM is ready
    observer.observe(document.body, { childList: true, subtree: true });

    console.info('✅ Bootstrap auto-dispose MutationObserver active');
  })();
});
