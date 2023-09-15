import React, { useEffect, useRef, useState } from "react";
import Teks from "../../components/Teks";
import Svg, { Path } from "react-native-svg";
import { StyleSheet, TouchableOpacity, View, TextInput, ScrollView, ActivityIndicator, RefreshControl, Image } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import config from "../../config";
import axios from "axios";
import Button from "../../components/AK/Button";
import Currency from "../../components/Currency";
import moment from "moment";
import Wishlist from "../../components/Wishlist";
import { useDebouncedCallback } from "use-debounce";
import Popup from "../../components/AK/Popup";
import { Dropdown, Option } from "../../components/AK/Dropdown";

const Search = ({navigation, route}) => {
    const { topics_param, cities_param } = route.params;

    const [filterShown, showFilter] = useState(false);
    const [isLoading, setLoading] = useState(true);
    const [triggerLoading, setTriggerLoading] = useState(true);
    const [showNext, setShowNext] = useState(true);
    const [events, setEvents] = useState([]);
    const [cities, setCities] = useState([]);
    const [topics, setTopics] = useState([]);

    const [q, setQ] = useState('');
    const [topic, setTopic] = useState('');
    const [city, setCity] = useState('');
    const [page, setPage] = useState(1);
    const pageRef = useRef(1);

    useEffect(() => {
        if (cities.length === 0) {
            let cts = cities_param;
            cts.unshift({name: ''});
            setCities(cts);
        }
    }, [cities, cities_param]);
    useEffect(() => {
        if (topics.length === 0) {
            let cts = topics_param;
            cts.unshift({name: ''});
            setTopics(cts);
        }
    }, [topics, topics_param]);

    useEffect(() => {
        if (isLoading && triggerLoading) {
            setTriggerLoading(false);
            axios.post(`${config.baseUrl}/api/event/search?page=${page}`, {
                q: q,
                topic: topic,
                city: city
            })
            .then(response => {
                setLoading(false);
                let res = response.data;
                let datas = [];
                if (pageRef.current < page + 1) {
                    // nexting
                    res.events.data.map(evt => {
                        datas.push(evt);
                    })
                    
                    pageRef.current = page;
                } else {
                    datas = res.events.data;
                }
                setEvents(datas);
                if (res.events.next_page_url === null) {
                    setShowNext(false);
                }
            })
        }
    }, [isLoading, triggerLoading, q, pageRef.current, page]);

    const next = () => {
        setPage(page + 1);
        setLoading(true);
        setTriggerLoading(true);
    }

    const debounced = useDebouncedCallback(() => {
        setPage(1);
        setEvents([]);
        setLoading(true);
        setTriggerLoading(true);
    }, 2000)

    return (
        <React.Fragment>
            <View style={styles.header}>
                <View style={styles.SearchArea}>
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
                    <TextInput style={styles.SearchInput} value={q} placeholder="Cari event..." onChangeText={e => {
                        setQ(e);
                        debounced()
                    }} />
                </View>
                <TouchableOpacity style={styles.filter_button} onPress={() => showFilter(true)}>
                    <Icon name="filter-alt" color={config.primaryColor} size={24} />
                </TouchableOpacity>
            </View>
            <ScrollView style={styles.container} refreshControl={
                <RefreshControl refreshing={isLoading} onRefresh={() => {
                    setLoading(true);
                    setTriggerLoading(true);
                }} />
            }>
                {
                    events.length > 0 &&
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
                }

                {
                    showNext &&
                    <Button onPress={next}>Lihat lebih banyak</Button>
                }

                <View style={{height: 80}}></View>
            </ScrollView>

            {
                showFilter &&
                <Popup onDismiss={() => showFilter(false)} visible={filterShown} style={styles.FilterStyle} overlayStyle={{alignContent: 'flex-end'}}>
                    <Teks size={20} family="Inter_700Bold">Cari event yang spesifik</Teks>
                    <View style={styles.filter_item}>
                        <View style={{flexGrow: 1}}>
                            <Teks>Lokasi</Teks>
                        </View>
                        {
                            topics.length > 0 &&
                            <Dropdown placeholder="Semua Lokasi" value={city} setValue={setCity} style={{height: 50,marginBottom: 0,marginTop: 20,paddingLeft: 25,paddingRight: 25,}}>
                                {
                                    cities.map((top, t) => (
                                        <Option key={t}>{top.name === '' ? 'Semua' : top.name}</Option>
                                    ))
                                }
                            </Dropdown>
                        }
                    </View>
                    <View style={styles.filter_item}>
                        <View style={{flexGrow: 1}}>
                            <Teks>Topik</Teks>
                        </View>
                        {
                            topics.length > 0 &&
                            <Dropdown placeholder="Semua Topik" value={topic} setValue={setTopic} style={{height: 50,marginBottom: 20,marginTop: 20,paddingLeft: 25,paddingRight: 25,}}>
                                {
                                    topics.map((top, t) => (
                                        <Option key={t} value={top.name}>{top.name === '' ? 'Semua' : top.name}</Option>
                                    ))
                                }
                            </Dropdown>
                        }
                    </View>

                    <Button onPress={() => {
                        setPage(1);
                        showFilter(false);
                        setLoading(true);
                        setTriggerLoading(true);
                    }}>Terapkan</Button>
                </Popup>
            }
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: `${config.primaryColor}90`,
        padding: 20,
        paddingTop: 50,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
        paddingBottom: 60,
    },
    filter_button: {
        height: 50,
        aspectRatio: 1/1,
        borderRadius: 999,
        backgroundColor: '#fff',
        alignItems: 'center',justifyContent: 'center',
    },
    SearchArea: {
        backgroundColor: '#fff',
        flexGrow: 1,
        height: 50,
        borderRadius: 999,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 20,
        paddingRight: 20,
        gap: 20,
    },
    container: {
        backgroundColor: '#fff',
        padding: 20,
        flexGrow: 1,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop: -25,
    },
    event_card: {
        borderRadius: 12,
        marginBottom: 20,
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
    SearchInput: {
        flexGrow: 1,
        height: 48
    },
    filter_item: {
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'center',
        gap: 20,
    },
    FilterStyle: {
        width: '100%',
        padding: 20,
        paddingBottom: 40,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    }
})

export default Search;