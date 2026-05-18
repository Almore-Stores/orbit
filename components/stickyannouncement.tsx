import { useState, useEffect, useMemo } from "react";
import { IconX, IconPin, IconPencil, IconCheck } from "@tabler/icons-react";
import { useRouter } from "next/router";
import axios from "axios";
import toast from "react-hot-toast";
import packageinfo from '@/package.json'
import { useRecoilState } from "recoil";
import { workspacestate } from "@/state";

const ANNOUNCEMENT_KEY = `announcementDismissed_${packageinfo.version}`;

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
  subtitle: `Update: v${packageinfo.version} is now live!`,
  sections: [
    {
      title: "",
      content:
        "Another week, another drop. Here's what's new — and trust us, there's plenty.",
    },
    {
      title: "💬 Feedback platform",
      content:
        "We launched our official feedback platform at feedback.planetaryapp.us — got a suggestion, bug report, or idea? Now there's a home for it.",
    },
    {
      title: "📋 Sessions board",
      content:
        "A brand new sessions board is here. Head to Settings > Integrations to get it set up and start managing sessions in a whole new way.",
    },
    {
      title: "📝 Resignation logs",
      content:
        "Resignations now leave a proper paper trail. Logs are tracked and accessible so nothing slips through the cracks.",
    },
    {
      title: "🏠 Home screen reorganisation",
      content:
        "The home screen has been tidied up and reorganised — things are where you'd expect them to be now.",
    },
    {
      title: "⚖️ Affiliate discipline",
      content:
        "You can now issue strikes, set strike limits, and action terminations for affiliates directly within Planetary.",
    },
    {
      title: "🔄 Workspace refresh",
      content:
        "Refresh icons have been added across workspaces — keeping your data up to date is now just one click away.",
    },
    {
      title: "",
      content:
        "And honestly? We've barely scratched the surface. There's a lot more in store — we'd rather you discover it yourself. 👀",
    },
  ],
  editorUsername: null,
  editorPicture: null,
  isDefault: true,
};

export default function StickyNoteAnnouncement() {
  const router = useRouter();
  const [workspace] = useRecoilState(workspacestate);
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
    <div className="z-0 bg-white dark:bg-zinc-900/70 rounded-2xl shadow-[0_1px_3px_0_rgb(0,0,0,0.06),0_1px_2px_-1px_rgb(0,0,0,0.04)] dark:shadow-zinc-950/30 p-4 flex items-start space-x-4 mb-6 relative">
      <img
        src={"/alex.png"}
        alt={"Alex"}
        className="w-10 h-10 rounded-full object-cover bg-zinc-100 dark:bg-zinc-800 flex-shrink-0"
      />
      <div className="flex-1">
        {isEditing ? (
          <div className="space-y-3 pt-0.5">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-[11px] font-medium text-zinc-400 dark:text-zinc-500">Title</label>
                <input
                  type="text"
                  value={editData?.title || ""}
                  onChange={(e) => setEditData({ ...editData!, title: e.target.value })}
                  className="w-full rounded-xl border-0 bg-zinc-100 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-zinc-800 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-medium text-zinc-400 dark:text-zinc-500">Subtitle</label>
                <input
                  type="text"
                  value={editData?.subtitle || ""}
                  onChange={(e) => setEditData({ ...editData!, subtitle: e.target.value })}
                  className="w-full rounded-xl border-0 bg-zinc-100 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-zinc-800 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              {editData?.sections.map((section, index) => (
                <div key={index} className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-800/60">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500">Section {index + 1}</span>
                    {editData.sections.length > 1 && (
                      <button
                        onClick={() => removeSection(index)}
                        className="text-[11px] font-medium text-red-400 hover:text-red-500 transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="Section title (optional)"
                    value={section.title}
                    onChange={(e) => updateSection(index, "title", e.target.value)}
                    className="mb-2 w-full rounded-lg border-0 bg-white px-2.5 py-1.5 text-sm text-zinc-900 placeholder-zinc-400 shadow-none focus:outline-none focus:ring-1 focus:ring-primary dark:bg-zinc-700 dark:text-white"
                  />
                  <textarea
                    placeholder="Section content"
                    value={section.content}
                    onChange={(e) => updateSection(index, "content", e.target.value)}
                    rows={3}
                    className="w-full rounded-lg border-0 bg-white px-2.5 py-1.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-primary dark:bg-zinc-700 dark:text-white resize-none"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={addSection}
              className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
            >
              + Add section
            </button>

            <div className="flex gap-2 pt-1">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                <IconCheck className="w-3.5 h-3.5" />
                {isSaving ? "Saving…" : "Save"}
              </button>
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="rounded-xl px-4 py-2 text-sm font-medium text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-1 flex items-center gap-1">
              <IconPin className="w-4 h-4 text-zinc-500 dark:text-zinc-300" />
              {displayAnnouncement.title}
            </h3>

    <p>
      If you’re new here, take a moment to explore the dashboard and settings.
      Everything is built to scale with your team as you grow.
    </p>
  </div>
</div>
    </div>
  );
}
