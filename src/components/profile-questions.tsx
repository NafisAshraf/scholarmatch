"use client";
import React, { useState } from "react";

const ProfileQuestions = () => {
  const [message, setMessage] = useState("");
  const [userProfile, setUserProfile] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/get_matched_scholarships", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, user_profile: userProfile }),
      });

      const data = await res.json();
      setResponse(data.scholarships || "No scholarships found");
    } catch (error) {
      setResponse("Failed to connect to the API");
    }
  };

  return (
    <div>
      <h1>Profile Questions</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter user profile"
          value={userProfile}
          onChange={(e) => setUserProfile(e.target.value)}
        />
        <button type="submit">Generate SOP</button>
      </form>
      <h2>Response:</h2>
      <pre>{JSON.stringify(response, null, 2)}</pre>
    </div>
  );
};

export default ProfileQuestions;
