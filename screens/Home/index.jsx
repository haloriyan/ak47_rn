import React, { useEffect, useState } from "react";
import { StyleSheet, View, Image, TouchableOpacity, ScrollView, RefreshControl, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Svg, { Path } from "react-native-svg";
import Teks from "../../components/Teks";
import axios from "axios";
import config from "../../config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Currency from "../../components/Currency";
import moment from "moment";
import Base64 from "../../components/Base64";
import Wishlist from "../../components/Wishlist";

const Home = ({navigation}) => {
    const [token, setToken] = useState(null);
    const [isLoadingCategories, setLoadingCategories] = useState(true);
    const [isLoadingFeatured, setLoadingFeatured] = useState(true);
    const [isLoadingCities, setLoadingCities] = useState(false);
    const [isLoadingTopics, setLoadingTopics] = useState(false);
    const [isLoadingByTopic, setLoadingByTopic] = useState(false);
    
    const [categories, setCategories] = useState([]);
    const [featured, setFeatured] = useState([]);
    const [eventsByTopic, setEventsByTopic] = useState([]);
    const [cities, setCities] = useState([]);
    const [topics, setTopics] = useState([]);
    const categoryWidth = `${(100 - 3 * 20) / 4}%`;

    const [topic, setTopic] = useState('');

    useEffect(() => {
        if (token === null) {
            AsyncStorage.getItem('user_token').then(value => {
                setToken(value === null ? 'unauthorized' : value);
            })
        }
    }, [token]);

    useEffect(() => {
        if (isLoadingCategories) {
            setLoadingCategories(false);
            axios.get(`${config.baseUrl}/api/category`)
            .then(response => {
                let res = response.data;
                setCategories(res.categories);
            })
        }
    }, [isLoadingCategories]);

    useEffect(() => {
        if (isLoadingFeatured && token !== null) {
            setLoadingFeatured(false);
            axios.post(`${config.baseUrl}/api/event/featured`, {
                token: token,
            })
            .then(response => {
                let res = response.data;
                setFeatured(res.events);
                setLoadingCities(true);
            })
        }
    }, [isLoadingFeatured, token]);

    useEffect(() => {
        if (isLoadingCities) {
            setLoadingCities(false);
            axios.get(`${config.baseUrl}/api/city`)
            .then(response => {
                let res = response.data;
                setCities(res.cities);
                setLoadingTopics(true);
            });
        }
    }, [isLoadingCities]);

    useEffect(() => {
        if (isLoadingTopics) {
            setLoadingTopics(false);
            axios.get(`${config.baseUrl}/api/topic`)
            .then(response => {
                let res = response.data;
                setTopics(res.topics);
                setLoadingByTopic(true);
            });
        }
    }, [isLoadingTopics]);

    useEffect(() => {
        if (isLoadingByTopic) {
            setLoadingByTopic(false);
            axios.post(`${config.baseUrl}/api/event/search`, {
                topic: topic
            })
            .then(response => {
                let res = response.data;
                setEventsByTopic(res.events.data);
            })
        }
    }, [isLoadingByTopic]);

    return (
        <React.Fragment>
            <View style={styles.header}>
                <View style={styles.header_logo_area}>
                    <Image style={styles.header_logo} source={require('../../assets/logo.png')} />
                </View>
                <TouchableOpacity style={styles.header_button} onPress={() => navigation.navigate('Wishlist')}>
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
                <TouchableOpacity style={styles.header_button} onPress={() => navigation.navigate('Search', {
                    topics_param: topics,
                    cities_param: cities
                })}>
                    <Svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        fill="none"
                    >
                        <Path
                        stroke="#E5214F"
                        d="M11.5 21a9.5 9.5 0 1 0 0-19 9.5 9.5 0 0 0 0 19zM22 22l-2-2"
                        />
                    </Svg>
                </TouchableOpacity>
            </View>
            <ScrollView nestedScrollEnabled contentContainerStyle={styles.content} refreshControl={
                <RefreshControl onRefresh={() => {
                    setLoadingFeatured(true);
                }} refreshing={(isLoadingCategories.length > 0)} />
            }>
                <View style={styles.category_area}>
                    {
                        categories.length > 0 &&
                        categories.map((category, c) => (
                            <TouchableOpacity key={c} style={{...styles.category_item, width: categoryWidth}} onPress={() => navigation.navigate('Category', {
                                id: category.id,
                                name: category.name,
                                icon: category.icon
                            })}>
                                <View style={styles.category_icon_area}>
                                    <Image style={styles.category_icon} source={{uri: `${config.baseUrl}/storage/category_icons/${category.icon}`}} />
                                </View>
                                <Teks size={12}>{category.name}</Teks>
                            </TouchableOpacity>
                        ))
                    }
                </View>

                <Teks family="Inter_900Black" size={20} style={{margin: 20,marginBottom: 0}}>Diselenggarakan untukmu</Teks>
                <ScrollView horizontal contentContainerStyle={{flexGrow: 0}} showsHorizontalScrollIndicator={false}>
                    {
                        featured.map((event, e) => (
                            <View key={e} style={styles.featured_item}>
                                <Image source={{uri: `${config.baseUrl}/storage/event_covers/${event.cover}`}} style={styles.featured_image} />
                                <View style={{padding: 20}}>
                                    <View style={styles.featured_info}>
                                        <View style={{flexGrow: 1,flexBasis: '70%'}}>
                                            <Teks size={14} family="Inter_700Bold">{event.title}</Teks>
                                            <View style={{...styles.featured_info, marginTop: 5}}>
                                                <Image source={require('../../assets/icons/location.png')} style={{width: 24,height: 24}} />
                                                <Teks size={12} color="#666">{event.city}</Teks>
                                            </View>
                                        </View>
                                        <View>
                                            <Teks size={24} family="Inter_700Bold" color={config.primaryColor}>{moment(event.start).format('DD')}</Teks>
                                            <Teks size={12} color={config.primaryColor}>{moment(event.start).format('MMM')}</Teks>
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
                    }
                </ScrollView>

                <View style={{flexDirection: 'row',gap: 10,alignItems: 'center',padding: 20}}>
                    <Icon name="location-on" color={config.primaryColor} size={24} />
                    <Teks family="Inter_900Black" size={20} style={{flexGrow: 1}}>Jelajahi Kotamu</Teks>
                </View>
                <ScrollView horizontal contentContainerStyle={{flexGrow: 0,gap: 20,padding: 20}} showsHorizontalScrollIndicator={false}>
                    {
                        cities.map((city, c) => (
                            <TouchableOpacity key={c} style={styles.city_item} onPress={() => {
                                if (city.event_count > 0) {
                                    navigation.navigate('City', {
                                        name: Base64.btoa(city.name)
                                    })
                                }
                            }}>
                                <Image style={styles.city_cover} source={{uri: `${config.baseUrl}/storage/city_covers/${city.cover}`}} />
                                <View style={styles.city_overlay}>
                                    <Teks color="#fff" size={14} family="Inter_700Bold">{city.name}</Teks>
                                    <Teks color="#fff" size={12} style={{marginTop: 5}}>{city.event_count} event</Teks>
                                </View>
                            </TouchableOpacity>
                        ))
                    }
                </ScrollView>

                <View style={{flexDirection: 'row',gap: 10,alignItems: 'center',padding: 20,paddingBottom: 0}}>
                    <Icon name="location-on" color={config.primaryColor} size={24} />
                    <Teks family="Inter_900Black" size={20} style={{flexGrow: 1}}>Cari event yang membahas...</Teks>
                </View>

                <ScrollView horizontal contentContainerStyle={{flexGrow: 0,gap: 10,padding: 20}} showsHorizontalScrollIndicator={false}>
                    <TouchableOpacity style={{
                        ...styles.topic_item,
                        backgroundColor: topic === '' ? `${config.primaryColor}30`: '#fff',
                        borderColor: topic === '' ? `${config.primaryColor}`: '#ddd',
                    }} onPress={() => {
                        setTopic('');
                        setLoadingByTopic(true);
                    }}>
                        <Teks color={topic === '' ? config.primaryColor : '#333'}>Semua</Teks>
                    </TouchableOpacity>
                    {
                        topics.map((top, t) => (
                            <TouchableOpacity key={t} style={{
                                ...styles.topic_item,
                                backgroundColor: topic === top.name ? `${config.primaryColor}30`: '#fff',
                                borderColor: topic === top.name ? `${config.primaryColor}`: '#ddd',
                            }} onPress={() => {
                                setTopic(top.name);
                                setLoadingByTopic(true);
                            }}>
                                <Image style={styles.topic_icon} source={{uri: `${config.baseUrl}/storage/topic_icons/${top.icon}`}} />
                                <Teks color={topic === top.name ? config.primaryColor : '#333'}>{top.name}</Teks>
                            </TouchableOpacity>
                        ))
                    }
                </ScrollView>
                <ScrollView horizontal contentContainerStyle={{flexGrow: 0}} showsHorizontalScrollIndicator={false}>
                    {
                        eventsByTopic.map((event, e) => (
                            <TouchableOpacity style={styles.event_card} key={e} onPress={() => navigation.navigate('EventDetail', {
                                id: event.id
                            })}>
                                <Image source={{uri: `${config.baseUrl}/storage/event_covers/${event.cover}`}} style={styles.event_cover} />
                                <View style={{padding: 20}}>
                                    <Teks size={16} family="Inter_700Bold">{event.title.substring(0, 35)}</Teks>
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

                                    <View style={styles.organizer}>
                                        <Image source={{uri: `${config.baseUrl}/storage/organizer_icons/${event.organizer.icon}`}} style={styles.organizer_icon} />
                                        <Teks>{event.organizer.name}</Teks>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))
                    }
                </ScrollView>

                <View style={{height: 40}}></View>
            </ScrollView>
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    header: {
        padding: 15,
        paddingTop: 45,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: '#ff',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: '#fff'
    },
    header_logo: {
        height: 32,
        width: 152,
    },
    header_logo_area: {
        flexGrow: 1,
    },
    header_button: {
        height: 50,
        aspectRatio: 1/1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center'
    },
    content: {
        backgroundColor: '#fff',
        flexGrow: 1
    },
    category_area: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 20,
        gap: 20,
        marginTop: 10,
    },
    category_item: {
        // flexGrow: 1,
        flexBasis: 1,
        minWidth: '18%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    category_icon_area: {
        width: '100%',
        aspectRatio: 1/1,
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 10,
        shadowColor: '#dddddd',
        shadowOpacity: 0.8,
        shadowOffset: {
            width: 1,
            height: 1,
        },
        shadowRadius: 10,
        padding: 20,
    },
    category_icon: {
        aspectRatio: 1/1,
    },
    city_item: {
        width: (33 / 100 * Dimensions.get('screen').width),
        aspectRatio: 9/16,
    },
    city_cover: {
        width: '100%',
        aspectRatio: 9/16,
        borderRadius: 8,
    },
    city_overlay: {
        position: 'absolute',
        top: 0,left: 0,right: 0,bottom: 0,
        borderRadius: 8,
        backgroundColor: `${config.primaryColor}40`,
        padding: 10,
        justifyContent: 'flex-end'
    },
    featured_item: {
        shadowColor: '#dddddd',
        shadowOpacity: 1,
        shadowOffset: {
            width: 1,
            height: 1,
        },
        shadowRadius: 10,
        width: 280,
        margin: 20,
        backgroundColor: '#fff',
        borderRadius: 20,
    },
    featured_image: {
        width: '100%',
        aspectRatio: 5/2,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    featured_info: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        flexWrap: 'wrap'
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
    topic_item: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 99,
        gap: 10,
        borderColor: '#ddd',
        borderWidth: 0.5,
        paddingLeft: 20,paddingRight: 20,
    },
    topic_icon: {
        width: 18,
        height: 18,
    },
    event_card: {
        borderRadius: 12,
        marginBottom: 20,
        borderBottomWidth: 6,
        borderBottomColor: `${config.primaryColor}30`,
        maxWidth: 250,
        marginLeft: 20,
    },
    event_cover: {
        width: '100%',
        aspectRatio: 5/2,
        backgroundColor: '#eee',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    event_info_area: {
        flexDirection: 'column',
        marginTop: 15
    },
    event_info: {
        flexGrow: 1,
        flexDirection: 'row',
        alignItems: 'center',
        height: 30,
        gap: 10,
    },
    organizer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
        marginTop: 20
    },
    organizer_icon: {
        width: 35,
        aspectRatio: 1/1,
        backgroundColor: '#eee',
        borderRadius: 99
    }
})

export default Home;