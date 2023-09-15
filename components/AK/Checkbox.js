import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import config from "../../config";
import Teks from "../Teks";

const Checkbox = ({text, size = 20, selected = true}) => {
    return (
        <View style={styles.area}>
            <View style={{
                ...styles.box,
                width: size,
                height: size,
                borderColor: selected ? config.primaryColor : '#ddd'
            }}>
                {
                    selected &&
                    <Icon name="check" color={config.primaryColor} />
                }
            </View>
            <Teks>{text}</Teks>
        </View>
    )
}

const styles = StyleSheet.create({
    area: {
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'center',
    },
    box: {
        borderWidth: 1,
        borderRadius: 5,
        marginRight: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    box_inner: {
        backgroundColor: config.primaryColor,
        borderRadius: 5,
        width: '80%',
        aspectRatio: 1
    }
})

export default Checkbox;