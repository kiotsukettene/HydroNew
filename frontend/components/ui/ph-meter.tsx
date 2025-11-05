import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";

interface PhScaleProps {
  phValue: number; // e.g. 7.0
}

const PhScale: React.FC<PhScaleProps> = ({ phValue }) => {
  const colors = [
    "#FF0000", "#FF3300", "#FF6600", "#FF9900", "#FFCC00",
    "#CCFF00", "#99FF00", "#00FF00", "#00FF66", "#00CCCC",
    "#0066FF", "#0000FF", "#6600CC", "#9900CC", "#CC00CC",
  ];

  const phDescriptions = [
    { level: 0, label: "Very Strong Acid", description: "Extremely acidic - harmful to plants. Nutrients cannot be absorbed." },
    { level: 1, label: "Very Strong Acid", description: "Extremely acidic - harmful to plants. Nutrients cannot be absorbed." },
    { level: 2, label: "Strong Acid", description: "Too acidic for most plants. Root damage is likely." },
    { level: 3, label: "Strong Acid", description: "Too acidic for hydroponics. Growth will be severely stunted." },
    { level: 4, label: "Moderately Acidic", description: "Still too acidic. Nutrients like calcium and magnesium become less available." },
    { level: 5, label: "Slightly Acidic", description: "Getting close to optimal range. Some plants can tolerate this level." },
    { level: 6, label: "Ideal for Hydroponics", description: "Perfect for lettuce! Nutrients are readily available and roots are healthy." },
    { level: 7, label: "Neutral", description: "Neutral pH. Acceptable but slightly high for optimal hydroponic growth." },
    { level: 8, label: "Slightly Alkaline", description: "Too alkaline. Nutrient absorption decreases, growth may slow down." },
    { level: 9, label: "Moderately Alkaline", description: "Plants struggle to absorb iron and other micronutrients. Yellow leaves may appear." },
    { level: 10, label: "Strong Alkaline", description: "Very harmful to plants. Nutrient deficiencies are severe." },
    { level: 11, label: "Strong Alkaline", description: "Extremely alkaline - toxic to most plants. Growth is impossible." },
    { level: 12, label: "Very Strong Alkaline", description: "Extremely alkaline - toxic to most plants. Growth is impossible." },
    { level: 13, label: "Very Strong Alkaline", description: "Extremely alkaline - toxic to most plants. Growth is impossible." },
    { level: 14, label: "Very Strong Alkaline", description: "Extremely alkaline - toxic to most plants. Growth is impossible." },
  ];

  const roundedPh = Math.max(0, Math.min(14, Math.round(phValue)));
  const [selectedPh, setSelectedPh] = useState<number>(roundedPh);

  const handlePhClick = (index: number) => {
    setSelectedPh(index);
  };

  return (
    <View className="w-full items-center mt-4">
      <View className="flex-row w-[95%] justify-between">
        {colors.map((color, index) => {
          const isActive = index === roundedPh;
          const isSelected = index === selectedPh;
          return (
            <Pressable
              key={index}
              onPress={() => handlePhClick(index)}
              style={{
                flex: 1,
                height: 50,
                backgroundColor: color,
                borderWidth: isSelected ? 3 : 0,
                borderColor: isSelected ? "#000" : "transparent",
                opacity: isActive ? 1 : 0.7,
              }}
            />
          );
        })}
      </View>

      <View className="flex-row w-[95%] mt-1">
        {colors.map((_, index) => (
          <View key={index} style={{ flex: 1, alignItems: 'center' }}>
            {index === 0 && <Text className="text-xs text-gray-600">0</Text>}
            {index === 7 && <Text className="text-xs text-gray-600">7</Text>}
            {index === 14 && <Text className="text-xs text-gray-600">14</Text>}
            {index !== 0 && index !== 7 && index !== 14 && <Text className="text-xs text-gray-600"> </Text>}
          </View>
        ))}
      </View>

      {/* pH Information Display */}
      <View 
        className="w-[95%] mt-4 p-4 rounded-lg"
        style={{ backgroundColor: colors[selectedPh] + '40' }}
      >
        <Text className="text-lg font-semibold text-gray-800">
          pH Level {selectedPh}: {phDescriptions[selectedPh].label}
        </Text>
        <Text className="text-sm text-gray-600 mt-2">
          {phDescriptions[selectedPh].description}
        </Text>
      </View>
    </View>
  );
};

export default PhScale;
