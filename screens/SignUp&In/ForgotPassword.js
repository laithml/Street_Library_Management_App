import Styles_screens from "../../constants/Styles";
import {KeyboardAvoidingView, SafeAreaView, Text, TextInput, TouchableOpacity, View} from "react-native";
import {COLORS} from "../../constants";
import React, {useState} from "react";
import {resetPassword} from "../../actions/db_actions";
import LoadingAnimation from "../../components/LoadingAnimation";


const ForgotPassword = ({navigation}) => {

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const isValidEmail = (email) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()\[\]\\.,;:\s@"]+\.)+[^<>()\[\]\\.,;:\s@"]{2,})$/i;
        return re.test(String(email).toLowerCase());
    };

    const handleSignIn = async () => {

        if (!isValidEmail(email)) {
            setErrors({email: 'Invalid email'});
            return;
        }
        setLoading(true);
        await resetPassword(email);
        setLoading(false);
        navigation.navigate("SignIn");
    }
    if (errors.email && isValidEmail(email)) {
        setErrors({});
    }

    if (loading) {
        return (
            <LoadingAnimation/>
        )
    }

    return (
        <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS === "ios" ? "padding" : "height"}>

        <SafeAreaView style={Styles_screens.container}>
            <View style={Styles_screens.headerContainer}>
                <Text style={Styles_screens.headerText}>Reset Password</Text>
            </View>
            <View style={{height: 1.5, backgroundColor: 'grey', width: '100%'}}/>
            <Text style={Styles_screens.header}>Enter your email</Text>
                <View style={Styles_screens.inputContainer}>
                    <Text style={Styles_screens.inputTitle}>Email</Text>
                    <TextInput
                        placeholderTextColor={COLORS.textColor}
                        style={[Styles_screens.input, errors.email &&   Styles_screens.errorField]}
                        placeholder="Email"
                        onChangeText={(text) => {
                            setEmail(text);
                        }}
                        value={email}
                    />
                    {errors.email && <Text style={ Styles_screens.error}>{errors.email}</Text>}
                </View>
        </SafeAreaView>
            <View style={Styles_screens.buttonsContainer}>
                <TouchableOpacity style={Styles_screens.submitButton} onPress={handleSignIn}>
                    <Text style={Styles_screens.submitButtonText}>Send email</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>

    )
}

export default ForgotPassword
