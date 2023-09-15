import React, { useEffect, useState } from "react";
import Teks from "../../components/Teks";
import { ActivityIndicator, Dimensions, Image, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import axios from "axios";
import config from "../../config";
import { Path, Svg } from "react-native-svg";
import moment from "moment";
import Currency from "../../components/Currency";
import { StatusBar } from "expo-status-bar";

const City = ({navigation, route}) => {
    const { name } = route.params;
    const [isLoading, setLoading] = useState(true);
    const [events, setEvents] = useState([]);
    const [city, setCity] = useState(null);
    const [pos, setPos] = useState(0);

    useEffect(() => {
        if (isLoading) {
            setLoading(false);
            axios.get(`${config.baseUrl}/api/city/${name}/event`)
            .then(response => {
                let res = response.data;
                setCity(res.city);
                setEvents(res.events);
            })
        }
    }, [isLoading]);

    return (
        <React.Fragment>
            <StatusBar style="light" />
            <View>
                {
                    city === null ?
                        <ActivityIndicator />
                    :
                    <View style={styles.cover_area}>
                        <Image source={{uri: `${config.baseUrl}/storage/city_covers/${city.cover}`}} style={styles.city_cover} />
                        <View style={styles.cover_overlay}></View>
                    </View>
                }
                {
                    city !== null &&
                    <>
                        <ScrollView contentContainerStyle={{flexGrow: 1,position: 'fixed',top: 0,left: 0,right: 0,bottom: 0}} scrollEventThrottle={16} onScroll={e => {
                            let p = e.nativeEvent.contentOffset.y;
                            setPos(p);
                        }}>
                            <View style={{height: 50 / 100 * Dimensions.get('screen').height}}></View>
                            <Teks size={24} color="#fff" family="Inter_900Black" style={{margin: 20}}>{city.name}</Teks>
                            <View style={styles.content}>
                                {
                                    events.map((event, e) => (
                                        <View key={e} style={styles.event_item}>
                                            <Image source={{uri: `${config.baseUrl}/storage/event_covers/${event.cover}`}} style={styles.event_image} />
                                            <View style={{padding: 20}}>
                                                <View style={styles.event_info}>
                                                    <View style={{flexGrow: 1,flexBasis: '70%'}}>
                                                        <Teks size={14} family="Inter_700Bold">{event.title}</Teks>
                                                        <View style={{...styles.event_info, marginTop: 5}}>
                                                            <Image source={require('../../assets/icons/location.png')} style={{width: 24,height: 24}} />
                                                            <Teks size={12} color="#666">{event.city}</Teks>
                                                        </View>
                                                    </View>
                                                    <View>
                                                        <Teks size={24} family="Inter_700Bold" color={config.primaryColor}>{moment(event.start).format('DD')}</Teks>
                                                        <Teks size={12} color={config.primaryColor}>{moment(event.start).format('MMM')}</Teks>
                                                    </View>
                                                </View>

                                                <View style={styles.event_buttons}>
                                                    <TouchableOpacity style={styles.event_square_button}>
                                                        <Svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width={28}
                                                            height={28}
                                                            fill="none"
                                                        >
                                                            <Path
                                                                stroke="#E5214F"
                                                                d="M14.723 24.278c-.396.14-1.05.14-1.446 0-3.384-1.155-10.944-5.973-10.944-14.14 0-3.605 2.905-6.521 6.487-6.521A6.435 6.435 0 0 1 14 6.23a6.451 6.451 0 0 1 5.18-2.613c3.582 0 6.487 2.916 6.487 6.521 0 8.167-7.56 12.985-10.944 14.14z"
                                                            />
                                                        </Svg>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity style={styles.event_primary_button} onPress={() => {
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
                                }
                            </View>
                        </ScrollView>
                        <View style={{...styles.header, opacity: (pos / 300 * 100) / 100}}>
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Icon name="west" size={20} color={'#fff'} />
                            </TouchableOpacity>
                            {
                                city !== null &&
                                <Teks color="#fff" size={15}>Event di {city.name}</Teks>
                            }
                        </View>
                    </>
                }
            </View>
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    city_cover: {
        width: '100%',
        aspectRatio: 3/4,
    },
    cover_area: {
        position: 'absolute',top: 0,left: 0,right: 0,
    },
    cover_overlay: {
        position: 'absolute',
        top: 0,left: 0,right: 0,bottom: 0,
        backgroundColor: `${config.primaryColor}40`,
        padding: 20,
        paddingBottom: 40,
        justifyContent: 'flex-end'
    },
    content: {
        backgroundColor: '#fff',
        padding: 0,
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
        paddingBottom: 20,
    },
    event_item: {
        shadowColor: '#dddddd',
        shadowOpacity: 1,
        shadowOffset: {
            width: 1,
            height: 1,
        },
        shadowRadius: 10,
        width: Dimensions.get('screen'),
        margin: 20,
        backgroundColor: '#fff',
        borderRadius: 20,
    },
    event_image: {
        width: '100%',
        aspectRatio: 5/2,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    event_info: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        flexWrap: 'wrap'
    },
    event_buttons: {
        flexDirection: 'row',
        gap: 20,
        alignItems: 'center',
        marginTop: 20
    },
    event_square_button: {
        height: 50,
        aspectRatio: 1/1,
        borderRadius: 99,
        borderColor: '#ddd',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    event_primary_button: {
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
        padding: 20,
        backgroundColor: config.primaryColor,
        paddingTop: 60,
        position: 'absolute',
        top: 0,left: 0,right: 0,
        gap: 20,
    }
})

export default City;