import React, { useState, useRef, useEffect, useCallback } from "react";
import "./RefactoredChefDrawer.css";

const CloseIcon = ({ size = 16, color = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const SendIcon = ({ size = 16, color = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" fill="currentColor" />
  </svg>
);

const SmileyIcon = ({ size = 20, color = "#F5B800" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
    <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="3" />
    <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="3" />
  </svg>
);

const MicIcon = ({ size = 16, color = "#111827" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </svg>
);

const Volume2Icon = ({ size = 15, color = "#073B30" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
  </svg>
);

const ChefRobotHeaderAvatar = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 54 54" fill="none">
    <circle
      cx="27"
      cy="27"
      r="26"
      fill="#F5B800"
      stroke="#FFE082"
      strokeWidth="1.5"
    />

    <path
      d="M17 20C15 20 13 18 13 16C13 14 15 12 18 12C18.5 9.5 22 7 27 7C32 7 35.5 9.5 36 12C39 12 41 14 41 16C41 18 39 20 37 20H17Z"
      fill="#FFFFFF"
      stroke="#111827"
      strokeWidth="2"
      strokeLinejoin="round"
    />

    <path
      d="M18 20H36V22H18V20Z"
      fill="#F3F4F6"
      stroke="#111827"
      strokeWidth="1.5"
    />

    <rect
      x="14"
      y="22"
      width="26"
      height="22"
      rx="7"
      fill="#FFFFFF"
      stroke="#111827"
      strokeWidth="2.2"
    />

    <rect
      x="10.5"
      y="29"
      width="3.5"
      height="7"
      rx="1.5"
      fill="#111827"
    />

    <rect
      x="40"
      y="29"
      width="3.5"
      height="7"
      rx="1.5"
      fill="#111827"
    />

    <rect
      x="18"
      y="26"
      width="18"
      height="9"
      rx="3"
      fill="#073B30"
    />

    <circle cx="22" cy="30.5" r="2" fill="#34D399" />
    <circle cx="32" cy="30.5" r="2" fill="#34D399" />

    <path
      d="M22 38C24 40 30 40 32 38"
      stroke="#111827"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const ChefHatDecorIcon = () => (
  <svg
    width="44"
    height="44"
    viewBox="0 0 48 48"
    fill="none"
    opacity="0.85"
  >
    <path
      d="M15 28C11 28 8 24 8 20C8 16 11 13 15 13C16 9 20 6 24 6C28 6 32 9 33 13C37 13 40 16 40 20C40 24 37 28 33 28H15Z"
      fill="#F5B800"
      opacity="0.9"
    />

    <path d="M14 28H34V32H14V28Z" fill="#E6AC00" />
  </svg>
);

export default function RefactoredChefDrawer({
  isOpen,
  onClose,
  onNavigate,
  useCanteenHook,
}) {
  const canteenData =
    typeof useCanteenHook === "function" ? useCanteenHook() : {};

  const { menu = [], addToCart, lang = "en" } = canteenData;

  const [messages, setMessages] = useState([
    {
      id: "bot-welcome",
      sender: "bot",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isWelcome: true,
      text:
        "👋 Hello! I'm Chef AI, your canteen assistant.\n\n" +
        "I can help you with:\n" +
        "• Menu details\n" +
        "• Food availability\n" +
        "• Order tracking\n" +
        "• Live canteen crowd\n" +
        "• Voice commands\n\n" +
        "How can I help you today?",
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState(null);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const hasSentVoiceRef = useRef(false);

  const SUGGESTIONS = [
    {
      id: "special",
      label: "Today's Special Dish",
      icon: "🍲",
    },
    {
      id: "chai",
      label: "Order 2 Masala Chai",
      icon: "☕",
    },
    {
      id: "crowd",
      label: "Check Live Crowd",
      icon: "👥",
    },
    {
      id: "biryani",
      label: "Is Biryani in stock?",
      icon: "📦",
    },
    {
      id: "menu",
      label: "Show Full Menu",
      icon: "📖",
    },
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.speechSynthesis
    ) {
      window.speechSynthesis.getVoices();

      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  useEffect(() => {
    return () => {
      if (
        typeof window !== "undefined" &&
        window.speechSynthesis
      ) {
        window.speechSynthesis.cancel();
      }

      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (error) { }
      }
    };
  }, []);

  const cleanSpeechText = (raw) => {
    if (!raw) return "";

    return raw
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/[`_#~]/g, "")
      .replace(/[\u{1F300}-\u{1FAFF}]/gu, "")
      .replace(/[\u{2600}-\u{26FF}]/gu, "")
      .replace(/[\u{2700}-\u{27BF}]/gu, "")
      .trim();
  };

  const speakText = useCallback(
    (textToSpeak, msgId) => {
      if (
        typeof window === "undefined" ||
        !window.speechSynthesis
      ) {
        return;
      }

      if (speakingMsgId === msgId) {
        window.speechSynthesis.cancel();
        setSpeakingMsgId(null);
        return;
      }

      window.speechSynthesis.cancel();

      const clean = cleanSpeechText(textToSpeak);

      if (!clean) return;

      const utterance = new SpeechSynthesisUtterance(clean);

      utterance.lang = lang === "ta" ? "ta-IN" : "en-IN";
      utterance.rate = 1;
      utterance.pitch = 1;

      const voices = window.speechSynthesis.getVoices();

      if (voices && voices.length > 0) {
        const targetLang = lang === "ta" ? "ta" : "en";

        const voice =
          voices.find(
            (v) =>
              v.lang.toLowerCase() ===
              (lang === "ta" ? "ta-in" : "en-in")
          ) ||
          voices.find((v) =>
            v.lang.toLowerCase().startsWith(targetLang)
          ) ||
          voices.find((v) =>
            v.lang.toLowerCase().startsWith("en")
          );

        if (voice) {
          utterance.voice = voice;
        }
      }

      utterance.onstart = () => {
        setSpeakingMsgId(msgId);
      };

      utterance.onend = () => {
        setSpeakingMsgId(null);
      };

      utterance.onerror = () => {
        setSpeakingMsgId(null);
      };

      window.speechSynthesis.speak(utterance);
    },
    [lang, speakingMsgId]
  );

  const handleClose = () => {
    if (
      typeof window !== "undefined" &&
      window.speechSynthesis
    ) {
      window.speechSynthesis.cancel();
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (error) { }
    }

    setIsListening(false);
    setSpeakingMsgId(null);

    onClose();
  };

  const addBotMessage = (text) => {
    const botMsgId = `bot-${Date.now()}`;

    const botMsg = {
      id: botMsgId,
      sender: "bot",
      text,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, botMsg]);

    speakText(text, botMsgId);
  };

  const handleSend = async (textToSend) => {
    const query = (
      textToSend !== undefined ? textToSend : input
    ).trim();

    if (!query || isLoading) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const historyPayload = [
      ...messages,
      userMsg,
    ].map((m) => ({
      sender: m.sender,
      text: m.text,
    }));

    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    const lower = query.toLowerCase();

    if (
      lower.includes("order") &&
      (lower.includes("chai") ||
        lower.includes("tea"))
    ) {
      if (addToCart) {
        addToCart("masala_chai", 2);
      }

      addBotMessage(
        "☕ Done! Added **2 × Masala Chai** to your cart. Ready to checkout!"
      );

      return;
    }

    if (
      lower.includes("check live crowd") ||
      lower.includes("check the crowd") ||
      lower.includes("check crowd") ||
      lower === "crowd" ||
      lower === "live crowd"
    ) {
      if (onNavigate) {
        onNavigate("crowd");
      }

      addBotMessage(
        "👥 I've opened the Crowd Monitor for you. You can check the current crowd level and estimated waiting time for each canteen."
      );

      return;
    }

    if (
      lower.includes("show full menu") ||
      lower.includes("show the menu") ||
      lower.includes("show menu") ||
      lower.includes("open menu") ||
      lower === "menu"
    ) {
      if (onNavigate) {
        onNavigate("menu");
      }

      addBotMessage(
        "📖 Opening the full menu! You can check Meals, Fresh Juices, Snacks, Desserts and other available items."
      );

      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(
        "http://localhost:5000/api/voice/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: query,
            history: historyPayload,
          }),
        }
      );

      if (!res.ok) {
        throw new Error(
          `Server returned ${res.status}`
        );
      }

      const data = await res.json();

      const replyText =
        data && data.reply
          ? data.reply
          : "Sorry, I could not generate a response. Please try again.";

      addBotMessage(replyText);
    } catch (error) {
      console.error(
        "[Chef AI Voice Chat Error]",
        error
      );

      addBotMessage(
        "Sorry, I'm having trouble connecting right now. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const toggleListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      const errorMsg =
        "Voice input is not supported in this browser. Please use Chrome or Edge.";

      addBotMessage(errorMsg);
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (error) { }
      }

      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();

      recognitionRef.current = recognition;

      recognition.lang =
        lang === "ta" ? "ta-IN" : "en-IN";

      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      let recognizedTranscript = "";

      hasSentVoiceRef.current = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        let currentTranscript = "";
        let isFinal = false;

        for (
          let i = event.resultIndex;
          i < event.results.length;
          i++
        ) {
          currentTranscript +=
            event.results[i][0].transcript;

          if (event.results[i].isFinal) {
            isFinal = true;
          }
        }

        recognizedTranscript =
          currentTranscript.trim();

        setInput(recognizedTranscript);

        if (
          isFinal &&
          recognizedTranscript &&
          !hasSentVoiceRef.current
        ) {
          hasSentVoiceRef.current = true;

          try {
            recognition.stop();
          } catch (error) { }

          handleSend(recognizedTranscript);
        }
      };

      recognition.onerror = (event) => {
        console.warn(
          "[SpeechRecognition]",
          event.error
        );

        setIsListening(false);

        if (
          event.error === "not-allowed" ||
          event.error === "service-not-allowed"
        ) {
          addBotMessage(
            "Microphone permission is required for voice input."
          );
        }
      };

      recognition.onend = () => {
        setIsListening(false);

        if (
          recognizedTranscript &&
          !hasSentVoiceRef.current
        ) {
          hasSentVoiceRef.current = true;

          handleSend(recognizedTranscript);
        }
      };

      recognition.start();
    } catch (error) {
      console.error(
        "SpeechRecognition start error:",
        error
      );

      setIsListening(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="ref-chef-backdrop"
      onClick={handleClose}
    >
      <div
        className="ref-chef-window"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Chef AI Assistant"
      >
        <header className="ref-chef-header">
          <div className="ref-chef-head-left">
            <ChefRobotHeaderAvatar size={48} />

            <div className="ref-chef-head-info">
              <div className="ref-chef-title-row">
                <span className="ref-chef-name">
                  Chef AI
                </span>

                <span className="ref-chef-online-pill">
                  <span className="ref-chef-pulse-dot" />
                  <span>Online</span>
                </span>
              </div>

              <div className="ref-chef-subhead">
                Your smart canteen assistant
              </div>

              <div className="ref-chef-desc">
                Real Voice • OpenAI • Friendly
              </div>
            </div>
          </div>

          <div className="ref-chef-head-right">
            <ChefHatDecorIcon />

            <button
              type="button"
              className="ref-chef-close-btn"
              onClick={handleClose}
              title="Close chat"
              aria-label="Close chat"
            >
              <CloseIcon size={16} />
            </button>
          </div>
        </header>

        <div className="ref-chef-body">
          {messages.map((msg) => {
            if (msg.sender === "user") {
              return (
                <div
                  key={msg.id}
                  className="ref-chef-msg-row user"
                >
                  <div className="ref-chef-user-bubble">
                    <p>{msg.text}</p>

                    <span className="ref-chef-msg-time">
                      {msg.time}
                    </span>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={msg.id}
                className="ref-chef-msg-row bot"
              >
                <div className="ref-chef-bot-avatar-sm">
                  <ChefRobotHeaderAvatar size={30} />
                </div>

                <div className="ref-chef-bot-bubble">
                  {msg.isWelcome ? (
                    <>
                      <h4 className="ref-welcome-greeting">
                        👋 Hello! I'm Chef AI, your
                        canteen assistant.
                      </h4>

                      <p className="ref-welcome-intro">
                        I can help you with:
                      </p>

                      <ul className="ref-welcome-list">
                        <li>
                          Menu details & food
                          availability
                        </li>

                        <li>
                          Order tracking &
                          recommendations
                        </li>

                        <li>
                          Live canteen crowd levels
                        </li>

                        <li>
                          Real voice commands &
                          speak-back
                        </li>
                      </ul>

                      <p className="ref-welcome-prompt">
                        How can I help you today?
                      </p>
                    </>
                  ) : (
                    <div className="ref-bot-text-content">
                      {msg.text
                        .split("\n")
                        .map((line, index) => (
                          <p key={index}>
                            {line || "\u00A0"}
                          </p>
                        ))}
                    </div>
                  )}

                  <div className="ref-chef-bot-footer">
                    <span className="ref-chef-msg-time">
                      {msg.time}
                    </span>

                    <button
                      type="button"
                      className={`ref-chef-speaker-btn ${speakingMsgId === msg.id
                          ? "speaking"
                          : ""
                        }`}
                      onClick={() =>
                        speakText(
                          msg.text,
                          msg.id
                        )
                      }
                      title={
                        speakingMsgId === msg.id
                          ? "Stop reading"
                          : "Read aloud"
                      }
                      aria-label={
                        speakingMsgId === msg.id
                          ? "Stop reading"
                          : "Read aloud"
                      }
                    >
                      {speakingMsgId === msg.id ? (
                        <span className="ref-speaking-waves">
                          <span className="wave-bar bar-1" />
                          <span className="wave-bar bar-2" />
                          <span className="wave-bar bar-3" />
                        </span>
                      ) : (
                        <Volume2Icon
                          size={14}
                          color="#073B30"
                        />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="ref-chef-msg-row bot">
              <div className="ref-chef-bot-avatar-sm">
                <ChefRobotHeaderAvatar size={30} />
              </div>

              <div className="ref-chef-bot-bubble ref-chef-thinking">
                <div className="ref-chef-typing-dots">
                  <span />
                  <span />
                  <span />
                </div>

                <span className="ref-chef-thinking-text">
                  Chef AI is thinking...
                </span>
              </div>
            </div>
          )}

          <div className="ref-chef-suggestions-grid">
            {SUGGESTIONS.map((item) => (
              <button
                key={item.id}
                type="button"
                className="ref-chef-suggestion-pill"
                onClick={() =>
                  handleSend(item.label)
                }
                disabled={isLoading}
              >
                <span className="ref-suggestion-icon">
                  {item.icon}
                </span>

                <span className="ref-suggestion-text">
                  {item.label}
                </span>
              </button>
            ))}
          </div>

          <div ref={messagesEndRef} />
        </div>

        <footer className="ref-chef-input-area">
          <button
            type="button"
            className="ref-chef-emoji-btn"
            title="Add emoji"
            onClick={() =>
              setInput((prev) => prev + " 😋 ")
            }
          >
            <SmileyIcon
              size={20}
              color="#F5B800"
            />
          </button>

          <form
            className={`ref-chef-input-form ${isListening ? "is-listening" : ""
              }`}
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <input
              type="text"
              className="ref-chef-text-input"
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              placeholder={
                isListening
                  ? "Listening..."
                  : "Type your message..."
              }
              disabled={isLoading}
            />

            <button
              type="button"
              className={`ref-chef-mic-btn ${isListening ? "listening" : ""
                }`}
              onClick={toggleListening}
              title={
                isListening
                  ? "Stop voice listening"
                  : "Start Voice"
              }
              aria-label={
                isListening
                  ? "Stop voice listening"
                  : "Start Voice"
              }
            >
              {isListening ? (
                <span className="ref-chef-mic-indicator">
                  <span className="ref-chef-mic-red-dot" />
                  <span className="ref-chef-mic-pulse-ring" />
                </span>
              ) : (
                <MicIcon
                  size={16}
                  color="#073B30"
                />
              )}
            </button>

            <button
              type="submit"
              className="ref-chef-send-btn"
              disabled={
                !input.trim() ||
                isListening ||
                isLoading
              }
              title="Send message"
              aria-label="Send message"
            >
              <SendIcon
                size={16}
                color="#111827"
              />
            </button>
          </form>
        </footer>
      </div>
    </div>
  );
}