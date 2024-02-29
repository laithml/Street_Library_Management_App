import React from 'react';
import {View, Text, Image, Button, StyleSheet, TouchableOpacity} from 'react-native';
import {COLORS, SIZES} from "../constants";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const LibraryDetail = ({ library, onGetDirections,onDismiss }) => {
    return (
        <View style={styles.cardContainer}>
            <TouchableOpacity style={styles.dismissButton} onPress={onDismiss}>
                <FontAwesome name={'close'} size={25}  />
            </TouchableOpacity>
            {library.imgSrcs && library.imgSrcs[0] && (
                <Image source={{ uri: library.imgSrcs[0] }} style={styles.image} />
            )}
            <View style={styles.textContainer}>
                <Text style={styles.name}>{library.name}</Text>
                <Text style={styles.description}>{library.description}</Text>
            </View>
            <View style={{flex:1,flexDirection:'row'  ,justifyContent:'center'}}>
            <TouchableOpacity style={styles.button}  onPress={onGetDirections} >
            <Text style={{color:COLORS.white}}>Get Directions</Text>
            </TouchableOpacity>
            </View>
        </View>
    );
};

export default LibraryDetail;

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: COLORS.backgroundColor2,
        borderRadius: SIZES.radius,
        borderWidth: 1,
        borderColor: COLORS.black,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: 120,
    },
    textContainer: {
        padding: 10,
        alignItems: 'center',
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    description: {
        fontSize: 16,
        color: COLORS.textColor,
        marginBottom: 10,
    },
    button: {
        backgroundColor: COLORS.secondary,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: SIZES.radius,
        marginBottom: 10,
        width: '90%',
    },
    dismissButton: {
        alignSelf: 'flex-end',
        padding: 8,
    },
});
