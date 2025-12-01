import { Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { Colors } from '@/constant/Colors';

interface FatalErrorProps {
    fatalError: Error | null;
    setFatalError: (value: Error | null) => void;
}

const FatalError = ({ fatalError, setFatalError }: FatalErrorProps) => {
    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: Colors.BG_COLOR,
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Text style={{ color: 'red', fontSize: 18, marginBottom: 20 }}>
                A fatal error occurred.
            </Text>
            <Text style={{ color: 'red', fontSize: 14, marginBottom: 20 }}>
                {fatalError?.message || String(fatalError)}
            </Text>

            <TouchableOpacity
                onPress={() => setFatalError(null)}
                style={{
                    backgroundColor: Colors.PRIMARY,
                    padding: 12,
                    borderRadius: 8,
                    marginTop: 10,
                }}
            >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>
                    Try Again
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default FatalError;
