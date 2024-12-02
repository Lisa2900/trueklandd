// ChatScreenStackNav.js
import { createStackNavigator } from '@react-navigation/stack';
import ChatListScreen from '../Screens/ChatListScreen';  // La pantalla que muestra la lista de chats
import ChatScreen from '../Screens/ChatScreen';  // La pantalla para cada chat

const Stack = createStackNavigator();

export default function ChatScreenStackNav() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ChatList"  // Nombre de la pantalla que muestra la lista de chats
        component={ChatListScreen}
        options={{
          headerShown: false,  // Configura según lo necesites
        }}
      />
      <Stack.Screen
        name="ChatScreen"  // Nombre de la pantalla de detalles del chat
        component={ChatScreen}
        options={{
          headerShown: false,  // Configura según lo necesites
        }}
      />
    </Stack.Navigator>
  );
}
