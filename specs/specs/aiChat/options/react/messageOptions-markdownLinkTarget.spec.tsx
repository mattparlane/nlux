import {AiChat} from '@nlux-dev/react/src';
import {render} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {AdapterController} from '../../../../utils/adapters';
import {waitForReactRenderCycle} from '../../../../utils/wait';

describe('<AiChat /> + messageOptions + markdownLinkTarget', () => {
    let adapterController: AdapterController | undefined = undefined;

    beforeEach(() => {
        adapterController = adapterBuilder()
            .withBatchText(true)
            .withStreamText(false)
            .create();
    });

    afterEach(() => {
        adapterController = undefined;
    });

    describe('When markdownLinkTarget is not set', () => {
        it('Markdown links should open in a new window', async () => {
            // Arrange
            const aiChat = (
                <AiChat
                    adapter={adapterController!.adapter}
                />
            );
            const {container} = render(aiChat);
            await waitForReactRenderCycle();
            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-composer > textarea')!;

            await userEvent.type(textArea, 'Give me a link please{enter}');
            await waitForReactRenderCycle();

            // Act
            adapterController!.resolve('Click [here](https://example.com)');
            await waitForReactRenderCycle();

            // Assert
            const markdownContainer = container.querySelector('.nlux-comp-chatItem--received .nlux-markdown-container');
            expect(markdownContainer).toBeInTheDocument();

            const link = markdownContainer!.querySelector('a');
            expect(link).toBeInTheDocument();
            expect(link!.getAttribute('target')).toBe('_blank');
        });

        describe('When markdownLinkTarget is updated to true after mounting', () => {
            it('Markdown links should still open in a new window', async () => {
                // Arrange
                const aiChat = (
                    <AiChat
                        adapter={adapterController!.adapter}
                    />
                );
                const {container, rerender} = render(aiChat);
                await waitForReactRenderCycle();
                const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-composer > textarea')!;

                await userEvent.type(textArea, 'Give me a link please{enter}');
                await waitForReactRenderCycle();

                // Act
                rerender(
                    <AiChat
                        adapter={adapterController!.adapter}
                        messageOptions={{markdownLinkTarget: 'blank'}}
                    />,
                );
                await waitForReactRenderCycle();

                adapterController!.resolve('Click [here](https://example.com)');
                await waitForReactRenderCycle();

                // Assert
                const markdownContainer = container.querySelector('.nlux-comp-chatItem--received .nlux-markdown-container');
                expect(markdownContainer).toBeInTheDocument();

                const link = markdownContainer!.querySelector('a');
                expect(link).toBeInTheDocument();
                expect(link!.getAttribute('target')).toBe('_blank');
            });
        });
    });

    describe('When markdownLinkTarget is set to true', () => {
        it('Markdown links should open in a new window', async () => {
            // Arrange
            const aiChat = (
                <AiChat
                    adapter={adapterController!.adapter}
                    messageOptions={{markdownLinkTarget: 'blank'}}
                />
            );
            const {container} = render(aiChat);
            await waitForReactRenderCycle();
            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-composer > textarea')!;

            await userEvent.type(textArea, 'Give me a link please{enter}');
            await waitForReactRenderCycle();

            // Act
            adapterController!.resolve('Click [here](https://example.com)');
            await waitForReactRenderCycle();

            // Assert
            const markdownContainer = container.querySelector('.nlux-comp-chatItem--received .nlux-markdown-container');
            expect(markdownContainer).toBeInTheDocument();

            const link = markdownContainer!.querySelector('a');
            expect(link).toBeInTheDocument();
            expect(link!.getAttribute('target')).toBe('_blank');
        });

        describe('When markdownLinkTarget is updated to false after mounting', () => {
            it('Markdown links should not open in a new window', async () => {
                // Arrange
                const aiChat = (
                    <AiChat
                        adapter={adapterController!.adapter}
                        messageOptions={{markdownLinkTarget: 'blank'}}
                    />
                );
                const {container, rerender} = render(aiChat);
                await waitForReactRenderCycle();
                const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-composer > textarea')!;

                await userEvent.type(textArea, 'Give me a link please{enter}');
                await waitForReactRenderCycle();

                // Act
                rerender(
                    <AiChat
                        adapter={adapterController!.adapter}
                        messageOptions={{markdownLinkTarget: 'self'}}
                    />,
                );
                await waitForReactRenderCycle();

                adapterController!.resolve('Click [here](https://example.com)');
                await waitForReactRenderCycle();

                // Assert
                const markdownContainer = container.querySelector('.nlux-comp-chatItem--received .nlux-markdown-container');
                expect(markdownContainer).toBeInTheDocument();

                const link = markdownContainer!.querySelector('a');
                expect(link).toBeInTheDocument();
                expect(link!.getAttribute('target')).toBeNull();
            });
        });
    });

    describe('When markdownLinkTarget is set to false', () => {
        it('Markdown links should not open in a new window', async () => {
            const aiChat = (
                <AiChat
                    adapter={adapterController!.adapter}
                    messageOptions={{markdownLinkTarget: 'self'}}
                />
            );
            const {container} = render(aiChat);
            await waitForReactRenderCycle();
            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-composer > textarea')!;

            await userEvent.type(textArea, 'Give me a link please{enter}');
            await waitForReactRenderCycle();

            // Act
            adapterController!.resolve('Click [here](https://example.com)');
            await waitForReactRenderCycle();

            // Assert
            const markdownContainer = container.querySelector('.nlux-comp-chatItem--received .nlux-markdown-container');
            expect(markdownContainer).toBeInTheDocument();

            const link = markdownContainer!.querySelector('a');
            expect(link).toBeInTheDocument();
            expect(link!.getAttribute('target')).toBeNull();
        });
    });
});
