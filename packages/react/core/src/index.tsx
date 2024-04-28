import useDeepCompareEffectHook from './hooks/useDeepCompareEffect';

export type {
    ChatAdapter,
    ChatAdapterBuilder,
    ChatAdapterExtras,
    StreamingAdapterObserver,
    StandardChatAdapter,
    DataTransferMode,
    LayoutOptions,
    PromptBoxOptions,
    ConversationOptions,
    HighlighterExtension,
} from '@nlux/core';

export type {
    EventName,
    EventCallback,
    EventsMap,
    ErrorCallback,
    ErrorEventDetails,
    ReadyCallback,
    ReadyEventDetails,
    PreDestroyCallback,
    PreDestroyEventDetails,
    MessageSentCallback,
    MessageReceivedCallback,
} from '@nlux/core';

export type {
    PersonaOptions,
    BotPersona,
    UserPersona,
} from './exports/personaOptions';

export type {
    AiChatProps,
} from './exports/props';


export type {
    ResponseComponentProps,
    ResponseComponent,
    PromptComponentProps,
    PromptComponent,
    MessageOptions,
} from './exports/messageOptions';

export {
    AiChat,
} from './exports/AiChat';

export type {
    UpdateContextItem,
    DiscardContextItem,
} from './providers/useAiContext';

export {
    useAiContext,
} from './providers/useAiContext';

export {
    useAiTask,
} from './providers/useAiTask';

export type {
    AiContext,
    AiContextProviderProps,
} from './types/AiContext';

export {
    createAiContext,
} from './providers/createAiContext';

export const useDeepCompareEffect = useDeepCompareEffectHook;
