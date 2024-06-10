import {ChatAdapterExtras, StreamingAdapterObserver} from '@nlux/core';
import {NluxUsageError} from '@shared/types/error';
import {warn} from '@shared/utils/warn';
import {ChatAdapterOptions} from '../types/chatAdapterOptions';
import {NLBridgeAbstractAdapter} from './adapter';

export class NLBridgeStreamAdapter<AiMsg> extends NLBridgeAbstractAdapter<AiMsg> {
    constructor(options: ChatAdapterOptions) {
        super(options);
    }

    async batchText(
        message: string,
        extras: ChatAdapterExtras<AiMsg>,
    ): Promise<string | object | undefined> {
        throw new NluxUsageError({
            source: this.constructor.name,
            message: 'Cannot fetch text using the stream adapter!',
        });
    }

    streamText(
        message: string,
        observer: StreamingAdapterObserver<string | object | undefined>,
        extras: ChatAdapterExtras<AiMsg>,
    ): void {
        const submitPrompt = () => {
            fetch(this.endpointUrl, {
                method: 'POST',
                headers: {
                    ...this.headers,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'chat-stream',
                    payload: {
                        message,
                        conversationHistory: extras.conversationHistory,
                        contextId: this.context?.contextId,
                    },
                }),
            }).then(async (response) => {
                if (!response.ok) {
                    throw new Error(`NLBridge adapter returned status code: ${response.status}`);
                }

                if (!response.body) {
                    throw new Error(`NLBridge adapter returned status code: ${response.status}`);
                }

                // Read a stream of server-sent events
                // and feed them to the observer as they are being generated
                const reader = response.body.getReader();
                const textDecoder = new TextDecoder();

                while (true) {
                    const {value, done} = await reader.read();
                    if (done) {
                      break;
                    }
              
                    try {
                        const chunk = textDecoder.decode(value);
                        observer.next(chunk);
                    } catch (err) {
                        warn(`Error parsing chunk by NLBridgeStreamAdapter: ${err}`);
                    }
                }

                observer.complete();
            });
        };

        //
        // When a valid context is available, flush it before submitting the prompt
        //
        if (this.context && this.context.contextId) {
            this.context
                .flush()
                .then(() => submitPrompt())
                // Submit prompt even when flushing fails
                .catch(() => submitPrompt());

            return;
        }

        // Submit prompt when no context is available
        submitPrompt();
    }
}
