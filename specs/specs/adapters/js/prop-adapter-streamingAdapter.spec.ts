import {AiChat, createAiChat} from '@nlux-dev/core/src';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../utils/adapterBuilder';
import {AdapterController} from '../../../utils/adapters';
import {waitForMdStreamToComplete, waitForMilliseconds, waitForRenderCycle} from '../../../utils/wait';

describe('createAiChat() + withAdapter(streamingAdapter)', () => {
    let adapterController: AdapterController;
    let rootElement: HTMLElement;
    let aiChat: AiChat;

    beforeEach(() => {
        rootElement = document.createElement('div');
        document.body.append(rootElement);
        adapterController = adapterController = adapterBuilder()
            .withBatchText(false)
            .withStreamText(true)
            .create();
    });

    afterEach(() => {
        aiChat?.unmount();
        rootElement?.remove();
    });

    it('streamText should be called with the text from the composer and an observer', async () => {
        // Arrange
        aiChat = createAiChat().withAdapter(adapterController!.adapter);
        aiChat.mount(rootElement);
        await waitForRenderCycle();
        const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-composer > textarea')!;

        // Act
        await userEvent.type(textArea, 'Hello{enter}');
        await waitForRenderCycle();

        // Assert
        expect(adapterController.streamTextMock).toHaveBeenCalledWith(
            'Hello',
            expect.objectContaining({
                next: expect.anything(),
                error: expect.anything(),
                complete: expect.anything(),
            }),
        );
    });

    it('Composer should switch to loading state on click', async () => {
        // Arrange
        aiChat = createAiChat().withAdapter(adapterController!.adapter);
        aiChat.mount(rootElement);
        await waitForRenderCycle();
        const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-composer > textarea')!;
        const sendButton: HTMLButtonElement = rootElement.querySelector('.nlux-comp-composer > button')!;
        const composer: HTMLDivElement = rootElement.querySelector('.nlux-comp-composer')!;

        // Act
        await userEvent.type(textArea, 'Hello');
        await waitForRenderCycle();

        // Assert
        expect(textArea).not.toBeDisabled();
        expect(sendButton).not.toBeDisabled();
        expect(composer).not.toHaveClass('nlux-composer--submitting');

        // Act
        await userEvent.click(sendButton);
        await waitForRenderCycle();

        // Assert
        expect(textArea).toBeDisabled();
        expect(sendButton).toBeDisabled();
        expect(composer).toHaveClass('nlux-composer--submitting');
    });

    it('Composer should be in waiting state until complete() is called', async () => {
        // Arrange
        aiChat = createAiChat().withAdapter(adapterController!.adapter);
        aiChat.mount(rootElement);
        await waitForRenderCycle();
        const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-composer > textarea')!;
        const sendButton: HTMLButtonElement = rootElement.querySelector('.nlux-comp-composer > button')!;
        const composer: HTMLDivElement = rootElement.querySelector('.nlux-comp-composer')!;

        // Act
        await userEvent.type(textArea, 'Hello{enter}');
        await waitForRenderCycle();

        adapterController.next('Human!');
        await waitForMilliseconds(100);

        // Assert
        expect(textArea).not.toBeDisabled();
        expect(sendButton).toBeDisabled();
        expect(composer).toHaveClass('nlux-composer--waiting');

        // Act
        adapterController.complete();
        await waitForMilliseconds(100);

        // Assert
        expect(textArea).not.toBeDisabled();
        expect(composer).toHaveClass('nlux-composer--typing');
    });

    it('Composer should remain in loading state until error() is called', async () => {
        // Arrange
        aiChat = createAiChat().withAdapter(adapterController!.adapter);
        aiChat.mount(rootElement);
        await waitForRenderCycle();
        const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-composer > textarea')!;
        const sendButton: HTMLButtonElement = rootElement.querySelector('.nlux-comp-composer > button')!;
        const composer: HTMLDivElement = rootElement.querySelector('.nlux-comp-composer')!;

        // Act
        await userEvent.type(textArea, 'Hello{enter}');
        await waitForRenderCycle();

        // Assert
        expect(textArea).toBeDisabled();
        expect(sendButton).toBeDisabled();
        expect(composer).toHaveClass('nlux-composer--submitting');
        expect(composer).not.toHaveClass('nlux-composer--typing');

        // Act
        adapterController.error(new Error('Something went wrong'));
        await waitForRenderCycle();

        // Assert
        expect(textArea).not.toBeDisabled();
        expect(sendButton).not.toBeDisabled();
        expect(composer).not.toHaveClass('nlux-composer--submitting');
        expect(composer).toHaveClass('nlux-composer--typing');
    });

    it('Composer should be reset but submit should remain disabled when text is being streamed', async () => {
        // Arrange
        aiChat = createAiChat().withAdapter(adapterController!.adapter);
        aiChat.mount(rootElement);
        await waitForRenderCycle();
        const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-composer > textarea')!;
        const sendButton: HTMLButtonElement = rootElement.querySelector('.nlux-comp-composer > button')!;
        const composer: HTMLDivElement = rootElement.querySelector('.nlux-comp-composer')!;

        // Act
        await userEvent.type(textArea, 'Hello{enter}');
        await waitForRenderCycle();

        adapterController.next('Hi');
        await waitForRenderCycle();
        await waitForMilliseconds(100);

        adapterController.next('Human!');
        await waitForRenderCycle();
        await waitForMilliseconds(100);

        // Assert
        expect(textArea).not.toBeDisabled();
        expect(sendButton).toBeDisabled();
        expect(composer).toHaveClass('nlux-composer--waiting');
        expect(composer).not.toHaveClass('nlux-composer--typing');

        // Act
        await userEvent.type(textArea, 'So?');
        await waitForMilliseconds(100);
        expect(sendButton).toBeDisabled();
    });

    it('Text being returned by the adapter should be rendered as it is streamed', async () => {
        // Arrange
        aiChat = createAiChat().withAdapter(adapterController!.adapter);
        aiChat.mount(rootElement);
        await waitForRenderCycle();
        const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-composer > textarea')!;

        // Act
        await userEvent.type(textArea, 'Hello{enter}');
        await waitForRenderCycle();

        adapterController.next('Yo');
        await waitForMdStreamToComplete();

        // Assert
        const messages = rootElement.querySelector('.nlux_msg_received')!;
        expect(messages).toHaveTextContent('Yo');

        // Act
        adapterController.next(' Human!');
        await waitForMdStreamToComplete();

        // Assert
        expect(messages).toHaveTextContent('Yo Human!');
    });
});
