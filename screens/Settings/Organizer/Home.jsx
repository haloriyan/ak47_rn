import React, { useEffect, useState } from "react";
import Teks from "../../../components/Teks";
import Icon from "react-native-vector-icons/MaterialIcons";
import axios from "axios";
import config from "../../../config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, Image, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import StatusBar from "../../../components/StatusBar";
import FAB from "../../../components/AK/FAB";
import { useIsFocused } from "@react-navigation/native";
import Initial from "../../../components/Initial";
import Currency from "../../../components/Currency";
import moment from "moment";
import Popup from "../../../components/AK/Popup";

const PackageBadge = ({pkg}) => {
    return (
        <View style={styles.badge_area}>
            <Teks color={'#fff'} size={10}>{pkg.name}</Teks>
        </View>
    )
}

const OrganizerHome = ({route, navigation}) => {
    const { organizerID } = route.params;
    const [isLoading, setLoading] = useState(true);
    const [triggerLoading, setTriggerLoading] = useState(false);
    const [isLoadingTeam, setLoadingTeam] = useState(true);
    const [isLoadingEvent, setLoadingEvent] = useState(true);
    const isFocused = useIsFocused();
    const [token, setToken] = useState(null);
    const [organizer, setOrganizer] = useState(null);
    const [teams, setTeams] = useState([]);
    const [events, setEvents] = useState([]);
    const [event, setEvent] = useState(null);
    const [viewing, setViewing] = useState('event');

    const [deleting, setDeleting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (token === null) {
            AsyncStorage.getItem('user_token').then(value => setToken(value));
        }
    }, [token]);

    useEffect(() => {
        if (isFocused) {
            setLoading(true);
            setTriggerLoading(true);
            setLoadingTeam(true);
            setLoadingEvent(true);
        }
    }, [isFocused])

    useEffect(() => {
        if (isLoading && triggerLoading && token !== null) {
            setTriggerLoading(false);
            axios.post(`${config.baseUrl}/api/organizer/${organizerID}/profile`, {
                token
            })
            .then(response => {
                let res = response.data;
                console.log(res);
                setLoading(false);
                setOrganizer(res.organizer);
                setLoadingTeam(true);
            })
        }
    }, [isLoading, triggerLoading, token]);

    useEffect(() => {
        if (isLoadingTeam && token !== null) {
            setLoadingTeam(false);
            axios.post(`${config.baseUrl}/api/organizer/${organizerID}/team`, {
                token: token,
            })
            .then(response => {
                let res = response.data;
                setTeams(res.teams);
            })
        }
    }, [isLoadingTeam, token]);

    useEffect(() => {
        if (isLoadingEvent && token !== null) {
            setLoadingEvent(false);
            axios.post(`${config.baseUrl}/api/organizer/${organizerID}/event`, {
                token: token
            })
            .then(response => {
                let res = response.data;
                setEvents(res.events);
            })
        }
    }, [isLoadingEvent, token]);

    const doDelete = () => {
        axios.post(`${config.baseUrl}/api/organizer/${organizerID}/event/${event.id}/delete`, {
            token: token
        })
        .then(response => {
            let res = response.data;
            if (res.status === 200) {
                setDeleting(false);
                setLoadingEvent(true);
            }
        })
    }

    return (
        <React.Fragment>
            <StatusBar />
            {
                organizer === null ?
                    <ActivityIndicator />
                :
                <ScrollView contentContainerStyle={{flexGrow: 1}} refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={() => {
                        setLoading(true);
                        setTriggerLoading(true);
                    }} />
                }>
                    <Image 
                        source={{uri: `${config.baseUrl}/storage/organizer_covers/${organizer.cover}`}} 
                        style={styles.cover}
                    />
                    <View style={styles.content}>
                        <View style={{flexDirection: 'row',alignItems: 'flex-end'}}>
                            <View style={{flexGrow: 1}}>
                                <Image 
                                    source={{uri: `${config.baseUrl}/storage/organizer_icons/${organizer.icon}`}} 
                                    style={styles.icon}
                                />
                            </View>
                            <TouchableOpacity style={{marginBottom: 20}} onPress={() => navigation.navigate('OrganizerSettings', {
                                organizerID: organizerID
                            })}>
                                <Icon name='settings' size={24} color={config.primaryColor} />
                            </TouchableOpacity>
                        </View>

                        <View style={{height: 20}}></View>
                        <View style={{flexDirection: 'row',alignItems: 'center',gap: 20}}>
                            <Teks size={20} family="Inter_700Bold">{organizer.name}</Teks>
                            <PackageBadge pkg={organizer.membership.package} />
                        </View>
                        <Teks size={12} style={{marginTop: 10}}>{organizer.description}</Teks>

                        <View style={styles.tab_area}>
                            <TouchableOpacity style={viewing === 'event' ? {...styles.tab_item, ...styles.tab_item_active} : styles.tab_item} onPress={() => setViewing('event')}>
                                <Teks family={viewing === 'event' ? 'Inter_700Bold' : 'Inter_400Regular'} color={config.primaryColor}>Event</Teks>
                            </TouchableOpacity>
                            <TouchableOpacity style={viewing === 'team' ? {...styles.tab_item, ...styles.tab_item_active} : styles.tab_item} onPress={() => setViewing('team')}>
                                <Teks family={viewing === 'team' ? 'Inter_700Bold' : 'Inter_400Regular'} color={config.primaryColor}>Team</Teks>
                            </TouchableOpacity>
                            <TouchableOpacity style={viewing === 'billing' ? {...styles.tab_item, ...styles.tab_item_active} : styles.tab_item} onPress={() => setViewing('billing')}>
                                <Teks family={viewing === 'billing' ? 'Inter_700Bold' : 'Inter_400Regular'} color={config.primaryColor}>Billing</Teks>
                            </TouchableOpacity>
                        </View>

                        {
                            viewing === 'event' &&
                            <View>
                                {
                                    events.map((evt, e) => (
                                        <View key={e} style={styles.event_item}>
                                            <Image source={{uri: `${config.baseUrl}/storage/event_covers/${evt.cover}`}} style={styles.event_cover} />
                                            <View style={{padding: 20}}>
                                                <Teks size={16} family="Inter_700Bold">{evt.title}</Teks>
                                                <View style={styles.event_info_area}>
                                                    <View style={styles.event_info}>
                                                        <Image style={styles.event_info_icon} source={require('../../../assets/icons/moneys.png')} />
                                                        <Teks size={11} color="#777">{Currency(evt.tickets[0].price).encode()}</Teks>
                                                    </View>
                                                    <View style={styles.event_info}>
                                                        <Image style={styles.event_info_icon} source={require('../../../assets/icons/calendar-2.png')} />
                                                        <Teks size={11} color="#777">{moment(evt.start).format('DD MMM')}</Teks>
                                                    </View>
                                                    <View style={styles.event_info}>
                                                        <Image style={styles.event_info_icon} source={require('../../../assets/icons/location.png')} />
                                                        <Teks length={10} size={11} color="#777" limit={20}>{evt.city}</Teks>
                                                    </View>
                                                </View>

                                                <View style={styles.event_button_area}>
                                                    <TouchableOpacity style={styles.event_button_left} onPress={() => {
                                                        setEvent(evt);
                                                        setDeleting(true);
                                                    }}>
                                                        <Image source={require('../../../assets/icons/trash.png')} style={{width: 24,height: 24}} />
                                                    </TouchableOpacity>
                                                    <TouchableOpacity style={styles.event_button_right} onPress={() => {
                                                        navigation.navigate('EventOverview', {
                                                            event: evt
                                                        })
                                                    }}>
                                                        <Teks color="#fff">Detail</Teks>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                    ))
                                }
                            </View>
                        }
                        {
                            viewing === 'team' &&
                            <View>
                                {
                                    teams.map((team, t) => (
                                        <View style={styles.team_item} key={t}>
                                            <Initial name={team.user.name} />
                                            <View style={{flexGrow: 1}}>
                                                <Teks size={16} family="Inter_700Bold">{team.user.name}</Teks>
                                                <Teks size={12} color="#777" style={{marginTop: 5}}>{team.role}</Teks>
                                            </View>
                                            <TouchableOpacity>
                                                <Image source={require('../../../assets/icons/more.png')} style={{width: 28,height: 28}} />
                                            </TouchableOpacity>
                                        </View>
                                    ))
                                }
                            </View>
                        }
                        {
                            viewing === 'billing' &&
                            <View>
                                <Teks>Billing</Teks>
                            </View>
                        }
                        {
                            deleting &&
                            <Popup visible={deleting} onDismiss={() => setDeleting(false)} style={{padding: 20}}>
                                <Teks size={20} family="Inter_700Bold">Hapus Event</Teks>
                                {
                                    isDeleting ?
                                        <View style={{gap: 20,marginTop: 20}}>
                                            <ActivityIndicator size={32} />
                                            <Teks>Menghapus {event.title}</Teks>
                                        </View>
                                    :
                                    <>
                                        <Image source={{uri: `${config.baseUrl}/storage/event_covers/${event.cover}`}} style={{
                                            ...styles.event_cover,
                                            borderRadius: 12,
                                            marginTop: 20,
                                            marginBottom: 20,
                                        }} />
                                        <Teks>Tindakan ini tidak dapat dibatalkan dan akan menghapus semua data terkait</Teks>
                                        <View style={styles.popup_footer}>
                                            <TouchableOpacity onPress={() => setDeleting(false)}>
                                                <Teks color={'#777'}>batal</Teks>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => {
                                                setIsDeleting(true)
                                                doDelete();
                                            }}>
                                                <Teks color={config.colors.red} family="Inter_700Bold">Hapus</Teks>
                                            </TouchableOpacity>
                                        </View>
                                    </>
                                }
                            </Popup>
                        }
                    </View>
                </ScrollView>
            }
            <FAB
                icon={'add'}
                onPress={() => {
                    if (viewing === 'event') {
                        console.log('navigating');
                        navigation.navigate('CreateEvent', {
                            organizerID: organizerID
                        })
                    } else if (viewing === 'team') {
                        // 
                    } else {
                        // 
                    }
                }}
            />
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    cover: {
        width: '100%',
        aspectRatio: 16/9,
    },
    content: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        padding: 20,
        marginTop: -20,
        flexGrow: 1
    },
    icon: {
        height: 120,
        aspectRatio: 1/1,
        borderRadius: 999,
        borderWidth: 10,
        borderColor: '#fff',
        marginTop: -80
    },
    tab_area: {
        marginTop: 20,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    tab_item: {
        padding: 15,
        paddingLeft: 30,paddingRight: 30,
        borderRadius: 8
    },
    tab_item_active: {
        backgroundColor: `${config.primaryColor}30`
    },
    team_item: {
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 20,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20
    },
    event_item: {
        borderRadius: 20,
        borderBottomWidth: 6,
        borderBottomColor: `${config.primaryColor}25`,
        marginBottom: 20
    },
    event_cover: {
        width: '100%',
        aspectRatio: 5/2,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: '#ddd'
    },
    event_info_area: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
        marginTop: 20
    },
    event_info: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        flexGrow: 1
    },
    event_info_icon: {
        width: 24,
        height: 24
    },
    event_button_left: {
        height: 50,
        aspectRatio: 1/1,
        borderRadius: 999,
        borderColor: '#ddd',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    event_button_area: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginTop: 20,
    },
    event_button_right: {
        height: 50,
        flexGrow: 1,
        backgroundColor: config.primaryColor,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center'
    },
    popup_footer: {
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        paddingTop: 20,
        marginTop: 20,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
        justifyContent: 'flex-end'
    },
    badge_area: {
        padding: 5,
        paddingLeft: 12,paddingRight: 12,
        borderRadius: 8,
        backgroundColor: `${config.primaryColor}`
    }
})

export default OrganizerHome;