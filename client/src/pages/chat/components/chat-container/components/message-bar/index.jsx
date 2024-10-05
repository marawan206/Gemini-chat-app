import { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { BsMicFill } from "react-icons/bs";
import { HiOutlineArrowUp } from "react-icons/hi";
import { RiEmojiStickerLine } from "react-icons/ri";
import EmojiPicker from "emoji-picker-react";
import { useAppStore } from "@/store";
import { SocketProvider, useSocket } from "@/context/SocketContext";
import apiClient from "@/lib/api-client";
import { UPLOAD_FILE_ROUTE } from "@/utils/constants";

const MessageBar = () => {
  const emojiRef = useRef();
  const fileInputRef = useRef();
  const socket = useSocket();
  const {
    selectedChatType,
    selectedChatData,
    userInfo,
    setIsUploading,
    setFileUploadProgress,
  } = useAppStore();
  const [message, setMessage] = useState("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiRef]);

  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  };

  const isTyping = message.trim().length > 0;

  const handleSendMessage = async () => {
    if (selectedChatType === "contact") {
      socket.emit("sendMessage", {
        sender: userInfo.id,
        content: message,
        recipient: selectedChatData._id,
        messageType: "text",
        fileUrl: undefined,
      });
    }
  };

  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAttachmentChange = async (event) => {
    try {
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        setIsUploading(true);
        const response = await apiClient.post(UPLOAD_FILE_ROUTE, formData, {
          withCredentials: true,
          onUploadProgress: (data) => {
            setFileUploadProgress(Math.round((100 * data.loaded) / data.total));
          },
        });

        if (response.status === 200 && response.data) {
          setIsUploading(false);
          socket.emit("sendMessage", {
            sender: userInfo.id,
            content: undefined,
            recipient: selectedChatData._id,
            messageType: "file",
            fileUrl: response.data.filePath,
          });
        }
      }
      console.log({ file });
    } catch (error) {
      setIsUploading(false);
      console.log({ error });
    }
  };

  return (
    <div className="h-[7vh] bg-[#1c1d25] flex items-center px-4 py-2 rounded-md">
      {/* Left Icons (Attachment and Emoji) */}
      <div className="flex items-center gap-3">
        {/* Emoji Icon */}
        <button
          className="text-gray-400 hover:text-white transition"
          onClick={() => setEmojiPickerOpen(true)}
        >
          <RiEmojiStickerLine className="text-2xl" />
        </button>
        <div className="absolute bottom-20 middle-0" ref={emojiRef}>
          <EmojiPicker
            theme="dark"
            open={emojiPickerOpen}
            onEmojiClick={handleAddEmoji}
            autoFocusSearch={false}
          />
        </div>

        {/* Attachment Icon */}
        <button
          className="text-gray-400 hover:text-white transition"
          onClick={handleAttachmentClick}
        >
          <GrAttachment className="text-2xl" />
        </button>
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleAttachmentChange}
        ></input>
      </div>

      {/* Input Field */}
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-1 mx-3 px-4 py-2 bg-[#2a2b33] text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
        placeholder="Type a message"
      />

      {/* Right Send Button */}
      <button
        className="text-gray-400 hover:text-white transition"
        onClick={handleSendMessage}
      >
        {isTyping ? (
          <HiOutlineArrowUp className="text-2xl" />
        ) : (
          <BsMicFill className="text-2xl" />
        )}
      </button>
      <div className="absolute bottom-16 right-0"></div>
    </div>
  );
};

export default MessageBar;
