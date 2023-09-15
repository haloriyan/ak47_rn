import React, { useEffect, useState } from "react";
import { StyleSheet, View, ScrollView, TouchableOpacity, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import Teks from "../../../components/Teks";
import Icon from "react-native-vector-icons/MaterialIcons";
import config from "../../../config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Button, Input } from "../../../components/AK";

const PackageBadge = ({pkg}) => {
    return (
        <View style={styles.badge_area}>
            <Teks color={'#fff'} size={10}>{pkg.name}</Teks>
        </View>
    )
}

const OrganizerSettings = ({route, navigation}) => {
    const { organizerID } = route.params;
    const [isLoading, setLoading] = useState(true);
    const [token, setToken] = useState(null);
    const [icon, setIcon] = useState(null);
    const [cover, setCover] = useState(null);
    const [errorMessages, setErrorMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [organizer, setOrganizer] = useState(null);

    useEffect(() => {
        if (token === null) {
            AsyncStorage.getItem('user_token').then(value => setToken(value));
        }
    }, [token]);

    useEffect(() => {
        if (message !== "") {
            setTimeout(() => {
                setMessage('');
            }, 3000);
        }
    }, [message]);

    useEffect(() => {
        if (isLoading && token !== null) {
            setLoading(false);
            axios.post(`${config.baseUrl}/api/organizer/${organizerID}/profile`, {
                token: token
            })
            .then(response => {
                let res = response.data;
                setOrganizer(res.organizer);
                setName(res.organizer.name);
                setDescription(res.organizer.description);
                setIcon(`${config.baseUrl}/storage/organizer_icons/${res.organizer.icon}`);
                setCover(`${config.baseUrl}/storage/organizer_covers/${res.organizer.cover}`);
            })
        }
    }, [isLoading, token]);

    const removeError = key => {
        let errs = [...errorMessages];
        let i = errs.findIndex(item => item.key === key);
        if (i >= 0) {
            errs.splice(i, 1);
        }
        setErrorMessages(errs);
    }

    const pickIcon = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            aspect: [1,1],
            quality: 1,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
        });

        if (!result.canceled) {
            setIcon(result.assets[0].uri);
        }
    }
    const pickCover = async () => {
        let res = await ImagePicker.launchImageLibraryAsync({
            aspect: [16,9],
            quality: 1,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
        });

        if (!res.canceled) {
            setCover(res.assets[0].uri);
        }
    }

    const submit = () => {
        let errs = [];
        if (name === '') {
            errs.push({key: 'name', body: 'Organizer harus memiliki nama'});
        }
        if (description === '') {
            errs.push({key: 'description', body: 'Tolong jelaskan mengenai organizermu pada kotak deskripsi'});
        }

        if (errs.length === 0) {
            let iconFileName = icon.split('/').pop();
            let iconMatch = /\.(\w+)$/.exec(iconFileName);
            let iconType = iconMatch ? `image/${iconMatch[1]}` : 'image';
            let coverFileName = cover.split('/').pop();
            let coverMatch = /\.(\w+)$/.exec(coverFileName);
            let coverType = coverMatch ? `image/${coverMatch[1]}` : 'image';

            let formData = new FormData();
            formData.append('token', token);
            formData.append('name', name);
            formData.append('description', description);
            formData.append('icon', {
                uri: icon,
                name: iconFileName,
                iconType
            });
            formData.append('cover', {
                uri: cover,
                name: coverFileName,
                coverType
            });

            axios.post(`${config.baseUrl}/api/organizer/${organizerID}/profile/update`, formData)
            .then(response => {
                let res = response.data;
                setMessage(res.message);
                console.log(res);
            })
        } else {
            setErrorMessages(errs);
        }
    }

    return (
        <React.Fragment>
            <View style={styles.header}>
                <TouchableOpacity style={styles.header_back} onPress={() => navigation.goBack()}>
                    <Icon name="west" color={config.primaryColor} size={24} />
                </TouchableOpacity>
                <Teks size={20} family="Inter_700Bold">Organizer Settings</Teks>
            </View>
            <ScrollView contentContainerStyle={styles.content}>
            <View style={{alignItems: 'center'}}>
                    {
                        cover === null ?
                            <TouchableOpacity style={styles.cover} onPress={pickCover}>
                                <View style={{position: 'absolute',top: 20,right: 20}}>
                                    <Icon name="file-upload" size={22} color={'#666'} />
                                </View>
                            </TouchableOpacity>
                        :
                            <TouchableOpacity onPress={pickCover} style={{flexDirection: 'row'}}>
                                <Image style={styles.cover} source={{uri: cover}} />
                                <View style={{position: 'absolute',top: 20,right: 20}}>
                                    <Icon name="file-upload" size={22} color={'#fff'} />
                                </View>
                            </TouchableOpacity>
                    }
                    {
                        icon === null ?
                            <TouchableOpacity style={styles.icon} onPress={pickIcon}>
                                <Icon name="photo-camera" size={32} color={'#666'} />
                            </TouchableOpacity>
                        :
                        <TouchableOpacity onPress={pickIcon}>
                            <Image style={styles.icon} source={{uri: icon}} />
                            <View style={{position: 'absolute',top: 20,right: 10,backgroundColor: config.primaryColor,borderRadius: 99,padding: 5}}>
                                <Icon name="photo-camera" size={22} color={'#fff'} />
                            </View>
                        </TouchableOpacity>
                    }
                    <Input label={'Nama'} value={name} onChangeText={e => {
                        setName(e);
                        removeError('name');
                    }} />
                    <Input label={'Deskripsi'} value={description} onChangeText={e => {
                        setDescription(e);
                        removeError('description')
                    }} multiline />
                </View>

                {
                    errorMessages.length > 0 &&
                    errorMessages.map((msg, m) => (
                        <View key={m} style={styles.error}>
                            <Teks size={12} color={config.colors.red}>{msg.body}</Teks>
                        </View>
                    ))
                }

                {
                    message !== "" &&
                    <View style={{...styles.error, backgroundColor: config.colors.green}}>
                        <Teks size={12} color={'#fff'}>{message}</Teks>
                    </View>
                }

                <Button onPress={submit}>Simpan Perubahan</Button>

                <View style={styles.separator}></View>
                <Teks size={24} family="Inter_700Bold">Membership</Teks>

                {
                    organizer !== null &&
                    <View style={{...styles.inline, marginTop: 20,marginBottom: 40}}>
                        <View style={{flexGrow: 1}}>
                            <Teks>Paket Membership saat ini :</Teks>
                            <View style={{flexDirection: 'row'}}>
                                <PackageBadge pkg={organizer.membership.package} />
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => navigation.navigate('OrganizerUpgrade', {
                            organizer: organizer,
                        })}>
                            <Teks family="Inter_700Bold" color={config.primaryColor}>Upgrade</Teks>
                        </TouchableOpacity>
                    </View>
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
        backgroundColor: '#fff'
    },
    header_back: {
        height: 50,
        aspectRatio: 1/1,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center'
    },
    content: {
        padding: 20,
        backgroundColor: '#fff',
        flexGrow: 1
    },
    cover: {
        width: '100%',
        aspectRatio: 16/9,
        borderRadius: 12,
        backgroundColor: '#eee',
        position: 'relative'
    },
    icon: {
        height: 120,
        aspectRatio: 1/1,
        borderRadius: 999,
        borderWidth: 10,
        marginTop: -60,
        borderColor: '#fff',
        backgroundColor: '#eee',
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    error: {
        padding: 10,
        borderRadius: 8,
        backgroundColor: `${config.colors.red}30`,
        marginBottom: 20
    },
    separator: {
        height: 1,
        width: '100%',
        backgroundColor: '#ddd',
        marginTop: 20,marginBottom: 20,
    },
    inline: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    badge_area: {
        padding: 10,
        paddingLeft: 20,paddingRight: 20,
        borderRadius: 8,
        marginTop: 5,
        backgroundColor: `${config.primaryColor}`
    }
})

export default OrganizerSettings;