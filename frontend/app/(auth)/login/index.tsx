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
import { toast } from "sonner-native"
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useCallback } from "react";
import { useFocusEffect } from "expo-router";

const { height } = Dimensions.get("window");

export default function Login() {
  const login = useAuthStore((state) => state.login);
  const user = useAuthStore((state) => state.user);
  const error = useAuthStore((state) => state.error);
  const resetErrors = useAuthStore((state) => state.resetErrors);
  const loading = useAuthStore((state) => state.loading);
  const needsVerification = useAuthStore((state) => state.needsVerification);
  const setUserEmail = useAuthStore((state) => state.setUserEmail);
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

  const toastShown = useRef (false);

  useFocusEffect(
    useCallback(() => {
      resetErrors();  
      setZodErrors({});
      setEmail("");
      setPassword("");
    }, [])
  );

  useEffect(() => {
      if (error) resetErrors();
        setZodErrors({});
      }, [email, password]);


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
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(validated.email)) {
        setZodErrors({ email: "Please enter a valid email address" });
        return;
      }
      const response = await login(validated.email, validated.password);

      if (!response) {
        return;
      }
      if (response?.needs_verification) {
        // Set the email in store for the verification page
        setUserEmail(validated.email);
        router.push("/(auth)/signup/email-verification");
        return;
      }
      toast.success("Logged in successfully!");
      router.replace("/(tabs)/home");

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
    <SafeAreaView className="flex-1 bg-background">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
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
                  <View>
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
                      <Text className="text-destructive text-sm mt-1">{zodErrors.password}</Text>
                    )}
                    <View className="mb-2 mt-3 flex items-end justify-end">
                      {/* Remember Me */}
                      {/* <View className="flex-row items-center justify-center gap-2">
                        <Checkbox
                          checked={checked}
                          onCheckedChange={setChecked}
                          className="border-primary"
                        />
                        <Text className="self-end text-muted-foreground">
                          Remember me?
                        </Text>
                      </View> */}
                      <Link href="/forgot-password">
                        <Text className="self-end text-primary/70">
                          Forgot Password
                        </Text>
                      </Link>
                    </View>
                  </View>

                  {/* LOGIN Button */}
                  <Button 
                    className="w-full" 
                    onPress={onSubmit}
                    disabled={loading}
                  >
                    {loading ? <Text>Logging in...</Text> : <Text>Login</Text>}
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