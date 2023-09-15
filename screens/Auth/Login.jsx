import { ScrollView, StyleSheet, View } from "react-native";
import Teks from "../../components/Teks"
import config from "../../config";
import { useState } from "react";
import Input from "../../components/AK/Input";
import Button from "../../components/AK/Button";
import axios from "axios";
import CodeInput from "react-native-confirmation-code-input";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = ({setScreen, setUser}) => {
    const [email, setEmail] = useState('');
    const [otpProgress, setOtpProgress] = useState(false);
    const [token, setToken] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const [title, setTitle] = useState('Halo!');
    const [description, setDescription] = useState('Untuk menjelajah event lebih leluasa, kamu harus login terlebih dahulu');

    const loggingIn = () => {
        axios.post(`${config.baseUrl}/api/user/login`, {
            email: email,
        })
        .then(response => {
            let res = response.data;
            if (res.status === 200) {
                setUser(res.user);
                setToken(res.user.token);
                setOtpProgress(true);
                setTitle('Verifikasi OTP');
                setDescription('Kami telah mengirimkan 4 digit kode ke email Anda. Masukkan kode tersebut pada 4 bidang berikut ini');
            }
        })
    }

    const otpAuth = code => {
        axios.post(`${config.baseUrl}/api/user/otp`, {
            code, token
        })
        .then(response => {
            let res = response.data;
            if (res.status === 200) {
                setScreen('loading');
                AsyncStorage.setItem('user_token', token);
                AsyncStorage.setItem('user_data', JSON.stringify(user));
            } else {
                setErrorMessage(res.message);
            }
        })
    }

    return (
        <>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.top_area}>
                    <Teks size={24} color="#fff" family="Inter_900Black">{title}</Teks>
                    <Teks size={14} color="#fff" style={{marginTop: 10}}>
                        {description}
                    </Teks>
                </View>
                <View style={styles.inner_content}>
                    {
                        otpProgress ?
                            <View>
                                <CodeInput
                                    activeColor={config.primaryColor}
                                    inactiveColor="#ddd"
                                    size={60}
                                    codeLength={4}
                                    keyboardType="numeric"
                                    onFulfill={code => {
                                        otpAuth(code);
                                    }}
                                    onTextInput={e => {
                                        setErrorMessage('');
                                    }}
                                />
                                {
                                    errorMessage !== "" &&
                                    <View style={styles.error}>
                                        <Teks size={11} color={config.colors.red}>{errorMessage}</Teks>
                                    </View>
                                }
                            </View>
                        :
                        <View>
                            <Input type="email-address" label={'Email'} value={email} onChangeText={e => setEmail(e)} />
                            <Button onPress={loggingIn}>Berikutnya</Button>
                        </View>
                    }
                </View>
            </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({
    top_area: {
        backgroundColor: config.primaryColor,
        padding: 20,
        paddingTop: 100,
        paddingBottom: 80,
    },
    content: {
        backgroundColor: '#fff',
        flexGrow: 1,
    },
    inner_content: {
        padding: 25,
        paddingTop: 40,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop: -20,
        backgroundColor: '#fff'
    },
    error: {
        backgroundColor: `${config.colors.red}30`,
        padding: 10,
        borderRadius: 5,
        marginTop: 20
    }
})

export default Login;