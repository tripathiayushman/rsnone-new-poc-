import { useRef, useState } from 'react';
import { BackHandler, Platform, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { WebView, type WebViewNavigation } from 'react-native-webview';
import { useEffect } from 'react';

/**
 * RSN One — mobile shell.
 *
 * The POC is a web app (../rsn-one-poc). This Expo app bundles its embedded build
 * (hash routing, relative asset paths) into the native package and shows it in a
 * full-screen WebView, so every push to main ships an installable APK.
 *
 * Where the web build lives at runtime:
 *   Android: android/app/src/main/assets/www  (copied in by scripts/embed-web.mjs)
 *   Dev:     set EXPO_PUBLIC_WEB_URL to a running `npm run dev` URL to hot-reload instead.
 */
const DEV_URL = process.env.EXPO_PUBLIC_WEB_URL;
const EMBEDDED_URL = Platform.select({
  android: 'file:///android_asset/www/index.html',
  default: 'file:///android_asset/www/index.html',
});
const URL = DEV_URL || EMBEDDED_URL!;

const ESPRESSO = '#291C19';

export default function App() {
  const web = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Android hardware back → WebView history, then exit
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (canGoBack) { web.current?.goBack(); return true; }
      return false;
    });
    return () => sub.remove();
  }, [canGoBack]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
        <StatusBar style="light" />
        {error ? (
          <View style={styles.error}>
            <Text style={styles.errorTitle}>RSN one</Text>
            <Text style={styles.errorBody}>{error}</Text>
          </View>
        ) : (
          <WebView
            ref={web}
            source={{ uri: URL }}
            style={styles.web}
            originWhitelist={['*']}
            allowFileAccess
            allowFileAccessFromFileURLs
            allowUniversalAccessFromFileURLs
            domStorageEnabled
            javaScriptEnabled
            setSupportMultipleWindows={false}
            allowsBackForwardNavigationGestures
            onNavigationStateChange={(n: WebViewNavigation) => setCanGoBack(n.canGoBack)}
            onError={(e) => setError(`Could not load the app (${e.nativeEvent.description}).`)}
            // the artboard is 853px wide; let the page scale itself (DeviceFrame fits to width)
            scalesPageToFit={false}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: ESPRESSO },
  web: { flex: 1, backgroundColor: '#171010' },
  error: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 12 },
  errorTitle: { color: '#FAF7F5', fontSize: 28 },
  errorBody: { color: '#A99E99', fontSize: 15, textAlign: 'center' },
});
