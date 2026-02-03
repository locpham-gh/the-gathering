import React, { useState, useEffect, useRef } from "react";
import {
  fetchRooms,
  joinRoom,
  fetchMessages,
  sendMessage,
  leaveRoom,
  deleteRoom,
} from "../../../api/forum";
import type { Room, Message } from "./types";
import RoomList from "./components/RoomList";
import ChatRoom from "./components/ChatRoom";
import RoomCreateModal from "./components/RoomCreateModal";

export default function ForumPage() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [activeTab, setActiveTab] = useState<"joined" | "explore">("joined");
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [replyTo, setReplyTo] = useState<{
    id: number;
    username: string;
    content: string;
  } | null>(null);

  // Create Room Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRoomTitle, setNewRoomTitle] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      const container = messagesEndRef.current.parentElement;
      if (container) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: "smooth",
        });
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    loadRooms();
  }, []);

  useEffect(() => {
    let interval: any;

    if (selectedRoom && selectedRoom.is_member) {
      interval = setInterval(async () => {
        try {
          const msgResult = await fetchMessages(selectedRoom.code);
          if (msgResult.success) {
            setMessages(msgResult.data);
          }
        } catch (error) {
          console.error("Polling error:", error);
        }
      }, 3000); // Poll every 3 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [selectedRoom]);

  const loadRooms = async () => {
    setLoading(true);
    try {
      const result = await fetchRooms();
      if (result.success) {
        // Fetch detailed info for each room to check membership
        const roomsWithMembership = await Promise.all(
          result.data.map(async (room: Room) => {
            try {
              const detail = await (
                await fetch(
                  `http://localhost:5000/api/forum/rooms/${room.code}`,
                  {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                  },
                )
              ).json();
              return { ...room, is_member: detail.data?.is_member };
            } catch (e) {
              return room;
            }
          }),
        );
        setRooms(roomsWithMembership);
      }
    } catch (error) {
      console.error("Error loading rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenRoom = async (room: Room) => {
    if (room.is_member) {
      setSelectedRoom(room);
      setReplyTo(null);
      try {
        const msgResult = await fetchMessages(room.code);
        if (msgResult.success) {
          setMessages(msgResult.data);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    } else {
      if (confirm(`Do you want to join #${room.code} (${room.title})?`)) {
        handleJoinRoom(room);
      }
    }
  };

  const handleLeaveRoom = async (room: Room) => {
    if (
      !confirm(`Are you sure you want to leave #${room.code} (${room.title})?`)
    )
      return;

    try {
      await leaveRoom(room.code);
      setSelectedRoom(null);
      loadRooms();
    } catch (error) {
      console.error("Error leaving room:", error);
      alert("Failed to leave room");
    }
  };

  const handleDeleteRoom = async (room: Room) => {
    if (
      !confirm(
        `Are you sure you want to DELETE #${room.code} (${room.title})? This cannot be undone.`,
      )
    )
      return;

    try {
      await deleteRoom(room.code);
      if (selectedRoom?.id === room.id) setSelectedRoom(null);
      loadRooms();
    } catch (error) {
      console.error("Error deleting room:", error);
      alert("Failed to delete room");
    }
  };

  const handleJoinRoom = async (room: Room) => {
    try {
      await joinRoom(room.code);
      const updatedRooms = rooms.map((r) =>
        r.id === room.id ? { ...r, is_member: true } : r,
      );
      setRooms(updatedRooms);

      setSelectedRoom({ ...room, is_member: true });
      const msgResult = await fetchMessages(room.code);
      if (msgResult.success) {
        setMessages(msgResult.data);
      }
    } catch (error) {
      console.error("Error joining room:", error);
      alert("Failed to join room");
    }
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomTitle.trim()) return;

    try {
      const createResult = await (
        await fetch(`http://localhost:5000/api/forum/rooms`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ title: newRoomTitle.trim() }),
        })
      ).json();

      if (createResult.success) {
        setShowCreateModal(false);
        setNewRoomTitle("");
        loadRooms();
      }
    } catch (error) {
      console.error("Error creating room:", error);
      alert("Failed to create room");
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom || !newMessage.trim() || sending) return;

    setSending(true);
    try {
      const result = await sendMessage(
        selectedRoom.code,
        newMessage,
        replyTo?.id,
      );
      if (result.success) {
        setMessages((prev) => [...prev, result.data]);
        setNewMessage("");
        setReplyTo(null);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="h-full flex flex-col min-h-0 relative overflow-hidden">
      {selectedRoom ? (
        <ChatRoom
          selectedRoom={selectedRoom}
          setSelectedRoom={setSelectedRoom}
          messages={messages}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          sending={sending}
          replyTo={replyTo}
          setReplyTo={setReplyTo}
          handleSendMessage={handleSendMessage}
          handleLeaveRoom={handleLeaveRoom}
          handleDeleteRoom={handleDeleteRoom}
          user={user}
          messagesEndRef={messagesEndRef}
        />
      ) : (
        <RoomList
          rooms={rooms}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          loading={loading}
          handleOpenRoom={handleOpenRoom}
          handleDeleteRoom={handleDeleteRoom}
          setShowCreateModal={setShowCreateModal}
          user={user}
        />
      )}

      <RoomCreateModal
        showCreateModal={showCreateModal}
        setShowCreateModal={setShowCreateModal}
        newRoomTitle={newRoomTitle}
        setNewRoomTitle={setNewRoomTitle}
        handleCreateRoom={handleCreateRoom}
      />
    </div>
  );
}
