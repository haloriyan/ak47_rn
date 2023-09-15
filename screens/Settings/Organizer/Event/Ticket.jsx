import React, { useEffect, useState } from "react";
import Teks from "../../../../components/Teks";
import EventHeader from "./Header";
import Icon from "react-native-vector-icons/MaterialIcons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { RefreshControl, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import EventNavigator from "./Navigator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import config from "../../../../config";
import Currency from "../../../../components/Currency";
import FAB from "../../../../components/AK/FAB";
import { Input, Popup } from "../../../../components/AK";

const EventTicket = ({navigation, route}) => {
    const { event } = route.params;
    const [isLoading, setLoading] = useState(true);
    const [triggerLoading, setTriggerLoading] = useState(true);
    const [token, setToken] = useState(null);
    
    const [tickets, setTickets] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [startSale, setStartSale] = useState(new Date());
    const [endSale, setEndSale] = useState(new Date());

    const [isAdding, setAdding] = useState(false);
    const [isDeleting, setDeleting] = useState(false);

    useEffect(() => {
        if (token === null) {
            AsyncStorage.getItem('user_token').then(value => setToken(value))
        }
    }, [token]);

    useEffect(() => {
        if (isLoading && triggerLoading && token !== null) {
            setTriggerLoading(false);
            axios.post(`${config.baseUrl}/api/organizer/${event.organizer_id}/event/${event.id}/ticket`, {
                token: token
            })
            .then(response => {
                let res = response.data;
                setLoading(false);
                setTickets(res.tickets);
                console.log(res);
            })
        }
    }, [isLoading, triggerLoading, token]);

    return (
        <React.Fragment>
            <EventHeader title="Ticket" />
            <ScrollView contentContainerStyle={styles.container} refreshControl={
                <RefreshControl refreshing={isLoading} onRefresh={() => {
                    setLoading(true);
                    setTriggerLoading(true);
                }} />
            }>
                {
                    tickets.map((tick, t) => (
                        <View style={styles.card} key={t}>
                            <View style={styles.inline}>
                                <Teks size={18} family="Inter_700Bold" style={{flexBasis: '60%',flexGrow: 1}}>{tick.name}</Teks>
                                <Teks color={config.primaryColor}>{Currency(tick.price).encode()}</Teks>
                            </View>
                            <Teks color="#555" style={{marginTop: 10}}>{tick.description}</Teks>
                            <View style={styles.card_footer}>
                                <TouchableOpacity>
                                    <Teks color={config.colors.blue}>Edit</Teks>
                                </TouchableOpacity>
                                <TouchableOpacity style={{...styles.card_button, backgroundColor: config.colors.red}}>
                                    <Teks family="Inter_700Bold" color={'#fff'}>Hapus</Teks>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                }
            </ScrollView>
            <FAB onPress={() => setAdding(true)} icon={'add'} size={60} style={{zIndex: 20,bottom: 40,borderColor: '#f8f7f7',borderWidth: 4}} />

            <EventNavigator active="ticket" event={event} />

            {
                isAdding &&
                <Popup onDismiss={() => setAdding(false)} visible={isAdding} style={{padding: 20}}>
                    <Teks size={18} family="Inter_700Bold">Tambah Tiket</Teks>
                    <View style={{marginTop: 20}}>
                        <Input label={'Nama Tiket'} value={name} onChangeText={e => setName(e)} />
                        <Input label={'Deskripsi'} value={description} onChangeText={e => setDescription(e)} multiline />
                        {
                            price !== null &&
                            <Input label={'Harga'} value={Currency(price).encode()} onChangeText={e => {
                                setPrice(isNaN(Currency(e).decode()) ? 0 : Currency(e).decode())
                            }} type="numeric" />
                        }

                        <View style={styles.quantity_area}>
                            <View style={{flexGrow: 1}}>
                                <Teks size={10} color="#666">Jumlah Tiket Tersedia</Teks>
                                <TextInput style={styles.quantity_input} value={quantity.toString()} onChangeText={e => setQuantity(e)} />
                            </View>
                            <TouchableOpacity style={styles.quantity_button} onPress={() => {
                                if (quantity - 10 > 0) {
                                    setQuantity(quantity - 10);
                                }
                            }}>
                                <Icon name="remove" color={'#fff'} size={16} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.quantity_button} onPress={() => {
                                setQuantity(parseInt(quantity) + 10);
                            }}>
                                <Icon name="add" color={'#fff'} size={16} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.inline}>
                            <Teks style={{flexGrow: 1,flexBasis: '50%'}}>Mulai Penjualan</Teks>
                            <View>
                                <DateTimePicker 
                                    mode="datetime"
                                    value={startSale}
                                    onChange={(e, d) => {
                                        setStartSale(d);
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                </Popup>
            }
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        paddingBottom: 100,
        backgroundColor: '#f8f7f7'
    },
    card: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 20,
        borderBottomWidth: 6,
        borderBottomColor: `${config.primaryColor}30`
    },
    inline: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    card_footer: {
        paddingTop: 20,
        marginTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        flexDirection: 'row',
        gap: 20,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    card_button: {
        padding: 10,
        borderRadius: 6,
        paddingLeft: 20,
        paddingRight: 20
    },
    quantity_area: {
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 7,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 23,
    },
    quantity_button: {
        height: 30,
        paddingLeft: 15,paddingRight: 15,
        backgroundColor: config.primaryColor,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center'
    },
    quantity_input: {
        flexGrow: 1,
    },
    inline: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 20,
    }
})

export default EventTicket;