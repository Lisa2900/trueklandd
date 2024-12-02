import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import ExploreScreen from '../Screens/ExploreScreen';
import ProductDetail from '../Screens/ProductDetail';
import UserProfileScreen from '../Screens/UserProfileScreen';
import EditPostScreen from '../Screens/EditPostScreen';
import ChatScreen from '../Screens/ChatScreen';

const Stack = createStackNavigator();

export default function ExploreScreenStackNav() {
    return (
        <Stack.Navigator>
            <Stack.Screen name='explorar' component={ExploreScreen}
            options={
                {
                    headerShown:false
                }
            } />
            <Stack.Screen name='product-detail' component={ProductDetail}  options={
                {
                    headerShown:false
                }
            } />
            <Stack.Screen name="UserProfileScreen" component={UserProfileScreen}  options={
                {
                    headerShown:false
                }
            } />
            <Stack.Screen name='edit-product' component={EditPostScreen}
        options={({
          headerShown: false,
          headerStyle: {
            backgroundColor: '#3bB2f6'
          }, headerTintColor: '#fff',
          headerTitle: 'Editar Producto'
        })} />
        <Stack.Screen
                name="ChatScreen"
                component={ChatScreen}
                options={{
                    headerShown: false,  // Si deseas ocultar el header
                }}
            />
         
        </Stack.Navigator>
    )
}