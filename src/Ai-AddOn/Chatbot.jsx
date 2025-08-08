import { Link } from "react-router-dom";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { Tooltip } from "react-tooltip";
import axios from "axios";
import { Typewriter } from "react-simple-typewriter";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import remarkBreaks from "remark-breaks";
import { RiVoiceprintFill } from "react-icons/ri";
import { IoArrowUpOutline } from "react-icons/io5";
import { PiGlobeBold } from "react-icons/pi";

const Chatbot = () => {
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionPos, setSuggestionPos] = useState({ top: 0, left: 0 });
  const [showVoiceUI, setShowVoiceUI] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedBot, setSelectedBot] = useState("global");
  const [showInitialUI, setShowInitialUI] = useState(true);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showOnlyLatest, setShowOnlyLatest] = useState(false);
  const inputWrapperRef = useRef(null);
  const [threadId, setThreadId] = useState("");
  const [historyId, setHistoryId] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const isGlobalSelected = selectedBot === "global";
  const isBusinessSelected = selectedBot === "business";
  // apis
  const [response, setResponse] = useState("");
  // const [loading, setLoading] = useState(false);
  const [isNewChat, setIsNewChat] = useState(true);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const Token = localStorage.getItem("token") || "";
  const apiUrl = import.meta.env.VITE_API_URL;

  const inputRef = useRef();
  const chatContainerRef = useRef(null);

  // mute function
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // 👇 Detect scroll to top to reveal old messages
  useEffect(() => {
    const chatDiv = chatContainerRef.current;
    if (!chatDiv) return;

    const handleScroll = () => {
      if (chatDiv.scrollTop === 0 && showOnlyLatest) {
        setShowOnlyLatest(false); // ⬅️ Reveal full history on scroll to top
      }
    };

    chatDiv.addEventListener("scroll", handleScroll);
    return () => chatDiv.removeEventListener("scroll", handleScroll);
  }, [showOnlyLatest]);

  // Suggestions
  const suggestions = [
    "CRM automation via WhatsApp",
    "AI chatbots",
    "Tell me a joke",
    "What is the weather today?",
    "Give me some tips",
  ];

  // const handleInputChange = (e) => {
  //   const value = e.target.value;
  //   setInputValue(value);
  //   setShowSuggestions(value.length > 0);
  // };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    const hasMatchingSuggestions = suggestions.some((sug) =>
      sug.toLowerCase().includes(value.toLowerCase())
    );

    // Only show suggestion dropdown when there's matching result
    setShowSuggestions(value.length > 0 && hasMatchingSuggestions);
  };

  const handleSuggestionClick = (item) => {
    setInputValue(item);
    setShowSuggestions(false);
    inputRef.current.focus();
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const updateSuggestionPosition = () => {
    const rect = inputWrapperRef.current?.getBoundingClientRect();
    if (rect) {
      setSuggestionPos({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
  };

  // Optional: Recalculate on resize/scroll
  useEffect(() => {
    window.addEventListener("resize", updateSuggestionPosition);
    window.addEventListener("scroll", updateSuggestionPosition);
    return () => {
      window.removeEventListener("resize", updateSuggestionPosition);
      window.removeEventListener("scroll", updateSuggestionPosition);
    };
  }, []);

  // history
  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Apis of Ai
  const handleSubmit = async () => {
    if (selectedBot !== "global") return;

    // const userInput = inputValue.trim();
    const userInput = inputValue;
    if (!userInput) return;

    setHasSubmitted(true);
    setInputValue(""); // Clear input after submission

    // Add user message to chat
    setMessages((prev) => [...prev, { role: "user", content: userInput }]);
    setShowOnlyLatest(true);
    scrollToBottom();

    setIsLoading(true); // ✅ show loader
    try {
      const result = await axios.post(
        `${apiUrl}/staff/chat?message`,
        {
          message: userInput,
          threadId: threadId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Token}`,
          },
        }
      );

      const reply = result.data?.response || "No response.";

      setThreadId(result.data?.threadId);
      // const threadId = result.data?.threadId;

      setResponse(reply);
      setIsNewChat(false);
      setShowInitialUI(false);

      // Add assistant reply to chat
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      scrollToBottom();
    } catch (error) {
      console.error("API error:", error);
      const errMsg = "❌ OpenAI API error.";
      setResponse(errMsg);
      setMessages((prev) => [...prev, { role: "assistant", content: errMsg }]);
      setIsNewChat(false);
    } finally {
      setIsLoading(false); // ✅ hide loader
    }
  };

  // const visibleMessages = showOnlyLatest ? messages.slice(-2) : messages;

  // get chat history
  const getChatHistory = async () => {
    try {
      const res = await axios.get(`${apiUrl}/staff/chat-list`, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      });
      setChatHistory(res.data.data);
      console.log("history", res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getChatHistory();
  }, []);

  // get chat history by id
  const [chatHistoryById, setChatHistoryById] = useState([]);
  const getChatHistoryById = async () => {
    try {
      const res = await axios.get(
        `${apiUrl}/staff/chat-by-id?id=${historyId}`,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );
      setChatHistoryById(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (historyId) {
      getChatHistoryById();
    }
  }, [historyId]);

  console.log("IDDDDDD", historyId);

  console.log("historybyid", chatHistoryById);

  // view history chat
  const handleViewHistory = async (userInput, threadIdFromHistory) => {
    if (selectedBot !== "global") return;
    if (!userInput) return;

    setHasSubmitted(true);
    setInputValue(""); // Clear input after submission

    setMessages((prev) => [...prev, { role: "user", content: userInput }]);
    setShowOnlyLatest(true);
    scrollToBottom();

    setIsLoading(true);

    try {
      const result = await axios.post(
        `${apiUrl}/staff/chat`,
        {
          message: userInput,
          threadId: threadIdFromHistory, // ✅ Use passed threadId
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Token}`,
          },
        }
      );

      const reply = result.data?.response || "No response.";
      setThreadId(result.data?.threadId); // Update thread ID
      setResponse(reply);
      setIsNewChat(false);
      setShowInitialUI(false);

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      scrollToBottom();
    } catch (error) {
      console.error("API error:", error);
      const errMsg = "❌ OpenAI API error.";
      setResponse(errMsg);
      setMessages((prev) => [...prev, { role: "assistant", content: errMsg }]);
      setIsNewChat(false);
    } finally {
      setIsLoading(false);
    }
  };

  // delete history by id
  const deleteChatHistory = async () => {
    try {
      const res = await axios.delete(
        `${apiUrl}/staff/chat-delete?id=${historyId}`,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );
      getChatHistory();
    } catch (error) {
      console.log(error);
    }
  };
  // delete all history
  const deleteAllChatHistory = async () => {
    try {
      const res = await axios.delete(`${apiUrl}/staff/delete-all-chat`, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      });
      getChatHistory();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Fragment>
      <div className="page-wrapper p-0">
        <div style={{ padding: sidebarCollapsed ? "0 0 0 6px" : "0 0 0 20px" }}>
          <div className="row ">
            <div className="col-md-12 d-flex p-0">
              {/* history Sidebar */}
              <div
                className={`transition-all sidebar-container ${
                  sidebarCollapsed ? "collapsed" : ""
                }`}
                style={{ backgroundColor: "#f2f2f2", paddingTop: "50px" }}
              >
                <div
                  className={`d-flex w-100 p-2 ${
                    sidebarCollapsed
                      ? "flex-column align-items-center justify-content-center"
                      : "flex-row justify-content-between"
                  }`}
                  style={{ borderBottom: "1px solid #ccc" }}
                >
                  {!sidebarCollapsed && (
                    <img
                      src="/caassa-ai.gif"
                      alt=""
                      style={{
                        height: "30px",
                        width: "30px",
                        objectFit: "cover",
                      }}
                    />
                  )}

                  <Link id="toggle_btn" to="#" onClick={handleToggleSidebar}>
                    <i
                      className="ti ti-arrow-bar-to-left"
                      style={{
                        fontSize: "20px", // size same rahe
                        transition: "transform 0.3s ease",
                        transform: sidebarCollapsed
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                      }}
                    />
                  </Link>
                </div>

                <>
                  <aside
                    className={`p-2 d-flex flex-column ${
                      sidebarCollapsed ? "align-items-center" : ""
                    }`}
                  >
                    <Link className="w-100">
                      <div
                        className={`d-flex ${
                          sidebarCollapsed
                            ? "flex-column align-items-center p-2"
                            : ""
                        }`}
                        style={{ padding: "5px 0px", color: "#6f6f6f" }}
                        data-tooltip-id="sidebar-tooltip"
                        data-tooltip-content={
                          sidebarCollapsed ? "New Chat" : undefined
                        }
                      >
                        <i
                          className={`fa-regular fa-pen-to-square ${
                            sidebarCollapsed ? "bot-icon-hover" : ""
                          }`}
                          style={{
                            fontSize: sidebarCollapsed ? "18px" : "16px",
                            color: "#6f6f6f",
                            padding: sidebarCollapsed ? "5px" : "0px",
                          }}
                          onClick={() => {
                            setIsNewChat(true);
                            setInputValue("");
                            setShowSuggestions(false);
                            setHasSubmitted(false);
                            setResponse("");
                            setMessages([]);
                            setShowInitialUI(true);
                          }}
                        ></i>
                        {!sidebarCollapsed && (
                          <span
                            className="ms-2"
                            onClick={() => {
                              setIsNewChat(true);
                              setInputValue("");
                              setShowSuggestions(false);
                              setHasSubmitted(false);
                              setResponse("");
                              setMessages([]);
                              setShowInitialUI(true);
                            }}
                          >
                            New Chat
                          </span>
                        )}
                      </div>
                    </Link>

                    <Link className="w-100">
                      <div
                        className={`d-flex ${
                          sidebarCollapsed
                            ? "flex-column align-items-center"
                            : ""
                        }`}
                        style={{ padding: "5px 0px", color: "#6f6f6f" }}
                        data-tooltip-id="sidebar-tooltip"
                        data-tooltip-content={
                          sidebarCollapsed ? "Search Chat" : undefined
                        }
                      >
                        <i
                          className={`fas fa-search ${
                            sidebarCollapsed ? "bot-icon-hover" : ""
                          }`}
                          style={{
                            fontSize: sidebarCollapsed ? "18px" : "16px",
                            padding: sidebarCollapsed ? "5px" : "0px",
                          }}
                        ></i>
                        {!sidebarCollapsed && (
                          <span className="ms-2">Search Chat</span>
                        )}
                      </div>
                    </Link>

                    <Link className="w-100">
                      <div
                        className={`d-flex ${
                          sidebarCollapsed
                            ? "flex-column align-items-center"
                            : ""
                        }`}
                        style={{ padding: "5px 0px", color: "#6f6f6f" }}
                        data-tooltip-id="sidebar-tooltip"
                        data-tooltip-content={
                          sidebarCollapsed ? "Library" : undefined
                        }
                      >
                        <i
                          className={`fa-solid fa-book ${
                            sidebarCollapsed ? "bot-icon-hover" : ""
                          }`}
                          style={{
                            fontSize: sidebarCollapsed ? "18px" : "16px",
                            padding: sidebarCollapsed ? "5px" : "0px",
                          }}
                        ></i>
                        {!sidebarCollapsed && (
                          <span className="ms-2">Library</span>
                        )}
                      </div>
                    </Link>

                    {/* Tooltip at bottom */}
                    {sidebarCollapsed && (
                      <Tooltip
                        id="sidebar-tooltip"
                        place="right"
                        style={{ zIndex: 9999 }}
                      />
                    )}
                  </aside>

                  {/* ✅ Scrollable history area */}
                  {!sidebarCollapsed && (
                    <div className="sidebar-history-scroll">
                      <div
                        className="mt-3"
                        style={{ padding: "8px 0px", color: "#8f8f8f" }}
                      >
                        <p>Chat History</p>
                      </div>
                      <div className="chatbot-history-p">
                        {chatHistory.map((text) => (
                          <div
                            key={text.id}
                            className="chatbot-history-row d-flex justify-content-between align-items-center"
                          >
                            {/* <p className="mb-0">{text}</p> */}
                            <p
                              className="mb-0"
                              onClick={() =>
                                handleViewHistory(text.message, text.threadId)
                              }
                            >
                              {text?.message.split(" ").slice(0, 5).join(" ") +
                                (text?.message.split(" ").length > 5
                                  ? "..."
                                  : "")}
                            </p>

                            <i
                              className="ti ti-trash text-danger ms-2"
                              style={{ cursor: "pointer" }}
                              data-bs-toggle="modal"
                              data-bs-target="#delete_chat"
                              onClick={() => setHistoryId(text.id)}
                            />
                          </div>
                        ))}
                      </div>

                      <div
                        className="mt-3 d-flex justify-content-end"
                        style={{ fontSize: "10px" }}
                        data-bs-toggle="modal"
                        data-bs-target="#delete_all_chat"
                      >
                        <Link>Clear all</Link>
                      </div>
                    </div>
                  )}
                </>
                {sidebarCollapsed && (
                  <div className="mb-3 d-flex justify-content-center w-100 h-100 align-items-end">
                    <img
                      src="/caassa-ai.gif"
                      alt="Caassa"
                      style={{
                        height: "30px",
                        width: "30px",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                )}
              </div>
              {/* content */}
              <div
                className={`transition-all ${
                  sidebarCollapsed ? "flex-grow-1" : "flex-shrink-1"
                }`}
                style={{
                  width: sidebarCollapsed ? "calc(100% - 60px)" : "80%",
                }}
              >
                <div
                  className="d-flex"
                  style={{
                    height: "100dvh",
                    isolation: "isolate",
                    backgroundColor: "white",
                  }}
                >
                  <div
                    className="d-flex flex-column flex-md-grow-1"
                    style={{
                      paddingLeft: 0,
                      height: "auto",
                      maxHeight: "100vh",
                      minWidth: 0,
                      isolation: "isolate",
                      gap: window.innerWidth >= 768 ? "4px" : "0",
                    }}
                  >
                    <div
                      className="position-relative flex-grow-1 rounded-lg shadow-sm d-flex"
                      style={{
                        isolation: "isolate",
                        backgroundClip: "border-box",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                      }}
                    >
                      <div
                        className="d-flex flex-column w-100 mx-auto h-100"
                        style={{
                          maxWidth: "100%",
                        }}
                      >
                        <div
                          className="d-flex flex-grow-1 scrollbar-subtle"
                          style={{
                            flexBasis: 0,
                            overflow: "auto",
                            scrollbarGutter: "stable",
                            justifyContent: "center",
                          }}
                        >
                          <div
                            className=" container custom-padding m-0 p-0"
                            style={{
                              width: "100%",
                              height: "100%",
                              maxWidth: "800px",
                            }}
                          >
                            <div
                              className="mx-auto"
                              style={{
                                isolation: "isolate",
                                width: "100%",
                                height: "100%",
                                maxWidth: "800px",
                              }}
                            >
                              <div
                                className="d-flex flex-column position-relative"
                                style={{ height: "100%" }}
                              >
                                <>
                                  {showVoiceUI ? (
                                    <>
                                      <div
                                        className="d-flex flex-column align-items-center justify-content-center pb-5"
                                        style={{ paddingTop: "130px" }}
                                      >
                                        <img
                                          src="/voice2.gif" // <-- replace this with your desired image
                                          alt="business insight"
                                          style={{
                                            height: "200px",
                                            width: "200px",
                                            objectFit: "cover",
                                          }}
                                        />
                                        <span>
                                          I am listening
                                          <Typewriter
                                            words={[".", "..", "..."]}
                                            loop={0}
                                            cursor={false}
                                            typeSpeed={300}
                                            deleteSpeed={100}
                                            delaySpeed={500}
                                            width="5px"
                                          />
                                        </span>
                                      </div>
                                      <div className="d-flex  align-items-center justify-content-center w-100 gap-3 pb-3">
                                        <div
                                          className="voice-bot d-flex align-items-center justify-content-center"
                                          onClick={toggleMute}
                                        >
                                          {isMuted ? (
                                            <i
                                              className="fa-solid fa-microphone-slash"
                                              style={{
                                                fontSize: "18px",
                                                color: "red",
                                              }}
                                            ></i>
                                          ) : (
                                            <i
                                              className="fa-solid fa-microphone"
                                              style={{
                                                fontSize: "18px",
                                                color: "black",
                                              }}
                                            ></i>
                                          )}
                                        </div>

                                        <div
                                          className="voice-bot d-flex align-items-center justify-content-center"
                                          onClick={() => setShowVoiceUI(false)}
                                        >
                                          <i
                                            class="fa-solid fa-xmark"
                                            style={{
                                              fontSize: "18px",
                                              color: "black",
                                            }}
                                          ></i>
                                        </div>
                                      </div>
                                      <div className=" d-flex flex-row justify-content-end pt-5">
                                        <button
                                          className="btn "
                                          data-bs-toggle="modal"
                                          data-bs-target="#cradit_modal"
                                          style={{
                                            backgroundColor: "#FFF7D8",
                                            color: "#FFA201",
                                            padding: "0.1rem 0.2rem",
                                            fontSize: "10px",
                                            // fontWeight: "bold",
                                          }}
                                        >
                                          10 Cradits
                                        </button>
                                      </div>
                                    </>
                                  ) : (
                                    <Fragment>
                                      {messages.length === 0 && (
                                        <>
                                          <div
                                            className="d-flex flex-column align-items-center justify-content-center"
                                            style={{ paddingTop: "160px" }}
                                          >
                                            <img
                                              src="/caassa-ai.gif"
                                              alt=""
                                              style={{
                                                height: "100px",
                                                width: "100px",
                                                objectFit: "cover",
                                              }}
                                            />
                                          </div>
                                          <div className="d-flex flex-column align-items-center justify-content-center">
                                            <span
                                              style={{
                                                fontSize: "20px",
                                                fontWeight: "bold",
                                              }}
                                            >
                                              Hi, I'm Caasaa ai
                                            </span>
                                          </div>
                                          <div className="d-flex flex-column align-items-center justify-content-center">
                                            <span
                                              style={{
                                                fontSize: "16px",
                                                fontWeight: "400",
                                                display: "flex",
                                                alignItems: "center",
                                              }}
                                            >
                                              I know your business{" "}
                                              <img
                                                src="/smileEmoji.jpg"
                                                alt=""
                                                style={{
                                                  height: "30px",
                                                  width: "30px",
                                                }}
                                              />
                                            </span>
                                          </div>
                                        </>
                                      )}

                                      {/* {visibleMessages.length > 0 && ( */}
                                      {messages.length > 0 && (
                                        <div
                                          className="chat-history"
                                          style={{
                                            padding: "55px 16px 16px 16px",
                                            overflowY: "auto",
                                            height: "100%",
                                          }}
                                        >
                                          {/* {visibleMessages.map((msg, index) => ( */}
                                          {messages.map((msg, index) => (
                                            <div
                                              key={index}
                                              style={{
                                                textAlign:
                                                  msg.role === "user"
                                                    ? "right"
                                                    : "left",
                                              }}
                                            >
                                              <p
                                                style={{
                                                  display: "inline-block",
                                                  backgroundColor:
                                                    msg.role === "user"
                                                      ? "#e9e9e980"
                                                      : "",
                                                  padding: "0.5rem 1rem",
                                                  borderRadius: "12px",
                                                  marginBottom: "0.5rem",
                                                  maxWidth: "70%",
                                                  alignItems: "center",
                                                }}
                                              >
                                                {/* <ReactMarkdown> {msg.content}</ReactMarkdown> */}
                                                {/* <ReactMarkdown
                                                  remarkPlugins={[remarkGfm, remarkBreaks]}
                                                  rehypePlugins={[rehypeRaw]}
                                                  components={{
                                                    strong: ({
                                                      node,
                                                      ...props
                                                    }) => (
                                                      <strong
                                                        style={{
                                                          fontWeight: "bold",
                                                        }}
                                                        {...props}
                                                      />
                                                    ),
                                                    em: ({
                                                      node,
                                                      ...props
                                                    }) => (
                                                      <em
                                                        style={{
                                                          fontStyle: "italic",
                                                        }}
                                                        {...props}
                                                      />
                                                    ),
                                                    code: ({
                                                      node,
                                                      ...props
                                                    }) => (
                                                      <code
                                                        style={{
                                                          background: "#f0f0f0",
                                                          padding: "2px 4px",
                                                          borderRadius: "4px",
                                                        }}
                                                        {...props}
                                                      />
                                                    ),
                                                    p: ({ node, ...props }) => (
                                                      <p
                                                        style={{ margin: 0 }}
                                                        {...props}
                                                      />
                                                    ),

                                                    ul: ({
                                                      node,
                                                      ...props
                                                    }) => (
                                                      <ul
                                                        style={{
                                                          paddingLeft: "1.5rem",
                                                          margin: "0.5rem 0",
                                                          listStyleType: "disc", // ✅ bullet points
                                                        }}
                                                        {...props}
                                                      />
                                                    ),
                                                    ol: ({
                                                      node,
                                                      ...props
                                                    }) => (
                                                      <ol
                                                        style={{
                                                          paddingLeft: "1.5rem",
                                                          margin: "0.5rem 0",
                                                          listStyleType:
                                                            "decimal", // ✅ numbers
                                                        }}
                                                        {...props}
                                                      />
                                                    ),
                                                    li: ({
                                                      node,
                                                      ...props
                                                    }) => (
                                                      <li
                                                        style={{
                                                          marginBottom:
                                                            "0.25rem",
                                                        }}
                                                        {...props}
                                                      />
                                                    ),
                                                  }}
                                                >
                                                  {msg.content}
                                                </ReactMarkdown> */}
                                                <ReactMarkdown
                                                  remarkPlugins={[remarkGfm]}
                                                  components={{
                                                    table: (props) => (
                                                      <table
                                                        style={{
                                                          width: "100%",
                                                          borderCollapse:
                                                            "collapse",
                                                          margin: "1rem 0",
                                                        }}
                                                        {...props}
                                                      />
                                                    ),
                                                    thead: (props) => (
                                                      <thead {...props} />
                                                    ),
                                                    tbody: (props) => (
                                                      <tbody {...props} />
                                                    ),
                                                    tr: (props) => (
                                                      <tr
                                                        style={{
                                                          borderBottom:
                                                            "1px solid #ccc",
                                                        }}
                                                        {...props}
                                                      />
                                                    ),
                                                    th: (props) => (
                                                      <th
                                                        style={{
                                                          padding: "8px",
                                                          textAlign: "left",
                                                          backgroundColor:
                                                            "#f2f2f2",
                                                          border:
                                                            "1px solid #ccc",
                                                          width: "auto",
                                                        }}
                                                        {...props}
                                                      />
                                                    ),
                                                    td: (props) => (
                                                      <td
                                                        style={{
                                                          padding: "8px",
                                                          border:
                                                            "1px solid #ccc",
                                                        }}
                                                        {...props}
                                                      />
                                                    ),
                                                  }}
                                                >
                                                  {msg.content}
                                                </ReactMarkdown>
                                              </p>
                                            </div>
                                          ))}

                                          {isLoading && (
                                            <div
                                              style={{
                                                textAlign: "left",
                                                marginTop: "0.5rem",
                                              }}
                                            >
                                              <p
                                                style={{
                                                  display: "flex",
                                                  alignItems: "center",
                                                  gap: "0.5rem",
                                                  padding: "0.5rem 1rem",
                                                  borderRadius: "12px",
                                                  // backgroundColor: "#f0f0f0",
                                                  fontStyle: "italic",
                                                  maxWidth: "fit-content",
                                                }}
                                              >
                                                <img
                                                  src="/caassa-ai.gif"
                                                  alt=""
                                                  style={{
                                                    height: "30px",
                                                    width: "30px",
                                                    objectFit: "cover",
                                                  }}
                                                />
                                                <span
                                                  style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                  }}
                                                >
                                                  Caasaa Bot is typing
                                                  <Typewriter
                                                    words={[".", "..", "..."]}
                                                    loop={0}
                                                    cursor={false}
                                                    typeSpeed={300}
                                                    deleteSpeed={100}
                                                    delaySpeed={500}
                                                  />
                                                </span>
                                              </p>
                                            </div>
                                          )}

                                          <div ref={messagesEndRef} />
                                        </div>
                                      )}

                                      <div
                                        className="d-flex flex-column align-items-center w-100"
                                        style={{
                                          zIndex: 10,
                                          flexGrow: 1,
                                          marginTop: isNewChat
                                            ? "0"
                                            : hasSubmitted
                                            ? "0"
                                            : "auto",
                                          justifyContent: hasSubmitted
                                            ? "flex-end"
                                            : "space-around",
                                          paddingBottom: hasSubmitted
                                            ? "20px"
                                            : "0",
                                          transition: "margin 0.3s ease",
                                        }}
                                      >
                                        <div className="w-100">
                                          <span className="d-block flex-grow-1">
                                            <div
                                              style={{ borderRadius: "rem" }}
                                            >
                                              <div
                                                className="w-100 d-grid align-items-center border shadow-sm px-0 pb-3 transition"
                                                style={{
                                                  outline: "none",
                                                  borderColor: "#ccc",
                                                  // borderRadius:
                                                  //   !hasSubmitted &&
                                                  //   showSuggestions &&
                                                  //   inputValue
                                                  //     ? "1rem 1rem 0 0"
                                                  //     : "1rem",
                                                  borderRadius:
                                                    !hasSubmitted &&
                                                    showSuggestions
                                                      ? "1rem 1rem 0 0"
                                                      : "1rem",

                                                  boxShadow:
                                                    "0 1px 2px rgba(0,0,0,0.05)",
                                                  transition:
                                                    "all 75ms ease-in-out",
                                                  paddingTop: hasSubmitted
                                                    ? "0px"
                                                    : "16px",
                                                }}
                                              >
                                                <div
                                                  className="d-flex flex-column w-100"
                                                  style={{
                                                    paddingLeft: 14,
                                                    paddingRight: 14,
                                                    gridTemplateColumns:
                                                      "repeat(3, 1fr)",
                                                    gridTemplateRows:
                                                      "1fr auto",
                                                  }}
                                                >
                                                  <div
                                                    className="position-relative d-flex w-100 h-100 pb-3"
                                                    style={{
                                                      gridColumn: "1 / 4",
                                                    }}
                                                  >
                                                    <div
                                                      className="w-100"
                                                      style={{
                                                        minHeight: "3em",
                                                        position: "relative",
                                                      }}
                                                    >
                                                      <textarea
                                                        ref={inputRef}
                                                        value={inputValue}
                                                        onChange={
                                                          handleInputChange
                                                        }
                                                        onKeyDown={(e) => {
                                                          if (
                                                            e.key === "Enter" &&
                                                            !e.shiftKey &&
                                                            !isLoading &&
                                                            inputValue.trim() !==
                                                              "" &&
                                                            selectedBot ===
                                                              "global"
                                                          ) {
                                                            e.preventDefault(); // Prevent line break on plain Enter
                                                            handleSubmit();
                                                          }
                                                          // Shift+Enter will naturally insert a new line
                                                        }}
                                                        placeholder="Ask anything…"
                                                        className="form-control input-large-placeholder"
                                                        style={{
                                                          border: "unset",
                                                          outline: "unset",
                                                          background: "unset",
                                                          boxShadow: "unset",
                                                          fontSize: "16px",
                                                          borderRadius:
                                                            "9999px", // rounded-pill
                                                          padding:
                                                            "0.5rem 0.75rem", // same as py-2 px-3
                                                          resize: "none",
                                                          overflow: "hidden", // optional: avoids scrollbar
                                                        }}
                                                        rows={1}
                                                      />

                                                      {!hasSubmitted &&
                                                        showSuggestions &&
                                                        inputValue && (
                                                          <div
                                                            className="bg-white border shadow"
                                                            style={{
                                                              position:
                                                                "absolute",
                                                              top: "272%",
                                                              left: "0.9px",
                                                              width: "103.8%",
                                                              transform:
                                                                "translateX(-1.9%)",
                                                              zIndex: 2000,
                                                              borderRadius:
                                                                "0 0 1rem 1rem",
                                                            }}
                                                          >
                                                            {suggestions
                                                              .filter(
                                                                (suggestion) =>
                                                                  suggestion
                                                                    .toLowerCase()
                                                                    .includes(
                                                                      inputValue.toLowerCase()
                                                                    )
                                                              )
                                                              .map(
                                                                (
                                                                  suggestion,
                                                                  index,
                                                                  arr
                                                                ) => (
                                                                  <div
                                                                    key={index}
                                                                    onClick={() =>
                                                                      handleSuggestionClick(
                                                                        suggestion
                                                                      )
                                                                    }
                                                                    className="px-3 py-2 text-body-secondary small suggestion-item"
                                                                    //     style={{
                                                                    //       cursor:
                                                                    //         "pointer",
                                                                    //         borderRadius:
                                                                    // "0 0 1rem 1rem",
                                                                    //     }}
                                                                    style={{
                                                                      cursor:
                                                                        "pointer",
                                                                      borderRadius:
                                                                        index ===
                                                                        arr.length -
                                                                          1
                                                                          ? "0 0 1rem 1rem"
                                                                          : "0", // ✅ Only last item
                                                                    }}
                                                                    onMouseEnter={(
                                                                      e
                                                                    ) =>
                                                                      (e.currentTarget.style.backgroundColor =
                                                                        "#f8f9fa")
                                                                    }
                                                                    onMouseLeave={(
                                                                      e
                                                                    ) =>
                                                                      (e.currentTarget.style.backgroundColor =
                                                                        "transparent")
                                                                    }
                                                                  >
                                                                    <i className="fas fa-search me-2"></i>
                                                                    {suggestion}
                                                                  </div>
                                                                )
                                                              )}
                                                          </div>
                                                        )}
                                                    </div>
                                                  </div>

                                                  <div className="d-flex align-items-center justify-content-between">
                                                    <div className="d-flex rounded-start bg-light gap-2 ms-n2">
                                                      <div className="d-flex align-items-center gap-1 position-relative">
                                                        {/* Highlight background layer */}
                                                        <div
                                                          className="position-absolute w-100 h-100"
                                                          style={{
                                                            backgroundColor:
                                                              "#21808d1a",
                                                            borderRadius: 11,
                                                            transition:
                                                              "background-color 0.3s",
                                                          }}
                                                        />
                                                        <div
                                                          className="d-flex align-items-center p-1 gap-2"
                                                          style={{ zIndex: 1 }}
                                                        >
                                                          {/* Global Bot */}
                                                          <button
                                                            type="button"
                                                            onClick={() =>
                                                              setSelectedBot(
                                                                "global"
                                                              )
                                                            }
                                                            className="btn position-relative d-flex align-items-center justify-content-center"
                                                            style={{
                                                              border:
                                                                isGlobalSelected
                                                                  ? "1px solid #21808d"
                                                                  : "1px solid transparent",
                                                              color:
                                                                isGlobalSelected
                                                                  ? "#21808d"
                                                                  : "#888",
                                                              backgroundColor:
                                                                isGlobalSelected
                                                                  ? "#fff"
                                                                  : "transparent",
                                                              borderRadius:
                                                                "8px",
                                                              padding:
                                                                "7px 9px",
                                                              boxShadow:
                                                                isGlobalSelected
                                                                  ? "0 1px 4px rgba(0,0,0,0.1)"
                                                                  : "none",
                                                            }}
                                                            data-tooltip-id="global-bot-tooltip"
                                                            data-tooltip-content="Global Bot"
                                                          >
                                                            <PiGlobeBold
                                                              size={16}
                                                            />
                                                          </button>

                                                          {/* Business Bot */}
                                                          <button
                                                            type="button"
                                                            onClick={() =>
                                                              setSelectedBot(
                                                                "business"
                                                              )
                                                            }
                                                            className="btn position-relative d-flex align-items-center justify-content-center"
                                                            style={{
                                                              border:
                                                                isBusinessSelected
                                                                  ? "1px solid #21808d"
                                                                  : "1px solid transparent",
                                                              color:
                                                                isBusinessSelected
                                                                  ? "#21808d"
                                                                  : "#888",
                                                              backgroundColor:
                                                                isBusinessSelected
                                                                  ? "#fff"
                                                                  : "transparent",
                                                              borderRadius:
                                                                "8px",
                                                              padding:
                                                                "7px 9px",
                                                              boxShadow:
                                                                isBusinessSelected
                                                                  ? "0 1px 4px rgba(0,0,0,0.1)"
                                                                  : "none",
                                                            }}
                                                            data-tooltip-id="business-bot-tooltip"
                                                            data-tooltip-content="Business Bot"
                                                          >
                                                            <svg
                                                              xmlns="http://www.w3.org/2000/svg"
                                                              width={16}
                                                              height={16}
                                                              viewBox="0 0 24 24"
                                                              fill="currentColor"
                                                            >
                                                              <path d="M8.175 13.976a.876.876 0 0 1 1.172-.04l.065.061.582.59c.196.194.395.388.596.576l.39.358c1.942 1.753 3.844 2.937 5.357 3.477.81.29 1.444.369 1.884.31.404-.055.61-.216.731-.446.135-.256.209-.678.116-1.31-.08-.546-.275-1.191-.59-1.91l-.141-.313-.034-.083a.875.875 0 0 1 1.575-.741l.042.079.161.353c.36.823.61 1.623.719 2.362.122.836.071 1.675-.3 2.38-.431.818-1.186 1.247-2.044 1.363-.823.111-1.756-.056-2.707-.396-1.912-.681-4.17-2.154-6.357-4.207a30.378 30.378 0 0 1-.63-.61l-.608-.615-.058-.068a.875.875 0 0 1 .079-1.17Zm.624-5.822a.876.876 0 0 1 1.216 1.258c-.396.383-.788.775-1.165 1.178-1.95 2.077-3.26 4.133-3.835 5.747-.29.81-.37 1.444-.31 1.884.055.404.215.61.444.731l.104.048c.261.103.654.149 1.207.068.623-.09 1.378-.333 2.224-.731a.875.875 0 0 1 .745 1.583c-.948.446-1.871.756-2.716.88-.784.114-1.57.078-2.246-.234l-.134-.066c-.817-.431-1.246-1.186-1.362-2.044-.112-.823.056-1.756.395-2.707.64-1.792 1.973-3.889 3.83-5.945l.377-.411c.402-.43.816-.843 1.226-1.239Zm8.5-4.954c.832-.122 1.67-.073 2.372.302h-.001c.814.432 1.243 1.185 1.36 2.042.11.823-.057 1.756-.396 2.707-.682 1.911-2.154 4.17-4.207 6.356h-.001c-.403.429-.818.846-1.236 1.236l-.068.057a.875.875 0 0 1-1.127-1.336l.582-.562c.193-.193.385-.39.573-.592l.359-.39c1.752-1.942 2.937-3.844 3.476-5.357.29-.811.37-1.444.31-1.884-.055-.404-.216-.61-.446-.731l-.003-.002c-.248-.132-.663-.207-1.293-.114-.62.09-1.37.332-2.208.73l-.083.034a.876.876 0 0 1-.667-1.615l.351-.161c.819-.36 1.616-.612 2.353-.72Zm-5.292 7.507a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6ZM5.544 2.971c.823-.112 1.756.056 2.707.395 1.911.682 4.17 2.154 6.356 4.207.214.201.426.406.632.612l.604.625.057.068a.875.875 0 0 1-1.271 1.19l-.065-.063-.562-.582c-.193-.193-.39-.385-.592-.573-2.077-1.95-4.133-3.26-5.747-3.835-.811-.29-1.444-.37-1.884-.31-.404.055-.61.215-.731.444l-.002.004c-.132.248-.207.664-.114 1.294.08.543.275 1.184.588 1.898l.142.31.034.083a.875.875 0 0 1-1.572.746l-.043-.079-.161-.352c-.36-.819-.612-1.615-.72-2.352-.122-.832-.073-1.67.302-2.372.431-.814 1.185-1.242 2.042-1.358Z" />
                                                            </svg>
                                                          </button>

                                                          {/* Tooltips */}
                                                          <Tooltip
                                                            id="global-bot-tooltip"
                                                            place="top"
                                                          />
                                                          <Tooltip
                                                            id="business-bot-tooltip"
                                                            place="top"
                                                          />
                                                        </div>
                                                      </div>
                                                    </div>

                                                    <div
                                                      className="d-flex align-items-center justify-content-end rounded-pill"
                                                      style={{
                                                        backgroundColor:
                                                          "#f8f9fa",
                                                        gridColumnStart: 3,
                                                        gridRowStart: 2,
                                                        cursor: "pointer",
                                                      }}
                                                    >
                                                      <div
                                                        style={{ opacity: 1 }}
                                                      >
                                                        <span>
                                                          <button
                                                            aria-label="Dictation"
                                                            type="button"
                                                            className="btn btn-light d-inline-flex align-items-center justify-content-center"
                                                            style={{
                                                              border: "none",
                                                              backgroundColor:
                                                                "unset",
                                                              color: "#6c757d",
                                                              height: "32px",
                                                              aspectRatio:
                                                                "9 / 8",
                                                              fontSize:
                                                                "0.875rem",
                                                              padding:
                                                                "0 0.75rem",
                                                              transition:
                                                                "all 0.3s ease-out",
                                                              cursor: "pointer",
                                                            }}
                                                            onMouseOver={(
                                                              e
                                                            ) => {
                                                              e.currentTarget.style.backgroundColor =
                                                                "#e9ecef";
                                                              e.currentTarget.style.color =
                                                                "#000";
                                                            }}
                                                            onMouseOut={(e) => {
                                                              e.currentTarget.style.backgroundColor =
                                                                "#f8f9fa";
                                                              e.currentTarget.style.color =
                                                                "#6c757d";
                                                            }}
                                                          >
                                                            <div
                                                              className="d-flex align-items-center justify-content-center"
                                                              style={{
                                                                gap: "0.4rem",
                                                                minWidth: 0,
                                                              }}
                                                            >
                                                              <div
                                                                className="d-flex align-items-center justify-content-center"
                                                                style={{
                                                                  width: "1rem",
                                                                  height:
                                                                    "1rem",
                                                                }}
                                                              >
                                                                <svg
                                                                  xmlns="http://www.w3.org/2000/svg"
                                                                  width={16}
                                                                  height={16}
                                                                  viewBox="0 0 24 24"
                                                                  fill="none"
                                                                  stroke="currentColor"
                                                                  strokeWidth="1.8"
                                                                  strokeLinecap="round"
                                                                  strokeLinejoin="round"
                                                                >
                                                                  <path d="M5 5m0 1a1 1 0 0 1 1 -1h12a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-12a1 1 0 0 1 -1 -1z" />
                                                                  <path d="M9 9h6v6h-6z" />
                                                                  <path d="M3 10h2" />
                                                                  <path d="M3 14h2" />
                                                                  <path d="M10 3v2" />
                                                                  <path d="M14 3v2" />
                                                                  <path d="M21 10h-2" />
                                                                  <path d="M21 14h-2" />
                                                                  <path d="M14 21v-2" />
                                                                  <path d="M10 21v-2" />
                                                                </svg>
                                                              </div>
                                                            </div>
                                                          </button>
                                                        </span>
                                                      </div>

                                                      <div className="d-flex align-items-center">
                                                        <div>
                                                          <div
                                                            style={{
                                                              opacity: 1,
                                                            }}
                                                          >
                                                            <span>
                                                              <button
                                                                aria-label="Dictation"
                                                                type="button"
                                                                className="btn btn-light d-inline-flex align-items-center justify-content-center"
                                                                style={{
                                                                  border:
                                                                    "none",
                                                                  backgroundColor:
                                                                    "unset",
                                                                  color:
                                                                    "#6c757d",
                                                                  height:
                                                                    "32px",
                                                                  aspectRatio:
                                                                    "9 / 8",
                                                                  // borderRadius:
                                                                  //   "0.5rem",
                                                                  fontSize:
                                                                    "0.875rem",
                                                                  padding:
                                                                    "0 0.75rem",
                                                                  transition:
                                                                    "all 0.3s ease-out",
                                                                  cursor:
                                                                    "pointer",
                                                                }}
                                                                onMouseOver={(
                                                                  e
                                                                ) => {
                                                                  e.currentTarget.style.backgroundColor =
                                                                    "#e9ecef";
                                                                  e.currentTarget.style.color =
                                                                    "#000";
                                                                }}
                                                                onMouseOut={(
                                                                  e
                                                                ) => {
                                                                  e.currentTarget.style.backgroundColor =
                                                                    "#f8f9fa";
                                                                  e.currentTarget.style.color =
                                                                    "#6c757d";
                                                                }}
                                                              >
                                                                <svg
                                                                  xmlns="http://www.w3.org/2000/svg"
                                                                  width={16}
                                                                  height={16}
                                                                  viewBox="0 0 24 24"
                                                                  fill="none"
                                                                  stroke="currentColor"
                                                                  strokeWidth="1.8"
                                                                  strokeLinecap="round"
                                                                  strokeLinejoin="round"
                                                                >
                                                                  <path d="M15 7l-6.5 6.5a1.5 1.5 0 0 0 3 3l6.5 -6.5a3 3 0 0 0 -6 -6l-6.5 6.5a4.5 4.5 0 0 0 9 9l6.5 -6.5" />
                                                                </svg>
                                                              </button>
                                                            </span>
                                                          </div>

                                                          {/* <input
                                                            type="file"
                                                            multiple
                                                            accept=".bash,.bat,.c,.coffee,.conf,.config,.cpp,.cs,.css,.csv,.cxx,.dart,.diff,.docx,.fish,.go,.h,.hpp,.htm,.html,.in,.ini,.ipynb,.java,.js,.json,.jsx,.ksh,.kt,.kts,.latex,.less,.log,.lua,.m,.markdown,.md,.pdf,.php,.pl,.pm,.pptx,.py,.r,.R,.rb,.rmd,.rs,.scala,.sh,.sql,.swift,.t,.tex,.text,.toml,.ts,.tsx,.txt,.xlsx,.xml,.yaml,.yml,.zsh,.jpeg,.jpg,.jpe,.jp2,.png,.gif,.bmp,.tiff,.tif,.svg,.webp,.ico,.avif,.heic,.heif"
                                                            style={{
                                                              display: "none",
                                                            }}
                                                          /> */}
                                                        </div>
                                                      </div>

                                                      <div
                                                        style={{
                                                          position: "relative",
                                                        }}
                                                      >
                                                        <button
                                                          aria-label="Dictation"
                                                          type="button"
                                                          className="btn btn-light d-inline-flex align-items-center justify-content-center"
                                                          style={{
                                                            border: "none",
                                                            backgroundColor:
                                                              "unset",
                                                            color: "#6c757d",
                                                            height: "32px",
                                                            aspectRatio:
                                                              "9 / 8",
                                                            fontSize:
                                                              "0.875rem",
                                                            padding:
                                                              "0 0.75rem",
                                                            transition:
                                                              "all 0.3s ease-out",
                                                            cursor: "pointer",
                                                          }}
                                                          onMouseOver={(e) => {
                                                            e.currentTarget.style.backgroundColor =
                                                              "#e9ecef";
                                                            e.currentTarget.style.color =
                                                              "#000";
                                                          }}
                                                          onMouseOut={(e) => {
                                                            e.currentTarget.style.backgroundColor =
                                                              "#f8f9fa";
                                                            e.currentTarget.style.color =
                                                              "#6c757d";
                                                          }}
                                                        >
                                                          <div className="d-flex align-items-center gap-2">
                                                            <div
                                                              className="d-flex justify-content-center align-items-center"
                                                              style={{
                                                                width: "16px",
                                                                height: "16px",
                                                              }}
                                                            >
                                                              <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width={16}
                                                                height={16}
                                                                viewBox="0 0 24 24"
                                                                fill="currentColor"
                                                              >
                                                                <path d="M19 9a1 1 0 0 1 1 1a8 8 0 0 1 -6.999 7.938l-.001 2.062h3a1 1 0 0 1 0 2h-8a1 1 0 0 1 0 -2h3v-2.062a8 8 0 0 1 -7 -7.938a1 1 0 1 1 2 0a6 6 0 0 0 12 0a1 1 0 0 1 1 -1m-7 -8a4 4 0 0 1 4 4v5a4 4 0 1 1 -8 0v-5a4 4 0 0 1 4 -4" />
                                                              </svg>
                                                            </div>
                                                          </div>
                                                        </button>
                                                      </div>

                                                      <div
                                                        style={{
                                                          marginLeft: "0.5rem",
                                                        }}
                                                      >
                                                        {/* Voice Icon Button – Always Active */}
                                                        {inputValue.trim() ===
                                                          "" && !isLoading ? (
                                                          <button
                                                            type="button"
                                                            aria-label="Voice UI"
                                                            className="btn btn-primary d-inline-flex align-items-center justify-content-center"
                                                            onClick={() =>
                                                              setShowVoiceUI(
                                                                true
                                                              )
                                                            }
                                                            style={{
                                                              backgroundColor:
                                                                "#21808d",
                                                              color: "#fff",
                                                              height: "32px",
                                                              aspectRatio:
                                                                "9 / 8",
                                                              fontSize:
                                                                "0.875rem",
                                                              fontFamily:
                                                                "sans-serif",
                                                              borderRadius:
                                                                "0.5rem",
                                                              padding:
                                                                "0 0.6rem",
                                                              transition:
                                                                "all 0.3s ease-out",
                                                              cursor: "pointer",
                                                            }}
                                                            onMouseOver={(
                                                              e
                                                            ) => {
                                                              e.currentTarget.style.opacity =
                                                                "0.8";
                                                            }}
                                                            onMouseOut={(e) => {
                                                              e.currentTarget.style.opacity =
                                                                "1";
                                                            }}
                                                          >
                                                            <RiVoiceprintFill />
                                                          </button>
                                                        ) : (
                                                          // Main Submit Button
                                                          <button
                                                            onClick={
                                                              handleSubmit
                                                            }
                                                            aria-label="Submit"
                                                            type="button"
                                                            disabled={
                                                              isLoading ||
                                                              inputValue.trim() ===
                                                                "" ||
                                                              selectedBot !==
                                                                "global"
                                                            }
                                                            className="btn btn-primary d-inline-flex align-items-center justify-content-center"
                                                            style={{
                                                              backgroundColor:
                                                                "#21808d",
                                                              color: "#fff",
                                                              height: "32px",
                                                              aspectRatio:
                                                                "9 / 8",
                                                              fontSize:
                                                                "0.875rem",
                                                              fontFamily:
                                                                "sans-serif",
                                                              borderRadius:
                                                                "0.5rem",
                                                              padding:
                                                                "0 0.6rem",
                                                              transition:
                                                                "all 0.3s ease-out",
                                                              cursor: "pointer",
                                                            }}
                                                            onMouseOver={(
                                                              e
                                                            ) => {
                                                              e.currentTarget.style.opacity =
                                                                "0.8";
                                                            }}
                                                            onMouseOut={(e) => {
                                                              e.currentTarget.style.opacity =
                                                                "1";
                                                            }}
                                                          >
                                                            <IoArrowUpOutline />
                                                          </button>
                                                        )}
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </span>
                                        </div>

                                        <div
                                          style={{
                                            position: "relative",
                                            width: "100%",
                                          }}
                                        >
                                          <div
                                            className="position-absolute w-100 mt-3"
                                            style={{ top: 0, left: 0 }}
                                          ></div>
                                        </div>
                                        {messages.length === 0 && (
                                          <footer
                                            className="d-flex flex-wrap justify-content-between align-items-center"
                                            style={{
                                              display: hasSubmitted
                                                ? "none"
                                                : "flex",
                                              height: "50px",
                                              width: "100%",
                                              backgroundColor: "#f2f2f2",
                                              padding: "0 20px",
                                              borderTop: "1.5px solid #e5e5e5",
                                              color: "#1f1f1f",
                                              fontSize: "12px",
                                              position: "relative",
                                              zIndex: 1,
                                              borderRadius: "15px",
                                              boxShadow:
                                                "0px 6px 15px -12px #7F00FF",
                                              marginBottom: "10px",
                                            }}
                                          >
                                            <Link
                                              to=""
                                              style={{
                                                color: "rgb(82 92 108)",
                                              }}
                                            >
                                              History
                                            </Link>
                                            <Link
                                              to=""
                                              style={{
                                                color: "rgb(82 92 108)",
                                              }}
                                            >
                                              Automation
                                            </Link>
                                            <Link
                                              to=""
                                              style={{
                                                color: "rgb(82 92 108)",
                                              }}
                                            >
                                              Switch to Avatar
                                            </Link>
                                            <Link
                                              to=""
                                              style={{
                                                color: "rgb(82 92 108)",
                                              }}
                                            >
                                              My Ai Staff
                                            </Link>
                                            <Link
                                              to=""
                                              style={{
                                                color: "rgb(82 92 108)",
                                              }}
                                            >
                                              AI Reports
                                            </Link>
                                            <Link
                                              to=""
                                              style={{
                                                color: "rgb(82 92 108)",
                                              }}
                                            >
                                              Privacy
                                            </Link>
                                            <Link
                                              to=""
                                              style={{
                                                color: "rgb(82 92 108)",
                                              }}
                                            >
                                              Terms of Use
                                            </Link>
                                          </footer>
                                        )}
                                      </div>
                                    </Fragment>
                                  )}
                                </>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* delete chat one by one */}
      <div
        className="modal custom-modal fade"
        id="delete_chat"
        role="dialog"
        style={{ left: "10%" }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content p-2" style={{ width: "75%" }}>
            <div
              className="modal-header border-0 m-0 justify-content-end"
              style={{ padding: "0 0 15px" }}
            >
              <button
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <div className="modal-body">
              <div className="success-message text-center">
                <div
                  className="success-popup-icon"
                  style={{
                    height: "60px",
                    width: "60px",
                    margin: "0 auto 10px",
                  }}
                >
                  <i className="ti ti-trash-x" />
                </div>
                {/* <h3>Delete "{chatHistoryById.message}"</h3> */}
                <h3>
                  Delete "
                  {chatHistoryById?.message &&
                    ((msg) => {
                      const words = msg.split(" ");
                      return (
                        words.slice(0, 5).join(" ") +
                        (words.length > 5 ? "..." : "")
                      );
                    })(chatHistoryById.message)}
                  "
                </h3>
                <h3></h3>
                <p className="del-info" style={{ fontSize: "14px" }}>
                  Are you sure you want to delete this chat.
                </p>
                <div className="col-lg-12 text-center modal-btn mt-3">
                  <Link
                    to="#"
                    className="btn btn-light"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </Link>
                  <Link
                    to="#"
                    onClick={deleteChatHistory}
                    className="btn btn-danger"
                    data-bs-dismiss="modal"
                  >
                    Yes, Delete it
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* delete all chat */}
      <div
        className="modal custom-modal fade"
        id="delete_all_chat"
        role="dialog"
        style={{ left: "10%" }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content p-2" style={{ width: "75%" }}>
            <div
              className="modal-header border-0 m-0 justify-content-end"
              style={{ padding: "0 0 15px" }}
            >
              <button
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <div className="modal-body">
              <div className="success-message text-center">
                <div
                  className="success-popup-icon"
                  style={{
                    height: "60px",
                    width: "60px",
                    margin: "0 auto 10px",
                  }}
                >
                  <i className="ti ti-trash-x" />
                </div>
                <h3>Delete all Chat?</h3>
                {/* <p
                  className="del-info"
                  style={{ maxWidth: "349px", fontSize: "14px" }}
                >
                  You're about to delete your entire chat history.
                </p> */}
                <p
                  className="del-info"
                  style={{ maxWidth: "338px", fontSize: "14px" }}
                >
                  This action cannot be undone. Are you sure you want to delete
                  your entire chat history?.
                </p>
                <div className="col-lg-12 text-center modal-btn mt-3">
                  <Link
                    to="#"
                    className="btn btn-light"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </Link>
                  <Link
                    to="#"
                    onClick={deleteAllChatHistory}
                    className="btn btn-danger"
                    data-bs-dismiss="modal"
                  >
                    Yes, Delete it
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* modal of cradits */}
      <div
        className="modal custom-modal fade"
        id="cradit_modal"
        role="dialog"
        style={{
          position: "absolute",
          zIndex: "9999",
        }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add New Grade</h5>
              <button
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                // onClick={handleReset}
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-wrap">
                  <label className="col-form-label">
                    Grade Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    // placeholder="Eg: Customer Support,Sales"
                    // value={formData.name}
                    required
                    // onChange={handleInputChange}
                  />
                </div>
                <p
                  style={{
                    fontSize: "small",
                    color: "#7695FF",
                  }}
                >
                  Note: You can add multiple grade at once by separating them
                  with commas (,)
                </p>
                <div className="modal-btn text-end">
                  <Link
                    to="#"
                    className="btn btn-light"
                    data-bs-dismiss="modal"
                    // onClick={handleReset}
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    data-bs-dismiss="modal"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Chatbot;
