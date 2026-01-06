import { useColorScheme } from 'react-native';
import { Colors } from '../constant/Colors';

const useDarkMode = () => {
  const scheme = useColorScheme();
  const color = scheme === 'dark' ? Colors.WHITE : Colors.BLACK;
  const backgroundColor = scheme === 'dark' ? Colors.BG_COLOR : Colors.WHITE;

  return { color, backgroundColor };
};

export default useDarkMode;
