import Styles_screens from "../../constants/Styles";
import {
    Alert,
    KeyboardAvoidingView,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import {COLORS} from "../../constants";
import React, {useRef, useState} from "react";
import CategoriesSelection from "../../components/CategoriesSelection";
import LoadingAnimation from "../../components/LoadingAnimation";
import dbHandler from "../../DB_handler/db_actions";
import FontAwesome from "react-native-vector-icons/FontAwesome";


const SignUp = ({navigation}) => {


    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [verifyPass, setVerifyPass] = useState('');
    const [genre, setGenre] = useState([]);
    const [errors, setErrors] = useState({});
    const [PasswordVisible, setPasswordVisible] = useState(true);
    const [verfiyPassVisible, setVerifyPassVisible] = useState(true);
    const [loading, setLoading] = useState(false);

    const lastNameRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const verifyPasswordRef = useRef(null);

    const isValidEmail = (email) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()\[\]\\.,;:\s@"]+\.)+[^<>()\[\]\\.,;:\s@"]{2,})$/i;
        return re.test(String(email).toLowerCase());
    };

    const isValidPass = (password) => {
        return password.length >= 6;
    };

    const validateInput = () => {
        let isValid = true;
        let newErrors = {};

        if (!firstName.trim()) {
            isValid = false;
            newErrors.firstName = 'First name is required';
        }
        if (!lastName.trim()) {
            isValid = false;
            newErrors.lastName = 'Last name is required';
        }
        if (!isValidEmail(email)) {
            isValid = false;
            newErrors.email = 'Email is required';
        }
        if (!isValidPass(password)) {
            isValid = false;
            newErrors.password = 'Password invalid';
        }
        if (password !== verifyPass) {
            isValid = false;
            newErrors.verfiyPass = 'Passwords not match';
        }

        setErrors(newErrors);
        return isValid;
    };
    if (loading) {
        return (
            <LoadingAnimation/>
        )
    }

    if (errors.email && isValidEmail(email)) {
        errors.email = null;
    }
    if (errors.password && isValidPass(password)) {
        errors.password = null;
    }
    if (errors.verfiyPass && password === verifyPass) {
        errors.verfiyPass = null;
    }

    const togglePasswordVisibility = () => {
        setPasswordVisible(!PasswordVisible);
    }
    const toggleVerifyPasswordVisibility = () => {
        setVerifyPassVisible(!verfiyPassVisible);
    }
    const handleSignUp = async () => {
        if (validateInput()) {
            const User = {
                firstName,
                lastName,
                email,
                password,
                genre
            };
            setLoading(true);
            const create = await dbHandler.createUser(User);
            setLoading(false);
            if (create.error === "auth/email-already-in-use") {
                Alert.alert("Error", "User with this email already exists");
                return;
            }
            navigation.navigate('SignIn');

        } else {
            Alert.alert('Input Error', 'Please correct the errors before proceeding.');

        }
    };
    return (
        <KeyboardAvoidingView
            style={{flex: 1}}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <SafeAreaView style={Styles_screens.container}>
                <View style={Styles_screens.headerContainer}>
                    <Text style={Styles_screens.headerText}>Sign Up</Text>
                </View>
                <View style={{height: 1.5, backgroundColor: 'grey', width: '100%'}}></View>
                <ScrollView style={{flex: 1, marginBottom: 10, padding: 18}}>
                    <Text style={Styles_screens.header}>Welcome to Street Library</Text>
                    <View style={[Styles_screens.inputContainer, {width: 'auto'}]}>
                        <Text style={Styles_screens.inputTitle}>First Name</Text>
                        {errors.firstName && <Text style={Styles_screens.error}>{errors.firstName}</Text>}
                        <TextInput
                            placeholderTextColor={COLORS.textColor}
                            style={[Styles_screens.input, errors.firstName && Styles_screens.errorField]}
                            placeholder="First Name"
                            returnKeyType="next"
                            onSubmitEditing={() => lastNameRef.current.focus()}
                            onChangeText={(text) => {
                                setFirstName(text);
                                setErrors(prev => ({...prev, firstName: null}));
                            }}
                            value={firstName}
                        />
                        <Text style={Styles_screens.inputTitle}>Last Name</Text>
                        {errors.lastName && <Text style={Styles_screens.error}>{errors.lastName}</Text>}

                        <TextInput
                            placeholderTextColor={COLORS.textColor}
                            style={[Styles_screens.input, errors.lastName && Styles_screens.errorField]}
                            placeholder="Last Name"
                            ref={lastNameRef}
                            returnKeyType="next"
                            onSubmitEditing={() => emailRef.current.focus()}
                            onChangeText={(text) => {
                                setLastName(text);
                                setErrors(prev => ({...prev, lastName: null}));
                            }}
                            value={lastName}
                        />

                        <Text style={Styles_screens.inputTitle}>Email</Text>
                        {errors.email && <Text style={Styles_screens.error}>{errors.email}</Text>}
                        <TextInput
                            placeholderTextColor={COLORS.textColor}
                            style={[Styles_screens.input, errors.email && Styles_screens.errorField]}
                            placeholder="Email"
                            ref={emailRef}
                            returnKeyType="next"
                            onSubmitEditing={() => passwordRef.current.focus()}
                            onChangeText={(text) => {
                                setEmail(text);
                                setErrors(prev => ({...prev, email: null}));
                            }}
                            value={email}
                        />


                        <Text style={Styles_screens.inputTitle}>Password</Text>
                        {errors.password && <Text style={Styles_screens.error}>{errors.password}</Text>}

                        <View style={Styles_screens.inputWrapper}>
                            <TextInput
                                placeholderTextColor={COLORS.textColor}
                                style={[Styles_screens.input, errors.password && Styles_screens.errorField]}
                                placeholder="Password"
                                secureTextEntry={PasswordVisible}
                                ref={passwordRef}
                                returnKeyType="next"
                                onSubmitEditing={() => verifyPasswordRef.current.focus()}
                                onChangeText={(text) => {
                                    setPassword(text);
                                    setErrors(prev => ({...prev, password: null}));
                                }}
                                value={password}
                            />

                            <TouchableOpacity onPress={togglePasswordVisibility} style={Styles_screens.icon}>
                                <FontAwesome
                                    name={PasswordVisible ? 'eye-slash' : 'eye'}
                                    size={24}
                                    color={COLORS.textColor}
                                />
                            </TouchableOpacity>
                        </View>

                        <Text style={Styles_screens.inputTitle}>Re-type password</Text>
                        {errors.verfiyPass && <Text style={Styles_screens.error}>{errors.verfiyPass}</Text>}
                        <View style={Styles_screens.inputWrapper}>
                            <TextInput
                                placeholderTextColor={COLORS.textColor}
                                style={[Styles_screens.input, errors.verfiyPass && Styles_screens.errorField]}
                                placeholder="Re-type password"
                                ref={verifyPasswordRef}
                                secureTextEntry={verfiyPassVisible}
                                onChangeText={(text) => {
                                    setVerifyPass(text);
                                    setErrors(prev => ({...prev, verfiyPass: null}));
                                }}
                                value={verifyPass}
                            />
                            <TouchableOpacity onPress={toggleVerifyPasswordVisibility} style={Styles_screens.icon}>
                                <FontAwesome
                                    name={verfiyPassVisible ? 'eye-slash' : 'eye'}
                                    size={24}
                                    color={COLORS.textColor}
                                />
                            </TouchableOpacity>
                        </View>
                        <Text style={Styles_screens.inputTitle}>Preferred Categories:</Text>
                        <CategoriesSelection
                            onGenreChange={setGenre}
                            selectedGenres={genre}
                        />

                    </View>
                </ScrollView>

                <View style={Styles_screens.buttonsContainer}>
                    <TouchableOpacity style={Styles_screens.submitButton} onPress={handleSignUp}>
                        <Text style={Styles_screens.submitButtonText}>Sign Up</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={Styles_screens.buttonNoBorder}
                                      onPress={() => navigation.navigate("SignIn")}>
                        <Text style={Styles_screens.buttonText}>Already have account? Sign In</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>

    )

}

export default SignUp;
