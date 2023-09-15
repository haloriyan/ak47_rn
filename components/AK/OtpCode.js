import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, TextInput } from "react-native";

const OtpCode = ({onCodeFilled, count = 4, size = 45, areaStyle, style}) => {
    const [code, setCode] = useState('');
    const [counter, setCounter] = useState(null);
    const [inputFocus, setInputFocus] = useState(0);

    useEffect(() => {
        if (counter == null) {
            let input = [];
            for (let i = 0; i < count; i++) {
                input.push(i);
            }
            setCounter(input);
        }
    })

    const handleInput = () => {
        setInputFocus(inputFocus + 1);
    }
    
    return (
        <View style={{
            ...styles.area,
            ...areaStyle
        }}>
            {
                counter != null &&
                counter.map((counter, c) => (
                    <TextInput
                        autoFocus={inputFocus == c ? true : false}
                        onChangeText={e => {
                            if (e != "") {
                                // 
                            }
                        }}
                        style={{
                            ...styles.input,
                            width: size,
                            ...style
                    }} />
                ))
            }
        </View>
    )
}

const styles = StyleSheet.create({
    area: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    input: {
        aspectRatio: 1,
        borderColor: '#ddd',
        borderWidth: 1,
        margin: 10,
        textAlign: 'center',
        borderRadius: 6
    },
})

export default OtpCode;