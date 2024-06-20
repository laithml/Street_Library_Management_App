import React from 'react';
import { useUser } from "../../Context/UserContext";
import GenericBooksScreen from "../../components/GenericBooksScreen";

const ContributedBooksScreen = ({ navigation }) => {
    const { user } = useUser();

    return (
        <GenericBooksScreen
            navigation={navigation}
            bookIds={user.booksAdded ? user.booksAdded : []}
            title="Contributions"
        />
    );
};

export default ContributedBooksScreen;
