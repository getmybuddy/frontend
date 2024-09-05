"use client";
import AddFriend from "@/components/AddFriend";
import Alert from "@/components/Alert";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { chatBot } from "@/services/chat";
import {
  ArrowUp,
  AudioLines,
  CircleStop,
  PanelRightClose,
  PanelRightOpen,
} from "lucide-react";
import { signOut } from "next-auth/react";
import React from "react";
import { getCountryCode, getCountryData, TCountryCode } from "countries-list";
import useSpeechSynthesis from "@/hooks/useSpeechSynthesis";
import UserProfile from "./UserProfile";

const ChatRooms = ({
  friends,
  addButton,
}: {
  friends: any;
  addButton: React.ReactNode | undefined;
}) => {
  const containerRef = React.useRef<null | HTMLDivElement>(null);

  const { speak, voices, cancel, speaking, activeVoice } = useSpeechSynthesis();

  const [isOpen, setIsOpen] = React.useState(false);
  const [active, setActive] = React.useState(1);
  const [allMessage, setAllMessage] = React.useState<
    {
      role: string;
      message: string;
      id: number;
      name?: string;
    }[]
  >([]);
  const [myFriends, setMyFriends] = React.useState<any[]>([]);
  const [displayMessage, setDisplayMessage] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [sideBar, setSideBar] = React.useState(false);
  const [userMessage, setUserMessage] = React.useState({
    role: "You",
    message: "",
    id: 0,
  });

  const lastIndex = allMessage.length - 1;

  const scrollToBottom = () => {
    containerRef.current?.scrollIntoView({
      behavior: isLoading ? "smooth" : "instant",
    });
  };

  const formAction = async (formData: FormData) => {
    if (activeFriend) {
      setIsLoading(true);
      const result = await chatBot(formData, active);
      setAllMessage((prev) => [
        ...prev,
        userMessage,
        {
          role: "AI",
          name: activeFriend?.name,
          message: result || "Please try again!",
          id: userMessage.id + 1,
        },
      ]);
      const splitMessage = result?.split(" ");
      let i = 0;
      if (splitMessage) {
        const interval = setInterval(() => {
          setDisplayMessage((prev) => prev + splitMessage[i] + " ");
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
        id: prev.id + 2,
      }));
    } else {
      setUserMessage({
        role: "You",
        message: "",
        id: 0,
      });
      setIsOpen(true);
    }
  };

  React.useEffect(() => {
    scrollToBottom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayMessage]);

  React.useEffect(() => {
    const savedMessages = localStorage.getItem(`chatMessages${active}`);
    const parser = savedMessages && JSON.parse(savedMessages);
    setAllMessage(() => {
      return parser || [];
    });
    setDisplayMessage(parser ? parser[parser?.length - 1]?.message : "");
  }, [active]);

  React.useEffect(() => {
    if (friends?.data.length > 0) {
      setActive(friends?.data[0].id);
      setMyFriends(friends?.data);
    }
  }, [friends]);

  React.useEffect(() => {
    if (typeof window !== "undefined" && allMessage.length > 0) {
      localStorage.setItem(`chatMessages${active}`, JSON.stringify(allMessage));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allMessage]);

  const activeFriend = myFriends.find((friend) => friend.id === active);

  const countryData = getCountryData(
    getCountryCode(
      activeFriend?.location.split(", ")[1]
    ) as unknown as TCountryCode
  );

  const voice = voices.find(
    (item: any) =>
      item.lang === `${countryData?.languages?.[0]}-${countryData?.iso2}`
  );

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
          <AddFriend title="Add Friend" className="w-full" />
          <ul className="space-y-2 flex flex-col">
            {myFriends?.map((item, idx) => (
              <UserProfile key={idx} {...item}>
                <li
                  className={cn(
                    "py-2 hover:bg-[#ffffff5e] hover:rounded-lg cursor-pointer",
                    active === item.id ? "bg-[#ffffff5e]" : ""
                  )}
                  onClick={() => setActive(item.id)}
                >
                  {item.name}
                </li>
              </UserProfile>
            ))}
          </ul>
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
            <UserProfile {...activeFriend}>
              {activeFriend && <h1>Hello i am {activeFriend?.name}</h1>}
            </UserProfile>
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
          <div
            className={cn(
              !activeFriend && "flex justify-center items-center",
              "p-4 overflow-y-auto flex-grow"
            )}
          >
            {addButton}
            {allMessage.map((msg, idx) => (
              <>
                <div
                  key={idx}
                  className={`p-3 rounded-lg ${
                    msg.role === "You" ? "text-right" : "bg-slate-300"
                  }`}
                >
                  <p className="font-semibold">{msg.name || "You"}</p>
                  <p>
                    {msg.role !== "You" && idx === lastIndex
                      ? displayMessage
                      : msg.message}
                  </p>
                </div>
                {msg.role === "AI" && (
                  <button
                    key={idx}
                    className="ml-1 mt-2"
                    onClick={() => {
                      {
                        !speaking
                          ? speak({ text: msg.message, voice }, msg.id)
                          : cancel();
                      }
                    }}
                  >
                    {activeVoice === msg.id && speaking ? (
                      <CircleStop className="w-4 h-4" />
                    ) : (
                      <AudioLines className="w-4 h-4" />
                    )}
                  </button>
                )}
                <div ref={containerRef}></div>
              </>
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
