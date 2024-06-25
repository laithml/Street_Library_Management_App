import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SIZES } from "../constants";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useTranslation } from "react-i18next";

const LibraryDetail = ({ library, onGetDirections, onDismiss }) => {
    const { t } = useTranslation();

    return (
        <View style={styles.cardContainer}>
            <TouchableOpacity style={styles.dismissButton} onPress={onDismiss}>
                <FontAwesome name="times" size={25} color={COLORS.black} />
            </TouchableOpacity>
            {library.imgSrcs && library.imgSrcs[0] && (
                <Image source={{ uri: library.imgSrcs[0] }} style={styles.image} />
            )}
            <View style={styles.textContainer}>
                <Text style={styles.name}>{library.name}</Text>
                <Text style={styles.description}>{library.description}</Text>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={onGetDirections}>
                    <Text style={styles.buttonText}>{t("getDirections")}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default LibraryDetail;

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: COLORS.backgroundColor,
        borderRadius: SIZES.radius,
        borderWidth: 1,
        borderColor: COLORS.gray,
        padding: SIZES.padding,
    },
    image: {
        width: '100%',
        height: 120,
        borderRadius: SIZES.radius,
    },
    textContainer: {
        padding: 10,
        alignItems: 'center',
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
        color: COLORS.textColor,
    },
    description: {
        fontSize: 16,
        color: COLORS.gray,
        textAlign: 'center',
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 10,
    },
    button: {
        backgroundColor: COLORS.secondary,
        padding: 10,
        borderRadius: SIZES.radius,
        width: '90%',
        alignItems: 'center',
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 16,
    },
    dismissButton: {
        position: 'absolute',
        right: 3,
        top: 3,
        padding: 3,
        zIndex: 10,
    },
});
