import { LitElement, html, css, TemplateResult, PropertyValueMap } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { InterpretController } from './lib/xstate-controller.js';
import { SendEvent } from './lib/events.js';
import { globalMachine } from "./machines/globalMachine.js";
import './elements/user-edit.js';

@customElement('x-app')
export class XApp extends LitElement {
  static styles = css``;

  public xstate = new InterpretController(this, globalMachine, { devTools: true });

  render() {
    const state = this.xstate?.value.getSnapshot();
    const ret: Array<TemplateResult> = [];
    if (state?.matches("initializing")) {
      ret.push(html`
        Loading....
      `);
    }
    else if (state?.matches("idle")) {
      ret.push(html`
        <span>User name: ${state.context.user.name}</span>
        <button @click=${() => this.xstate?.value.send({ type: 'EDIT_USER' })}>edit</button>
      `);
    }
    else if (state?.matches("edit")) {
      ret.push(html`
        <x-user-edit .actor=${this.xstate?.value}></x-user-edit>
      `);
    }

    return ret;
  }

  /**
   * Example
   *
   * The following code is an example of how we can use
   * DOM events to update the state of the controller.
   * This is an alternative to using the send() method
   * using the controller.
   */
  connectedCallback(): void {
    // eslint-disable-next-line wc/guard-super-call
    super.connectedCallback();
    this.addEventListener('SEND', this.sendEventHandler);
  };

  disconnectedCallback(): void {
    // eslint-disable-next-line wc/guard-super-call
    super.disconnectedCallback();
    this.removeEventListener('SEND', this.sendEventHandler);
  }

  // eslint-disable-next-line class-methods-use-this
  sendEventHandler(e: Event) {
    if (e instanceof SendEvent) {
      this.xstate?.value?.send(e.event);
    }
  }
}
