import { useState, useEffect, useMemo } from "react";
import { IconX, IconPin, IconPencil, IconCheck } from "@tabler/icons-react";
import { useRouter } from "next/router";
import axios from "axios";
import toast from "react-hot-toast";

import { loginState, workspacestate } from "@/state"
import { useRecoilState } from "recoil";
import randomText from "@/utils/randomText";

const ANNOUNCEMENT_KEY = "announcementDismissed_v2";

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
  subtitle: "Update: v2.1.8 is now live!",
  sections: [
    {
      title: "",
      content:
        "We're keeping this going with a well needed update. Here are a few highlights from this week's work and community feedback.",
    },
    {
      title: "💼 Permissions",
      content:
        "We now have over 50 permissions available to assign to roles!",
    },
    {
      title: "🧹",
      content:
        "Improved overall performance and stability across the board.",
    },
    {
      title: "",
      content:
        "That's a wrap for this week — we'll see you soon for more updates from Team Planetary.",
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
