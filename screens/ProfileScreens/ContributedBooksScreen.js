import React from 'react';
import { useUser } from "../../Context/UserContext";
import GenericBooksScreen from "../../components/GenericBooksScreen";
import { useTranslation } from 'react-i18next';

const ContributedBooksScreen = ({ navigation }) => {
    const { t } = useTranslation();
    const { user } = useUser();

    return (
        <GenericBooksScreen
            navigation={navigation}
            bookIds={user.booksAdded ? user.booksAdded : []}
            title={t('contributions')}
        />
    );
};

export default ContributedBooksScreen;
