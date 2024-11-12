import React, { useState, useContext, useRef } from "react";
import { style } from "./styles";
import { Ball } from "../../components/Ball";
import { Input } from "../../components/Input";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { Flag } from "../../components/flag";
import { themas } from "../../global/themes";
import { AuthContextList } from "../../context/authContext_list";
import { Text, View, StatusBar, FlatList, TouchableOpacity } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { formatDateToBR } from "../../global/funtions";

export default function List() {
   const { taskList, handleDelete, handleEdit, filter } = useContext<AuthContextType>(AuthContextList);

   const swipeableRefs = useRef<Array<Swipeable | null>>([]);

   const renderRightActions = () => (
      <View style={style.Button}>
         <AntDesign name="delete" size={20} color={"#FFF"} />
      </View>
   );

   const renderLeftActions = () => (
      <View style={[style.Button, { backgroundColor: themas.Colors.blueLigth }]}>
         <AntDesign name="edit" size={20} color={"#FFF"} />
      </View>
   );

   const handleSwipeOpen = (direction: "left" | "right", item: PropCard, index: number) => {
      if (direction === "right") {
         handleDelete(item);
         swipeableRefs.current[index]?.close();
      } else if (direction === "left") {
         handleEdit(item);
         swipeableRefs.current[index]?.close();
      }
   };

   const _renderCard = (item: PropCard, index: number) => {
      const color = item.flag == "opcional" ? themas.Colors.blueLigth : themas.Colors.red;
      return (
         <Swipeable
            ref={(ref) => (swipeableRefs.current[index] = ref)}
            key={item.item}
            renderRightActions={renderRightActions}
            renderLeftActions={renderLeftActions}
            onSwipeableOpen={(direction) => handleSwipeOpen(direction, item, index)}
         >
            <View style={style.card}>
               <View style={style.rowCard}>
                  <View style={style.rowCardLeft}>
                     <Ball color={color} />
                     <View>
                        <Text style={style.titleCard}>{item.title}</Text>
                        <Text style={style.descriptionCard} numberOfLines={1}>
                           {item.description}
                        </Text>
                        <Text style={style.descriptionCard}>até {formatDateToBR(item.timeLimit) }</Text>
                     </View>
                  </View>
                  <View style={style.rowCardRight}>
                     <TouchableOpacity style={style.button} onPress={() => handleDelete(item)}>
                        <Text style={style.ButtonText}>X</Text>
                     </TouchableOpacity>
                     <Flag caption={item.flag} color={color} />
                  </View>
               </View>
            </View>
         </Swipeable>
      );
   };

   return (
      <View style={style.container}>
         <StatusBar barStyle="light-content" />
         <View style={style.header}>
            <Text style={style.greeting}>
               Bom dia , <Text style={{ fontWeight: "bold" }}>Victor Rony.</Text>
            </Text>
            <View style={style.boxInput}>
               <Input IconLeft={MaterialIcons} iconLeftName="search" onChangeText={(t) => filter(t)} />
            </View>
         </View>
         <View style={style.boxList}>
            <FlatList
               data={taskList}
               style={{ marginTop: 40, paddingHorizontal: 30 }}
               keyExtractor={(item, index) => item.item.toString()}
               renderItem={({ item, index }) => {
                  return _renderCard(item, index);
               }}
            />
         </View>
      </View>
   );
}
