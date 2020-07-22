import React, { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import useInterval from "./use-interval";
import { useWindowSize } from "./window-size.hook";
import "react-circular-progressbar/dist/styles.css";
import "./styles.css";

const defaultTime = 25 * 60;

function App() {
  const { height, width } = useWindowSize();
  const [timer, setTimer] = useState(defaultTime);
  const [enabled, setEnabled] = useState(false);
  const alarm = new Audio("/alarm.mp3");

  const timerSize = Math.min(height - 16, width - 16, 600);

  useEffect(() => {
    if (timer === 0) {
      alarm.play();
      new Notification("Your pomodoro timer has completed!", {
        icon: "/logo192.png",
      });
    }
  }, [timer, alarm]);

  useInterval(() => {
    if (!enabled || timer <= 0) return;
    setTimer(timer - 1);
  }, 1000);

  function toggleEnabled() {
    if (!enabled) {
      Notification.requestPermission();
    }
    setEnabled(!enabled);
  }

  function reset() {
    setEnabled(false);
    setTimer(defaultTime);
  }

  const sec = timer % 60;
  const min = Math.floor(timer / 60);
  const percentage = (timer / defaultTime) * 100;

  return (
    <div>
      <div style={{ width: timerSize, height: timerSize, margin: "16px auto" }}>
        <CircularProgressbar
          valueStart={100}
          value={percentage}
          text={`${min}:${("0" + sec).slice(-2)}`}
          counterClockwise
          styles={buildStyles({
            // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
            strokeLinecap: "butt",

            // How long animation takes to go from one percentage to another, in seconds
            pathTransitionDuration: 0.5,

            // Colors
            pathColor: "#FD4E4D",
            textColor: timer === 0 ? "#d6d6d6" : "#FD4E4D",
            trailColor: "#d6d6d6",
            backgroundColor: "#c73d3d",
          })}
        />
      </div>
      <div style={{ textAlign: "center" }}>
        {enabled && (
          <button style={{ margin: 16 }} onClick={reset}>
            Reset
          </button>
        )}
        {timer !== 0 && (
          <button style={{ margin: 16 }} onClick={toggleEnabled}>
            {enabled ? "Cancel" : "Start"}
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
