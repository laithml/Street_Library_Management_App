import {TouchableOpacity,Text ,View} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {COLORS} from "../constants";
import Styles_screens from "../constants/Styles";

const Card = ({ iconName, title, info, onPress }) => {
    return (
        <TouchableOpacity style={Styles_screens.card} onPress={onPress}>
            <FontAwesome name={iconName} size={24} color={COLORS.textColor} />
            <View style={Styles_screens.cardTextContainer}>
                <Text style={Styles_screens.cardText}>{title}</Text>
                {info && <Text style={Styles_screens.cardInfo}>{info}</Text>}
            </View>
            <FontAwesome name="angle-right" size={24} color={COLORS.textColor} />
        </TouchableOpacity>
    );
};

export default Card;
