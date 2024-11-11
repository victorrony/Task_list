import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { themas } from "../global/themes";
import { Flag } from "../components/flag";
import { Input } from "../components/Input";
import { Modalize } from "react-native-modalize";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomDateTimePicker from "../components/CustomDateTimePicker";
import { TouchableOpacity, Text, View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Loading } from "../components/Loading";

export const AuthContextList: any = createContext({});

const flags = [
   { caption: "urgente", color: themas.Colors.red },
   { caption: "opcional", color: themas.Colors.blueLigth },
];

interface AuthProviderListProps {
   children: React.ReactNode;
}

export const AuthProviderList = (props: AuthProviderListProps) => {
   const modalizeRef = useRef<Modalize>(null);
   const [title, setTitle] = useState("");
   const [description, setDescription] = useState("");
   const [selectedFlag, setSelectedFlag] = useState("urgente");
   const [selectedDate, setSelectedDate] = useState(new Date());
   const [selectedTime, setSelectedTime] = useState(new Date());
   const [showDatePicker, setShowDatePicker] = useState(false);
   const [showTimePicker, setShowTimePicker] = useState(false);
   const [taskList, setTaskList] = useState([]);
   const [taskListBackup, setTaskListBackup] = useState([]);
   const [item, setItem] = useState(0);
   const [loading, setLoading] = useState(false);

   const onOpen = () => {
      modalizeRef.current?.open();
   };

   const onClose = () => {
      modalizeRef.current?.close();
   };

   useEffect(() => {
      get_taskList();
   }, []);

   const handleDateChange = (date: Date) => {
      setSelectedDate(date);
   };

   const handleTimeChange = (date: Date) => {
      setSelectedTime(date);
   };
   const handleSave = async () => {
      const newItem = {
         item: item !== 0 ? item : Date.now(),
         title,
         description,
         flag: selectedFlag,
         timeLimit: new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
            selectedTime.getHours(),
            selectedTime.getMinutes()
         ).toISOString(),
      };
      onClose();

      try {
         setLoading(true);
         const storedData = await AsyncStorage.getItem("taskList");
         let taskList = storedData ? JSON.parse(storedData) : [];

         // Verifica se o item já existe no array
         const itemIndex = taskList.findIndex((task: any) => task.item === newItem.item);

         if (itemIndex >= 0) {
            // Substitui o item existente pelo novo
            taskList[itemIndex] = newItem;
         } else {
            // Adiciona o novo item ao array
            taskList.push(newItem);
         }

         await AsyncStorage.setItem("taskList", JSON.stringify(taskList));
         setTaskList(taskList);
         setTaskListBackup(taskList);
         setData();
      } catch (error) {
         console.error("Erro ao salvar o item:", error);
         onOpen();
      } finally {
         setLoading(false);
      }
   };

   const filter = (t: string) => {
      if (taskList.length == 0) return;
      const array = taskListBackup;
      const campos = ["title", "description"];
      if (t) {
         const searchTerm = t.trim().toLowerCase();

         const filteredArr = array.filter((item) => {
            for (let i = 0; i < campos.length; i++) {
               const field = item[campos[i].trim()] as string;
               if (field.trim().toLowerCase().includes(searchTerm)) return true;
            }
         });

         setTaskList(filteredArr);
      } else {
         setTaskList(array);
      }
   };

   const handleEdit = async (itemToEdit: PropCard) => {
      setTitle(itemToEdit.title);
      setDescription(itemToEdit.description);
      setSelectedFlag(itemToEdit.flag);
      setItem(itemToEdit.item);

      const timeLimit = new Date(itemToEdit.timeLimit);
      setSelectedDate(timeLimit);
      setSelectedTime(timeLimit);

      onOpen();
   };

   const handleDelete = async (itemToDelete: { item: number }) => {
      try {
         setLoading(true);
         const storedData = await AsyncStorage.getItem("taskList");
         const taskList = storedData ? JSON.parse(storedData) : [];

         const updatedTaskList = taskList.filter((item: { item: number }) => item.item !== itemToDelete.item);

         await AsyncStorage.setItem("taskList", JSON.stringify(updatedTaskList));
         setTaskList(updatedTaskList);
         setTaskListBackup(updatedTaskList);
      } catch (error) {
         console.error("Erro ao excluir o item:", error);
      } finally {
         setLoading(false);
      }
   };

   async function get_taskList() {
      try {
         setLoading(true);
         const storedData = await AsyncStorage.getItem("taskList");
         const taskList = storedData ? JSON.parse(storedData) : [];
         setTaskList(taskList);
         setTaskListBackup(taskList);
      } catch (error) {
         console.log(error);
      } finally {
         setLoading(false);
      }
   }

   const _renderFlags = () => {
      return flags.map((item, index) => (
         <TouchableOpacity
            key={index}
            onPress={() => {
               setSelectedFlag(item.caption);
            }}
         >
            <Flag caption={item.caption} color={item.color} selected={item.caption == selectedFlag} />
         </TouchableOpacity>
      ));
   };

   const setData = () => {
      setTitle("");
      setDescription("");
      setSelectedFlag("urgente");
      setItem(0);
      setSelectedDate(new Date());
      setSelectedTime(new Date());
   };

   const _container = () => {
      return (
         <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
         >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
               <View style={styles.header}>
                  <TouchableOpacity onPress={() => onClose()}>
                     <MaterialIcons name="close" size={30} />
                  </TouchableOpacity>
                  <Text style={styles.title}>{item != 0 ? "Editar tarefa" : "Criar tarefa"}</Text>
                  <TouchableOpacity onPress={handleSave}>
                     <AntDesign name="check" size={30} />
                  </TouchableOpacity>
               </View>
               <View style={styles.content}>
                  <Input title="Título:" labelStyle={styles.label} value={title} onChangeText={setTitle} />
                  <Input
                     title="Descrição:"
                     numberOfLines={5}
                     height={100}
                     multiline
                     labelStyle={styles.label}
                     textAlignVertical="top"
                     value={description}
                     onChangeText={setDescription}
                  />
                  <View style={{ width: "100%", flexDirection: "row", gap: 10 }}>
                     <TouchableOpacity onPress={() => setShowDatePicker(true)} style={{ width: 200, zIndex: 999 }}>
                        <Input
                           title="Data limite:"
                           labelStyle={styles.label}
                           editable={false}
                           value={selectedDate.toLocaleDateString()}
                           onPress={() => setShowDatePicker(true)}
                        />
                     </TouchableOpacity>
                     <TouchableOpacity onPress={() => setShowDatePicker(true)} style={{ width: 100 }}>
                        <Input
                           title="Hora limite:"
                           labelStyle={styles.label}
                           editable={false}
                           value={selectedTime.toLocaleTimeString()}
                           onPress={() => setShowTimePicker(true)}
                        />
                     </TouchableOpacity>
                  </View>

                  <CustomDateTimePicker
                     type="date"
                     onDateChange={handleDateChange}
                     show={showDatePicker}
                     setShow={setShowDatePicker}
                  />
                  <CustomDateTimePicker
                     type="time" // Mude para 'time' aqui
                     onDateChange={handleTimeChange}
                     show={showTimePicker} // Use showTimePicker aqui
                     setShow={setShowTimePicker} // Use setShowTimePicker aqui
                  />

                  <View style={styles.containerFlag}>
                     <Text style={styles.flag}>Flags:</Text>
                     <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>{_renderFlags()}</View>
                  </View>
               </View>
            </ScrollView>
         </KeyboardAvoidingView>
      );
   };

   return (
      <AuthContextList.Provider value={{ onOpen, taskList, handleEdit, handleDelete, taskListBackup, filter }}>
         <Loading loading={loading} />
         {props.children}
         <Modalize ref={modalizeRef} childrenStyle={{ height: 600 }} adjustToContentHeight={true}>
            {_container()}
         </Modalize>
      </AuthContextList.Provider>
   );
};

export const styles = StyleSheet.create({
   container: {
      width: "100%",
   },
   header: {
      width: "100%",
      height: 40,
      paddingHorizontal: 40,
      flexDirection: "row",
      marginTop: 20,
      justifyContent: "space-between",
      alignItems: "center",
   },
   title: {
      fontSize: 20,
      fontWeight: "bold",
   },
   content: {
      width: "100%",
      paddingHorizontal: 20,
   },
   label: {
      fontWeight: "bold",
      color: "#000",
   },
   containerFlag: {
      width: "100%",
      padding: 10,
   },
   flag: {
      fontSize: 14,
      fontWeight: "bold",
   },
});

export const useAuth = () => useContext(AuthContextList);
