




"use client";
import { useState, useEffect, useRef } from "react";
import Card from "../components/Card";
import Header from "../components/Header";
import LeftPane from "../components/LeftPane";
import RightPane from "../components/RightPane";
import { githubService } from "../lib/githubService";
import { cardExporter } from "../lib/cardExporter";

export interface CardElement {
  id: number;
  type: string;
  content?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  fontWeight?: string;
  textAlign?: string;
  githubStat?: string;
  src?: string;
  opacity?: number;
  imageType?: string;
  borderStyle?: string;
  borderWidth?: number;
  borderColor?: string;
  borderRadius?: number;
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  shapeType?: string;
  trophyType?: string;
  trophyColor?: string;
  badgeText?: string;
  badgeColor?: string;
  badgeTextColor?: string;
  rows?: number;
  columns?: number;
  tableData?: string[][];
  headerBgColor?: string;
  cellBgColor?: string;
  statType?: string;
  statValue?: string;
  statLabel?: string;
  statIcon?: string;
  progressValue?: number;
  progressColor?: string;
  progressBgColor?: string;
  progressLabel?: string;
  languages?: { name: string; percentage: number; color: string }[];
  contributionData?: number[][];
  contributionColors?: string[];
}

export interface CardSettings {
  backgroundColor: string;
  backgroundImage?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  padding?: number;
  shadow?: string;
  width?: number;
  height?: number;
}

const Create = () => {
  const [cardElements, setCardElements] = useState<CardElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<number | null>(null);
  const [githubUsername, setGithubUsername] = useState<string>("");
  const [githubToken, setGithubToken] = useState<string>("");
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [exportedImageUrl, setExportedImageUrl] = useState<string>("");
  const [cardSettings, setCardSettings] = useState<CardSettings>({
    backgroundColor: "#1a1a2e",
    borderColor: "#3b82f6",
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    shadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    width: 800,
    height: 600,
  });

  const cardRef = useRef<HTMLDivElement>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const savedElements = localStorage.getItem("cardElements");
    const savedSettings = localStorage.getItem("cardSettings");
    const savedSelectedId = localStorage.getItem("selectedElementId");
    const savedGithubUrl = localStorage.getItem("github_url");
    const savedToken = localStorage.getItem("github_token");

    if (savedElements) {
      try {
        setCardElements(JSON.parse(savedElements));
      } catch (e) {
        console.error("Failed to load elements:", e);
      }
    }

    if (savedSettings) {
      try {
        setCardSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error("Failed to load settings:", e);
      }
    }

    if (savedSelectedId) {
      try {
        setSelectedElementId(JSON.parse(savedSelectedId));
      } catch (e) {
        console.error("Failed to load selected ID:", e);
      }
    }

    if (savedGithubUrl) {
      const username = extractUsernameFromUrl(savedGithubUrl);
      if (username) {
        setGithubUsername(username);
      }
    }

    if (savedToken) {
      setGithubToken(savedToken);
      githubService.setToken(savedToken);
    }

    // Suppress hydration warnings
    if (typeof window !== 'undefined') {
      const style = document.createElement('style');
      style.textContent = `
        body { -webkit-font-smoothing: antialiased; }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("cardElements", JSON.stringify(cardElements));
  }, [cardElements]);

  useEffect(() => {
    localStorage.setItem("cardSettings", JSON.stringify(cardSettings));
  }, [cardSettings]);

  useEffect(() => {
    localStorage.setItem("selectedElementId", JSON.stringify(selectedElementId));
  }, [selectedElementId]);

  const extractUsernameFromUrl = (url: string): string => {
    const match = url.match(/github\.com\/([^\/]+)/);
    return match ? match[1] : "";
  };

  const handleUsernameSubmit = (url: string) => {
    const username = extractUsernameFromUrl(url);
    if (username) {
      setGithubUsername(username);
      localStorage.setItem("github_url", url);
      setShowUsernameModal(false);

      // Auto-fetch all stats for existing elements
      fetchAllStatsForElements(username);
    }
  };

  const handleTokenSubmit = () => {
    githubService.setToken(githubToken);
    setShowTokenInput(false);
  };

  const fetchAllStatsForElements = async (username: string) => {
    if (!username) return;

    try {
      // Fetch all stats in one go
      const [stats, languages, contributions] = await Promise.all([
        githubService.getAllStats(username),
        githubService.getLanguageStats(username),
        githubService.getContributionData(username),
      ]);

      // Update all elements with the fetched data
      setCardElements(prev => prev.map(el => {
        if (el.type === "text" && el.githubStat && el.githubStat !== "none") {
          const statMap: { [key: string]: string } = {
            "Total Stars": githubService.formatNumber(stats.totalStars),
            "Total Commits": githubService.formatNumber(stats.totalCommits),
            "Total PRs": stats.totalPRs.toString(),
            "Total Issues": stats.totalIssues.toString(),
            "Contributed to": stats.contributedTo.toString(),
            "Public Repositories": stats.publicRepos.toString(),
            "Followers": stats.followers.toString(),
            "Following": stats.following.toString(),
          };
          return { ...el, content: statMap[el.githubStat] || el.content };
        } else if (el.type === "statsCard") {
          return { ...el, statValue: githubService.formatNumber(stats.totalStars) };
        } else if (el.type === "languageBar") {
          return { ...el, languages };
        } else if (el.type === "contributionGraph") {
          // Convert contribution data to grid format
          const grid: number[][] = [];
          for (let week = 0; week < 52; week++) {
            const weekData: number[] = [];
            for (let day = 0; day < 7; day++) {
              const index = week * 7 + day;
              if (index < contributions.length) {
                weekData.push(contributions[index].level);
              } else {
                weekData.push(0);
              }
            }
            grid.push(weekData);
          }
          return { ...el, contributionData: grid };
        } else if (el.type === "image" && el.imageType === "github-profile") {
          return { ...el, src: `https://github.com/${username}.png` };
        }
        return el;
      }));
    } catch (error) {
      console.error("Error fetching stats:", error);
      alert("Failed to fetch GitHub stats. Please check your username and token.");
    }
  };

  const handleExportCard = async () => {
    if (!cardRef.current) return;

    setExportLoading(true);
    try {
      const cardElement = cardRef.current.querySelector('.card') as HTMLElement;
      if (!cardElement) throw new Error('Card element not found');

      const blob = await cardExporter.exportAsPNG(cardElement, cardSettings);
      const url = URL.createObjectURL(blob);
      setExportedImageUrl(url);
      setShowExportModal(true);
    } catch (error) {
      console.error("Error exporting card:", error);
      alert("Failed to export card. Please try again.");
    } finally {
      setExportLoading(false);
    }
  };

  const handleDownloadImage = () => {
    if (!exportedImageUrl) return;

    fetch(exportedImageUrl)
      .then(res => res.blob())
      .then(blob => {
        cardExporter.downloadBlob(blob, `github-card-${githubUsername || 'export'}.png`);
      });
  };

  const handleCopyImage = async () => {
    if (!exportedImageUrl) return;

    try {
      const blob = await fetch(exportedImageUrl).then(res => res.blob());
      const success = await cardExporter.copyImageToClipboard(blob);
      if (success) {
        alert("Image copied to clipboard!");
      } else {
        alert("Failed to copy image. Your browser may not support this feature.");
      }
    } catch (error) {
      console.error("Error copying image:", error);
      alert("Failed to copy image.");
    }
  };

  const generateReadmeCode = (): string => {
    // In production, this would be a hosted URL
    const imageUrl = `https://your-app.com/api/card/${githubUsername}`;
    const profileUrl = `https://github.com/${githubUsername}`;

    //    return cardExporter.generateReadmeHTML(imageUrl, githubUsername, profileUrl);
    return "Hey there user, this does NOT work yet :sob:";
  };


  const addTextToCard = () => {
    const newElement: CardElement = {
      id: Date.now(),
      type: "text",
      content: "New Text",
      x: 20,
      y: 20,
      width: 200,
      height: 40,
      rotation: 0,
      fontSize: 16,
      fontFamily: "Arial",
      color: "#ffffff",
      fontWeight: "normal",
      textAlign: "left",
      githubStat: "none",
    };
    setCardElements((prev) => [...prev, newElement]);
    setSelectedElementId(newElement.id);
  };

  const addImageToCard = () => {
    const newElement: CardElement = {
      id: Date.now(),
      type: "image",
      x: 50,
      y: 50,
      width: 150,
      height: 150,
      rotation: 0,
      src: githubUsername ? `https://github.com/${githubUsername}.png` : "https://via.placeholder.com/150",
      opacity: 1,
      imageType: githubUsername ? "github-profile" : "custom",
      borderRadius: 8,
      borderStyle: "none",
    };
    setCardElements((prev) => [...prev, newElement]);
    setSelectedElementId(newElement.id);
  };

  const addShapeToCard = () => {
    const newElement: CardElement = {
      id: Date.now(),
      type: "shape",
      x: 100,
      y: 100,
      width: 100,
      height: 100,
      rotation: 0,
      fillColor: "#3b82f6",
      strokeColor: "#1e40af",
      strokeWidth: 2,
      shapeType: "rectangle",
    };
    setCardElements((prev) => [...prev, newElement]);
    setSelectedElementId(newElement.id);
  };

  const addTrophyToCard = () => {
    const newElement: CardElement = {
      id: Date.now(),
      type: "trophy",
      x: 150,
      y: 150,
      width: 80,
      height: 100,
      rotation: 0,
      trophyType: "gold",
      trophyColor: "#FFD700",
    };
    setCardElements((prev) => [...prev, newElement]);
    setSelectedElementId(newElement.id);
  };

  const addBadgeToCard = () => {
    const newElement: CardElement = {
      id: Date.now(),
      type: "badge",
      x: 200,
      y: 50,
      width: 120,
      height: 40,
      rotation: 0,
      badgeText: "NEW",
      badgeColor: "#3b82f6",
      badgeTextColor: "#ffffff",
      fontSize: 14,
      fontWeight: "bold",
    };
    setCardElements((prev) => [...prev, newElement]);
    setSelectedElementId(newElement.id);
  };

  const addTableToCard = () => {
    const newElement: CardElement = {
      id: Date.now(),
      type: "table",
      x: 50,
      y: 200,
      width: 400,
      height: 200,
      rotation: 0,
      rows: 3,
      columns: 3,
      tableData: [
        ["Header 1", "Header 2", "Header 3"],
        ["Data 1", "Data 2", "Data 3"],
        ["Data 4", "Data 5", "Data 6"],
      ],
      headerBgColor: "#3b82f6",
      cellBgColor: "#27272a",
      color: "#ffffff",
    };
    setCardElements((prev) => [...prev, newElement]);
    setSelectedElementId(newElement.id);
  };

  const addStatsCardToCard = () => {
    const newElement: CardElement = {
      id: Date.now(),
      type: "statsCard",
      x: 50,
      y: 50,
      width: 180,
      height: 120,
      rotation: 0,
      statType: "commits",
      statValue: "1,234",
      statLabel: "Total Commits",
      statIcon: "📊",
      color: "#ffffff",
      fillColor: "#1e293b",
      strokeColor: "#3b82f6",
      strokeWidth: 2,
      fontSize: 32,
      borderRadius: 12,
    };
    setCardElements((prev) => [...prev, newElement]);
    setSelectedElementId(newElement.id);
  };

  const addProgressBarToCard = () => {
    const newElement: CardElement = {
      id: Date.now(),
      type: "progressBar",
      x: 50,
      y: 100,
      width: 300,
      height: 40,
      rotation: 0,
      progressValue: 75,
      progressColor: "#22c55e",
      progressBgColor: "#374151",
      progressLabel: "Profile Completeness",
      color: "#ffffff",
      fontSize: 14,
      borderRadius: 8,
    };
    setCardElements((prev) => [...prev, newElement]);
    setSelectedElementId(newElement.id);
  };

  const addLanguageBarToCard = () => {
    const newElement: CardElement = {
      id: Date.now(),
      type: "languageBar",
      x: 50,
      y: 150,
      width: 400,
      height: 80,
      rotation: 0,
      languages: [
        { name: "JavaScript", percentage: 45, color: "#f7df1e" },
        { name: "TypeScript", percentage: 30, color: "#3178c6" },
        { name: "Python", percentage: 15, color: "#3776ab" },
        { name: "CSS", percentage: 10, color: "#264de4" },
      ],
      color: "#ffffff",
      fontSize: 12,
    };
    setCardElements((prev) => [...prev, newElement]);
    setSelectedElementId(newElement.id);
  };

  const addContributionGraphToCard = () => {
    const generateSampleData = () => {
      const data = [];
      for (let week = 0; week < 52; week++) {
        const weekData = [];
        for (let day = 0; day < 7; day++) {
          weekData.push(Math.floor(Math.random() * 5));
        }
        data.push(weekData);
      }
      return data;
    };

    const newElement: CardElement = {
      id: Date.now(),
      type: "contributionGraph",
      x: 50,
      y: 200,
      width: 600,
      height: 120,
      rotation: 0,
      contributionData: generateSampleData(),
      contributionColors: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
      color: "#ffffff",
      fontSize: 10,
    };
    setCardElements((prev) => [...prev, newElement]);
    setSelectedElementId(newElement.id);
  };

  const addIconToCard = () => {
    const newElement: CardElement = {
      id: Date.now(),
      type: "icon",
      x: 100,
      y: 100,
      width: 60,
      height: 60,
      rotation: 0,
      content: "⭐",
      fontSize: 48,
      color: "#FFD700",
    };
    setCardElements((prev) => [...prev, newElement]);
    setSelectedElementId(newElement.id);
  };

  const updateCardElement = (id: number, data: Partial<CardElement>) => {
    setCardElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, ...data } : el))
    );
  };

  const deleteSelectedElement = () => {
    if (selectedElementId !== null) {
      setCardElements((prev) => prev.filter((el) => el.id !== selectedElementId));
      setSelectedElementId(null);
    }
  };

  const duplicateSelectedElement = () => {
    if (selectedElementId !== null) {
      const elementToDuplicate = cardElements.find((el) => el.id === selectedElementId);
      if (elementToDuplicate) {
        const newElement = {
          ...elementToDuplicate,
          id: Date.now(),
          x: elementToDuplicate.x + 20,
          y: elementToDuplicate.y + 20,
        };
        setCardElements((prev) => [...prev, newElement]);
        setSelectedElementId(newElement.id);
      }
    }
  };

  const clearAllElements = () => {
    if (confirm("Are you sure you want to clear all elements?")) {
      setCardElements([]);
      setSelectedElementId(null);
    }
  };

  const selectedElement = cardElements.find((el) => el.id === selectedElementId);

  return (
    <div className="createPageDiv min-h-screen bg-[#0a0a0a] !cursor-default!" suppressHydrationWarning>
      <Header />

      {/* Top Action Bar */}
      <div className="fixed top-16 right-4 z-50 flex gap-2">
        <button
          onClick={() => setShowUsernameModal(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg"
        >
          👤 {githubUsername || "Set Username"}
        </button>

        <button
          onClick={() => setShowTokenInput(!showTokenInput)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg"
        >
          🔑 Token
        </button>

        {githubUsername && (
          <button
            onClick={() => fetchAllStatsForElements(githubUsername)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg"
          >
            🔄 Refresh Stats
          </button>
        )}

        <button
          onClick={handleExportCard}
          disabled={exportLoading}
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg disabled:opacity-50"
        >
          {exportLoading ? "Exporting..." : "📥 Export"}
        </button>
      </div>

      {/* Token Input Dropdown */}
      {showTokenInput && (
        <div className="fixed top-28 right-4 z-50 bg-zinc-900 rounded-lg p-4 shadow-2xl border border-zinc-700 w-80">
          <h3 className="text-white font-semibold mb-2">GitHub Token</h3>
          <p className="text-zinc-400 text-xs mb-3">
            For better rate limits and real contribution data
          </p>
          <input
            type="password"
            value={githubToken}
            onChange={(e) => setGithubToken(e.target.value)}
            placeholder="ghp_xxxxxxxxxxxxx"
            className="w-full bg-zinc-800 text-white px-3 py-2 rounded border border-zinc-600 focus:border-blue-500 focus:outline-none text-sm mb-3"
          />
          <div className="flex gap-2">
            <button
              onClick={handleTokenSubmit}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm"
            >
              Save
            </button>
            <button
              onClick={() => setShowTokenInput(false)}
              className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white px-3 py-2 rounded text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Username Modal */}
      {showUsernameModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-zinc-900 rounded-xl p-6 shadow-2xl border border-zinc-700 w-96">
            <h2 className="text-2xl font-bold text-white mb-4">Set GitHub Username</h2>
            <p className="text-zinc-400 text-sm mb-4">
              Enter your GitHub profile URL or username
            </p>
            <input
              type="text"
              placeholder="https://github.com/username or username"
              defaultValue={githubUsername ? `https://github.com/${githubUsername}` : ""}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleUsernameSubmit(e.currentTarget.value);
                }
              }}
              className="w-full bg-zinc-800 text-white px-4 py-3 rounded-lg border border-zinc-600 focus:border-blue-500 focus:outline-none mb-4"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={(e) => {
                  const input = (e.target as HTMLElement).previousElementSibling?.previousElementSibling as HTMLInputElement;
                  if (input) handleUsernameSubmit(input.value);
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
              >
                Save
              </button>
              <button
                onClick={() => setShowUsernameModal(false)}
                className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded-lg font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-zinc-900 rounded-xl p-6 shadow-2xl border border-zinc-700 w-[600px] max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-4">Export Card</h2>

            {/* Preview */}
            {exportedImageUrl && (
              <div className="mb-4 border border-zinc-700 rounded-lg overflow-hidden">
                <img src={exportedImageUrl} alt="Exported card" className="w-full" />
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                onClick={handleDownloadImage}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium"
              >
                💾 Download PNG
              </button>
              <button
                onClick={handleCopyImage}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg font-medium"
              >
                📋 Copy Image
              </button>
            </div>

            {/* README Code */}
            <div className="mb-4">
              <h3 className="text-white font-semibold mb-2">README Code</h3>
              <p className="text-zinc-400 text-xs mb-2">
                Copy this code to add the card to your GitHub README
              </p>
              <div className="bg-zinc-800 rounded-lg p-3 border border-zinc-700">
                <code className="text-xs text-green-400 break-all">
                  {generateReadmeCode()}
                </code>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generateReadmeCode());
                  alert("Code copied to clipboard!");
                }}
                className="w-full mt-2 bg-zinc-700 hover:bg-zinc-600 text-white px-3 py-2 rounded text-sm"
              >
                📋 Copy Code
              </button>
            </div>

            <button
              onClick={() => {
                setShowExportModal(false);
                URL.revokeObjectURL(exportedImageUrl);
                setExportedImageUrl("");
              }}
              className="w-full bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded-lg font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="creativityArea justify-between flex flex-row items-start" ref={cardRef}>
        <LeftPane
          onAddText={addTextToCard}
          onAddImage={addImageToCard}
          onAddShape={addShapeToCard}
          onAddTrophy={addTrophyToCard}
          onAddBadge={addBadgeToCard}
          onAddTable={addTableToCard}
          onAddStatsCard={addStatsCardToCard}
          onAddProgressBar={addProgressBarToCard}
          onAddLanguageBar={addLanguageBarToCard}
          onAddContributionGraph={addContributionGraphToCard}
          onAddIcon={addIconToCard}
          onClearAll={clearAllElements}
        />
        <Card
          elements={cardElements}
          onUpdateElement={updateCardElement}
          selectedElementId={selectedElementId}
          onSelectElement={setSelectedElementId}
          settings={cardSettings}
          onUpdateSettings={setCardSettings}
        />
        <RightPane
          selectedElement={selectedElement}
          onUpdateElement={updateCardElement}
          onDeleteElement={deleteSelectedElement}
          onDuplicateElement={duplicateSelectedElement}
          cardSettings={cardSettings}
          onUpdateCardSettings={setCardSettings}
          githubUsername={githubUsername}
        />
      </div>
    </div>
  );
};

export default Create;
