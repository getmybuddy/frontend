import AddFriend from "@/components/AddFriend";
import ChatRooms from "@/components/ChatRoom";
import { getFriends } from "@/services/friends";
import React from "react";

const Chat = async () => {
  const result = await getFriends();

  const addFriend = !result?.data.length && (
    <AddFriend
      className="w-1/2 bg-primary !text-white hover:bg-primary/90"
      title="Add friend first to start a conversation"
    />
  );

  return <ChatRooms friends={result} addButton={addFriend} />;
};

export default Chat;
