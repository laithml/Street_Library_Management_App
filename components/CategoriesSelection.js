import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, View } from "react-native";
import Styles_screens from "../constants/Styles";
import {getCategories} from "../DB_handler/db_actions";

const CategoriesSelection = ({ onGenreChange, selectedGenres }) => {
    const [activeCategory, setActiveCategory] = useState('Fiction'); // Track active category
    const [genres, setGenres] = useState({ Fiction: [], NonFiction: [] });

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const fetchedGenres = await getCategories(); // This should fetch genres with their Fiction status
                const FictionGenres = fetchedGenres.filter(genre => genre.Fiction);
                const NonFictionGenres = fetchedGenres.filter(genre => !genre.Fiction);
                setGenres({ Fiction: FictionGenres, NonFiction: NonFictionGenres });
            } catch (error) {
                console.error("Failed to fetch genres:", error);
            }
        };

        fetchGenres();
    }, []);

    const handleGenreSelection = (genre) => {
        const updatedSelectedGenres = selectedGenres.includes(genre.id)
            ? selectedGenres.filter(g => g !== genre.id)
            : [...selectedGenres, genre.id];

        onGenreChange(updatedSelectedGenres);
    };

    const renderGenreButtons = (genreList) => {
        return genreList.map(genre => (
            <TouchableOpacity
                key={genre.id}
                style={[
                    Styles_screens.genreButton,
                    selectedGenres.includes(genre.id) ? Styles_screens.selectedGenre : {},
                ]}
                onPress={() => handleGenreSelection(genre)}
            >
                <Text style={Styles_screens.genreButtonText}>{genre.name}</Text>
            </TouchableOpacity>
        ));
    };


    return (
        <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                <TouchableOpacity
                    style={[
                        Styles_screens.categoryButton,
                        activeCategory === 'Fiction' ? Styles_screens.selectedCategory : {},
                    ]}
                    onPress={() => setActiveCategory('Fiction')}
                >
                    <Text>Fiction</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        Styles_screens.categoryButton,
                        activeCategory === 'NonFiction' ? Styles_screens.selectedCategory : {},
                    ]}
                    onPress={() => setActiveCategory('NonFiction')}
                >
                    <Text>Non-Fiction</Text>
                </TouchableOpacity>
            </View>

            <View style={Styles_screens.genresContainer}>
                {renderGenreButtons(genres[activeCategory])}
            </View>
        </View>
    );
};

export default CategoriesSelection;
