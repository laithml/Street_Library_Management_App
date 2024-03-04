import {StyleSheet} from "react-native";
import {COLORS, SIZES} from "./theme";

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
        borderRadius: SIZES.radius,
        height: 50,
        paddingHorizontal: 20,
        marginBottom: 20,
        fontSize: SIZES.h3,
    },
    googleTextInput: {
        height: 50,
        color: COLORS.textColor,
        fontSize: SIZES.h3,
        backgroundColor: COLORS.primary,
        borderRadius: SIZES.radius,
    },
    descriptionInput: {
        height: 100,
    },
    buttonsContainer: {
        position: 'absolute',
        width: '100%',
        alignItems: 'center',
        bottom: 0,
        marginBottom: 10,
    },
    buttonsContainerRow: {
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        width: '80%',
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: SIZES.radius,
        marginBottom: 20,
        height: 50,
    },
    buttonR: {
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: SIZES.radius,
        height: 50,
        width:"45%",
    },
    buttonText: {
        color: COLORS.black,
        fontSize: SIZES.body3,
    },
    submitButton: {
        width: '90%',
        height: 50,
        backgroundColor: COLORS.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: SIZES.radius,
    }, submitButtonR: {
        backgroundColor: COLORS.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: SIZES.radius,
        width:"45%",
        height: 50,
    },
    submitButtonText: {
        color: COLORS.white,
        fontSize: SIZES.body3,
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
        borderRadius: SIZES.radius,
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
        fontSize: SIZES.body3,
        color: COLORS.textColor,
    },
    searchInput: {
        width: '100%',
        backgroundColor: COLORS.primary,
        borderRadius: SIZES.radius,
        height: 50,
        paddingHorizontal: 20,
        marginBottom: 20,
        fontSize: SIZES.h3,
    },
    categoryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
    },
    categoryButton: {
        padding: 10,
        borderBottomWidth: 5,
        borderBottomColor: COLORS.primary,
    },
    selectedCategory: {
        borderBottomColor: COLORS.secondary,
    },
    genresContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        padding: 10,
    },
    genreButton: {
        margin: 5,
        padding: 10,
        borderWidth: 1,
        borderColor: COLORS.lightGray,
        borderRadius: 20,
    },
    selectedGenre: {
        backgroundColor: COLORS.lightGray,
    },
    genreButtonText: {
        fontSize: SIZES.h3,
    },
    imageUploadSection: {
        flexDirection: 'row',
        alignItems: 'center',
        padding:20
    },

    addImageButton: {
        width: 120,
        height: 120,
        borderRadius: 35,
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },

    image: {
        width: 120,
        height: 120,
        borderRadius: 35,
        marginRight: 10,
    },
    imageItemContainer: {
        position: 'relative',
        marginRight: 10, // Add some spacing between images
    },

    removeImageButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.5)', // Semi-transparent white
        padding: 5,
        borderRadius: SIZES.radius,
        zIndex: 10,
    },
    headerText: {
        fontSize: SIZES.h1,
        fontWeight: 'bold',
        color: COLORS.textColor,
        textAlign: 'center',
        marginBottom: 20,

    },
    descriptionText: {
        fontSize: SIZES.h3,
        color: COLORS.black,
        textAlign: 'center',
        marginBottom: 20,
    },
    inputTitle: {
        color: COLORS.gray,
        fontSize: SIZES.h3,
        marginBottom: 5,
        paddingLeft: 5,
    },


});

export default Styles_screens;
