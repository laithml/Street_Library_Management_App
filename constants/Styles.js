import {StyleSheet} from "react-native";
import {COLORS, SIZES} from "./theme";
import {Platform,StatusBar} from "react-native";


const Styles_screens = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        alignItems: 'center',
        backgroundColor: COLORS.backgroundColor,
        marginBottom: 10,
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
        width: '100%',
        alignItems: 'center',
        marginBottom: SIZES.padding,
    },
    buttonsContainerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%',
        marginBottom: 10,
    },
    button: {
        width: '80%',
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: SIZES.radius,
        marginBottom: 16,
        height: 50,
        marginTop: 10,
    },
    buttonR: {
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: SIZES.radius,
        height: 50,
        width: "45%",
    },
    buttonText: {
        color: COLORS.black,
        fontSize: SIZES.body2,
        fontWeight: 'bold',
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
        width: "45%",
        height: 50,
    },
    submitButtonText: {
        color: COLORS.white,
        fontSize: SIZES.body3,
    },
    map: {
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
        padding: 18,
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
        marginBottom: 18
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
        marginTop: 20,
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
        marginRight: 10,
    },

    removeImageButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
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
    buttonNoBorder: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: SIZES.padding,
        marginBottom: 20,
    }, header: {
        fontSize: SIZES.h1,
        fontWeight: 'bold',
        alignSelf: "center",
        justifyContent: "center",
        marginTop: 20,
        marginBottom: 20
    },header2: {
        fontSize: SIZES.body3,
        fontWeight: "regular",
        marginBottom: 20}
    ,icon: {
        position: 'absolute',
        right: 20,
        top: 12,
    },
    inputWrapper: {
        width: '100%',
        position: 'relative',
    },error: {
        color: 'red',
        fontSize: SIZES.body3,
        marginBottom: 10,
    },errorField: {
        borderColor: 'red',
        borderWidth: 1,
    },



});

export default Styles_screens;
