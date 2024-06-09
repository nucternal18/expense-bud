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
    isAddingCategory,
    setIsAddingCategory,

  } = useExpenseController();

  return (
    <View style={{ marginBottom: 15 }}>
      {isAddingCategory ? (
        <View>
          <Card>
            <Controller
              control={form.control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="Category"
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
              name="category"
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

          </Card>
        </View>
      ) : (
        <AddButton setIsAddingCategory={setIsAddingCategory} />
      )}
    </View>
  );
}


function AddButton({
  setIsAddingCategory,
}: {
  setIsAddingCategory: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <TouchableOpacity
      onPress={() => setIsAddingCategory(true)}
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
