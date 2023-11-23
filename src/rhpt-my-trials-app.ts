import { LitElement, html, css, TemplateResult } from 'lit';
import { property } from 'lit/decorators/property.js';
import { customElement } from 'lit/decorators/custom-element.js';
import './elements/child.js';
import { globalMachine } from "./machines/globalMachine.js";
import { SendEvent } from './lib/events.js';
import { XstateController } from './lib/machine-controller.js';

@customElement('rhpt-my-trials-app')
export class RhptMyTrialsApp extends LitElement {
  static styles = css``;

  public xstate = new XstateController(this);

  @property({ type: Object, attribute: false })
  globalMachine?: typeof globalMachine;

  updated(changedProperties: any) {
    if (changedProperties.has('globalMachine') && this.globalMachine !== undefined) {
      this.xstate.updateMachine(this.globalMachine);
    }
  }

  render() {
    const { state } = this.xstate

    const ret: Array<TemplateResult> = [];
    if (state?.matches("initializing")) {
      ret.push(html`
        Loading....
      `);
    }
    else if (state?.matches("idle")) {
      ret.push(html`
        <div>User Name: ${state.context.user.name}</div>
        <rhpt-my-trials-child .xstate=${this.xstate}></rhpt-my-trials-child>
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
      this.xstate?.globalActor?.send(e.event);
    }
  }
}
