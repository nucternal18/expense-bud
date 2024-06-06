import { Image, StyleSheet, Platform } from 'react-native';

import TransactionList from "@/components/TransactionsList";
import Card from "@/components/ui/Card";
import AddTransaction from "@/components/AddTransaction";
import { DollarIcon } from '@/components/DollarIcon';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import useExpenseController from '@/hooks/useExpenseController';
import TransactionSummary from '@/components/TransactionSummary';

export default function HomeScreen() {
  const {
    categories,
    transactions,
    transactionsByMonth,
    deleteTransaction,
    insertTransaction,
  } = useExpenseController();
  
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
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
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
