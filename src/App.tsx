import { useState } from "react";

function App() {
  const [message, setMessage] = useState("Click me!");

  const handleClick = () => {
    const messages = [
      "Haha gotcha 😂",
      "Still clicking?",
      "Stop clicking me 😅",
      "You really like this div huh?",
      "Last warning... 👀",
      "Okay fine, you win 🎉"
    ];
    setMessage(messages[Math.floor(Math.random() * messages.length)]);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div
        onClick={handleClick}
        className="cursor-pointer select-none p-6 bg-red-500 text-white text-xl font-bold rounded-lg shadow-lg text-center hover:bg-red-700 transition"
      >
        {message}
      </div>
    </div>
  );
}

export default App;
