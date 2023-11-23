import type { ReactiveController, ReactiveControllerHost } from "lit";
import { StateFrom, InterpreterFrom, interpret } from "xstate";
import { globalMachine } from '../machines/globalMachine.js';

export class XstateController implements ReactiveController {
  host: ReactiveControllerHost;

  globalMachine = globalMachine;

  interpretOptions = { devTools: true };

  state?: StateFrom<typeof globalMachine>;

  public globalActor?: InterpreterFrom<typeof globalMachine>;

  #interpretMachine() {
    if (this.globalActor?.initialized) {
      this.globalActor?.stop?.();
    }

    this.globalActor = interpret(this.globalMachine, this.interpretOptions).onTransition(state => {
      this.state = state;
      this.host.requestUpdate();
    }).start();
  }

  constructor(host: ReactiveControllerHost) {
    (this.host = host).addController(this);
  }

  updateMachine(machine: typeof globalMachine) {
    this.globalMachine = machine;
    this.#interpretMachine();
  }

  hostConnected() {
    this.#interpretMachine();
  }

  hostDisconnected() {
    this.globalActor?.stop?.();
  }
}
