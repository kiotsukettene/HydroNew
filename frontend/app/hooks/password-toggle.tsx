// hooks/password-toggle.tsx
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react-native';
import { Pressable } from 'react-native';
import { View } from 'react-native';

interface PasswordToggleProps {
  onToggle?: (show: boolean) => void;
  initialState?: boolean;
}

export default function PasswordToggle({
  onToggle,
  initialState = false,
}: PasswordToggleProps) {
  const [showPassword, setShowPassword] = useState(initialState);

  const handleToggle = () => {
    const newState = !showPassword;
    setShowPassword(newState);
    if (onToggle) onToggle(newState);
  };

  return (
    <Pressable
      onPress={handleToggle}
      className="absolute right-3 top-1/2 -translate-y-1/2 mt-1"
    >
      {showPassword ? (
        <EyeOff size={20} color="#6b7280" /> // gray-500
      ) : (
        <Eye size={20} color="#6b7280" />
      )}
    </Pressable>
  );
}
