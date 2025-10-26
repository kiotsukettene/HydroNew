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
import PasswordToggle from "@/app/hooks/password-toggle";
import { PasswordStrengthMeter } from '@/components/ui/password-stength-meter';
import { ZodError } from "zod";
import { signUpSchema } from "@/validators/authSchema";
import { handleAxiosError } from "@/api/handleAxiosError";

const { height } = Dimensions.get("window");

export default function SignUp() {
  const { register , fieldErrors, error, resetErrors, needsVerification} = useAuthStore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [checked, setChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const router = useRouter();
  const passwordInputRef = useRef<TextInput>(null);

  function onEmailSubmitEditing() {
    passwordInputRef.current?.focus();
  }

  useEffect(() => {
  resetErrors();
  }, [firstName, lastName, email, password, confirmPassword]);

  useEffect(() => {
    if (needsVerification) {
      router.push("/(auth)/signup/email-verification");
    }
  }, [needsVerification]);


async function onSubmit() {
  setSubmitted(true);
  resetErrors();

  try {
    const validatedData = signUpSchema.parse({
      first_name: firstName,
      last_name: lastName,
      email,
      password,
      password_confirmation: confirmPassword,
    });

    if (!checked) return;

    await register(validatedData);

  } catch (err: any) {
    if (err instanceof ZodError) {
      const newFieldErrors: Record<string, string[]> = {};
      for (const [field, messages] of Object.entries(err.flatten().fieldErrors)) {
        if (messages) newFieldErrors[field] = messages;
      }
      useAuthStore.setState({ fieldErrors: newFieldErrors });
    } else {
      const { message, fieldErrors } = handleAxiosError(err);
      useAuthStore.setState({ error: message, fieldErrors });
    }
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
          <View className="flex-1 items-center mt-[-10rem]"> 
            <Card className="bg-white border-muted-foreground/10 rounded-xl shadow-lg w-[90%] max-w-md p-2 py-2">
              <CardHeader className="items-center mt-3">
                <CardTitle className="text-primary text-xl">
                  Create your account
                </CardTitle>
                <CardDescription className="text-center">
                  Get started — sign up now!
                </CardDescription>
              </CardHeader>

              <CardContent className="gap-2.5 px-4">


                {/* First Name */}
                <View className="gap-1">
                  <Label className="text-muted-foreground font-normal">
                    First Name
                  </Label>
                  <Input
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholder="John"
                    autoCapitalize="words"
                    returnKeyType="next"
                    onSubmitEditing={onEmailSubmitEditing}
                    className={`border ${fieldErrors.first_name ? 'border-red-500' : 'border-muted-foreground/50'} text-base`}
                  />
                    {fieldErrors.first_name && (
                      <Text className="text-destructive text-sm">{fieldErrors.first_name[0]}</Text>
                    )}
                </View>

                {/* Last Name */}
                <View className="gap-1">
                  <Label className="text-muted-foreground font-normal">
                    Last Name
                  </Label>
                  <Input
                    value={lastName}
                    onChangeText={setLastName}
                    placeholder="Doe"
                    autoCapitalize="words"
                    returnKeyType="next"
                    onSubmitEditing={onEmailSubmitEditing}
                    className={`border ${fieldErrors.last_name ? 'border-red-500' : 'border-muted-foreground/50'} text-base`}
                  />
                  {fieldErrors.last_name && (
                    <Text className="text-destructive text-sm">{fieldErrors.last_name[0]}</Text>
                  )}
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
                    className={`border ${fieldErrors.email ? 'border-red-500' : 'border-muted-foreground/50'} text-base`}
                  />
                  {fieldErrors.email && (
                    <Text className="text-destructive text-sm">{fieldErrors.email[0]}</Text>
                  )}
                </View>

                {/* Password */}
                <View className="gap-1">
                  <Label className="text-muted-foreground font-normal">
                    Password
                  </Label>
                  <View className="relative">
                    <Input
                      value={password}
                      onChangeText={(text) => {
                        setPassword(text);
                        if (submitted) setSubmitted(false);
                      }}
                      placeholder="•••••••••"
                      secureTextEntry={!showPassword}
                      ref={passwordInputRef}
                      returnKeyType="send"
                      onSubmitEditing={onSubmit}
                      className={`border ${fieldErrors.password ? 'border-red-500' : 'border-muted-foreground/50'} text-base pr-12`}
                    />
                      <PasswordToggle onToggle={setShowPassword} initialState={showPassword} />
                  </View>
                </View>

                {/* Confirm Password */}
                <View className="gap-1">
                  <Label className="text-muted-foreground font-normal">
                    Confirm Password
                  </Label>
                  <View className="relative mt-2">
                    <Input
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      placeholder="•••••••••"
                      secureTextEntry={!showConfirmPassword}
                      returnKeyType="send" 
                      onSubmitEditing={onSubmit}
                      className={`border text-base pr-12 ${
                              submitted && confirmPassword !== password
                                ? 'border-red-500'
                                : 'border-muted-foreground/50'
                            }`}
                    />
                    <PasswordToggle onToggle={setShowConfirmPassword} initialState={showConfirmPassword} />
                  </View>
                    {submitted && confirmPassword !== password && (
                      <Text className="text-sm text-destructive">
                        Passwords do not match
                      </Text>
                    )}
                  <PasswordStrengthMeter password={password} />
                </View>

                {/* Terms */}
                <View className="flex-row items-center gap-2 mt-1">
                  <Checkbox
                    checked={checked}
                    onCheckedChange={setChecked}
                    className="border-primary"
                  />
                  <Text className="text-sm text-muted-foreground flex-1">
                    By signing up, you agree to the{" "}
                    <Link href={"/signup/terms"}>
                    <Text className="text-primary text-sm font-medium">
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
