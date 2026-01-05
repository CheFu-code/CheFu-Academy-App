import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { Course } from '@/types/course';
import { Ionicons } from '@expo/vector-icons';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { scale } from 'react-native-size-matters';
import { Colors } from '../../constant/Colors';

export type AllowedPaths =
    | '/courses/details'
    | '/courses/overview'
    | '/practice/[type]';

interface CourseListGridProps {
    courseList: Course[];
    option: {
        name: string;
        path: AllowedPaths;
        icon: any;
    };
}

export default function CourseListGrid({
    courseList: courseList,
    option,
}: CourseListGridProps) {
    const { safePush } = useSafeNavigation();
    const onPress = (course: Course) => {
        if (option.path === '/practice/[type]') {
            safePush({
                pathname: option.path,
                params: {
                    type: option.name,
                    courseParams: JSON.stringify(course),
                },
            } as any);
        } else {
            safePush({
                pathname: option.path,
                params: {
                    courseParams: JSON.stringify(course),
                },
            } as any);
        }
    };

    return (
        <View>
            <FlatList
                numColumns={2}
                style={{
                    paddingHorizontal: 30,
                }}
                renderItem={({ item, index }) => (
                    <TouchableOpacity
                        onPress={() => onPress(item)}
                        style={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 15,
                            backgroundColor: Colors.BG_GRAY,
                            margin: 7,
                            borderRadius: 15,
                            elevation: 1,
                            minWidth: 130,
                            maxWidth: 150,
                        }}
                        key={index}
                    >
                        <Ionicons
                            name="checkmark-circle"
                            size={scale(20)}
                            color={Colors.PRIMARY}
                            style={{
                                position: 'absolute',
                                top: 10,
                                right: 10,
                            }}
                        />
                        <View
                            style={{
                                width: '100%',
                                height: 70,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Image
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    resizeMode: 'contain',
                                }}
                                source={option?.icon}
                            />
                        </View>
                        <Text
                            style={{
                                fontFamily: 'outfit',
                                textAlign: 'left',
                                marginTop: 7,
                                fontSize: RFValue(12),
                            }}
                            numberOfLines={2}
                            ellipsizeMode="tail"
                        >
                            {item.courseTitle}
                        </Text>
                    </TouchableOpacity>
                )}
                data={courseList}
            />
        </View>
    );
}
