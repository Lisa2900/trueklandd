import { View, Text } from 'react-native'
import React from 'react'

import { createStackNavigator } from '@react-navigation/stack'
import ItemList from '../Screens/ItemList';
import HomeScreen from '../Screens/HomeScreen';
import ProductDetail from '../Screens/ProductDetail';
import UserProfileScreen from '../Screens/UserProfileScreen';
import ProductUser from '../Screens/ProductsUser';
import EditPostScreen from '../Screens/EditPostScreen';
import ChatScreen from '../Screens/ChatScreen';

const Stack = createStackNavigator();

export default function HomeScreenStackNav() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen}
                options={{
                    headerShown: false
                }} />
            <Stack.Screen name="item-list" component={ItemList}
                options={({ route }) => ({
                    title: route.params.Category,
                    headerStyle: {
                        backgroundColor: '#00b4d8'
                    }, headerTintColor: '#fff',
                })}
            />
            <Stack.Screen name="product-detail" component={ProductDetail}
                options={({headerShown: false,
                    headerStyle: {
                        backgroundColor: '#00b4d8'
                    }, headerTintColor: '#fff',
                    headerTitle:'Detalles'
                })}
            />
             <Stack.Screen name="UserProfileScreen" component={UserProfileScreen}
             options={{
                    headerShown: false
                }} />
             <Stack.Screen name="ProductsUser" component={ProductUser} 
                options={{
                    headerShown: false
                }}
             />
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