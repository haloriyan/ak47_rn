import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { View } from "react-native";
import Svg, { Path } from "react-native-svg";
import HomeNavigator from "./HomeNavigator";
import SettingNavigator from "./SettingNavigator";
import config from "../config";
import OrderNavigator from "./OrderNavigator";

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
    return (
        <Tab.Navigator screenOptions={{
            tabBarStyle: {
                height: 85,
                paddingTop: 10,paddingBottom: 20,
                backgroundColor: '#fff',
            },
        }}>
            <Tab.Screen name="HomeNavigator" component={HomeNavigator} options={{
                headerShown: false,
                tabBarLabel: 'Home',
                tabBarActiveTintColor: config.primaryColor,
                tabBarIcon: ({color, size}) => (
                    <View style={{
                        padding: 5,
                        borderRadius: 10,
                        backgroundColor: color === config.primaryColor ? `${color}30` : '#fff',
                    }}>
                        <Svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={size + 5}
                            height={size}
                            fill="none"
                        >
                            <Path
                                stroke={color}
                                d="M15 22.5v-3.75M12.588 3.525l-8.663 6.938c-.975.775-1.6 2.412-1.387 3.637L4.2 24.05c.3 1.775 2 3.212 3.8 3.212h14c1.788 0 3.5-1.45 3.8-3.212l1.662-9.95c.2-1.225-.424-2.862-1.387-3.637l-8.662-6.925c-1.338-1.075-3.5-1.075-4.825-.013z"
                            />
                        </Svg>
                    </View>
                )
            }} />
            <Tab.Screen name="OrderNavigator" component={OrderNavigator} options={{
                headerShown: false,
                tabBarLabel: 'Tiket',
                tabBarActiveTintColor: config.primaryColor,
                tabBarIcon: ({color, size}) => (
                    <View style={{
                        padding: 5,
                        borderRadius: 10,
                        backgroundColor: color === config.primaryColor ? `${color}30` : '#fff',
                    }}>
                        <Svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={size + 5}
                            height={size + 5}
                            fill="none"
                        >
                            <Path
                                stroke={color}
                                d="M24.375 15.625c0-1.725 1.4-3.125 3.125-3.125v-1.25c0-5-1.25-6.25-6.25-6.25H8.75c-5 0-6.25 1.25-6.25 6.25v.625a3.126 3.126 0 0 1 0 6.25v.625c0 5 1.25 6.25 6.25 6.25h12.5c5 0 6.25-1.25 6.25-6.25a3.126 3.126 0 0 1-3.125-3.125zM12.5 5v20"
                            />
                        </Svg>
                    </View>
                )
            }} />
            <Tab.Screen name="SettingNavigator" component={SettingNavigator} options={{
                headerShown: false,
                tabBarLabel: 'Akun',
                tabBarActiveTintColor: config.primaryColor,
                tabBarIcon: ({color, size}) => (
                    <View style={{
                        padding: 5,
                        borderRadius: 10,
                        backgroundColor: color === config.primaryColor ? `${color}30` : '#fff',
                    }}>
                        <Svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={size + 5}
                            height={size + 5}
                            fill="none"
                        >
                            <Path
                                stroke={color}
                                d="M15 15a6.25 6.25 0 1 0 0-12.5A6.25 6.25 0 0 0 15 15zm10.738 12.5c0-4.837-4.813-8.75-10.738-8.75S4.262 22.663 4.262 27.5"
                            />
                        </Svg>
                    </View>
                )
            }} />
        </Tab.Navigator>
    )
}

export default AppNavigator;