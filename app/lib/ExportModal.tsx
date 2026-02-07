import { useState } from "react";
import { cardExporter, ExportOptions } from "../lib/cardExporter";
import { CardElement, CardSettings } from "../create/page";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  cardRef: React.RefObject<HTMLDivElement>;
  cardSettings: CardSettings;
  cardElements: CardElement[];
  githubUsername: string;
}

const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  cardRef,
  cardSettings,
  cardElements,
  githubUsername,
}) => {
  const [exportedImageUrl, setExportedImageUrl] = useState<string>("");
  const [exportLoading, setExportLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"image" | "api" | "config">("image");
  const [exportFormat, setExportFormat] = useState<"png" | "jpeg" | "svg">("png");
  const [transparentBg, setTransparentBg] = useState(false);
  const [exportQuality, setExportQuality] = useState(1.0);
  const [copySuccess, setCopySuccess] = useState<string>("");

  const handleExport = async () => {
    if (!cardRef.current) return;

    setExportLoading(true);
    try {
      const cardElement = cardRef.current.querySelector(".card") as HTMLElement;
      if (!cardElement) throw new Error("Card element not found");

      const options: ExportOptions = {
        format: exportFormat,
        transparentBackground: transparentBg,
        quality: exportQuality,
        scale: 2,
      };

      let blob: Blob;
      if (exportFormat === "svg") {
        blob = await cardExporter.exportAsSVG(cardElement, cardSettings, transparentBg);
      } else {
        blob = await cardExporter.exportAsPNG(cardElement, cardSettings, options);
      }

      const url = URL.createObjectURL(blob);
      setExportedImageUrl(url);
    } catch (error) {
      console.error("Error exporting card:", error);
      alert("Failed to export card. Please try again.");
    } finally {
      setExportLoading(false);
    }
  };

  const handleDownload = () => {
    if (!exportedImageUrl) return;

    const extension = exportFormat === "svg" ? "svg" : exportFormat;
    const filename = `github-card-${githubUsername || "export"}.${extension}`;

    fetch(exportedImageUrl)
      .then((res) => res.blob())
      .then((blob) => {
        cardExporter.downloadBlob(blob, filename);
      });
  };

  const handleCopyImage = async () => {
    if (!exportedImageUrl) return;

    try {
      const blob = await fetch(exportedImageUrl).then((res) => res.blob());
      const success = await cardExporter.copyImageToClipboard(blob);
      if (success) {
        setCopySuccess("Image copied to clipboard!");
        setTimeout(() => setCopySuccess(""), 3000);
      } else {
        alert("Failed to copy image. Your browser may not support this feature.");
      }
    } catch (error) {
      console.error("Error copying image:", error);
      alert("Failed to copy image.");
    }
  };

  const handleCopyText = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(`${label} copied!`);
      setTimeout(() => setCopySuccess(""), 3000);
    } catch (error) {
      console.error("Error copying text:", error);
    }
  };

  const handleExportConfig = () => {
    cardExporter.exportConfig(cardElements, cardSettings, githubUsername);
    setCopySuccess("Config file downloaded!");
    setTimeout(() => setCopySuccess(""), 3000);
  };

  const generateAPIUrl = () => {
    return cardExporter.generateAPIEndpointCode(githubUsername);
  };

  const generateReadmeMarkdown = () => {
    return cardExporter.generateReadmeMarkdown(githubUsername);
  };

  const generateReadmeHTML = () => {
    return cardExporter.generateReadmeHTML(
      githubUsername,
      `https://github.com/${githubUsername}`
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-700 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-700 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Export Your Card</h2>
          <button
            onClick={() => {
              onClose();
              if (exportedImageUrl) {
                URL.revokeObjectURL(exportedImageUrl);
                setExportedImageUrl("");
              }
            }}
            className="text-zinc-400 hover:text-white transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 px-6 py-3 border-b border-zinc-800">
          <button
            onClick={() => setActiveTab("image")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "image"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                : "bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700"
              }`}
          >
            📥 Image Export
          </button>
          <button
            onClick={() => setActiveTab("api")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "api"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                : "bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700"
              }`}
          >
            🔗 Dynamic API
          </button>
          <button
            onClick={() => setActiveTab("config")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "config"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                : "bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700"
              }`}
          >
            ⚙️ Config
          </button>
        </div>

        {/* Success Message */}
        {copySuccess && (
          <div className="mx-6 mt-4 px-4 py-2 bg-green-600/20 border border-green-600/50 rounded-lg text-green-400 text-sm">
            ✓ {copySuccess}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {/* Image Export Tab */}
          {activeTab === "image" && (
            <div className="space-y-4">
              {/* Export Options */}
              <div className="bg-zinc-800/50 rounded-xl p-4 space-y-4">
                <h3 className="text-white font-semibold mb-3">Export Settings</h3>

                {/* Format Selection */}
                <div>
                  <label className="text-sm text-zinc-400 block mb-2">Format</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["png", "jpeg", "svg"] as const).map((format) => (
                      <button
                        key={format}
                        onClick={() => setExportFormat(format)}
                        className={`py-2 px-4 rounded-lg text-sm font-medium transition-all ${exportFormat === format
                            ? "bg-blue-600 text-white"
                            : "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
                          }`}
                      >
                        {format.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Transparent Background */}
                <div className="flex items-center justify-between">
                  <label className="text-sm text-zinc-400">Transparent Background</label>
                  <button
                    onClick={() => setTransparentBg(!transparentBg)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${transparentBg ? "bg-blue-600" : "bg-zinc-700"
                      }`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${transparentBg ? "translate-x-6" : "translate-x-0"
                        }`}
                    />
                  </button>
                </div>

                {/* Quality Slider (for JPEG) */}
                {exportFormat === "jpeg" && (
                  <div>
                    <label className="text-sm text-zinc-400 block mb-2">
                      Quality: {Math.round(exportQuality * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.1"
                      value={exportQuality}
                      onChange={(e) => setExportQuality(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                )}

                {/* Export Button */}
                <button
                  onClick={handleExport}
                  disabled={exportLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {exportLoading ? "Generating..." : "🎨 Generate Export"}
                </button>
              </div>

              {/* Preview */}
              {exportedImageUrl && (
                <div className="bg-zinc-800/50 rounded-xl p-4">
                  <h3 className="text-white font-semibold mb-3">Preview</h3>
                  <div className="border border-zinc-700 rounded-lg overflow-hidden bg-zinc-900 p-4">
                    {exportFormat === "svg" ? (
                      <div className="text-center text-zinc-400 py-8">
                        <svg
                          className="w-16 h-16 mx-auto mb-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <p>SVG file ready for download</p>
                      </div>
                    ) : (
                      <img
                        src={exportedImageUrl}
                        alt="Exported card"
                        className="w-full rounded-lg"
                      />
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <button
                      onClick={handleDownload}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      Download
                    </button>
                    {exportFormat !== "svg" && (
                      <button
                        onClick={handleCopyImage}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                        Copy Image
                      </button>
                    )}
                    {exportFormat === "svg" && (
                      <div className="bg-zinc-700/50 text-zinc-400 px-4 py-3 rounded-lg text-sm flex items-center justify-center">
                        SVG copy not supported
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Dynamic API Tab */}
          {activeTab === "api" && (
            <div className="space-y-4">
              <div className="bg-zinc-800/50 rounded-xl p-4">
                <h3 className="text-white font-semibold mb-2">
                  🚀 Real-time GitHub Stats API
                </h3>
                <p className="text-zinc-400 text-sm mb-4">
                  Use this dynamic API endpoint to display your card in README files. The
                  stats will update automatically!
                </p>

                {!githubUsername && (
                  <div className="bg-yellow-600/20 border border-yellow-600/50 rounded-lg p-3 mb-4">
                    <p className="text-yellow-400 text-sm">
                      ⚠️ Set your GitHub username first to generate API URLs
                    </p>
                  </div>
                )}

                {githubUsername && (
                  <>
                    {/* API Endpoint */}
                    <div className="mb-4">
                      <label className="text-sm text-zinc-400 block mb-2">API Endpoint</label>
                      <div className="flex gap-2">
                        <div className="flex-1 bg-zinc-900 rounded-lg p-3 border border-zinc-700 font-mono text-sm text-green-400 overflow-x-auto">
                          {generateAPIUrl()}
                        </div>
                        <button
                          onClick={() => handleCopyText(generateAPIUrl(), "API URL")}
                          className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 rounded-lg transition-colors"
                        >
                          📋
                        </button>
                      </div>
                    </div>

                    {/* Markdown */}
                    <div className="mb-4">
                      <label className="text-sm text-zinc-400 block mb-2">
                        Markdown (README.md)
                      </label>
                      <div className="flex gap-2">
                        <div className="flex-1 bg-zinc-900 rounded-lg p-3 border border-zinc-700 font-mono text-sm text-blue-400 overflow-x-auto">
                          {generateReadmeMarkdown()}
                        </div>
                        <button
                          onClick={() =>
                            handleCopyText(generateReadmeMarkdown(), "Markdown code")
                          }
                          className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 rounded-lg transition-colors"
                        >
                          📋
                        </button>
                      </div>
                    </div>

                    {/* HTML */}
                    <div className="mb-4">
                      <label className="text-sm text-zinc-400 block mb-2">
                        HTML (with link)
                      </label>
                      <div className="flex gap-2">
                        <div className="flex-1 bg-zinc-900 rounded-lg p-3 border border-zinc-700 font-mono text-xs text-purple-400 overflow-x-auto">
                          {generateReadmeHTML()}
                        </div>
                        <button
                          onClick={() =>
                            handleCopyText(generateReadmeHTML(), "HTML code")
                          }
                          className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 rounded-lg transition-colors"
                        >
                          📋
                        </button>
                      </div>
                    </div>

                    {/* Info Box */}
                    <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-4">
                      <h4 className="text-blue-400 font-medium mb-2">How it works</h4>
                      <ul className="text-zinc-400 text-sm space-y-1">
                        <li>• Paste the code into your GitHub README.md</li>
                        <li>• Stats automatically update when someone views your profile</li>
                        <li>• No manual updates needed!</li>
                        <li>
                          • Note: You'll need to deploy the API endpoint for this to work
                        </li>
                      </ul>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Config Tab */}
          {activeTab === "config" && (
            <div className="space-y-4">
              <div className="bg-zinc-800/50 rounded-xl p-4">
                <h3 className="text-white font-semibold mb-2">💾 Save & Share Config</h3>
                <p className="text-zinc-400 text-sm mb-4">
                  Export your card configuration to share with others or backup your design.
                </p>

                <button
                  onClick={handleExportConfig}
                  className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white py-3 px-4 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
                >
                  📦 Download Config File
                </button>

                <div className="mt-4 bg-zinc-900/50 rounded-lg p-4 border border-zinc-700">
                  <h4 className="text-white text-sm font-medium mb-2">What's included:</h4>
                  <ul className="text-zinc-400 text-sm space-y-1">
                    <li>✓ All card elements and their properties</li>
                    <li>✓ Card settings (size, colors, borders)</li>
                    <li>✓ GitHub username</li>
                    <li>✓ Timestamp</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-800 flex justify-end">
          <button
            onClick={() => {
              onClose();
              if (exportedImageUrl) {
                URL.revokeObjectURL(exportedImageUrl);
                setExportedImageUrl("");
              }
            }}
            className="bg-zinc-700 hover:bg-zinc-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
