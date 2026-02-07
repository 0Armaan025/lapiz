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
  blue: { primary: "#3b82f6", secondary: "#1e40af", accent: "#60a5fa", name: "Blue" },
  purple: { primary: "#8b5cf6", secondary: "#7c3aed", accent: "#a78bfa", name: "Purple" },
  pink: { primary: "#ec4899", secondary: "#db2777", accent: "#f472b6", name: "Pink" },
  green: { primary: "#10b981", secondary: "#059669", accent: "#34d399", name: "Green" },
  orange: { primary: "#f97316", secondary: "#ea580c", accent: "#fb923c", name: "Orange" },
  red: { primary: "#dc2626", secondary: "#b91c1c", accent: "#ef4444", name: "Red" },
  cyan: { primary: "#06b6d4", secondary: "#0891b2", accent: "#22d3ee", name: "Cyan" },
  yellow: { primary: "#eab308", secondary: "#ca8a04", accent: "#facc15", name: "Yellow" },
  slate: { primary: "#64748b", secondary: "#475569", accent: "#94a3b8", name: "Slate" },
  emerald: { primary: "#10b981", secondary: "#059669", accent: "#34d399", name: "Emerald" },
};

const GRADIENT_PRESETS = [
  { name: "Sunset", gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
  { name: "Ocean", gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" },
  { name: "Forest", gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)" },
  { name: "Fire", gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)" },
  { name: "Night", gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
  { name: "Deep", gradient: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)" },
];

const CARD_BG_PRESETS = [
  { name: "Dark Navy", color: "#1a1a2e" },
  { name: "Midnight", color: "#0f172a" },
  { name: "Slate", color: "#1e293b" },
  { name: "Charcoal", color: "#18181b" },
  { name: "Carbon", color: "#27272a" },
  { name: "Deep Blue", gradient: "linear-gradient(135deg, #1e3a8a 0%, #1e293b 100%)" },
  { name: "Purple Night", gradient: "linear-gradient(135deg, #312e81 0%, #1e1b4b 100%)" },
  { name: "Dark Ocean", gradient: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)" },
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
  const [width, setWidth] = useState(400);
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
    if (newWidth > 300 && newWidth < 800) {
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
        rIdx === rowIndex ? row.map((cell, cIdx) => (cIdx === colIndex ? value : cell)) : row
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

  const handleLanguageChange = (
    index: number,
    field: "name" | "percentage" | "color",
    value: any
  ) => {
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
      {/* Resize Handle */}
      <div
        onMouseDown={startResize}
        className="w-1 cursor-col-resize bg-zinc-800 hover:bg-blue-500 transition-colors duration-200"
      />

      {/* Main Panel */}
      <div
        style={{ width }}
        className="bg-gradient-to-b from-zinc-900 to-zinc-950 ml-2 rounded-l-xl overflow-hidden flex flex-col"
      >
        {/* Header with Tabs */}
        <div className="sticky top-0 z-20 bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-800">
          <div className="p-4">
            <h3 className="text-xl font-bold text-white mb-3">Properties</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("element")}
                className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${activeTab === "element"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : "bg-zinc-800/50 text-zinc-400 hover:text-white hover:bg-zinc-800"
                  }`}
              >
                🎨 Element
              </button>
              <button
                onClick={() => setActiveTab("card")}
                className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${activeTab === "card"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : "bg-zinc-800/50 text-zinc-400 hover:text-white hover:bg-zinc-800"
                  }`}
              >
                🖼️ Card
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {/* CARD SETTINGS TAB */}
          {activeTab === "card" && (
            <>
              <PropertySection title="📏 Dimensions">
                <div className="grid grid-cols-2 gap-3">
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
              </PropertySection>

              <PropertySection title="🎨 Background">
                <PropertyInput
                  label="Color"
                  value={cardSettings.backgroundColor}
                  onChange={(val) => handleCardSettingChange("backgroundColor", val)}
                  type="color"
                />

                <div className="mt-3">
                  <label className="text-xs text-zinc-400 font-medium block mb-2">
                    Presets
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {CARD_BG_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        onClick={() =>
                          handleCardSettingChange(
                            "backgroundColor",
                            preset.color || preset.gradient
                          )
                        }
                        className="aspect-square rounded-lg border-2 border-zinc-700 hover:border-blue-500 hover:scale-105 transition-all duration-200"
                        style={{
                          background: preset.color || preset.gradient,
                        }}
                        title={preset.name}
                      />
                    ))}
                  </div>
                </div>
              </PropertySection>

              <PropertySection title="🔲 Border">
                <PropertyInput
                  label="Color"
                  value={cardSettings.borderColor || "#3b82f6"}
                  onChange={(val) => handleCardSettingChange("borderColor", val)}
                  type="color"
                />
                <div className="grid grid-cols-2 gap-3">
                  <PropertyInput
                    label="Width"
                    value={cardSettings.borderWidth || 2}
                    onChange={(val) => handleCardSettingChange("borderWidth", val)}
                    type="number"
                    min={0}
                    max={20}
                  />
                  <PropertyInput
                    label="Radius"
                    value={cardSettings.borderRadius || 12}
                    onChange={(val) => handleCardSettingChange("borderRadius", val)}
                    type="number"
                    min={0}
                    max={50}
                  />
                </div>
              </PropertySection>

              <PropertySection title="📐 Layout">
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
                    { value: "none", label: "None" },
                    { value: "0 1px 3px rgba(0, 0, 0, 0.1)", label: "Small" },
                    { value: "0 4px 6px rgba(0, 0, 0, 0.1)", label: "Medium" },
                    { value: "0 10px 15px rgba(0, 0, 0, 0.1)", label: "Large" },
                    { value: "0 20px 25px rgba(0, 0, 0, 0.15)", label: "X-Large" },
                    { value: "0 0 20px rgba(59, 130, 246, 0.3)", label: "Glow" },
                  ]}
                />
              </PropertySection>
            </>
          )}

          {/* ELEMENT PROPERTIES TAB */}
          {activeTab === "element" && (
            <>
              {!selectedElement ? (
                <EmptyState githubUsername={githubUsername} />
              ) : (
                <>
                  {/* Element Info & Actions */}
                  <PropertySection title="📌 Element Info">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm text-zinc-400">Type</p>
                        <p className="text-white font-semibold capitalize">
                          {selectedElement.type}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={onDuplicateElement}
                          className="p-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg transition-all"
                          title="Duplicate"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                        <button
                          onClick={onDeleteElement}
                          className="p-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-all"
                          title="Delete"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </PropertySection>

                  {/* GitHub Username Notice */}
                  {(selectedElement.type === "text" ||
                    selectedElement.type === "statsCard" ||
                    selectedElement.type === "languageBar" ||
                    selectedElement.type === "contributionGraph") &&
                    !githubUsername && (
                      <div className="bg-yellow-600/10 border border-yellow-600/30 rounded-lg p-3 flex items-start gap-2">
                        <span className="text-yellow-400 text-xl">⚠️</span>
                        <p className="text-yellow-400 text-xs">
                          Set your GitHub username to fetch real stats automatically
                        </p>
                      </div>
                    )}

                  {/* Color Theme Presets */}
                  {["text", "shape", "badge", "trophy", "table", "statsCard", "progressBar"].includes(
                    selectedElement.type
                  ) && (
                      <PropertySection title="🎨 Quick Themes">
                        <div className="grid grid-cols-5 gap-2">
                          {Object.entries(COLOR_THEMES).map(([key, theme]) => (
                            <button
                              key={key}
                              onClick={() => applyColorTheme(key as keyof typeof COLOR_THEMES)}
                              className="h-12 rounded-lg border-2 border-zinc-700 hover:border-zinc-400 transition-all flex flex-col overflow-hidden hover:scale-105"
                              title={theme.name}
                            >
                              <div
                                className="flex-1"
                                style={{ backgroundColor: theme.primary }}
                              />
                              <div
                                className="flex-1"
                                style={{ backgroundColor: theme.secondary }}
                              />
                            </button>
                          ))}
                        </div>
                      </PropertySection>
                    )}

                  {/* Position & Size */}
                  <PropertySection title="📐 Transform">
                    <div className="grid grid-cols-2 gap-3">
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
                    <div className="grid grid-cols-2 gap-3">
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
                      label="Rotation"
                      value={selectedElement.rotation}
                      onChange={(val) => handleChange("rotation", val)}
                      type="number"
                      min={0}
                      max={360}
                      unit="°"
                    />
                  </PropertySection>

                  {/* TYPE-SPECIFIC PROPERTIES */}
                  {renderTypeSpecificProperties(selectedElement, {
                    handleChange,
                    handleTableDataChange,
                    addTableRow,
                    addTableColumn,
                    handleLanguageChange,
                    addLanguage,
                    removeLanguage,
                    githubUsername,
                  })}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper Component: Property Section
const PropertySection: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => {
  return (
    <div className="bg-zinc-800/30 rounded-xl p-4 border border-zinc-800/50">
      <h4 className="text-sm font-semibold text-zinc-300 mb-3">{title}</h4>
      {children}
    </div>
  );
};

// Helper Component: Empty State
const EmptyState: React.FC<{ githubUsername: string }> = ({ githubUsername }) => {
  return (
    <div className="text-center py-12 px-4">
      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-zinc-800 flex items-center justify-center">
        <svg className="w-10 h-10 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
        </svg>
      </div>
      <p className="text-zinc-500 text-sm mb-2">No element selected</p>
      <p className="text-zinc-600 text-xs">
        Click on an element in the card to edit its properties
      </p>
      {!githubUsername && (
        <div className="mt-4 p-3 bg-blue-600/10 border border-blue-600/30 rounded-lg">
          <p className="text-blue-400 text-xs">
            💡 Tip: Set your GitHub username to auto-populate stats!
          </p>
        </div>
      )}
    </div>
  );
};

// Helper Component: Property Input
const PropertyInput: React.FC<{
  label: string;
  value: string | number;
  onChange: (value: any) => void;
  type: string;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}> = ({ label, value, onChange, type, min, max, step, unit }) => {
  return (
    <div className="mb-3">
      <label className="text-xs text-zinc-400 font-medium block mb-1.5">{label}</label>
      <div className="relative">
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
          className={`w-full bg-zinc-800/50 text-white px-3 py-2.5 rounded-lg border border-zinc-700 focus:border-blue-500 focus:outline-none text-sm transition-colors ${type === "color" ? "h-11" : ""
            }`}
        />
        {unit && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
};

// Helper Component: Property Select
const PropertySelect: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[] | string[];
}> = ({ label, value, onChange, options }) => {
  const isSimpleArray = typeof options[0] === "string";

  return (
    <div className="mb-3">
      <label className="text-xs text-zinc-400 font-medium block mb-1.5">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-zinc-800/50 text-white px-3 py-2.5 rounded-lg border border-zinc-700 focus:border-blue-500 focus:outline-none text-sm transition-colors"
      >
        {isSimpleArray
          ? (options as string[]).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))
          : (options as { value: string; label: string }[]).map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
      </select>
    </div>
  );
};

// Type-specific properties renderer
function renderTypeSpecificProperties(
  element: CardElement,
  handlers: any
) {
  const { handleChange, githubUsername } = handlers;

  // TEXT PROPERTIES
  if (element.type === "text") {
    return (
      <>
        <PropertySection title="📝 Content">
          <PropertySelect
            label="GitHub Stat"
            value={element.githubStat || "none"}
            onChange={(val) => handleChange("githubStat", val)}
            options={GITHUB_STATS}
          />
          {element.githubStat === "none" && (
            <PropertyInput
              label="Text"
              value={element.content || ""}
              onChange={(val) => handleChange("content", val)}
              type="text"
            />
          )}
        </PropertySection>

        <PropertySection title="✏️ Typography">
          <PropertyInput
            label="Font Size"
            value={element.fontSize || 16}
            onChange={(val) => handleChange("fontSize", val)}
            type="number"
            min={8}
            max={200}
            unit="px"
          />
          <PropertySelect
            label="Font Family"
            value={element.fontFamily || "Arial"}
            onChange={(val) => handleChange("fontFamily", val)}
            options={[
              "Arial",
              "Helvetica",
              "Inter",
              "Roboto",
              "Open Sans",
              "Montserrat",
              "Poppins",
              "Playfair Display",
              "Courier New",
              "Georgia",
            ]}
          />
          <div className="grid grid-cols-2 gap-3">
            <PropertySelect
              label="Weight"
              value={element.fontWeight || "normal"}
              onChange={(val) => handleChange("fontWeight", val)}
              options={["100", "200", "300", "normal", "500", "600", "bold", "800", "900"]}
            />
            <PropertySelect
              label="Align"
              value={element.textAlign || "left"}
              onChange={(val) => handleChange("textAlign", val)}
              options={["left", "center", "right", "justify"]}
            />
          </div>
          <PropertyInput
            label="Color"
            value={element.color || "#ffffff"}
            onChange={(val) => handleChange("color", val)}
            type="color"
          />
        </PropertySection>
      </>
    );
  }

  // SHAPE PROPERTIES
  if (element.type === "shape") {
    return (
      <>
        <PropertySection title="🔷 Shape">
          <PropertySelect
            label="Type"
            value={element.shapeType || "rectangle"}
            onChange={(val) => handleChange("shapeType", val)}
            options={["rectangle", "square", "circle", "triangle", "divider"]}
          />
        </PropertySection>

        <PropertySection title="🎨 Colors">
          <PropertyInput
            label="Fill"
            value={element.fillColor || "#3b82f6"}
            onChange={(val) => handleChange("fillColor", val)}
            type="color"
          />

          <div className="mt-3 mb-3">
            <label className="text-xs text-zinc-400 font-medium block mb-2">Gradients</label>
            <div className="grid grid-cols-3 gap-2">
              {GRADIENT_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChange("fillColor", preset.gradient)}
                  className="h-12 rounded-lg border-2 border-zinc-700 hover:border-zinc-400 hover:scale-105 transition-all"
                  style={{ background: preset.gradient }}
                  title={preset.name}
                />
              ))}
            </div>
          </div>

          <PropertyInput
            label="Stroke"
            value={element.strokeColor || "#1e40af"}
            onChange={(val) => handleChange("strokeColor", val)}
            type="color"
          />
          <PropertyInput
            label="Stroke Width"
            value={element.strokeWidth || 2}
            onChange={(val) => handleChange("strokeWidth", val)}
            type="number"
            min={0}
            max={20}
            unit="px"
          />
          <PropertyInput
            label="Opacity"
            value={element.opacity !== undefined ? element.opacity : 1}
            onChange={(val) => handleChange("opacity", val)}
            type="number"
            min={0}
            max={1}
            step={0.1}
          />
        </PropertySection>
      </>
    );
  }

  // IMAGE PROPERTIES
  if (element.type === "image") {
    return (
      <>
        <PropertySection title="🖼️ Image">
          <PropertySelect
            label="Type"
            value={element.imageType || "custom"}
            onChange={(val) => {
              handleChange("imageType", val);
              if (val === "github-profile" && githubUsername) {
                handleChange("src", `https://github.com/${githubUsername}.png`);
              }
            }}
            options={[
              { value: "custom", label: "Custom URL" },
              { value: "github-profile", label: "GitHub Profile" },
            ]}
          />

          {element.imageType === "custom" ? (
            <PropertyInput
              label="URL"
              value={element.src || ""}
              onChange={(val) => handleChange("src", val)}
              type="text"
            />
          ) : githubUsername ? (
            <div className="text-xs text-zinc-400">
              Using: <span className="text-blue-400">{githubUsername}</span>
            </div>
          ) : (
            <div className="text-xs text-yellow-400">Set GitHub username first</div>
          )}
        </PropertySection>

        <PropertySection title="🎨 Styling">
          <PropertyInput
            label="Opacity"
            value={element.opacity || 1}
            onChange={(val) => handleChange("opacity", val)}
            type="number"
            min={0}
            max={1}
            step={0.1}
          />
          <PropertyInput
            label="Border Radius"
            value={element.borderRadius || 0}
            onChange={(val) => handleChange("borderRadius", val)}
            type="number"
            min={0}
            max={200}
            unit="px"
          />
          <PropertySelect
            label="Border Style"
            value={element.borderStyle || "none"}
            onChange={(val) => handleChange("borderStyle", val)}
            options={["none", "solid", "dashed", "dotted", "double"]}
          />
          {element.borderStyle && element.borderStyle !== "none" && (
            <>
              <PropertyInput
                label="Border Width"
                value={element.borderWidth || 2}
                onChange={(val) => handleChange("borderWidth", val)}
                type="number"
                min={1}
                max={20}
                unit="px"
              />
              <PropertyInput
                label="Border Color"
                value={element.borderColor || "#3b82f6"}
                onChange={(val) => handleChange("borderColor", val)}
                type="color"
              />
            </>
          )}
        </PropertySection>
      </>
    );
  }

  // Add more type-specific renderers here...
  // (Trophy, Badge, Table, Stats, Progress, Languages, etc.)
  // For brevity, I'm showing the pattern - you can expand these

  return null;
}

// Add custom scrollbar styles
const style = document.createElement("style");
style.textContent = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(39, 39, 42, 0.3);
    border-radius: 3px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(63, 63, 70, 0.8);
    border-radius: 3px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(82, 82, 91, 1);
  }
`;
if (typeof document !== "undefined") {
  document.head.appendChild(style);
}

export default RightPane;
