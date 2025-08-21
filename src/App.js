import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import DetectionPage from "./components/detection";
import Chatbot from "./components/chatbot.js";

const Dev = () => (
  <div className="p-5 text-center bg-secondary text-white min-vh-100">
    <h1 className="display-4 mb-4">Meet the Developers</h1>
    <p className="lead">Passionate team dedicated to pet health.</p>
    <div className="d-flex justify-content-center flex-wrap mt-4">
      {[
        {
          name: "Aaditya Gadwal",
          prn: "PRN:121A7018",
          mail: "aadityakgecs121@gst.sies.edu.in"
        },
        {
          name: "Adarsh Sreenivas",
          prn: "PRN:121A7001",
          mail: "adarshsecs121@gst.sies.edu.in"
        },
        {
          name: "Aman Marwade",
          prn: "PRN:121A7004",
          mail: "marwadeecs121@gst.sies.edu.in"
        },
        {
          name: "Vibhuti Shinde",
          prn: "PRN:",
          mail: "vibhutivsecs121@gst.sies.edu.in"
        }
      ].map((dev, index) => (
        <div
          key={index}
          className="card text-dark m-3 shadow"
          style={{
            width: "18rem",
            borderRadius: "10px",
            backgroundColor: "#D2B48C"
          }}
        >
          <div className="card-body">
            <h5 className="card-title text-dark">{dev.name}</h5>
            <p className="card-text">{dev.prn}</p>
            <p className="card-text">{dev.mail}</p>
            <p className="card-text">Developer & Contributor</p>
          </div>
        </div>
      ))}
    </div>

    {/* Project Guide Section */}
    <div className="mt-5">
      <h2 className="mb-4">Project Guide</h2>
      <div
        className="card text-dark mx-auto shadow"
        style={{
          width: "22rem",
          borderRadius: "10px",
          backgroundColor: "#F5DEB3"
        }}
      >
        <div className="card-body">
          <h5 className="card-title text-dark">Mrinal Khadse</h5>
          <p className="card-text">mrinalk@sies.edu.in</p>
          <p className="card-text">Mentor</p>
        </div>
      </div>
    </div>
  </div>
);

const Home = () => {
  const canvasRef = useRef(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [restartKey, setRestartKey] = useState(0);
  const [gameStarted, setGameStarted] = useState(false); // To control game start

  useEffect(() => {
    if (!gameStarted) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let treats = [];
    let catcher = { x: 180, y: 350, width: 60, height: 60 };
    let currentScore = 0;
    let speed = 2;
    let treatInterval;
    let animationFrameId;
    let gameEnded = false;

    const catcherImg = new Image();
    catcherImg.src = "/dog-image.png";

    const backgroundImg = new Image();
    backgroundImg.src = "/background.jpg";

    function handleMouseMove(e) {
      const rect = canvas.getBoundingClientRect();
      let mouseX = e.clientX - rect.left;
      catcher.x = Math.min(Math.max(mouseX - catcher.width / 2, 0), canvas.width - catcher.width);
    }

    function endGame() {
      gameEnded = true;
      clearInterval(treatInterval);
      cancelAnimationFrame(animationFrameId);
      setIsGameOver(true);
      showGameOver();
    }

    function showGameOver() {
      ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "white";
      ctx.font = "40px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 10);
      ctx.font = "20px Arial";
      ctx.fillText("Final Score: " + currentScore, canvas.width / 2, canvas.height / 2 + 30);
    }

    function spawnTreat() {
      if (!gameEnded) {
        treats.push({ x: Math.random() * (canvas.width - 20), y: 0 });
      }
    }

    function updateGame() {
      if (gameEnded) return;

      ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
      ctx.drawImage(catcherImg, catcher.x, catcher.y, catcher.width, catcher.height);

      ctx.fillStyle = "black";
      ctx.font = "20px Arial";
      ctx.fillText("Score: " + currentScore, 10, 30);

      treats.forEach((treat, index) => {
        treat.y += speed;
        ctx.fillStyle = "brown";
        ctx.beginPath();
        ctx.arc(treat.x, treat.y, 10, 0, Math.PI * 2);
        ctx.fill();

        if (
          treat.y + 10 >= catcher.y &&
          treat.x >= catcher.x &&
          treat.x <= catcher.x + catcher.width
        ) {
          treats.splice(index, 1);
          currentScore++;
          setScore(currentScore);
          if (currentScore % 10 === 0) speed *= 1.1;
        } else if (treat.y > canvas.height) {
          endGame();
        }
      });

      if (!gameEnded) {
        animationFrameId = requestAnimationFrame(updateGame);
      }
    }

    catcherImg.onload = () => {
      backgroundImg.onload = () => {
        treatInterval = setInterval(spawnTreat, 1000);
        animationFrameId = requestAnimationFrame(updateGame);
      };
    };

    canvas.addEventListener("mousemove", handleMouseMove);

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      clearInterval(treatInterval);
      cancelAnimationFrame(animationFrameId);
    };
  }, [restartKey, gameStarted]);

  const restartGame = () => {
    setScore(0);
    setIsGameOver(false);
    setRestartKey(prev => prev + 1);
    setGameStarted(true);
  };

  return (
    <div className="p-4 text-center bg-warning text-dark min-vh-100">
      <h1 className="display-4">Welcome to Fursaver</h1>
      <p>Fursaver is a pet skin disease detection tool designed to help pet owners identify potential issues early.</p>
      <h2 className="h4">Fun Game: Catch the Treat!</h2>
      <p>Move your mouse left and right to catch the treats!</p>

      <div style={{ position: "relative", display: "inline-block" }}>
        <canvas
          ref={canvasRef}
          id="gameCanvas"
          width="650"
          height="450"
          style={{ border: "1px solid #000" }}
        />
        {/* Game Start Button Overlay */}
        {!gameStarted && (
          <button
            onClick={() => setGameStarted(true)}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              padding: "12px 24px",
              fontSize: "18px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              zIndex: 2,
            }}
          >
            Play Game
          </button>
        )}

        {/* Restart Button after Game Over */}
        {isGameOver && (
          <div style={{ position: "absolute", top: "10px", left: "50%", transform: "translateX(-50%)", zIndex: 2 }}>
            <button onClick={restartGame} style={{ padding: "10px 20px", fontSize: "16px" }}>
              Restart Game
            </button>
          </div>
        )}
      </div>
    </div>
  );
};


const NavMenu = () => (
  <nav className="navbar navbar-expand-lg navbar-dark bg-dark py-4 shadow-sm">
    <div className="container d-flex justify-content-between align-items-center">
      {/* Brand on the left */}
      <Link to="/" className="navbar-brand text-light fw-bold fs-2">
        Fursaver
      </Link>

      {/* Navigation Links */}
      <div className="d-flex gap-5">
        {[
          { path: "/", label: "Home" },
          { path: "/detection", label: "Detection" },
          { path: "/devs", label: "Devs" }
        ].map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className="nav-link text-light fw-semibold fs-5 position-relative animated-link"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>

    <style jsx="true">{`
      .animated-link::after {
        content: "";
        position: absolute;
        width: 0%;
        height: 2px;
        bottom: 0;
        left: 0;
        background-color: #f8f9fa;
        transition: width 0.3s ease-in-out;
      }

      .animated-link:hover::after {
        width: 100%;
      }

      .animated-link:hover {
        color: #ffc107 !important;
        transition: color 0.3s ease-in-out;
      }
    `}</style>
  </nav>
);


// QR Code Floating Button Component
const QRCodePopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const qrCodePath = process.env.PUBLIC_URL + "/qr-code.png"; // Make sure to place the image in 'public' folder

  return (
    <div className="qr-container">
      <button className="qr-button" onClick={() => setIsOpen(!isOpen)}>📱</button>
      {isOpen && (
        <div className="qr-popup">
          <img src={qrCodePath} alt="Scan QR for IRT Detection" className="qr-image" />
          <p className="qr-text">Scan this QR to use Fursaver in real-time!</p>
        </div>
      )}
    </div>
  );
};

const ChatbotPopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="chatbot-container">
      {/* Floating Button */}
      <button
        className="chatbot-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Chatbot"
      >
        💬
      </button>

      {/* Popup Window */}
      <div className={`chatbot-popup ${isOpen ? "open" : ""}`}>
        <div className="chatbot-header">
          <span>Fursaver AI Chat</span>
          <button className="close-button" onClick={() => setIsOpen(false)}>
            ✖
          </button>
        </div>
        <div className="chatbot-content">
          <Chatbot />
        </div>
      </div>

      <style jsx="true">{`
  .chatbot-container {
    position: fixed;
    bottom: 30px;
    left: 30px;
    z-index: 1000;
  }

  .chatbot-button {
    background-color:rgb(52, 221, 18);
    border: none;
    border-radius: 50%;
    padding: 18px;
    font-size: 1.8rem;
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.25);
    cursor: pointer;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
  }

  .chatbot-button:hover {
    transform: scale(1.12);
    box-shadow: 0 8px 24px rgba(216, 14, 216, 0.35);
  }

  .chatbot-popup {
    position: fixed;
    bottom: 50px;
    left: 50px;
    width: 700px;
    height: 650px;
    background: linear-gradient(145deg,rgb(139, 100, 100),rgb(128, 197, 206));
    border-radius: 16px; /* Rounded corners adjusted */
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
    overflow: hidden;
    opacity: 0;
    transform: translateY(30px) scale(0.95);
    pointer-events: none;
    transition: all 0.4s ease-in-out;
    display: flex;
    flex-direction: column;
    backdrop-filter: blur(10px);
    border: 1px solid #e0e0e0;
  }

  .chatbot-popup.open {
    opacity: 1;
    transform: translateY(0) scale(1); 
    pointer-events: auto;
  }

  .chatbot-header {
    background-color:rgb(20, 243, 0);
    color: #000;
    padding: 14px 18px; /* Reduced padding */
    font-weight: bold;
    font-size: 1.1rem; /* Slightly smaller font size */
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .close-button {
    background: none;
    border: none;
    font-size: 1.2rem; /* Adjusted font size */
    cursor: pointer;
    transition: transform 0.2s ease;
  }

  .close-button:hover {
    transform: rotate(90deg);
  }

  .chatbot-content {
    flex: 1;
    padding: 16px; /* Reduced padding */
    overflow-y: auto;
    font-family: "Segoe UI", sans-serif;
    font-size: 0.9rem; /* Adjusted font size */
    color: #333;
    animation: fadeInUp 0.6s ease;
  }

  @keyframes fadeInUp {
    0% {
      opacity: 0;
      transform: translateY(10px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
`}</style>


    </div>
  );
};
const Fursaver = () => (
  <Router>
    <NavMenu />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/detection" element={<DetectionPage />} />
      <Route path="/devs" element={<Dev />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
    <QRCodePopup /> {/* Add the QR code popup at the bottom right */}
    <ChatbotPopup /> {/* Chatbot button added */}
  </Router>
);

export default Fursaver;
