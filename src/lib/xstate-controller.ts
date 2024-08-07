/* eslint-disable max-classes-per-file */
import type { ReactiveController, ReactiveControllerHost } from "lit";
import { InterpreterFrom, interpret, AnyStateMachine, AnyActorRef, Subscription, InterpreterOptions, AnyState } from "xstate";

export class InterpretController<T extends AnyStateMachine> implements ReactiveController {
  host: ReactiveControllerHost;

  value: InterpreterFrom<T>;

  constructor(host: ReactiveControllerHost, machine: T, options?: InterpreterOptions) {
    (this.host = host).addController(this);
    this.value = interpret(machine, options ?? {}) as InterpreterFrom<T>;
    this.value?.onTransition(() => {
      this.host.requestUpdate();
    }).start();
  }

  hostDisconnected() {
    this.value.stop();
  }
}

export class ActorController<T extends AnyActorRef> implements ReactiveController {
  host: ReactiveControllerHost;

  private sub?: Subscription;

  constructor(host: ReactiveControllerHost, public actor: T, public log?: boolean) {
    (this.host = host).addController(this);
  }

  hostConnected() {
    this.sub = this.actor.subscribe((state) => {
      if (this.log) {
        console.log(state);
      }
      this.host.requestUpdate();
    })
  }

  unsubscribe() {
    this.sub?.unsubscribe();
  }

  hostDisconnected() {
    this.unsubscribe();
  }
}

