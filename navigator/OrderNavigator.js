import Order from "../screens/Order";
import History from "../screens/Order/History";
import HistoryDetail from "../screens/Order/HistoryDetail";
import Scan from "../screens/Order/Scan";
import TicketDetail from "../screens/Order/TicketDetail";

const { createNativeStackNavigator } = require("@react-navigation/native-stack");

const Stack = createNativeStackNavigator();

const OrderNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Order" component={Order} options={{headerShown: false}} />
            <Stack.Screen name="TicketDetail" component={TicketDetail} options={{headerShown: false}} />
            <Stack.Screen name="Scan" component={Scan} options={{headerShown: false}} />
            <Stack.Screen name="History" component={History} options={{headerShown: false}} />
            <Stack.Screen name="HistoryDetail" component={HistoryDetail} options={{headerShown: false}} />
        </Stack.Navigator>
    )
}

export default OrderNavigator;