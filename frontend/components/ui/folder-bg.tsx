import React from 'react';
import { View } from 'react-native';
import Svg, { Path, Rect } from "react-native-svg";

export default function FolderBg({ children }) {
  return (
   
    <View className="relative w-full" style={{ aspectRatio: 378 / 270 }}>
      
      {/* 1. The SVG Background, positioned to fill the container */}
      <View className="absolute inset-0">
        <Svg viewBox="0 0 378 270" className="w-full h-full">
          <Path
            d="M274.162 49.5401C276.515 58.2701 284.432 64.3359 293.473 64.3359H358C369.046 64.3359 378 73.2902 378 84.3359V250C378 261.046 369.046 270 358 270H20C8.9543 270 0 261.046 0 250V20C0 8.95431 8.95431 0 20 0H245.488C254.529 0 262.446 6.06588 264.799 14.7959L274.162 49.5401Z"
            fill="#1D6143"
          />
          <Rect
            x="278"
            y="6"
            width="93"
            height="52"
            rx="20"
            fill="#D9D9D9"
          />
        </Svg>
      </View>

      <View className="flex-1 p-5">
        {children}
      </View>
    </View>
  );
}