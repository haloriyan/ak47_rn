import React, { useEffect, useState } from "react";
import Teks from "../../components/Teks";
import Icon from "react-native-vector-icons/MaterialIcons";
import { ActivityIndicator, Image, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import axios from "axios";
import config from "../../config";
import Currency from "../../components/Currency";
import Button from "../../components/AK/Button";
import Popup from "../../components/AK/Popup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";

const EventDetail = ({navigation, route}) => {
    const { id } = route.params;
    const [isLoading, setLoading] = useState(true);
    const [event, setEvent] = useState(null);
    const [headerMargin, setHeaderMargin] = useState(-70);
    const [pos, setPos] = useState(pos);
    const [carts, setCarts] = useState([]);
    const [isLoggedIn, setLoggedIn] = useState(null);

    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            setLoggedIn(null);
        }
    }, [isFocused]);

    useEffect(() => {
        if (isLoggedIn === null) {
            AsyncStorage.getItem('user_token').then(value => {
                setLoggedIn(value !== null);
            })
        }
    }, [isLoggedIn])

    useEffect(() => {
        if (isLoading) {
            setLoading(false);
            axios.get(`${config.baseUrl}/api/event/${id}`)
            .then(response => {
                let res = response.data;
                setEvent(res.event);
            })
        }
    }, [isLoading, id]);

    const handleScroll = event => {
        let p = event.nativeEvent.contentOffset.y;
        if (headerMargin < -5) {
            setHeaderMargin(headerMargin + p / 70);
        }
        if (pos > p) {
            if (headerMargin > -95) {
                setHeaderMargin(headerMargin - p / 50);
            }
        }
        setPos(p);
    }

    const increaseCart = ticketID => {
        let crts = [...carts];
        crts.map((cart, c) => {
            if (cart.ticket_id === ticketID) {
                let newQty = cart.quantity + 1;
                if (newQty < 5) {
                    crts[c]['quantity'] = newQty;
                    crts[c]['total'] = newQty * cart.price;
                }
            }
        });
        setCarts(crts);
    }
    const decreaseCart = ticketID => {
        let crts = [...carts];
        crts.map((cart, c) => {
            if (cart.ticket_id === ticketID) {
                let newQty = cart.quantity - 1;
                if (newQty > 0) {
                    crts[c]['quantity'] = newQty;
                    crts[c]['total'] = newQty * cart.price;
                }
            }
        });
        setCarts(crts);
    }

    return (
        <React.Fragment>
            <ScrollView bounces={false} contentContainerStyle={styles.container} scrollEventThrottle={16} onScroll={handleScroll}>
                <View style={styles.top_area}>
                    {
                        event === null &&
                        <ActivityIndicator />
                    }
                </View>
                {
                    event !== null &&
                    <View style={styles.content}>
                        <Image source={{uri: `${config.baseUrl}/storage/event_covers/${event.cover}`}} style={styles.event_cover} />
                        <Teks size={22} family="Inter_700Bold">{event.title}</Teks>
                        <Teks style={{marginTop: 20}}>
                            {event.description}
                        </Teks>

                        <View style={styles.organizer}>
                            <Image style={styles.organizer_icon} source={{uri: `${config.baseUrl}/storage/organizer_icons/${event.organizer.icon}`}} />
                            <View style={{flexGrow: 1}}>
                                <Teks size={12} color="#999">Diselenggarakan Oleh</Teks>
                                <Teks size={16} family="Inter_700Bold" style={{marginTop: 5}}>{event.organizer.name}</Teks>
                            </View>
                        </View>

                        <Teks size={22} family="Inter_700Bold" style={{marginTop: 20}}>Tiket</Teks>
                        
                        {
                            event.tickets.map((ticket, t) => (
                                <View key={t} style={styles.ticket_card}>
                                    <View style={styles.ticket_info}>
                                        <Teks size={18} family="Inter_700Bold" style={{flexGrow: 1}}>{ticket.name}</Teks>
                                        <Teks size={18} family="Inter_700Bold" color={config.primaryColor}>{Currency(ticket.price).encode()}</Teks>
                                    </View>
                                    <View style={styles.ticket_footer}>
                                        {
                                            carts.some(data => data.ticket_id === ticket.id) ?
                                                <View style={styles.quantity_control}>
                                                    <TouchableOpacity style={styles.quantity_button} onPress={() => decreaseCart(ticket.id)}>
                                                        <Icon name="remove" color={config.primaryColor} size={12} />
                                                    </TouchableOpacity>
                                                    {
                                                        carts.map((cart, c) => {
                                                            if (cart.ticket_id === ticket.id) {
                                                                return (
                                                                    <Teks key={c}>{cart.quantity}</Teks>
                                                                )
                                                            }
                                                        })
                                                    }
                                                    <TouchableOpacity style={styles.quantity_button} onPress={() => increaseCart(ticket.id)}>
                                                        <Icon name="add" color={config.primaryColor} size={12} />
                                                    </TouchableOpacity>
                                                </View>
                                            :
                                            <TouchableOpacity style={styles.cart_add_button} onPress={() => {
                                                let crts = [...carts];
                                                crts.push({
                                                    ticket_id: ticket.id,
                                                    quantity: 1,
                                                    name: ticket.name,
                                                    holder: null,
                                                    price: ticket.price,
                                                    total: ticket.price,
                                                })
                                                setCarts(crts);
                                            }}>
                                                <Teks size={12} family="Inter_700Bold" color="#fff">Pilih Tiket</Teks>
                                            </TouchableOpacity>
                                        }
                                    </View>
                                </View>
                            ))
                        }
                    </View>
                }
            </ScrollView>
            {
                carts.length > 0 &&
                <View style={styles.summary}>
                    <View style={{flexGrow: 1}}>
                        <Teks color="#777" size={10}>Total</Teks>
                        <Teks size={14} family="Inter_700Bold" color={config.primaryColor} style={{marginTop: 4}}>
                            {Currency(carts.reduce((accumulator, data) => accumulator + data.total, 0)).encode()}
                        </Teks>
                    </View>
                    {
                        isLoggedIn ?
                            <Button style={{paddingRight: 20,paddingLeft: 20,height: 40}} onPress={() => navigation.navigate('Checkout', {
                                carts: carts,
                                event: event
                            })}>
                                Checkout
                            </Button>
                        :
                        <TouchableOpacity onPress={() => navigation.navigate('SettingNavigator', {
                            screen: 'Settings'
                        })}>
                            <Teks color={config.primaryColor} family="Inter_700Bold">Login untuk Beli Tiket</Teks>
                        </TouchableOpacity>
                    }
                </View>
            }
            <View style={{
                ...styles.header,
                marginTop: headerMargin
            }}>
                <TouchableOpacity>
                    <Icon name="west" color={'#fff'} size={20} />
                </TouchableOpacity>
                {
                    event !== null &&
                    <Teks size={14} color="#fff">{event.title.substring(0, 35)}</Teks>
                }
            </View>
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    top_area: {
        backgroundColor: config.primaryColor,
        height: 150
    },
    container: {
        backgroundColor: '#fff',
        flexGrow: 1,
    },
    content: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
        padding: 20,
        marginTop: -20
    },
    event_cover: {
        width: '100%',
        aspectRatio: 5/2,
        backgroundColor: '#eee',
        borderRadius: 12,
        marginTop: -80,
        marginBottom: 20,
    },
    ticket_card: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 20,
        marginTop: 20,
    },
    ticket_info: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    ticket_footer: {
        marginTop: 20,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        alignItems: 'flex-end'
    },
    header: {
        position: 'absolute',
        top: 0,left: 0,right: 0,
        padding: 20,
        paddingTop: 50,
        flexDirection: 'row',
        gap: 20,
        backgroundColor: config.primaryColor,
    },
    organizer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
        backgroundColor: '#fff',
        padding: 20,
        marginTop: 40,
        marginBottom: 40,
        borderRadius: 12,
        
        shadowColor: '#dddddd',
        shadowOpacity: 0.8,
        shadowOffset: {
            width: 1,
            height: 1,
        },
        shadowRadius: 10,
    },
    organizer_icon: {
        height: 50,
        aspectRatio: 1/1,
        borderRadius: 999,
        backgroundColor: '#eee',
    },
    cart_add_button: {
        backgroundColor: config.primaryColor,
        padding: 10,
        paddingLeft: 15,paddingRight: 15,
        borderRadius: 8
    },
    quantity_control: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    quantity_button: {
        padding: 5,
        paddingLeft: 15,paddingRight: 15,
        borderWidth: 1,
        borderColor: config.primaryColor,
        borderRadius: 6
    },
    summary: {
        backgroundColor: '#fff',
        padding: 20,
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
        flexDirection: 'row',
        gap: 20,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#ddd'
    }
})

export default EventDetail;