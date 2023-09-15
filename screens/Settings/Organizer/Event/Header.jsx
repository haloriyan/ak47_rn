import React from "react";
import { StyleSheet, View } from "react-native";
import Teks from "../../../../components/Teks";
import config from "../../../../config";
import { StatusBar } from "expo-status-bar";

const EventHeader = ({title = 'Overview'}) => {
    return (
        <React.Fragment>
            <StatusBar style="dark" />
            <View style={styles.header}>
                <Teks color={config.primaryColor} family="Inter_700Bold" size={14}>{title}</Teks>
            </View>
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    header: {
        padding: 20,
        paddingTop: 55,
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'center',
        shadowColor: '#ddd',
        shadowOpacity: 0.9,
        shadowOffset: {
            width: 1,height: 1,
        }
    }
})

export default EventHeader;