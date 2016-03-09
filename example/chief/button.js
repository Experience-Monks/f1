var f1 = require('../..');

module.exports = function(opts) {

  opts = opts || {};
  opts.width = opts.width || 200;
  opts.height = opts.height || 40;
  opts.color1 = opts.color1 || '#00CAFE';
  opts.color2 = opts.color2 || '#CAFE00';
  opts.text = opts.text || "I'm a button";
  opts.zIndex = opts.zIndex || 0;

  var elButton = document.createElement('div');
  var elColor1 = document.createElement('div');
  var elColor2 = document.createElement('div');

  elButton.style.zIndex = opts.zIndex;

  elColor1.style.boxSizing = 
  elColor2.style.boxSizing = 'border-box';

  elColor1.style.fontFamily = 
  elColor1.style.fontFamily = 'Georgia, serif';

  elColor1.innerText = elColor2.innerText = opts.text;

  elButton.style.position = 'relative';
  elColor1.style.position = elColor2.style.position = 'absolute';

  elButton.style.width =
  elColor1.style.width = 
  elColor2.style.width = opts.width + 'px';

  elButton.style.height =
  elColor1.style.height = 
  elColor2.style.height = opts.height + 'px';

  elColor1.style.backgroundColor = opts.color1;
  elColor2.style.backgroundColor = opts.color2;
  elColor1.style.transformOrigin = '0% 0%';
  elColor2.style.transformOrigin = '0% 0%';

  elColor1.style.paddingLeft =
  elColor2.style.paddingLeft =
  elColor1.style.paddingTop = 
  elColor2.style.paddingTop = '12px';

  elButton.appendChild(elColor1);
  elButton.appendChild(elColor2);

  var ui = f1({
    targets: {
      color1: elColor1,
      color2: elColor2
    },

    states: {
      out: {
        color1: {
          rotate: 0,
          alpha: 0,
          brightness: 1
        },

        color2: {
          rotate: -90,
          alpha: 0,
          brightness: 0.8
        }
      },

      idle: {
        color1: {
          rotate: 0,
          alpha: 1,
          brightness: 1
        },

        color2: {
          rotate: -90,
          alpha: 1,
          brightness: 0.8
        }
      },

      over: {
        color1: {
          rotate: 90,
          alpha: 1,
          brightness: 0.4
        },

        color2: {
          rotate: 0,
          alpha: 1,
          brightness: 1
        }
      },

      selected: {
        color1: {
          rotate: -20,
          alpha: 1,
          brightness: 0.9
        },

        color2: {
          rotate: -90,
          alpha: 1,
          brightness: 0.8
        }
      }
    },

    transitions: [
      { from: 'out', to: 'idle', bi: true },
      { from: 'idle', to: 'over', bi: true },
      { from: 'over', to: 'selected', bi: true }
    ],

    parsers: {
      init: [],
      update: [
        function(target, state) {
          target.style.opacity = state.alpha;
          target.style.transform = 'perspective(600px) rotateY(' + state.rotate + 'deg)';
          target.style.filter = 'brightness(' + state.brightness + ')';
          target.style.webkitFilter = 'brightness(' + state.brightness + ')';
        }
      ]
    }
  });

  return {
    el: elButton,
    ui: ui
  };
};