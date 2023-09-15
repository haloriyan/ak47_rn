import React, { useEffect, useState } from "react";
import Teks from "../../../../components/Teks";
import EventHeader from "./Header";
import { ScrollView, StyleSheet } from "react-native";
import EventNavigator from "./Navigator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import config from "../../../../config";

const EventInfo = ({navigation, route}) => {
    const { event } = route.params;
    const [isLoading, setLoading] = useState(false);
    const [triggerLoading, setTriggerLoading] = useState(false);
    const [token, setToken] = useState(null);

    useEffect(() => {
        if (token === null) {
            AsyncStorage.getItem('user_token').then(value => setToken(value))
        }
    }, [token]);

    useEffect(() => {
        if (isLoading && triggerLoading && token !== null) {
            setTriggerLoading(false);
            axios.post(`${config.baseUrl}/api`)
            .then(response => {
                let res = response.data;
            })
        }
    }, [isLoading, triggerLoading, token]);

    return (
        <React.Fragment>
            <EventHeader title="Basic Info" />
            <ScrollView contentContainerStyle={styles.container}>
                <Teks>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla, ratione impedit! Voluptate possimus, odit perspiciatis ducimus repellendus modi illo repellat! Atque harum repellendus laudantium! Fugiat accusamus neque non laborum magnam. Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe ut, itaque numquam minima nobis error corrupti maiores esse! Voluptas cupiditate fuga sint quaerat architecto deserunt optio, non itaque ea veritatis.</Teks>
                <Teks>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla, ratione impedit! Voluptate possimus, odit perspiciatis ducimus repellendus modi illo repellat! Atque harum repellendus laudantium! Fugiat accusamus neque non laborum magnam. Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe ut, itaque numquam minima nobis error corrupti maiores esse! Voluptas cupiditate fuga sint quaerat architecto deserunt optio, non itaque ea veritatis.</Teks>
                <Teks>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla, ratione impedit! Voluptate possimus, odit perspiciatis ducimus repellendus modi illo repellat! Atque harum repellendus laudantium! Fugiat accusamus neque non laborum magnam. Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe ut, itaque numquam minima nobis error corrupti maiores esse! Voluptas cupiditate fuga sint quaerat architecto deserunt optio, non itaque ea veritatis.</Teks>
                <Teks>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla, ratione impedit! Voluptate possimus, odit perspiciatis ducimus repellendus modi illo repellat! Atque harum repellendus laudantium! Fugiat accusamus neque non laborum magnam. Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe ut, itaque numquam minima nobis error corrupti maiores esse! Voluptas cupiditate fuga sint quaerat architecto deserunt optio, non itaque ea veritatis.</Teks>
                <Teks>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla, ratione impedit! Voluptate possimus, odit perspiciatis ducimus repellendus modi illo repellat! Atque harum repellendus laudantium! Fugiat accusamus neque non laborum magnam. Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe ut, itaque numquam minima nobis error corrupti maiores esse! Voluptas cupiditate fuga sint quaerat architecto deserunt optio, non itaque ea veritatis.</Teks>
                <Teks>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla, ratione impedit! Voluptate possimus, odit perspiciatis ducimus repellendus modi illo repellat! Atque harum repellendus laudantium! Fugiat accusamus neque non laborum magnam. Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe ut, itaque numquam minima nobis error corrupti maiores esse! Voluptas cupiditate fuga sint quaerat architecto deserunt optio, non itaque ea veritatis.</Teks>
            </ScrollView>
            <EventNavigator active="info" event={event} />
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        paddingBottom: 100
    }
})

export default EventInfo;