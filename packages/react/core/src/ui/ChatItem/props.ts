import {HighlighterExtension} from '@nlux/core';
import {FunctionComponent, ReactElement} from 'react';
import {MessageDirection} from '../../../../../shared/src/ui/Message/props';

export type ChatItemProps<AiMsg> = {
    uid: string;
    direction: MessageDirection;
    status: 'rendered' | 'streaming' | 'loading' | 'error';
    loader?: ReactElement;
    message?: AiMsg | string;
    responseRenderer?: FunctionComponent<{response: AiMsg}>;
    name?: string;
    picture?: string | ReactElement;
    syntaxHighlighter?: HighlighterExtension;
    openLinksInNewWindow?: boolean;
};

export type ChatItemImperativeProps = {
    streamChunk: (chunk: string) => void;
    completeStream: () => void;
};
