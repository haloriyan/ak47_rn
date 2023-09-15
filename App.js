import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AppNavigator from "./navigator/AppNavigator";

const Stack = createNativeStackNavigator();

const App = () => {
	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen name="AppNavigator" component={AppNavigator} options={{headerShown: false}} />
			</Stack.Navigator>
		</NavigationContainer>
	)
}

export default App;