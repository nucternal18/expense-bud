import { View, ViewStyle } from "react-native";
import { ThemedView } from "../ThemedView";

interface CardProps extends React.PropsWithChildren {
  style?: ViewStyle;
}

export default function Card({ children, style = {} }: CardProps) {
  return (
    <ThemedView
      style={{
        padding: 15,
        borderRadius: 15,
        backgroundColor: "#007BFF20",
        elevation: 8,
        shadowColor: "#000",
        shadowRadius: 8,
        shadowOffset: { height: 6, width: 0 },
        shadowOpacity: 0.15,
        ...style,
      }}
    >
      {children}
    </ThemedView>
  );
}
