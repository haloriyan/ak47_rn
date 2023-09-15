import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, TouchableOpacity, View, TextInput, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import Svg, { Path } from "react-native-svg";
import Icon from "react-native-vector-icons/MaterialIcons";
import Teks from "../../../../components/Teks";
import config, { colors } from "../../../../config";
import StatusBar from "../../../../components/StatusBar";
import { Button, Checkbox, Dropdown, Input, Option, Popup } from "../../../../components/AK";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Currency from "../../../../components/Currency";
import moment from "moment";

const CreateEvent = ({navigation, route}) => {
    const { organizerID } = route.params;
    const [token, setToken] = useState(null);
    const [isLoadingCities, setLoadingCities] = useState(true);
    const [cities, setCities] = useState([]);

    const [locationVisible, setLocationVisible] = useState(false);
    const [addingTicket, setAddingTicket] = useState(false);
    const [choosingDate, setChoosingDate] = useState(false);

    const [startDateShow, setStartDateShow] = useState(false);
    const [endDateShow, setEndDateShow] = useState(false);

    const [cover, setCover] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [maxBuyTicket, setMaxBuyTicket] = useState(5);
    
    const [province, setProvince] = useState('');
    const [city, setCity] = useState('');
    const [address, setAddress] = useState('');

    const [tickets, setTickets] = useState([]);
    const [ticketName, setTicketName] = useState('');
    const [ticketDescription, setTicketDescription] = useState('');
    const [ticketQuantity, setTicketQuantity] = useState(10);
    const [ticketPrice, setTicketPrice] = useState(0);

    useEffect(() => {
        if (token === null) {
            AsyncStorage.getItem('user_token').then(value => setToken(value))
        }
    }, [token]);

    useEffect(() => {
        if (isLoadingCities) {
            setLoadingCities(false);
            axios.get(`${config.baseUrl}/api/city`)
            .then(response => {
                let res = response.data;
                setCities(res.cities);
            })
        }
    }, [isLoadingCities]);

    const pickCover = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
            aspect: [5,2]
        });

        if (!result.canceled) {
            setCover(result.assets[0].uri);
        }
    }

    const submit = () => {
        let coverFileName = cover.split('/').pop();
        let coverMatch = /\.(\w+)$/.exec(coverFileName);
        let coverType = coverMatch ? `image/${coverMatch[1]}` : 'image';

        let formData = new FormData();
        formData.append('token', token);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('address', address);
        formData.append('city', city);
        formData.append('max_buy_ticket', maxBuyTicket);
        formData.append('start', moment(startDate).format('Y-MM-DD HH:mm:ss'));
        formData.append('end', moment(endDate).format('Y-MM-DD HH:mm:ss'));
        formData.append('tickets', JSON.stringify(tickets));
        formData.append('cover', {
            uri: cover,
            name: coverFileName,
            coverType
        });

        axios.post(`${config.baseUrl}/api/organizer/${organizerID}/event/create`, formData)
        .then(response => {
            let res = response.data;
            navigation.goBack()
        })
    }

    const createTicket = () => {
        if (ticketName === "" || ticketDescription === "") {
            return false;
        }
        let ticks = [...tickets];
        ticks.push({
            name: ticketName,
            description: ticketDescription,
            price: ticketPrice,
            quantity: ticketQuantity
        });
        setTickets(ticks);
        setAddingTicket(false);
        setTicketName('');
        setTicketDescription('');
        setTicketPrice(0);
        setTicketQuantity(10);
    }
    const removeTicket = i => {
        let ticks = [...tickets];
        ticks.splice(i, 1);
        setTickets(ticks);
    }

    return (
        <React.Fragment>
            <StatusBar />
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.top_area}></View>
                <View style={{padding: 20}}>
                    <View style={{marginTop: -100}}>
                        <TouchableOpacity style={{flexDirection: 'row', gap: 10,marginBottom: 10}} onPress={() => navigation.goBack()}>
                            <Icon name="west" color={'#fff'} />
                            <Teks color="#fff">kembali</Teks>
                        </TouchableOpacity>
                        {
                            cover === null ?
                                <TouchableOpacity style={styles.cover} onPress={pickCover}>
                                    <View style={styles.icon}>
                                        <Icon name="file-upload" size={24} color={config.primaryColor} />
                                    </View>
                                    <View>
                                        <Teks size={16} family="Inter_700Bold">Upload Poster</Teks>
                                        <Teks size={12} style={{marginTop: 10}}>Disarankan berukuran 1750 x 700</Teks>
                                    </View>
                                </TouchableOpacity>
                            :
                                <Image source={{uri: cover}} style={styles.cover} />
                        }
                    </View>

                    <View style={{height: 40}}></View>
                    <TextInput placeholder="Nama Event" style={styles.event_title} value={title} onChangeText={e => setTitle(e)} />

                    <View style={{...styles.flexing, marginTop: 20}}>
                        <TouchableOpacity style={styles.flex_item} onPress={() => setLocationVisible(true)}>
                            <Svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={24}
                                height={24}
                                fill="none"
                            >
                                <Path
                                    stroke="#777"
                                    d="M12 13.43a3.12 3.12 0 1 0 0-6.24 3.12 3.12 0 0 0 0 6.24z"
                                />
                                <Path
                                    stroke="#777"
                                    d="M3.62 8.49c1.97-8.66 14.8-8.65 16.76.01 1.15 5.08-2.01 9.38-4.78 12.04a5.193 5.193 0 0 1-7.21 0c-2.76-2.66-5.92-6.97-4.77-12.05z"
                                />
                            </Svg>
                            {
                                (city === '') ?
                                    <Teks size={12} color="#777">Pilih Lokasi</Teks>
                                :
                                    <Teks size={12}>{city}, {province}</Teks>
                            }
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.flex_item} onPress={() => setChoosingDate(true)}>
                            <Svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={24}
                                height={24}
                                fill="none"
                            >
                                <Path
                                stroke="#777"
                                d="M8 2v3m8-3v3M3.5 9.09h17m.5-.59V17c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V8.5c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5zM11.995 13.7h.01m-3.711 0h.01m-.01 3h.01"
                                />
                            </Svg>
                            {
                                startDate === new Date() ?
                                    <Teks size={12} color="#777">Pilih Tanggal</Teks>
                                :
                                    <View style={{gap: 10}}>
                                        <Text>{moment(startDate).format('DD MMM - HH:mm')} </Text>
                                        <Text>{moment(endDate).format('DD MMM - HH:mm')} </Text>
                                    </View>
                            }
                        </TouchableOpacity>
                    </View>

                    <TextInput value={description} onChangeText={e => setDescription(e)} style={styles.event_description} placeholder="Jelaskan mengenai eventmu secara lengkap" multiline />

                    <View style={{height: 40}}></View>
                    
                    <View style={styles.flexing}>
                        <Teks size={22} family="Inter_700Bold" style={{flexGrow: 1}}>Tiket</Teks>
                        <TouchableOpacity onPress={() => setAddingTicket(true)}>
                            <Teks size={14} family="Inter_700Bold" color={config.primaryColor}>
                                {tickets.length === 0 ? 'Buat' : 'Tambah'}
                            </Teks>
                        </TouchableOpacity>
                    </View>

                    <View style={{height: 20}}></View>

                    {
                        tickets.length === 0 ?
                            <Teks style={{marginBottom: 20}}>Belum ada tiket</Teks>
                        :
                        tickets.map((ticket, t) => (
                            <View key={t} style={styles.ticket}>
                                <View style={styles.ticket_top}>
                                    <Teks size={18} family="Inter_700Bold" style={{flexGrow: 1}}>{ticket.name}</Teks>
                                    <Teks size={18} family="Inter_700Bold" color={config.primaryColor}>{ticket.price > 0 ? Currency(ticket.price).encode() : 'Gratis'}</Teks>
                                </View>
                                <Teks size={12} color="#666" style={{marginTop: 20}}>{ticket.description}</Teks>
                                <View style={styles.separator}></View>
                                <View style={{flexDirection: 'row',justifyContent: 'flex-end',alignItems: 'center'}}>
                                    <View style={{flexGrow: 1,flexDirection: 'row',gap: 5,alignItems: 'center'}}>
                                        <Teks size={16} family="Inter_700Bold">{ticket.quantity}</Teks>
                                        <Teks color="#777" size={12}>tiket tersedia</Teks>
                                    </View>
                                    <TouchableOpacity style={styles.ticket_button} onPress={() => removeTicket(t)}>
                                        <Teks color={colors.red}>Hapus</Teks>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))
                    }

                    <Button onPress={submit}>Publish Event</Button>
                </View>
            </ScrollView> 

            <Popup visible={choosingDate} onDismiss={() => setChoosingDate(false)} style={{padding: 20, width: '90%'}}>
                <Teks size={20} family="Inter_900Black">Atur Tanggal dan Waktu</Teks>
                <View style={{height: 30}}></View>
                <View style={styles.popup_row}>
                    <Teks size={14} family="Inter_700Bold" style={styles.popup_left}>Mulai</Teks>
                    <DateTimePicker
                        mode="datetime"
                        value={startDate}
                        onChange={(e, d) => {
                            setStartDate(d);
                        }}
                    />
                </View>
                <View style={{...styles.popup_row, marginTop: 10,marginBottom: 20}}>
                    <Teks size={14} family="Inter_700Bold" style={styles.popup_left}>Berakhir</Teks>
                    <DateTimePicker
                        mode="datetime"
                        value={endDate}
                        minimumDate={startDate}
                        onChange={(e, d) => {
                            setEndDate(d);
                        }}
                    />
                </View>

                <Button onPress={() => setChoosingDate(false)}>Simpan</Button>
            </Popup>
            <Popup visible={addingTicket} onDismiss={() => setAddingTicket(false)} style={{padding: 20}}>
                <Teks size={20} family="Inter_900Black">{tickets.length === 0 ? 'Buat' : 'Tambah'} Tiket</Teks>
                <View style={{marginTop: 20,marginBottom: 10}}>
                    <Input label={'Nama Tiket'} value={ticketName} onChangeText={e => setTicketName(e)} />
                    <Input label={'Deskripsi'} value={ticketDescription} onChangeText={e => setTicketDescription(e)} multiline />
                    {
                        ticketPrice !== null &&
                        <Input type="numeric" label={'Harga'} onChangeText={e => {
                            setTicketPrice(Currency(e).decode())
                        }} value={Currency(ticketPrice).encode()} />
                    }

                    <TouchableOpacity style={{marginTop: -10,marginBottom: 15,flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-end'}} onPress={() => {
                        setTicketPrice(
                            ticketPrice > 0 ? null : 10000
                        )
                    }}>
                        <Checkbox selected={ticketPrice === 0} />
                        <Teks size={10}>Tiket gratis</Teks>
                    </TouchableOpacity>

                    <View style={styles.quantity_area}>
                        <View style={{flexGrow: 1}}>
                            <Teks size={10} color="#666">Jumlah Tiket Tersedia</Teks>
                            <TextInput style={styles.quantity_input} value={ticketQuantity.toString()} onChangeText={e => setTicketQuantity(e)} />
                        </View>
                        <TouchableOpacity style={styles.quantity_button} onPress={() => {
                            if (ticketQuantity - 10 > 0) {
                                setTicketQuantity(ticketQuantity - 10);
                            }
                        }}>
                            <Icon name="remove" color={'#fff'} size={16} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.quantity_button} onPress={() => {
                            setTicketQuantity(parseInt(ticketQuantity) + 10);
                        }}>
                            <Icon name="add" color={'#fff'} size={16} />
                        </TouchableOpacity>
                    </View>

                </View>
                <Button onPress={createTicket}>Tambahkan</Button>
            </Popup>
            <Popup visible={locationVisible} onDismiss={() => setLocationVisible(false)} style={{padding: 20}}>
                <Teks size={20} family="Inter_900Black">Lokasi Event</Teks>

                <View style={{marginTop: 40}}>
                    {
                        cities.length > 0 &&
                        <Dropdown
                            value={city}
                            setValue={setCity}
                            label={'Kota'}
                            style={{height: 50}}
                        >
                            {
                                cities.map((cit, c) => (
                                    <Option value={cit.name} key={c}>{cit.name}</Option>
                                ))
                            }
                        </Dropdown>
                    }
                    <View style={{height: 20}}></View>
                    <Input label={'Alamat'} value={address} onChangeText={e => setAddress(e)} multiline />
                </View>

                <Button height={40} onPress={() => setLocationVisible(false)}>Simpan Lokasi</Button>
            </Popup>
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    top_area: {
        backgroundColor: config.primaryColor,
        height: 80
    },
    content: {
        flexGrow: 1,
        backgroundColor: '#fff',
    },
    cover: {
        width: '100%',
        backgroundColor: '#eee',
        aspectRatio: 5/2,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        padding: 20,
        gap: 20
    },
    icon: {
        backgroundColor: `${config.primaryColor}30`,
        height: 50,
        aspectRatio: 1/1,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center'
    },
    event_title: {
        fontWeight: '900',
        fontSize: 24,
    },
    flexing: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20
    },
    flex_item: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        flexGrow: 1
    },
    event_description: {
        marginTop: 20
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
    ticket: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 20,
        marginBottom: 20
    },
    ticket_top: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20
    },
    separator: {
        height: 1,
        width: '100%',
        flexGrow: 1,
        backgroundColor: '#ddd',
        marginTop: 20,
        marginBottom: 20
    },
    ticket_button: {
        borderWidth: 1,
        borderColor: config.colors.red,
        borderRadius: 8,
        padding: 10,
        paddingLeft: 35,paddingRight: 35,
    },
    popup_row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    popup_left: {
        flexGrow: 1
    }
})

export default CreateEvent