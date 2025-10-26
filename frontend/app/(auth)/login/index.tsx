import {
  Image,
  TextInput,
  View,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Link, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Svg, { Path } from "react-native-svg";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuthStore } from "@/store/auth/authStore";
import PasswordToggle from "@/app/hooks/password-toggle";
import { loginSchema } from "@/validators/authSchema";
import { ZodError } from "zod";

const { height } = Dimensions.get("window");

export default function Login() {
  const login = useAuthStore((state) => state.login);
  const user = useAuthStore((state) => state.user);
  const error = useAuthStore((state) => state.error);
  const resetErrors = useAuthStore((state) => state.resetErrors);
  const needsVerification = useAuthStore((state) => state.needsVerification);
  const [zodErrors, setZodErrors] = useState<{ email?: string; password?: string }>({});

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checked, setChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const passwordInputRef = useRef<TextInput>(null);

  function onEmailSubmitEditing() {
    passwordInputRef.current?.focus();
  }

  useEffect(() => {
    if (error) resetErrors();
    setZodErrors({});
  }, [email, password]);

  useEffect(() => {
    if (!user) return;
    if (needsVerification) {
      router.push("/(auth)/signup/email-verification");
    } else {
      router.push("/(tabs)/home");
    }
  }, [user, needsVerification]);

  function getInputBorderStyle(field: "email" | "password") {
  if (zodErrors[field]) return "border-red-500"; 
  if (error) return "border-red-500";   
  return "border-muted-foreground/50";   
}

  async function onSubmit() {
    try {
      resetErrors();
      setZodErrors({});
      const validated = loginSchema.parse({ email, password });
      await login(validated.email, validated.password);
    } catch (err) {
      if (err instanceof ZodError) {
        const fieldErrors: any = {};
        err.errors.forEach((e) => {
          if (e.path.length > 0) {
            fieldErrors[e.path[0]] = e.message;
          }
        });
        setZodErrors(fieldErrors);
      }
    }
  }


  return (
    <SafeAreaView className="flex-1">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          {/* --- TOP IMAGE --- */}
          <Image
            source={require("@/assets/images/sign-up-bg.png")}
            resizeMode="cover"
            style={{
              height: (height * 1) / 3,
              width: "100%",
            }}
          />

          {/* --- FORM SECTION --- */}
          <View className="mt-[-10rem] flex-1 items-center">
            <Card className="w-[90%] max-w-md rounded-lg border-muted-foreground/10 bg-white p-2 shadow-lg">
              <View>
                <Image
                  source={require("@/assets/images/Logo.png")}
                  resizeMode="contain"
                  className="mx-auto mt-3 size-16"
                />
              </View>

              <CardHeader className="items-center">
                <CardTitle className="text-3xl text-primary">Login</CardTitle>
                <CardDescription className="text-center text-md">
                  Welcome back! Let’s get growing.
                </CardDescription>
              </CardHeader>

              <CardContent className="gap-2.5 px-4">
                {/* --- error message --- */}
                {error && (
                  <Text className="text-center text-red-500 font-medium">
                    {error}
                  </Text>
                )}

                {/* Email */}
                <View className="gap-1">
                  <Label className="font-normal text-muted-foreground">
                    Email
                  </Label>
                  <Input
                    value={email}
                    onChangeText={setEmail}
                    placeholder="m@example.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    returnKeyType="next"
                    onSubmitEditing={onEmailSubmitEditing}
                    className={`border text-base h-12 ${getInputBorderStyle("email")}`}
                  />
                  {zodErrors.email && (
                    <Text className="text-destructive text-sm">{zodErrors.email}</Text>
                  )}
                </View>

                {/* Password */}
                <View className="gap-1">
                  <Label className="font-normal text-muted-foreground">
                    Password
                  </Label>
                  <View className="relative">
                    <Input
                      placeholder="•••••••••"
                      returnKeyType="send"
                      onSubmitEditing={onSubmit}
                      className={`border text-base h-12 pr-12 ${getInputBorderStyle("password")}`}
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                    />
                    <PasswordToggle
                      onToggle={setShowPassword}
                      initialState={showPassword}
                    />
                  </View>
                  {zodErrors.password && (
                    <Text className="text-destructive text-sm">{zodErrors.password}</Text>
                  )}
                  <View className="mb-2 mt-3 flex-row items-center justify-between">
                    {/* Remember Me */}
                    <View className="flex-row items-center justify-center gap-2">
                      <Checkbox
                        checked={checked}
                        onCheckedChange={setChecked}
                        className="border-primary"
                      />
                      <Text className="self-end text-muted-foreground">
                        Remember me?
                      </Text>
                    </View>
                    <Link href="/forgot-password">
                      <Text className="self-end text-primary/70">
                        Forgot Password
                      </Text>
                    </Link>
                  </View>
                </View>

                {/* LOGIN Button */}
                <Button className="w-full" onPress={onSubmit}>
                  <Text>Login</Text>
                </Button>

                {/* Separator */}
                <View className="flex-row items-center mt-2">
                  <Separator className="flex-1 bg-muted-foreground/40" />
                  <Text className="px-3 text-muted-foreground">or</Text>
                  <Separator className="flex-1 bg-muted-foreground/40" />
                </View>

                {/* Google Button */}
                <Button
                  variant="outline"
                  className="w-full flex-row items-center justify-center gap-2 mt-2"
                >
                  <Svg width={20} height={20} viewBox="0 0 48 48">
                    <Path
                      fill="#4285F4"
                      d="M23.49 12.27c1.69 0 3.21.58 4.41 1.7l3.28-3.28C28.96 8.34 26.45 7 23.49 7c-4.38 0-8.09 2.58-9.79 6.33l3.86 3c.93-2.79 3.54-4.72 6.93-4.72z"
                    />
                    <Path
                      fill="#34A853"
                      d="M46.1 24.5c0-1.44-.13-2.82-.36-4.15H23.5v7.84h12.64c-.55 2.95-2.21 5.45-4.72 7.12l3.66 2.84c3.59-3.31 5.68-8.18 5.68-13.65z"
                    />
                    <Path
                      fill="#FBBC05"
                      d="M13.71 28.42c-.45-1.35-.71-2.8-.71-4.29s.26-2.94.71-4.29l-3.86-3C8.72 19.44 8 21.92 8 24.5s.72 5.06 1.85 7.66l3.86-3z"
                    />
                    <Path
                      fill="#EA4335"
                      d="M23.49 41c3.39 0 6.24-1.12 8.32-3.04l-3.66-2.84c-1.05.7-2.41 1.12-4.66 1.12-3.39 0-6-1.93-6.93-4.72l-3.86 3C15.4 38.42 19.11 41 23.49 41z"
                    />
                  </Svg>
                  <Text className="font-normal text-secondary">
                    Login with Google
                  </Text>
                </Button>

                {/* Footer */}
                <Text className="mt-2 text-center text-muted-foreground">
                  Doesn't have an account?{" "}
                  <Link href="/signup" asChild>
                    <Text className="font-medium text-primary">Sign up</Text>
                  </Link>
                </Text>
              </CardContent>
            </Card>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
