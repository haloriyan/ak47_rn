import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Teks from "./Teks";

const Currency = ({amount, prefix = 'Rp ', style, family = "Poppins_400Regular", color = "#333", size = 14, nFormat = false}) => {
    const [theAmount, setTheAmount] = useState(null);
    const [pengganti, setPengganti] = useState(null);
    const penggantis = {
        million: 'jt',
        thousand: 'rb'
    }

    function nFormatter(num, digits) {
        const lookup = [
            { value: 1, symbol: "" },
            { value: 1e3, symbol: "rb" },
            { value: 1e6, symbol: "jt" },
            { value: 1e9, symbol: "G" },
            { value: 1e12, symbol: "T" },
            { value: 1e15, symbol: "P" },
            { value: 1e18, symbol: "E" }
        ];
        const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
        var item = lookup.slice().reverse().find(function(item) {
          return num >= item.value;
        });
        return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
    }
    useEffect(() => {
        setTheAmount(nFormat ? nFormatter(amount, 1) : toIdr(amount));
    })

    const toIdr = angka => {
        if (angka !== undefined) {
            var rupiah = '';		
            var angkarev = angka.toString().split('').reverse().join('');
            for(var i = 0; i < angkarev.length; i++) if(i%3 == 0) rupiah += angkarev.substr(i,3)+'.';
            return prefix + rupiah.split('',rupiah.length-1).reverse().join('');
        }
    }
    
    return (
        <Teks family={family} size={size} color={color} style={style}>{theAmount == null ? '' : theAmount}</Teks>
    )
}

export default Currency;