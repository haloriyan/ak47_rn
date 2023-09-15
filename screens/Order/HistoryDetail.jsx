import React, { useEffect, useState } from "react";
import Teks from "../../components/Teks";
import Icon from "react-native-vector-icons/MaterialIcons";
import axios from "axios";
import config from "../../config";
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import Currency from "../../components/Currency";
import QRCode from "react-native-qrcode-svg";
import Popup from "../../components/AK/Popup";
import Input from "../../components/AK/Input";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HistoryDetail = ({navigation, route}) => {
    const { id, code } = route.params;
    const [isLoading, setLoading] = useState(true);
    const [transaction, setTransaction] = useState(null);
    const [isSettingHolder, setSettingHolder] = useState(false);
    const [item, setItem] = useState(null);
    const [user, setUser] = useState(null);

    const [holderEmail, setHolderEmail] = useState('');

    useEffect(() => {
        if (isLoading) {
            setLoading(false);
            axios.post(`${config.baseUrl}/api/user/transaction/${id}`)
            .then(response => {
                let res = response.data;
                setTransaction(res.transaction);
            })
        }
    }, [isLoading]);

    useEffect(() => {
        if (user === null) {
            AsyncStorage.getItem('user_data').then(value => setUser(JSON.parse(value)));
        }
    }, [user])

    const setHolder = async () => {
        if (holderEmail === "") {
            return false;
        }
        let result = await axios.post(`${config.baseUrl}/api/user/transaction/${transaction.id}/holder`, {
            item_id: item.id,
            holder_email: holderEmail
        });
        let res = result.data;
        if (res.status === 200) {
            setSettingHolder(false);
            setTransaction(null);
            setLoading(true);
        }
    }

    return (
        <React.Fragment>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="west" color={config.primaryColor} size={20} />
                </TouchableOpacity>
                <Teks size={16} family="Inter_700Bold" color={config.primaryColor}>Transaksi #{code}</Teks>
            </View>
            {
                transaction !== null &&
                <ScrollView contentContainerStyle={styles.container}>
                    <View style={{...styles.inline, marginBottom: 40}}>
                        <Image source={{uri: `${config.baseUrl}/storage/event_covers/${transaction.event.cover}`}} style={styles.event_cover} />
                        <View style={{flexGrow: 1,flexBasis: '50%'}}>
                            <Teks family="Inter_700Bold" size={18}>{transaction.event.title}</Teks>
                            <Teks color={config.primaryColor} style={{marginTop: 10}}>{Currency(transaction.total_pay).encode()}</Teks>
                        </View>
                    </View>

                    <Teks family="Inter_700Bold" size={20}>Tiket</Teks>
                    {
                        transaction.items.map((item, i) => (
                            <View key={i} style={styles.ticket_card}>
                                <View style={styles.inline}>
                                    <QRCode 
                                        size={70}
                                        value={item.unique_code} 
                                        logo={require('../../assets/icon-with-radius.png')} 
                                        logoSize={25}
                                    />
                                    <View style={{flexBasis: '60%',flexGrow: 1}}>
                                        <Teks size={16} family="Inter_700Bold">{item.ticket.name}</Teks>
                                        <Teks size={11} color="#555" style={{marginTop: 5,marginBottom: 10}}>{item.ticket.description}</Teks>
                                        {
                                            item.holder_id === null ?
                                                transaction.payment_status === "PAID" ?
                                                    <TouchableOpacity onPress={() => {
                                                        setItem(item);
                                                        setSettingHolder(true);
                                                    }}>
                                                        <Teks size={12} color={config.primaryColor} family="Inter_700Bold">Pilih Pemegang Tiket</Teks>
                                                    </TouchableOpacity>
                                                :
                                                    <View></View>
                                            :
                                            <View style={{...styles.inline, gap: 10}}>
                                                <Icon name="person" size={16} />
                                                <Teks>{item.holder.name}</Teks>
                                            </View>
                                        }
                                    </View>
                                </View>
                            </View>
                        ))
                    }
                </ScrollView>
            }

            {
                isSettingHolder &&
                <Popup visible={isSettingHolder} onDismiss={() => setSettingHolder(false)} style={{padding: 25}}>
                    <Teks>Pilih pemegang tiket <Teks family="Inter_700Bold">{item.ticket.name}</Teks> dengan mengirimkannya melalui email</Teks>
                    <View style={{marginTop: 25}}>
                        <Input label={'Email'} value={holderEmail} onChangeText={e => setHolderEmail(e)} />
                    </View>
                    <View style={{...styles.inline, marginTop: 10}}>
                        <TouchableOpacity style={{flexGrow: 1}}>
                            <Teks size={11} color="#777">Lihat bagaimana cara kerjanya</Teks>
                        </TouchableOpacity>
                        <TouchableOpacity style={{paddingRight: 5,paddingLeft: 10}} onPress={setHolder}>
                            <Teks family="Inter_700Bold" color={config.primaryColor}>Kirim</Teks>
                        </TouchableOpacity>
                    </View>
                </Popup>
            }
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
    inline: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 20,
    },
    event_cover: {
        height: 80,
        aspectRatio: 1,
        borderRadius: 12,
    },
    ticket_card: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderBottomWidth: 7,
        borderBottomColor: `${config.primaryColor}30`,
        borderRadius: 12,
        padding: 20,
        marginTop: 20
    }
})

export default HistoryDetail