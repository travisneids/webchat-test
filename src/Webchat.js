import React, { Component } from "react";
import * as FlexWebChat from "@twilio/flex-webchat-ui";

const configuration = {
  accountSid: process.env.REACT_APP_TWILIO_ACCOUNT_SID,
  flexFlowSid: process.env.REACT_APP_TWILIO_FLEX_FLOW_SID,
  startEngagementOnInit: false,
  context: {
    topic: "General",
    worker: localStorage.worker || null
  },
  preEngagementConfig: {
    description: "Hey there!",
    fields: [
      {
        label: "What is your first name?",
        type: "InputItem",
        attributes: {
          name: "friendlyName",
          type: "text",
          placeholder: "Name",
          required: false
        }
      },
      {
        label: "What is your phone number?",
        type: "InputItem",
        attributes: {
          name: "customerNumber",
          type: "text",
          placeholder: "Number",
          required: false,
          value: localStorage.number || null
        }
      },
      {
        label: "How can we help you?",
        type: "TextareaItem",
        attributes: {
          name: "question",
          type: "text",
          placeholder: "Type your question here",
          required: false,
          rows: 5
        }
      }
    ],
    submitLabel: "Ok Let's Go!"
  }
};

export default class WebChat extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    FlexWebChat.createWebChat(configuration).then(webchat => {
      const { manager } = webchat;

      FlexWebChat.Actions.on("afterStartEngagement", payload => {
        const { question } = payload.formData;
        if (!question) {
          return;
        }

        const { channelSid } = manager.store.getState().flex.session;
        manager.chatClient
          .getChannelBySid(channelSid)
          .then(channel => channel.sendMessage(question));
      });

      manager.strings.PredefinedChatMessageBody =
        "The next available Customer Services agent will be with you shortly.";
      webchat.init();
    });
  }
  render() {
    console.log(process.env.REACT_APP_TWILIO_FLEX_FLOW_SID)
    const { manager, error } = this.state;
    if (manager) {
      return (
        <FlexWebChat.ContextProvider manager={manager}>
          <FlexWebChat.RootContainer />
        </FlexWebChat.ContextProvider>
      );
    }

    if (error) {
      console.error("Failed to initialize Flex Web Chat", error);
    }

    return null;
  }
}
