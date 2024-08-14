import React, { useState } from "react";
import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import Styles_screens from "../constants/Styles";
import { COLORS, SIZES } from "../constants";
import { useTranslation } from "react-i18next";

const UserSelectionModal = ({ visible, onClose, users, onSelect }) => {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <View style={Styles_screens.modalContainer}>
                <View style={[Styles_screens.modalContent, { maxHeight: '60%' }]}>
                    <TextInput
                        style={Styles_screens.modalSearch}
                        placeholder={t("searchForUsers")}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    <ScrollView>
                        {users.filter(user => user.name?.toLowerCase()
                            .includes(searchQuery.toLowerCase())).map((user, index) => (
                            <TouchableOpacity
                                key={index}
                                style={Styles_screens.modalItem}
                                onPress={() => {
                                    onSelect(user.id, user.name);
                                    setSearchQuery('');
                                    onClose();
                                }}>
                                <Text style={Styles_screens.modalItemText}>{user.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                    <TouchableOpacity onPress={onClose} style={{
                        backgroundColor: COLORS.primary,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: SIZES.radius,
                        height: 50,
                        marginTop: 10,
                    }}>
                        <Text style={Styles_screens.buttonText}>{t("close")}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default UserSelectionModal;
