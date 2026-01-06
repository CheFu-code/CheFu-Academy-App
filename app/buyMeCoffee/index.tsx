import HeaderText from '@/component/common/Header';
import useDarkMode from '@/hooks/useDarkMode';
import { Feather } from '@expo/vector-icons';
import {
    Linking,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale, scale } from 'react-native-size-matters';
import { styles } from '../../styles/BuyMeCoffee.styles';

export default function BuyMeCoffee() {
    const { color, backgroundColor } = useDarkMode();
    return (
        <SafeAreaView
            style={{ backgroundColor, padding: moderateScale(15), flex: 1 }}
        >
            <HeaderText title="Buy me coffee" />
            <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.heading}>Support CheFu Academy</Text>

                <Text style={[styles.paragraph, { color }]}>
                    CheFu Academy is built with love, purpose, and long nights
                    of coding. Every feature you use — from lessons to quizzes,
                    chat, progress tracking and more — has been
                    <Text style={{ fontStyle: 'italic' }}> carefully </Text>
                    crafted to empower your learning journey.
                </Text>

                <Text style={[styles.paragraph, { color }]}>
                    But building and maintaining an app like this takes time,
                    resources, and dedication. Your support helps keep this
                    platform alive and improving. Whether it’s for hosting
                    servers, writing content, developing new features, or fixing
                    bugs — every little contribution goes a long way.
                </Text>

                <Text style={[styles.paragraph, { color }]}>
                    If CheFu Academy has helped you, inspired you, or made
                    learning easier, please consider buying me a coffee. It’s a
                    small gesture with a big impact.
                </Text>

                <Text style={styles.quote}>
                    &quot;Small acts, when multiplied by millions of people, can
                    transform the world.&quot; – Howard Zinn
                </Text>

                <Text style={[styles.paragraph, { color }]}>
                    I’m not backed by a big company. Just an indie creator on a
                    mission to make learning accessible and powerful for{' '}
                    <Text style={{ fontWeight: 600, color }}>
                        everyone
                    </Text>
                    .
                </Text>
            </ScrollView>

            <TouchableOpacity
                onPress={() => {
                    Linking.openURL('https://www.buymeacoffee.com/chefu');
                }}
                style={styles.buttonContainer}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: scale(5),
                    }}
                >
                    <Feather
                        style={{ alignItems: 'center' }}
                        name="coffee"
                        size={scale(20)}
                        color="black"
                    />
                    <Text style={styles.buttonText}>Buy me a coffee</Text>
                </View>
            </TouchableOpacity>
        </SafeAreaView>
    );
}
