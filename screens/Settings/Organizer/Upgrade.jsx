import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Teks from "../../../components/Teks";
import axios from "axios";
import config from "../../../config";
import * as WebBrowser from "expo-web-browser";
import { StatusBar } from "expo-status-bar";
import Currency from "../../../components/Currency";
import Popup from "../../../components/AK/Popup";
import Button from "../../../components/AK/Button";

const CheckIcon = ({status, size = 20}) => {
    return (
        <View style={{
            ...iconStyles.icon_area,
            height: size,
            backgroundColor: status ? '#2ecc71' : '#e74c3c'
        }}>
            <Icon size={size - 10} color={'#fff'} name={status ? 'check' : 'close'} />
        </View>
    )
}

const iconStyles = StyleSheet.create({
    icon_area: {
        aspectRatio: 1/1,
        borderRadius: 99,
        alignItems: 'center',
        justifyContent: 'center'
    }
})

const OrganizerUpgrade = ({navigation, route}) => {
    const { organizer } = route.params;
    const [isLoadingPackages, setLoadingPackages] = useState(true);
    const [token, setToken] = useState(null);
    const [period, setPeriod] = useState('monthly');

    const [packages, setPackages] = useState([]);
    const [packageID, setPackageID] = useState(organizer.membership.package_id);
    const [showPackage, setShowPackage] = useState(null);

    useEffect(() => {
        if (isLoadingPackages) {
            setLoadingPackages(false);
            axios.get(`${config.baseUrl}/api/package`)
            .then(response => {
                let res = response.data;
                console.log(res);
                setPackages(res.packages);
            })
        }
    }, [isLoadingPackages]);

    const openLink = async url => {
        let result = await WebBrowser.openBrowserAsync(url);
        console.log(result);
    }

    const doUpgrade = () => {
        axios.post(`${config.baseUrl}/api/organizer/${organizer.id}/upgrade`, {
            token: token,
            package_id: packageID,
            period: period,
        })
        .then(response => {
            let res = response.data;
            openLink(res.invoice.invoice_url);
        })
    }

    return (
        <React.Fragment>
            <StatusBar style="dark" />
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.top}>
                    <TouchableOpacity style={styles.back} onPress={() => navigation.navigate('OrganizerHome', {
                        organizerID: organizer.id
                    })}>
                        <Icon name="west" color={config.primaryColor} />
                    </TouchableOpacity>
                    <Teks size={18} family="Inter_900Black">Membership Plan</Teks>
                </View>

                <Teks>Pilih plan membership yang tepat untuk organizer {organizer.name}</Teks>

                <View style={styles.period_area}>
                    <TouchableOpacity onPress={() => setPeriod('monthly')} style={[styles.period, period === 'monthly' ? [styles.period_active] : null]}>
                        <Teks family={period === 'monthly' ? 'Inter_700Bold' : 'Inter_400Regular'} color={period === 'monthly' ? '#fff' : config.primaryColor}>Bulanan</Teks>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setPeriod('yearly')} style={[styles.period, period === 'yearly' ? [styles.period_active] : null]}>
                        <Teks family={period === 'yearly' ? 'Inter_700Bold' : 'Inter_400Regular'} color={period === 'yearly' ? '#fff' : config.primaryColor}>Tahunan</Teks>
                    </TouchableOpacity>
                </View>

                {
                    packages.length > 0 &&
                    packages.map((pack, p) => {
                        if (pack.price_monthly > 0) {
                            return (
                                <TouchableOpacity onPress={() => setPackageID(pack.id)} key={p} style={[styles.package_item, packageID === pack.id ? [styles.package_active] : null]}>
                                    <View style={{flexGrow: 1}}>
                                        <Teks size={16} family="Inter_700Bold" style={{marginBottom: 5}}>{pack.name}</Teks>
                                        <View style={{flexDirection: 'row',alignItems: 'center',gap: 5}}>
                                            <Teks color="#777">{pack.description}.</Teks>
                                            <TouchableOpacity onPress={() => setShowPackage(pack)}>
                                                <Teks size={10} color={config.primaryColor}>Lihat benefit</Teks> 
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <Teks family="Inter_700Bold" color={config.primaryColor}>
                                        {Currency(pack[`price_${period}`]).encode()}
                                    </Teks>
                                </TouchableOpacity>
                            )
                        }
                    })
                }

                <View style={{height: 20}}></View>
                <Button onPress={doUpgrade}>Upgrade Sekarang</Button>
            </ScrollView>

            {
                showPackage !== null &&
                <Popup visible={showPackage !== null} onDismiss={() => setShowPackage(null)} style={{padding: 20}}>
                    <Teks size={20} family="Inter_700Bold">{showPackage.name}</Teks>
                    <Teks size={12} color="#777" style={{marginTop: 5}}>{showPackage.description}</Teks>
                    <View style={{height: 20}}></View>
                    <View style={styles.package_line}>
                        <Teks style={{flexGrow: 1,flexBasis: '70%'}}>Commission Fee</Teks>
                        <Teks>{showPackage.commission_fee}%</Teks>
                    </View>
                    <View style={styles.package_line}>
                        <Teks style={{flexGrow: 1,flexBasis: '70%'}}>Maksimal Anggota Tim</Teks>
                        <Teks>{showPackage.max_team_members}</Teks>
                    </View>
                    <View style={styles.package_line}>
                        <Teks style={{flexGrow: 1,flexBasis: '70%'}}>Ukuran Upload Maksimal per File</Teks>
                        <Teks>{showPackage.max_file_size} bita</Teks>
                    </View>
                    <View style={{...styles.package_line, borderBlockColor: '#fff'}}>
                        <Teks style={{flexGrow: 1,flexBasis: '70%'}}>Download Laporan ke Excel</Teks>
                        <CheckIcon status={showPackage.download_report_ability} />
                    </View>

                    <TouchableOpacity style={{alignItems: 'center',margin: 15}} onPress={() => setShowPackage(null)}>
                        <Teks color={config.primaryColor}>Tutup</Teks>
                    </TouchableOpacity>
                </Popup>
            }
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    top: {
        paddingTop: 30,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
        marginBottom: 20,
    },
    back: {
        height: 45,
        aspectRatio: 1/1,
        borderRadius: 99,
        borderWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center',
        justifyContent: 'center'
    },
    package_item: {
        borderWidth: 1,
        borderColor: '#ddd',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
        padding: 20,
        borderRadius: 12,
        marginTop: 20,
    },
    package_active: {
        borderColor: config.primaryColor
    },
    package_line: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingBottom: 10,
        marginBottom: 10,
    },
    period_area: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
        borderWidth: 1,
        borderColor: config.primaryColor,
        borderRadius: 8,
        marginTop: 20,
    },
    period: {
        flexGrow: 1,
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    period_active: {
        backgroundColor: config.primaryColor,
    },
});

export default OrganizerUpgrade;