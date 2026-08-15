import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import type { RootStackParamList } from './src/navigation'
import { CartProvider } from './src/lib/cart'
import { C } from './src/lib/theme'
import { HomeScreen } from './src/screens/HomeScreen'
import { ShopScreen } from './src/screens/ShopScreen'
import { ProductScreen } from './src/screens/ProductScreen'
import { CartScreen } from './src/screens/CartScreen'

const Stack = createNativeStackNavigator<RootStackParamList>()

const navTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: C.canvas, primary: C.void, text: C.void, card: C.canvas, border: C.line },
}

export default function App() {
  return (
    <SafeAreaProvider>
      <CartProvider>
        <NavigationContainer theme={navTheme}>
          <StatusBar style="dark" />
          <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: C.canvas } }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Shop" component={ShopScreen} />
            <Stack.Screen name="Product" component={ProductScreen} />
            <Stack.Screen name="Cart" component={CartScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </CartProvider>
    </SafeAreaProvider>
  )
}
