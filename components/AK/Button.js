import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import Teks from "../Teks";
import { colors } from "../../config";

const Button = ({children, height = 50, color = 'primary', style, textProps, onPress = null, onLongPress}) => {
    return (
        <TouchableOpacity 
            style={{
                height: height,
                backgroundColor: colors[color],
                ...styles.button,
                ...style
            }}
            onPress={() => {
                if (onPress !== null) {
                    onPress()
                }
            }}
            onLongPress={() => {
                if (onLongPress !== null) {
                    onLongPress()
                }
            }}
        >
            {
                typeof children === 'string' ? <Teks color="#fff" family="Inter_600SemiBold" {...textProps}>{children}</Teks> : children
            }
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8
    }
})

export default Button;