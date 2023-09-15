import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../screens/Home";
import Wishlist from "../screens/Home/Wishlist";
import City from "../screens/Home/City";
import EventDetail from "../screens/Home/EventDetail";
import Search from "../screens/Home/Search";
import Category from "../screens/Home/Category";
import Checkout from "../screens/Home/Checkout";

const Stack = createNativeStackNavigator();

const HomeNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" component={Home} options={{headerShown: false}} />
            <Stack.Screen name="City" component={City} options={{headerShown: false}} />
            <Stack.Screen name="Category" component={Category} options={{headerShown: false}} />
            <Stack.Screen name="Wishlist" component={Wishlist} options={{headerShown: false}} />
            <Stack.Screen name="Search" component={Search} options={{headerShown: false}} />
            <Stack.Screen name="EventDetail" component={EventDetail} options={{headerShown: false}} />
            <Stack.Screen name="Checkout" component={Checkout} options={{headerShown: false}} />
        </Stack.Navigator>
    )
}

export default HomeNavigator