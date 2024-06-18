import React, { useState } from "react";
import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import Styles_screens from "../constants/Styles";
import {COLORS, SIZES} from "../constants";

const LibrarySelectionModal = ({ visible, onClose, libraries, onSelect }) => {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <View style={Styles_screens.modalContainer}>
                <View style={[Styles_screens.modalContent, { maxHeight: '60%' }]}>
                    <TextInput
                        style={Styles_screens.modalSearch}
                        placeholder="Search Library..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    <ScrollView>
                        {libraries.filter(library => library.name?.toLowerCase()
                            .includes(searchQuery.toLowerCase())).map((library, index) => (
                            <TouchableOpacity
                                key={index}
                                style={Styles_screens.modalItem}
                                onPress={() => {
                                    onSelect(library.id, library.name);
                                    setSearchQuery('');
                                    onClose();
                                }}>
                                <Text style={Styles_screens.modalItemText}>{library.name}</Text>
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
                        <Text style={Styles_screens.buttonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default LibrarySelectionModal;
