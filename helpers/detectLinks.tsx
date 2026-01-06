// useRenderTextWithLinks.tsx
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { useCallback } from 'react';
import { Alert, Linking, Platform, Text } from 'react-native';

export const useRenderTextWithLinks = () => {
    const { safePush } = useSafeNavigation();

    // Matches URLs (http(s)://), www., mailto:, tel:, and plain emails
    const urlRegex =
        /(?:(?:https?:\/\/)|(?:www\.)|(?:mailto:)|(?:tel:))[^\s"'<>()[\]{}]+|[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/gi;

    // punctuation often attached to end of sentences
    const TRAILING_PUNCT = /[.,;:!?)+\]\}]+$/;

    // Prevent huge inputs from creating thousands of components
    const MAX_LINKS = 200;

    const normalizeCandidate = (candidateRaw: string): string | null => {
        if (!candidateRaw) return null;

        // Trim trailing punctuation characters commonly appended to links in text
        let candidate = candidateRaw.replace(TRAILING_PUNCT, '');

        const lower = candidate.trim().toLowerCase();

        // Block obviously dangerous schemes
        if (lower.startsWith('javascript:') || lower.startsWith('data:'))
            return null;

        // If it's a plain email without mailto:
        if (
            /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(candidate)
        ) {
            return `mailto:${candidate}`;
        }

        // If starts with mailto: or tel: keep as-is
        if (/^(mailto:|tel:)/i.test(candidate)) return candidate;

        // Add https scheme to www.example.com
        if (candidate.startsWith('www.')) {
            return `https://${candidate}`;
        }

        // If already has http/https scheme, return as-is
        if (/^https?:\/\//i.test(candidate)) return candidate;

        // Try constructing a URL; if fails, try adding https://
        try {
            // This will throw for invalid URLs
            // If candidate is like "example.com/path", URL may accept it only with scheme
            new URL(candidate);
            return candidate;
        } catch {
            try {
                const withScheme = `https://${candidate}`;
                new URL(withScheme);
                return withScheme;
            } catch {
                return null;
            }
        }
    };

    const openUrl = async (url: string) => {
        try {
            // Prefer in-app navigation if you use safePush (keeps behavior same as before)
            if (safePush) {
                // Use encodeURIComponent to keep it safe as a query param
                safePush(`/InAppBrowser?url=${encodeURIComponent(url)}`);
                return;
            }

            // Fallback to Linking
            const supported = await Linking.canOpenURL(url);
            if (supported) {
                await Linking.openURL(url);
            } else {
                Alert.alert(`Cannot open URL:`, url);
            }
        } catch (err: any) {
            Alert.alert(`Failed to open url`, err);
        }
    };

    const linkStyles = {
        link: {
            color: '#1A73E8',
            textDecorationLine: 'underline' as const,
            textDecorationColor: '#1A73E8',
            textDecorationStyle: 'solid' as const,
            ...(Platform.OS === 'android'
                ? { textDecorationLine: 'underline' as const }
                : {}),
        },
        pressed: {
            opacity: 0.65,
        },
    };

    const renderTextWithLinks = useCallback(
        (text: string) => {
            if (!text) return null;

            // We'll walk the string using matchAll to preserve non-link slices
            const parts: {
                type: 'text' | 'link';
                text: string;
                url?: string;
            }[] = [];
            let lastIndex = 0;
            let linkCount = 0;

            // matchAll returns an iterator of matches
            for (const match of text.matchAll(urlRegex)) {
                if (linkCount >= MAX_LINKS) break;
                const raw = match[0];
                const index = match.index ?? -1;
                if (index > lastIndex) {
                    parts.push({
                        type: 'text',
                        text: text.slice(lastIndex, index),
                    });
                }

                const normalized = normalizeCandidate(raw);
                if (normalized) {
                    const displayText = raw.replace(TRAILING_PUNCT, '');
                    parts.push({
                        type: 'link',
                        text: displayText,
                        url: normalized,
                    });
                    linkCount++;
                } else {
                    // unsafe or couldn't normalize -> render as plain text
                    parts.push({ type: 'text', text: raw });
                }

                lastIndex = index + raw.length;
            }

            if (lastIndex < text.length) {
                parts.push({ type: 'text', text: text.slice(lastIndex) });
            }

            // If nothing matched, just render the whole string (keeps backward compatibility)
            if (parts.length === 0) return <Text>{text}</Text>;

            // Return as array of <Text> children (same shape as original)
            return parts.map((p, i) =>
                p.type === 'text' ? (
                    <Text key={`t-${i}`}>{p.text}</Text>
                ) : (
                    <Text
                        key={`l-${i}`}
                        onPress={() => p.url && openUrl(p.url)}
                        accessibilityRole="link"
                        accessibilityLabel={`Open link: ${p.text}`}
                        // Keep your link visual style here — change to your design system tokens
                        style={linkStyles.link}
                    >
                        {p.text}
                    </Text>
                ),
            );
        },
        // safePush is stable in your hook; if not, React will still re-create callback.
        [safePush],
    );

    return { renderTextWithLinks };
};
