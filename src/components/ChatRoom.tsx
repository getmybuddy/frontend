"use client";
import AddFriend from "@/components/AddFriend";
import Alert from "@/components/Alert";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { chatBot } from "@/services/chat";
import { ArrowUp, Mic, PanelRightClose, PanelRightOpen } from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

const ChatRooms = ({ friends }: { friends: any }) => {
  const containerRef = useRef<null | HTMLDivElement>(null);

  const [isOpen, setIsOpen] = React.useState(false);
  const [active, setActive] = useState(1);
  const [allMessage, setAllMessage] = useState<any[]>([]);
  const [myFriends, setMyFriends] = useState<any[]>([]);
  const [displayMessage, setDisplayMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [sideBar, setSideBar] = useState(false);
  const [userMessage, setUserMessage] = useState({
    role: "You",
    message: "",
  });

  const lastIndex = allMessage.length - 1;

  const scrollToBottom = () => {
    containerRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formAction = async (formData: FormData) => {
    if (activeFriend) {
      setIsLoading(true);
      const result = await chatBot(formData, active);
      setAllMessage((prev) => [
        ...prev,
        userMessage,
        { role: "AI", message: result || "Please try again!" },
      ]);
      const splitMessage = result?.split(" ");
      let i = 0;
      if (splitMessage) {
        const interval = setInterval(() => {
          setDisplayMessage((prev) => prev + splitMessage[i - 1] + " ");
          i++;
          if (i === splitMessage.length) {
            clearInterval(interval);
            setIsLoading(false);
          }
        }, 50);
      }
      setDisplayMessage("");
      setUserMessage((prev) => ({
        ...prev,
        message: "",
      }));
    } else {
      setUserMessage({
        role: "You",
        message: "",
      });
      setIsOpen(true);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [displayMessage]);

  useEffect(() => {
    const savedMessages = localStorage.getItem(`chatMessages${active}`);
    const parser = savedMessages && JSON.parse(savedMessages);
    setAllMessage(() => {
      return parser || [];
    });
    setDisplayMessage(parser ? parser[parser?.length - 1]?.message : "");
  }, [active]);

  useEffect(() => {
    if (friends?.data.length > 0) {
      setActive(friends?.data[0].id);
      setMyFriends(friends?.data);
    }
  }, [friends]);

  useEffect(() => {
    if (typeof window !== "undefined" && allMessage.length > 0) {
      localStorage.setItem(`chatMessages${active}`, JSON.stringify(allMessage));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allMessage]);

  const activeFriend = myFriends.find((friend) => friend.id === active);

  return (
    <div className="bg-gray-100 flex">
      <Alert
        title="Message Failed to Send"
        message="You haven't added a friend yet. Please add a friend to start a conversation."
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
      <div
        className={cn(
          sideBar ? "w-[300px]" : "w-0",
          "transition-all duration-300 border-r bg-gray-200 overflow-hidden"
        )}
      >
        <div className="p-3 space-y-4">
          <Button
            className="p-2 rounded-lg"
            onClick={() => setSideBar(!sideBar)}
          >
            <PanelRightOpen className="w-6 h-6" />
          </Button>
          <ul className="space-y-2 text-center">
            {myFriends?.map((item, idx) => (
              <li
                key={idx}
                className={cn(
                  "py-2 hover:bg-[#ffffff5e] hover:rounded-lg cursor-pointer",
                  active === item.id ? "bg-[#ffffff5e]" : ""
                )}
                onClick={() => setActive(item.id)}
              >
                {item.name}
              </li>
            ))}
          </ul>
          <AddFriend />
        </div>
      </div>
      <div className="flex-1">
        <header className="p-3 flex justify-between items-center sticky top-0 bg-white">
          <div className="flex space-x-2 items-center">
            <button
              className={cn(
                "p-2 bg-gray-100 rounded-lg",
                sideBar ? "hidden" : ""
              )}
              onClick={() => setSideBar(!sideBar)}
            >
              <PanelRightClose className="w-6 h-6" />
            </button>
            <h1>Hello i am {activeFriend?.name}</h1>
          </div>
          <button
            onClick={() => {
              signOut();
            }}
          >
            Logout
          </button>
        </header>
        <div className="flex flex-col max-w-sm h-[calc(100vh_-_64px)] md:max-w-2xl mx-auto rounded-lg pt-4">
          <div className="flex-grow p-4 overflow-y-auto">
            {allMessage.map((msg, idx) => (
              <div
                ref={containerRef}
                key={idx}
                className={`mb-4 p-3 rounded-lg ${
                  msg.role === "You" ? "text-right" : "bg-slate-300"
                }`}
              >
                <p className="font-semibold">{msg.role}</p>
                <p>
                  {msg.role !== "You" && idx === lastIndex
                    ? displayMessage
                    : msg.message}
                </p>
              </div>
            ))}
          </div>
          <form
            className="relative px-3 py-7 flex space-x-2 items-center"
            action={formAction}
          >
            <input
              name="message"
              className="p-3 rounded-lg w-full text-black focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="Type new message..."
              value={userMessage.message}
              autoComplete="off"
              onChange={(e) =>
                setUserMessage((prev) => ({
                  ...prev,
                  message: e.target.value,
                }))
              }
            />
            {/* <Mic className="absolute w-6 h-6 top-10 right-[4.5rem]" /> */}
            <Button
              type="submit"
              size="icon"
              className="h-11 w-11 disabled:bg-[#0F172A]"
              disabled={!userMessage.message || isLoading}
            >
              <ArrowUp className="w-4 h-4 rotate-90" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatRooms;
