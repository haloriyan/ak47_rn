import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import config from "../../config";
import Teks from "../Teks";

const Input = ({placeholder, label, value, secureTextEntry, onChangeText, onFocus, type = 'default', left, right, color = config.primaryColor, style, labelStyle, wrapperStyle, multiline = false}) => {
    const [theLabelStyle, setTheLabelStyle] = useState({
        fontSize: value == '' ? 15 : 11,
        top: value == '' ? 18 : -8,
        // paddingLeft: value == '' ? 0 : 20,
        // paddingRight: value == '' ? 0 : 20,
    });
    const [inputStyle, setInputStyle] = useState({borderColor: '#ddd'});
    const theValue = useRef(value);
    const [isFocus, setFocus] = useState(false);

    useEffect(() => {
        if (theValue.current == "" && value != "") {
            setTheLabelStyle({
                fontSize: 11,
                top: -8
            });
            theValue.current = value;
        }
    })

    return (
        <View style={{
            ...styles.area, ...inputStyle,
            height: multiline === false ? 55 : 'auto',
            ...wrapperStyle,
        }}>
            {
                left !== undefined &&
                <View style={{marginLeft: 15}}>
                    {
                        typeof left == 'string' ?
                            <Teks>{left}</Teks>
                        :
                            left
                    }
                </View>
            }
            <TextInput 
                placeholder={isFocus ? placeholder : ''}
                onChangeText={e => {
                    if (onChangeText !== undefined) {
                        onChangeText(e);
                    }
                    theValue.current = e;
                }}
                multiline={multiline}
                value={value}
                keyboardType={type}
                secureTextEntry={secureTextEntry}
                style={{
                    ...styles.input,
                    marginTop: multiline === false ? 0 : 20,
                    marginBottom: multiline === false ? 0 : 20,
                    ...style
                }}
                onFocus={() => {
                    setFocus(true);
                    let TheLabelStyle = {...theLabelStyle};
                    let InputStyle = {...inputStyle};
                    TheLabelStyle['fontSize'] = 11;
                    TheLabelStyle['top'] = -8;
                    TheLabelStyle['color'] = color;
                    TheLabelStyle['paddingLeft'] = 10;
                    TheLabelStyle['paddingRight'] = 10;
                    TheLabelStyle['backgroundColor'] = '#fff'
                    InputStyle['borderColor'] = color;

                    setTheLabelStyle(TheLabelStyle);
                    setInputStyle(InputStyle);
                    if (onFocus !== undefined) onFocus();
                }}
                onBlur={() => {
                    setFocus(false);
                    let TheLabelStyle = {...theLabelStyle};
                    let InputStyle = {...inputStyle};
                    if (theValue.current == "") {
                        TheLabelStyle['fontSize'] = 15;
                        TheLabelStyle['top'] = 18;
                        TheLabelStyle['paddingLeft'] = 0;
                        TheLabelStyle['paddingRight'] = 0;
                    }
                    TheLabelStyle['paddingLeft'] = 10;
                    TheLabelStyle['paddingRight'] = 10;
                    TheLabelStyle['color'] = '#444';
                    InputStyle['borderColor'] = '#ddd';
                    setTheLabelStyle(TheLabelStyle);
                    setInputStyle(InputStyle);
                }}
            />
            {
                label !== undefined &&
                <Text style={{...styles.label, ...theLabelStyle, ...labelStyle}}>{label}</Text>
            }
            <View style={{marginRight: 15}}>
                {right}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    area: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        height: 55,
        // width: '100%',
        flexGrow: 1,
        backgroundColor: '#fff',
        borderWidth: 1,
        marginBottom: 20,
        borderRadius: 7,
        position: 'relative'
    },
    input: {
        height: '100%',
        flexGrow: 1,
        color: '#444',
        paddingTop: 0,
        paddingLeft: 20,
        paddingRight: 20,
    },
    label: {
        position: 'absolute',
        top: 18,left: 10,
        color: '#aaa',
        fontSize: 15,
        backgroundColor: '#fff',
        // padding: 10,
        paddingLeft: 10,
        paddingRight: 10,
    }
})

export default Input;