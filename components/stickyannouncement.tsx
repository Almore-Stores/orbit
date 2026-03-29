import { useState, useEffect, useMemo } from "react";
import { IconX, IconPin, IconPencil, IconCheck } from "@tabler/icons-react";
import { useRouter } from "next/router";
import axios from "axios";
import toast from "react-hot-toast";
import { useRecoilState } from "recoil";
import { loginState } from "@/state";

const ANNOUNCEMENT_KEY = "announcementDismissed_v3";

interface Section {
  title: string;
  content: string;
}

interface Announcement {
  title: string;
  subtitle?: string;
  sections: Section[];
  editorUsername?: string | null;
  editorPicture?: string | null;
  isDefault?: boolean;
}

const defaultAnnouncement: Announcement = {
  title: "Planetary",
  subtitle: "Update: v2.1.10 is now live!",
  sections: [
    {
      title: "",
      content:
        "This one's a big one. From a full platform redesign to brand new features — here's a peek at what dropped this week.",
    },
    {
      title: "📱 Mobile bottom bar",
      content:
        "Navigation on mobile just got a whole lot better. A new bottom bar keeps everything within reach, right where your thumbs are.",
    },
    {
      title: "🛠️ Staff views on mobile",
      content:
        "Staff dashboards are now properly optimized for mobile devices — no more squinting or awkward scrolling.",
    },
    {
      title: "🎵 Music quotes",
      content:
        "We've introduced music quotes — a new way to share what you're listening to and spark conversations around it.",
    },
    {
      title: "✨ Platform redesign",
      content:
        "Planetary has had a major glow-up. Cleaner, faster, and more intuitive across the board.",
    },
    {
      title: "",
      content:
        "And honestly? There's a lot more we didn't mention — you'll just have to discover it yourself. 👀",
    },
  ],
  editorUsername: null,
  editorPicture: null,
  isDefault: true,
};

export default function StickyNoteAnnouncement() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [login, setLogin] = useRecoilState(loginState);
  const [canEdit, setCanEdit] = useState(false);
  const [announcement, setAnnouncement] = useState<Announcement>(defaultAnnouncement);
  const [editData, setEditData] = useState<Announcement | null>(null);

  useEffect(() => {
    const dismissed = localStorage.getItem(ANNOUNCEMENT_KEY);
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);

  useEffect(() => {
    if (router.query.id) {
      fetchAnnouncement();
    }
  }, [router.query.id]);

  const fetchAnnouncement = async () => {
    try {
      const response = await axios.get(
        `/api/workspace/${router.query.id}/announcement`
      );
      if (response.data.success) {
        setAnnouncement(response.data.announcement);
        setCanEdit(response.data.canEdit);
      }
    } catch (error) {
      console.error("Error fetching announcement:", error);
    }
  };

  

  if (!isVisible) return null;

  const displayAnnouncement = isEditing ? editData : announcement;
  if (!displayAnnouncement) return null;

  return (
    <div className="z-0 bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-xl shadow-sm p-4 flex items-start space-x-4 mb-6 relative">
      <img
        src="/alex.png"
        alt="Orbit"
        className="w-10 h-10 rounded-full bg-primary flex-shrink-0"
      />
      <div className="flex-1">
  <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-1 flex items-center gap-1">
    <IconPin className="w-4 h-4 text-zinc-500 dark:text-zinc-300" />
    Welcome to Almore Management Platform
  </h3>

  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
    Hey {login.displayname} 👋 we're glad to have you here.
  </p>

  <div className="text-sm text-zinc-800 dark:text-zinc-300 space-y-3 leading-relaxed">
    <p>
      This is your central hub for managing everything related to your workspace —
      from roles and permissions to internal tools, activity, and configurations.
    </p>

    <p>
      Almore is designed to be fast, flexible, and intuitive, giving you full
      control without unnecessary complexity.
    </p>

    <p>
      If you’re new here, take a moment to explore the dashboard and settings.
      Everything is built to scale with your team as you grow.
    </p>
  </div>
</div>
    </div>
  );
}
