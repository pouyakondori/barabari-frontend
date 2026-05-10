"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Play, Pause, Download, Volume2, VolumeX } from "lucide-react";
import { useTranslation } from "@/locale";

const BACKEND_URL = process.env.NEXT_PUBLIC_REST_URL || "http://localhost:4001";

interface PodcastPlayerProps {
  audioUrl: string;
  title: string;
  description?: string;
  duration?: number;
}

function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function PodcastPlayer({ audioUrl, title, description, duration }: PodcastPlayerProps) {
  const { t } = useTranslation();
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(duration || 0);
  const [isMuted, setIsMuted] = useState(false);

  const fullUrl = audioUrl.startsWith("http") ? audioUrl : `${BACKEND_URL}${audioUrl}`;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => {
      if (audio.duration && isFinite(audio.duration)) {
        setTotalDuration(audio.duration);
      }
    };
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  }, [isMuted]);

  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const bar = progressRef.current;
    if (!audio || !bar) return;

    const rect = bar.getBoundingClientRect();
    const isRtl = document.documentElement.dir === "rtl";
    const clickX = isRtl ? rect.right - e.clientX : e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));

    if (totalDuration > 0) {
      audio.currentTime = ratio * totalDuration;
    }
  }, [totalDuration]);

  const progress = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 shadow-sm">
      <audio ref={audioRef} src={fullUrl} preload="metadata" />

      {/* Title & description */}
      <div className="mb-3">
        <h4 className="text-sm font-semibold text-[var(--color-foreground)] truncate">{title}</h4>
        {description && (
          <p className="text-xs text-[var(--color-muted-foreground)] mt-1 line-clamp-2">{description}</p>
        )}
      </div>

      {/* Controls row */}
      <div className="flex items-center gap-3">
        <button
          onClick={togglePlay}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-white hover:opacity-90 transition-opacity"
          aria-label={isPlaying ? t("podcasts.pause") : t("podcasts.play")}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ms-0.5" />}
        </button>

        <div className="flex-1 flex items-center gap-2">
          <span className="text-xs text-[var(--color-muted-foreground)] tabular-nums w-10 text-end">
            {formatTime(currentTime)}
          </span>
          <div
            ref={progressRef}
            onClick={handleSeek}
            className="relative flex-1 h-2 bg-[var(--color-muted)] rounded-full cursor-pointer group"
          >
            <div
              className="absolute inset-y-0 start-0 bg-[var(--color-primary)] rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-[var(--color-primary)] rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ insetInlineStart: `calc(${progress}% - 7px)` }}
            />
          </div>
          <span className="text-xs text-[var(--color-muted-foreground)] tabular-nums w-10">
            {formatTime(totalDuration)}
          </span>
        </div>

        <button
          onClick={toggleMute}
          className="text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
          aria-label={isMuted ? t("podcasts.unmute") : t("podcasts.mute")}
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>

        <a
          href={fullUrl}
          download
          className="text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
          aria-label={t("podcasts.download")}
        >
          <Download className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
