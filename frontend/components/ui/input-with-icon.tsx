import { cn } from '@/lib/utils';
import { Platform, TextInput, View, Pressable, type TextInputProps } from 'react-native';
import React from 'react';

interface InputProps extends TextInputProps {
  rightIcon?: React.ReactNode;
  onIconPress?: () => void;
  secureTextEntry?: boolean;
}

function InputWithIcon({
  className,
  placeholderClassName,
  rightIcon,
  onIconPress,
  secureTextEntry,
  ...props
}: InputProps & React.RefAttributes<TextInput>) {
  return (
    <View className="flex-row items-center">
      <TextInput
        secureTextEntry={secureTextEntry}
        className={cn(
          'border-muted-foreground bg-transparent text-muted text-base flex h-10 w-full min-w-0 flex-row items-center rounded-xl border px-3 py-1 leading-5 shadow-sm sm:h-9',
          props.editable === false &&
            cn(
              'opacity-50',
              Platform.select({
                web: 'disabled:pointer-events-none disabled:cursor-not-allowed',
              })
            ),
          Platform.select({
            web: cn(
              'placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground outline-none transition-[color,box-shadow] md:text-sm',
              'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
              'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive'
            ),
            native: 'placeholder:text-muted-foreground/50 text-[0.7rem]',
          }),
          className
        )}
        {...props}
      />
      {rightIcon && (
        <Pressable
          onPress={onIconPress}
          className="absolute right-3 p-1"
          hitSlop={8}
        >
          {rightIcon}
        </Pressable>
      )}
    </View>
  );
}

export { InputWithIcon };
