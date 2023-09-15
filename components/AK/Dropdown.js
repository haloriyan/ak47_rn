import React, { useEffect, useRef, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import config from "../../config";

import Popup from "./Popup";
import Teks from "../Teks";

const Dropdown = ({value = '', label = null, children, onSelect, setValue, style, leftIcon = null, list, placeholder = 'Choose'}) => {
    const [visible, setVisible] = useState(false);
    const [index, setIndex] = useState(0);
    const [isLoading, setLoading] = useState(true);
    const theValue = useRef(value);

    useEffect(() => {
        if (theValue.current != value) {
            theValue.current = value;
            setLoading(true);
        }
    })

    useEffect(() => {
        if (isLoading) {
            let isActive = false;
            if (list !== undefined) {
                list.map((child, c) => {
                    let toChoose = child.props.value !== undefined ? child.props.value : child.props.children;
                    isActive = typeof value == 'string' ? value === toChoose : inArray(toChoose, value);
                    if (isActive) {
                        setIndex(c);
                    }
                });
            } else {
                children.map((child, c) => {
                    let toChoose = child.props.value !== undefined ? child.props.value : child.props.children;
                    isActive = typeof value == 'string' ? value === toChoose : inArray(toChoose, value);
                    if (isActive) {
                        setIndex(c);
                    }
                })
            }
            setLoading(false);
        }
    })

    const choosing = (val, i) => {
        setIndex(i);
        let newValue = null;
        if (onSelect !== undefined) {
            onSelect(val, i);
        } else {
            if (typeof value == 'string') {
                if (setValue !== undefined) {
                    setValue(val);
                }
                newValue = val;
            } else {
                newValue = value.length == 0 ? [] : [...value];
                if (inArray(val, newValue)) {
                    removeArray(val, newValue);
                } else {
                    newValue.push(val);
                }
            }
            if (setValue !== undefined) {
                setValue(newValue);
            }
        }
        setVisible(false);
    }

    const removeArray = (toRemove, arr) => {
        let ind = arr.indexOf(toRemove);
        arr.splice(ind, 1);
    }
    const inArray = (needle, haystack) => {
        let length = haystack.length;
        for (let i = 0; i < length; i++) {
            if (haystack[i] == needle) return true;
        }
        return false;
    }

    return (
        <View style={{position: 'relative'}}>
            <Popup visible={visible} onDismiss={() => setVisible(false)}>
                <ScrollView style={{flexGrow: 0}}>
                {
                    list === undefined ?
                    children.map((child, c) => {
                        let toChoose = child.props.value !== '' ? child.props.value : child.props.children;
                        let isActive = false;
                        if (value !== "") {
                            isActive = index == c;
                        }
                        
                        return (
                            <TouchableOpacity 
                                style={{...styles.option_item, 
                                    backgroundColor: isActive ? config.primaryColor : '#fff',
                                    ...child.props.style
                                }}
                                onPress={() => choosing(toChoose, c)}
                                key={c}
                            >
                                <Text style={{
                                    color: isActive ? '#fff' : '#555',
                                    ...child.props.textStyle
                                }}>{child}</Text>
                            </TouchableOpacity>
                        )
                    })
                    :
                    list.map((child, c) => {
                        let toChoose = child.props.value !== undefined ? child.props.value : child.props.children;
                        let isActive = index == c;
                        return (
                            <TouchableOpacity 
                                style={{...styles.option_item, 
                                    backgroundColor: isActive ? config.primaryColor : '#fff',
                                    ...child.props.style
                                }}
                                onPress={() => choosing(toChoose, c)}
                                key={c}
                            >
                                <Text style={{
                                    color: isActive ? '#fff' : '#555',
                                    ...child.props.textStyle
                                }}>{child}</Text>
                            </TouchableOpacity>
                        )
                    })
                }
                </ScrollView>
            </Popup>

            <TouchableOpacity style={{...styles.flexing, ...styles.input, ...style}} onPress={() => setVisible(true)}>
                {
                    label != null &&
                    <Text style={styles.label_text}>{label}</Text>
                }
                {
                    leftIcon != null &&
                    <Icon name={leftIcon} color={'#444'} style={{marginRight: 5}} size={16} />
                }
                <Text style={{flexGrow: 1,color: '#444',flexShrink: 1}}>{typeof value === 'string' ? value === '' ? placeholder : children[index] : value.join(',')}</Text>
                <Icon name="expand-more" color={'#444'} />
            </TouchableOpacity>
        </View>
    )
}

const Option = ({children}) => {
    return children;
}

const styles = StyleSheet.create({
    flexing: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        alignContent: 'center'
    },
    input: {
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        padding: 6,
        paddingLeft: 10,paddingRight: 10,
        width: '100%',
        height: 'auto'
    },
    // options: {
    //     maxHeight: 400,
    // },
    option_item: {
        height: 50,
        justifyContent: 'center',
        paddingLeft: 15,paddingRight: 15,
    },
    option_text: {
        color: '#555'
    },
    label_text: {
        fontSize: 11,
        color: '#666',
        position: 'absolute',
        left: 5,top: -9,
        backgroundColor: '#fff',
        padding: 2,
        paddingLeft: 6,paddingRight: 6,
    }
})

export {
    Dropdown, Option
}