import React, { useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Teks from "../../../../components/Teks";
import config from "../../../../config";
import { useNavigation } from "@react-navigation/native";
import EventIcons from "./Icon";

const EventNavigator = ({active = 'overview', event = null}) => {
    const [isShowing, setShowing] = useState(false);
    const navigation = useNavigation();

    return (
        <>
            {
                isShowing &&
                <TouchableOpacity onPress={() => setShowing(false)} style={styles.overlay}></TouchableOpacity>
            }
            <TouchableOpacity style={styles.area} onPress={() => setShowing(!isShowing)}>
                <Image source={EventIcons[active]} />
                <Teks style={{flexGrow: 1}}>{active.toUpperCase()}</Teks>
                <Icon name={isShowing ? 'expand-more' : 'expand-less'} />
            </TouchableOpacity>

            {
                isShowing &&
                <View style={styles.MenuArea}>
                    <TouchableOpacity style={styles.MenuItem} onPress={() => {
                        navigation.navigate('EventOverview', {
                            event: event
                        });
                        setShowing(false)
                    }}>
                        <Image source={EventIcons['overview']} />
                        <Teks 
                            color={active === 'overview' ? config.primaryColor : '#333'}
                            family={`Inter_${active === 'overview' ? '700Bold' : '400Regular'}`}
                        >
                            Overview
                        </Teks>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.MenuItem} onPress={() => {
                        navigation.navigate('EventInfo', {
                            event: event
                        });
                        setShowing(false)
                    }}>
                        <Image source={EventIcons['info']} />
                        <Teks 
                            color={active === 'info' ? config.primaryColor : '#333'}
                            family={`Inter_${active === 'info' ? '700Bold' : '400Regular'}`}
                        >
                            Basic Info
                        </Teks>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.MenuItem} onPress={() => {
                        navigation.navigate('EventTicket', {
                            event: event
                        });
                        setShowing(false)
                    }}>
                        <Image source={EventIcons['ticket']} />
                        <Teks 
                            color={active === 'ticket' ? config.primaryColor : '#333'}
                            family={`Inter_${active === 'ticket' ? '700Bold' : '400Regular'}`}
                        >
                            Ticket
                        </Teks>
                    </TouchableOpacity>
                </View>
            }
        </>
    )
}

const styles = StyleSheet.create({
    area: {
        backgroundColor: '#fff',
        padding: 15,
        paddingLeft: 20,paddingRight: 20,
        position: 'absolute',
        bottom: 0,left: 0,right: 0,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
        zIndex: 3,
    },
    MenuArea: {
        position: 'absolute',
        bottom: 0,left: 0,right: 0,
        backgroundColor: '#fff',
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
        padding: 20,
        zIndex: 3,
        gap: 15,
    },
    MenuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    overlay: {
        backgroundColor: '#000000aa',
        position: 'absolute',
        top: 0,left: 0,right: 0,bottom: 0,
    },
})

export default EventNavigator;