import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { COLORS, FONTS, SIZES } from "../constants";
import { useTranslation } from "react-i18next";
import { userFromId } from "../actions/db_actions";

const UserBasic = ({ user }) => {
    const { t } = useTranslation();
    const [userDetails, setUserDetails] = useState(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const loadUser = await userFromId(user);
                setUserDetails(loadUser);
            } catch (error) {
                console.error("Error loading user details:", error);
            }
        };

        fetchUserDetails();
    }, [user]);

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
            {userDetails ? (
                <View style={{ flex: 1, paddingRight: 10 }}>
                    <Text style={{ ...FONTS.body3, color: COLORS.textColor }}>{userDetails.name}</Text>
                    <Text style={{ ...FONTS.body4, color: COLORS.textColor }}>{userDetails.email}</Text>
                </View>
            ) : (
                <Text style={{ ...FONTS.body3, color: COLORS.lightGreen }}>{t('loading')}</Text>
            )}
        </View>
    );
};

export default UserBasic;
