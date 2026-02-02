

import { Rnd } from "react-rnd";
import { CardElement, CardSettings } from "../create/page";

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
  return (
    <div className="flex-1 mx-4 my-4 flex items-center justify-center">
      <div
        className="card relative rounded-xl"
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
              className={`${isSelected ? 'selected-element' : ''}`}
              style={{
                transform: `rotate(${el.rotation}deg)`,
                border: isSelected ? "2px solid #3b82f6" : "1px dashed rgba(255, 255, 255, 0.2)",
                cursor: "move",
                backgroundColor: isSelected ? "rgba(59, 130, 246, 0.05)" : "transparent",
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
              <div style={{ width: "100%", height: "100%", padding: "4px", pointerEvents: "none" }}>
                {/* Text Element */}
                {el.type === "text" && (
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
                    }}
                  >
                    {el.githubStat && el.githubStat !== "none"
                      ? el.content || el.githubStat
                      : el.content}
                  </div>
                )}

                {/* Image Element */}
                {el.type === "image" && (
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
                      border: el.borderStyle && el.borderStyle !== "none"
                        ? `${el.borderWidth}px ${el.borderStyle} ${el.borderColor}`
                        : "none",
                    }}
                  />
                )}

                {/* Shape Element */}
                {el.type === "shape" && (
                  <>
                    {el.shapeType === "rectangle" && (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          background: el.fillColor,
                          border: `${el.strokeWidth}px solid ${el.strokeColor}`,
                          borderRadius: "8px",
                        }}
                      />
                    )}

                    {el.shapeType === "square" && (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          background: el.fillColor,
                          border: `${el.strokeWidth}px solid ${el.strokeColor}`,
                          borderRadius: "8px",
                        }}
                      />
                    )}

                    {el.shapeType === "circle" && (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          background: el.fillColor,
                          border: `${el.strokeWidth}px solid ${el.strokeColor}`,
                          borderRadius: "50%",
                        }}
                      />
                    )}

                    {el.shapeType === "triangle" && (
                      <div
                        style={{
                          width: 0,
                          height: 0,
                          borderLeft: `${el.width / 2}px solid transparent`,
                          borderRight: `${el.width / 2}px solid transparent`,
                          borderBottom: `${el.height}px solid ${el.fillColor}`,
                          filter: `drop-shadow(0 0 ${el.strokeWidth}px ${el.strokeColor})`,
                        }}
                      />
                    )}

                    {el.shapeType === "divider" && (
                      <div
                        style={{
                          width: "100%",
                          height: `${el.strokeWidth}px`,
                          backgroundColor: el.strokeColor,
                        }}
                      />
                    )}
                  </>
                )}

                {/* Trophy Element */}
                {el.type === "trophy" && (
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
                )}

                {/* Badge Element */}
                {el.type === "badge" && (
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
                )}

                {/* Table Element */}
                {el.type === "table" && (
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
                )}

                {/* Stats Card Element */}
                {el.type === "statsCard" && (
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
                )}

                {/* Progress Bar Element */}
                {el.type === "progressBar" && (
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
                )}

                {/* Language Bar Element */}
                {el.type === "languageBar" && (
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
                )}

                {/* Contribution Graph Element */}
                {el.type === "contributionGraph" && (
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
                )}

                {/* Icon Element */}
                {el.type === "icon" && (
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
                )}
              </div>
            </Rnd>
          );
        })}

        {elements.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-zinc-500 text-lg">
              Click a component on the left to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
