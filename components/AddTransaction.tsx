import * as React from "react";
import {
  Button,
  FlatList,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Controller } from "react-hook-form";
import * as z from "zod";

import Card from "./ui/Card";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import useExpenseController from "@/hooks/useExpenseController";

export default function AddTransaction() {
  const [typeSelected, setTypeSelected] = React.useState<string>("");

  const {
    handleSave,
    form,
    categories,
    currentTab,
    isAddingTransaction,
    setIsAddingTransaction,
    setCurrentTab,
    setCategoryId,
    setCategory,
  } = useExpenseController();

  return (
    <View style={{ marginBottom: 15 }}>
      {isAddingTransaction ? (
        <View>
          <Card>
            <Controller
              control={form.control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="$Amount"
                  style={{
                    fontSize: 32,
                    marginBottom: 15,
                    fontWeight: "bold",
                    color: "#fff",
                  }}
                  keyboardType="numeric"
                  onChangeText={onChange}
                  value={value}
                  onBlur={onBlur}
                />
              )}
              name="amount"
            />
            <Controller
              control={form.control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="Description"
                  style={{ marginBottom: 15, color: "#fff" }}
                  onChangeText={onChange}
                  value={value}
                  onBlur={onBlur}
                />
              )}
              name="description"
            />

            <FlatList
              data={categories}
              ListHeaderComponent={
                <>
                  <Text style={{ marginBottom: 6, color: "gray" }}>
                    Select a entry type
                  </Text>
                  <SegmentedControl
                    values={["Expense", "Income"]}
                    style={{ marginBottom: 15 }}
                    selectedIndex={currentTab}
                    onChange={(event) => {
                      setCurrentTab(event.nativeEvent.selectedSegmentIndex);
                      setCategory(
                        event.nativeEvent.selectedSegmentIndex === 0
                          ? "Expense"
                          : "Income"
                      );
                    }}
                  />
                </>
              }
              keyExtractor={(item) => `${item.name}-${item.id}`}
              renderItem={({ item }) => (
                <CategoryButton
                  setCategoryId={setCategoryId}
                  id={item.id}
                  title={item.name}
                  isSelected={typeSelected === item.name}
                  setTypeSelected={setTypeSelected}
                />
              )}
              ListFooterComponent={
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                  }}
                >
                  <Button
                    title="Cancel"
                    color="red"
                    onPress={() => setIsAddingTransaction(false)}
                  />
                  <Button
                    title="Save"
                    onPress={form.handleSubmit(handleSave)}
                  />
                </View>
              }
            />
          </Card>
        </View>
      ) : (
        <AddButton setIsAddingTransaction={setIsAddingTransaction} />
      )}
    </View>
  );
}

function CategoryButton({
  id,
  title,
  isSelected,
  setTypeSelected,
  setCategoryId,
}: {
  id: number;
  title: string;
  isSelected: boolean;
  setTypeSelected: React.Dispatch<React.SetStateAction<string>>;
  setCategoryId: React.Dispatch<React.SetStateAction<number>>;
}) {
  return (
    <View style={{ width: "100%", marginBottom: 5 }}>
      <View style={{ width: "100%", backgroundColor: "transparent" }}>
        <TouchableOpacity
          onPress={() => {
            setTypeSelected(title);
            setCategoryId(id);
          }}
          activeOpacity={0.6}
          style={{
            height: 40,
            width: "100%",

            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: isSelected ? "#007BFF20" : "#ffffff20",
            borderRadius: 15,
            marginBottom: 6,
          }}
        >
          <Text
            style={{
              fontWeight: "700",
              color: isSelected ? "#007BFF" : "#fff2dd",
              marginLeft: 5,
            }}
          >
            {title}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function AddButton({
  setIsAddingTransaction,
}: {
  setIsAddingTransaction: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <TouchableOpacity
      onPress={() => setIsAddingTransaction(true)}
      activeOpacity={0.6}
      style={{
        height: 40,
        flexDirection: "row",
        alignItems: "center",

        justifyContent: "center",
        backgroundColor: "#007BFF20",
        borderRadius: 15,
      }}
    >
      <MaterialIcons name="add-circle-outline" size={24} color="#007BFF" />
      <Text style={{ fontWeight: "700", color: "#007BFF", marginLeft: 5 }}>
        New Entry
      </Text>
    </TouchableOpacity>
  );
}
