import { Rnd } from "react-rnd";
import { CardElement, CardSettings } from "../create/page";
import QRCode from "qrcode";
import { useEffect, useState } from "react";

interface CardProps {
  elements: CardElement[];
  onUpdateElement: (id: number, data: Partial<CardElement>) => void;
  selectedElementId: number | null;
  onSelectElement: (id: number) => void;
  settings: CardSettings;
  onUpdateSettings: (settings: Partial<CardSettings>) => void;
}

const Card: React.FC<CardProps> = ({
  elements,
  onUpdateElement,
  selectedElementId,
  onSelectElement,
  settings,
}) => {
  const [qrCodeCache, setQrCodeCache] = useState<{ [key: number]: string }>({});

  // Generate QR codes for qrCode elements
  useEffect(() => {
    elements.forEach(async (el) => {
      if (el.type === "qrCode" && el.qrCodeData && !qrCodeCache[el.id]) {
        try {
          const url = await QRCode.toDataURL(el.qrCodeData, {
            color: {
              dark: el.qrCodeColor || "#000000",
              light: el.qrCodeBgColor || "#ffffff",
            },
            width: 500,
            margin: 1,
          });
          setQrCodeCache((prev) => ({ ...prev, [el.id]: url }));
        } catch (err) {
          console.error("QR Code generation error:", err);
        }
      }
    });
  }, [elements, qrCodeCache]);

  const renderElement = (el: CardElement) => {
    switch (el.type) {
      case "text":
        return (
          <div
            style={{
              fontSize: `${el.fontSize}px`,
              fontFamily: el.fontFamily,
              color: el.color,
              fontWeight: el.fontWeight,
              textAlign: el.textAlign as any,
              width: "100%",
              height: "100%",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              wordBreak: "break-word",
              padding: "4px",
            }}
          >
            {el.githubStat && el.githubStat !== "none"
              ? el.content || el.githubStat
              : el.content}
          </div>
        );

      case "image":
        return (
          <img
            src={el.src || "https://via.placeholder.com/150"}
            alt="Element"
            onError={(e) => {
              e.currentTarget.src = "https://via.placeholder.com/150?text=Image+Error";
            }}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: el.opacity,
              borderRadius: `${el.borderRadius || 0}px`,
              border:
                el.borderStyle && el.borderStyle !== "none"
                  ? `${el.borderWidth}px ${el.borderStyle} ${el.borderColor}`
                  : "none",
            }}
          />
        );

      case "shape":
        return renderShape(el);

      case "trophy":
        return (
          <svg
            viewBox="0 0 100 120"
            style={{
              width: "100%",
              height: "100%",
              fill: el.trophyColor,
            }}
          >
            <path d="M 30 30 L 30 50 Q 30 65 50 65 Q 70 65 70 50 L 70 30 Z" />
            <rect x="40" y="65" width="20" height="15" />
            <rect x="35" y="80" width="30" height="8" />
            <path d="M 30 35 Q 20 35 20 45 Q 20 50 25 50 L 30 50" />
            <path d="M 70 35 Q 80 35 80 45 Q 80 50 75 50 L 70 50" />
            <ellipse cx="50" cy="30" rx="20" ry="5" />
          </svg>
        );

      case "badge":
        return (
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: el.badgeColor,
              color: el.badgeTextColor,
              fontSize: `${el.fontSize}px`,
              fontWeight: el.fontWeight,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "6px",
              padding: "4px 12px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            {el.badgeText}
          </div>
        );

      case "table":
        return (
          <div style={{ width: "100%", height: "100%", overflow: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {el.tableData?.[0]?.map((cell, idx) => (
                    <th
                      key={idx}
                      style={{
                        backgroundColor: el.headerBgColor,
                        color: el.color,
                        padding: "8px",
                        border: "1px solid #555",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      {cell}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {el.tableData?.slice(1).map((row, rowIdx) => (
                  <tr key={rowIdx}>
                    {row.map((cell, cellIdx) => (
                      <td
                        key={cellIdx}
                        style={{
                          backgroundColor: el.cellBgColor,
                          color: el.color,
                          padding: "8px",
                          border: "1px solid #555",
                          fontSize: "12px",
                        }}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case "statsCard":
        return (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: el.fillColor,
              border: `${el.strokeWidth}px solid ${el.strokeColor}`,
              borderRadius: `${el.borderRadius}px`,
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <div style={{ fontSize: "32px" }}>{el.statIcon}</div>
            <div
              style={{
                fontSize: `${el.fontSize}px`,
                fontWeight: "bold",
                color: el.color,
              }}
            >
              {el.statValue}
            </div>
            <div
              style={{
                fontSize: "12px",
                color: el.color,
                opacity: 0.8,
                textAlign: "center",
              }}
            >
              {el.statLabel}
            </div>
          </div>
        );

      case "progressBar":
        return (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                fontSize: `${el.fontSize}px`,
                color: el.color,
                fontWeight: "500",
              }}
            >
              {el.progressLabel}
            </div>
            <div
              style={{
                width: "100%",
                height: "12px",
                backgroundColor: el.progressBgColor,
                borderRadius: `${el.borderRadius}px`,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${el.progressValue}%`,
                  height: "100%",
                  backgroundColor: el.progressColor,
                  transition: "width 0.3s ease",
                }}
              />
            </div>
            <div
              style={{
                fontSize: "10px",
                color: el.color,
                opacity: 0.7,
              }}
            >
              {el.progressValue}%
            </div>
          </div>
        );

      case "languageBar":
        return (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "20px",
                display: "flex",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              {el.languages?.map((lang, idx) => (
                <div
                  key={idx}
                  style={{
                    width: `${lang.percentage}%`,
                    backgroundColor: lang.color,
                    height: "100%",
                  }}
                />
              ))}
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                fontSize: `${el.fontSize}px`,
                color: el.color,
              }}
            >
              {el.languages?.map((lang, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: lang.color,
                    }}
                  />
                  <span>
                    {lang.name} {lang.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      case "contributionGraph":
        return (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              gap: "2px",
              overflow: "auto",
            }}
          >
            {el.contributionData?.map((week, weekIdx) => (
              <div key={weekIdx} style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                {week.map((day, dayIdx) => (
                  <div
                    key={dayIdx}
                    style={{
                      width: "10px",
                      height: "10px",
                      backgroundColor: el.contributionColors?.[day] || "#161b22",
                      borderRadius: "2px",
                    }}
                    title={`${day} contributions`}
                  />
                ))}
              </div>
            ))}
          </div>
        );

      case "icon":
        return (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: `${el.fontSize}px`,
              color: el.color,
            }}
          >
            {el.content}
          </div>
        );

      case "qrCode":
        return (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: el.qrCodeBgColor || "#ffffff",
              borderRadius: "8px",
              padding: "8px",
            }}
          >
            {qrCodeCache[el.id] ? (
              <img
                src={qrCodeCache[el.id]}
                alt="QR Code"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            ) : (
              <div style={{ color: "#666", fontSize: "12px" }}>Generating QR...</div>
            )}
          </div>
        );

      case "chart":
        return renderChart(el);

      case "socialBadge":
        return renderSocialBadge(el);

      default:
        return null;
    }
  };

  const renderShape = (el: CardElement) => {
    const fillColor = el.fillColor || "#3b82f6";
    const strokeColor = el.strokeColor || "#1e40af";
    const strokeWidth = el.strokeWidth || 2;
    const opacity = el.opacity !== undefined ? el.opacity : 1;

    switch (el.shapeType) {
      case "rectangle":
      case "square":
        return (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: fillColor,
              border: `${strokeWidth}px solid ${strokeColor}`,
              borderRadius: "8px",
              opacity,
            }}
          />
        );

      case "circle":
        return (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: fillColor,
              border: `${strokeWidth}px solid ${strokeColor}`,
              borderRadius: "50%",
              opacity,
            }}
          />
        );

      case "triangle":
        return (
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: `${el.width / 2}px solid transparent`,
              borderRight: `${el.width / 2}px solid transparent`,
              borderBottom: `${el.height}px solid ${fillColor}`,
              filter: `drop-shadow(0 0 ${strokeWidth}px ${strokeColor})`,
              opacity,
            }}
          />
        );

      case "divider":
        return (
          <div
            style={{
              width: "100%",
              height: `${strokeWidth}px`,
              backgroundColor: strokeColor,
              opacity,
            }}
          />
        );

      default:
        return (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: fillColor,
              border: `${strokeWidth}px solid ${strokeColor}`,
              opacity,
            }}
          />
        );
    }
  };

  const renderChart = (el: CardElement) => {
    if (!el.chartData || el.chartData.length === 0) {
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: el.color || "#666",
          }}
        >
          No data
        </div>
      );
    }

    const maxValue = Math.max(...el.chartData.map((d) => d.value));

    if (el.chartType === "bar") {
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            padding: "12px",
          }}
        >
          {el.chartTitle && (
            <div
              style={{
                fontSize: `${(el.fontSize || 12) + 2}px`,
                fontWeight: "600",
                color: el.color,
              }}
            >
              {el.chartTitle}
            </div>
          )}
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "flex-end",
              gap: "8px",
            }}
          >
            {el.chartData.map((item, idx) => (
              <div
                key={idx}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: `${(item.value / maxValue) * 100}%`,
                    backgroundColor: item.color,
                    borderRadius: "4px 4px 0 0",
                    minHeight: "4px",
                  }}
                />
                <div
                  style={{
                    fontSize: `${el.fontSize || 12}px`,
                    color: el.color,
                    textAlign: "center",
                    wordBreak: "break-word",
                  }}
                >
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    } else if (el.chartType === "pie") {
      const total = el.chartData.reduce((sum, item) => sum + item.value, 0);
      let currentAngle = 0;

      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            padding: "12px",
          }}
        >
          {el.chartTitle && (
            <div
              style={{
                fontSize: `${(el.fontSize || 12) + 2}px`,
                fontWeight: "600",
                color: el.color,
              }}
            >
              {el.chartTitle}
            </div>
          )}
          <div style={{ flex: 1, display: "flex", gap: "12px", alignItems: "center" }}>
            <svg viewBox="0 0 100 100" style={{ width: "50%", height: "100%" }}>
              {el.chartData.map((item, idx) => {
                const percentage = (item.value / total) * 100;
                const angle = (percentage / 100) * 360;
                const startAngle = currentAngle;
                const endAngle = currentAngle + angle;
                currentAngle = endAngle;

                const startRad = (startAngle - 90) * (Math.PI / 180);
                const endRad = (endAngle - 90) * (Math.PI / 180);
                const x1 = 50 + 40 * Math.cos(startRad);
                const y1 = 50 + 40 * Math.sin(startRad);
                const x2 = 50 + 40 * Math.cos(endRad);
                const y2 = 50 + 40 * Math.sin(endRad);
                const largeArc = angle > 180 ? 1 : 0;

                return (
                  <path
                    key={idx}
                    d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                    fill={item.color}
                  />
                );
              })}
            </svg>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
              {el.chartData.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: `${el.fontSize || 12}px`,
                    color: el.color,
                  }}
                >
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      backgroundColor: item.color,
                      borderRadius: "2px",
                    }}
                  />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderSocialBadge = (el: CardElement) => {
    const platformIcons: { [key: string]: string } = {
      github: "⚡",
      twitter: "🐦",
      linkedin: "💼",
      youtube: "📺",
      instagram: "📷",
      discord: "💬",
    };

    const platformColors: { [key: string]: string } = {
      github: "#24292e",
      twitter: "#1DA1F2",
      linkedin: "#0A66C2",
      youtube: "#FF0000",
      instagram: "#E4405F",
      discord: "#5865F2",
    };

    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: el.socialColor || platformColors[el.socialPlatform || "github"],
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          padding: "8px 16px",
        }}
      >
        <span style={{ fontSize: "24px" }}>
          {platformIcons[el.socialPlatform || "github"]}
        </span>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontSize: `${(el.fontSize || 14) - 2}px`,
              color: el.color,
              opacity: 0.8,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            {el.socialPlatform}
          </span>
          <span
            style={{
              fontSize: `${el.fontSize}px`,
              fontWeight: el.fontWeight,
              color: el.color,
            }}
          >
            @{el.socialUsername}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 mx-4 my-4 flex items-center justify-center">
      <div
        className="card relative rounded-xl transition-all duration-300"
        style={{
          width: `${settings.width}px`,
          height: `${settings.height}px`,
          backgroundColor: settings.backgroundColor,
          backgroundImage: settings.backgroundImage,
          backgroundSize: "cover",
          backgroundPosition: "center",
          border: `${settings.borderWidth}px solid ${settings.borderColor}`,
          borderRadius: `${settings.borderRadius}px`,
          padding: `${settings.padding}px`,
          boxShadow: settings.shadow,
        }}
      >
        {elements.map((el) => {
          const isSelected = el.id === selectedElementId;

          return (
            <Rnd
              key={el.id}
              size={{ width: el.width, height: el.height }}
              position={{ x: el.x, y: el.y }}
              onDragStop={(e, d) => {
                onUpdateElement(el.id, { x: d.x, y: d.y });
              }}
              onResizeStop={(e, direction, ref, delta, position) => {
                onUpdateElement(el.id, {
                  width: ref.offsetWidth,
                  height: ref.offsetHeight,
                  ...position,
                });
              }}
              bounds="parent"
              className={`${isSelected ? "selected-element" : ""}`}
              style={{
                transform: `rotate(${el.rotation}deg)`,
                border: isSelected
                  ? "2px solid #3b82f6"
                  : "1px dashed rgba(255, 255, 255, 0.1)",
                cursor: "move",
                backgroundColor: isSelected ? "rgba(59, 130, 246, 0.05)" : "transparent",
                transition: "border 0.2s ease, background-color 0.2s ease",
              }}
              onClick={(e) => {
                e.stopPropagation();
                onSelectElement(el.id);
              }}
              resizeHandleStyles={{
                bottom: {
                  bottom: "-5px",
                  height: "10px",
                  cursor: "ns-resize",
                  width: "100%",
                  background: isSelected ? "#3b82f6" : "transparent",
                },
                right: {
                  right: "-5px",
                  width: "10px",
                  cursor: "ew-resize",
                  height: "100%",
                  background: isSelected ? "#3b82f6" : "transparent",
                },
                bottomRight: {
                  bottom: "-8px",
                  right: "-8px",
                  width: "16px",
                  height: "16px",
                  cursor: "nwse-resize",
                  background: isSelected ? "#3b82f6" : "transparent",
                  borderRadius: "50%",
                  border: isSelected ? "2px solid white" : "none",
                },
                bottomLeft: {
                  bottom: "-8px",
                  left: "-8px",
                  width: "16px",
                  height: "16px",
                  cursor: "nesw-resize",
                  background: isSelected ? "#3b82f6" : "transparent",
                  borderRadius: "50%",
                  border: isSelected ? "2px solid white" : "none",
                },
                topRight: {
                  top: "-8px",
                  right: "-8px",
                  width: "16px",
                  height: "16px",
                  cursor: "nesw-resize",
                  background: isSelected ? "#3b82f6" : "transparent",
                  borderRadius: "50%",
                  border: isSelected ? "2px solid white" : "none",
                },
                topLeft: {
                  top: "-8px",
                  left: "-8px",
                  width: "16px",
                  height: "16px",
                  cursor: "nwse-resize",
                  background: isSelected ? "#3b82f6" : "transparent",
                  borderRadius: "50%",
                  border: isSelected ? "2px solid white" : "none",
                },
                top: {
                  top: "-5px",
                  height: "10px",
                  cursor: "ns-resize",
                  width: "100%",
                  background: isSelected ? "#3b82f6" : "transparent",
                },
                left: {
                  left: "-5px",
                  width: "10px",
                  cursor: "ew-resize",
                  height: "100%",
                  background: isSelected ? "#3b82f6" : "transparent",
                },
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  pointerEvents: "none",
                }}
              >
                {renderElement(el)}
              </div>
            </Rnd>
          );
        })}

        {elements.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <p className="text-zinc-500 text-lg mb-2">Click a component to get started</p>
              <p className="text-zinc-600 text-sm">Drag, resize, and customize your GitHub card</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
