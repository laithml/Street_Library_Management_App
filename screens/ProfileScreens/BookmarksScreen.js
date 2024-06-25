import React from 'react';
import { useUser } from "../../Context/UserContext";
import GenericBooksScreen from "../../components/GenericBooksScreen";
import { useTranslation } from 'react-i18next';

const BookmarksScreen = ({ navigation }) => {
    const { t } = useTranslation();
    const { user } = useUser();

    return (
        <GenericBooksScreen
            navigation={navigation}
            bookIds={user.bookmarks ? user.bookmarks : []}
            title={t('bookmarks')}
        />
    );
};

export default BookmarksScreen;
