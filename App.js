import React, { useState, useEffect, useRef, useContext } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Dimensions,
  Button,
  StyleSheet,
  Text,
  View,
  LogBox,
} from "react-native";

LogBox.ignoreLogs([
  "[react-native-gesture-handler] Seems like you\'re using an old API with gesture components, check out new Gestures system!",
]);

//Community hooks used to get dimensions and device orientation
import { useDimensions, useDeviceOrientation } from "@react-native-community/hooks";



//Navigation
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from '@react-navigation/drawer'; 
//Firebase
import auth from "@react-native-firebase/auth";

//Screens
import Menu from "./component/menu";
import Nav from "./component/navBar";
import Videos from "./screens/Videos";
import Profile from "./component/Profile";

//Stacks
import HomeStack from "./stacks/HomeStack";
import LOGIN_SIGNUP_STACK from "./stacks/ProfileStack";
import MusicStack from "./stacks/MusicStack";
import TrackPlayer, { State, useProgress } from 'react-native-track-player';

//Contexts
import { TrackContext } from './contexts/trackContext';


export default App = () => {
  const Drawer = createDrawerNavigator();
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const muicPlayerIsSetup = useRef(false)
  const [fullscreen, setFullscreen] = useState();
  const { width, height } = useDimensions().screen
  const orientation = useDeviceOrientation();
  const handleFullscreen = async () => {
    if (orientation.landscape === true) {
      setFullscreen(true)
      StatusBar.setHidden(true)
    }
    if (orientation.portrait === true) {
      setFullscreen(false)
    }
  }
  const isSetup = useRef(false)
  const Player = useContext(TrackContext)
  const setUpTrackPlayer = async () => {
      try {
          await Player.setupPlayer().then(() => {
              isSetup.current = true;
              setInitializing(false)
          });
      } catch (e) {
          console.log(e)
      }
  }

  // Setting up track player on component load
  useEffect(() => {
      if (!isSetup.current) {
          setUpTrackPlayer();
      }
      setInitializing(false)
      return () => {
          isSetup.current = false
          Player.destroy()
      }
  }, [isSetup])

  // Handling authentication for user
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    handleFullscreen();
    return () => {
      subscriber(); // unsubscribe on unmount
    } 
  }, [orientation]);

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  // //Loading Screen
  if (initializing) return <></>;

  // //Login Navigator
  if (!user)
    return (
      <NavigationContainer style={{}}>
        <LOGIN_SIGNUP_STACK />
      </NavigationContainer>
    );

  return (
    <>
      <NavigationContainer style={{ flex: 1, height: height, width: width }}>
        <StatusBar
          animated={true}
          backgroundColor={"#53e639"}
        />
           <Drawer.Navigator
          screenOptions={({ navigation }) => ({
            headerShown: !fullscreen,
            initialRouteName: "Home",
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: "#53e639",
              height: 55,
            },
            drawerStyle: {
              backgroundColor: "#53e639",
            },
            drawerContentOptions: {
              activeTintColor: "#8eff7a",
              itemStyle: {
                marginTop: 10,
                justifyContent: "center",
              },
              labelStyle: {
                fontSize: 25,
                color: "white",
              },
            },
            headerLeft: () => <Menu navigation={navigation} />,
            headerTitle: () => <Nav navigation={navigation} />,
            headerRight: () => (
              <Profile navigation={navigation} auth={auth} />
            ),
          })}
          headerMode="screen"
        >
          <Drawer.Screen name="Home" component={HomeStack} />
          <Drawer.Screen name="Music" component={MusicStack} />
          <Drawer.Screen name="Videos" component={Videos} initialParams={{ fullscreen: fullscreen }} />
          <Drawer.Screen name="Profile" component={ProfileStack} />
        </Drawer.Navigator>

      </NavigationContainer>
    </>
  );
};

const styles = StyleSheet.create({
  loginpage: {
    display: "flex",
    flex: 1,
    backgroundColor: "#53e639",
  },
  signupTextInput: {
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
    borderColor: "black",
    flexDirection: "row",
    borderWidth: 2,
    width: "100%",
    height: 45,
  },
  button: {},
  signupButton: {
    marginTop: 10,
  },
});




// screenOptions={({ navigation }) => ({
//   headerShown: !fullscreen,
//   initialRouteName: "Home",
//   headerTitleAlign: "center",
//   headerStyle: {
//     backgroundColor: "#53e639",
//     height: 55,
//   },
//   drawerStyle: {
//     backgroundColor: "#53e639",
//   },
//   drawerContentOptions: {
//     activeTintColor: "#8eff7a",
//     itemStyle: {
//       marginTop: 10,
//       justifyContent: "center",
//     },
//     labelStyle: {
//       fontSize: 25,
//       color: "white",
//     },
//   },
//   headerLeft: () => <Menu navigation={navigation} />,
//   headerTitle: () => <Nav navigation={navigation} />,
//   headerRight: () => (
//     <Profile navigation={navigation} auth={auth} />
//   ),
// })}
// headerMode="screen"
// >
// {/* <Drawer.Screen name="Home" component={HomeStack} /> */}
// {/* <Drawer.Screen name="Music" component={MusicStack} /> */}
// {/* <Drawer.Screen name="Videos" component={Videos} initialParams={{ fullscreen: fullscreen }} /> */}
// {/* <Drawer.Screen name="Profile" component={ProfileStack} /> */}