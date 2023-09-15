import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

import Teks from "../Teks";

const defaultConfigs = {
    label: 'Pilih Opsi',
    key: 'name',
}

const MXDropdown = ({options, value, setValue, config = defaultConfigs}) => {
    const [visible, setVisible] = useState(false);
    const [pos, setPos] = useState(null);

    return (
        <View style={styles.wrapper} onLayout={e => {
            let pos = e.nativeEvent.layout;
            setPos(pos);
        }}>
            <TouchableOpacity style={styles.input} onPress={() => setVisible(!visible)}>
                <Teks style={styles.label}>COK</Teks>
                <Icon name={visible ? 'expand-less' : 'expand-more'} size={20} />
            </TouchableOpacity>

            {
                (visible && pos !== null ) &&
                    <View style={styles.option_overlay}>
                        <ScrollView nestedScrollEnabled={false} style={styles.options_area} contentContainerStyle={{
                            backgroundColor: 'red',
                            borderColor: '#ddd',
                            borderWidth: 1,
                            maxHeight: 100,
                        }}
                        >
                            {
                                options.map((option, o) => (
                                    <TouchableOpacity style={styles.option_item} key={o}>
                                        <Teks>{option[config.key]}</Teks>
                                    </TouchableOpacity>
                                ))
                            }
                        </ScrollView>
                    </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        position: 'relative',
        flexGrow: 1,
        flexDirection: 'row',
        zIndex: 2
    },
    input: {
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 6,
        flexGrow: 1,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center'
    },
    label: {
        flexGrow: 1
    },
    options_area: {
        position: 'absolute',
        left: 0,right:0,
        zIndex: 5,
        marginTop: 55,
        borderRadius: 6
    },
    option_item: {
        padding: 15,
    },
})

export default MXDropdown;