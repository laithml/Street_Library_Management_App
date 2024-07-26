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
        backgroundColor: COLORS.textColor,
    },
    image: {
        width: 180,
        height: 250,
        borderRadius: SIZES.radius,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
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
