import React from "react";
import { Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import { COLORS, SIZES } from '../constants';

const BookItem = ({ navigation, book }) => {
    return (
        <TouchableOpacity style={styles.container} onPress={()=> navigation.navigate("BookDetails", {book: book})}>
            <Image source={{ uri: book.images[0] }} resizeMode={"cover"} style={styles.image} />
            <Text style={styles.title}>{book.title}</Text>
            <Text style={styles.author}>{book.author}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        margin: SIZES.base,
        borderRadius: SIZES.radius,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: SIZES.radius,
        elevation: 2,
    },
    image: {
        width: 180,
        height: 250,
        borderRadius: SIZES.radius,
    },
    title: {
        marginTop: SIZES.margin,
        marginHorizontal: SIZES.base,
        fontSize: SIZES.font,
        fontWeight: 'bold',
    },
    author: {
        marginBottom: SIZES.base,
        marginHorizontal: SIZES.base,
        fontSize: SIZES.font,
        color: COLORS.gray,
    },
});

export default BookItem;
