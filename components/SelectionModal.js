import React from 'react';
import { Modal, View, TouchableOpacity, Text, FlatList } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome'; // Make sure FontAwesome is installed
import Styles_screens from "../constants/Styles";
import {Colors} from "react-native/Libraries/NewAppScreen";
import {COLORS} from "../constants";

const SelectionModal = ({ items, visible, setVisible, onSelect, renderItem }) => {
    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <View style={Styles_screens.modalContainer}>
                <View style={Styles_screens.modalContent}>
                    <TouchableOpacity
                        style={Styles_screens.closeButton}
                        onPress={() => setVisible(false)}>
                        <FontAwesome name="times" size={20} color={COLORS.textColor} />
                    </TouchableOpacity>
                    <FlatList
                        data={items}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={Styles_screens.modalItem}
                                onPress={() => {
                                    onSelect(item);
                                    setVisible(false);
                                }}>
                                {renderItem(item)}
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </View>
        </Modal>
    );
};

export default SelectionModal;
