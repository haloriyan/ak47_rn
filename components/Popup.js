import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Modal, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const Popup = ({visible, onDismiss, style, children, opacity = 0.6, overlayStyle = null}) => {
    return (
        <View>
            <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={() => {onDismiss()}}>
                <KeyboardAwareScrollView contentContainerStyle={styles.scrollview}>
                    <TouchableOpacity style={{
                        ...styles.wrapper,
                        backgroundColor: `rgba(0,0,0, ${opacity})`,
                        ...overlayStyle,
                    }} nama={'riyan'} onPress={event => {
                        onDismiss();
                    }}>
                        <TouchableOpacity style={{...styles.content, ...style}} activeOpacity={1}>
                            {children}
                        </TouchableOpacity>
                    </TouchableOpacity>
                </KeyboardAwareScrollView>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    scrollview: {
        position: 'absolute',
        top: 0,left: 0,right: 0,bottom: 0,
        elevation: 2,
        zIndex: 2,
    },
    wrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        flexGrow: 1,
        alignItems: 'center',
        alignContent: 'center',
        width: '100%',
        height: '100%'
    },
    content: {
        backgroundColor: '#fff',
        width: '80%',
        zIndex: 3,
        borderRadius: 6,
    }
})

export {Popup};