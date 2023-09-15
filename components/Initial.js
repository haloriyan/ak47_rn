import React, { useState, useEffect} from "react";
import { View, StyleSheet } from "react-native";
import Teks from "./Teks";
import config from "../config";

const Initial = ({name, size = 40, textSize = 14}) => {
    const [initial, setInitial] = useState(null);

    useEffect(() => {
        let names = name.split(" ");
        let init = names[0][0];
        if (names.length > 1) {
            init = `${init}${names[names.length - 1][0]}`;
        }
        setInitial(init);
    }, [initial]);

    return initial !== null && (
        <View style={{
            ...styles.initial,
            height: size,
        }}>
            <Teks color="#fff" size={textSize}>{initial.toUpperCase()}</Teks>
        </View>
    )
}

const styles = StyleSheet.create({
    initial: {
        aspectRatio: 1/1,
        borderRadius: 99,
        backgroundColor: config.primaryColor,
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center'
    },
});

export default Initial;