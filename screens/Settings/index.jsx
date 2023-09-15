import React, { useEffect, useState } from "react";
import Svg, { Path } from "react-native-svg";
import Icon from "react-native-vector-icons/MaterialIcons";
import Teks from "../../components/Teks";
import Login from "../Auth/Login";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import config, { colors } from "../../config";
import Switch from "../../components/AK/Switch";
import axios from "axios";
import Button from "../../components/AK/Button";

const Settings = ({navigation}) => {
    const [token, setToken] = useState(null);
    const [screen, setScreen] = useState('loading');
    const [isLoadingOrganizer, setLoadingOrganizer] = useState(false);
    const [isLoading, setLoading] = useState(false);

    const [creatorMode, setCreatorMode] = useState(false);
    const [organizers, setOrganizers] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (screen === "loading") {
            AsyncStorage.getItem('user_token').then(token => {
                if (token === null) {
                    setScreen('login');
                } else {
                    setToken(token);
                    setScreen('authenticated');
                    setLoading(true);
                }
            })
        }
    }, [screen]);

    const loggingOut = () => {
        AsyncStorage.removeItem('user_token');
        AsyncStorage.removeItem('user_data');
        setScreen('login');
    }

    useEffect(() => {
        if (isLoading && token !== null) {
            axios.post(`${config.baseUrl}/api/user/profile`, {
                token: token
            })
            .then(response => {
                let res = response.data;
                setUser(res.user);
                AsyncStorage.setItem('user_data', JSON.stringify(res.user));
                if (res.status === 200) {
                    setLoadingOrganizer(true)
                } else {
                    setScreen('login');
                }
            })
        }
    }, [isLoading, token]);

    useEffect(() => {
        if (isLoadingOrganizer) {
            setLoadingOrganizer(false);
            axios.post(`${config.baseUrl}/api/organizer`, {
                token
            })
            .then(response => {
                let res = response.data;
                setOrganizers(res.organizers);
            })
        }
    }, [isLoadingOrganizer, token]);

    return (
        <React.Fragment>
            {
                screen === "login" &&
                <Login setScreen={setScreen} setUser={setUser} />
            }
            {
                screen === "loading" &&
                <Teks>Loading</Teks>
            }
            {
                screen === "authenticated" &&
                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.top_area}>
                        <Teks family="Inter_900Black" color="#fff" size={22}>Akun</Teks>
                    </View>
                    {
                        user !== null &&
                        <View style={styles.info_area}>
                            <View style={styles.info_left}>
                                <Teks size={18} family="Inter_700Bold">{user.name}</Teks>
                            </View>
                            <View style={styles.info_right}>
                                <Switch
                                    value={creatorMode} setValue={setCreatorMode}
                                    size={22}
                                />
                                <Teks color="#666" style={{marginTop: 10}}>Creator Mode</Teks>
                            </View>
                        </View>
                    }

                    {
                        creatorMode ?
                            <View style={{padding: 20}}>
                                <Teks size={20} family="Inter_700Bold">Organizer</Teks>
                                {
                                    organizers.length === 0 ?
                                        <Teks style={{marginTop: 10}}>Kamu belum memiliki organizer</Teks>
                                    :
                                    <View>
                                        {
                                            organizers.map((organizer, o) => (
                                                <TouchableOpacity style={styles.organizer_item} key={o} onPress={() => {
                                                    navigation.navigate('OrganizerHome', {
                                                        organizerID: organizer.id
                                                    })
                                                }}>
                                                    <Image source={{uri: `${config.baseUrl}/storage/organizer_icons/${organizer.icon}`}} style={styles.organizer_icon} />
                                                    <View style={{flexGrow: 1}}>
                                                        <Teks size={16} family="Inter_700Bold">{organizer.name}</Teks>
                                                    </View>
                                                </TouchableOpacity>
                                            ))
                                        }
                                    </View>
                                }

                                <Button onPress={() => navigation.navigate('CreateOrganizer')} style={{marginTop: 10}}>Buat Organizer Baru</Button>
                            </View>
                        :
                        <View>
                            <View style={styles.group}>
                                <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Profile', {
                                    user: user
                                })}>
                                    <View>
                                        <Svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={32}
                                            height={32}
                                            fill="none"
                                        >
                                            <Path
                                                fill="#777"
                                                d="M27.5 9.762v10.476c0 3.512-1.613 5.925-4.45 6.837-.825.288-1.775.425-2.813.425H9.764c-1.038 0-1.988-.137-2.813-.425-2.838-.912-4.45-3.325-4.45-6.837V9.761C2.5 5.212 5.213 2.5 9.762 2.5h10.476c4.55 0 7.262 2.713 7.262 7.262z"
                                                opacity={0.4}
                                            />
                                            <Path
                                                fill="#777"
                                                d="M23.05 27.075c-.825.287-1.775.425-2.813.425H9.764c-1.038 0-1.988-.138-2.813-.425.438-3.3 3.888-5.863 8.05-5.863 4.163 0 7.613 2.563 8.05 5.863zm-3.575-12.6c0 2.475-2 4.487-4.475 4.487a4.481 4.481 0 0 1-4.475-4.487C10.525 12 12.525 10 15 10c2.475 0 4.475 2 4.475 4.475z"
                                            />
                                        </Svg>
                                    </View>
                                    <Teks style={styles.item_text} size={14}>Profil</Teks>
                                    <Icon name="chevron-right" size={20} color={'#777'} />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.item}>
                                    <View>
                                        <Svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={30}
                                            height={30}
                                            fill="none"
                                        >
                                            <Path
                                                fill="#777"
                                                d="m24.175 18.113-1.25-2.075c-.262-.463-.5-1.338-.5-1.85v-3.163c0-4.075-3.313-7.4-7.4-7.4-4.088 0-7.4 3.325-7.4 7.4v3.162c0 .513-.237 1.388-.5 1.838l-1.263 2.088c-.5.837-.612 1.762-.3 2.612.3.837 1.013 1.487 1.938 1.8a23.378 23.378 0 0 0 7.525 1.225c2.55 0 5.1-.4 7.525-1.212a2.998 2.998 0 0 0 1.875-1.813 2.97 2.97 0 0 0-.25-2.613z"
                                                opacity={0.4}
                                            />
                                            <Path
                                                fill="#777"
                                                d="M17.813 4.15a7.624 7.624 0 0 0-2.788-.525c-.975 0-1.912.175-2.775.525a3.129 3.129 0 0 1 2.775-1.65 3.15 3.15 0 0 1 2.787 1.65zm.725 20.862A3.768 3.768 0 0 1 15 27.5c-.988 0-1.963-.4-2.65-1.113-.4-.375-.7-.875-.875-1.387.162.025.325.038.5.063.287.037.588.075.888.1.712.062 1.437.1 2.162.1.713 0 1.425-.038 2.125-.1.263-.026.525-.038.775-.076.2-.024.4-.05.613-.075z"
                                            />
                                        </Svg>
                                    </View>
                                    <Teks style={styles.item_text} size={14}>Notifikasi</Teks>
                                    <Icon name="chevron-right" size={20} color={'#777'} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.group}>
                                <TouchableOpacity style={styles.item}>
                                    <View>
                                        <Svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={30}
                                            height={30}
                                            fill="none"
                                        >
                                            <Path
                                                fill="#777"
                                                d="m24.175 18.113-1.25-2.075c-.262-.463-.5-1.338-.5-1.85v-3.163c0-4.075-3.313-7.4-7.4-7.4-4.088 0-7.4 3.325-7.4 7.4v3.162c0 .513-.237 1.388-.5 1.838l-1.263 2.088c-.5.837-.612 1.762-.3 2.612.3.837 1.013 1.487 1.938 1.8a23.378 23.378 0 0 0 7.525 1.225c2.55 0 5.1-.4 7.525-1.212a2.998 2.998 0 0 0 1.875-1.813 2.97 2.97 0 0 0-.25-2.613z"
                                                opacity={0.4}
                                            />
                                            <Path
                                                fill="#777"
                                                d="M17.813 4.15a7.624 7.624 0 0 0-2.788-.525c-.975 0-1.912.175-2.775.525a3.129 3.129 0 0 1 2.775-1.65 3.15 3.15 0 0 1 2.787 1.65zm.725 20.862A3.768 3.768 0 0 1 15 27.5c-.988 0-1.963-.4-2.65-1.113-.4-.375-.7-.875-.875-1.387.162.025.325.038.5.063.287.037.588.075.888.1.712.062 1.437.1 2.162.1.713 0 1.425-.038 2.125-.1.263-.026.525-.038.775-.076.2-.024.4-.05.613-.075z"
                                            />
                                        </Svg>
                                    </View>
                                    <Teks style={styles.item_text} size={14}>Pusat Bantuan</Teks>
                                    <Icon name="chevron-right" size={20} color={'#777'} />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.item}>
                                    <View>
                                        <Svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={30}
                                            height={30}
                                            fill="none"
                                        >
                                            <Path
                                                fill="#777"
                                                d="m24.175 18.113-1.25-2.075c-.262-.463-.5-1.338-.5-1.85v-3.163c0-4.075-3.313-7.4-7.4-7.4-4.088 0-7.4 3.325-7.4 7.4v3.162c0 .513-.237 1.388-.5 1.838l-1.263 2.088c-.5.837-.612 1.762-.3 2.612.3.837 1.013 1.487 1.938 1.8a23.378 23.378 0 0 0 7.525 1.225c2.55 0 5.1-.4 7.525-1.212a2.998 2.998 0 0 0 1.875-1.813 2.97 2.97 0 0 0-.25-2.613z"
                                                opacity={0.4}
                                            />
                                            <Path
                                                fill="#777"
                                                d="M17.813 4.15a7.624 7.624 0 0 0-2.788-.525c-.975 0-1.912.175-2.775.525a3.129 3.129 0 0 1 2.775-1.65 3.15 3.15 0 0 1 2.787 1.65zm.725 20.862A3.768 3.768 0 0 1 15 27.5c-.988 0-1.963-.4-2.65-1.113-.4-.375-.7-.875-.875-1.387.162.025.325.038.5.063.287.037.588.075.888.1.712.062 1.437.1 2.162.1.713 0 1.425-.038 2.125-.1.263-.026.525-.038.775-.076.2-.024.4-.05.613-.075z"
                                            />
                                        </Svg>
                                    </View>
                                    <Teks style={styles.item_text} size={14}>Ketentuan Layanan</Teks>
                                    <Icon name="chevron-right" size={20} color={'#777'} />
                                </TouchableOpacity>

                                <TouchableOpacity style={{...styles.item, marginTop: 20,flexGrow: 1}} onPress={() => {
                                    loggingOut()
                                }}>
                                    <View>
                                        <Svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={30}
                                            height={30}
                                            fill="none"
                                        >
                                            <Path
                                                fill={colors.red}
                                                d="m24.175 18.113-1.25-2.075c-.262-.463-.5-1.338-.5-1.85v-3.163c0-4.075-3.313-7.4-7.4-7.4-4.088 0-7.4 3.325-7.4 7.4v3.162c0 .513-.237 1.388-.5 1.838l-1.263 2.088c-.5.837-.612 1.762-.3 2.612.3.837 1.013 1.487 1.938 1.8a23.378 23.378 0 0 0 7.525 1.225c2.55 0 5.1-.4 7.525-1.212a2.998 2.998 0 0 0 1.875-1.813 2.97 2.97 0 0 0-.25-2.613z"
                                                opacity={0.4}
                                            />
                                            <Path
                                                fill={colors.red}
                                                d="M17.813 4.15a7.624 7.624 0 0 0-2.788-.525c-.975 0-1.912.175-2.775.525a3.129 3.129 0 0 1 2.775-1.65 3.15 3.15 0 0 1 2.787 1.65zm.725 20.862A3.768 3.768 0 0 1 15 27.5c-.988 0-1.963-.4-2.65-1.113-.4-.375-.7-.875-.875-1.387.162.025.325.038.5.063.287.037.588.075.888.1.712.062 1.437.1 2.162.1.713 0 1.425-.038 2.125-.1.263-.026.525-.038.775-.076.2-.024.4-.05.613-.075z"
                                            />
                                        </Svg>
                                    </View>
                                    <Teks style={styles.item_text} size={14} color={colors.red}>Logout</Teks>
                                    <Icon name="chevron-right" size={20} color={colors.red} />
                                </TouchableOpacity>
                                <View style={{height: 200}}></View>
                            </View>
                        </View>
                    }
                </ScrollView>
            }
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    top_area: {
        backgroundColor: config.primaryColor,
        padding: 20,
        paddingTop: 80,
        paddingBottom: 60
    },
    info_area: {
        backgroundColor: '#fff',
        borderRadius: 12,
        margin: 20,
        marginTop: -40,
        height: 100,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20
    },
    info_left: {
        flexGrow: 1,
    },
    info_right: {
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        flexGrow: 1,
    },
    content: {
        backgroundColor: '#FFF2F5',
        flexGrow: 1,
    },
    group: {
        marginTop: 20,
        backgroundColor: '#fff',
        paddingTop: 10,
        paddingBottom: 10,
    },
    item: {
        padding: 20,
        paddingTop: 10,
        paddingBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    item_text: {
        flexGrow: 1,
    },
    organizer_item: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        marginTop: 10,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20
    },
    organizer_icon: {
        height: 60,
        aspectRatio: 1/1,
        borderRadius: 999
    }
})

export default Settings;