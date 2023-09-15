import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

let cellLength = 0;
let widthCollection = {
    0: '100%',
    2: '50%',
    3: '33.333%',
    4: '25%',
    5: '20%'
};

const Cell = (props, {textStyle, style}) => {
    return (
        <View style={{flexBasis: widthCollection[cellLength], ...styles.cell, ...props.style, flexGrow: 1}}>
            {
                typeof props.children == 'string' ?
                    <Text style={{...props.textStyle, color: '#333'}}>{props.children}</Text>
                :
                    props.children
            }
        </View>
    )
}
const Row = ({children, onPress, style}) => {
    return (
        <TouchableOpacity onPress={onPress} style={{...styles.row, ...style}}>{children}</TouchableOpacity>
    )
}
const Table = (props) => {
    if (props.children[0] === undefined) {
        cellLength = props.children.props.children.length;
    } else {
        cellLength = props.children[0].props.children.length;
    }
    return (
        <ScrollView contentContainerStyle={{...styles.table, ...props.style}}>
            {props.children}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    table: {
        width: '100%'
    },
    row: {
        flexDirection: 'row',
        borderBottomColor: '#ddd',
        borderBottomWidth: 1,
    },
    cell: {
        padding: 10,
        justifyContent: 'center',
        flexGrow: 1,
    }
})

export {
    Table,Row,Cell
}