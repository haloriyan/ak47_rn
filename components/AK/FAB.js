import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import config from "../../config";

const FAB = ({icon, iconSize = 18, size = 50, color = config.primaryColor, style, onPress}) => {
    return (
        <TouchableOpacity style={{
            ...styles.fab, 
            backgroundColor: color,
            width: size,
            height: size,
            ...style
        }}
            onPress={onPress}
        >
            <Icon name={icon} color={'#fff'} size={iconSize} />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        bottom: 20,right: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 999
    }
})

export default FAB;