import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Entypo, Feather, MaterialIcons, Ionicons } from '@expo/vector-icons';
import HomeScreenStackNav from './HomeScreenStackNav';
import ProfileScreenStackNav from './ProfileScreenStackNav';
import ExploreScreenStackNav from './ExploreScreenStackNav';
import AddPostScreen from '../Screens/AddPostScreen';
import TouchableScale from 'react-native-touchable-scale';
import ChatScreenStackNav from './ChatScreenStackNav';

const Tab = createBottomTabNavigator();

export default function TabNavigation() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#00b4d8',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          borderTopWidth: 0,
          elevation: 10,
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          shadowOffset: {
            width: 0,
            height: 2,
          },
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 3,
        },
        tabBarActiveTintColor: '#fcf326',
        tabBarInactiveTintColor: '#FFF',
        tabBarShowLabel: false,
        tabBarIconStyle: {
          marginTop: 9,
        },
        tabBarButton: props => (
          <TouchableScale {...props} />
        ),
      }}
    >
      <Tab.Screen
        name='Inicio'
        component={HomeScreenStackNav}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Entypo name="home" size={size + 4} color={color} />
          ),
          tabBarShowLabel: true,
        }}
      />
      <Tab.Screen
        name='Explorar'
        component={ExploreScreenStackNav}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="search" size={size + 4} color={color} />
          ),
          tabBarShowLabel: true,
        }}
      />
            <Tab.Screen
        name='Publicar'
        component={AddPostScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="add-box" size={size + 4} color={color} />
          ),
          tabBarShowLabel: true,
        }}
      />
      <Tab.Screen
  name="Chats"
  component={ChatScreenStackNav}  // Usamos el stack de chats
  options={{
    tabBarIcon: ({ color, size }) => (
      <Ionicons name="chatbubbles" size={size + 4} color={color} />
    ),
  }}
/>

      <Tab.Screen
        name='Perfil'
        component={ProfileScreenStackNav}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size + 4} color={color} />
          ),
          tabBarShowLabel: true,
        }}
      />
    </Tab.Navigator>
  );
}