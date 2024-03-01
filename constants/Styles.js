import {StyleSheet} from "react-native";
import {COLORS} from "./theme";

const Styles_screens = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: COLORS.backgroundColor,
        marginBottom: 80,
    },
    inputContainer: {
        width: '90%',
        marginTop: 20,
    },
    input: {
        width: '100%',
        backgroundColor: COLORS.primary,
        borderRadius: 10,
        height: 50,
        paddingHorizontal: 20,
        marginBottom: 20,
        fontSize: 16,
    },
    googleTextInput: {
        height: 50,
        color: COLORS.textColor,
        fontSize: 16,
        backgroundColor: COLORS.primary,
        borderRadius: 10,
    },
    descriptionInput: {
        height: 100,
    },
    buttonsContainer: {
        position: 'absolute',
        width: '100%',
        alignItems: 'center',
        top: '100%',
        marginBottom: 30,
    },
    button: {
        width: '80%',
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginBottom: 20,
        height: 50,
    },
    buttonText: {
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
    },
    submitButtonText: {
        color: COLORS.white,
        fontSize: 18,
    },
    map: {
        width: '90%',
        height: 250,
        marginTop: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: COLORS.backgroundColor2,
        padding: 20,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    modalItem: {
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    modalItemText: {
        fontSize: 18,
        color: COLORS.textColor,
    },
    searchInput: {
        width: '100%',
        backgroundColor: COLORS.primary,
        borderRadius: 10,
        height: 50,
        paddingHorizontal: 20,
        marginBottom: 20,
        fontSize: 16,
    },

});

export default Styles_screens;
