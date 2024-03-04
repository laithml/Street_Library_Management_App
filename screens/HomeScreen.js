import React from "react";
import { SafeAreaView, View, Text, TouchableOpacity, Image, ScrollView, FlatList, StyleSheet } from 'react-native';
import { COLORS, FONTS, SIZES, icons, images } from '../constants';

const HomeScreen = ({ navigation }) => {
    // Dummy data for books and categories
    const books = [
        // ... array of book objects
    ];

    const categories = [
        // ... array of category objects
    ];

    const renderBooks = ({ item }) => {
        // Book item rendering logic
    };

    const renderCategories = ({ item }) => {
        // Category item rendering logic
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.backgroundColor }}>
            {/* Header Section */}
            <View style={styles.headerContainer}>
                {/* Add header content here */}
                <Text style={styles.headerTitle}>For You</Text>
            </View>

            {/* Body Section */}
            <ScrollView style={{ marginTop: SIZES.radius }}>
                {/* Books Section */}
                <View style={styles.booksSection}>
                    <FlatList
                        data={books}
                        renderItem={renderBooks}
                        keyExtractor={(item) => item.id.toString()}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    />
                </View>

                {/* Categories Section */}
                <View style={styles.categoriesSection}>
                    <Text style={styles.sectionTitle}>Categories</Text>
                    <FlatList
                        data={categories}
                        renderItem={renderCategories}
                        keyExtractor={(item) => item.id.toString()}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        height: 200,
        // Add styles for header
    },
    headerTitle: {
        ...FONTS.h1,
        color: COLORS.black,
        paddingHorizontal: SIZES.padding
    },
    booksSection: {
        // Add styles for book section
    },
    categoriesSection: {
        marginTop: SIZES.padding,
        // Add styles for categories section
    },
    sectionTitle: {
        ...FONTS.h2,
        color: COLORS.black,
        paddingHorizontal: SIZES.padding
    },
    // Add styles for other components
});

export default HomeScreen;
