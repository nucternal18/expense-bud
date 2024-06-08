import { Image, StyleSheet, Platform, ActivityIndicator } from "react-native";

import TransactionList from "@/components/TransactionsList";
import Card from "@/components/ui/Card";
import AddTransaction from "@/components/AddTransaction";
import { DollarIcon } from "@/components/DollarIcon";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import useExpenseController from "@/hooks/useExpenseController";
import TransactionSummary from "@/components/TransactionSummary";

export default function HomeScreen() {
  const {
    isLoaded,
    categories,
    transactions,
    transactionsByMonth,
    deleteTransaction,
  } = useExpenseController();


  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/andre-francois-mckenzie.jpg")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Expense Bud</ThemedText>
        <DollarIcon />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <AddTransaction />
      </ThemedView>
      {isLoaded ? (
        <ThemedView>
          <ActivityIndicator size="large" color="#0000ff" />
        </ThemedView>
      ) : (
        <>
          <ThemedView style={styles.stepContainer}>
            <TransactionSummary
              totalExpenses={transactionsByMonth.totalExpenses}
              totalIncome={transactionsByMonth.totalIncome}
            />
          </ThemedView>

          <ThemedView style={styles.stepContainer}>
            <TransactionList
              categories={categories}
              transactions={transactions}
              deleteTransaction={deleteTransaction}
            />
          </ThemedView>
        </>
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 250,
    width: '100%',
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
