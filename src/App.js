import React, { useState, useEffect } from "react";
import axios from "axios";

const StudyTimerApp = () => {
  const [time, setTime] = useState(0); // Time in seconds
  const [isRunning, setIsRunning] = useState(false); // Tracks timer status
  const [courseTitle, setCourseTitle] = useState("Course Title");
  const [lastSession, setLastSession] = useState(null); // Last session timestamp
  const [manualTime, setManualTime] = useState(""); // Manual time input
  const [lessonLink, setLessonLink] = useState(""); // Last lesson link

  // Timer logic
  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  // Format time in hh:mm:ss
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Convert formatted time to seconds
  const timeToSeconds = (timeString) => {
    const [hours, mins, secs] = timeString.split(":").map(Number);
    return hours * 3600 + mins * 60 + secs;
  };

  // Start/Pause timer
  const handleStartPause = () => {
    setIsRunning((prev) => !prev);
  };

  // Stop timer and save time
  const handleStopAndSave = async () => {
    setIsRunning(false);
    const formattedTime = formatTime(time);
    setLastSession(new Date().toLocaleString());

    // Send saved time to server
    await saveTimeToServer(formattedTime);
  };

  // Save manual time
  const handleAddTime = async () => {
    if (manualTime) {
      await saveTimeToServer(manualTime);
      setManualTime(""); // Clear input field after saving
    } else {
      alert("Please enter a valid time in hh:mm:ss format.");
    }
  };

  // Save time to server
  const saveTimeToServer = async (timeString) => {
    const payload = {
      courseName: courseTitle,
      timeRecorded: timeString,
    };
    try {
      const response = await axios.post(
        "https://hook.us1.make.com/dlkqk2ip7lvmq7flot6o4y4qtka20cxx",
        payload
      );
      console.log("Time saved successfully:", response.data);
      alert(`Time "${timeString}" saved successfully!`);
    } catch (error) {
      console.error("Error saving time:", error);
      alert("Failed to save time!");
    }
  };

  // Submit lesson link
  const handleLessonLinkSubmit = (e) => {
    e.preventDefault();
    alert(`Lesson Link Submitted: ${lessonLink}`);
    setLessonLink(""); // Clear the input field
  };

  return (
    <div style={styles.container}>
      <h1>{courseTitle}</h1>
      <p>
        Last Session: {lastSession ? lastSession : "No sessions recorded yet"}
      </p>

      <div style={styles.timerSection}>
        <span style={styles.timer}>{formatTime(time)}</span>
      </div>

      <div style={styles.controls}>
        <button style={styles.button} onClick={handleStartPause}>
          {isRunning ? "Pause" : "Start Learning"}
        </button>
        <button style={styles.button} onClick={handleStopAndSave}>
          Stop Learning / Save Time
        </button>
      </div>

      <div style={styles.manualTimeSection}>
        <input
          type="text"
          placeholder="hh:mm:ss"
          value={manualTime}
          onChange={(e) => setManualTime(e.target.value)}
          style={styles.input}
        />
        <button style={styles.button} onClick={handleAddTime}>
          Add Time
        </button>
      </div>

      <form style={styles.lessonLinkForm} onSubmit={handleLessonLinkSubmit}>
        <input
          type="text"
          placeholder="Paste Last Lesson Link"
          value={lessonLink}
          onChange={(e) => setLessonLink(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          Submit
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    textAlign: "left", // Aligns all text to the left
  },
  timerSection: {
    margin: "20px 0",
  },
  timer: {
    fontSize: "2rem",
    marginBottom: "10px",
  },
  controls: {
    margin: "20px 0",
  },
  button: {
    padding: "10px 20px",
    margin: "5px",
    cursor: "pointer",
    fontSize: "1rem",
  },
  manualTimeSection: {
    margin: "20px 0",
  },
  lessonLinkForm: {
    marginTop: "20px",
  },
  input: {
    padding: "10px",
    width: "60%",
    marginRight: "10px",
    fontSize: "1rem",
  },
};

export default StudyTimerApp;
