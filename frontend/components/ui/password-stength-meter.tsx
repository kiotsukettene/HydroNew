import React, { useEffect, useState, useMemo } from "react";
import { View, Text, TextInput } from "react-native";
import { Input } from "./input";

interface PasswordStrengthMeterProps {
  password: string;
  minLength?: number;
  colors?: string[];
  levels?: number;
  customRequirements?: {
    label: string;
    test: (pass: string) => boolean;
  }[];
}


export function PasswordStrengthMeter({
  password,
  minLength = 8,
  colors = ["#dc2626", "#ea580c", "#16a34a", "#15803d"],
  levels = 4,
  customRequirements,
}: PasswordStrengthMeterProps) {
  const [strength, setStrength] = useState(0);
  const [requirementsMet, setRequirementsMet] = useState<boolean[]>([]);

  const defaultRequirements = useMemo(
    () => [
      {
        label: `At least ${minLength} characters`,
        test: (pass: string) => pass.length >= minLength,
      },
      { label: "Contains uppercase letter", test: (pass: string) => /[A-Z]/.test(pass) },
      { label: "Contains number", test: (pass: string) => /[0-9]/.test(pass) },
      { label: "Contains special character", test: (pass: string) => /[^A-Za-z0-9]/.test(pass) },
    ],
    [minLength]
  );

  const requirements = customRequirements ?? defaultRequirements;

  useEffect(() => {
    const met = requirements.map((req) => req.test(password));
    setRequirementsMet(met);

    const metCount = met.filter(Boolean).length;
    const level = Math.min(
      Math.floor((metCount / requirements.length) * levels),
      levels
    );
    setStrength(level);
  }, [password, requirements, levels]);

  return (
    <View className="space-y-3">
      {/* Strength Bar */}
      <View className="flex flex-row gap-1">
        {Array.from({ length: levels }).map((_, i) => (
          <View
            key={i}
            className="h-2 flex-1 rounded-full bg-muted"
            style={{
              backgroundColor: i < strength ? colors[strength - 1] : "#d1d5db",
            }}
          />
        ))}
      </View>

      {/* Criteria List */}
      <View className="pt-2">
        {requirements.map((req, i) => (
          <View key={req.label} className="flex flex-row items-center gap-2">
            <Text
              className={`text-sm ${
                requirementsMet[i] ? "text-success" : "text-muted-foreground/70"
              }`}
            >
              • {req.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export const PasswordStrengthMeterExample = () => {
  const [password, setPassword] = useState("");

  return (
    <View className="flex flex-col gap-4 w-full max-w-md border border-muted p-4 rounded-2xl shadow">
      <Input
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        className="w-full px-3 py-2 border border-muted  rounded-xl text-base"
        placeholder="Enter your password"
      />
      
      <PasswordStrengthMeter password={password} />
    </View>
  );
};
