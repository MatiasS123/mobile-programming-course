import React, { useState } from 'react';
import { 
  FlatList, 
  TextInput,
  TouchableOpacity, 
  Text, 
  View
} from 'react-native';

import styles from "./styles.js"
import getArtistsNotAssociatedWithLabel from "./getArtistsNotWithLabel.js"

const MainPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  interface labelItem {
    key: String
  }

  interface artistItem {
    key: String
  }

  const [currLabelInField, setCurrLabel] = useState('');
  const [listOfLabels, setListOfLabels] = useState<labelItem[]>([]);
  const [foundArtists, setArtists] = useState<artistItem[]>([]);
  const [invalidSearchQuery, setSearchQueryValidity] = useState(true);
  const [visibleQueryError, setVisibleQueryError] = useState(false);

  const handleSearchQuery = (text: string) => {
    setSearchQuery(text);
    checkSearchValidity(text);
    setVisibleQueryError(false);
  };

  const handleLabelAddQuery = (text: string) => {
    setArtists([]);
    setCurrLabel(text);
  }

  const checkSearchValidity = (searchPlaylistUrl: string) => {
    if(searchPlaylistUrl.match(/https:\/\/open.spotify.com\/playlist\/[A-Za-z0-9]{22}.*/) 
      || searchPlaylistUrl.match(/open.spotify.com\/playlist\/[A-Za-z0-9]{22}.*/) 
      || searchPlaylistUrl=="") {
        setSearchQueryValidity(false);
    }
    else {
        setSearchQueryValidity(true);
    }
  }

  const Search = () => {
    setArtists([]);
    const tempArtistList = getArtistsNotAssociatedWithLabel(listOfLabels);
    const artistObject = []
    for(let i = 0; i < tempArtistList.length; i++) {
        artistObject.push({"key": tempArtistList[i]})
    }
    setArtists(artistObject);
  }

  const AddLabel = () => {
    if(!listOfLabels.some(item => item.key == currLabelInField) && currLabelInField!="") {
        setListOfLabels([...listOfLabels, {"key": currLabelInField}])
    }
  }

  const UserSearchQueryError = () => {
    if(invalidSearchQuery) {
        return (
            <View>
              <Text style={styles.error}>Please check that the playlist URL is correct</Text>
            </View>
        )
    }
  }

  const ClearLabels = () => {
    setListOfLabels([]);
  }

  const checkIfEcludedLabelsEmpty = (Property: labelItem[]) => {
    if(Property.length != 0) {
        return (<Text>Excluded labels:</Text>)
    }
  }

  const checkIfArtistsArrayEmpty = (Property: artistItem[]) => {
    if(Property.length != 0) {
        return (<Text>Found artists that fit the criteria:</Text>)
    }
  }

  const renderLabelList = ({item}: {item: labelItem}) => (
    <Text style={styles.label}>{item.key}</Text>
  );

  const renderFoundArtists = ({item}: {item: artistItem}) => (
    <Text style={styles.artist}>{item.key}</Text>
  );

  return (
    <View style={styles.container}>
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Playlist link you want to search for artists:</Text>
            <Text>(Non-functional in this demo)</Text>
            <Text style={styles.sub}>I couldn't get the Spotify API to respond with label data.</Text>
            <TextInput
            style={styles.input}
            value={searchQuery}
            onChangeText={handleSearchQuery}
            placeholder="ex.https://open.spotify.com/playlist/5g33jUKK..."
            />
        
            {UserSearchQueryError()}
            <TouchableOpacity style={styles.button} onPress={Search}><Text style={styles.buttonText}>Search</Text></TouchableOpacity>
        </View>

        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Add labels to exclude from your search:</Text>
            <TextInput
            style={styles.input}
            value={currLabelInField}
            onChangeText={handleLabelAddQuery}
            placeholder="ex.Apple Records"
            />
            <TouchableOpacity style={styles.button} onPress={AddLabel}><Text style={styles.buttonText}>Add a label</Text></TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={ClearLabels}><Text style={styles.buttonText}>Clear labels</Text></TouchableOpacity>
            {checkIfEcludedLabelsEmpty(listOfLabels)}
            <FlatList style={{ flexDirection: 'row', flexWrap: 'wrap' }} data={listOfLabels} renderItem={renderLabelList}></FlatList>
            {checkIfArtistsArrayEmpty(foundArtists)}
            <FlatList style={styles.artistList} data={foundArtists} renderItem={renderFoundArtists}></FlatList>
        </View>
    </View>
  );
};

export default MainPage;
