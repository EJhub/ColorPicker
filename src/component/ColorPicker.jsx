import { useState, useMemo, useEffect } from "react";
import './ColorPicker.css';

function ColorPicker() {
  const [color, setColor] = useState("#fff");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [bubbles, setBubbles] = useState([]);

  const colors = useMemo(() => [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
    '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43',
    '#10AC84', '#EE5A24', '#0ABDE3', '#FD79A8', '#6C5CE7'
  ], []);

  // Function to calculate luminance of a color
  const getLuminance = (hexColor) => {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;

    const rLinear = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
    const gLinear = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
    const bLinear = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

    return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
  };

  const isLightColor = (hexColor) => {
    return getLuminance(hexColor) > 0.5;
  };

  const getTextColor = (backgroundColor) => {
    return isLightColor(backgroundColor) ? '#000000' : '#ffffff';
  };

  function handleColorPicker(event) {
    setColor(event.target.value);
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Create floating bubbles
  useEffect(() => {
    const createBubble = () => {
      const bubble = {
        id: Math.random(),
        left: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        duration: 8 + Math.random() * 4, // 8-12 seconds
        size: 1.5 + Math.random() * 1.5, // 1.5-3rem
      };
      return bubble;
    };

    const addBubble = () => {
      setBubbles(prev => [...prev, createBubble()]);
    };

    // Create initial bubbles
    for (let i = 0; i < 3; i++) {
      setTimeout(addBubble, i * 2000);
    }

    // Add new bubble every 3 seconds
    const interval = setInterval(addBubble, 3000);

    return () => clearInterval(interval);
  }, [colors]);

  // Remove bubbles after animation completes
  useEffect(() => {
    bubbles.forEach(bubble => {
      setTimeout(() => {
        setBubbles(prev => prev.filter(b => b.id !== bubble.id));
      }, bubble.duration * 1000);
    });
  }, [bubbles]);

  const textColor = getTextColor(color);
  const themeClass = isDarkMode ? 'dark' : 'light';

  return (
    <div className={`container ${themeClass}`}>
      {/* Floating EJ bubbles */}
      {bubbles.map(bubble => (
        <div
          key={bubble.id}
          className="floating-bubble"
          style={{
            left: `${bubble.left}%`,
            color: bubble.color,
            fontSize: `${bubble.size}rem`,
            animationDuration: `${bubble.duration}s`,
          }}
        >
          EJ
        </div>
      ))}

      <button 
        onClick={toggleTheme}
        className={`toggle-button ${themeClass}`}
      >
        {isDarkMode ? '☀️' : '🌙'} {isDarkMode ? 'Light' : 'Dark'} Mode
      </button>

      <h1 className={`title ${themeClass}`}>Color Picker</h1>
      <div 
        className={`color-selected ${themeClass}`}
        style={{
          backgroundColor: color,
          color: textColor
        }}
      >
        Selected Color: {color}
      </div>
      <div className="input-container">
        <label className={`label ${themeClass}`}>Select a Color:</label>
        <input 
          type="color" 
          className="color-input"
          value={color} 
          onChange={handleColorPicker}
          aria-label="Color picker input"
        />
      </div>
    </div>
  );
}

export default ColorPicker;