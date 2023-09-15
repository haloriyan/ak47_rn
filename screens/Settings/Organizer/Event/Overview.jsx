import React from "react";
import Teks from "../../../../components/Teks";
import EventHeader from "./Header";
import { ScrollView, StyleSheet } from "react-native";
import EventNavigator from "./Navigator";

const EventOverview = ({navigation, route}) => {
    const { event } = route.params;

    return (
        <React.Fragment>
            <EventHeader />
            <ScrollView contentContainerStyle={styles.container}>
                <Teks>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla, ratione impedit! Voluptate possimus, odit perspiciatis ducimus repellendus modi illo repellat! Atque harum repellendus laudantium! Fugiat accusamus neque non laborum magnam. Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe ut, itaque numquam minima nobis error corrupti maiores esse! Voluptas cupiditate fuga sint quaerat architecto deserunt optio, non itaque ea veritatis.</Teks>
                <Teks>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla, ratione impedit! Voluptate possimus, odit perspiciatis ducimus repellendus modi illo repellat! Atque harum repellendus laudantium! Fugiat accusamus neque non laborum magnam. Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe ut, itaque numquam minima nobis error corrupti maiores esse! Voluptas cupiditate fuga sint quaerat architecto deserunt optio, non itaque ea veritatis.</Teks>
                <Teks>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla, ratione impedit! Voluptate possimus, odit perspiciatis ducimus repellendus modi illo repellat! Atque harum repellendus laudantium! Fugiat accusamus neque non laborum magnam. Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe ut, itaque numquam minima nobis error corrupti maiores esse! Voluptas cupiditate fuga sint quaerat architecto deserunt optio, non itaque ea veritatis.</Teks>
                <Teks>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla, ratione impedit! Voluptate possimus, odit perspiciatis ducimus repellendus modi illo repellat! Atque harum repellendus laudantium! Fugiat accusamus neque non laborum magnam. Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe ut, itaque numquam minima nobis error corrupti maiores esse! Voluptas cupiditate fuga sint quaerat architecto deserunt optio, non itaque ea veritatis.</Teks>
                <Teks>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla, ratione impedit! Voluptate possimus, odit perspiciatis ducimus repellendus modi illo repellat! Atque harum repellendus laudantium! Fugiat accusamus neque non laborum magnam. Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe ut, itaque numquam minima nobis error corrupti maiores esse! Voluptas cupiditate fuga sint quaerat architecto deserunt optio, non itaque ea veritatis.</Teks>
                <Teks>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla, ratione impedit! Voluptate possimus, odit perspiciatis ducimus repellendus modi illo repellat! Atque harum repellendus laudantium! Fugiat accusamus neque non laborum magnam. Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe ut, itaque numquam minima nobis error corrupti maiores esse! Voluptas cupiditate fuga sint quaerat architecto deserunt optio, non itaque ea veritatis.</Teks>
            </ScrollView>
            <EventNavigator event={event} />
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

export default EventOverview;