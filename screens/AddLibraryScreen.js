import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { COLORS } from "../constants";

const AddLibraryScreen = () => {
    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput style={styles.input} placeholder="Library Title" placeholderTextColor={COLORS.textColor} />
                <TextInput style={[styles.input, styles.descriptionInput]} placeholder="Description" placeholderTextColor={COLORS.textColor} multiline />
            </View>
            <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Upload Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Take Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.submitButton}>
                    <Text style={styles.submitButtonText}>Add Library</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.backgroundColor,
    },
    inputContainer: {
        width: '90%',
        alignItems: 'center',
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: COLORS.primary,
        borderRadius: 10,
        paddingHorizontal: 20,
        marginBottom: 20,
        fontSize: 16,
    },
    descriptionInput: {
        height: 100,
    },
    buttonsContainer: {
        marginTop: 100,
        width: '100%',
        alignItems: 'center',
    },
    button: {
        width: '80%',
        height: 50,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginBottom: 20,
    },
    buttonText: {
        fontFamily: "Roboto-Bold",
        color: COLORS.black,
        fontSize: 18,
    },
    submitButton: {
        width: '90%',
        height: 50,
        backgroundColor: COLORS.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginBottom: 20,
    },
    submitButtonText: {
        fontFamily: "Roboto-Bold",
        color: COLORS.white,
        fontSize: 18,
    }
});

export default AddLibraryScreen;
