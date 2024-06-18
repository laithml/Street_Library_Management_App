import React from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

const LoadingAnimation = () => {
    return (
        <View style={styles.container}>
            <LottieView
                style={{flex: 1}}
                source={require('../assets/Animation.json')}
                autoPlay
                loop
            />
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

});

export default LoadingAnimation;
