// transitions is an array which defines how the the ui component
// should animate through states
module.exports = [
  // this defines that we can animate from the out state to the idle state
  // and from the idle state to the out state because we say it's a "bi-directional"
  // transition by saying `bi: true`
  // 
  // You generally would not have bi: true and would be required to define something like
  // { from: 'out', to: 'idle' },
  // { from: 'idle', to: 'out' }
  { from: 'out', to: 'preIdle', bi: true },

  { from: 'preIdle', to: 'idle', bi: true },

  // this defines how we can animate to the over state from idle and back again
  // for this specific example we're also defining the duration of the animation
  { from: 'idle', to: 'over', bi: true, animation: {
      duration: 0.25
    } 
  }
];