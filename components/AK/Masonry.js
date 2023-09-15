import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Item = (props) => {
    const { style } = props;
    return <View style={style}>{props.children}</View>;
}

const Masonry = (props) => {
    let datas = [];
    let k = 0;
    let { divide, spacing = 5 } = props;
    let totalItems = props.children.length;
    if (totalItems < divide) {
        divide = totalItems;
    }
    let mod = totalItems % divide;
    let squaredItem = totalItems - mod;
    let itemPerRow = squaredItem / divide;

    let widthCollection = {
        2: '50%',
        3: '33.333%',
        4: '25%',
        5: '20%'
    };

    let containers = [];

    for (let i = 0; i < divide; i++) {
        containers.push([]);
        for (let j = 0; j < itemPerRow; j++) {
            containers[i].push(<View style={{marginBottom: spacing}}>{props.children[k]}</View>);
            k += 1;
        }
    }

    if (mod != 0) {
        for (let i = 0; i < mod; i++) {
            containers[i].push(<View style={{marginBottom: spacing}}>{props.children[k]}</View>);
        }
    }

    let containerNew = [];
    containers.map((container, c) => {
        let extraStyle = {};
        if (c == 0) {
            extraStyle = {marginRight: spacing};
        } else if ( c == divide - 1) {
            extraStyle = {marginLeft: spacing};
        } else {
            extraStyle = {marginLeft: spacing,marginRight: spacing}
        }
        containerNew.push(
            <View key={c} style={{
                width: widthCollection[divide], 
                alignItems: 'center', 
                ...extraStyle
            }}>
                {container}
            </View>
        )
    });

    return (
        <View style={{flexDirection: 'row',flexWrap: 'wrap',width: '100%', ...props.style}}>
            {containerNew}
        </View>
    )
}

export {
    Masonry, Item
}