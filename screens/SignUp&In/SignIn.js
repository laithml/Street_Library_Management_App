import Styles_screens from "../../constants/Styles";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import {COLORS} from "../../constants";
import React, {useRef, useState} from "react";
import LoadingAnimation from "../../components/LoadingAnimation";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {loginUser} from "../../DB_handler/db_actions";
import {useUser} from "../../Context/UserContext";


const SignIn = ({navigation}) => {
    const {setUser} = useUser();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(true);
    const [errors, setErrors] = useState({});
    const passwordRef = useRef(null);

    const isValidEmail = (email) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()\[\]\\.,;:\s@"]+\.)+[^<>()\[\]\\.,;:\s@"]{2,})$/i;
        return re.test(String(email).toLowerCase());
    };
    const handleSignIn = async () => {
        if (!isValidEmail(email)) {
            setErrors({email: 'Invalid email'});
            return;
        }
        if (email && password) {
            console.log("Signing in with email:", email);
            setLoading(true);
            const login = await loginUser(email, password);
            setLoading(false);
            if (login) {
                setUser(login.userData);
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Tab' }],
                });``
            } else {
                Alert.alert("Sign In Failed", "Invalid email or password", [{text: 'OK'}]);
            }

        }
    }

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
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
        <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <SafeAreaView style={Styles_screens.container}>
                <View style={Styles_screens.headerContainer}>
                    <Text style={Styles_screens.headerText}>Sign In</Text>
                </View>
                <View style={{height: 1.5, marginBottom: 30, backgroundColor: 'grey', width: '100%'}}/>

                <Text style={Styles_screens.header}>Welcome Back !</Text>
                <Text style={Styles_screens.header2}>Sign in to your account</Text>
                <View style={Styles_screens.inputContainer}>
                    <Text style={Styles_screens.inputTitle}>Email</Text>
                    {errors.email && <Text style={Styles_screens.error}>{errors.email}</Text>}
                    <TextInput
                        placeholderTextColor={COLORS.textColor}
                        style={[Styles_screens.input, errors.email && Styles_screens.errorField]}
                        placeholder="Email"
                        returnKeyType="next"
                        onSubmitEditing={() => passwordRef.current.focus()}
                        onChangeText={(text) => {
                            setEmail(text);
                        }}
                        value={email}
                    />
                    <Text style={Styles_screens.inputTitle}>Password</Text>
                    <View style={Styles_screens.inputWrapper}>
                        <TextInput
                            placeholderTextColor={COLORS.textColor}
                            style={Styles_screens.input}
                            secureTextEntry={passwordVisible}
                            placeholder="Password"
                            ref={passwordRef}
                            onChangeText={(text) => {
                                setPassword(text);
                            }}
                            value={password}
                            returnKeyType="done"
                            onSubmitEditing={handleSignIn}
                        />
                        <TouchableOpacity onPress={togglePasswordVisibility} style={Styles_screens.icon}>
                            <FontAwesome
                                name={passwordVisible ? 'eye-slash' : 'eye'}
                                size={24}
                                color={COLORS.textColor}
                            />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={{
                        alignSelf: "flex-start",
                        borderBottomWidth: 0.5,
                        borderBottomColor: COLORS.textColor,
                    }} onPress={() => navigation.navigate("ForgotPassword")}>
                        <Text style={{color: COLORS.textColor,}}>Forgot Password?</Text>
                    </TouchableOpacity>
                </View>

            </SafeAreaView>

            <View style={Styles_screens.buttonsContainer}>
                <TouchableOpacity style={Styles_screens.submitButton} onPress={handleSignIn}>
                    <Text style={Styles_screens.submitButtonText}>Sign In</Text>
                </TouchableOpacity>
                <TouchableOpacity style={Styles_screens.buttonNoBorder} onPress={() => navigation.navigate("SignUp")}>
                    <Text style={Styles_screens.buttonText}>New user? Sign Up</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )

}

export default SignIn;
