import moment, { monthsShort } from "moment";
import React, { useEffect, useRef, useState } from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import config from "../../config";
import Popup from "../Popup";
import Teks from "../Teks";

const DatePicker = ({format, visible = true, onDismiss}) => {
    const [date, setDate] = useState(moment().format('D'));
    const [month, setMonth] = useState(moment().format('M'));
    const maxDate = useRef(31);
    const [dateInput, setDateInput] = useState([]);
    const months = moment.monthsShort();

    const [dateRef, setDateRef] = useState(null);
    const [datePosition, setDatePosition] = useState(0);

    useEffect(() => {
        if (dateInput.length == 0) {
            let input = [];
            for (let i = 1; i <= 31; i++) {
                input.push(i);
                if (i == date) {
                    // setDatePosition((i * 45) - (i - 1));
                    setDatePosition(i * (41 - 1));
                }
            }
            setDateInput(input);
        }
    });

    // useEffect(() => {
    //     if (datePosition > 0) {
    //         handleScroll();
    //         setDatePosition(0);
    //     }
    // })

    const handleScroll = () => {
        dateRef.scrollTo({
            x: 0,
            y: 540,
            animated: false,
        });
    }

    return (
        <React.Fragment>
            <Popup visible={true} style={styles.area}>
                <TouchableOpacity onPress={() => handleScroll()}>
                    <Teks>{datePosition}</Teks>
                </TouchableOpacity>
                <ScrollView ref={ref => setDateRef(ref)} scrollEnabled={true} style={styles.input_area} contentContainerStyle={styles.input_area_container}>
                    {
                        dateInput.map((input, i) => (
                            <TouchableOpacity style={styles.input}>
                                <Teks
                                    color={input == date ? config.primaryColor : '#444'}
                                >
                                    {input}
                                </Teks>
                            </TouchableOpacity>
                        ))
                    }
                </ScrollView>
                <ScrollView scrollEnabled={true} style={styles.input_area} contentContainerStyle={styles.input_area_container}>
                    {
                        months.map((input, i) => (
                            <TouchableOpacity style={styles.input}>
                                <Teks>{input}</Teks>
                            </TouchableOpacity>
                        ))
                    }
                </ScrollView>
                <ScrollView scrollEnabled={true} style={styles.input_area} contentContainerStyle={styles.input_area_container}>
                    {
                        dateInput.map((input, i) => (
                            <TouchableOpacity style={styles.input}>
                                <Teks>{input}</Teks>
                            </TouchableOpacity>
                        ))
                    }
                </ScrollView>
            </Popup>
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    area: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 20,
    },
    input_area: {
        borderWidth: 1,
        borderColor: '#ddd',
        height: 150,
        borderRadius: 8,
        margin: 10,
    },
    input_area_container: {
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center'
    },
    input: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 45,
        width: '100%'
    }
})

export default DatePicker;