"use client";
import { useState, useRef } from "react";
import PaneButton from "./PaneButton";

interface LeftPaneProps {
  onAddText: () => void;
  onAddImage: () => void;
  onAddShape: () => void;
  onAddTrophy: () => void;
  onAddBadge: () => void;
  onAddTable: () => void;
  onAddStatsCard: () => void;
  onAddProgressBar: () => void;
  onAddLanguageBar: () => void;
  onAddContributionGraph: () => void;
  onAddIcon: () => void;
  onAddQRCode: () => void;
  onAddChart: () => void;
  onAddSocialBadge: () => void;
  onClearAll: () => void;
}

const LeftPane: React.FC<LeftPaneProps> = ({
  onAddText,
  onAddImage,
  onAddShape,
  onAddTrophy,
  onAddBadge,
  onAddTable,
  onAddStatsCard,
  onAddProgressBar,
  onAddLanguageBar,
  onAddContributionGraph,
  onAddIcon,
  onAddQRCode,
  onAddChart,
  onAddSocialBadge,
  onClearAll,
}) => {
  const [width, setWidth] = useState(320);
  const resizing = useRef(false);

  const startResizing = () => {
    resizing.current = true;
  };

  const stopResize = () => {
    resizing.current = false;
  };

  const resize = (e: React.MouseEvent) => {
    if (!resizing.current) return;
    setWidth(Math.max(200, e.clientX));
  };

  const handlePaneAction = (action: string) => {
    console.log("Action:", action);
    if (action === "add_text") onAddText();
    if (action === "add_image") onAddImage();
    if (action === "add_shape") onAddShape();
    if (action === "add_trophy") onAddTrophy();
    if (action === "add_badge") onAddBadge();
    if (action === "add_table") onAddTable();
    if (action === "add_stats_card") onAddStatsCard();
    if (action === "add_progress_bar") onAddProgressBar();
    if (action === "add_language_bar") onAddLanguageBar();
    if (action === "add_contribution_graph") onAddContributionGraph();
    if (action === "add_icon") onAddIcon();
    if (action === "add_qr_code") onAddQRCode();
    if (action === "add_chart") onAddChart();
    if (action === "add_social_badge") onAddSocialBadge();
  };

  const BASIC_COMPONENTS = [
    { label: "Text", action: "add_text", icon: "📝" },
    { label: "Image", action: "add_image", icon: "🖼️" },
    { label: "Shape", action: "add_shape", icon: "🔷" },
    { label: "Icon", action: "add_icon", icon: "⭐" },
  ];

  const GITHUB_COMPONENTS = [
    { label: "Stats Card", action: "add_stats_card", icon: "📊" },
    { label: "Progress Bar", action: "add_progress_bar", icon: "📈" },
    { label: "Language Bar", action: "add_language_bar", icon: "💻" },
    { label: "Contribution Graph", action: "add_contribution_graph", icon: "🟩" },
  ];

  const DECORATION_COMPONENTS = [
    { label: "Trophy", action: "add_trophy", icon: "🏆" },
    { label: "Badge", action: "add_badge", icon: "🏷️" },
    { label: "Table", action: "add_table", icon: "📋" },
  ];

  const ADVANCED_COMPONENTS = [
    { label: "QR Code", action: "add_qr_code", icon: "📱" },
    { label: "Chart", action: "add_chart", icon: "📉" },
    { label: "Social Badge", action: "add_social_badge", icon: "🔗" },
  ];

  return (
    <div
      className="flex mr-8 cursor-default"
      onMouseMove={resize}
      onMouseUp={stopResize}
      onMouseLeave={stopResize}
    >
      <div
        className="leftPane bg-zinc-900/50 rounded-r-xl min-h-screen flex flex-col justify-start items-start px-4 py-2"
        style={{ width }}
      >
        <h3 className="text-3xl text-white/90 mt-5 mb-5 border-b-1 border-b-zinc-400 w-full">
          Components
        </h3>

        {/* Basic Components */}
        <div className="w-full mb-4">
          <h4 className="text-sm text-zinc-400 uppercase tracking-wide mb-2">Basic</h4>
          <div className="flex flex-col gap-2">
            {BASIC_COMPONENTS.map((btn) => (
              <PaneButton
                key={btn.action}
                label={`${btn.icon} ${btn.label}`}
                onClick={() => handlePaneAction(btn.action)}
              />
            ))}
          </div>
        </div>

        {/* GitHub Stats Components */}
        <div className="w-full mb-4">
          <h4 className="text-sm text-zinc-400 uppercase tracking-wide mb-2">GitHub Stats</h4>
          <div className="flex flex-col gap-2">
            {GITHUB_COMPONENTS.map((btn) => (
              <PaneButton
                key={btn.action}
                label={`${btn.icon} ${btn.label}`}
                onClick={() => handlePaneAction(btn.action)}
              />
            ))}
          </div>
        </div>

        {/* Decorations */}
        <div className="w-full mb-4">
          <h4 className="text-sm text-zinc-400 uppercase tracking-wide mb-2">Decorations</h4>
          <div className="flex flex-col gap-2">
            {DECORATION_COMPONENTS.map((btn) => (
              <PaneButton
                key={btn.action}
                label={`${btn.icon} ${btn.label}`}
                onClick={() => handlePaneAction(btn.action)}
              />
            ))}
          </div>
        </div>

        {/* Advanced Components */}
        <div className="w-full mb-4">
          <h4 className="text-sm text-zinc-400 uppercase tracking-wide mb-2">Advanced</h4>
          <div className="flex flex-col gap-2">
            {ADVANCED_COMPONENTS.map((btn) => (
              <PaneButton
                key={btn.action}
                label={`${btn.icon} ${btn.label}`}
                onClick={() => handlePaneAction(btn.action)}
              />
            ))}
          </div>
        </div>

        {/* Clear All Button */}
        <div className="w-full mt-auto mb-4">
          <button
            onClick={onClearAll}
            className="w-full bg-red-600/20 hover:bg-red-600/30 text-red-400 py-2 px-4 rounded-lg transition-colors border border-red-600/30 text-sm font-medium"
          >
            🗑️ Clear All
          </button>
        </div>
      </div>
      <div className="w-2 cursor-col-resize" onMouseDown={startResizing} />
    </div>
  );
};

export default LeftPane;
