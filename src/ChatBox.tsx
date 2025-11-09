import React, { useState, useEffect, useRef } from 'react';

// API 配置 - 本地测试使用 localhost，部署后替换为生产环境地址
// const API_URL = 'http://localhost:8787/graphql';
// 生产环境地址（部署到 Cloudflare Workers 后使用）:
const API_URL = 'https://crimson-brook-04a5.hahazuo460.workers.dev//graphql';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (inputValue.trim() === '' || isLoading) return;

    const userMessage: Message = { text: inputValue, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      // GraphQL mutation request
      const graphqlQuery = {
        query: `
          mutation PostMessage($content: String!) {
            postMessage(content: $content) {
              id
              role
              content
            }
          }
        `,
        variables: {
          content: currentInput,
        },
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(graphqlQuery),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      
      // GraphQL 返回格式: { data: { postMessage: { id, role, content } } }
      if (result.errors) {
        throw new Error(result.errors[0]?.message || 'GraphQL error');
      }

      const messageData = result.data?.postMessage;
      if (messageData) {
        // 根据后端返回的 role 判断是 user 还是 bot
        // 如果 role 是 "user"，则显示为用户消息；如果是 "assistant" 或其他，则显示为 bot 消息
        const sender = messageData.role === 'user' ? 'user' : 'bot';
        const botMessage: Message = { 
          text: messageData.content, 
          sender: sender 
        };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      }
    } catch (error) {
      console.error('Error fetching bot response:', error);
      const errorMessage: Message = {
        text: '抱歉，连接出现了问题，请稍后再试。',
        sender: 'bot',
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-box">
      <div className="chat-header">
        <div className="header-title">
          <span className="header-icon">💬</span>
          <span>AI 聊天助手</span>
        </div>
      </div>
      <div className="messages" id="messages-container" ref={messagesContainerRef}>
        {messages.length === 0 && (
          <div className="welcome-message">
            <div className="welcome-icon">👋</div>
            <div className="welcome-text">你好！我是 AI 助手，有什么可以帮助你的吗？</div>
          </div>
        )}
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            <div className="message-content">{message.text}</div>
          </div>
        ))}
        {isLoading && (
          <div className="message bot loading">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-area">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
          placeholder="输入消息..."
          disabled={isLoading}
        />
        <button 
          onClick={handleSendMessage} 
          disabled={isLoading || inputValue.trim() === ''}
          className="send-button"
        >
          {isLoading ? (
            <span className="button-loading">⏳</span>
          ) : (
            <span>发送</span>
          )}
        </button>
      </div>
    </div>
  );
}

export default ChatBox;
