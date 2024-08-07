import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import { property } from "lit/decorators/property.js";
import { ref, createRef } from 'lit/directives/ref.js';
import { observed } from '@patternfly/pfe-core/decorators/observed.js';
import { InterpreterFrom } from 'xstate';
import { globalMachine } from '../machines/globalMachine.js';
import { ActorController } from '../lib/xstate-controller.js';
import { SendEvent } from '../lib/events.js';

@customElement('x-user-edit')
export class XUserEdit extends LitElement {
  static styles = css``;

  #inputRef = createRef<HTMLInputElement>();

  @observed
  @property({ type: Object })
  actor?: InterpreterFrom<typeof globalMachine>;

  actorChanged() {
    if (this.actor) {
      new ActorController(this, this.actor);
    }
  }

  sendControllerEvent() {
    const value = this.#inputRef.value?.value;
    if (value) {
      const user = { name: value };
      this.actor?.send({ type: 'UPDATE_USER', payload: { user } });
    }
  }

  sendCustomEvent() {
    const value = this.#inputRef.value?.value;
    if (value) {
      this.dispatchEvent(new SendEvent({ type: 'UPDATE_USER', payload: { user: { name: value } } }))
    }
  }

  render() {
    const state = this.actor?.getSnapshot();
    return html`
      User name:
      <input ${ref(this.#inputRef)} value=${state?.context.user.name} />
      <button @click=${this.sendControllerEvent}>Update</button>
      <button @click=${() => this.actor?.send({ type: 'CANCEL' })}>Cancel</button>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'x-user-edit': XUserEdit;
  }
}
