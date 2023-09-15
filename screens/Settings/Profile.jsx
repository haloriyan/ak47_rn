import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Teks from "../../components/Teks";
import config from "../../config";
import Input from "../../components/AK/Input";
import Button from "../../components/AK/Button";

const Profile = ({navigation, route}) => {
    const { user } = route.params;
    const [name, setName] = useState(user.name);
    const [errorMessage, setErrorMessage] = useState('');

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    
    const savePassword = () => {
        // 
    }

    return (
        <React.Fragment>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.header_back}>
                    <Icon name="west" color={config.primaryColor} size={20} />
                </TouchableOpacity>
                <Teks size={24} family="Inter_900Black">Profil</Teks>
            </View>
            <ScrollView contentContainerStyle={styles.container}>
                <View>
                    <Input label={'Nama'} value={name} onChangeText={e => setName(e)} />
                </View>

                <Button>Simpan Perubahan</Button>

                <View style={{alignItems: 'center'}}>
                    <View style={styles.separator}></View>
                </View>

                <Teks family="Inter_700Bold" size={20} style={{marginBottom: 20}}>Ubah Password</Teks>
                <View>
                    <Input label={'Password Lama'} value={oldPassword} onChangeText={setOldPassword} />
                    <Input label={'Password Baru'} value={newPassword} onChangeText={setNewPassword} />
                    <Input label={'Ulangi Password Baru'} value={rePassword} onChangeText={setRePassword} />
                </View>

                <Button>Ganti Password</Button>
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
    container: {
        flexGrow: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    separator: {
        width: '80%',
        height: 1,
        backgroundColor: '#ddd',
        marginTop: 20,
        marginBottom: 20,
    }
})

export default Profile;