export default (colorMode: 'dark' | 'light') => `import {useMemo} from 'react';
import {AiChat} from '@nlux/react';
import '@nlux/themes/nova.css';
import './custom-nova-theme.css';
import {streamAdapter} from './adapter';
import {user, assistantCssStyle} from './personas';

export default () => {
  const adapter = useMemo(() => streamAdapter, []);
  return (
    <AiChat
      className="custom-ai-chat-comp"
      adapter={adapter}
      personaOptions={{
        assistant: {
          name: 'iAssistant',
          avatar: <span style={assistantCssStyle}>🤖</span>,
          tagline: 'Your Genius AI Assistant'
        },
        user
      }}
      displayOptions={{colorScheme: '${colorMode}'}}
    />
  );
};`;