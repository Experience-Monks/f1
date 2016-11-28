// Type definitions for f1 8.0.0
// Project: Jam3/F1
// Definitions by: Wenchen Li <https://github.com/neolwc>

/// <reference types="node" />

declare module 'f1' {
  export = f1;
  function f1 (settings: any): f1.f1;
  namespace f1 {
    interface f1 extends NodeJS.EventEmitter {
      targets(targets: any): this;
      states(states: any): this;
      transitions(transitions: any): this;
      parsers(parsersDefinitions: any): this;
      init(initState: string): this;
      destory();
      go(state: string, callback?: void): this;
      set(state: string): this;
      step(deltaTime: number): this;
      update(): this;
      apply(pathToTarget: string, target: any, parserDefinition?: any);
    }
  }
}
