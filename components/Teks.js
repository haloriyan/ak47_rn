import React, { useEffect, useState } from "react";
import { Text } from "react-native";
// import { 
//     useFonts, 
//     Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold, Poppins_800ExtraBold
// } from "@expo-google-fonts/poppins";
import { 
    useFonts,
    Inter_400Regular, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold, Inter_900Black
} from "@expo-google-fonts/inter";
import config from "../config";

const Teks = ({children, style, family = 'Inter_400Regular', size = 13, color= config.colors.text, align = 'left', limit = 0, spacing = 0, lineHeight = null, length = null}) => {
    let [fontsLoaded] = useFonts({
        Inter_400Regular,Inter_600SemiBold,Inter_700Bold,Inter_800ExtraBold,Inter_900Black
    });

    if (!fontsLoaded) {
        return <Text style={{...style, fontSize: size, textAlign: align, letterSpacing: spacing, lineHeight: lineHeight}}>{(limit !== 0 && typeof children === 'string') ? children.toString().substring(0, limit) : children}</Text>
    }

    if (limit > 0 && children.length > limit) {
        children = children.substr(0, limit) + '...';
    }

    return <Text style={{
        fontSize: size,
        color: color,
        letterSpacing: spacing,
        lineHeight: lineHeight,
        ...style,
        fontFamily: family,
        textAlign: align
    }}>{(limit !== 0 && typeof children === 'string') ? children.substring(0, limit) : children}</Text>
}

export default Teks;