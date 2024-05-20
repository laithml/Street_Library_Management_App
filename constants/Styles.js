import {StyleSheet} from "react-native";
import {COLORS, SIZES} from "./theme";
import {Platform,StatusBar} from "react-native";


const Styles_screens = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        alignItems: 'center',
        backgroundColor: COLORS.backgroundColor,
    },
    inputContainer: {
        width: '90%',
        marginTop: 20,
    },
    input: {
        width: '100%',
        backgroundColor: COLORS.backgroundColor2,
        borderColor: 'rgba(0, 0, 0, 0.1)', // Subtle border
        borderWidth: 1,
        borderRadius: SIZES.inputRadius,
        height: 50,
        paddingHorizontal: 20,
        marginBottom: 20,
        fontSize: SIZES.h3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 2,
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
    modalItemContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
    },
    modalItemText: {
        fontSize: SIZES.body3,
        color: COLORS.textColor,
    },closeButton: {
        alignSelf: 'flex-end',
        padding: 10,
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
    scrollView: {
        width: '100%',
    },
    section: {
        marginTop: SIZES.margin,
        marginBottom: SIZES.margin,
        backgroundColor: COLORS.backgroundColor2,
        borderRadius: SIZES.radius,
        padding: SIZES.padding,
        marginHorizontal: SIZES.margin,
        shadowColor: COLORS.black,
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: SIZES.h2,
        fontWeight: 'bold',
        color: COLORS.black,
        marginBottom: SIZES.margin,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SIZES.padding,
        paddingHorizontal: SIZES.padding,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.primary,
    },
    cardTextContainer: {
        flex: 1,
        marginLeft: SIZES.margin,
    },
    cardText: {
        fontSize: SIZES.h3,
        color: COLORS.black,
    },
    cardInfo: {
        fontSize: SIZES.body4,
        color: COLORS.gray,
    }, iconContainer: {
        marginRight: 16, // This is the space between the icon and the text
    },
    listItem: {
        padding: 10,
        backgroundColor: '#f8f8f8',
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    listItemText: {
        fontSize: 18,
        color: '#333',
    },
    headerContainer:{height: '10%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    genreContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: SIZES.radius,
    },
    genre: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
        marginRight: SIZES.radius,
        marginBottom: SIZES.radius,
        height: 35,
        borderRadius: 10,
    }



});

export default Styles_screens;
