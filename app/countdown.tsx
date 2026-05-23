"use client";

import { useEffect, useRef, useState } from "react";

type Props = { targetIso: string };

type Parts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
};

function compute(target: number): Parts {
  const now = Date.now();
  const totalMs = Math.max(0, target - now);
  const totalSec = Math.floor(totalMs / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  return { days, hours, minutes, seconds, totalMs };
}

export default function Countdown({ targetIso }: Props) {
  const target = new Date(targetIso).getTime();
  const [parts, setParts] = useState<Parts>(() => compute(target));
  const [soundOn, setSoundOn] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const lastTickSecRef = useRef<number>(-1);

  useEffect(() => {
    const id = setInterval(() => setParts(compute(target)), 250);
    return () => clearInterval(id);
  }, [target]);

  useEffect(() => {
    if (!soundOn) return;
    if (parts.totalMs <= 0) return;
    const sec = parts.seconds;
    if (sec === lastTickSecRef.current) return;
    lastTickSecRef.current = sec;

    const ctx = audioCtxRef.current;
    if (!ctx) return;

    const finalCountdown =
      parts.days === 0 &&
      parts.hours === 0 &&
      parts.minutes === 0 &&
      parts.seconds <= 10;

    const isMinuteMark = parts.seconds === 0;
    playTick(ctx, {
      frequency: finalCountdown ? 1200 : isMinuteMark ? 900 : 700,
      duration: finalCountdown ? 0.18 : isMinuteMark ? 0.16 : 0.06,
      gain: finalCountdown ? 0.5 : isMinuteMark ? 0.35 : 0.22,
    });
  }, [parts, soundOn]);

  async function enableSound() {
    try {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new Ctor();
      }
      await audioCtxRef.current.resume();
      setSoundOn(true);
    } catch {
      // ignore
    }
  }

  function disableSound() {
    setSoundOn(false);
  }

  const expired = parts.totalMs <= 0;
  const finalCountdown =
    !expired &&
    parts.days === 0 &&
    parts.hours === 0 &&
    parts.minutes === 0 &&
    parts.seconds <= 10;

  return (
    <div
      className={
        "countdown-root" +
        (finalCountdown ? " is-final" : "") +
        (expired ? " is-expired" : "")
      }
    >
      <div className="cd-top">
        <div className="cd-label">Ústní část maturity</div>
        <div className="cd-controls">
          {soundOn ? (
            <button className="cd-btn" onClick={disableSound}>
              Zvuk: ZAP
            </button>
          ) : (
            <button className="cd-btn" onClick={enableSound}>
              Zvuk: VYP
            </button>
          )}
        </div>
      </div>

      {expired ? (
        <div className="cd-expired">
          <div className="cd-expired-title">JE ČAS.</div>
          <div className="cd-expired-sub">25. května 2026 — 7:30</div>
        </div>
      ) : (
        <div className="cd-grid">
          <Unit value={parts.days} label="DNŮ" />
          <Sep />
          <Unit value={parts.hours} label="HODIN" pad={2} />
          <Sep />
          <Unit value={parts.minutes} label="MINUT" pad={2} />
          <Sep />
          <Unit value={parts.seconds} label="SEKUND" pad={2} pulse />
        </div>
      )}

      <div className="cd-bottom">
        <div className="cd-target">cíl: 25. 05. 2026 — 07:30</div>
        {!soundOn && (
          <div className="cd-hint">
            Pro dramatický efekt klikni na „Zvuk“ a povol tikání.
          </div>
        )}
      </div>

    </div>
  );
}

function Unit({
  value,
  label,
  pad = 0,
  pulse = false,
}: {
  value: number;
  label: string;
  pad?: number;
  pulse?: boolean;
}) {
  const text = pad ? String(value).padStart(pad, "0") : String(value);
  return (
    <div className={"cd-unit" + (pulse ? " cd-unit-pulse" : "")}>
      <div className="cd-value">{text}</div>
      <div className="cd-unit-label">{label}</div>
    </div>
  );
}

function Sep() {
  return <div className="cd-sep">:</div>;
}

function playTick(
  ctx: AudioContext,
  opts: { frequency: number; duration: number; gain: number },
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "square";
  osc.frequency.value = opts.frequency;
  const now = ctx.currentTime;
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(opts.gain, now + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + opts.duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + opts.duration + 0.02);
}
