import React, { useEffect, useState } from "react";
import Teks from "../../components/Teks";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import config from "../../config";
import Radio from "../../components/AK/Radio";
import banks from "../../assets/icons/bank_square";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Popup from "../../components/AK/Popup";
import Input from "../../components/AK/Input";
import Button from "../../components/AK/Button";

const Checkout = ({navigation, route}) => {
    const { carts, event } = route.params;
    const [method, setMethod] = useState('vfa');
    const [token, setToken] = useState(null);
    const [chann, setChann] = useState('');

    const [field, setField] = useState('');
    const [customProps, setCustomProps] = useState(false);

    useEffect(() => {
        if (token === null) {
            AsyncStorage.getItem('user_token').then(value => {
                setToken(value === null ? 'unauthenticated' : value);
            })
        }
    }, [token]);

    const pay = async channel => {
        console.log('paying');
        let result = await axios.post(`${config.baseUrl}/api/user/transaction/checkout`, {
            token: token,
            carts: carts,
            channel: channel,
            method: method,
            field: field,
            event_id: event.id,
        })
        let res = result.data;
        console.log(res);
        setCustomProps(false);
        // navigation.navigate('OrderNavigator', {
        //     screen: 'History'
        // });
    }

    return (
        <React.Fragment>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="west" color={'#fff'} size={20} />
                </TouchableOpacity>
                <Teks size={16} color="#fff" family="Inter_700Bold">Pilih Pembayaran</Teks>
            </View>
            <ScrollView contentContainerStyle={styles.container}>
                <TouchableOpacity style={styles.method_area} onPress={() => setMethod('vfa')}>
                    <View style={{flexDirection: 'row',alignItems: 'center',gap: 20,flexWrap: 'wrap'}}>
                        <View style={{flexGrow: 1,flexBasis: '60%'}}>
                            <Teks size={16} family="Inter_700Bold">Transfer Bank</Teks>
                            <Teks size={12} color="#777" style={{marginTop: 5}}>Transfer instan melalui bank agendakota</Teks>
                        </View>
                        <Radio onSelect={() => setMethod('vfa')} active={method === 'vfa'} label="" />
                    </View>

                    {
                        method === 'vfa' &&
                        <View style={styles.channel_area}>
                            <TouchableOpacity onPress={() => pay('bca')}>
                                <Image resizeMode="cover" source={banks.bca.uri} style={styles.channel_item} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => pay('mandiri')}>
                                <Image resizeMode="cover" source={banks.mandiri.uri} style={styles.channel_item} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => pay('bni')}>
                                <Image resizeMode="cover" source={banks.bni.uri} style={styles.channel_item} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => pay('bri')}>
                                <Image resizeMode="cover" source={banks.bri.uri} style={styles.channel_item} />
                            </TouchableOpacity>
                        </View>
                    }
                </TouchableOpacity>
                <TouchableOpacity style={styles.method_area} onPress={() => setMethod('ewallets')}>
                    <View style={{flexDirection: 'row',alignItems: 'center',gap: 20,flexWrap: 'wrap'}}>
                        <View style={{flexGrow: 1,flexBasis: '60%'}}>
                            <Teks size={16} family="Inter_700Bold">Dompet Digital</Teks>
                            <Teks size={12} color="#777" style={{marginTop: 5}}>Transfer instan melalui dompet digital agendakota</Teks>
                        </View>
                        <Radio onSelect={() => setMethod('ewallets')} active={method === 'ewallets'} label="" />
                    </View>

                    {
                        method === 'ewallets' &&
                        <View style={styles.channel_area}>
                            <TouchableOpacity onPress={() => {
                                setChann('id_ovo')
                                setCustomProps(true);
                            }}>
                                <Image resizeMode="cover" source={banks.ovo.uri} style={styles.channel_item} />
                                <Teks size={10} align="center" style={{marginTop: 5}}>{banks.ovo.name}</Teks>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Image resizeMode="cover" source={banks.dana.uri} style={styles.channel_item} />
                                <Teks size={10} align="center" style={{marginTop: 5}}>{banks.dana.name}</Teks>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Image resizeMode="cover" source={banks.linkaja.uri} style={styles.channel_item} />
                                <Teks size={10} align="center" style={{marginTop: 5}}>{banks.linkaja.name}</Teks>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                setChann('id_jeniuspay')
                                setCustomProps(true);
                            }}>
                                <Image resizeMode="cover" source={banks.jeniuspay.uri} style={styles.channel_item} />
                                <Teks size={10} align="center" style={{marginTop: 5}}>{banks.jeniuspay.name}</Teks>
                            </TouchableOpacity>
                        </View>
                    }
                </TouchableOpacity>
            </ScrollView>
            
            {
                customProps &&
                <Popup visible={customProps} onDismiss={() => setCustomProps(false)} style={{padding: 20}}>
                    <Teks>Mohon masukkan {chann === 'id_ovo' ? 'Nomor Telepon OVO' : chann === 'id_jeniuspay' ? 'cashtag jenius' : ''} untuk melanjutkan pembayaran</Teks>
                    <View style={{marginTop: 20}}>
                        <Input label={chann === 'id_ovo' ? 'No. Telepon OVO' : '$cashtag'} value={field} onChangeText={e => setField(e)} />
                    </View>
                    <Button onPress={() => pay(chann)}>Bayar Sekarang</Button>
                </Popup>
            }
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    header: {
        padding: 20,
        paddingTop: 60,
        backgroundColor: config.primaryColor,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    container: {
        padding: 20,
        flexGrow: 1,
        backgroundColor: '#fff'
    },
    method_area: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 20,
        marginBottom: 20
    },
    channel_area: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 25,
    },
    channel_item: {
        flexBasis: '24%',
        height: 50,
        flexGrow: 0,
        aspectRatio: 1/1,
        marginTop: 20,
        backgroundColor: '#fff',
        shadowColor: '#ddd',
        shadowOpacity: 0.8,
        shadowOffset: {
            width: 1,height: 1,
        },
        shadowRadius: 10
    },
    channel_image: {
        width: '100%',
        aspectRatio: 16/9,
    }
})

export default Checkout;