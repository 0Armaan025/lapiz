"use client";
import { useState, useEffect } from "react";
import Card from "../components/Card";
import Header from "../components/Header";
import LeftPane from "../components/LeftPane";
import RightPane from "../components/RightPane";

export interface CardElement {
  id: number;
  type: string;
  content?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  // Text-specific properties
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  fontWeight?: string;
  textAlign?: string;
  githubStat?: string;
  // Image-specific properties
  src?: string;
  opacity?: number;
  imageType?: string;
  githubUsername?: string;
  borderStyle?: string;
  borderWidth?: number;
  borderColor?: string;
  borderRadius?: number;
  // Shape-specific properties
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  shapeType?: string;
  // Trophy-specific properties
  trophyType?: string;
  trophyColor?: string;
  // Badge-specific properties
  badgeText?: string;
  badgeColor?: string;
  badgeTextColor?: string;
  // Table-specific properties
  rows?: number;
  columns?: number;
  tableData?: string[][];
  headerBgColor?: string;
  cellBgColor?: string;
  // Stats Card properties
  statType?: string;
  statValue?: string;
  statLabel?: string;
  statIcon?: string;
  // Progress Bar properties
  progressValue?: number;
  progressColor?: string;
  progressBgColor?: string;
  progressLabel?: string;
  // Language Bar properties
  languages?: { name: string; percentage: number; color: string }[];
  // Contribution Graph properties
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
}

const Create = () => {
  const [cardElements, setCardElements] = useState<CardElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<number | null>(null);
  const [cardSettings, setCardSettings] = useState<CardSettings>({
    backgroundColor: "#1a1a2e",
    borderColor: "#3b82f6",
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    shadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  });

  // Load from localStorage on mount
  useEffect(() => {
    const savedElements = localStorage.getItem("cardElements");
    const savedSettings = localStorage.getItem("cardSettings");

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
  }, []);

  // Save to localStorage whenever elements or settings change
  useEffect(() => {
    localStorage.setItem("cardElements", JSON.stringify(cardElements));
  }, [cardElements]);

  useEffect(() => {
    localStorage.setItem("cardSettings", JSON.stringify(cardSettings));
  }, [cardSettings]);

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
      src: "https://via.placeholder.com/150",
      opacity: 1,
      imageType: "custom",
      githubUsername: "",
      borderRadius: 8,
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
    // Generate sample contribution data (52 weeks x 7 days)
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

  const clearAllElements = () => {
    if (confirm("Are you sure you want to clear all elements?")) {
      setCardElements([]);
      setSelectedElementId(null);
    }
  };

  const selectedElement = cardElements.find((el) => el.id === selectedElementId);

  return (
    <div className="min-h-screen bg-[#0a0a0a] cursor-default">
      <Header />
      <div className="creativityArea justify-between flex flex-row items-start">
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
          cardSettings={cardSettings}
          onUpdateCardSettings={setCardSettings}
        />
      </div>
    </div>
  );
};

export default Create;
