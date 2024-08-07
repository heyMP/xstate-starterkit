import { createMachine, assign, EventFrom, Prop, StateValueFrom } from "xstate";

export type User = {
  name?: string;
}

export const globalMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5RQDYHsBGBDFBZLAxgBYCWAdmAHTkkAuJOJAXuVAMQRoXVkBuaAayoAzMLWIB5YaIBOsAIIFaaGQG0ADAF1EoAA5pYdElx0gAHogDMADgBslAKwB2ACwuAnO-Xvrnh9YAaEABPRABGf0pbACYHAF84oNRMHHxicioaekYWMnYwGRkVSl0ULFphFQBbSlFxIilZBSUVDW0kEH1DehMOiwQbJ0pol1tLV29fd38g0IRY6Mpp9XUHZycHMJ9reMSQZOw8QlJuLIYUZlY2M5zINtMuo17Qfpdo+zHbTy8fP2tLWbhdSLJxhMKWMK2TbWMGrawJPZkNAQOCmA6pY4ZB4GJ5kUz9AC0tkBCAiwzBlnUTksLnBo1sLgSSXQhzSJ0yZCMOVY2O6xjxfUQbxJEXslk2Dhiu2ZKSO6VOEBQYF5uPxiAcPiW-3cMRc6lstkhAJC4Sc7koO1FsQRcSAA */
  id: "globalMachine",
  predictableActionArguments: true,
  tsTypes: {} as import("./globalMachine.typegen").Typegen0,
  initial: 'initializing',
  schema: {
    context: {} as {
      debug: boolean,
      user: User
    },
    events: {} as
      | { type: 'UPDATE_USER', payload: { user: Partial<User> } }
      | { type: 'EDIT_USER' }
      | { type: 'CANCEL' }
  },
  context: {
    debug: false,
    user: {}
  },
  on: {
    'UPDATE_USER': {
      actions: 'updateUser'
    },
  },
  states: {
    'initializing': {
      after: {
        1000: {
          target: 'idle'
        }
      }
    },
    'idle': {
      on: {
        'EDIT_USER': {
          target: 'edit'
        }
      }
    },
    'edit': {
      on: {
        'UPDATE_USER': {
          target: 'idle',
          actions: 'updateUser'
        },
        'CANCEL': {
          target: 'idle'
        },
      }
    },
  }
},
  {
    actions: {
      updateUser: assign({
        user: (context, event) => ({
          ...context.user,
          ...event.payload.user
        })
      })
    },
  }
);


export type GlobalMachineState = StateValueFrom<typeof globalMachine>; // "initializing" | "idle"
export type GlobalMachineEvent = EventFrom<typeof globalMachine>;
export type GlobalMachineEventName = Prop<GlobalMachineEvent, "type">; // "FETCH_OFFERS" | "CHILD"
