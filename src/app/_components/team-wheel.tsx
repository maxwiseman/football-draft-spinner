"use client";

import type { Team } from "@/server/api/routers/espn";
import type { Ref } from "react";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

const TeamWheelComponent = (
  {
    teams,
    winningSegment,
    disabled = false,
    onFinished,
    onTeamChange,
    primaryColor = "black",
    contrastColor = "white",
    buttonText = "Spin",
    isOnlyOnce = true,
    size = 290,
    upDuration = 100,
    downDuration = 1000,
    fontFamily = "proxima-nova",
    gameWidth = 1000,
    playSounds = true,
  }: {
    teams: { team: Team }[];
    winningSegment?: {
      team: {
        name: string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [key: string]: any;
      };
    };
    disabled?: boolean;
    onFinished?: (arg0: Team) => void;
    onTeamChange?: (arg0: Team) => void;
    primaryColor?: string;
    contrastColor?: string;
    buttonText?: string;
    isOnlyOnce?: boolean;
    size?: number;
    upDuration?: number;
    downDuration?: number;
    fontFamily?: string;
    gameWidth?: number;
    playSounds?: boolean;
  },
  ref?: Ref<{ spin: () => void; currentSegment: { team: Team } }>,
) => {
  const gameHeight = gameWidth; // * .80;
  const needleSize = gameWidth * 0.1;
  const lineWidth = gameWidth * 0.02;
  let currentSegment: { team: Team };
  let lastSegment: { team: Team };
  let isStarted = false;
  const [isFinished, setFinished] = useState(false);
  let timerHandle = 0;
  const timerDelay = teams.length;
  let angleCurrent = 0;
  let angleDelta = 0;
  let canvasContext: CanvasRenderingContext2D | null;
  let maxSpeed = 1;
  let upTime = upDuration * Math.max(Math.random() * 5, 2);
  let downTime = downDuration * Math.max(Math.random() * 5, 2);
  let spinStart = 0;
  let frames = 0;
  const centerX = gameWidth / 2;
  const centerY = gameHeight / 2;

  useEffect(() => {
    wheelInit();
    setTimeout(() => {
      window.scrollTo(0, 1);
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const wheelInit = () => {
    initCanvas();
    wheelDraw();
  };

  const initCanvas = () => {
    let canvas = document.getElementById("canvas") as HTMLCanvasElement;
    if (navigator.userAgent.indexOf("MSIE") !== -1) {
      canvas = document.createElement("canvas");
      canvas.setAttribute("width", gameWidth.toString());
      canvas.setAttribute("height", gameHeight.toString());
      canvas.setAttribute("id", "canvas");
      document.getElementById("wheel")?.appendChild(canvas);
    }
    canvas?.addEventListener("click", spin, false);
    canvasContext = canvas.getContext("2d");
  };
  const spin = () => {
    upTime = upDuration * Math.max(Math.random() * 7, 3);
    downTime = downDuration * Math.max(Math.random() * 7, 3);
    isStarted = true;
    if (timerHandle === 0) {
      spinStart = new Date().getTime();
      // maxSpeed = Math.PI / ((teams.length*2) + Math.random())
      maxSpeed = 0.2;
      frames = 0;
      timerHandle = setInterval(onTimerTick, timerDelay) as unknown as number;
    }
  };
  const onTimerTick = () => {
    frames++;
    draw();
    const duration = new Date().getTime() - spinStart;
    let progress = 0;
    let finished = false;
    if (duration < upTime) {
      progress = duration / upTime;
      angleDelta = maxSpeed * Math.sin((progress * Math.PI) / 2);
    } else {
      if (winningSegment) {
        if (currentSegment === winningSegment && frames > teams.length) {
          progress = duration / upTime;
          angleDelta =
            maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
          progress = 1;
        } else {
          progress = duration / downTime;
          angleDelta =
            maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
        }
      } else {
        progress = duration / downTime;
        angleDelta =
          maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
      }
      if (progress >= 1) finished = true;
    }

    if (currentSegment != lastSegment) {
      lastSegment = currentSegment;
      onTeamChange ? onTeamChange(currentSegment.team) : null;
      if (playSounds) {
        const clickAudio = new Audio("/click.wav");
        clickAudio.volume = 0.7;
        // clickAudio.playbackRate = Math.random() * (1.5 - 0.1) + 0.5;
        clickAudio
          .play()
          .catch((err: Error) => console.error("Error playing audio: ", err));
      }
    }

    angleCurrent += angleDelta;
    while (angleCurrent >= Math.PI * 2) angleCurrent -= Math.PI * 2;
    if (finished) {
      setFinished(true);
      if (onFinished) onFinished(currentSegment.team);
      clearInterval(timerHandle);
      timerHandle = 0;
      angleDelta = 0;
    }
  };

  const wheelDraw = () => {
    clear();
    drawWheel();
    drawNeedle();
  };

  const draw = () => {
    clear();
    drawWheel();
    drawNeedle();
  };

  const drawSegment = (key: number, lastAngle: number, angle: number) => {
    const ctx = canvasContext;
    const value = teams[key]!.team.name;
    if (!ctx) return;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, size, lastAngle, angle, false);
    ctx.lineTo(centerX, centerY);
    ctx.closePath();
    ctx.fillStyle = "#" + teams[key]!.team.color;
    ctx.fill();
    ctx.stroke();
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((lastAngle + angle) / 2);
    ctx.fillStyle = "#" + teams[key]!.team.alternateColor;
    ctx.font = "bold 1em " + fontFamily;
    ctx.fillText(value.substr(0, 21), size / 2 + 20, 0);
    ctx.restore();
  };

  const drawWheel = () => {
    const ctx = canvasContext;
    let lastAngle = angleCurrent;
    const len = teams.length;
    const PI2 = Math.PI * 2;
    if (!ctx) return;
    ctx.lineWidth = 1;
    ctx.strokeStyle = primaryColor;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.font = "1em " + fontFamily;
    for (let i = 1; i <= len; i++) {
      const angle = PI2 * (i / len) + angleCurrent;
      drawSegment(i - 1, lastAngle, angle);
      lastAngle = angle;
    }

    // Draw a center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, needleSize, 0, PI2, false);
    ctx.closePath();
    ctx.fillStyle = primaryColor;
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = contrastColor;
    ctx.fill();
    ctx.font = "bold 1em " + fontFamily;
    ctx.fillStyle = contrastColor;
    ctx.textAlign = "center";
    ctx.fillText(buttonText, centerX, centerY + 3);
    ctx.stroke();

    // Draw outer circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, size, 0, PI2, false);
    ctx.closePath();

    ctx.lineWidth = 10;
    ctx.strokeStyle = primaryColor;
    ctx.stroke();
  };

  const drawNeedle = () => {
    const ctx = canvasContext;
    if (!ctx) return;
    ctx.lineWidth = 1;
    ctx.strokeStyle = contrastColor;
    ctx.fillStyle = contrastColor;
    ctx.beginPath();
    ctx.moveTo(centerX + needleSize * 0.2, centerY - needleSize);
    ctx.lineTo(centerX - needleSize * 0.2, centerY - needleSize);
    ctx.lineTo(centerX, centerY - needleSize - 20);
    ctx.closePath();
    ctx.fill();
    const change = angleCurrent + Math.PI / 2;
    let i =
      teams.length - Math.floor((change / (Math.PI * 2)) * teams.length) - 1;
    if (i < 0) i = i + teams.length;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = primaryColor;
    ctx.font = "bold 1.5em " + fontFamily;
    currentSegment = teams[i]!;
    isStarted &&
      ctx.fillText(
        currentSegment!.team.name,
        centerX + 10,
        centerY + size + 50,
      );
  };
  const clear = () => {
    const ctx = canvasContext;
    if (!ctx) return;
    ctx.clearRect(0, 0, gameWidth, gameHeight);
  };
  useImperativeHandle(ref, () => ({
    spin: () => {
      initCanvas();
      spin();
    },
    currentSegment: currentSegment,
  }));
  return (
    <div id="wheel">
      <canvas
        id="canvas"
        width={gameWidth}
        height={gameHeight}
        className="pointer-events-auto"
      />
    </div>
  );
};
export default forwardRef(TeamWheelComponent);
