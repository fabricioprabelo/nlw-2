import React, { useState, FormEvent, useEffect } from "react";
import { View, Text, ScrollView, TextInput } from "react-native";
import styles from "./styles";
import PageHeader from "../../components/PageHeader";
import TeacherItem, { Teacher } from "../../components/TacherItem";
import { BorderlessButton, RectButton } from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons";
import apiService from "../../services/apiService";
import AsyncStorage from "@react-native-community/async-storage";
import { useFocusEffect } from "@react-navigation/native";

function TeacherList() {
    const [teachers, setTeachers] = useState([]);
    const [favorites, setFavorites] = useState<number[]>([]);
    const [subject, setSubject] = useState("");
    const [week_day, setWeekDay] = useState("");
    const [time, setTime] = useState("");
    const [isFiltersVisible, setIsFiltersVisible] = useState(false);
    function loadFavorites() {
        AsyncStorage.getItem("favorites").then((res) => {
            if (res) {
                const favoritedTeachers = JSON.parse(res);
                const favoritedTeachersIds = favoritedTeachers.map(
                    (teacher: Teacher) => {
                        return teacher.id;
                    }
                );
                setFavorites(favoritedTeachersIds);
            }
        });
    }
    function handleToggleFilterVisible() {
        setIsFiltersVisible(!isFiltersVisible);
    }
    async function handleFilterSubmit() {
        const response = await apiService.get("classes", {
            params: {
                subject,
                week_day,
                time,
            },
        });
        setIsFiltersVisible(false);
        loadFavorites();
        setTeachers(response.data);
    }
    useFocusEffect(() => {
        loadFavorites();
    });
    return (
        <View style={styles.container}>
            <PageHeader
                title="Proffys disponíveis"
                headerRight={
                    <BorderlessButton onPress={handleToggleFilterVisible}>
                        <Feather name="filter" size={20} color="#fff" />
                    </BorderlessButton>
                }
            >
                {isFiltersVisible && (
                    <View style={styles.searchForm}>
                        <Text style={styles.label}>Matéria</Text>
                        <TextInput
                            style={styles.input}
                            value={subject}
                            onChangeText={(text) => {
                                setSubject(text);
                            }}
                            placeholderTextColor="#c1bccc"
                            placeholder="Qual a matéria?"
                        />
                        <View style={styles.inputGroup}>
                            <View style={styles.inputBlock}>
                                <Text style={styles.label}>Dia da semana</Text>
                                <TextInput
                                    style={styles.input}
                                    value={week_day}
                                    onChangeText={(text) => {
                                        setWeekDay(text);
                                    }}
                                    placeholderTextColor="#c1bccc"
                                    placeholder="Qual o dia?"
                                />
                            </View>
                            <View style={styles.inputBlock}>
                                <Text style={styles.label}>Horário</Text>
                                <TextInput
                                    style={styles.input}
                                    value={time}
                                    onChangeText={(text) => {
                                        setTime(text);
                                    }}
                                    placeholderTextColor="#c1bccc"
                                    placeholder="Qual horário?"
                                />
                            </View>
                        </View>
                        <RectButton
                            onPress={handleFilterSubmit}
                            style={styles.submitButton}
                        >
                            <Text style={styles.submitButtonText}>Filtrar</Text>
                        </RectButton>
                    </View>
                )}
            </PageHeader>
            <ScrollView
                style={styles.teacherList}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingBottom: 16,
                }}
            >
                {teachers.map((teacher: Teacher) => {
                    return (
                        <TeacherItem
                            teacher={teacher}
                            favorited={favorites.includes(teacher.id)}
                            key={teacher.id}
                        />
                    );
                })}
            </ScrollView>
        </View>
    );
}

export default TeacherList;
