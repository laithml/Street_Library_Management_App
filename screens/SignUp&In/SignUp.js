import React, { useEffect, useRef, useState } from "react";
import {
    Alert,
    KeyboardAvoidingView, Platform,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { COLORS } from "../../constants";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import CategoriesSelection from "../../components/CategoriesSelection";
import LoadingAnimation from "../../components/LoadingAnimation";
import { createUser, fetchLibraries } from "../../actions/db_actions";
import LibrarySelectionModal from "../../components/LibrarySelectionModal";
import Styles_screens from "../../constants/Styles";
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from "../../components/LanguageSwitcher"; // import the language switcher

const SignUp = ({ navigation }) => {
    const { t } = useTranslation();

    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [verifyPass, setVerifyPass] = useState('');
    const [genre, setGenre] = useState([]);
    const [errors, setErrors] = useState({});
    const [passwordVisible, setPasswordVisible] = useState(true);
    const [verifyPassVisible, setVerifyPassVisible] = useState(true);
    const [loading, setLoading] = useState(false);
    const [selectedLib, setSelectedLib] = useState('');
    const [visibleLibModel, setVisibleLibModel] = useState(false);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const verifyPasswordRef = useRef(null);
    const [libraries, setLibraries] = useState([]);
    const [selectedLibId, setSelectedLibId] = useState('');

    useEffect(() => {
        const fetchLibrariesData = async () => {
            setLoading(true);
            const librariesData = await fetchLibraries();
            setLibraries(librariesData);
            setLoading(false);
        };

        fetchLibrariesData();
    }, []);

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

        if (!userName.trim()) {
            isValid = false;
            newErrors.firstName = t('fullNameRequired');
        }
        if (!isValidEmail(email)) {
            isValid = false;
            newErrors.email = t('emailInvalid');
        }
        if (!isValidPass(password)) {
            isValid = false;
            newErrors.password = t('passwordInvalid');
        }
        if (password !== verifyPass) {
            isValid = false;
            newErrors.verifyPass = t('passwordsDoNotMatch');
        }
        if (!selectedLibId) {
            isValid = false;
            newErrors.selectedLib = t('libraryRequired');
        }

        setErrors(newErrors);
        return isValid;
    };

    if (loading) {
        return <LoadingAnimation />;
    }

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const toggleVerifyPasswordVisibility = () => {
        setVerifyPassVisible(!verifyPassVisible);
    };

    const handleSignUp = async () => {
        if (validateInput()) {
            const user = {
                name: userName,
                email,
                password,
                genre,
                defaultLibrary: selectedLibId,
                bookmarks: [],
            };
            setLoading(true);
            const create = await createUser(user);
            setLoading(false);
            if (create.error === "auth/email-already-in-use") {
                Alert.alert("Error", "User with this email already exists");
                return;
            }
            navigation.navigate('SignIn');
        } else {
            Alert.alert(t('inputError'), t('pleaseCorrectErrors'));
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <SafeAreaView style={Styles_screens.container}>
                <View style={Styles_screens.headerContainer}>
                    <Text style={Styles_screens.headerText}>{t('signUp')}</Text>
                    <LanguageSwitcher />
                </View>
                <View style={{ height: 1.5, backgroundColor: 'grey', width: '100%' }}></View>
                <ScrollView style={{ flex: 1, marginBottom: 10, padding: 18 }}>
                    <Text style={Styles_screens.header}>{t('welcome')}</Text>
                    <View style={[Styles_screens.inputContainer, { width: 'auto' }]}>
                        <Text style={Styles_screens.inputTitle}>{t('fullName')}</Text>
                        {errors.firstName && <Text style={Styles_screens.error}>{errors.firstName}</Text>}
                        <TextInput
                            placeholderTextColor={COLORS.textColor}
                            style={[Styles_screens.input, errors.firstName && Styles_screens.errorField]}
                            placeholder={t('fullName')}
                            returnKeyType="next"
                            onSubmitEditing={() => emailRef.current.focus()}
                            onChangeText={(text) => {
                                setUserName(text);
                                setErrors(prev => ({ ...prev, firstName: null }));
                            }}
                            value={userName}
                        />

                        <Text style={Styles_screens.inputTitle}>{t('email')}</Text>
                        {errors.email && <Text style={Styles_screens.error}>{errors.email}</Text>}
                        <TextInput
                            placeholderTextColor={COLORS.textColor}
                            style={[Styles_screens.input, errors.email && Styles_screens.errorField]}
                            placeholder={t('email')}
                            ref={emailRef}
                            returnKeyType="next"
                            onSubmitEditing={() => passwordRef.current.focus()}
                            onChangeText={(text) => {
                                setEmail(text);
                                setErrors(prev => ({ ...prev, email: null }));
                            }}
                            value={email}
                        />

                        <Text style={Styles_screens.inputTitle}>{t('password')}</Text>
                        {errors.password && <Text style={Styles_screens.error}>{errors.password}</Text>}
                        <View style={Styles_screens.inputWrapper}>
                            <TextInput
                                placeholderTextColor={COLORS.textColor}
                                style={[Styles_screens.input, errors.password && Styles_screens.errorField]}
                                placeholder={t('password')}
                                secureTextEntry={passwordVisible}
                                ref={passwordRef}
                                returnKeyType="next"
                                onSubmitEditing={() => verifyPasswordRef.current.focus()}
                                onChangeText={(text) => {
                                    setPassword(text);
                                    setErrors(prev => ({ ...prev, password: null }));
                                }}
                                value={password}
                            />
                            <TouchableOpacity onPress={togglePasswordVisibility} style={Styles_screens.icon}>
                                <FontAwesome
                                    name={passwordVisible ? 'eye-slash' : 'eye'}
                                    size={24}
                                    color={COLORS.textColor}
                                />
                            </TouchableOpacity>
                        </View>

                        <Text style={Styles_screens.inputTitle}>{t('retypePassword')}</Text>
                        {errors.verifyPass && <Text style={Styles_screens.error}>{errors.verifyPass}</Text>}
                        <View style={Styles_screens.inputWrapper}>
                            <TextInput
                                placeholderTextColor={COLORS.textColor}
                                style={[Styles_screens.input, errors.verifyPass && Styles_screens.errorField]}
                                placeholder={t('retypePassword')}
                                ref={verifyPasswordRef}
                                secureTextEntry={verifyPassVisible}
                                onChangeText={(text) => {
                                    setVerifyPass(text);
                                    setErrors(prev => ({ ...prev, verifyPass: null }));
                                }}
                                value={verifyPass}
                            />
                            <TouchableOpacity onPress={toggleVerifyPasswordVisibility} style={Styles_screens.icon}>
                                <FontAwesome
                                    name={verifyPassVisible ? 'eye-slash' : 'eye'}
                                    size={24}
                                    color={COLORS.textColor}
                                />
                            </TouchableOpacity>
                        </View>

                        {errors.selectedLib && <Text style={Styles_screens.error}>{errors.selectedLib}</Text>}
                        <Text style={Styles_screens.descriptionText}>
                            {t('chooseLibrary')}
                        </Text>
                        <TouchableOpacity style={[Styles_screens.button, { width: "100%" }]} onPress={() => setVisibleLibModel(true)}>
                            <Text style={Styles_screens.buttonText}>
                                {"Library: " + (selectedLib || t('chooseLibraryLocation'))}
                            </Text>
                        </TouchableOpacity>

                        <LibrarySelectionModal
                            visible={visibleLibModel}
                            onClose={() => setVisibleLibModel(false)}
                            libraries={libraries}
                            onSelect={(id, name) => {
                                setSelectedLibId(id);
                                setSelectedLib(name);
                            }}
                        />

                        <Text style={Styles_screens.inputTitle}>{t('preferredCategories')}</Text>
                        <CategoriesSelection
                            onGenreChange={setGenre}
                            selectedGenres={genre}
                        />
                    </View>
                </ScrollView>

                <View style={Styles_screens.buttonsContainer}>
                    <TouchableOpacity style={Styles_screens.submitButton} onPress={handleSignUp}>
                        <Text style={Styles_screens.submitButtonText}>{t('signUpButton')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={Styles_screens.buttonNoBorder} onPress={() => navigation.navigate("SignIn")}>
                        <Text style={Styles_screens.buttonText}>{t('alreadyHaveAccount')}</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
};

export default SignUp;
