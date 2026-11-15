"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import {
  Bot,
  X,
  Maximize2,
  Minimize2,
  MessageCircle,
  Loader2,
  RotateCcw,
  ArrowUp,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const MAX_MESSAGE_LENGTH = 3000;
const MAX_MESSAGES = 20;
const MAX_ASSISTANT_MESSAGE_LENGTH = 4000;
const MAX_TOTAL_CONVERSATION_LENGTH = 30000;
const MAX_TEXTAREA_HEIGHT = 200;

const SUGGESTED_QUESTIONS = [
  "What technologies does Andrea work with?",
  "Tell me about Andrea's commercial projects.",
  "What is Andrea's professional experience?",
  "Where is Andrea located?",
];

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const abortControllerRef = useRef(null);
  const requestInProgressRef = useRef(false);
  const requestIdRef = useRef(0);

  const hasReachedLimit = messages.length >= MAX_MESSAGES - 1;

  const canSend =
    input.trim().length > 0 &&
    input.trim().length <= MAX_MESSAGE_LENGTH &&
    !isLoading &&
    !hasReachedLimit;

  // Mount the portal only on the client.
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Automatically resize the textarea.
  useEffect(() => {
    const textarea = inputRef.current;

    if (!textarea || !isOpen) return;

    // Reset height to measure the full content.
    textarea.style.height = "auto";

    // Grow until reaching the maximum allowed height.
    const newHeight = Math.min(textarea.scrollHeight, MAX_TEXTAREA_HEIGHT);

    textarea.style.height = `${Math.max(48, newHeight)}px`;

    // Scroll internally only when the content exceeds the limit.
    textarea.style.overflowY =
      textarea.scrollHeight > MAX_TEXTAREA_HEIGHT ? "auto" : "hidden";
  }, [input, isOpen, isExpanded]);

  // Scroll to the latest message.
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messages, isLoading, error, isOpen, isExpanded]);

  // Focus the input when opening the chatbot.
  useEffect(() => {
    if (!isOpen) return;

    const timeout = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    return () => clearTimeout(timeout);
  }, [isOpen, isExpanded]);

  // Prevent background scrolling in fullscreen mode.
  useEffect(() => {
    if (!isOpen || !isExpanded) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, isExpanded]);

  // Abort pending requests when the component unmounts.
  useEffect(() => {
    return () => {
      requestIdRef.current += 1;
      abortControllerRef.current?.abort();
    };
  }, []);

  // Send a message to Gemini.
  const sendMessage = useCallback(
    async (text) => {
      const content = text?.trim();

      if (
        !content ||
        content.length > MAX_MESSAGE_LENGTH ||
        hasReachedLimit ||
        requestInProgressRef.current
      ) {
        return;
      }

      const nextMessages = [...messages, { role: "user", content }];

      // Keep requests compatible with backend validation.
      const totalLength = nextMessages.reduce(
        (total, message) => total + message.content.length,
        0,
      );

      if (totalLength > MAX_TOTAL_CONVERSATION_LENGTH) {
        setError(
          "This conversation is too long. Please start a new conversation.",
        );
        return;
      }

      requestInProgressRef.current = true;
      const requestId = ++requestIdRef.current;

      setIsLoading(true);
      setError("");
      setInput("");
      setMessages(nextMessages);

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: nextMessages,
          }),
          signal: controller.signal,
        });

        const data = await response.json().catch(() => ({}));

        if (requestId !== requestIdRef.current) return;

        if (!response.ok) {
          throw new Error(
            data.error || "Sorry, I'm having trouble responding right now.",
          );
        }

        if (typeof data.reply !== "string" || !data.reply.trim()) {
          throw new Error("The AI assistant returned an empty response.");
        }

        const reply = data.reply.trim();

        if (reply.length > MAX_ASSISTANT_MESSAGE_LENGTH) {
          throw new Error("The AI response was too long. Please try again.");
        }

        setMessages((current) => [
          ...current,
          {
            role: "assistant",
            content: reply,
          },
        ]);
      } catch (err) {
        if (requestId !== requestIdRef.current || err.name === "AbortError") {
          return;
        }

        // Restore the user's message after a failed request.
        setMessages(messages);
        setInput(content);

        setError(
          err.message || "Sorry, I'm having trouble responding right now.",
        );
      } finally {
        if (requestId === requestIdRef.current) {
          requestInProgressRef.current = false;
          abortControllerRef.current = null;
          setIsLoading(false);
        }
      }
    },
    [messages, hasReachedLimit],
  );

  // Start a new conversation.
  const resetConversation = useCallback(() => {
    requestIdRef.current += 1;
    abortControllerRef.current?.abort();

    abortControllerRef.current = null;
    requestInProgressRef.current = false;

    setMessages([]);
    setInput("");
    setError("");
    setIsLoading(false);

    inputRef.current?.focus();
  }, []);

  // Close the chatbot.
  const closeChatbot = () => {
    setIsOpen(false);
    setIsExpanded(false);
  };

  // Submit the message.
  const handleSubmit = (event) => {
    event.preventDefault();

    if (canSend) {
      sendMessage(input);
    }
  };

  // Enter sends; Shift + Enter inserts a newline.
  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();

      if (canSend) {
        sendMessage(input);
      }
    }
  };

  // Shared chat window for regular and fullscreen modes.
  const chatWindow = (
    <div
      role="dialog"
      aria-label="Andrea AI chatbot"
      aria-modal={isExpanded}
      className={`
        flex flex-col overflow-hidden
        border border-border
        bg-background text-foreground shadow-2xl

        ${
          isExpanded
            ? "fixed inset-0 z-[9999] h-dvh w-screen rounded-none border-0"
            : "fixed bottom-[88px] right-4 z-[9999] h-[min(720px,calc(100dvh-110px))] w-[min(440px,calc(100vw-32px))] rounded-[28px] sm:right-6"
        }
      `}
    >
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between border-b border-border px-5 py-5">
        <div className="flex min-w-0 items-center gap-3">
          <Bot size={27} className="shrink-0 text-primary" />

          <h2 className="truncate text-lg font-semibold tracking-tight">
            Meet Andrea
          </h2>
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          {messages.length > 0 && (
            <button
              type="button"
              onClick={resetConversation}
              aria-label="New conversation"
              title="New conversation"
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <RotateCcw size={19} />
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsExpanded((current) => !current)}
            aria-label={isExpanded ? "Exit fullscreen" : "Enter fullscreen"}
            title={isExpanded ? "Exit fullscreen" : "Enter fullscreen"}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {isExpanded ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </button>

          <button
            type="button"
            onClick={closeChatbot}
            aria-label="Close chatbot"
            title="Close chatbot"
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X size={23} />
          </button>
        </div>
      </header>

      {/* Conversation area */}
      <div
        className={`
          min-h-0 flex-1 overflow-y-auto px-5 py-6
          ${isExpanded ? "sm:px-10" : ""}
        `}
        role="log"
        aria-label="Chat conversation"
        aria-live="polite"
      >
        <div
          className={`mx-auto space-y-4 ${
            isExpanded ? "max-w-4xl" : "max-w-full"
          }`}
        >
          {/* Welcome message */}
          {messages.length === 0 && (
            <div className="space-y-6">
              <p className="text-base leading-relaxed text-muted-foreground">
                Hey! I'm Andrea's AI assistant. Want to know more about his
                work, experience, or have a project in mind?
              </p>

              <div className="space-y-3">
                {SUGGESTED_QUESTIONS.map((question) => (
                  <button
                    key={question}
                    type="button"
                    onClick={() => sendMessage(question)}
                    disabled={isLoading}
                    className="
                      w-full rounded-full border border-border
                      bg-muted/40 px-5 py-3.5 text-left
                      text-sm font-semibold leading-relaxed
                      text-foreground transition-all
                      hover:border-primary/50 hover:bg-muted
                      disabled:cursor-not-allowed disabled:opacity-50
                    "
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`
                  min-w-0 max-w-[90%] overflow-hidden
                  rounded-2xl px-4 py-3 text-base leading-relaxed

                  ${
                    message.role === "user"
                      ? "rounded-br-sm bg-primary text-primary-foreground"
                      : "rounded-bl-sm border border-border bg-muted/50 text-foreground"
                  }
                `}
              >
                {message.role === "assistant" ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ children }) => (
                        <p className="mb-2 last:mb-0">{children}</p>
                      ),

                      strong: ({ children }) => (
                        <strong className="font-semibold">{children}</strong>
                      ),

                      ul: ({ children }) => (
                        <ul className="my-2 list-disc space-y-1 pl-5">
                          {children}
                        </ul>
                      ),

                      ol: ({ children }) => (
                        <ol className="my-2 list-decimal space-y-1 pl-5">
                          {children}
                        </ol>
                      ),

                      li: ({ children }) => <li>{children}</li>,

                      a: ({ href, children }) => (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="break-words text-primary underline underline-offset-2"
                        >
                          {children}
                        </a>
                      ),

                      code: ({ children }) => (
                        <code className="break-words rounded bg-background/50 px-1 py-0.5 text-xs">
                          {children}
                        </code>
                      ),
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                ) : (
                  <p className="whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                )}
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-2xl border border-border bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
                <Loader2 size={16} className="animate-spin" />
                Thinking
              </div>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div
              role="alert"
              className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
            >
              {error}
            </div>
          )}

          {/* Conversation limit */}
          {hasReachedLimit && !isLoading && (
            <div className="space-y-2 rounded-xl border border-border bg-muted/40 p-4 text-center">
              <p className="text-sm text-muted-foreground">
                You've reached the conversation limit.
              </p>

              <button
                type="button"
                onClick={resetConversation}
                className="text-sm font-medium text-primary hover:underline"
              >
                Start a new conversation
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-border px-4 pb-4 pt-4">
        <div className={`mx-auto ${isExpanded ? "max-w-4xl" : "max-w-full"}`}>
          {/* Privacy disclaimer */}
          <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
            You're chatting with an AI assistant that may occasionally make
            mistakes. Your messages are processed by Google Gemini to generate
            responses. For more accurate information or further questions,
            please contact{" "}
            <Link
              href="mailto:itsandreapiano@gmail.com"
              className="font-medium text-foreground underline underline-offset-2 hover:text-primary"
            >
              itsandreapiano@gmail.com
            </Link>{" "}
            directly.
          </p>

          {/* Auto-expanding message composer */}
          <form onSubmit={handleSubmit}>
            <div className="relative flex items-end rounded-[24px] border border-border bg-muted/40 transition-colors focus-within:border-primary">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(event) => {
                  setInput(event.target.value.slice(0, MAX_MESSAGE_LENGTH));

                  if (error) setError("");
                }}
                onKeyDown={handleKeyDown}
                placeholder="What would you like to know?"
                aria-label="Your message"
                maxLength={MAX_MESSAGE_LENGTH}
                disabled={isLoading || hasReachedLimit}
                rows={1}
                className="
        min-h-[48px] w-full resize-none
        overflow-y-hidden rounded-[24px]
        bg-transparent py-3 pl-4 pr-16
        text-base leading-6 text-foreground
        outline-none
        placeholder:text-muted-foreground
        disabled:cursor-not-allowed disabled:opacity-50
      "
              />

              {/* Send button inside the input */}

              <button
                type="submit"
                disabled={!canSend}
                aria-label="Send message"
                title="Send message"
                className="
    absolute bottom-1.5 right-1.5
    flex h-10 w-10 items-center justify-center
    rounded-full bg-primary text-primary-foreground
    shadow-sm transition-all duration-200
    hover:scale-105 hover:shadow-md
    disabled:cursor-default disabled:opacity-40
    disabled:hover:scale-100
  "
              >
                {isLoading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <ArrowUp size={22} strokeWidth={2.7} />
                )}
              </button>
            </div>
          </form>

          {/* Character counter */}
          <div className="mt-2 flex justify-between gap-2 px-2 text-[10px] text-muted-foreground">
            <span>Enter to send · Shift + Enter for a new line</span>

            <span className="shrink-0 tabular-nums">
              {input.length.toLocaleString()} / 3,000
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  if (!isMounted) return null;

  return (
    <>
      {/* Floating launcher */}
      {!(isOpen && isExpanded) && (
        <div className="fixed bottom-5 right-5 z-[9998] sm:bottom-6 sm:right-6">
          {!isOpen && (
            <span
              aria-hidden="true"
              className="
          pointer-events-none absolute inset-0
          animate-ping rounded-full
          bg-primary/30
        "
              style={{ animationDuration: "3s" }}
            />
          )}

          <button
            type="button"
            onClick={() => setIsOpen((current) => !current)}
            aria-label={isOpen ? "Close AI chatbot" : "Chat with Andrea AI"}
            aria-expanded={isOpen}
            title={isOpen ? "Close chatbot" : "Chat with Andrea AI"}
            className="
        relative flex h-[60px] w-[60px]
        items-center justify-center
        rounded-full border-2 border-primary/40
        bg-primary text-primary-foreground
        shadow-[0_4px_24px_rgba(0,0,0,0.25)]
        transition-all duration-300
        hover:scale-110 hover:shadow-xl
        focus-visible:outline-2
        focus-visible:outline-offset-4
        focus-visible:outline-primary
      "
          >
            {isOpen ? (
              <X size={27} strokeWidth={2.2} />
            ) : (
              <MessageCircle size={28} strokeWidth={2.2} />
            )}
          </button>
        </div>
      )}

      {/* Render chat directly into document.body */}
      {isOpen && createPortal(chatWindow, document.body)}
    </>
  );
}
