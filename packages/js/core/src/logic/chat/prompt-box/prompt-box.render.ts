import {NluxRenderingError} from '../../../exports/error';
import {CompRenderer} from '../../../types/comp';
import {createPromptBoxDom} from '../../../ui/PromptBox/create';
import {listenToElement} from '../../../utils/dom/listenToElement';
import {domOp} from '../../../utils/domOp';
import {source} from '../../../utils/source';
import {CompPromptBoxActions, CompPromptBoxElements, CompPromptBoxEvents, CompPromptBoxProps} from './prompt-box.types';

export const renderChatbox: CompRenderer<
    CompPromptBoxProps, CompPromptBoxElements, CompPromptBoxEvents, CompPromptBoxActions
> = ({
    appendToRoot,
    props,
    compEvent,
}) => {
    const promptBoxRoot = createPromptBoxDom(props.domCompProps);

    appendToRoot(promptBoxRoot);

    const [textBoxElement, removeTextBoxListeners] = listenToElement(promptBoxRoot, ':scope > textarea')
        .on('input', compEvent('text-updated'))
        .on('keydown', (event: KeyboardEvent) => {
            const isEnter = event.key === 'Enter';
            const aModifierKeyIsPressed = event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;
            if (isEnter && !aModifierKeyIsPressed) {
                compEvent('enter-key-pressed')();
                return;
            }

            const isCommandEnter = event.getModifierState('Meta') && event.key === 'Enter';
            const isControlEnter = event.getModifierState('Control') && event.key === 'Enter';
            if (isCommandEnter || isControlEnter) {
                compEvent('command-enter-key-pressed')();
                return;
            }
        }).get();

    const [sendButtonElement, removeSendButtonListeners] = listenToElement(promptBoxRoot, ':scope > button')
        .on('click', compEvent('send-message-clicked')).get();

    if (!(sendButtonElement instanceof HTMLButtonElement)) {
        throw new Error('Expected a button element');
    }

    if (!(textBoxElement instanceof HTMLTextAreaElement)) {
        throw new NluxRenderingError({
            source: source('prompt-box', 'render'),
            message: 'Expected a textarea element',
        });
    }

    const focusTextInput = () => domOp(() => {
        textBoxElement.focus();
        textBoxElement.setSelectionRange(textBoxElement.value.length, textBoxElement.value.length);
    });

    return {
        elements: {
            root: promptBoxRoot,
            textInput: textBoxElement,
            sendButton: sendButtonElement,
        },
        actions: {
            focusTextInput,
        },
        onDestroy: () => {
            removeTextBoxListeners();
            removeSendButtonListeners();
        },
    };
};