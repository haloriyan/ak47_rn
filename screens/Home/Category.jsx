import React, { useEffect, useState } from "react";
import Svg, { Path } from "react-native-svg";
import Icon from "react-native-vector-icons/MaterialIcons";
import Teks from "../../components/Teks";
import { ActivityIndicator, Image, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import axios from "axios";
import config from "../../config";
import Currency from "../../components/Currency";
import moment from "moment";
import Wishlist from "../../components/Wishlist";

const Category = ({navigation, route}) => {
    const { id, name, icon } = route.params;
    const [isLoading, setLoading] = useState(true);
    const [triggerLoading, setTriggerLoading] = useState(true);
    const [pos, setPos] = useState(0);
    const [events, setEvents] = useState([]);
    const [barStyle, setBarStyle] = useState('light');

    useEffect(() => {
        if (isLoading && triggerLoading) {
            setTriggerLoading(false);
            axios.get(`${config.baseUrl}/api/category/${name}/event`)
            .then(response => {
                setLoading(false);
                let res = response.data;
                setEvents(res.events.data);
            })
        }
    }, [isLoading, triggerLoading]);

    const handleScroll = e => {
        let p = e.nativeEvent.contentOffset.y;
        if (p >= 180) {
            setBarStyle('dark');
        } else {
            setBarStyle('light');
        }
        setPos(p);
    }

    return (
        <React.Fragment>
            <StatusBar style={barStyle} />
            <ScrollView contentContainerStyle={styles.container} scrollEventThrottle={16} onScroll={handleScroll}>
                <View style={styles.top_area}>
                    <TouchableOpacity style={{flexDirection: 'row',gap: 20,alignItems: 'center'}}>
                        <Icon name="west" color={'#fff'} size={16} />
                        <Teks color="#fff" size={12}>kembali</Teks>
                    </TouchableOpacity>
                </View>
                <View style={styles.content}>
                    <View style={styles.title_area}>
                        <Image style={styles.title_icon} source={{uri: `${config.baseUrl}/storage/category_icons/${icon}`}} />
                        <Teks size={20} family="Inter_700Bold">{name}</Teks>
                    </View>
                    {
                        isLoading ?
                            <ActivityIndicator />
                        :
                        events.length > 0 ?
                        events.map((event, e) => (
                            <View key={e} style={styles.event_card}>
                                <Image source={{uri: `${config.baseUrl}/storage/event_covers/${event.cover}`}} style={styles.event_cover} />
                                <View style={{padding: 20}}>
                                    <Teks size={16} family="Inter_700Bold">{event.title}</Teks>
                                    <View style={styles.event_info_area}>
                                        <View style={styles.event_info}>
                                            <Image source={require('../../assets/icons/moneys.png')} style={{width: 20,height: 20}} />
                                            <Teks size={12} color="#777">{Currency(event.tickets[0].price).encode()}</Teks>
                                        </View>
                                        <View style={styles.event_info}>
                                            <Image source={require('../../assets/icons/calendar-2.png')} style={{width: 20,height: 20}} />
                                            <Teks size={12} color="#777">{moment(event.start_date).format('DD MMM')}</Teks>
                                        </View>
                                        <View style={styles.event_info}>
                                            <Image source={require('../../assets/icons/location.png')} style={{width: 20,height: 20}} />
                                            <Teks size={12} color="#777">{event.city}</Teks>
                                        </View>
                                    </View>
                                    <View style={styles.featured_buttons}>
                                        <TouchableOpacity style={{
                                            ...styles.featured_square_button,
                                            backgroundColor: Wishlist.has(event.id) ? config.primaryColor : '#fff',
                                            borderWidth: Wishlist.has(event.id) ? 0 : 1,
                                        }} onPress={() => {
                                            Wishlist.set(event.id)
                                        }}>
                                            <Svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width={28}
                                                height={28}
                                                fill="none"
                                            >
                                                {
                                                    Wishlist.has(event.id) ?
                                                    <Path
                                                        stroke={'#fff'}
                                                        d="M14.723 24.278c-.396.14-1.05.14-1.446 0-3.384-1.155-10.944-5.973-10.944-14.14 0-3.605 2.905-6.521 6.487-6.521A6.435 6.435 0 0 1 14 6.23a6.451 6.451 0 0 1 5.18-2.613c3.582 0 6.487 2.916 6.487 6.521 0 8.167-7.56 12.985-10.944 14.14z"
                                                    />
                                                    :
                                                    <Path
                                                        stroke={config.primaryColor}
                                                        d="M14.723 24.278c-.396.14-1.05.14-1.446 0-3.384-1.155-10.944-5.973-10.944-14.14 0-3.605 2.905-6.521 6.487-6.521A6.435 6.435 0 0 1 14 6.23a6.451 6.451 0 0 1 5.18-2.613c3.582 0 6.487 2.916 6.487 6.521 0 8.167-7.56 12.985-10.944 14.14z"
                                                    />
                                                }
                                            </Svg>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.featured_primary_button} onPress={() => {
                                            navigation.navigate('EventDetail', {
                                                id: event.id
                                            })
                                        }}>
                                            <Teks color={config.primaryColor}>{Currency(event.tickets[0].price).encode()}</Teks>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        ))
                        :
                        <Teks style={{marginTop: 20}}>Tidak ada event</Teks>
                    }
                </View>
            </ScrollView>
            <View style={{...styles.header, opacity: (pos / 300 * 100) / 100}}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="west" size={20} color={config.primaryColor} />
                </TouchableOpacity>
                <Teks color={config.primaryColor} size={15}>{name}</Teks>
                <View style={{flexGrow: 1}}></View>
                <Image style={styles.header_icon} source={{uri: `${config.baseUrl}/storage/category_icons/${icon}`}} />
            </View>
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    top_area: {
        backgroundColor: config.primaryColor,
        height: 115,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    container: {
        flexGrow: 1,
    },
    content: {
        flexGrow: 1,
        backgroundColor: '#fff',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop: -30
    },
    title_area: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    title_icon: {
        height: 36,
        aspectRatio: 1/1,
    },
    event_card: {
        borderRadius: 12,
        marginTop: 20,
        borderBottomWidth: 6,
        borderBottomColor: `${config.primaryColor}30`
    },
    event_cover: {
        width: '100%',
        aspectRatio: 5/2,
        backgroundColor: '#eee',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    event_info_area: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    event_info: {
        flexGrow: 1,
        flexDirection: 'row',
        alignItems: 'center',
        height: 40,
        gap: 10,
    },
    featured_buttons: {
        flexDirection: 'row',
        gap: 20,
        alignItems: 'center',
        marginTop: 20
    },
    featured_square_button: {
        height: 50,
        aspectRatio: 1/1,
        borderRadius: 99,
        borderColor: '#ddd',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    featured_primary_button: {
        flexGrow: 1,
        height: 50,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: config.primaryColor,
        borderWidth: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        paddingBottom: 15,
        backgroundColor: '#fff',
        paddingTop: 50,
        position: 'absolute',
        top: 0,left: 0,right: 0,
        gap: 20,
        shadowColor: '#ddd',
        shadowOpacity: 0.9,
        shadowOffset: {
            width: 1,height: 1,
        },
        shadowRadius: 10,
    },
    header_icon: {
        height: 30,
        aspectRatio: 1/1,
    }
})

export default Category;