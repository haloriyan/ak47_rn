import React from "react";
import { StyleSheet, View } from "react-native";
import config from "../config";
import {StatusBar as ExpoStatusBar} from "expo-status-bar";

const StatusBar = ({color = config.primaryColor}) => {
    return (
        <React.Fragment>
            <ExpoStatusBar style={'light'} />
            <View style={{
                ...styles.area,
                backgroundColor: color
            }}></View>
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    area: {
        height: 45
    }
});

export default StatusBar