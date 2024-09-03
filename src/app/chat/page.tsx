import ChatRooms from "@/components/ChatRoom";
import { getFriends } from "@/services/friends";
import React from "react";

const Chat = async () => {
  const result = await getFriends();
  return <ChatRooms friends={result} />;
};

export default Chat;
