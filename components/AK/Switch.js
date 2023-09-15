import React, { useState } from 'react-native';
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import config from '../../config';

const Switch = ({size, value, setValue, onChange}) => {
    return (
        <TouchableOpacity 
            style={{...styles.area, width: size + 25, backgroundColor: value ? config.colors.green : config.colors.grey,justifyContent: value ? 'flex-end' : 'flex-start'}}
            onPress={() => {
                if (setValue !== undefined) {
                    setValue(!value);
                } else {
                    onChange();
                }
            }}
        >
            <View style={{...styles.round, width: size, height: size, backgroundColor: value ? '#fff' : '#aaa'}}></View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    area: {
        backgroundColor: '#ecf0f1',
        borderRadius: 9999,
        padding: 5,
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    round: {
        borderRadius: 9999,
        backgroundColor: '#2ecc71'
    }
})

export default Switch;