define(function(require) {
  var su = [
    {
      title: 'c1 - ecmascript语法',
      children: [
        {
          title: 'c1.1 - Array',
          children: [
            {
              title: 'c1.1.1 - Array.map()',
            },
          ],
        },
      ],
    },
    {
      title: 'c2 - DOM',
      children: [
        {
          title: 'c2.1 - Node节点',
        },
        {
          title: 'c2.2 - 事件',
          children: [
            {
              title: 'c2.2.1 - 事件冒泡',
            },
            {
              title: 'c2.2.2 - 事件对象',
            },
            {
              title: 'c2.2.3 - EventListener',
            },
          ],
        },
        {
          title: 'c2.3 - DOM3',
        },
      ],
    },
    {
      title: 'c3 - WEBPACK...',
    },
  ];

  var catalog = document.createElement('ul');
  // catalog.appendChild(document.createElement('li'));

  var container = document.getElementById('catalog');
  traverse(su, catalog);
  container.appendChild(catalog);


  /**
   * 
   * @param {array} arg 
   * @param {HTMLElement<ul>)} root 
   */
  function traverse(arg, root) {
    if (!isArray(arg)) {
      return;
    }

    arg.map(function(item) {
      var branch = document.createElement('li');
      branch.appendChild(document.createTextNode(item.title));
      console.log(item.title);
      if (item.children && isArray(item.children)) {
        branch.appendChild(document.createElement('ul'));
        root.appendChild(branch);
        return traverse(item.children, root.lastChild.lastChild);
      }
      root.appendChild(branch);
    });
  }

  function isArray(val) {
    return Object.prototype.toString.call(val) === "[object Array]";
  }

});



