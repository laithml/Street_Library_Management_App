import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import {COLORS, FONTS, SIZES} from "../constants";
import { useTranslation } from "react-i18next";
import { userFromId } from "../actions/db_actions";

const AdminBasic = ({ admin, onRemove }) => {
    const { t } = useTranslation();
    const [adminDetails, setAdminDetails] = useState(null);

    useEffect(() => {
        const fetchAdminDetails = async () => {
            try {
                const loadAdmin = await userFromId(admin);
                setAdminDetails(loadAdmin);
            } catch (error) {
                console.error("Error loading admin details:", error);
            }
        };

        fetchAdminDetails();
    }, [admin]);

    return (
        <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 10,
            backgroundColor: COLORS.darkBlue,
            marginBottom: 10,
            borderRadius: SIZES.radius,
        }}>
            {adminDetails ? (
                <View style={{ flex: 1, paddingRight: 10 }}>
                    <Text style={{ ...FONTS.body3, color: COLORS.textColor }}>{adminDetails.name}</Text>
                    <Text style={{ ...FONTS.body4, color: COLORS.textColor }}>{adminDetails.email}</Text>
                </View>
            ) : (
                <Text style={{ ...FONTS.body3, color: COLORS.lightGreen }}>{t('loading')}</Text>
            )}
            <TouchableOpacity onPress={onRemove} style={{ padding: 5 }}>
                <Text style={{ color: COLORS.lightRed }}>{t('remove')}</Text>
            </TouchableOpacity>
        </View>
    );
};

export default AdminBasic;
