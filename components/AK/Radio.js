import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import config from "../../config";
import Teks from "../Teks";

const Radio = ({value, onSelect = null, size = 20, label = 'Radio Tes', active = false}) => {
    const onSelectEvent = () => {
        if (onSelect !== null) {
            onSelect();
        }
    }

    return (
        <React.Fragment>
            <TouchableOpacity style={styles.area} onPress={onSelectEvent}>
                <View style={{
                    ...styles.radio_outer,
                    width: size,
                    height: size,
                    borderColor: active ? config.primaryColor : '#ccc'
                }}>
                    <View style={{
                        ...styles.radio_inner,
                        backgroundColor: active ? config.primaryColor : '#fff'
                    }}></View>
                </View>
                <Teks style={{marginLeft: 10}}>{label}</Teks>
            </TouchableOpacity>
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    area: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 10,
    },
    radio_outer: {
        borderWidth: 2,
        borderRadius: 999,
        padding: 3,
    },
    radio_inner: {
        backgroundColor: config.primaryColor,
        width: '100%',
        aspectRatio: 1,
        borderRadius: 999
    }
})

export default Radio;