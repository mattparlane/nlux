import {
    ChatAdapter,
    ChatAdapterBuilder,
    ChatItem,
    ConversationOptions,
    EventsMap,
    HighlighterExtension,
    LayoutOptions,
    PromptBoxOptions,
} from '@nlux/core';
import {FunctionComponent} from 'react';
import {PersonaOptions} from './personaOptions';

/**
 * Props for the AiChat component.
 */
export type AiChatComponentProps<MessageType> = {
    /**
     * The chat adapter to use.
     * This can be an instance of a chat adapter, or a chat adapter builder.
     */
    adapter: ChatAdapter | ChatAdapterBuilder;

    /**
     * A map of event handlers.
     */
    events?: Partial<EventsMap>;

    /**
     * The class name to add to the root element of the component.
     */
    className?: string;

    /**
     * The theme ID to use.
     * This should be the ID of a theme that has been loaded into the page.
     */
    themeId?: string;

    /**
     * The initial conversation to display.
     */
    initialConversation?: ChatItem<MessageType>[];

    /**
     * The syntax highlighter to use.
     */
    syntaxHighlighter?: HighlighterExtension;

    /**
     * Options for the conversation.
     */
    conversationOptions?: ConversationOptions;

    /**
     * Custom AI message renderer.
     */
    aiMessageComponent?: FunctionComponent<{message: MessageType}>;

    /**
     * Layout options.
     */
    layoutOptions?: LayoutOptions;

    /**
     * Options for the prompt box.
     */
    promptBoxOptions?: PromptBoxOptions;

    /**
     * Options for the persona.
     */
    personaOptions?: PersonaOptions;
};