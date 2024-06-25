import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import { useTranslation } from 'react-i18next';

const LoadingAnimation = () => {
    const { t } = useTranslation();

    return (
        <View style={styles.container}>
            <LottieView
                style={{flex: 1}}
                source={require('../assets/Animation.json')}
                autoPlay
                loop
            />
            <Text style={styles.loadingText}>{t('loading')}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        position: 'absolute',
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.8)',
        zIndex: 1000,
    },
    loadingText: {
        position: 'absolute',
        bottom: 50,
        alignSelf: 'center',
        color: '#fff',
        fontSize: 18,
    }
});

export default LoadingAnimation;
