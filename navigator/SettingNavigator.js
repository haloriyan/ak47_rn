import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Settings from "../screens/Settings";
import CreateOrganizer from "../screens/Settings/Organizer/Create";
import OrganizerHome from "../screens/Settings/Organizer/Home";
import OrganizerSettings from "../screens/Settings/Organizer/Settings";
import CreateEvent from "../screens/Settings/Organizer/Event/Create";
import EventOverview from "../screens/Settings/Organizer/Event/Overview";
import EventTicket from "../screens/Settings/Organizer/Event/Ticket";
import EventInfo from "../screens/Settings/Organizer/Event/Info";
import OrganizerUpgrade from "../screens/Settings/Organizer/Upgrade";
import Profile from "../screens/Settings/Profile";

const Stack = createNativeStackNavigator();

const SettingNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Settings" component={Settings} options={{headerShown: false}} />
            <Stack.Screen name="Profile" component={Profile} options={{headerShown: false}} />

            {/* Organizer */}
            <Stack.Screen name="CreateOrganizer" component={CreateOrganizer} options={{headerShown: false}} />
            <Stack.Screen name="OrganizerHome" component={OrganizerHome} options={{headerShown: false}} />
            <Stack.Screen name="OrganizerUpgrade" component={OrganizerUpgrade} options={{headerShown: false}} />
            <Stack.Screen name="OrganizerSettings" component={OrganizerSettings} options={{headerShown: false}} />

            <Stack.Screen name="CreateEvent" component={CreateEvent} options={{headerShown: false}} />
            <Stack.Screen name="EventOverview" component={EventOverview} options={{headerShown: false}} />
            <Stack.Screen name="EventTicket" component={EventTicket} options={{headerShown: false}} />
            <Stack.Screen name="EventInfo" component={EventInfo} options={{headerShown: false}} />
        </Stack.Navigator>
    )
}

export default SettingNavigator