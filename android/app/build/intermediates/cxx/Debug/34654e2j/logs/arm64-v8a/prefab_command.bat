@echo off
"C:\\Program Files\\Eclipse Adoptium\\jdk-17.0.15.6-hotspot\\bin\\java" ^
  --class-path ^
  "C:\\Users\\Vunene Maluleke\\.gradle\\caches\\modules-2\\files-2.1\\com.google.prefab\\cli\\2.1.0\\aa32fec809c44fa531f01dcfb739b5b3304d3050\\cli-2.1.0-all.jar" ^
  com.google.prefab.cli.AppKt ^
  --build-system ^
  cmake ^
  --platform ^
  android ^
  --abi ^
  arm64-v8a ^
  --os-version ^
  24 ^
  --stl ^
  c++_shared ^
  --ndk-version ^
  27 ^
  --output ^
  "C:\\Users\\VUNENE~1\\AppData\\Local\\Temp\\agp-prefab-staging7206266736582113995\\staged-cli-output" ^
  "C:\\Users\\Vunene Maluleke\\.gradle\\caches\\8.13\\transforms\\a89efe01639eb7dad7f1852c2dc2010d\\transformed\\react-android-0.79.5-debug\\prefab" ^
  "D:\\Google Play Store Apps\\Learning App\\android\\app\\build\\intermediates\\cxx\\refs\\react-native-reanimated\\726i523y" ^
  "C:\\Users\\Vunene Maluleke\\.gradle\\caches\\8.13\\transforms\\8b58fa16b3b4fa0649400855afae7a3f\\transformed\\hermes-android-0.79.5-debug\\prefab" ^
  "C:\\Users\\Vunene Maluleke\\.gradle\\caches\\8.13\\transforms\\d6e46b19b602d3371982eebc7ed690ed\\transformed\\fbjni-0.7.0\\prefab"
