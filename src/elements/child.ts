import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import { property } from "lit/decorators/property.js";
import { XstateController } from '../lib/machine-controller.js';
import { ref, createRef } from 'lit/directives/ref.js';
import { SendEvent } from '../lib/events.js';

@customElement('rhpt-my-trials-child')
export class RhptMyTrialsApp extends LitElement {
  static styles = css``;

  #inputRef = createRef<HTMLInputElement>();

  @property()
  xstate?: XstateController

  sendControllerEvent() {
    const value = this.#inputRef.value?.value;
    if (value) {
      const user = { name: value };
      this.xstate?.globalActor?.send({ type: 'UPDATE_USER', payload: { user } });
    }
  }

  sendCustomEvent() {
    const value = this.#inputRef.value?.value;
    if (value) {
      this.dispatchEvent(new SendEvent({ type: 'UPDATE_USER', payload: { user: { name: value } } }))
    }
  }

  render() {
    const { state } = this.xstate ?? {};
    return html`
      User name: ${state?.context.user?.name}
      <input ${ref(this.#inputRef)} value=${state?.context.user.name} />
      <button @click=${this.sendControllerEvent}>Update using controller</button>
      <button @click=${this.sendCustomEvent}>Update using custom event</button>
    `
  }
}
