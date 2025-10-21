import {
  Image,
  TextInput,
  View,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Link, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import Svg, { Path } from "react-native-svg";
import { useAuthStore } from "@/store/auth/authStore"

const { height } = Dimensions.get("window");

export default function SignUp() {
  const { register , loading, error, needsVerification} = useAuthStore();
  const [fullName, setFullName] = useState("");
  const [checked, setChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const router = useRouter();
  const passwordInputRef = useRef<TextInput>(null);

  function onEmailSubmitEditing() {
    passwordInputRef.current?.focus();
  }

  useEffect(() => {
    if (needsVerification){
      router.push('/(auth)/signup/email-verification');
    }
  }, [needsVerification]);

  async function onSubmit() {
    if (!checked) return;
    try {
      await register({
        fullname: fullName,
        email,
        password,
        password_confirmation: confirmPassword,
      });
    } catch (error) {
      console.error("Registration failed:", error);
    }
  }

  return (
    <SafeAreaView className="flex-1 ">
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
              height: height * 1/3, // 30% of screen height
              width: "100%",
            }}
          />

          {/* --- FORM SECTION --- */}
          <View className="flex-1 items-center mt-[-7rem]"> 
            <Card className="bg-white border-muted-foreground/10 rounded-lg shadow-lg w-[90%] max-w-md p-2 py-2">
              <CardHeader className="items-center mt-3">
                <CardTitle className="text-primary text-xl">
                  Create your account
                </CardTitle>
                <CardDescription className="text-center">
                  Get started — sign up now!
                </CardDescription>
              </CardHeader>

              <CardContent className="gap-2.5 px-4">


                {/* Full Name */}
                <View className="gap-1">
                  <Label className="text-muted-foreground font-normal">
                    Full Name
                  </Label>
                  <Input
                    value={fullName}
                    onChangeText={setFullName}
                    placeholder="John Doe"
                    autoCapitalize="words"
                    returnKeyType="next"
                    onSubmitEditing={onEmailSubmitEditing}
                    className="border-muted-foreground/50 text-base h-12"
                  />
                </View>

                {/* Email */}
                <View className="gap-1">
                  <Label className="text-muted-foreground font-normal">
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
                    className="border-muted-foreground/50 text-base h-12"
                  />
                </View>

                {/* Password */}
                <View className="gap-1">
                  <Label className="text-muted-foreground font-normal">
                    Password
                  </Label>
                  <Input
                    value={password}
                    onChangeText={setPassword}
                    placeholder="•••••••••"
                    secureTextEntry
                    ref={passwordInputRef}
                    returnKeyType="send"
                    onSubmitEditing={onSubmit}
                    className="border-muted-foreground/50 text-base h-12"
                  />
                </View>

                {/* Confirm Password */}
                <View className="gap-1">
                  <Label className="text-muted-foreground font-normal">
                    Confirm Password
                  </Label>
                  <Input
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="•••••••••"
                    secureTextEntry
                    returnKeyType="send"
                    onSubmitEditing={onSubmit}
                    className="border-muted-foreground/50 text-base h-12"
                  />
                </View>

                {/* Terms */}
                <View className="flex-row items-center gap-2">
                  <Checkbox
                    checked={checked}
                    onCheckedChange={setChecked}
                    className="border-primary"
                  />
                  <Text className="text-xs text-muted-foreground flex-1">
                    By signing up, you agree to the{" "}
                    <Link href={"/signup/terms"}>
                    <Text className="text-primary text-xs font-medium">
                      Terms and Conditions
                    </Text>.
                    </Link>
                  </Text>
                </View>

                {/* Sign Up Button */}
                <Button
                  className="w-full"
                  disabled={!checked}
                  onPress={onSubmit}
                >
                  <Text className="text-base">Sign Up</Text>
                </Button>

                {/* Separator */}
                <View className="flex-row items-center">
                  <Separator className="flex-1 bg-muted-foreground/40" />
                  <Text className="px-3 text-base text-muted-foreground">or</Text>
                  <Separator className="flex-1 bg-muted-foreground/40" />
                </View>

                {/* Google Button */}
                <Button
                  variant="outline"
                  className="w-full flex-row items-center justify-center gap-2"
                  onPress={onSubmit}
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
                  <Text className="text-base text-secondary font-normal">
                    Register with Google
                  </Text>
                </Button>

                {/* Footer */}
                <Text className="text-center text-muted-foreground">
                  Already have an account?{" "}
                  <Link href="/login" asChild>
                    <Text className="text-primary text-base font-medium">Sign in</Text>
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
