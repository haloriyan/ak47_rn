import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import Icon from "react-native-vector-icons/MaterialIcons";
import Teks from "../../components/Teks";
import config from "../../config";

const Wishlist = ({navigation}) => {
    return (
        <React.Fragment>
            <View style={styles.top_area}>
                <TouchableOpacity style={styles.top_button} onPress={() => navigation.goBack()}>
                    <Icon name="west" size={16} color={'#fff'} />
                    <Teks color="#fff">kembali</Teks>
                </TouchableOpacity>
            </View>
            <View style={styles.content_wrapper}>
                <View style={styles.title_area}>
                    <View style={styles.title_icon}>
                        <Svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={28}
                            height={28}
                            fill="none"
                        >
                            <Path
                                stroke="#E5214F"
                                d="M14.723 24.278c-.396.14-1.05.14-1.446 0-3.384-1.155-10.944-5.973-10.944-14.14 0-3.605 2.905-6.521 6.487-6.521A6.435 6.435 0 0 1 14 6.23a6.451 6.451 0 0 1 5.18-2.613c3.582 0 6.487 2.916 6.487 6.521 0 8.167-7.56 12.985-10.944 14.14z"
                            />
                        </Svg>
                    </View>
                    <Teks family="Inter_900Black" size={22}>Yang Menarik</Teks>
                </View>
            </View>
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    top_area: {
        padding: 20,
        paddingTop: 60,
        paddingBottom: 40,
        backgroundColor: config.primaryColor,
    },
    top_button: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    content_wrapper: {
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        padding: 20,
        marginTop: -20,
        backgroundColor: '#fff',
        flexGrow: 1,
    },
    title_area: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    title_icon: {
        height: 60,
        aspectRatio: 1/1,
        borderRadius: 99,
        backgroundColor: `${config.primaryColor}20`,
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default Wishlist;