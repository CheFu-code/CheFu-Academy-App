import ErrorModal from "@/component/Shared/ErrorModal";
import VideoCardHomeScreen from "@/component/Video/VideoCardHomeScreen";
import { Course } from "@/types/course";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    getAuth,
    onAuthStateChanged,
    reload,
    sendEmailVerification,
} from "@react-native-firebase/auth";
import {
    collection,
    doc,
    FirebaseFirestoreTypes,
    getDoc,
    getDocs,
    getFirestore,
    orderBy,
    query,
    where,
} from "@react-native-firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useContext, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    Text,
    ToastAndroid,
    TouchableOpacity,
    View,
} from "react-native";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";
import CourseList from "../../component/Home/CourseList";
import CourseProgress from "../../component/Home/CourseProgress";
import Header from "../../component/Home/Header";
import LineLoader from "../../component/Home/LineLoader";
import NoCourse from "../../component/Home/NoCourse";
import PracticeSection from "../../component/Home/PracticeSection";
import AppModal from "../../component/Shared/AppModal";
import { Colors } from "../../constant/Colors";
import { UserDetailContext } from "../../context/UserDetailContext";

export default function Home() {
    const [courseList, setCourseList] = useState<Course[]>([]);
    const { userDetail, setUserDetail } = useContext(UserDetailContext);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [adLoaded, setAdLoaded] = useState(false);
    const [sending, setSending] = useState(false);
    const router = useRouter();
    const auth = getAuth();
    const firestore = getFirestore();
    const CACHE_KEY = "@cached_courses";

    const [verifyEmail, setVerifyEmail] = useState({
        visible: false,
        title: "",
        message: "",
    });

    const [errorModal, setErrorModal] = useState({
        visible: false,
        title: "",
        message: "",
    });

    const [errorNewModal, setErrorNewModal] = useState({
        visible: false,
        title: "",
        message: "",
    });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                loadCachedCoursesThenFetch();
            } else {
                setCourseList([]);
                router.replace("/auth/signIn");
            }
        });

        return unsubscribe;
    }, [auth, router]);

    // Load cached courses then fetch fresh in background without waiting for it
    const loadCachedCoursesThenFetch = async () => {
        const cached = await loadCachedCourses();
        if (!cached) {
            await fetchCourses();
        } else {
            fetchCourses(); // fire and forget
        }
    };

    // Load courses from AsyncStorage cache
    const loadCachedCourses = async () => {
        try {
            const cached = await AsyncStorage.getItem(CACHE_KEY);
            if (cached) {
                const parsed = JSON.parse(cached);
                setCourseList(parsed);
                return parsed;
            }
            return null;
        } catch (error) {
            console.error("Error loading cached courses:", error);
            return null;
        }
    };

    const fetchCourses = async (isRefresh = false) => {
        if (fetching && !isRefresh) return;

        setLoading(true);
        setFetching(true);

        try {
            const user = auth.currentUser;
            if (!user) {
                setCourseList([]);
                router.replace("/auth/signIn");
                return;
            }

            if (!user.email) {
                console.warn("Signed-in user has no email!");
                setCourseList([]);
                router.replace("/auth/signIn");
                return;
            }

            await reload(user);
            const refreshedUser = auth.currentUser;

            if (!refreshedUser?.email) {
                ToastAndroid.show(
                    "We detected an issue, please try to login.",
                    ToastAndroid.LONG
                );
                setCourseList([]);
                router.replace("/");
                return;
            }
            if (!userDetail?.email) {
                const refreshedUser = auth.currentUser;

                if (refreshedUser?.email) {
                    try {
                        console.log(
                            "Fetching user document for:",
                            refreshedUser.email
                        );
                        const userDocRef = doc(
                            getFirestore(),
                            "users",
                            refreshedUser.email
                        );
                        const docSnap = await getDoc(userDocRef);

                        if (docSnap.exists()) {
                            const freshData = {
                                id: docSnap.id,
                                ...docSnap.data(),
                            };
                            setUserDetail(freshData);
                        } else {
                            ToastAndroid.show(
                                "We couldn't find your user profile. Please login again.",
                                ToastAndroid.LONG
                            );
                            setCourseList([]);
                            router.replace("/auth/signIn");
                            return;
                        }
                    } catch (err) {
                        console.error("Error refreshing userDetail:", err);
                        ToastAndroid.show(
                            "An error occurred while refreshing your profile.",
                            ToastAndroid.LONG
                        );
                        setCourseList([]);
                        router.replace("/auth/signIn");
                        return;
                    }
                } else {
                    ToastAndroid.show(
                        "No active session found, please login again.",
                        ToastAndroid.LONG
                    );
                    setCourseList([]);
                    router.replace("/auth/signIn");
                    return;
                }
            }

            const coursesRef = collection(firestore, "course");
            const q = query(
                coursesRef,
                where("createdBy", "==", refreshedUser.email),
                orderBy("createdOn", "desc")
            );

            const querySnapshot = await getDocs(q);

            const courses = querySnapshot.docs.map(
                (doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => {
                    const data = doc.data();
                    return {
                        ...data,
                        id: doc.id,
                    };
                }
            );

            // Compare new courses with cache to avoid redundant writes
            const cachedCoursesJSON = await AsyncStorage.getItem(CACHE_KEY);
            const cachedCourses = cachedCoursesJSON
                ? JSON.parse(cachedCoursesJSON)
                : null;

            const isSame =
                cachedCourses &&
                JSON.stringify(cachedCourses) === JSON.stringify(courses);

            setCourseList(courses);

            if (!isSame) {
                await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(courses));
            }

            if (isRefresh) {
                ToastAndroid.show("Refreshed", ToastAndroid.SHORT);
            }
        } catch (error: unknown) {
            console.error("Error fetching courses:", error);
            let errorMessage = "Failed to refresh. Please try again.";

            if (
                typeof error === "object" &&
                error !== null &&
                "code" in error &&
                typeof (error as any).code === "string"
            ) {
                switch ((error as any).code) {
                    case "firestore/unavailable":
                        errorMessage =
                            "Network error. Please check your connection.";
                        break;
                    case "firestore/permission-denied":
                        errorMessage =
                            "You don't have permission to access these courses.";
                        break;
                    case "auth/user-not-found":
                        errorMessage =
                            "User not found. Your account may have been deleted.";
                        break;
                    case "auth/invalid-email":
                        errorMessage = "Invalid email address format.";
                        break;
                    case "auth/too-many-requests":
                        errorMessage =
                            "Too many requests. Please try again later.";
                        break;
                }
            }

            ToastAndroid.show(errorMessage, ToastAndroid.LONG);
        } finally {
            setLoading(false);
            setFetching(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            if (auth.currentUser) {
                fetchCourses();
            }
        }, [auth])
    );

    const verify = async () => {
        const user = auth.currentUser;
        if (!user) {
            setErrorModal({
                visible: true,
                title: "Not Signed In",
                message: "You are currently not signed in.",
            });
            return;
        }

        setSending(true);
        try {
            await sendEmailVerification(user);
            setVerifyEmail({
                visible: true,
                title: "Email Verification Sent",
                message: `Verification email sent to ${
                    user?.email ?? "your email"
                }. Check your inbox and spam folder.`,
            });
        } catch (error: unknown) {
            console.error("Failed to send verification email:", error);

            let errorMessage =
                "Failed to send verification email. Please try again later.";

            if (
                typeof error === "object" &&
                error !== null &&
                "code" in error &&
                typeof (error as { code?: unknown }).code === "string"
            ) {
                if (
                    (error as { code: string }).code ===
                    "auth/too-many-requests"
                ) {
                    errorMessage = "Too many requests. Please try again later.";
                }
            }

            Alert.alert("Error", errorMessage);
            setErrorNewModal({
                visible: true,
                title: "Error",
                message: errorMessage,
            });
        } finally {
            setSending(false);
        }
    };

    return (
        <>
            {/* Email verification prompt */}
            {auth.currentUser &&
                !auth.currentUser.emailVerified &&
                (sending ? (
                    <ActivityIndicator
                        style={{
                            backgroundColor: Colors.GREEN,
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: [
                                { translateX: -15 },
                                { translateY: -15 },
                            ],
                            zIndex: 1000,
                        }}
                        color={Colors.GREEN}
                        size="small"
                    />
                ) : (
                    <View
                        style={{
                            backgroundColor: Colors.BG,
                            padding: 10,
                        }}
                    >
                        <TouchableOpacity
                            onPress={verify}
                            style={{
                                backgroundColor: "#FFD700",
                                padding: 8,
                                borderRadius: 15,
                                opacity: 0.9,
                            }}
                            activeOpacity={0.7}
                        >
                            <Text
                                style={{
                                    color: "#000",
                                    textAlign: "center",
                                    textDecorationLine: "underline",
                                }}
                            >
                                Please verify your email address to access all
                                features.
                            </Text>
                        </TouchableOpacity>
                    </View>
                ))}

            <Header />
            {loading && <LineLoader />}

            <FlatList
                data={courseList}
                keyExtractor={(item) => item.id}
                style={{ backgroundColor: Colors.BG_COLOR }}
                onRefresh={() => {
                    if (auth.currentUser) {
                        setFetching(false);
                        fetchCourses(true);
                    }
                }}
                refreshing={loading}
                showsVerticalScrollIndicator={false}
                renderItem={() => null}
                ListHeaderComponent={
                    <View>
                        <Image
                            style={{
                                position: "absolute",
                                width: "100%",
                                height: 400,
                            }}
                            source={require("../../assets/images/graph.png")}
                            resizeMode="cover"
                        />
                        <View
                            style={{
                                padding: 15,
                            }}
                        >
                            {courseList.length === 0 ? (
                                <NoCourse />
                            ) : (
                                <>
                                    {/* <FeaturedCourses />
                                    <Categories /> */}
                                    <CourseProgress courseList={courseList} />
                                    <PracticeSection />
                                    <CourseList courseList={courseList} />
                                    <VideoCardHomeScreen />
                                </>
                            )}
                        </View>
                    </View>
                }
            />

            {/* Modals */}
            <AppModal
                visible={errorModal.visible}
                title={errorModal.title}
                message={errorModal.message}
                confirmText="OK"
                showCancel={false}
                onConfirm={() =>
                    setErrorModal((prev) => ({ ...prev, visible: false }))
                }
                onCancel={() =>
                    setErrorModal((prev) => ({ ...prev, visible: false }))
                }
            />
            <ErrorModal
                visible={errorNewModal.visible}
                title={errorNewModal.title}
                message={errorNewModal.message}
                confirmText="OK"
                onConfirm={() =>
                    setErrorNewModal((prev) => ({ ...prev, visible: false }))
                }
            />

            <AppModal
                visible={verifyEmail.visible}
                title={verifyEmail.title}
                message={verifyEmail.message}
                confirmText="OK"
                showCancel={false}
                onConfirm={() =>
                    setVerifyEmail((prev) => ({ ...prev, visible: false }))
                }
                onCancel={() =>
                    setVerifyEmail((prev) => ({ ...prev, visible: false }))
                }
            />

            {/* Banner Ad */}
            {adLoaded && (
                <View>
                    <BannerAd
                        unitId="ca-app-pub-8952058057579255/9705798694"
                        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
                        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
                        onAdLoaded={() => {
                            console.log("Ad successfully loaded");
                            setAdLoaded(true);
                        }}
                        onAdFailedToLoad={(err) => {
                            console.log("Ad failed to load", err);
                            setAdLoaded(false);
                        }}
                    />
                </View>
            )}
        </>
    );
}
