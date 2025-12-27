import { FlatList, ImageBackground, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Spacing } from '@/components/ui/spacing';
import { Colors } from '@/constants/theme';

type OnboardingSlide = {
  id: string;
  title: string;
  description: string;
  image: number;
};

type OnboardingViewProps = {
  slides: OnboardingSlide[];
  onComplete: () => void;
};

export function OnboardingView({ slides, onComplete }: OnboardingViewProps) {
  const { width } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <FlatList
          data={slides}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          onMomentumScrollEnd={(event) => {
            const nextIndex = Math.round(event.nativeEvent.contentOffset.x / width);
            setActiveIndex(nextIndex);
          }}
          renderItem={({ item }) => (
            <View style={[styles.slide, { width }]}>
              <ImageBackground
                source={item.image}
                resizeMode="cover"
                style={styles.slideBackground}
                imageStyle={styles.slideImage}>
                <View style={styles.slideOverlay}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.description}>{item.description}</Text>
                </View>
              </ImageBackground>
            </View>
          )}
        />
        <View style={styles.footer}>
          <View style={styles.dots}>
            {slides.map((slide, index) => (
              <View
                key={slide.id}
                style={[styles.dot, index === activeIndex ? styles.dotActive : null]}
              />
            ))}
          </View>
          <Button label="Get Started" onPress={onComplete} style={styles.cta} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  container: {
    flex: 1,
  },
  slide: {
    flex: 1,
  },
  slideBackground: {
    flex: 1,
  },
  slideImage: {
    opacity: 0.35,
  },
  slideOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
    gap: Spacing.sm,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.dark.text,
  },
  description: {
    fontSize: 15,
    color: Colors.dark.icon,
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    gap: Spacing.md,
    backgroundColor: Colors.dark.background,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4b5563',
  },
  dotActive: {
    backgroundColor: Colors.dark.text,
  },
  cta: {
    width: '100%',
  },
});
