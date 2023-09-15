import React, { useEffect, useState } from "react";
import {KeyboardAwareScrollView as ScrollView} from "react-native-keyboard-aware-scroll-view";
import Icon from "react-native-vector-icons/MaterialIcons";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { StyleSheet, Image, TouchableOpacity, View } from "react-native";
import { Input, Button } from "../../../components/AK";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Teks from "../../../components/Teks";
import config from "../../../config";

const CreateOrganizer = ({navigation}) => {
    const [token, setToken] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [icon, setIcon] = useState(null);
    const [cover, setCover] = useState(null);
    const [errorMessages, setErrorMessages] = useState([]);

    useEffect(() => {
        if (token === null) {
            AsyncStorage.getItem('user_token').then(value => setToken(value));
        }
    }, [token]);

    const removeError = key => {
        let errs = [...errorMessages];
        let i = errs.findIndex(item => item.key === key);
        if (i >= 0) {
            errs.splice(i, 1);
        }
        setErrorMessages(errs);
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

            axios.post(`${config.baseUrl}/api/organizer/create`, formData)
            .then(response => {
                let res = response.data;
                console.log(res);
            })
        } else {
            setErrorMessages(errs);
        }
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

    return (
        <React.Fragment>
            <View style={styles.header}>
                <TouchableOpacity style={styles.header_back} onPress={() => navigation.goBack()}>
                    <Icon name="west" color={config.primaryColor} size={24} />
                </TouchableOpacity>
                <Teks size={20} family="Inter_700Bold">Buat Organizer</Teks>
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
                            <View style={{flexDirection: 'row'}}>
                                <Image style={styles.cover} source={{uri: cover}} />
                            </View>
                    }
                    {
                        icon === null ?
                            <TouchableOpacity style={styles.icon} onPress={pickIcon}>
                                <Icon name="photo-camera" size={32} color={'#666'} />
                            </TouchableOpacity>
                        :
                        <Image style={styles.icon} source={{uri: icon}} />
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

                <Button onPress={submit}>Buat</Button>
            </ScrollView>
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    header: {
        padding: 20,
        paddingTop: 80,
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
    }
})

export default CreateOrganizer;