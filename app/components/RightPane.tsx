
// eslint-disable-next-line @typescript-eslint/no-explicit-any

"use client";
import { useState, useRef } from "react";
import { CardElement, CardSettings } from "../create/page";

interface RightPaneProps {
  selectedElement: CardElement | undefined;
  onUpdateElement: (id: number, data: Partial<CardElement>) => void;
  onDeleteElement: () => void;
  onDuplicateElement: () => void;
  cardSettings: CardSettings;
  onUpdateCardSettings: (settings: Partial<CardSettings>) => void;
  githubUsername: string;
}

const GITHUB_STATS = [
  "none",
  "Total Stars",
  "Total Commits",
  "Total PRs",
  "Total Issues",
  "Contributed to",
  "Public Repositories",
  "Followers",
  "Following",
];

const COLOR_THEMES = {
  default: { primary: "#3b82f6", secondary: "#1e40af", accent: "#60a5fa" },
  sunset: { primary: "#f97316", secondary: "#ea580c", accent: "#fb923c" },
  ocean: { primary: "#0891b2", secondary: "#0e7490", accent: "#22d3ee" },
  forest: { primary: "#10b981", secondary: "#059669", accent: "#34d399" },
  purple: { primary: "#8b5cf6", secondary: "#7c3aed", accent: "#a78bfa" },
  pink: { primary: "#ec4899", secondary: "#db2777", accent: "#f472b6" },
  dark: { primary: "#1f2937", secondary: "#111827", accent: "#374151" },
  light: { primary: "#f3f4f6", secondary: "#e5e7eb", accent: "#d1d5db" },
  neon: { primary: "#06b6d4", secondary: "#0891b2", accent: "#22d3ee" },
  fire: { primary: "#dc2626", secondary: "#b91c1c", accent: "#ef4444" },
  gold: { primary: "#eab308", secondary: "#ca8a04", accent: "#facc15" },
  midnight: { primary: "#312e81", secondary: "#1e1b4b", accent: "#4c1d95" },
};

const GRADIENT_PRESETS = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
];

const CARD_BG_PRESETS = [
  "#1a1a2e",
  "#0f172a",
  "#1e293b",
  "#18181b",
  "#27272a",
  "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
  "linear-gradient(135deg, #312e81 0%, #1e1b4b 100%)",
  "linear-gradient(135deg, #1e3a8a 0%, #1e293b 100%)",
];

const RightPane: React.FC<RightPaneProps> = ({
  selectedElement,
  onUpdateElement,
  onDeleteElement,
  onDuplicateElement,
  cardSettings,
  onUpdateCardSettings,
  githubUsername,
}) => {
  const [width, setWidth] = useState(380);
  const [activeTab, setActiveTab] = useState<"element" | "card">("element");
  const isResizing = useRef(false);

  const startResize = () => {
    isResizing.current = true;
    document.addEventListener("mousemove", resize);
    document.addEventListener("mouseup", stopResize);
  };

  const resize = (e: MouseEvent) => {
    if (!isResizing.current) return;
    const newWidth = window.innerWidth - e.clientX;
    if (newWidth > 280 && newWidth < 700) {
      setWidth(newWidth);
    }
  };

  const stopResize = () => {
    isResizing.current = false;
    document.removeEventListener("mousemove", resize);
    document.removeEventListener("mouseup", stopResize);
  };

  const handleChange = (key: keyof CardElement, value: any) => {
    if (selectedElement) {
      onUpdateElement(selectedElement.id, { [key]: value });
    }
  };

  const handleCardSettingChange = (key: keyof CardSettings, value: any) => {
    onUpdateCardSettings({ [key]: value });
  };

  const applyColorTheme = (theme: keyof typeof COLOR_THEMES) => {
    if (!selectedElement) return;
    const colors = COLOR_THEMES[theme];

    if (selectedElement.type === "text") {
      handleChange("color", colors.primary);
    } else if (selectedElement.type === "shape") {
      handleChange("fillColor", colors.primary);
      handleChange("strokeColor", colors.secondary);
    } else if (selectedElement.type === "badge") {
      handleChange("badgeColor", colors.primary);
      handleChange("badgeTextColor", "#ffffff");
    } else if (selectedElement.type === "trophy") {
      handleChange("trophyColor", colors.primary);
    } else if (selectedElement.type === "table") {
      handleChange("headerBgColor", colors.primary);
      handleChange("cellBgColor", colors.secondary);
    } else if (selectedElement.type === "statsCard") {
      handleChange("fillColor", colors.secondary);
      handleChange("strokeColor", colors.primary);
    } else if (selectedElement.type === "progressBar") {
      handleChange("progressColor", colors.primary);
    }
  };

  const handleTableDataChange = (rowIndex: number, colIndex: number, value: string) => {
    if (selectedElement && selectedElement.tableData) {
      const newData = selectedElement.tableData.map((row, rIdx) =>
        rIdx === rowIndex
          ? row.map((cell, cIdx) => (cIdx === colIndex ? value : cell))
          : row
      );
      onUpdateElement(selectedElement.id, { tableData: newData });
    }
  };

  const addTableRow = () => {
    if (selectedElement && selectedElement.tableData && selectedElement.columns) {
      const newRow = Array(selectedElement.columns).fill("New Cell");
      const newData = [...selectedElement.tableData, newRow];
      onUpdateElement(selectedElement.id, {
        tableData: newData,
        rows: (selectedElement.rows || 0) + 1,
      });
    }
  };

  const addTableColumn = () => {
    if (selectedElement && selectedElement.tableData) {
      const newData = selectedElement.tableData.map((row) => [...row, "New Cell"]);
      onUpdateElement(selectedElement.id, {
        tableData: newData,
        columns: (selectedElement.columns || 0) + 1,
      });
    }
  };

  const handleLanguageChange = (index: number, field: "name" | "percentage" | "color", value: any) => {
    if (selectedElement && selectedElement.languages) {
      const newLanguages = selectedElement.languages.map((lang, idx) =>
        idx === index ? { ...lang, [field]: value } : lang
      );
      onUpdateElement(selectedElement.id, { languages: newLanguages });
    }
  };

  const addLanguage = () => {
    if (selectedElement && selectedElement.languages) {
      const newLanguages = [
        ...selectedElement.languages,
        { name: "New Lang", percentage: 10, color: "#3b82f6" },
      ];
      onUpdateElement(selectedElement.id, { languages: newLanguages });
    }
  };

  const removeLanguage = (index: number) => {
    if (selectedElement && selectedElement.languages && selectedElement.languages.length > 1) {
      const newLanguages = selectedElement.languages.filter((_, idx) => idx !== index);
      onUpdateElement(selectedElement.id, { languages: newLanguages });
    }
  };

  return (
    <div className="flex min-h-screen ml-8" suppressHydrationWarning>
      <div
        onMouseDown={startResize}
        className="w-2 cursor-col-resize transition bg-zinc-700/50 hover:bg-blue-500"
      />
      <div style={{ width }} className="bg-zinc-900/50 ml-2 rounded-l-xl p-4 overflow-y-auto max-h-screen">
        {/* Tab Switcher */}
        <div className="flex gap-2 mb-4 sticky top-0 bg-zinc-900/95 z-10 pb-2">
          <button
            onClick={() => setActiveTab("element")}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${activeTab === "element"
              ? "bg-blue-600 text-white"
              : "bg-zinc-800 text-zinc-400 hover:text-white"
              }`}
          >
            Element
          </button>
          <button
            onClick={() => setActiveTab("card")}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${activeTab === "card"
              ? "bg-blue-600 text-white"
              : "bg-zinc-800 text-zinc-400 hover:text-white"
              }`}
          >
            Card
          </button>
        </div>

        {/* Card Settings Tab */}
        {activeTab === "card" && (
          <div className="flex flex-col gap-4">
            <h3 className="text-2xl text-white/90 border-b border-zinc-700 pb-2">
              Card Settings
            </h3>

            <div className="bg-zinc-800/50 rounded-lg p-3">
              <h4 className="text-sm text-zinc-300 font-semibold mb-3">Card Size</h4>

              <div className="grid grid-cols-2 gap-2">
                <PropertyInput
                  label="Width"
                  value={cardSettings.width || 800}
                  onChange={(val) => handleCardSettingChange("width", val)}
                  type="number"
                  min={400}
                  max={2000}
                />

                <PropertyInput
                  label="Height"
                  value={cardSettings.height || 600}
                  onChange={(val) => handleCardSettingChange("height", val)}
                  type="number"
                  min={300}
                  max={1500}
                />
              </div>
            </div>

            <div className="bg-zinc-800/50 rounded-lg p-3">
              <h4 className="text-sm text-zinc-300 font-semibold mb-3">Background</h4>

              <PropertyInput
                label="Background Color"
                value={cardSettings.backgroundColor}
                onChange={(val) => handleCardSettingChange("backgroundColor", val)}
                type="color"
              />

              <div className="mt-2">
                <label className="text-xs text-zinc-400 block mb-2">Quick Backgrounds</label>
                <div className="grid grid-cols-4 gap-2">
                  {CARD_BG_PRESETS.map((bg, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleCardSettingChange("backgroundColor", bg)}
                      className="aspect-square rounded-lg border-2 border-zinc-700 hover:border-zinc-400 transition-all"
                      style={{ background: bg }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-zinc-800/50 rounded-lg p-3">
              <h4 className="text-sm text-zinc-300 font-semibold mb-3">Border</h4>

              <PropertyInput
                label="Border Color"
                value={cardSettings.borderColor || "#3b82f6"}
                onChange={(val) => handleCardSettingChange("borderColor", val)}
                type="color"
              />

              <PropertyInput
                label="Border Width"
                value={cardSettings.borderWidth || 2}
                onChange={(val) => handleCardSettingChange("borderWidth", val)}
                type="number"
                min={0}
                max={20}
              />

              <PropertyInput
                label="Border Radius"
                value={cardSettings.borderRadius || 12}
                onChange={(val) => handleCardSettingChange("borderRadius", val)}
                type="number"
                min={0}
                max={50}
              />
            </div>

            <div className="bg-zinc-800/50 rounded-lg p-3">
              <h4 className="text-sm text-zinc-300 font-semibold mb-3">Layout</h4>

              <PropertyInput
                label="Padding"
                value={cardSettings.padding || 16}
                onChange={(val) => handleCardSettingChange("padding", val)}
                type="number"
                min={0}
                max={100}
              />

              <PropertySelect
                label="Shadow"
                value={cardSettings.shadow || "0 4px 6px rgba(0, 0, 0, 0.1)"}
                onChange={(val) => handleCardSettingChange("shadow", val)}
                options={[
                  "none",
                  "0 1px 3px rgba(0, 0, 0, 0.1)",
                  "0 4px 6px rgba(0, 0, 0, 0.1)",
                  "0 10px 15px rgba(0, 0, 0, 0.1)",
                  "0 20px 25px rgba(0, 0, 0, 0.15)",
                  "0 0 20px rgba(59, 130, 246, 0.3)",
                ]}
              />
            </div>
          </div>
        )}

        {/* Element Properties Tab */}
        {activeTab === "element" && (
          <>
            <h3 className="text-2xl text-white/90 mb-4 border-b border-zinc-700 pb-2">
              Properties
            </h3>

            {!selectedElement ? (
              <div className="text-center py-8">
                <p className="text-zinc-500 text-sm mb-4">Select an element to edit properties</p>
                {!githubUsername && (
                  <p className="text-zinc-600 text-xs">
                    💡 Tip: Set your GitHub username at the top to auto-populate stats!
                  </p>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {/* Element Type & Actions */}
                <div className="bg-zinc-800/50 rounded-lg p-3">
                  <label className="text-xs text-zinc-400 uppercase tracking-wide block mb-2">
                    Type
                  </label>
                  <p className="text-white font-medium capitalize mb-3">{selectedElement.type}</p>

                  <div className="flex gap-2">
                    <button
                      onClick={onDuplicateElement}
                      className="flex-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 py-2 px-3 rounded-lg text-xs font-medium transition-colors"
                    >
                      📋 Duplicate
                    </button>
                  </div>
                </div>

                {/* GitHub Username Notice */}
                {(selectedElement.type === "text" || selectedElement.type === "statsCard" || selectedElement.type === "languageBar" || selectedElement.type === "contributionGraph") && !githubUsername && (
                  <div className="bg-yellow-600/10 border border-yellow-600/30 rounded-lg p-3">
                    <p className="text-yellow-400 text-xs">
                      ⚠️ Set your GitHub username at the top to fetch real stats
                    </p>
                  </div>
                )}

                {/* Color Theme Presets */}
                {["text", "shape", "badge", "trophy", "table", "statsCard", "progressBar"].includes(selectedElement.type) && (
                  <div className="bg-zinc-800/50 rounded-lg p-3">
                    <h4 className="text-sm text-zinc-300 font-semibold mb-3">🎨 Color Themes</h4>
                    <div className="grid grid-cols-4 gap-2">
                      {Object.keys(COLOR_THEMES).map((theme) => {
                        const colors = COLOR_THEMES[theme as keyof typeof COLOR_THEMES];
                        return (
                          <button
                            key={theme}
                            onClick={() => applyColorTheme(theme as keyof typeof COLOR_THEMES)}
                            className="h-10 rounded-lg border-2 border-zinc-700 hover:border-zinc-500 transition-all flex flex-col overflow-hidden hover:scale-105"
                            title={theme}
                          >
                            <div className="flex-1" style={{ backgroundColor: colors.primary }} />
                            <div className="flex-1" style={{ backgroundColor: colors.secondary }} />
                            <div className="flex-1" style={{ backgroundColor: colors.accent }} />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Position & Size */}
                <div className="bg-zinc-800/50 rounded-lg p-3">
                  <h4 className="text-sm text-zinc-300 font-semibold mb-3">Position & Size</h4>

                  <div className="grid grid-cols-2 gap-2">
                    <PropertyInput
                      label="X"
                      value={Math.round(selectedElement.x)}
                      onChange={(val) => handleChange("x", val)}
                      type="number"
                    />

                    <PropertyInput
                      label="Y"
                      value={Math.round(selectedElement.y)}
                      onChange={(val) => handleChange("y", val)}
                      type="number"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <PropertyInput
                      label="Width"
                      value={Math.round(selectedElement.width)}
                      onChange={(val) => handleChange("width", val)}
                      type="number"
                      min={10}
                    />

                    <PropertyInput
                      label="Height"
                      value={Math.round(selectedElement.height)}
                      onChange={(val) => handleChange("height", val)}
                      type="number"
                      min={10}
                    />
                  </div>

                  <PropertyInput
                    label="Rotation (deg)"
                    value={selectedElement.rotation}
                    onChange={(val) => handleChange("rotation", val)}
                    type="number"
                    min={0}
                    max={360}
                  />
                </div>

                {/* TEXT PROPERTIES */}
                {selectedElement.type === "text" && (
                  <>
                    <div className="bg-zinc-800/50 rounded-lg p-3">
                      <h4 className="text-sm text-zinc-300 font-semibold mb-3">Content</h4>

                      <PropertySelect
                        label="GitHub Stat"
                        value={selectedElement.githubStat || "none"}
                        onChange={(val) => handleChange("githubStat", val)}
                        options={GITHUB_STATS}
                      />

                      {selectedElement.githubStat === "none" && (
                        <PropertyInput
                          label="Text Content"
                          value={selectedElement.content || ""}
                          onChange={(val) => handleChange("content", val)}
                          type="text"
                        />
                      )}
                    </div>

                    <div className="bg-zinc-800/50 rounded-lg p-3">
                      <h4 className="text-sm text-zinc-300 font-semibold mb-3">Typography</h4>

                      <PropertyInput
                        label="Font Size"
                        value={selectedElement.fontSize || 16}
                        onChange={(val) => handleChange("fontSize", val)}
                        type="number"
                        min={8}
                        max={200}
                      />

                      <PropertySelect
                        label="Font Family"
                        value={selectedElement.fontFamily || "Arial"}
                        onChange={(val) => handleChange("fontFamily", val)}
                        options={["Arial", "Helvetica", "Times New Roman", "Courier New", "Georgia", "Verdana", "Roboto", "Open Sans", "Montserrat", "Inter", "Poppins"]}
                      />

                      <PropertySelect
                        label="Font Weight"
                        value={selectedElement.fontWeight || "normal"}
                        onChange={(val) => handleChange("fontWeight", val)}
                        options={["100", "200", "300", "normal", "500", "600", "bold", "800", "900"]}
                      />

                      <PropertySelect
                        label="Text Align"
                        value={selectedElement.textAlign || "left"}
                        onChange={(val) => handleChange("textAlign", val)}
                        options={["left", "center", "right", "justify"]}
                      />

                      <PropertyInput
                        label="Color"
                        value={selectedElement.color || "#ffffff"}
                        onChange={(val) => handleChange("color", val)}
                        type="color"
                      />
                    </div>
                  </>
                )}

                {/* IMAGE PROPERTIES */}
                {selectedElement.type === "image" && (
                  <>
                    <div className="bg-zinc-800/50 rounded-lg p-3">
                      <h4 className="text-sm text-zinc-300 font-semibold mb-3">Image Source</h4>

                      <PropertySelect
                        label="Image Type"
                        value={selectedElement.imageType || "custom"}
                        onChange={(val) => {
                          handleChange("imageType", val);
                          if (val === "github-profile" && githubUsername) {
                            handleChange("src", `https://github.com/${githubUsername}.png`);
                          }
                        }}
                        options={["custom", "github-profile"]}
                      />

                      {selectedElement.imageType === "custom" ? (
                        <>
                          <PropertyInput
                            label="Image URL"
                            value={selectedElement.src || ""}
                            onChange={(val) => handleChange("src", val)}
                            type="text"
                          />

                          {selectedElement.src && (
                            <div className="mt-2">
                              <label className="text-xs text-zinc-400 block mb-1">Preview</label>
                              <div className="w-full h-32 rounded-lg border border-zinc-700 overflow-hidden bg-zinc-900 flex items-center justify-center">
                                <img
                                  src={selectedElement.src}
                                  alt="Preview"
                                  onError={(e) => {
                                    e.currentTarget.src = "https://via.placeholder.com/150?text=Invalid+URL";
                                  }}
                                  className="max-w-full max-h-full object-contain"
                                />
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          {githubUsername ? (
                            <div className="mt-2">
                              <label className="text-xs text-zinc-400 block mb-1">Preview</label>
                              <div className="w-full h-32 rounded-lg border border-zinc-700 overflow-hidden bg-zinc-900 flex items-center justify-center">
                                <img
                                  src={`https://github.com/${githubUsername}.png`}
                                  alt="GitHub Profile"
                                  className="w-24 h-24 rounded-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.src = "https://via.placeholder.com/150?text=User+Not+Found";
                                  }}
                                />
                              </div>
                              <p className="text-xs text-zinc-500 mt-2">Using: {githubUsername}</p>
                            </div>
                          ) : (
                            <p className="text-xs text-yellow-400 mt-2">
                              Set GitHub username at the top to use profile image
                            </p>
                          )}
                        </>
                      )}
                    </div>

                    <div className="bg-zinc-800/50 rounded-lg p-3">
                      <h4 className="text-sm text-zinc-300 font-semibold mb-3">Image Styling</h4>

                      <PropertyInput
                        label="Opacity"
                        value={selectedElement.opacity || 1}
                        onChange={(val) => handleChange("opacity", val)}
                        type="number"
                        min={0}
                        max={1}
                        step={0.1}
                      />

                      <PropertyInput
                        label="Border Radius"
                        value={selectedElement.borderRadius || 0}
                        onChange={(val) => handleChange("borderRadius", val)}
                        type="number"
                        min={0}
                        max={200}
                      />

                      <PropertySelect
                        label="Border Style"
                        value={selectedElement.borderStyle || "none"}
                        onChange={(val) => handleChange("borderStyle", val)}
                        options={["none", "solid", "dashed", "dotted", "double"]}
                      />

                      {selectedElement.borderStyle && selectedElement.borderStyle !== "none" && (
                        <>
                          <PropertyInput
                            label="Border Width"
                            value={selectedElement.borderWidth || 2}
                            onChange={(val) => handleChange("borderWidth", val)}
                            type="number"
                            min={1}
                            max={20}
                          />

                          <PropertyInput
                            label="Border Color"
                            value={selectedElement.borderColor || "#3b82f6"}
                            onChange={(val) => handleChange("borderColor", val)}
                            type="color"
                          />
                        </>
                      )}
                    </div>
                  </>
                )}

                {/* SHAPE PROPERTIES */}
                {selectedElement.type === "shape" && (
                  <>
                    <div className="bg-zinc-800/50 rounded-lg p-3">
                      <h4 className="text-sm text-zinc-300 font-semibold mb-3">Shape Type</h4>

                      <PropertySelect
                        label="Shape"
                        value={selectedElement.shapeType || "rectangle"}
                        onChange={(val) => handleChange("shapeType", val)}
                        options={["square", "rectangle", "circle", "triangle", "divider"]}
                      />
                    </div>

                    <div className="bg-zinc-800/50 rounded-lg p-3">
                      <h4 className="text-sm text-zinc-300 font-semibold mb-3">Shape Colors</h4>

                      <PropertyInput
                        label="Fill Color"
                        value={selectedElement.fillColor || "#3b82f6"}
                        onChange={(val) => handleChange("fillColor", val)}
                        type="color"
                      />

                      <div className="mt-2 mb-3">
                        <label className="text-xs text-zinc-400 block mb-2">Gradient Fills</label>
                        <div className="grid grid-cols-3 gap-2">
                          {GRADIENT_PRESETS.map((gradient, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleChange("fillColor", gradient)}
                              className="h-12 rounded-lg border-2 border-zinc-700 hover:border-zinc-400 hover:scale-105 transition-transform"
                              style={{ background: gradient }}
                            />
                          ))}
                        </div>
                      </div>

                      <PropertyInput
                        label="Stroke Color"
                        value={selectedElement.strokeColor || "#1e40af"}
                        onChange={(val) => handleChange("strokeColor", val)}
                        type="color"
                      />

                      <PropertyInput
                        label="Stroke Width"
                        value={selectedElement.strokeWidth || 2}
                        onChange={(val) => handleChange("strokeWidth", val)}
                        type="number"
                        min={0}
                        max={20}
                      />
                    </div>
                  </>
                )}

                {/* TROPHY PROPERTIES */}
                {selectedElement.type === "trophy" && (
                  <div className="bg-zinc-800/50 rounded-lg p-3">
                    <h4 className="text-sm text-zinc-300 font-semibold mb-3">Trophy Properties</h4>

                    <PropertySelect
                      label="Trophy Type"
                      value={selectedElement.trophyType || "gold"}
                      onChange={(val) => {
                        handleChange("trophyType", val);
                        if (val === "gold") handleChange("trophyColor", "#FFD700");
                        if (val === "silver") handleChange("trophyColor", "#C0C0C0");
                        if (val === "bronze") handleChange("trophyColor", "#CD7F32");
                      }}
                      options={["gold", "silver", "bronze", "platinum", "custom"]}
                    />

                    <PropertyInput
                      label="Trophy Color"
                      value={selectedElement.trophyColor || "#FFD700"}
                      onChange={(val) => handleChange("trophyColor", val)}
                      type="color"
                    />
                  </div>
                )}

                {/* BADGE PROPERTIES */}
                {selectedElement.type === "badge" && (
                  <>
                    <div className="bg-zinc-800/50 rounded-lg p-3">
                      <h4 className="text-sm text-zinc-300 font-semibold mb-3">Badge Content</h4>

                      <PropertyInput
                        label="Badge Text"
                        value={selectedElement.badgeText || ""}
                        onChange={(val) => handleChange("badgeText", val)}
                        type="text"
                      />

                      <PropertyInput
                        label="Font Size"
                        value={selectedElement.fontSize || 14}
                        onChange={(val) => handleChange("fontSize", val)}
                        type="number"
                        min={8}
                        max={48}
                      />

                      <PropertySelect
                        label="Font Weight"
                        value={selectedElement.fontWeight || "bold"}
                        onChange={(val) => handleChange("fontWeight", val)}
                        options={["normal", "500", "600", "bold", "800", "900"]}
                      />
                    </div>

                    <div className="bg-zinc-800/50 rounded-lg p-3">
                      <h4 className="text-sm text-zinc-300 font-semibold mb-3">Badge Colors</h4>

                      <PropertyInput
                        label="Background"
                        value={selectedElement.badgeColor || "#3b82f6"}
                        onChange={(val) => handleChange("badgeColor", val)}
                        type="color"
                      />

                      <PropertyInput
                        label="Text Color"
                        value={selectedElement.badgeTextColor || "#ffffff"}
                        onChange={(val) => handleChange("badgeTextColor", val)}
                        type="color"
                      />
                    </div>
                  </>
                )}

                {/* TABLE PROPERTIES */}
                {selectedElement.type === "table" && (
                  <>
                    <div className="bg-zinc-800/50 rounded-lg p-3">
                      <h4 className="text-sm text-zinc-300 font-semibold mb-3">Table Structure</h4>

                      <div className="flex gap-2 mb-3">
                        <button
                          onClick={addTableRow}
                          className="flex-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 py-2 px-3 rounded-lg text-sm font-medium transition-colors"
                        >
                          + Row
                        </button>
                        <button
                          onClick={addTableColumn}
                          className="flex-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 py-2 px-3 rounded-lg text-sm font-medium transition-colors"
                        >
                          + Column
                        </button>
                      </div>
                    </div>

                    <div className="bg-zinc-800/50 rounded-lg p-3">
                      <h4 className="text-sm text-zinc-300 font-semibold mb-3">Table Colors</h4>

                      <PropertyInput
                        label="Header Background"
                        value={selectedElement.headerBgColor || "#3b82f6"}
                        onChange={(val) => handleChange("headerBgColor", val)}
                        type="color"
                      />

                      <PropertyInput
                        label="Cell Background"
                        value={selectedElement.cellBgColor || "#27272a"}
                        onChange={(val) => handleChange("cellBgColor", val)}
                        type="color"
                      />

                      <PropertyInput
                        label="Text Color"
                        value={selectedElement.color || "#ffffff"}
                        onChange={(val) => handleChange("color", val)}
                        type="color"
                      />
                    </div>

                    <div className="bg-zinc-800/50 rounded-lg p-3 max-h-64 overflow-y-auto">
                      <h4 className="text-sm text-zinc-300 font-semibold mb-3">Table Data</h4>
                      {selectedElement.tableData?.map((row, rowIdx) => (
                        <div key={rowIdx} className="mb-2">
                          <p className="text-xs text-zinc-500 mb-1">
                            {rowIdx === 0 ? "Header" : `Row ${rowIdx}`}
                          </p>
                          {row.map((cell, colIdx) => (
                            <input
                              key={colIdx}
                              type="text"
                              value={cell}
                              onChange={(e) => handleTableDataChange(rowIdx, colIdx, e.target.value)}
                              className="w-full bg-zinc-700/50 text-white px-2 py-1 rounded text-xs mb-1 border border-zinc-600 focus:border-blue-500 focus:outline-none"
                              placeholder={`Cell ${colIdx + 1}`}
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* STATS CARD PROPERTIES */}
                {selectedElement.type === "statsCard" && (
                  <div className="bg-zinc-800/50 rounded-lg p-3">
                    <h4 className="text-sm text-zinc-300 font-semibold mb-3">Stats Card</h4>

                    <PropertyInput
                      label="Icon"
                      value={selectedElement.statIcon || "📊"}
                      onChange={(val) => handleChange("statIcon", val)}
                      type="text"
                    />

                    <PropertyInput
                      label="Value"
                      value={selectedElement.statValue || "0"}
                      onChange={(val) => handleChange("statValue", val)}
                      type="text"
                    />

                    <PropertyInput
                      label="Label"
                      value={selectedElement.statLabel || "Label"}
                      onChange={(val) => handleChange("statLabel", val)}
                      type="text"
                    />

                    <PropertyInput
                      label="Value Size"
                      value={selectedElement.fontSize || 32}
                      onChange={(val) => handleChange("fontSize", val)}
                      type="number"
                      min={16}
                      max={72}
                    />

                    <PropertyInput
                      label="Background"
                      value={selectedElement.fillColor || "#1e293b"}
                      onChange={(val) => handleChange("fillColor", val)}
                      type="color"
                    />

                    <PropertyInput
                      label="Border Color"
                      value={selectedElement.strokeColor || "#3b82f6"}
                      onChange={(val) => handleChange("strokeColor", val)}
                      type="color"
                    />

                    <PropertyInput
                      label="Text Color"
                      value={selectedElement.color || "#ffffff"}
                      onChange={(val) => handleChange("color", val)}
                      type="color"
                    />
                  </div>
                )}

                {/* PROGRESS BAR PROPERTIES */}
                {selectedElement.type === "progressBar" && (
                  <div className="bg-zinc-800/50 rounded-lg p-3">
                    <h4 className="text-sm text-zinc-300 font-semibold mb-3">Progress Bar</h4>

                    <PropertyInput
                      label="Label"
                      value={selectedElement.progressLabel || "Progress"}
                      onChange={(val) => handleChange("progressLabel", val)}
                      type="text"
                    />

                    <PropertyInput
                      label="Value (%)"
                      value={selectedElement.progressValue || 0}
                      onChange={(val) => handleChange("progressValue", val)}
                      type="number"
                      min={0}
                      max={100}
                    />

                    <PropertyInput
                      label="Progress Color"
                      value={selectedElement.progressColor || "#22c55e"}
                      onChange={(val) => handleChange("progressColor", val)}
                      type="color"
                    />

                    <PropertyInput
                      label="Background"
                      value={selectedElement.progressBgColor || "#374151"}
                      onChange={(val) => handleChange("progressBgColor", val)}
                      type="color"
                    />

                    <PropertyInput
                      label="Text Color"
                      value={selectedElement.color || "#ffffff"}
                      onChange={(val) => handleChange("color", val)}
                      type="color"
                    />
                  </div>
                )}

                {/* LANGUAGE BAR PROPERTIES */}
                {selectedElement.type === "languageBar" && (
                  <div className="bg-zinc-800/50 rounded-lg p-3 max-h-96 overflow-y-auto">
                    <h4 className="text-sm text-zinc-300 font-semibold mb-3">Languages</h4>

                    {selectedElement.languages?.map((lang, idx) => (
                      <div key={idx} className="mb-3 p-2 bg-zinc-900/50 rounded">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs text-zinc-400">Language {idx + 1}</span>
                          {selectedElement.languages && selectedElement.languages.length > 1 && (
                            <button
                              onClick={() => removeLanguage(idx)}
                              className="text-red-400 text-xs hover:text-red-300"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <PropertyInput
                          label="Name"
                          value={lang.name}
                          onChange={(val) => handleLanguageChange(idx, "name", val)}
                          type="text"
                        />
                        <PropertyInput
                          label="Percentage"
                          value={lang.percentage}
                          onChange={(val) => handleLanguageChange(idx, "percentage", parseFloat(val))}
                          type="number"
                          min={0}
                          max={100}
                        />
                        <PropertyInput
                          label="Color"
                          value={lang.color}
                          onChange={(val) => handleLanguageChange(idx, "color", val)}
                          type="color"
                        />
                      </div>
                    ))}

                    <button
                      onClick={addLanguage}
                      className="w-full bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 py-2 rounded-lg text-sm"
                    >
                      + Add Language
                    </button>
                  </div>
                )}

                {/* ICON PROPERTIES */}
                {selectedElement.type === "icon" && (
                  <div className="bg-zinc-800/50 rounded-lg p-3">
                    <h4 className="text-sm text-zinc-300 font-semibold mb-3">Icon Properties</h4>

                    <PropertyInput
                      label="Icon/Emoji"
                      value={selectedElement.content || "⭐"}
                      onChange={(val) => handleChange("content", val)}
                      type="text"
                    />

                    <PropertyInput
                      label="Size"
                      value={selectedElement.fontSize || 48}
                      onChange={(val) => handleChange("fontSize", val)}
                      type="number"
                      min={16}
                      max={200}
                    />

                    <PropertyInput
                      label="Color"
                      value={selectedElement.color || "#FFD700"}
                      onChange={(val) => handleChange("color", val)}
                      type="color"
                    />

                    <div className="mt-2">
                      <label className="text-xs text-zinc-400 block mb-2">Popular Icons</label>
                      <div className="grid grid-cols-6 gap-2">
                        {["⭐", "🏆", "💎", "🔥", "⚡", "💻", "🎯", "🚀", "💡", "🎨", "📊", "🎉"].map((icon) => (
                          <button
                            key={icon}
                            onClick={() => handleChange("content", icon)}
                            className="aspect-square rounded-lg border-2 border-zinc-700 hover:border-zinc-400 text-2xl flex items-center justify-center"
                          >
                            {icon}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* CONTRIBUTION GRAPH */}
                {selectedElement.type === "contributionGraph" && (
                  <div className="bg-zinc-800/50 rounded-lg p-3">
                    <h4 className="text-sm text-zinc-300 font-semibold mb-3">Contribution Graph</h4>
                    <p className="text-xs text-zinc-500">
                      {githubUsername
                        ? "Real contribution data fetched from GitHub"
                        : "Using sample data. Set username to fetch real data."}
                    </p>
                  </div>
                )}

                {/* Delete Button */}
                <button
                  onClick={onDeleteElement}
                  className="w-full bg-red-600/20 hover:bg-red-600/30 text-red-400 py-2 px-4 rounded-lg transition-colors border border-red-600/30 font-medium"
                >
                  🗑️ Delete Element
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Helper Components
const PropertyInput: React.FC<{
  label: string;
  value: string | number;
  onChange: (value: any) => void;
  type: string;
  min?: number;
  max?: number;
  step?: number;
}> = ({ label, value, onChange, type, min, max, step }) => {
  return (
    <div className="mb-3">
      <label className="text-xs text-zinc-400 block mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => {
          const val = type === "number" ? parseFloat(e.target.value) || 0 : e.target.value;
          onChange(val);
        }}
        min={min}
        max={max}
        step={step}
        className="w-full bg-zinc-700/50 text-white px-3 py-2 rounded-md border border-zinc-600 focus:border-blue-500 focus:outline-none text-sm"
      />
    </div>
  );
};

const PropertySelect: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}> = ({ label, value, onChange, options }) => {
  return (
    <div className="mb-3">
      <label className="text-xs text-zinc-400 block mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-zinc-700/50 text-white px-3 py-2 rounded-md border border-zinc-600 focus:border-blue-500 focus:outline-none text-sm"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default RightPane;
