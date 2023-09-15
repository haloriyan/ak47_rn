import React, { useEffect, useState } from "react";
import Teks from "../../components/Teks";
import { Image, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import config from "../../config";
import Currency from "../../components/Currency";

const Order = ({navigation}) => {
    const [token, setToken] = useState(null);
    const [isLoggedIn, setLoggedIn] = useState(true);
    const [isLoading, setLoading] = useState(true);
    const [isLoadingHistory, setLoadingHistory] = useState(false);
    const [triggerLoading, setTriggerLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        if (token === null) {
            AsyncStorage.getItem('user_token').then(value => {
                if (value === null) {
                    setLoggedIn(false);
                } else {
                    setToken(value);
                }
            })
        }
    }, [token]);

    useEffect(() => {
        if (!isLoggedIn) {
            setLoading(false);
        }
    }, [isLoggedIn])

    useEffect(() => {
        if (isLoading && triggerLoading && isLoggedIn && token !== null) {
            setTriggerLoading(false);
            axios.post(`${config.baseUrl}/api/user/ticket`, {
                token: token
            })
            .then(response => {
                let res =response.data;
                setLoading(false);
                setLoadingHistory(true);
                setOrders(res.tickets);
            })
        }
    }, [isLoading, triggerLoading, token, isLoggedIn]);

    useEffect(() => {
        if (isLoadingHistory) {
            setLoadingHistory(false);
            axios.post(`${config.baseUrl}/api/user/transaction`, {
                token: token
            })
            .then(response => {
                let res = response.data;
                setTransactions(res.transactions);
            })
        }
    }, [isLoadingHistory, token]);

    return (
        <React.Fragment>
            <View style={styles.header}>
                <Teks size={24} family="Inter_900Black" style={{flexGrow: 1}}>Tiket Saya</Teks>
                <TouchableOpacity style={styles.header_button} onPress={() => {
                    navigation.navigate('Scan')
                }}>
                    <Image source={require('../../assets/icons/scan-barcode.png')} />
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.container} refreshControl={
                <RefreshControl refreshing={isLoading} onRefresh={() => {
                    setTriggerLoading(true);
                    setLoading(true);
                }} />
            }>
                {
                    orders.length > 0 ?
                    orders.map((order, o) => (
                        <TouchableOpacity style={styles.order_item} key={o} onPress={() => navigation.navigate('TicketDetail', {
                            order: order
                        })}>
                            <Image style={styles.event_cover} source={{uri: `${config.baseUrl}/storage/event_covers/${order.event.cover}`}} />
                            <View style={styles.order_content}>
                                <Teks size={12} color="#151515" style={styles.event_title}>{order.event.title}</Teks>
                                <Teks family="Inter_700Bold" color={config.primaryColor}>{order.ticket.name}</Teks>
                            </View>
                        </TouchableOpacity>
                    ))
                    :
                    <Teks>Tidak ada data</Teks>
                }

                <View style={{alignItems: 'center'}}>
                    <View style={styles.separator}></View>
                </View>

                <Teks size={20} family="Inter_700Bold">Riwayat Transaksi</Teks>

                {
                    transactions.map((trx, t) => (
                        <View style={styles.card} key={t}>
                            <View style={styles.card_inline}>
                                <Image style={styles.card_cover} source={{uri: `${config.baseUrl}/storage/event_covers/${trx.event.cover}`}} />
                                <View style={{flexGrow: 1,flexBasis: '50%'}}>
                                    <Teks size={14} family="Inter_700Bold">{trx.event.title}</Teks>
                                    <Teks size={12} color={config.primaryColor} style={{marginTop: 5}}>{Currency(trx.total_pay).encode()}</Teks>
                                </View>
                            </View>
                            <View style={styles.card_bottom}>
                                <View style={styles.card_inline}>
                                    {
                                        trx.payment_status === "PENDING" &&
                                        <TouchableOpacity style={{flexGrow: 1}}>
                                            <Teks color={config.colors.green} family="Inter_700Bold">Bayar</Teks>
                                        </TouchableOpacity>
                                    }
                                    <TouchableOpacity style={{flexGrow: 1,alignItems: 'flex-end'}} onPress={() => navigation.navigate('HistoryDetail', {
                                        id: trx.id,
                                        code: trx.payment_reference
                                    })}>
                                        <Teks color={config.primaryColor} family="Inter_700Bold">Lihat Detail</Teks>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    ))
                }
            </ScrollView>
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    header: {
        padding: 20,
        paddingTop: 60,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    header_button: {
        height: 50,
        aspectRatio: 1/1,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center',
        justifyContent: 'center'
    },
    container: {
        backgroundColor: '#fff',
        flexGrow: 1,
        padding: 20,
    },
    event_cover: {
        width: '100%',
        aspectRatio: 5/2,
        backgroundColor: '#eee',
        borderRadius: 12,
    },
    order_content: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
        backgroundColor: '#fff',
        width: '80%',
        padding: 20,
        marginLeft: '10%',
        marginTop: -30,
        borderBottomWidth: 6,
        borderBottomColor: `${config.primaryColor}30`,
        borderRadius: 8
    },
    event_title: {
        flexGrow: 1,
        flexBasis: '65%'
    },
    separator: {
        width: '87%',
        height: 1,
        backgroundColor: '#ddd',
        marginTop: 60,
        marginBottom: 40,
    },
    card: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 20,
        borderRadius: 12,
        marginTop: 20
    },
    card_inline: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 20,
    },
    card_cover: {
        height: 70,
        aspectRatio: 1/1,
        borderRadius: 8,
    },
    card_bottom: {
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        marginTop: 20,
        paddingTop: 20,
    }
})

export default Order;