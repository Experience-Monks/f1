module.exports = {
  pre: {
    bg: {
      alpha: 0,
      position: [ 0, -100 ],
      text: 'pre',
      someBoolean: false
    }
  },

  idle: {
    bg: {
      alpha: 1,
      position: [ 0, 0 ],
      text: 'idle',
      someBoolean: true
    }
  },

  rollOver: {
    bg: {
      alpha: 1,
      position: [ 10, 0 ],
      text: 'rollOver',
      someBoolean: false
    }
  },

  post: {
    bg: {
      alpha: 0,
      position: [ 0, 100 ],
      text: 'post',
      someBoolean: true
    }
  }
};