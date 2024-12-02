import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import ProfileScreen from '../Screens/ProfileScreen';
import MyProducts from '../Screens/MyProducts';
import ProductDetail from '../Screens/ProductDetail';
import EditPostScreen from '../Screens/EditPostScreen';
import ExploreScreen from '../Screens/ExploreScreen';
import UserProfileScreen from '../Screens/UserProfileScreen';

const Stack = createStackNavigator();
export default function ProfileScreenStackNav() {
  return (

    <Stack.Navigator>
      <Stack.Screen name='profile-tab' component={ProfileScreen}
        options={{
          headerShown: false
        }} />
      <Stack.Screen name='my-product' component={MyProducts}
        options={({
          headerStyle: {
            backgroundColor: '#00b4d8'
          }, headerTintColor: '#fff',
          headerTitle: 'Mis Articulos'
        })} />
      <Stack.Screen name="UserProfileScreen" component={UserProfileScreen} />
      <Stack.Screen name='product-detail' component={ProductDetail}
        options={({
          headerShown: false,
          headerStyle: {
            backgroundColor: '#00b4d8'
          }, headerTintColor: '#fff',
          headerTitle: 'Detalles'
        })} />
      <Stack.Screen name='edit-product' component={EditPostScreen}
        options={({
          headerShown: false,
          headerStyle: {
            backgroundColor: '#3bB2f6'
          }, headerTintColor: '#fff',
          headerTitle: 'Editar Producto'
        })} />
      <Stack.Screen name='explorar' component={ExploreScreen}
        options={({
          headerShown: false,
          headerStyle: {
            backgroundColor: '#3bB2f6'
          }, headerTintColor: '#fff',
          headerTitle: 'Editar Producto'
        })} />
        
         

    </Stack.Navigator>
  )
}