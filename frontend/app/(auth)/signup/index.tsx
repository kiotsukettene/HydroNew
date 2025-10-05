import { Image, Pressable, TextInput, View } from "react-native";
import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Link, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Card,CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import Svg, { Path } from "react-native-svg";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checked, setChecked] = useState(false);


  const router = useRouter()

 
   const passwordInputRef = useRef<TextInput>(null);
 
  function onEmailSubmitEditing() {
    passwordInputRef.current?.focus();
  }
 
  function onSubmit() {
    // TODO: Submit form and navigate to protected screen if successful
    console.log("Signing up with:", email, password);
    router.push('/(auth)/first-time/welcome-first-time')
  }
  function onCheckedChange(checked: boolean) {
    setChecked(checked);
  }
 

  return (
    <View className="flex-1 bg-foreground">
      {/* Background image with fixed height */}
      <Image
        source={require('@/assets/images/sign-up-bg.png')}
        resizeMode="cover"
        className="w-full h-64"
      />
      
      {/* Card positioned on top of the image */}
      <SafeAreaView className="flex-1 justify-end items-center pb-8">
        <Card className="bg-white border-muted-foreground/20 rounded-md sm:border-border top-14 shadow-lg mx-3 w-[90%] ">
          <CardHeader className="items-center my-[-10px] gap-0">
            <CardTitle className="text-primary text-base">Create your account</CardTitle>
            <CardDescription className="text-[0.6rem]"> Get started — sign up now!
</CardDescription>
            
          </CardHeader>
          <CardContent className="gap-6">
            <View className="gap-3">
               <View className="gap-1">
                <Label htmlFor="fullname" className="text-muted-foreground font-light text-[0.6rem]">Full Name</Label>
                <Input
                  id="Fullname"
                  placeholder="John Doe"
                  keyboardType="default"
                  autoComplete="name"
                  autoCapitalize="words"
                  onSubmitEditing={onEmailSubmitEditing}
                  returnKeyType="next"
                  submitBehavior="submit"
                  className="border-muted-foreground/50"
                />
              </View>

              <View className="gap-1">
                <Label htmlFor="email" className="text-muted-foreground font-light text-[0.6rem]">Email</Label>
                <Input
                  id="email"
                  placeholder="m@example.com"
                  keyboardType="email-address"
                  autoComplete="email"
                  autoCapitalize="none"
                  onSubmitEditing={onEmailSubmitEditing}
                  returnKeyType="next"
                  submitBehavior="submit"
                  className="border-muted-foreground/50"
                />
              </View>

              <View className="gap-1">
                <View className="flex-row items-center">
                  <Label htmlFor="password" className="text-muted-foreground font-light text-[0.6rem]">Password</Label>
                </View>
                <Input
                  className="border-muted-foreground/50"
                  placeholder="•••••••••"
                  ref={passwordInputRef}
                  id="password"
                  secureTextEntry
                  returnKeyType="send"
                  onSubmitEditing={onSubmit}
                  
                />
              </View>

               <View className="gap-1">
                <View className="flex-row items-center">
                  <Label htmlFor="Confirm Password" className="text-muted-foreground font-light text-[0.6rem]">Confirm Password</Label>
                </View>
                <Input
                  className="border-muted-foreground/50"
                  placeholder="•••••••••"
                  ref={passwordInputRef}
                  id="Confirm Password"
                  secureTextEntry
                  returnKeyType="send"
                  onSubmitEditing={onSubmit}
                  
                />
              </View>

              <View className="flex-row items-center gap-2">
      <Checkbox
        aria-labelledby="terms-checkbox"
        id="terms-checkbox"
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="border-primary"
      />
      <Label
        nativeID="terms-checkbox"
        htmlFor="terms-checkbox"
        className="text-[0.5rem] text-muted-foreground font-light"
      >
        By signing up, you agree to the <Text className="text-primary text-[0.5rem] font-normal">Terms and Conditions</Text>.
      </Label>
    </View>

              
              <Button className="w-full" onPress={onSubmit}>
                <Text className="text-xs">Sign up</Text>
              </Button>


              <View className="flex-row items-center mb-[-7px] ">
              <Separator className="flex-1 bg-muted-foreground/50" />
              <Text className="text-muted-foreground px-4 text-xs">or</Text>
              <Separator className="flex-1 bg-muted-foreground/50" />
            </View>
            </View>

             
<Button
  variant="outline"
  className="w-full flex-row items-center justify-center space-x-2"
  onPress={onSubmit}
>
  {/* Google Icon */}
  <Svg width={20} height={20} viewBox="0 0 48 48">
    <Path fill="#4285F4" d="M23.49 12.27c1.69 0 3.21.58 4.41 1.7l3.28-3.28C28.96 8.34 26.45 7 23.49 7c-4.38 0-8.09 2.58-9.79 6.33l3.86 3c.93-2.79 3.54-4.72 6.93-4.72z"/>
    <Path fill="#34A853" d="M46.1 24.5c0-1.44-.13-2.82-.36-4.15H23.5v7.84h12.64c-.55 2.95-2.21 5.45-4.72 7.12l3.66 2.84c3.59-3.31 5.68-8.18 5.68-13.65z"/>
    <Path fill="#FBBC05" d="M13.71 28.42c-.45-1.35-.71-2.8-.71-4.29s.26-2.94.71-4.29l-3.86-3C8.72 19.44 8 21.92 8 24.5s.72 5.06 1.85 7.66l3.86-3z" />
    <Path fill="#EA4335" d="M23.49 41c3.39 0 6.24-1.12 8.32-3.04l-3.66-2.84c-1.05.7-2.41 1.12-4.66 1.12-3.39 0-6-1.93-6.93-4.72l-3.86 3C15.4 38.42 19.11 41 23.49 41z"/>
  </Svg>

  <Text className="text-xs text-secondary font-normal">
    Register With Google
  </Text>
</Button>

            
            <Text className="text-center text-xs  text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" asChild>
                <Text className="text-primary text-xs font-medium ">Sign in</Text>
              </Link>
            </Text>
            
          </CardContent>
        </Card>
      </SafeAreaView>
    </View>
  );
}
