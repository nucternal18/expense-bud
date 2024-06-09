import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Image, Platform, ActivityIndicator } from "react-native";

import { Collapsible } from "@/components/Collapsible";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import useExpenseController from "@/hooks/useExpenseController";

export default function TabTwoScreen() {
  const { categories, isLoaded, form } = useExpenseController({ category: "", type: ""});
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <Ionicons size={310} name="code-slash" style={styles.headerImage} />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Settings</ThemedText>
      </ThemedView>

      {isLoaded ? (
        <ThemedView>
          <ActivityIndicator size="large" color="#0000ff" />
        </ThemedView>
      ) : (
        <Collapsible title="Categories">
          <ThemedText>
            This screen shows a list of categories. You can add, edit, or delete
            categories from the database.
          </ThemedText>
          {categories.map((category) => (
            <ThemedText key={category.id}>{category.name}</ThemedText>
          ))}
        </Collapsible>
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
});
