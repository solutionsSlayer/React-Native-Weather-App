import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
    stylesMeteoPage,
    stylesMeteoViews
} from "./assets/styles/styles";
import {
    Text,
    TextInput,
    View,
    TouchableHighlight, Image
} from "react-native";

function MeteoScreen({ navigation, route }) {

    const styles = stylesMeteoPage;
    const [state, setState] = useState({searchString: "Bordeaux"});

    function onSearchTextChanged(event) {
        console.log('searchTextChanged');
        setState({
            searchString: event.nativeEvent.Text
        });
    }

  return (
      <View style={styles.container}>
          <Text style={styles.description}>Recherchez la météo de votre ville</Text>
          <View style={styles.flowRight}>
              <TextInput
                  style={styles.searchInput}
                  placeholder='Entrez la ville recherché'
                  onChange={ onSearchTextChanged.bind(this) }
                  value={ state.searchString }>
              </TextInput>
              <TouchableHighlight style={styles.button}
                                  underlayColor="#99d9f4">
                  <Text
                      style={styles.buttonText}
                      onPress={ () => navigation.navigate("MeteoView", {
                         "city" : state.searchString
                      }) }>Go</Text>
              </TouchableHighlight>
          </View>
      </View>
  );
}

function MeteoView({ route }) {

    const { city } = route.params;

    useEffect(() => {
        searchMeteoData(city);
    }, [])

    const styles = stylesMeteoViews;
    const [state, setState] = useState({ meteoData: {} })

    function _handleResponse(response) {

        setState({
            meteoData: {
                'icon': 'http://openweathermap.org/img/wn/' +  response.weather[0].icon + '.png',
                'main': response.weather[0].main,
                'city': response.name,
                'description': response.description,
                'temp': response.main.temp
            }
        })
    }

    function searchMeteoData(city) {
        fetch(
            'https://cors-anywhere.herokuapp.com/api.openweathermap.org/data/2.5/weather?q='
            + city + '&appid=c54c8121399da7efb404cb303ce7cef7',
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json'
                }
            }
        )
            .then(response => response.json())
            .then(json => _handleResponse(json))
            .catch(error => console.log(error))

    }

    return (
        <View style={styles.container}>
            <Image
                style={styles.image}
                source={{uri: state.meteoData.icon}}>
            </Image>
            <View style={styles.heading}>
                <Text style={styles.temp}>{ state.meteoData.temp }</Text>
                <Text style={styles.city}>{ state.meteoData.city }</Text>
                <Text style={styles.separator} />
            </View>
            <Text style={styles.description}>{ state.meteoData.description }</Text>
        </View>
    );
}

const Stack = createStackNavigator();

export default function App() {
  return (
      <NavigationContainer>
          <Stack.Navigator initialRouteName="MeteoScreen">
              <Stack.Screen name="MeteoScreen" component={MeteoScreen} options={{title: 'Météo App  ⚛ '}} />
              <Stack.Screen name="MeteoView" component={MeteoView} options={{title: 'Météo Infos  ⚛ '}} />
          </Stack.Navigator>
      </NavigationContainer>
  );
}

