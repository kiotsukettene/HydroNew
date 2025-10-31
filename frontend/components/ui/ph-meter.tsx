import React from "react";
import { View, Text } from "react-native";

interface PhScaleProps {
  phValue: number; // e.g. 7.0
}

const PhScale: React.FC<PhScaleProps> = ({ phValue }) => {
  const colors = [
    "#FF0000", "#FF3300", "#FF6600", "#FF9900", "#FFCC00",
    "#CCFF00", "#99FF00", "#00FF00", "#00FF66", "#00CCCC",
    "#0066FF", "#0000FF", "#6600CC", "#9900CC", "#CC00CC",
  ];

  const roundedPh = Math.max(0, Math.min(14, Math.round(phValue)));

  return (
    <View className="w-full items-center mt-4">
      <View className="flex-row w-[95%] justify-between">
        {colors.map((color, index) => {
          const isActive = index === roundedPh;
          return (
            <View
              key={index}
              style={{
                flex: 1,
                height: 50,
                backgroundColor: color,
                borderWidth: isActive ? 2 : 0,
                borderColor: isActive ? "#000" : "transparent",
                opacity: isActive ? 1 : 0.7,
              }}
            />
          );
        })}
      </View>

      <View className="flex-row justify-between w-[95%] mt-1">
        <Text className="text-xs text-gray-600">0</Text>
        <Text className="text-xs text-gray-600">7</Text>
        <Text className="text-xs text-gray-600">14</Text>
      </View>

    </View>
  );
};

export default PhScale;
