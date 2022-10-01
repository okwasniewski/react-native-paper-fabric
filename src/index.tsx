import * as React from 'react';
import {I18nManager, StyleSheet} from 'react-native';

import {createDrawerNavigator} from '@react-navigation/drawer';
import {InitialState, NavigationContainer} from '@react-navigation/native';
import {
  Provider as PaperProvider,
  MD3DarkTheme,
  MD3LightTheme,
  MD2DarkTheme,
  MD2LightTheme,
} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import DrawerItems from './DrawerItems';
import App from './RootNavigator';

export const PreferencesContext = React.createContext<any>(null);

const DrawerContent = () => {
  return (
    <PreferencesContext.Consumer>
      {preferences => (
        <DrawerItems
          toggleTheme={preferences.toggleTheme}
          toggleRTL={preferences.toggleRtl}
          toggleThemeVersion={preferences.toggleThemeVersion}
          toggleCollapsed={preferences.toggleCollapsed}
          collapsed={preferences.collapsed}
          isRTL={preferences.rtl}
          isDarkTheme={preferences.theme.dark}
        />
      )}
    </PreferencesContext.Consumer>
  );
};

const Drawer = createDrawerNavigator<{Home: undefined}>();

export default function PaperExample() {
  const [isReady, setIsReady] = React.useState(false);
  const [initialState, setInitialState] = React.useState<
    InitialState | undefined
  >();

  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [themeVersion, setThemeVersion] = React.useState<2 | 3>(3);
  const [rtl, setRtl] = React.useState<boolean>(
    I18nManager.getConstants().isRTL,
  );
  const [collapsed, setCollapsed] = React.useState(false);

  const themeMode = isDarkMode ? 'dark' : 'light';

  const theme = {
    2: {
      light: MD2LightTheme,
      dark: MD2DarkTheme,
    },
    3: {
      light: MD3LightTheme,
      dark: MD3DarkTheme,
    },
  }[themeVersion][themeMode] as ReactNativePaper.Theme;

  const preferences = React.useMemo(
    () => ({
      toggleTheme: () => setIsDarkMode(oldValue => !oldValue),
      toggleRtl: () => setRtl(rtla => !rtla),
      toggleCollapsed: () => setCollapsed(!collapsed),
      toggleThemeVersion: () =>
        setThemeVersion(oldThemeVersion => (oldThemeVersion === 2 ? 3 : 2)),
      collapsed,
      rtl,
      theme,
    }),
    [rtl, theme, collapsed],
  );

  return (
    <PaperProvider theme={theme}>
      <SafeAreaProvider>
        <PreferencesContext.Provider value={preferences}>
          <React.Fragment>
            <NavigationContainer initialState={initialState}>
              <Drawer.Navigator
                screenOptions={{
                  drawerStyle: collapsed && styles.collapsed,
                }}
                drawerContent={() => <DrawerContent />}>
                <Drawer.Screen
                  name="Home"
                  component={App}
                  options={{headerShown: false}}
                />
              </Drawer.Navigator>
            </NavigationContainer>
          </React.Fragment>
        </PreferencesContext.Provider>
      </SafeAreaProvider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  collapsed: {
    width: 80,
  },
});
