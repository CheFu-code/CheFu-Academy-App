import { Ionicons } from "@expo/vector-icons";
import { doc, getFirestore, updateDoc } from "@react-native-firebase/firestore";

import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
    Dimensions,
    Image,
    Pressable,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { AdEventType, InterstitialAd } from "react-native-google-mobile-ads";
import * as Progress from "react-native-progress";
import Button from "../../component/Shared/Button";
import { Colors } from "../../constant/Colors";

const INTERSTITIAL_AD_UNIT_ID = "ca-app-pub-8952058057579255/6615319669";

export default function Quiz() {
  const { courseParams } = useLocalSearchParams();
  const course = JSON.parse(courseParams);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedOption, setSelectedOption] = useState();
  const quiz = course?.quiz;
  const router = useRouter();
  const [result, setResult] = useState({});
  const [loading, setLoading] = useState(false);

  const GetProgress = (currentPage) => {
    const percentage = currentPage / quiz?.length;
    return percentage;
  };

  const OnOptionSelect = (selectedChoice) => {
    setResult((prev) => ({
      ...prev,
      [currentPage]: {
        userChoice: selectedChoice,
        isCorrect: quiz[currentPage]?.correctAns == selectedChoice,
        question: quiz[currentPage]?.question,
        correctAns: quiz[currentPage]?.correctAns,
      },
    }));
    // console.log(result);
  };

  const onQuizFinish = async () => {
    const db = getFirestore(); // ✅ Modular usage
    setLoading(true);

    try {
      const courseRef = doc(db, "course", course?.docId);
      await updateDoc(courseRef, {
        quizResult: result,
      });

      const interstitial = InterstitialAd.createForAdRequest(
        INTERSTITIAL_AD_UNIT_ID,
        { requestNonPersonalizedAdsOnly: true }
      );

      const unsubscribe = interstitial.addAdEventsListener(({ type }) => {
        if (type === AdEventType.LOADED) {
          interstitial.show();
        }
        if (type === AdEventType.CLOSED || type === AdEventType.ERROR) {
          unsubscribe();
          router.replace({
            pathname: "/quiz/summary",
            params: {
              quizResultParam: JSON.stringify(result),
            },
          });
          setLoading(false);
        }
      });

      interstitial.load();
    } catch (e) {
      setLoading(false);
      console.error(e);
    }
  };

  return (
    <View
      style={{
        backgroundColor: Colors.BG_COLOR,
        flex: 1,
      }}
    >
      <Image
        style={{
          height: 550,
          width: "100%",
          position: "absolute",
        }}
        source={require("../../assets/images/graph.png")}
      />
      <View
        style={{
          position: "absolute",
          padding: 25,
          marginTop: 30,
          width: "100%",
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={"white"} />
          </Pressable>
          <Text
            style={{
              fontFamily: "outfit-bold",
              fontSize: 17,
              color: Colors.WHITE,
            }}
          >
            {currentPage + 1} of {quiz?.length}
          </Text>
        </View>
        <View
          style={{
            marginTop: 30,
          }}
        >
          <Progress.Bar
            progress={GetProgress(currentPage)}
            color={Colors.GREEN}
            width={Dimensions.get("screen").width * 0.85}
          />
        </View>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          style={{
            padding: 20,
            backgroundColor: Colors.BG_GRAY,
            marginTop: 50,
            height: Dimensions.get("screen").height * 0.55,
            elevation: 1,
            borderRadius: 20,
          }}
        >
          <Text
            style={{
              fontSize: 19,
              fontFamily: "outfit-bold",
              textAlign: "center",
            }}
          >
            {quiz[currentPage]?.question}
          </Text>

          {quiz[currentPage]?.options.map((item, index) => (
            <TouchableOpacity
              onPress={() => {
                setSelectedOption(index);
                OnOptionSelect(item);
              }}
              style={{
                padding: 5,
                borderWidth: 0.6,
                borderColor: selectedOption == index ? Colors.GREEN : "#ccc",

                borderRadius: 15,
                marginTop: 8,
                borderWidth: 1,
                backgroundColor:
                  selectedOption == index ? Colors.LIGHT_GREEN : null,
              }}
              key={index}
            >
              <Text
                style={{
                  fontFamily: "outfit",
                  fontSize: 15,
                  textAlign: "center",
                }}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {selectedOption?.toString() && quiz?.length - 1 > currentPage && (
          <Button
            onPress={() => {
              setCurrentPage(currentPage + 1);
              setSelectedOption(null);
            }}
            text={"Next"}
            loading={loading}
            disabled={loading}
          />
        )}

        {selectedOption?.toString() && quiz?.length - 1 == currentPage && (
          <Button
            onPress={() => onQuizFinish()}
            text={"Finish"}
            loading={loading}
            disabled={loading}
          />
        )}
      </View>
    </View>
  );
}
