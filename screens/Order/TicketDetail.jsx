import React from "react";
import { Dimensions, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Teks from "../../components/Teks";
import config from "../../config";
import QRCode from "react-native-qrcode-svg";

const TicketDetail = ({navigation, route}) => {
    const { order } = route.params;
    return (
        <React.Fragment>
            <View style={styles.header}>
                <TouchableOpacity style={styles.header_button} onPress={() => {
                    navigation.goBack();
                }}>
                    <Icon name="west" size={20} color={config.primaryColor} />
                </TouchableOpacity>
                <Teks size={24} family="Inter_900Black" style={{flexGrow: 1}}>Tiket {order.ticket.name}</Teks>
            </View>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={{alignItems: 'center'}}>
                    <QRCode
                        value={order.unique_code}
                        size={Dimensions.get('window').width - 150}
                    />
                </View>

                <View style={styles.area}>
                    <View style={styles.column}>
                        <Teks size={11} color="#888">TIKET</Teks>
                        <Teks size={18} family="Inter_700Bold" style={{marginTop: 10}}>{order.ticket.name}</Teks>
                    </View>
                    <View style={styles.column}>
                        <Teks size={11} color="#888">EVENT</Teks>
                        <Teks size={18} family="Inter_700Bold" style={{marginTop: 10}}>{order.event.title}</Teks>
                    </View>
                    <View style={styles.column}>
                        <Teks size={11} color="#888">HOLDER</Teks>
                        <Teks size={18} family="Inter_700Bold" style={{marginTop: 10}}>{order.holder.name}</Teks>
                    </View>
                    <View style={styles.column}>
                        <Teks size={11} color="#888">PAYMENT STATUS</Teks>
                        <Teks size={18} family="Inter_700Bold" style={{marginTop: 10}} color={
                            order.purchase.payment_status === "PAID" ? config.colors.green : config.colors.red
                        }>{order.purchase.payment_status}</Teks>
                    </View>
                </View>
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
        backgroundColor: '#fff',
        gap: 20,
    },
    header_button: {
        height: 50,
        aspectRatio: 1/1,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center',
        justifyContent: 'center'
    },
    container: {
        flexGrow: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    area: {
        flexDirection: 'row',
        gap: 20,
        flexWrap: 'wrap',
        marginTop: 60
    },
    column: {
        flexBasis: '45%',
        flexGrow: 1,
    }
})

export default TicketDetail;