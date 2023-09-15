import React, { useEffect, useState } from "react";
import Teks from "../../components/Teks";
import { Image, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import config from "../../config";
import Icon from "react-native-vector-icons/MaterialIcons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Currency from "../../components/Currency";

const History = ({navigation}) => {
    const [isLoading, setLoading] = useState(true);
    const [triggerLoading, setTriggerLoading] = useState(true);
    const [token, setToken] = useState(null);

    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        if (token === null) {
            AsyncStorage.getItem('user_token').then(value => {
                setToken(value === null ? 'unauthenticated' : value);
            })
        }
    }, [token]);

    useEffect(() => {
        if (isLoading && triggerLoading && token !== null && token !== 'unauthenticated') {
            setTriggerLoading(false);
            axios.post(`${config.baseUrl}/api/user/transaction`, {
                token: token
            })
            .then(response => {
                setLoading(false);
                let res = response.data;
                setTransactions(res.transactions);
            })
        }
    }, [isLoading, triggerLoading, token]);

    return (
        <React.Fragment>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('Order')}>
                    <Icon name="west" color={config.primaryColor} size={20} />
                </TouchableOpacity>
                <Teks size={16} family="Inter_700Bold" color={config.primaryColor}>Riwayat Transaksi</Teks>
            </View>
            <ScrollView contentContainerStyle={styles.container} refreshControl={
                <RefreshControl refreshing={isLoading} onRefresh={() => {
                    setLoading(true);
                    setTriggerLoading(true);
                }} />
            }>
                {
                    transactions.map((trx, t) => (
                        <View style={styles.card} key={t}>
                            <View style={styles.card_inline}>
                                <Image style={styles.event_cover} source={{uri: `${config.baseUrl}/storage/event_covers/${trx.event.cover}`}} />
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
        gap: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd'
    },
    container: {
        padding: 20,
        flexGrow: 1,
        backgroundColor: '#fff',
    },
    card: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 20,
        borderRadius: 12,
    },
    card_inline: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 20,
    },
    event_cover: {
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

export default History;