import { useChat } from '../hooks/useChat';
import { ChatBubbleButton } from './ChatBubbleButton';
import { ChatWindow } from './ChatWindow';

export const ChatWidget = () => {
  const { isOpen, toggleChat, closeChat, messages, isTyping, sendMessage } = useChat();

  return (
    <>
      <ChatBubbleButton isOpen={isOpen} onClick={toggleChat} />
      {isOpen && (
        <ChatWindow
          messages={messages}
          isTyping={isTyping}
          onClose={closeChat}
          onSend={sendMessage}
        />
      )}
    </>
  );
};
